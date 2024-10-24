sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("ZQ_SAMPLE_REG_LOC.controller.location", {
		onAfterRendering: function () {
			this.getView().byId("inp_scan").addEventDelegate({
				onAfterRendering: function () {
					this.getView().byId("inp_scan").focus();
				}.bind(this)
			});

		},

		onScanSubmit: function (oEvent) {
			var oDataNew = {};
			oDataNew.Barcode = oEvent.getSource().getValue();

			var oScanInput = this.getView().byId("inp_scan");
			oScanInput.setValue("");

			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQ_SAMPLE_REG_LOC_SRV/");
			this.getView().setModel(oModel);

			oModel.read("/SampleSet(Barcode='" + "ZQLOC" + oDataNew.Barcode + "',Location='null')", {
				success: this.scanSuccess.bind(this),
				error: this.reportErrors.bind(this)
			});
		},

		scanSuccess: function (oData, oResponse) {
			var audio = new Audio('din_loud.png');
			audio.play();
			var loRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var doc = oData.Location.includes("_D");
			//if (oData.Location === "FBOX1_DOC") {
			if (doc === true) {
				loRouter.navTo("document", {
					value: oData.Barcode
				});
			} else {
				loRouter.navTo("sample", {
					value: oData.Barcode
				});
			}
		},

		reportErrors: function (oError) {
			var message = JSON.parse(oError.responseText).error.message.value;
			alert(message);
			var oScanInput = this.getView().byId("inp_scan");
			oScanInput.focus();
		},

	});
});