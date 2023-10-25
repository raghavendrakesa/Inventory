sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/model/Filter"
    ],
    function(BaseController, History, Filter) {
      "use strict";
  
      return BaseController.extend("com.inventory.inventory.controller.UnScanPage", {
        onInit() {
          var router = sap.ui.core.UIComponent.getRouterFor(this);
          router.attachRoutePatternMatched(this.handleRoutematched, this);   
          var oModel = new sap.ui.model.json.JSONModel({});
          this.getView().setModel(oModel,"oScanPageModel");
        },
        onListPress:function(oEvent){
          var oSrc = oEvent.getSource();
          var oObject = oSrc.getBindingContext("globalModel").getObject();
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteAssetDetail", {
              sTag: oObject.tag
          });
        },
        handleRoutematched:function(oEvent){
            var oParams = oEvent.getParameters();
            var sName = oParams.name;
            var oScanPageModel = this.getView().getModel("oScanPageModel");
            var oGlobalModel = this.getView().getModel("globalModel");
            var oData = oGlobalModel.getProperty("/AssetListSet");
          
        },
        onNextPress:function(){
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("OverviewInventory", {} );
        }
      });
    }
  );
  