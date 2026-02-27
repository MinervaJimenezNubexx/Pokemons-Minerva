sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("com.nbx.trainerslist.controller.App", {
        onInit() {
            let oViewModel = new JSONModel({
                busy: true,
                delay: 0,
                layout: "oneColumn",
                previousLayout: "",
                actionButtonsInfo: {
                    midColumn: {
                        fullscreen: false
                    },
                    endColumn: {
                        fullscreen: false
                    }
                }
            });
            this.setModel(oViewModel, "appView");
        }
    });
});