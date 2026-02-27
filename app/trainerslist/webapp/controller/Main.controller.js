sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.Main", {
        onInit() {
        },

        onPressItem: function (oEvent) {
            debugger;
            let oContext = oEvent.getSource().getSelectedItems()[0].getBindingContext(),
                oItem = oContext.getObject(),
                oRouter = this.getRouter();

            oRouter.navTo("RouteTeams", { trainerId: oItem.ID });
        }


    });
});