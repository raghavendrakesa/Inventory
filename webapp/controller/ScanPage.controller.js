sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/model/Filter",
        "sap/ndc/BarcodeScanner"
    ],
    function(BaseController, History, Filter, BarcodeScanner) {
      "use strict";
      var oController;
      return BaseController.extend("com.inventory.inventory.controller.ScanPage", {
        onInit() {
          oController  = this;
          this.router = sap.ui.core.UIComponent.getRouterFor(this);
          this.router.attachRoutePatternMatched(this.handleRoutematched, this);   
          var oModel = new sap.ui.model.json.JSONModel({});
          this.getView().setModel(oModel,"oScanPageModel");
        },
        handleRoutematched:function(oEvent){
            var oParams = oEvent.getParameters();
            var sName = oParams.name;
            var oScanPageModel = this.getView().getModel("oScanPageModel");
            var oGlobalModel = this.getView().getModel("globalModel");
            var oData = oGlobalModel.getProperty("/AssetListSet");
            var selectSite = oGlobalModel.getProperty("/siteCampusSelectedKey");
            var selectBuilding =  oGlobalModel.getProperty("/buildingSelectedKey");
            var sRoomValue  = oGlobalModel.getProperty("/roomvalue");
              oScanPageModel.setProperty("/scanedTags", $.extend(true, [], oData));  
            var oScanList = this.getView().byId("scanTgListId");
            var oBinding = oScanList.getBinding("items");
            var aFilter = [], fSiteCampus, fBuilding, fRoom;
            if(selectSite && selectSite !== ""){
                fSiteCampus = new Filter('siteCampus', "Contains", selectSite);
                aFilter.push(fSiteCampus);
            }
            if(selectBuilding && selectBuilding !== ""){
              fBuilding =  new Filter('building', "Contains",  selectBuilding);
              aFilter.push(fBuilding);
            }

            if(sRoomValue && sRoomValue !== ""){
              fRoom =  new Filter('room', "Contains",  sRoomValue);
              aFilter.push(fRoom);
            }
           
      
           var filnalFilter =  new Filter({ filters:aFilter, and:false});
             if(sName === "ScanPage"){
                oBinding.filter(filnalFilter);
            }
        },
        onNextPress:function(oEvent){
          this.router.navTo("UnScanPage",{}, true);          
        },
        onDeletepress:function(oEvent){
            var oSrc = oEvent.getSource();
            var oScanPageModel = this.getView().getModel("oScanPageModel");
            var sPath = oEvent.getSource().getBindingContext("oScanPageModel").getPath();
            var Idx = sPath.split("/")[2];
            oScanPageModel.getProperty("/scanedTags").splice(Idx,1);
            oScanPageModel.updateBindings(false);

        },
        onSubmitBarCode:function(){
            var oGlobalModel = this.getView().getModel("globalModel");
            var oScanPageModel = this.getView().getModel("oScanPageModel");
            var sValue = oGlobalModel.getProperty("/scanTag");
            var aScanedItems = oScanPageModel.getProperty("/scanedTags");
            var oObject = {
              "asset":"",
              "class":"Chem Lab - 1",
              "lastInventory":"10-09-2021",
              "description":"Equipment Description",
              "assetDescline1":"Beaker_1",
              "assetDescline2":"Round Bottom",
              "assetDescline3":"1000 ML",
              "serial":"",
              "manufacturer":"Simen Science",
              "vendor":"Skyline Labs",
              "location":"",
              "tag":"",
              "siteCampus":oGlobalModel.getProperty("/siteCampusSelectedKey"),
              "building": oGlobalModel.getProperty("/buildingSelectedKey"),
              "room": oGlobalModel.getProperty("/room"),
              "financial":"",
              "netBookingValue":"$3,463",
              "acquisitionValue":"$13,463",
              "captalizedOn":"10-09-2011",
              "po":""
            };
            if(sValue && sValue.length > 0){
                oObject.tag = sValue;
               aScanedItems.unshift(oObject);
               oScanPageModel.updateBindings(false);
               oGlobalModel.setProperty("/scanTag","");

            }
        },
     
        onScanSuccessOne:function(oEvent){
          var resultNum = 0, zebraPhysicalScanNum = 0;
          var oGlobalModel = this.getView().getModel("globalModel");

          if (oEvent.getParameter("cancelled")) {
            MessageToast.show("Scan cancelled", { duration:1000 });
          } else {
            if (oEvent.getParameter("text") !== undefined && oEvent.getParameter("text") !== null) {
             
              oGlobalModel.setProperty("/scanTag", oEvent.getParameter("text"));
              oController.onSubmitBarCode();
            } else {
              oGlobalModel.setProperty("/scanTag", "");
            }
          }

        }
      
      });
    }
  );
  