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
var crosshair;
var doubleline;
var upperText;
var lowerText;
var x, y, z;
var measuredWidth;
var page;
var isOn = false;
var OUTER_CIRCLE_DIAMETER = 2;
var ANGLE_BETWEEN_LINES = 10;
var updateCallback = function () {
    // console.log("Entered updateCallback");
    if (isOn) {
        charts.updateGraph(x, y);
    }
    var yTranslate = app.ios ? -20 : 0;
    var scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
    crosshair.animate({
        scale: {
            x: scaleCrosshair,
            y: scaleCrosshair
        },
        translate: {
            x: 0,
            y: yTranslate
        },
        rotate: -z,
        duration: 0
    });
    var scaleDoubleLine = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight());
    var distanceFromCenter = params.pixels2Dp((params.degrees2Pixels((-y % ANGLE_BETWEEN_LINES)
        - ANGLE_BETWEEN_LINES / 2 * (y > 0 ? -1 : 1))));
    lowerText.text = 10 * Math.floor(-y / 10);
    upperText.text = 10 * Math.floor((-y + 10) / 10);
    doubleline.animate({
        scale: {
            x: scaleDoubleLine,
            y: scaleDoubleLine
        },
        translate: {
            x: Math.sin(z * Math.PI / 180) * distanceFromCenter,
            y: Math.cos(z * Math.PI / 180) * distanceFromCenter + yTranslate
        },
        rotate: -z,
        duration: 0
    });
    lowerText.animate({
        translate: {
            x: Math.sin(z * Math.PI / 180) * (distanceFromCenter + scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)),
            y: Math.cos(z * Math.PI / 180) * (distanceFromCenter + scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)) + yTranslate
        },
        rotate: -z,
        duration: 0
    });
    upperText.animate({
        translate: {
            x: Math.sin(z * Math.PI / 180) * (distanceFromCenter - scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)),
            y: Math.cos(z * Math.PI / 180) * (distanceFromCenter - scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)) + yTranslate
        },
        rotate: -z,
        duration: 0
    });
    if (app.ios) {
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
            duration: 2000
        });
    }
};
var rotationCallback = function (data) {
    //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
    x = data.x;
    y = data.y;
    z = data.z;
    if (app.ios)
        updateCallback(); // ios doesn't seem to expose a callback for every frame update in the camera preview; therefore, we'll hop on the rotation callback
};
// export function showSideDrawer(args: EventData) {
//     console.log("Show SideDrawer tapped.");
// }
//TODO: split up the code
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
function onCreatingView(args) {
    charts.initGraph(page);
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
    measuredWidth = params.degrees2Pixels(OUTER_CIRCLE_DIAMETER);
    // console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}
exports.onCreatingView = onCreatingView;
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
    isOn = !isOn;
    console.log("el: " + y);
}
exports.onTakeShot = onTakeShot;
function navigatingTo(args) {
    page = args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
}
exports.navigatingTo = navigatingTo;
app.on(app.resumeEvent, function (args) {
    rotVector.startRotUpdates(rotationCallback, { sensorDelay: "game" });
    cameraPreview.onResume();
});
app.on(app.suspendEvent, function (args) {
    cameraPreview.onPause();
    rotVector.stopRotUpdates();
    charts.onExit();
});
app.on(app.exitEvent, function (args) {
    console.log("On Exitting");
    rotVector.stopRotUpdates();
});
