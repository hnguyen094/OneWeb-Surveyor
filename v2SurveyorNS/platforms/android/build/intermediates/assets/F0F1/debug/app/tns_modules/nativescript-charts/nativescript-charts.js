"use strict";
var nativescript_charts_common_1 = require("./nativescript-charts.common");
var NativescriptCharts = (function (_super) {
    __extends(NativescriptCharts, _super);
    function NativescriptCharts() {
        var _this = _super.call(this) || this;
        if (typeof (com.github.mikephil.charting) === "undefined") {
            console.log("error");
        }
        else {
            console.log("OK");
        }
        return _this;
    }
    return NativescriptCharts;
}(nativescript_charts_common_1.Common));
exports.NativescriptCharts = NativescriptCharts;
