sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], (Controller, History) => {
    "use strict";

    return Controller.extend("com.nbx.trainerslist.controller.BaseController", {

        setModel: function (oModel, sName){
            return this.getView().setModel(oModel, sName);
        },

        getModel: function (sName){
            return this.getView().getModel(sName);
        },

        getResourceBundle: function(){
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getRouter: function(){
            return this.getOwnerComponent().getRouter();
        },

        onNavBack: function(){
            var sPreviousHash = History.getInstance().getPreviousHash();

            if(sPreviousHash !== undefined){
                history.go(-1);
            } else {
                this.getRouter().navTo("RouteMain", {}, true);
            }
        }

    });
});