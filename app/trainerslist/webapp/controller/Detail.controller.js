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
        }
    });
});