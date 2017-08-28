"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("platform");
var layout = require("ui/layouts/grid-layout");
var page;
var ele = [];
var minEle = 0;
var targetEle = 40;
var maxEle = 60;
var prevIndex;
var smoothingRange = 20; // when there is a data skip in the azimuth, we want to smooth it out linearly. This is the max range of the smoothing. Any jumps more than 20 will not be smoothed
var width = platform.screen.mainScreen.widthPixels / 360 / platform.screen.mainScreen.scale; // in dp
var maxHeight = platform.screen.mainScreen.heightPixels / 8 / platform.screen.mainScreen.scale; // in dp
/** Function: initialize the graph with graph height, target line, and default values
 * @param myPage  used to eventually get views by id
 */
function initGraph(myPage) {
    console.log("Entering initGraph");
    page = myPage;
    page.getViewById("graph").height = maxHeight;
    var ltarget = page.getViewById("ltarget");
    ltarget.height = width;
    ltarget.translateY = -maxHeight * ele2Percent(targetEle);
    for (var i = 0; i < 360; i++) {
        ele.push((maxEle + minEle) / 2); // start at 50%
        page.getViewById("l" + i).height = maxHeight * ele2Percent(ele[i]);
    }
}
exports.initGraph = initGraph;
/** Function: update the graph
 * @param azimuth an arbitrary azimuth
 * @param elevation the elevation at that azimuth
 * @param isOn  whether or not the record button is toggled on
 */
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
/* Function: clears the graph, and reset the bars
 */
function clear() {
    for (var i = 0; i < 360; i++) {
        ele[i] = (maxEle + minEle) / 2;
        page.getViewById("l" + i).height = maxHeight * ele2Percent(ele[i]);
    }
}
exports.clear = clear;
/** Function: convert the elevation to the percentage of the maxHeight
 */
function ele2Percent(elevation) {
    return (elevation - minEle) / (maxEle - minEle);
}
/* Function: called when the app exits
 * UNUSED
 */
function onExit() {
}
exports.onExit = onExit;
