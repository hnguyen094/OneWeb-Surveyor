"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A quick implementation of instructions
var platform = require("platform");
var isStart = false;
var isEleAbove0 = false;
var isPressed = false;
var largeDeltaAz = false;
var oldAz = 0;
var page;
var pt1, pt2, pt3, pt4, pt5;
var currentView;
var translateY = platform.screen.mainScreen.heightPixels / 8 / platform.screen.mainScreen.scale;
// Function: triggers at the start of the application
function trigger1(mPage) {
    if (!isStart) {
        page = mPage;
        pt1 = page.getViewById("pt1");
        pt2 = page.getViewById("pt2");
        pt3 = page.getViewById("pt3");
        pt4 = page.getViewById("pt4");
        pt5 = page.getViewById("pt5");
        pt1.translateY = translateY;
        pt2.translateY = translateY;
        pt3.translateY = translateY;
        pt4.translateY = translateY;
        pt5.translateY = translateY;
        currentView = pt1;
    }
}
exports.trigger1 = trigger1;
// Function: triggers every update; dependent on elevation
function trigger2(ele) {
    if (!isEleAbove0) {
        isEleAbove0 = -ele > 0;
        if (isEleAbove0) {
            fadeaway(pt2);
        }
    }
    else if (-ele > 40) {
        pt5.opacity = 1;
    }
    else {
        pt5.opacity = 0;
    }
}
exports.trigger2 = trigger2;
// Function: triggers at the first click; dependent on button press
function trigger3(az) {
    if (!isPressed) {
        fadeaway(pt3);
        isEleAbove0 = true;
    }
    oldAz = az;
    isPressed = true;
}
exports.trigger3 = trigger3;
// Function: triggers every update; dependent on large delta azimuth
function trigger4(az) {
    if (!largeDeltaAz && isPressed) {
        largeDeltaAz = Math.abs(oldAz - az) > 20;
        if (largeDeltaAz) {
            end(pt3, pt4);
        }
    }
}
exports.trigger4 = trigger4;
// Function: animates the currentView away and animate the newView in
// Also sets the newView to the currentView
function fadeaway(newView) {
    return currentView.animate({
        opacity: 0,
        duration: 1000
    }).then(function () {
        newView.animate({
            opacity: 1,
            duration: 1000
        });
        currentView = newView;
    });
}
// Function: used exclusively as a timed animation to hide, show, then hide again
// Also sets the newView to the currentView
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
            currentView = newView;
        });
    });
}
// Function: hides a view
// Does not set/reset the currentView
function hide(view) {
    view.animate({
        opacity: 0,
        duration: 1000
    });
}
