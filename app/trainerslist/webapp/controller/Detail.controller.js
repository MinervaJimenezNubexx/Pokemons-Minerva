sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "../util/constants"
], (BaseController, JSONModel, MessageToast, MessageBox, Fragment, Constants) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.Detail", {
        onInit() {
            var oRouter = this.getRouter();
            oRouter.getRoute("RouteTeams").attachMatched(this.onRouteMatched, this);

            this._o18n = this.getResourceBundle();

            //Local model for capturing random pokemons
            let oRandomPokemonModel = new JSONModel({});
            this.getView().setModel(oRandomPokemonModel, "randomPokemon");
            //debugger;

            //local model for creating new team
            let oTeamModel = new JSONModel({
                Name: "",
                Description: "",
                Active: false //inactive by default
            });

            this.getView().setModel(oTeamModel, "newTeam");
        },

        onRouteMatched: function (oEvent) {
            debugger;
            this._sTrainerId = oEvent.getParameter("arguments").trainerId;

            this.getView().bindElement({
                path: "/Trainers('" + this._sTrainerId + "')",
                parameters: {
                    $expand: "Teams"
                }
            });
        },

        //NAVIGATION TO CAPTURES

        onPressItem: function (oEvent) {
            let oItem = oEvent.getParameter("listItem"),
                oContext = oItem.getBindingContext(),
                sTeamID = oContext.getProperty("ID"),
                sTrainerID = this._sTrainerId,
                oRouter = this.getRouter();

            oRouter.navTo("RouteCaptures", {
                trainerId: sTrainerID,
                teamId: sTeamID
            });
        },

        // CAPTURE RANDOM POKEMONS

        onSearchRandomPokemon: function () {
            let oModel = this.getView().getModel(),
                oFunction = oModel.bindContext("/getRandomPokemon(...)");

            sap.ui.core.BusyIndicator.show(0);

            oFunction.execute().then(() => {
                sap.ui.core.BusyIndicator.hide();
                let oPokemonData = oFunction.getBoundContext().getObject();
                this.getView().getModel("randomPokemon").setData(oPokemonData);

                if (!this._catchDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.nbx.trainerslist.view.fragment.catchPokemonDialog",
                        controller: this
                    }).then(function (oDialog) {
                        this._catchDialog = oDialog;
                        this.getView().addDependent(this._catchDialog);
                        this._catchDialog.open();
                    }.bind(this));
                } else {
                    this._catchDialog.open();
                }

            }).catch((oError) => {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error(this._o18n.getText('findRandomPokemonError') + ' ' + oError.message);
            });
        },

        onCancelCapture: function () {
            if (this._catchDialog) {
                this._catchDialog.close();
            }
        },

        onCapturePokemon: function () {
            let oSelect = this.byId("teamSelector"),
                sSelectedTeamId = oSelect.getSelectedKey();

            if (!sSelectedTeamId) {
                MessageBox.warning(this._o18n.getText('noTeamSelectedWarning'));
                return;
            }

            let sPokemonId = this.getView().getModel("randomPokemon").getProperty("/ID"),
                oModel = this.getView().getModel();

            let sActionPath = "/Teams(" + sSelectedTeamId + ")/CapService.addCapture(...)",
                oAction = oModel.bindContext(sActionPath);

            oAction.setParameter("pokemonId", sPokemonId);

            sap.ui.core.BusyIndicator.show(0);

            oAction.execute().then(() => {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show(this._o18n.getText('MessagePokmnCaptured'));
                if (this._catchDialog) {
                    this._catchDialog.close();
                }

                oModel.refresh();
                //constants.var1;
            }).catch((oError) => {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error(this._o18n.getText('MessageErrorPokmnCaptured') + oError.message);
            });
        },

        //CREATE NEW TEAM

        onOpenAddTeamDialog: function () {
            this.getView().getModel("newTeam").setData({
                Name: "",
                Description: "",
                Active: false
            });

            if (!this._addTeamDialog) {
                sap.ui.core.Fragment.load({
                    id: this.getView().getId(),
                    name: "com.nbx.trainerslist.view.fragment.addTeamDialogUser",
                    controller: this
                }).then(function (oDialog) {
                    this._addTeamDialog = oDialog;
                    this.getView().addDependent(this._addTeamDialog);
                    this._addTeamDialog.open();
                }.bind(this));
            } else {
                this._addTeamDialog.open();
            }


        },

        onCloseTeamDialog: function () {
            if (this._addTeamDialog) {
                this._addTeamDialog.close();
            }
        },

        onSaveTeam: function () {
            let oModel = this.getView().getModel(),
                oData = this.getView().getModel("newTeam").getData();

            if (!oData.Name || !oData.Description) {
                MessageBox.warning(this._o18n.getText('FillAllRequiredUserTeam'));
                return;
            }

            let sTrainerId = this._sTrainerId,
                sPath = "/Trainers('" + sTrainerId + "')/Teams",
                oListBinding = oModel.bindList(sPath);

            let oContext = oListBinding.create({
                Name: oData.Name,
                Description: oData.Description,
                Active: oData.Active
            });

            oContext.created().then(() => {
                MessageToast.show(this._o18n.getText('TeamAddedUser'));
                if (this._addTeamDialog) {
                    this._addTeamDialog.close();
                }
                this.getView().getBindingContext().refresh();
            }).catch((oError) => {
                MessageBox.error(this._o18n.getText('TeamAddedErrorUser') + ' ' + oError.message);
            });
        }
    });
});