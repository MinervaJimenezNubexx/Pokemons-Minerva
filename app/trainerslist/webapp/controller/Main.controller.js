sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.Main", {
        onInit() {
            let oViewModel = new JSONModel({
                firstName: "",
                lastName: "",
                Email: "",
                BirthDate: null
            });
            this.getView().setModel(oViewModel, "newTrainer");
        },

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
                MessageBox.warning("Please fill all the required fields.");
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
                MessageToast.show("Trainer added successfully!");
                this.onCloseWizard();
            }).catch((oError) => {
                MessageBox.error("Error creating Trainer: " + oError.message);
            });
        },

        onPressItem: function (oEvent) {

            let oContext = oEvent.getSource().getSelectedItems()[0].getBindingContext(),
                oItem = oContext.getObject(),
                oRouter = this.getRouter();

            //debugger;
            oRouter.navTo("RouteTeams", { trainerId: oItem.ID });
        }
    });
});