sap.ui.define([
    "sap/ui/core/UIComponent",
    "./model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
], (UIComponent, models, JSONModel, Filter) => {
    "use strict";

    return UIComponent.extend("com.nbx.trainerlist.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            const oAppViewModel = new sap.ui.model.json.JSONModel({
                layout: "OneColumn"
            });
            this.setModel(oAppViewModel, "appView");
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            this._loadUserPermissions();
        },

        _loadUserPermissions: function () {
            let oModel = this.getModel(),
                oPermissionsModel = this.getModel("permissions"),
                oContextBinding = oModel.bindContext("/getUserPermissions(...)");


            oContextBinding.execute().then(() => {
                let oRawData = oContextBinding.getBoundContext().getObject(),
                    oData = { //flatten the data because of the email, if not oData.rol doesn't exist like that
                        ...oRawData.permissions,
                        email: oRawData.email
                    };
                oPermissionsModel.setData(oData);

                if (oData.rol === "Trainer") {
                    let oListBinding = oModel.bindList("/Trainers");
                    oListBinding.filter(new Filter("Email", "EQ", oData.email));

                    oListBinding.requestContexts(0, 1).then((aContexts) => {
                        this.getRouter().initialize();
                        if (aContexts.length > 0) {
                            let sTrainerId = aContexts[0].getProperty("ID");
                            this.getRouter().navTo("RouteTeams", { trainerId: sTrainerId });
                            this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                        } else {
                            console.error("No se ha encontrado ningún entrenador con el email:", oData.email);
                        }
                    });
                } else {
                    //manager or viewer
                    this.getRouter().initialize();
                }

            }).catch((oError) => {
                console.error("Error al cargar los permisos:", oError.message);
                oPermissionsModel.setData({ view: true, edit: false, admin: false, capture: false });
                this.getRouter().initialize();
            });
        }
    });
});