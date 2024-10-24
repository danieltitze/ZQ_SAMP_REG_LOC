sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	return Controller.extend("ZQ_SAMPLE_REG_LOC.controller.sample", {
		onAfterRendering: function() {
			this.setTitle();
		},

		onInit: function() {
			this.setInitialFocus(this.byId("inp_scan"));
			//this.byID("inp_scan").sip.hide();
			//this.sip.hide();

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function(evt) {
			//Check whether is the detail page is matched.
			if (evt.getParameter("name") !== "sample") {
				return;
			}
			this.setTitle();
		},

		setTitle: function() {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQ_SAMPLE_REG_LOC_SRV/");
			this.getView().setModel(oModel);

			var sPageURL = window.location.href;
			var location = sPageURL.split("ZQLOC");
			var loc = location[1];

			oModel.read("/SampleSet(Barcode='" + "ZQDES" + "',Location='" + loc + "')", {
				success: this.titleSuccess.bind(this)
			});
		},

		titleSuccess: function(oData, oResponse) {
			this.getView().byId("pageSample").setTitle(oData.Barcode);
		},

		setInitialFocus: function(control) {
			this.getView().addEventDelegate({
				onAfterShow: function() {
					setTimeout(function() {
						control.focus();
					}.bind(this), 0);
				}
			}, this);
		},

		setInputFocus: function() {
			var oScanInput = this.getView().byId("inp_scan");
			oScanInput.setValue("");
			oScanInput.focus();
		},
		onNavBack: function() {
			this.getView().byId("txt_matnr").setText("");
			this.getView().byId("txt_mat_txt").setText("");
			this.getView().byId("charg").setText("");
			this.getView().byId("txt_num").setText("");
			this.getView().byId("txt_date").setText("");
			this.getView().byId("txt_time").setText("");
			this.getView().byId("txt_prueflos").setText("");
			this.getView().byId("inp_scan").setValue("");
			var loRouter = sap.ui.core.UIComponent.getRouterFor(this);
			loRouter.navTo("location");
		},
		onScanSubmit: function(oEvent) {
			var oDataNew = {};
			oDataNew.Barcode = oEvent.getSource().getValue();
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQ_SAMPLE_REG_LOC_SRV/");
			this.getView().setModel(oModel);
			var sPageURL = window.location.href;
			var location = sPageURL.split(";");
			var loc = location[1];
			oModel.read("/SampleSet(Barcode='" + "ZQSAM" + oDataNew.Barcode + "',Location='" + loc + "')", {
				success: this.scanSuccess.bind(this),
				error: this.reportErrors.bind(this)
			});
		},
		scanSuccess: function(oData, oResponse) {
			var message;
			var audio = new Audio('din_loud.png');
			audio.play();
			var takenOut = oData.TakenOut;
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if ( takenOut === true) {
				message = oResourceBundle.getText("success_takeout");
			} else {
				message = oResourceBundle.getText("success_sam");
			}
			
			sap.m.MessageToast.show(message, {
				duration: 2000,
				at: "center center"
			});
			this.getView().byId("txt_matnr").setText(oData.Matnr);
			this.getView().byId("txt_mat_txt").setText(oData.MatTxt);
			this.getView().byId("charg").setText(oData.Charg);
			if (oData.Num === "") {
				this.getView().byId("txt_num").setText(oData.Phynr);
			}	
			else{
				this.getView().byId("txt_num").setText(oData.Num);
			}			
			
			this.getView().byId("txt_date").setText(oData.RegDate);
			this.getView().byId("txt_time").setText(oData.RegTime);
			this.getView().byId("txt_prueflos").setText(oData.Prueflos);
			this.setInputFocus();
		},
		reportErrors: function(oError) {
			var message = JSON.parse(oError.responseText).error.message.value;
			alert(message);
			this.setInputFocus();
		},

	});
});