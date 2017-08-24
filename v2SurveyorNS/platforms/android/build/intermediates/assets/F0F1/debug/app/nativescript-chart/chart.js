"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("platform");
var layout = require("ui/layouts/grid-layout");
var page;
var ele = [];
var maxEle;
var minEle;
var targetEle;
var prevIndex;
var smoothingRange; // when there is a data skip in the azimuth, we want to smooth it out linearly. This is the max range of the smoothing. Any jumps more than 20 will not be smoothed
var width = platform.screen.mainScreen.widthPixels / 360 / platform.screen.mainScreen.scale; // in dp
var maxHeight = platform.screen.mainScreen.heightPixels / 8 / platform.screen.mainScreen.scale; // in dp
function initGraph(myPage) {
    console.log("Entering initGraph");
    page = myPage;
    maxEle = 60;
    minEle = 0;
    targetEle = 40;
    smoothingRange = 20;
    page.getViewById("graph").height = maxHeight;
    var ltarget = page.getViewById("ltarget");
    ltarget.height = width;
    ltarget.translateY = -maxHeight * ele2Percent(targetEle);
    for (var i = 0; i < 360; i++) {
        ele.push((maxEle + minEle) / 2);
        page.getViewById("l" + i).height = maxHeight * ele2Percent(ele[i]);
    }
}
exports.initGraph = initGraph;
function updateGraph(azimuth, elevation, isOn) {
    var az = Math.floor(azimuth) + 180;
    layout.GridLayout.setColumn(page.getViewById("lcursor"), az);
    if (isOn) {
        ele[az] = -elevation < minEle ? minEle : -elevation > maxEle ? maxEle : -elevation;
        var currentView = page.getViewById("l" + az);
        currentView.height = maxHeight * ele2Percent(ele[az]);
        var dif = az - prevIndex;
        if (Math.abs(dif) > 1 && Math.abs(dif) < smoothingRange) {
            var start = void 0, end = void 0;
            if (dif > 0) {
                start = prevIndex + 1;
                end = az;
            }
            else {
                start = az + 1;
                end = prevIndex;
            }
            for (var i = start; i < end; i++) {
                ele[i] = ele[start - 1] + (i - start + 1) / (dif - 1) * (ele[az] - ele[prevIndex]);
                page.getViewById("l" + (i)).height = maxHeight * ele2Percent(ele[i]);
            }
        }
        prevIndex = az;
    }
}
exports.updateGraph = updateGraph;
function clear() {
    for (var i = 0; i < 360; i++) {
        ele[i] = (maxEle + minEle) / 2;
        page.getViewById("l" + i).height = maxHeight * ele2Percent(ele[i]);
    }
}
exports.clear = clear;
function ele2Percent(elevation) {
    return (elevation - minEle) / (maxEle - minEle);
}
function onExit() {
}
exports.onExit = onExit;
