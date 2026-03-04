sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], (BaseController, JSONModel, MessageToast, MessageBox, Fragment) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.Detail", {
        onInit() {
            var oRouter = this.getRouter();
            oRouter.getRoute("RouteTeams").attachMatched(this.onRouteMatched, this);

            let oRandomPokemonModel = new JSONModel({});
            this.getView().setModel(oRandomPokemonModel, "randomPokemon");
            //debugger;
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
                MessageBox.error("Failed to find a pokemon: " + oError.message);
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
                MessageBox.warning("A team needs to be selected.");
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
                MessageToast.show("Pokemon captured successfully.");
                if (this._catchDialog) {
                    this._catchDialog.close();
                }

            }).catch((oError) => {
                MessageBox.error("Error capturing the pokemon: " + oError.message);
            });
        }
    });
});