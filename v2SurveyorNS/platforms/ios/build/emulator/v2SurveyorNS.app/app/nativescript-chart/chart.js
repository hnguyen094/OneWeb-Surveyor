"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("platform");
var page;
var ele = [];
var maxEle;
var minEle;
var timer;
var prevIndex;
var smoothingRange;
var width = platform.screen.mainScreen.widthPixels / 360 / platform.screen.mainScreen.scale; // in dp
var maxHeight = platform.screen.mainScreen.heightPixels / 8 / platform.screen.mainScreen.scale; // in dp
function initGraph(myPage) {
    console.log("Entering initGraph");
    page = myPage;
    maxEle = 60;
    minEle = 0;
    timer = 10;
    smoothingRange = 20;
    page.getViewById("graph").height = maxHeight;
    // const targetline = page.getViewById("ltarget");
    // targetline.height = width;
    for (var i = 0; i < 360; i++) {
        console.log("dealing with: " + i);
        ele.push((maxEle + minEle) / 2);
        var heightPercent = (ele[i] - minEle) / (maxEle - minEle);
        page.getViewById("l" + i).height = maxHeight;
    }
}
exports.initGraph = initGraph;
function updateGraph(azimuth, elevation) {
    var az = Math.floor(azimuth) + 180;
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
exports.updateGraph = updateGraph;
function ele2Percent(elevation) {
    return (elevation - minEle) / (maxEle - minEle);
}
function onExit() {
}
exports.onExit = onExit;
