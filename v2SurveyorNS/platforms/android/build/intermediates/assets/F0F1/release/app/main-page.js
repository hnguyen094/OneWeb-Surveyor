"use strict";
/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var cameraPreview = require("./nativescript-camera-preview/nativescript-camera-preview");
var rotVector = require("./nativescript-rotation-vector/index");
var app = require("application");
var platform = require("platform");
var orientation = require("nativescript-screen-orientation");
var params = require("./nativescript-fov/nativescript-fov");
var permissions = require("nativescript-permissions");
var charts = require("./nativescript-chart/chart");
var instructions = require("./nativescript-instructions/instructions");
var enums_1 = require("ui/enums");
var crosshair;
var doubleline;
var upperText;
var lowerText;
var capturebtn;
var clearbtn;
var recordstop;
var x, y, z;
var page;
var isOn = false;
var isFirst = true;
var timer = 100;
// let filters;
var OUTER_CIRCLE_DIAMETER = 2;
var ANGLE_BETWEEN_LINES = 10;
var yTranslate = app.ios ? -20 : 0;
// Function: resizes the necessary graphics at startup
var resize = function () {
    var scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
    crosshair.scaleX = scaleCrosshair;
    crosshair.scaleY = scaleCrosshair;
    crosshair.translateY = yTranslate;
    var scaleDoubleLine = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight());
    doubleline.scaleX = scaleDoubleLine;
    doubleline.scaleY = scaleDoubleLine;
    var cameraView = page.getViewById("placeholder-view");
    cameraView.animate({
        scale: {
            x: platform.screen.mainScreen.heightPixels / cameraView.getMeasuredHeight(),
            y: platform.screen.mainScreen.heightPixels / cameraView.getMeasuredHeight()
        },
        translate: {
            x: 0,
            y: app.ios ? -10 : 0
        },
        duration: 200
    });
};
// Function: the update that animates all the graphics
var updateCallback = function () {
    charts.updateGraph(x, y, isOn);
    instructions.trigger2(y);
    instructions.trigger4(x);
    if (isFirst) {
        resize();
        isFirst = false;
    }
    crosshair.rotate = -z;
    var distanceFromCenter = params.pixels2Dp((params.degrees2Pixels((-y % ANGLE_BETWEEN_LINES)
        - ANGLE_BETWEEN_LINES / 2 * (y > 0 ? -1 : 1))));
    doubleline.translateX = Math.sin(z * Math.PI / 180) * distanceFromCenter;
    doubleline.translateY = Math.cos(z * Math.PI / 180) * distanceFromCenter + yTranslate;
    doubleline.rotate = -z;
    var dist = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight()) * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2);
    lowerText.text = 10 * Math.floor(-y / 10);
    lowerText.translateX = Math.sin(z * Math.PI / 180) * ((app.ios ? 20 : 0) + distanceFromCenter + dist);
    lowerText.translateY = Math.cos(z * Math.PI / 180) * ((app.ios ? 20 : 0) + distanceFromCenter + dist) + yTranslate;
    lowerText.rotate = -z;
    upperText.text = 10 * Math.floor((-y + 10) / 10);
    upperText.translateX = Math.sin(z * Math.PI / 180) * ((app.ios ? -20 : 0) + distanceFromCenter - dist);
    upperText.translateY = Math.cos(z * Math.PI / 180) * ((app.ios ? -20 : 0) + distanceFromCenter - dist) + yTranslate;
    upperText.rotate = -z;
};
// Function: updates the x/y/z values from the rotation callback
var rotationCallback = function (data) {
    x = data.x;
    y = data.y;
    z = data.z;
    if (app.ios)
        updateCallback(); // ios doesn't seem to expose a callback for every frame update in the camera preview; therefore, we'll hop on the rotation callback
};
// Function: sets the pap to be fullscreen and orientation to be always portrait
function onLoaded(args) {
    orientation.setCurrentOrientation("portrait", function () { });
    if (app.android && platform.device.sdkVersion >= '21') {
        var View = android.view.View;
        var window_1 = app.android.startActivity.getWindow();
        // set the status bar to Color.Transparent
        // window.setStatusBarColor(0x000000);
        var decorView = window_1.getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
    cameraPreview.onLoaded(args, "placeholder-view");
}
exports.onLoaded = onLoaded;
// Function: creates the graph, instructions, view, permissions, FOV when initializing placeholder
function onCreatingView(args) {
    charts.initGraph(page);
    instructions.trigger1(page);
    if (app.android) {
        permissions.requestPermission(android["Manifest"].permission.CAMERA, "I need these permissions for the viewfinder")
            .then(function () {
            console.log("Woo Hoo, I have the power!");
        })
            .catch(function () {
            console.log("Uh oh, no permissions - plan B time!");
        });
    }
    if (app.android)
        params.initialize();
    cameraPreview.onCreatingView(updateCallback, args);
    if (app.ios !== undefined)
        params.initialize();
    rotVector.startRotUpdates(rotationCallback, { sensorDelay: "game" });
    var maxSize = cameraPreview.getMaxSize();
    params.setVars(maxSize[0], maxSize[1]);
}
exports.onCreatingView = onCreatingView;
// Function: When the record button is pressed
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
    instructions.trigger3(x);
    isOn = !isOn;
    capturebtn.animate({
        scale: { x: 1.2, y: 1.2 },
        duration: 100
    }).then(function () {
        capturebtn.animate({
            scale: { x: 1, y: 1 },
            duration: 300,
            curve: enums_1.AnimationCurve.spring
        });
        recordstop.src = isOn ? "res://stop" : "res://record";
    });
    console.log("el: " + y);
}
exports.onTakeShot = onTakeShot;
// Function: when the clear button is pressed (for charts)
function onClear(args) {
    charts.clear();
    clearbtn.animate({
        scale: { x: 1.2, y: 1.2 },
        duration: 100
    }).then(function () {
        clearbtn.animate({
            scale: { x: 1, y: 1 },
            duration: 300,
            curve: enums_1.AnimationCurve.spring
        });
    });
}
exports.onClear = onClear;
// Function: sets the view variables from the page
function navigatingTo(args) {
    page = args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
    capturebtn = page.getViewById("capturebtn");
    clearbtn = page.getViewById("clearbtn");
    recordstop = page.getViewById("recordstop");
}
exports.navigatingTo = navigatingTo;
// Function: Resumes the app
app.on(app.resumeEvent, function (args) {
    rotVector.startRotUpdates(rotationCallback, { sensorDelay: "game" });
    cameraPreview.onResume();
});
// Function: Pauses the app
app.on(app.suspendEvent, function (args) {
    cameraPreview.onPause();
    rotVector.stopRotUpdates();
    charts.onExit();
});
// Function: when the app exits
// UNUSED
app.on(app.exitEvent, function (args) {
    console.log("On Exitting");
    rotVector.stopRotUpdates();
});
