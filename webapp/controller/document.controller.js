sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("ZQ_SAMPLE_REG_LOC.controller.document", {

		onInit: function() {
			this.setInitialFocus(this.byId("inp_scan"));
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
			this.getView().byId("txt_aufnr").setText("");
			this.getView().byId("txt_matnr").setText("");
			this.getView().byId("txt_mat_txt").setText("");
			this.getView().byId("txt_date").setText("");
			this.getView().byId("txt_time").setText("");
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
			var location = sPageURL.split("Loc_Doc=");
			var loc = location[1];
			oModel.read("/SampleSet(Barcode='" + "ZQDOC" + oDataNew.Barcode + "',Location='" + loc + "')", {
				success: this.scanSuccess.bind(this),
				error: this.reportErrors.bind(this)
			});
		},

		scanSuccess: function(oData, oResponse) {
			var audio = new Audio('din_loud.png');
			audio.play();
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var message = oResourceBundle.getText("success_doc");
			sap.m.MessageToast.show(message, {
				duration: 2000,
				at: "center center"
			});
			this.getView().byId("txt_aufnr").setText(oData.Barcode);
			this.getView().byId("txt_matnr").setText(oData.Matnr);
			this.getView().byId("txt_mat_txt").setText(oData.MatTxt);
			this.getView().byId("txt_date").setText(oData.RegDate);
			this.getView().byId("txt_time").setText(oData.RegTime);
			this.setInputFocus();
		},

		reportErrors: function(oError) {
			var message = JSON.parse(oError.responseText).error.message.value;
			alert(message);
			this.setInputFocus();
		},

	});

});