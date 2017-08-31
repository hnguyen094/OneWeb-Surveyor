"use strict";
var legend_1 = require("../components/legend");
exports.LegendHorizontalAlignment = legend_1.LegendHorizontalAlignment;
exports.LegendVerticalAlignment = legend_1.LegendVerticalAlignment;
exports.LegendForm = legend_1.LegendForm;
var axes_1 = require("../components/axes");
exports.XPosition = axes_1.XPosition;
exports.YPosition = axes_1.YPosition;
var helper_1 = require("../helper");
var view_1 = require("ui/core/view");
var proxy_1 = require("ui/core/proxy");
var dependency_observable_1 = require("ui/core/dependency-observable");
var chartSettingsProperty = new dependency_observable_1.Property("settings", "LineChart", new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.None));
var chartDataProperty = new dependency_observable_1.Property("data", "LineChart", new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.None));
var ArrayList = java.util.ArrayList;
var LineChartCommon = (function (_super) {
    __extends(LineChartCommon, _super);
    function LineChartCommon(lineChartArgs) {
        var _this = _super.call(this) || this;
        _this.lineChartArgs = lineChartArgs;
        return _this;
    }
    Object.defineProperty(LineChartCommon.prototype, "chartSettings", {
        get: function () {
            return this._getValue(LineChartCommon.chartSettingsProperty);
        },
        set: function (value) {
            this._setValue(LineChartCommon.chartSettingsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineChartCommon.prototype, "chartData", {
        get: function () {
            return this._getValue(LineChartCommon.chartDataProperty);
        },
        set: function (value) {
            this._setValue(LineChartCommon.chartDataProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    LineChartCommon.prototype.resolveColor = function (color) {
        return helper_1.resolveColor(color);
    };
    LineChartCommon.prototype.setDataset = function (dataset, lineData) {
        dataset.setColor(helper_1.resolveColor(lineData.color));
        if ('valueTextColor' in lineData) {
            dataset.setValueTextColor(helper_1.resolveColor(lineData.valueTextColor));
        }
        if ('valueTextColors' in lineData) {
            var colors = new ArrayList();
            lineData.valueTextColors.forEach(function (item) {
                colors.add(new java.lang.Integer(helper_1.resolveColor(item)));
            });
            dataset.setValueTextColors(colors);
            colors = null;
        }
        if ('valueTextSize' in lineData) {
            if (lineData.valueTextSize > 0)
                dataset.setValueTextSize(lineData.valueTextSize);
        }
        if ('drawValues' in lineData) {
            if (typeof lineData.drawValues == "boolean")
                dataset.setDrawValues(lineData.drawValues);
        }
        if ('highlightEnabled' in lineData) {
            if (typeof lineData.highlightEnabled == "boolean")
                dataset.setHighlightEnabled(lineData.highlightEnabled);
        }
        if ('drawVerticalHighlightIndicator' in lineData) {
            if (typeof lineData.drawVerticalHighlightIndicator == "boolean")
                dataset.setDrawVerticalHighlightIndicator(lineData.drawVerticalHighlightIndicator);
        }
        if ('drawHorizontalHighlightIndicator' in lineData) {
            if (typeof lineData.drawHorizontalHighlightIndicator == "boolean")
                dataset.setDrawHorizontalHighlightIndicator(lineData.drawHorizontalHighlightIndicator);
        }
        if ('highLightColor' in lineData) {
            dataset.setHighLightColor(helper_1.resolveColor(lineData.highLightColor));
        }
        if ('drawHighlightIndicators' in lineData) {
            if (typeof lineData.drawHighlightIndicators == "boolean")
                dataset.setDrawHighlightIndicators(lineData.drawHighlightIndicators);
        }
        if ('highlightLineWidth' in lineData) {
            if (lineData.highlightLineWidth > 0)
                dataset.setHighlightLineWidth(lineData.highlightLineWidth);
        }
        if ('fillColor' in lineData) {
            dataset.setFillColor(helper_1.resolveColor(lineData.fillColor));
        }
        if ('fillAlpha' in lineData) {
            if (lineData.fillAlpha <= 255 && lineData.fillAlpha >= 0) {
                dataset.setFillAlpha(lineData.fillAlpha);
            }
        }
        if ('drawFilled' in lineData) {
            if (typeof lineData.drawFilled == "boolean")
                dataset.setDrawFilled(lineData.drawFilled);
        }
        if ('lineWidth' in lineData) {
            if (lineData.lineWidth > 0)
                dataset.setLineWidth(lineData.lineWidth);
        }
        if ('circleRadius' in lineData) {
            if (lineData.circleRadius > 0)
                dataset.setCircleRadius(lineData.circleRadius);
        }
        if ('circleColor' in lineData) {
            dataset.setCircleColor(helper_1.resolveColor(lineData.circleColor));
        }
        if ('circleColorHole' in lineData) {
            dataset.setCircleColorHole(helper_1.resolveColor(lineData.circleColorHole));
        }
        if ('drawCircleHole' in lineData) {
            if (typeof lineData.drawCircleHole == "boolean")
                dataset.setDrawCircleHole(lineData.drawCircleHole);
        }
        if ('enableDashedLine' in lineData) {
            if (lineData.enableDashedLine.lineLength > 0 && lineData.enableDashedLine.spaceLength > 0 && lineData.enableDashedLine.phase > 0)
                dataset.enableDashedLine(lineData.enableDashedLine.lineLength, lineData.enableDashedLine.spaceLength, lineData.enableDashedLine.phase);
        }
    };
    return LineChartCommon;
}(view_1.View));
LineChartCommon.chartSettingsProperty = chartSettingsProperty;
LineChartCommon.chartDataProperty = chartDataProperty;
exports.LineChartCommon = LineChartCommon;
