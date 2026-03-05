sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.Main", {
        onInit() {
            this._o18n = this.getResourceBundle();

            //local model to add a new trainer
            let oViewModel = new JSONModel({
                firstName: "",
                lastName: "",
                Email: "",
                BirthDate: null
            });

            this.getView().setModel(oViewModel, "newTrainer");

            //local model to add a new team for a trainer
            let oTeamModel = new JSONModel({
                Name: "",
                Description: "",
                Active: false //inactive by default
            });

            this.getView().setModel(oTeamModel, "newTeam");
        },

        //CREATING NEW TRAINER

        onAddDocument: function (oEvent) {
            this.getView().getModel("newTrainer").setData({
                firstName: "",
                lastName: "",
                Email: "",
                BirthDate: null
            });

            if (!this._addTrainerDialog) {
                sap.ui.core.Fragment.load({
                    id: this.getView().getId(),
                    name: "com.nbx.trainerslist.view.fragment.addTrainerDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._addTrainerDialog = oDialog;
                    this.getView().addDependent(this._addTrainerDialog);
                    this._addTrainerDialog.open();
                }.bind(this));
            } else {
                this._addTrainerDialog.open();
            }
        },

        onCloseWizard: function () {
            if (this._addTrainerDialog) {
                this._addTrainerDialog.close();
            }
        },

        onSaveTrainer: function () {
            let oModel = this.getView().getModel(); 
            let oData = this.getView().getModel("newTrainer").getData();

            if (!oData.firstName || !oData.lastName || !oData.Email || !oData.BirthDate) {
                MessageBox.warning(this._o18n.getText('FillAllRequiredTrainer'));
                return;
            }

            let oListBinding = oModel.bindList("/Trainers");
            
            let oContext = oListBinding.create({
                firstName: oData.firstName,
                lastName: oData.lastName,
                Email: oData.Email,
                BirthDate: oData.BirthDate
            });

            oContext.created().then(() => {
                MessageToast.show(this._o18n.getText('TrainerAdded'));
                this.onCloseWizard();
            }).catch((oError) => {
                MessageBox.error(this._o18n.getText('TrainerAddedError') + ' ' + oError.message);
            });
        },

        //NAVIGATION TO DETAIL VIEW

        onPressItem: function (oEvent) {

            let oContext = oEvent.getSource().getSelectedItems()[0].getBindingContext(),
                oItem = oContext.getObject(),
                oRouter = this.getRouter();

            //debugger;
            oRouter.navTo("RouteTeams", { trainerId: oItem.ID });
        },

        //CREATING NEW TEAM FOR A TRAINER

        onOpenAddTeamDialog: function () {
            this.getView().getModel("newTeam").setData({
                Name: "",
                Description: "",
                Active: false
            });

            if (!this._addTeamDialog) {
                sap.ui.core.Fragment.load({
                    id: this.getView().getId(),
                    name: "com.nbx.trainerslist.view.fragment.addTeamDialog",
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
                oData = this.getView().getModel("newTeam").getData(),
                sTrainerId = this.byId("trainerSelectorAdmin").getSelectedKey();

            if(!oData.Name || !oData.Description){
                MessageBox.warning(this._o18n.getText('FillAllRequiredTeam'));
                return;
            }
            if (!sTrainerId) {
                MessageBox.warning(this._o18n.getText('SelectTrainer'));
                return;
            }

            let sPath = "/Trainers('" + sTrainerId + "')/Teams",
                oListBinding = oModel.bindList(sPath);

            let oContext = oListBinding.create({
                Name: oData.Name,
                Description: oData.Description,
                Active: oData.Active
            });

            oContext.created().then(() => {
                MessageToast.show(this._o18n.getText('TeamAdded'));
                if (this._addTeamDialog) {
                this._addTeamDialog.close();
                }

                oModel.refresh();
            }).catch((oError) => {
                MessageBox.error(this._o18n.getText('TeamAddedError') + ' ' + oError.message);
            });
        }
    });
});