sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History"
], (BaseController, History) => {
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

            let oPermissionsModel = this.getView().getModel("permissions");
            if (oPermissionsModel) {
                let sRol = oPermissionsModel.getProperty("/rol");

                if (sRol === "Trainer") {
                    this.getView().getModel("appView").setProperty("/layout", "EndColumnFullScreen");
                } else {
                    this.getView().getModel("appView").setProperty("/layout", "ThreeColumnsEndExpanded");
                }
            }

            this.getView().bindElement({
                path: "/Trainers('" + sTrainerId + "')/Teams('" + sTeamId + "')",
                parameters: {
                    $expand: "Captures"
                }
            });
        },

        onCloseCaptures: function () {
            let oHistory = History.getInstance(),
                sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteTeams", {
                    trainerId: this.sTrainerId
                }, true);
            }
        }

    });
});