sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.Captures", {
        onInit() {
            var oRouter = this.getRouter();
            oRouter.getRoute("RouteCaptures").attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
            let oArgs = oEvent.getParameter("arguments"),
                sTrainerId = oArgs.trainerId,
                sTeamId = oArgs.teamId;

            this.getView().bindElement({
                path: "/Trainers('" + sTrainerId + "')/Teams('" + sTeamId + "')",
                parameters: {
                    $expand: "Captures"
                }
            });
        }
    });
});