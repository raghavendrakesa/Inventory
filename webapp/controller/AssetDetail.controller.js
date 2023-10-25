sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.inventory.inventory.controller.AssetDetail", {
            onInit: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                router.attachRoutePatternMatched(this.handleRoutematched, this);  
                var oModel = new sap.ui.model.json.JSONModel({});
                this.getView().setModel(oModel,"oDetailModel");
            },
            handleRoutematched:function(oEvent){
                var sTag = oEvent.getParameters().arguments.sTag;
                var oGlobalModel = this.getView().getModel("globalModel");
                var assetData = oGlobalModel.getProperty("/AssetListSet");
                var oLocalModel = this.getView().getModel("oDetailModel");
                var oArray = [];
                for(var i=0; i < assetData.length; i++){
                    if(assetData[i].tag === sTag){
                        oArray.push(assetData[i]);
                        break;
                    }
                }
                oLocalModel.setProperty("/tagDetails", oArray);

            },
            onPressSave:function(){
                var that = this;
                MessageBox.confirm("Items changed will be saved. Would you like to inventory this asset as well",{
                actions: ["Save & Inventory", MessageBox.Action.CLOSE],
                emphasizedAction:"Save & Inventory",
                onClose: function (sAction) {
                    if(sAction === "Save & Inventory"){
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("UnScanPage", {} );
                    }
					
				}});
                
            }
        });
    });
