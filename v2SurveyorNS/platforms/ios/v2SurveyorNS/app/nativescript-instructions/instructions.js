"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("platform");
var isStart = false;
var isEleAbove0 = false;
var isPressed = false;
var largeDeltaAz = false;
var oldAz = 0;
var page;
var pt1, pt2, pt3, pt4;
var translateY = platform.screen.mainScreen.heightPixels / 8 / platform.screen.mainScreen.scale;
function trigger1(mPage) {
    if (!isStart) {
        page = mPage;
        pt1 = page.getViewById("pt1");
        pt2 = page.getViewById("pt2");
        pt3 = page.getViewById("pt3");
        pt4 = page.getViewById("pt4");
        pt1.translateY = translateY;
        pt2.translateY = translateY;
        pt3.translateY = translateY;
        pt4.translateY = translateY;
    }
}
exports.trigger1 = trigger1;
function trigger2(ele) {
    if (!isEleAbove0) {
        isEleAbove0 = -ele > 0;
        if (isEleAbove0) {
            fadeaway(pt1, pt2);
        }
    }
}
exports.trigger2 = trigger2;
function trigger3(az) {
    if (!isPressed) {
        fadeaway(pt2, pt3);
    }
    oldAz = az;
    isPressed = true;
}
exports.trigger3 = trigger3;
function trigger4(az) {
    if (!largeDeltaAz && isPressed) {
        largeDeltaAz = Math.abs(oldAz - az) > 20;
        if (largeDeltaAz) {
            end(pt3, pt4);
        }
    }
}
exports.trigger4 = trigger4;
function fadeaway(oldView, newView) {
    return oldView.animate({
        opacity: 0,
        duration: 1000
    }).then(function () {
        newView.animate({
            opacity: 1,
            duration: 1000
        });
    });
}
function end(oldView, newView) {
    oldView.animate({
        opacity: 0,
        duration: 1000
    }).then(function () {
        newView.animate({
            opacity: 1,
            duration: 2000
        }).then(function () {
            newView.animate({
                opacity: 0,
                duration: 2000
            });
        });
    });
}
