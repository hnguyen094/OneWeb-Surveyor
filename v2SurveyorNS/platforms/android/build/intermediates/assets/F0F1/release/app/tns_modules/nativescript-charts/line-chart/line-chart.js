"use strict";
var line_chart_common_1 = require("./line-chart.common");
exports.LegendForm = line_chart_common_1.LegendForm;
exports.LegendHorizontalAlignment = line_chart_common_1.LegendHorizontalAlignment;
exports.LegendVerticalAlignment = line_chart_common_1.LegendVerticalAlignment;
exports.XPosition = line_chart_common_1.XPosition;
exports.YPosition = line_chart_common_1.YPosition;
var helper_1 = require("../helper");
var LineDataSet = com.github.mikephil.charting.data.LineDataSet;
var LineData = com.github.mikephil.charting.data.LineData;
var Entry = com.github.mikephil.charting.data.Entry;
var ArrayList = java.util.ArrayList;
var Legend = com.github.mikephil.charting.components.Legend;
var YAxisPosition = com.github.mikephil.charting.components.YAxis.YAxisLabelPosition;
var XAxisPosition = com.github.mikephil.charting.components.XAxis.XAxisPosition;
function onChartSettingsPropertyChanged(data) {
    var LineChart = data.object;
    if (!LineChart.android) {
        return;
    }
    LineChart.setChartSettings(data.newValue);
    console.log("Chart settings changed.");
    ;
}
function onChartDataPropertyChanged(data) {
    var LineChart = data.object;
    if (!LineChart.android) {
        return;
    }
    LineChart.setChartData(data.newValue);
    console.log("Chart settings changed.");
    ;
}
line_chart_common_1.LineChartCommon.chartSettingsProperty.metadata.onSetNativeValue = onChartSettingsPropertyChanged;
line_chart_common_1.LineChartCommon.chartDataProperty.metadata.onSetNativeValue = onChartDataPropertyChanged;
var LineChart = (function (_super) {
    __extends(LineChart, _super);
    function LineChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LineChart.prototype, "android", {
        get: function () { return this._android; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineChart.prototype, "_nativeView", {
        get: function () { return this._android; },
        enumerable: true,
        configurable: true
    });
    LineChart.prototype._createUI = function () {
        this._android = new com.github.mikephil.charting.charts.LineChart(this._context, null);
        this.setChart();
    };
    LineChart.prototype.invalidate = function () {
        this._nativeView.invalidate();
    };
    LineChart.prototype.clear = function () {
        this._nativeView.clear();
        this._nativeView.notifyDataSetChanged();
        this.setChart();
    };
    LineChart.prototype.clearData = function () {
        if (this._nativeView.getData()) {
            this._nativeView.getData().clearValues();
            this._nativeView.notifyDataSetChanged();
            this.invalidate();
        }
    };
    LineChart.prototype.setChartSettings = function (lineChartArgs) {
        this.lineChartArgs = lineChartArgs;
        this.setChart();
        this._nativeView.notifyDataSetChanged();
        this.invalidate();
    };
    LineChart.prototype.addLine = function (lineData) {
        var entries = new ArrayList();
        lineData.lineData.forEach(function (point) {
            entries.add(new Entry(point.x, point.y));
        });
        var dataset = new LineDataSet(entries, lineData.name);
        this.setDataset(dataset, lineData);
        if (this._android.getData() == null || this._android.getData().getDataSetCount() == 0) {
            var lineDatasets = new ArrayList();
            lineDatasets.add(dataset);
            var lineDatas = new LineData(lineDatasets);
            this._android.setData(lineDatas);
        }
        else {
            this._android.getData().addDataSet(dataset);
        }
        this._android.getData().notifyDataChanged();
        this._android.notifyDataSetChanged();
        this.invalidate();
    };
    LineChart.prototype.setChartData = function (chartData) {
        var _this = this;
        if (typeof chartData == "undefined" || chartData == {} || chartData.length == 0)
            return;
        this.setChart();
        var lineDatasets = new ArrayList();
        chartData.forEach(function (lineSerie) {
            var entries = new ArrayList();
            lineSerie.lineData.forEach(function (point) {
                entries.add(new Entry(point.x, point.y));
            });
            var dataset = new LineDataSet(entries, lineSerie.name);
            _this.setDataset(dataset, lineSerie);
            lineDatasets.add(dataset);
        });
        var lineDatas = new LineData(lineDatasets);
        this._android.setData(lineDatas);
        this._android.getData().notifyDataChanged();
        this._android.notifyDataSetChanged();
        this.invalidate();
    };
    LineChart.prototype.getXAxis = function () {
        return this._android.getXAxis();
    };
    LineChart.prototype.getRightYAxis = function () {
        return this._android.getAxisRight();
    };
    LineChart.prototype.getLeftYAxis = function () {
        return this._android.getAxisLeft();
    };
    LineChart.prototype.setChart = function () {
        if (typeof this.lineChartArgs == "undefined") {
            return;
        }
        if ('BaseSettings' in this.lineChartArgs) {
            var chart = this._android;
            var baseSettings = this.lineChartArgs.BaseSettings;
            if ('backgroundColor' in baseSettings) {
                chart.setBackgroundColor(helper_1.resolveColor(baseSettings.backgroundColor));
            }
            if ('enabledDescription' in baseSettings) {
                if (typeof baseSettings.enabledDescription == "boolean")
                    chart.getDescription().setEnabled(baseSettings.enabledDescription);
            }
            if ('description' in baseSettings) {
                if (typeof baseSettings.description == "string")
                    chart.getDescription().setText(baseSettings.description);
            }
            if ('descriptionColor' in baseSettings) {
                chart.getDescription().setTextColor(baseSettings.descriptionColor);
            }
            if ('descriptionPosition' in baseSettings) {
                if (typeof baseSettings.descriptionPosition.x != "undefined" && baseSettings.descriptionPosition.x > 0 &&
                    typeof baseSettings.descriptionPosition.y != "undefined" && baseSettings.descriptionPosition.y > 0)
                    chart.getDescription().setPosition(baseSettings.descriptionPosition.x, baseSettings.descriptionPosition.y);
            }
            if ('descriptionTextSize' in baseSettings) {
                if (baseSettings.descriptionTextSize > 0)
                    chart.getDescription().setTextSize(baseSettings.descriptionTextSize);
            }
            if ('noDataText' in baseSettings) {
                if (typeof baseSettings.noDataText == "string")
                    chart.setNoDataText(baseSettings.noDataText);
            }
            if ('drawGridBackground' in baseSettings) {
                if (typeof baseSettings.drawGridBackground == "boolean")
                    chart.setDrawGridBackground(baseSettings.drawGridBackground);
            }
            if ('gridBackgroundColor' in baseSettings) {
                chart.setGridBackgroundColor(helper_1.resolveColor(baseSettings.gridBackgroundColor));
            }
            if ('drawBorders' in baseSettings) {
                if (typeof baseSettings.drawBorders == "boolean")
                    chart.setDrawBorders(baseSettings.drawBorders);
            }
            if ('borderColor' in baseSettings) {
                chart.setBorderColor(helper_1.resolveColor(baseSettings.borderColor));
            }
            if ('borderWidth' in baseSettings) {
                if (baseSettings.borderWidth > 0)
                    chart.setBorderWidth(baseSettings.borderWidth);
            }
            if ('maxVisibleValueCount' in baseSettings) {
                if (baseSettings.maxVisibleValueCount > 0)
                    chart.setMaxVisibleValueCount(baseSettings.maxVisibleValueCount);
            }
        }
        if ('Legend' in this.lineChartArgs) {
            var legend = this._android.getLegend();
            var legendArgs = this.lineChartArgs.Legend;
            if ('enabled' in legendArgs) {
                if (typeof legendArgs.enabled == "boolean")
                    legend.setEnabled(legendArgs.enabled);
            }
            if ('textColor' in legendArgs) {
                legend.setTextColor(helper_1.resolveColor(legendArgs.textColor));
            }
            if ('wordWrap' in legendArgs) {
                if (typeof legendArgs.wordWrap == "boolean")
                    legend.setWordWrap(legendArgs.wordWrap);
            }
            if ('maxSize' in legendArgs) {
                if (legendArgs.maxSize > 0)
                    legend.setMaxSize(legendArgs.maxSize);
            }
            if ('form' in legendArgs) {
                legend.setForm(Legend.LegendForm.valueOf(legendArgs.form));
            }
        }
        if ('XAxis' in this.lineChartArgs) {
            var xAxisArgs = this.lineChartArgs.XAxis;
            var XAxis = this._android.getXAxis();
            if ('enabled' in xAxisArgs) {
                if (typeof xAxisArgs.enabled == "boolean")
                    XAxis.setEnabled(xAxisArgs.enabled);
            }
            if ('drawLabels' in xAxisArgs) {
                if (typeof xAxisArgs.drawLabels == "boolean")
                    XAxis.setDrawLabels(xAxisArgs.drawLabels);
            }
            if ('drawAxisLine' in xAxisArgs) {
                if (typeof xAxisArgs.drawAxisLine == "boolean")
                    XAxis.setDrawAxisLine(xAxisArgs.drawAxisLine);
            }
            if ('drawGridLines' in xAxisArgs) {
                if (typeof xAxisArgs.drawGridLines == "boolean")
                    XAxis.setDrawGridLines(xAxisArgs.drawGridLines);
            }
            if ('axisMaximum' in xAxisArgs) {
                if (typeof xAxisArgs.axisMaximum == "boolean")
                    XAxis.setAxisMaximum(xAxisArgs.axisMaximum);
            }
            if ('axisMinimum' in xAxisArgs) {
                if (typeof xAxisArgs.axisMinimum == "boolean")
                    XAxis.setAxisMinimum(xAxisArgs.axisMinimum);
            }
            if ('inverted' in xAxisArgs) {
                if (typeof xAxisArgs.inverted == "boolean")
                    XAxis.setInverted(xAxisArgs.inverted);
            }
            if ('showOnlyMinMax' in xAxisArgs) {
                if (typeof xAxisArgs.inverted == "boolean")
                    XAxis.setShowOnlyMinMax(xAxisArgs.showOnlyMinMax);
            }
            if ('labelCount' in xAxisArgs) {
                if (xAxisArgs.labelCount.count > 0 && typeof xAxisArgs.labelCount.count != "undefined" && typeof xAxisArgs.labelCount.force == "boolean")
                    XAxis.setLabelCount(xAxisArgs.labelCount.count, xAxisArgs.labelCount.force);
            }
            if ('granularity' in xAxisArgs) {
                if (xAxisArgs.granularity > 0)
                    XAxis.setGranularity(xAxisArgs.granularity);
            }
            if ('granularityEnabled' in xAxisArgs) {
                if (typeof xAxisArgs.granularityEnabled == "boolean")
                    XAxis.setGranularityEnabled(xAxisArgs.granularityEnabled);
            }
            if ('textColor' in xAxisArgs) {
                XAxis.setTextColor(helper_1.resolveColor(xAxisArgs.textColor));
            }
            if ('textSize' in xAxisArgs) {
                if (xAxisArgs.textSize > 0)
                    XAxis.setTextSize(xAxisArgs.textSize);
            }
            if ('gridColor' in xAxisArgs) {
                XAxis.setGridColor(helper_1.resolveColor(xAxisArgs.gridColor));
            }
            if ('gridLineWidth' in xAxisArgs) {
                if (xAxisArgs.textSize > 0)
                    XAxis.setGridLineWidth(xAxisArgs.gridLineWidth);
            }
            if ('enableGridDashedLine' in xAxisArgs) {
                if (xAxisArgs.enableGridDashedLine.lineLength > 0 && xAxisArgs.enableGridDashedLine.spaceLength > 0 && xAxisArgs.enableGridDashedLine.phase > 0)
                    XAxis.enableGridDashedLine(xAxisArgs.enableGridDashedLine.lineLength, xAxisArgs.enableGridDashedLine.spaceLength, xAxisArgs.enableGridDashedLine.phase);
            }
            if ('position' in xAxisArgs) {
                XAxis.setPosition(XAxisPosition.valueOf(xAxisArgs.position));
            }
            if ('labelRotationAngle' in xAxisArgs) {
                XAxis.setLabelRotationAngle(xAxisArgs.labelRotationAngle);
            }
        }
        if ('RightYAxis' in this.lineChartArgs) {
            var yAxisArgs = this.lineChartArgs.RightYAxis;
            var YAxis = this._android.getAxisRight();
            this.setYAxis(yAxisArgs, YAxis);
        }
        if ('LeftYAxis' in this.lineChartArgs) {
            var yAxisArgs = this.lineChartArgs.LeftYAxis;
            var YAxis = this._android.getAxisLeft();
            this.setYAxis(yAxisArgs, YAxis);
        }
    };
    LineChart.prototype.setYAxis = function (yAxisArgs, YAxis) {
        if ('enabled' in yAxisArgs) {
            if (typeof yAxisArgs.enabled == "boolean")
                YAxis.setEnabled(yAxisArgs.enabled);
        }
        if ('drawLabels' in yAxisArgs) {
            if (typeof yAxisArgs.drawLabels == "boolean")
                YAxis.setDrawLabels(yAxisArgs.drawLabels);
        }
        if ('drawAxisLine' in yAxisArgs) {
            if (typeof yAxisArgs.drawLabels == "boolean")
                YAxis.setDrawAxisLine(yAxisArgs.drawAxisLine);
        }
        if ('drawGridLines' in yAxisArgs) {
            if (typeof yAxisArgs.drawLabels == "boolean")
                YAxis.setDrawGridLines(yAxisArgs.drawGridLines);
        }
        if ('axisMaximum' in yAxisArgs) {
            YAxis.setAxisMaximum(yAxisArgs.axisMaximum);
        }
        if ('axisMinimum' in yAxisArgs) {
            YAxis.setAxisMinimum(yAxisArgs.axisMinimum);
        }
        if ('inverted' in yAxisArgs) {
            if (typeof yAxisArgs.drawLabels == "boolean")
                YAxis.setInverted(yAxisArgs.inverted);
        }
        if ('spaceTop' in yAxisArgs) {
            if (yAxisArgs.spaceTop <= 100 && yAxisArgs.spaceTop >= 0)
                YAxis.setSpaceTop(yAxisArgs.spaceTop);
        }
        if ('spaceBottom' in yAxisArgs) {
            if (yAxisArgs.spaceBottom <= 100 && yAxisArgs.spaceBottom >= 0)
                YAxis.setSpaceBottom(yAxisArgs.spaceBottom);
        }
        if ('showOnlyMinMax' in yAxisArgs) {
            if (typeof yAxisArgs.drawLabels == "boolean")
                YAxis.setShowOnlyMinMax(yAxisArgs.showOnlyMinMax);
        }
        if ('labelCount' in yAxisArgs) {
            if (yAxisArgs.labelCount.count && yAxisArgs.labelCount.count > 0 && typeof yAxisArgs.labelCount.force == "boolean")
                YAxis.setLabelCount(yAxisArgs.labelCount.count, yAxisArgs.labelCount.force);
        }
        if ('granularity' in yAxisArgs) {
            if (yAxisArgs.granularity > 0)
                YAxis.setGranularity(yAxisArgs.granularity);
        }
        if ('granularityEnabled' in yAxisArgs) {
            if (typeof yAxisArgs.drawLabels == "boolean")
                YAxis.setGranularityEnabled(yAxisArgs.granularityEnabled);
        }
        if ('textColor' in yAxisArgs) {
            YAxis.setTextColor(helper_1.resolveColor(yAxisArgs.textColor));
        }
        if ('textSize' in yAxisArgs) {
            if (yAxisArgs.textSize > 0)
                YAxis.setTextSize(yAxisArgs.textSize);
        }
        if ('gridColor' in yAxisArgs) {
            YAxis.setGridColor(helper_1.resolveColor(yAxisArgs.gridColor));
        }
        if ('gridLineWidth' in yAxisArgs) {
            if (yAxisArgs.gridLineWidth > 0)
                YAxis.setGridLineWidth(yAxisArgs.gridLineWidth);
        }
        if ('enableGridDashedLine' in yAxisArgs) {
            if (yAxisArgs.enableGridDashedLine.lineLength > 0 && yAxisArgs.enableGridDashedLine.spaceLength > 0 && yAxisArgs.enableGridDashedLine.phase > 0)
                YAxis.enableGridDashedLine(yAxisArgs.enableGridDashedLine.lineLength, yAxisArgs.enableGridDashedLine.spaceLength, yAxisArgs.enableGridDashedLine.phase);
        }
        if ('position' in yAxisArgs) {
            YAxis.setPosition(YAxisPosition.valueOf(yAxisArgs.position));
        }
        if ('drawZeroLine' in yAxisArgs) {
            if (typeof yAxisArgs.drawZeroLine == "boolean")
                YAxis.setDrawZeroLine(yAxisArgs.drawZeroLine);
        }
        if ('zeroLineWidth' in yAxisArgs) {
            if (yAxisArgs.zeroLineWidth > 0)
                YAxis.setZeroLineWidth(yAxisArgs.zeroLineWidth);
        }
        if ('zeroLineColor' in yAxisArgs) {
            YAxis.setZeroLineColor(helper_1.resolveColor(yAxisArgs.zeroLineColor));
        }
    };
    return LineChart;
}(line_chart_common_1.LineChartCommon));
exports.LineChart = LineChart;
