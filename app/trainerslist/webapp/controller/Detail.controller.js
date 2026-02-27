sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.Detail", {
        onInit() {
            var oRouter = this.getRouter();
            oRouter.getRoute("RouteTeams").attachMatched(this.onRouteMatched, this);

            //debugger;
        },

        onRouteMatched: function (oEvent) {
            let oParams = oEvent.getParameter("arguments"),
                oDataModel = this.getModel(),
                sPath = oDataModel.createKey("Trainers", { "trainerId": oParams.ID });

            this.getView().bindElement({
                path: "/" + sPath,
                parameters: {
                    expand: "Teams"
                }
            });
        },

        onPressTeam: function (oEvent) {
            let oItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject(),
                oRouter = this.getRouter(),
                sTrainerID = oItem.TeamTrainer_ID,
                sTeamID = oItem.ID;

            oRouter.navTo("RouteCaptures", {
                trainerId: sTrainerID,
                teamId: sTeamID
            });
        }
    });
});