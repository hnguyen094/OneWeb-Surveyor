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
var resize = function () {
    var scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
    crosshair.scaleX = scaleCrosshair;
    crosshair.scaleY = scaleCrosshair;
    crosshair.translateY = yTranslate;
    var scaleDoubleLine = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight());
    doubleline.scaleX = scaleDoubleLine;
    doubleline.scaleY = scaleDoubleLine;
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
            duration: 200
        });
    }
};
var updateCallback = function () {
    charts.updateGraph(x, y, isOn);
    instructions.trigger2(y);
    instructions.trigger4(x);
    // timer--;
    // if(timer < 0) {
    //   timer = 100;
    //   rotVector.stopRotUpdates();
    //   rotVector.startRotUpdates(rotationCallback,  { sensorDelay: "game" });
    // }
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
    // console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}
exports.onCreatingView = onCreatingView;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztFQUlFOztBQUlGLHlGQUEyRjtBQUMzRixnRUFBa0U7QUFDbEUsaUNBQW1DO0FBR25DLG1DQUFxQztBQUNyQyw2REFBK0Q7QUFDL0QsNERBQThEO0FBQzlELHNEQUF3RDtBQUN4RCxtREFBcUQ7QUFDckQsdUVBQXlFO0FBQ3pFLGtDQUF3QztBQUV4QyxJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLFVBQWUsQ0FBQztBQUNwQixJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLFVBQWUsQ0FBQztBQUNwQixJQUFJLFFBQWEsQ0FBQztBQUNsQixJQUFJLFVBQWUsQ0FBQztBQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1osSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLElBQUksR0FBWSxLQUFLLENBQUM7QUFDMUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLElBQUksS0FBSyxHQUFXLEdBQUcsQ0FBQztBQUN4QixlQUFlO0FBRWYsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFDL0IsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFcEMsSUFBTSxNQUFNLEdBQUc7SUFDYixJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDbEcsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7SUFDbEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7SUFDbEMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7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SUFDMUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQVRELG9DQVNDO0FBRUQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVMsSUFBSTtJQUNuQyxTQUFTLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFHLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdEUsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVMsSUFBSTtJQUNwQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDeEIsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQUk7SUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzQixTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5JbiBOYXRpdmVTY3JpcHQsIGEgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgYW4gWE1MIGZpbGUgaXMga25vd24gYXNcclxuYSBjb2RlLWJlaGluZCBmaWxlLiBUaGUgY29kZS1iZWhpbmQgaXMgYSBncmVhdCBwbGFjZSB0byBwbGFjZSB5b3VyIHZpZXdcclxubG9naWMsIGFuZCB0byBzZXQgdXAgeW91ciBwYWdl4oCZcyBkYXRhIGJpbmRpbmcuXHJcbiovXHJcblxyXG5pbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndWkvcGFnZSc7XHJcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSAnLi9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXcvbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3JztcclxuaW1wb3J0ICogYXMgcm90VmVjdG9yIGZyb20gXCIuL25hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3IvaW5kZXhcIjtcclxuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgKiBhcyBmcmFtZU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9mcmFtZVwiO1xyXG5pbXBvcnQgKiBhcyBhbmltYXRpb24gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvYW5pbWF0aW9uXCI7XHJcbmltcG9ydCAqIGFzIHBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgKiBhcyBvcmllbnRhdGlvbiBmcm9tIFwibmF0aXZlc2NyaXB0LXNjcmVlbi1vcmllbnRhdGlvblwiO1xyXG5pbXBvcnQgKiBhcyBwYXJhbXMgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWZvdi9uYXRpdmVzY3JpcHQtZm92XCI7XHJcbmltcG9ydCAqIGFzIHBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcclxuaW1wb3J0ICogYXMgY2hhcnRzIGZyb20gXCIuL25hdGl2ZXNjcmlwdC1jaGFydC9jaGFydFwiO1xyXG5pbXBvcnQgKiBhcyBpbnN0cnVjdGlvbnMgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWluc3RydWN0aW9ucy9pbnN0cnVjdGlvbnNcIjtcclxuaW1wb3J0IHtBbmltYXRpb25DdXJ2ZX0gZnJvbSBcInVpL2VudW1zXCI7XHJcblxyXG5sZXQgY3Jvc3NoYWlyOiBhbnk7XHJcbmxldCBkb3VibGVsaW5lOiBhbnk7XHJcbmxldCB1cHBlclRleHQ6IGFueTtcclxubGV0IGxvd2VyVGV4dDogYW55O1xyXG5sZXQgY2FwdHVyZWJ0bjogYW55O1xyXG5sZXQgY2xlYXJidG46IGFueTtcclxubGV0IHJlY29yZHN0b3A6IGFueTtcclxubGV0IHgsIHksIHo7XHJcbmxldCBwYWdlO1xyXG5sZXQgaXNPbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5sZXQgaXNGaXJzdCA9IHRydWU7XHJcbmxldCB0aW1lcjogbnVtYmVyID0gMTAwO1xyXG4vLyBsZXQgZmlsdGVycztcclxuXHJcbmNvbnN0IE9VVEVSX0NJUkNMRV9ESUFNRVRFUiA9IDI7XHJcbmNvbnN0IEFOR0xFX0JFVFdFRU5fTElORVMgPSAxMDtcclxuY29uc3QgeVRyYW5zbGF0ZSA9IGFwcC5pb3M/IC0yMCA6IDA7XHJcblxyXG5jb25zdCByZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICBjb25zdCBzY2FsZUNyb3NzaGFpciA9IHBhcmFtcy5kZWdyZWVzMlNjYWxlKE9VVEVSX0NJUkNMRV9ESUFNRVRFUiwgY3Jvc3NoYWlyLmdldE1lYXN1cmVkSGVpZ2h0KCkpO1xyXG4gIGNyb3NzaGFpci5zY2FsZVggPSBzY2FsZUNyb3NzaGFpcjtcclxuICBjcm9zc2hhaXIuc2NhbGVZID0gc2NhbGVDcm9zc2hhaXI7XHJcbiAgY3Jvc3NoYWlyLnRyYW5zbGF0ZVkgPSB5VHJhbnNsYXRlO1xyXG5cclxuICBjb25zdCBzY2FsZURvdWJsZUxpbmUgPSBwYXJhbXMuZGVncmVlczJTY2FsZShBTkdMRV9CRVRXRUVOX0xJTkVTLCBkb3VibGVsaW5lLmdldE1lYXN1cmVkSGVpZ2h0KCkpO1xyXG4gIGRvdWJsZWxpbmUuc2NhbGVYID0gc2NhbGVEb3VibGVMaW5lO1xyXG4gIGRvdWJsZWxpbmUuc2NhbGVZID0gc2NhbGVEb3VibGVMaW5lO1xyXG5cclxuICBpZiAoYXBwLmlvcykge1xyXG4gICAgbGV0IGNhbWVyYVZpZXcgPSBwYWdlLmdldFZpZXdCeUlkKFwicGxhY2Vob2xkZXItdmlld1wiKTtcclxuICAgIGNhbWVyYVZpZXcuYW5pbWF0ZSh7XHJcbiAgICAgIHNjYWxlOiB7XHJcbiAgICAgICAgeDogcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0UGl4ZWxzL2NhbWVyYVZpZXcuZ2V0TWVhc3VyZWRIZWlnaHQoKSxcclxuICAgICAgICB5OiBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMvY2FtZXJhVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpXHJcbiAgICAgIH0sXHJcbiAgICAgIHRyYW5zbGF0ZToge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogYXBwLmlvcz8gLTEwIDogMFxyXG4gICAgICB9LFxyXG4gICAgICBkdXJhdGlvbjogMjAwXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcbmNvbnN0IHVwZGF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgY2hhcnRzLnVwZGF0ZUdyYXBoKHgseSwgaXNPbik7XHJcbiAgaW5zdHJ1Y3Rpb25zLnRyaWdnZXIyKHkpO1xyXG4gIGluc3RydWN0aW9ucy50cmlnZ2VyNCh4KTtcclxuICAvLyB0aW1lci0tO1xyXG4gIC8vIGlmKHRpbWVyIDwgMCkge1xyXG4gIC8vICAgdGltZXIgPSAxMDA7XHJcbiAgLy8gICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcclxuICAvLyAgIHJvdFZlY3Rvci5zdGFydFJvdFVwZGF0ZXMocm90YXRpb25DYWxsYmFjaywgIHsgc2Vuc29yRGVsYXk6IFwiZ2FtZVwiIH0pO1xyXG4gIC8vIH1cclxuICBpZihpc0ZpcnN0KSB7XHJcbiAgICByZXNpemUoKTtcclxuICAgIGlzRmlyc3QgPSBmYWxzZTtcclxuICB9XHJcbiAgY3Jvc3NoYWlyLnJvdGF0ZSA9IC16O1xyXG4gIGNvbnN0IGRpc3RhbmNlRnJvbUNlbnRlciA9IHBhcmFtcy5waXhlbHMyRHAoKHBhcmFtcy5kZWdyZWVzMlBpeGVscygoLXkgJSBBTkdMRV9CRVRXRUVOX0xJTkVTKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBBTkdMRV9CRVRXRUVOX0xJTkVTLzIgKiAoeT4wPyAtMTogMSkpKSk7XHJcbiAgZG91YmxlbGluZS50cmFuc2xhdGVYID0gTWF0aC5zaW4oeipNYXRoLlBJLzE4MCkqZGlzdGFuY2VGcm9tQ2VudGVyO1xyXG4gIGRvdWJsZWxpbmUudHJhbnNsYXRlWSA9ICBNYXRoLmNvcyh6Kk1hdGguUEkvMTgwKSpkaXN0YW5jZUZyb21DZW50ZXIgKyB5VHJhbnNsYXRlO1xyXG4gIGRvdWJsZWxpbmUucm90YXRlID0gLXo7XHJcblxyXG4gIGNvbnN0IGRpc3QgPSBwYXJhbXMuZGVncmVlczJTY2FsZShBTkdMRV9CRVRXRUVOX0xJTkVTLCBkb3VibGVsaW5lLmdldE1lYXN1cmVkSGVpZ2h0KCkpKnBhcmFtcy5kZWdyZWVzMlBpeGVscyhBTkdMRV9CRVRXRUVOX0xJTkVTLzIpO1xyXG5cclxuICBsb3dlclRleHQudGV4dCA9IDEwKiBNYXRoLmZsb29yKC15LzEwKTtcclxuICBsb3dlclRleHQudHJhbnNsYXRlWCA9IE1hdGguc2luKHogKiBNYXRoLlBJLzE4MCkqICgoYXBwLmlvcz8gMjA6IDApICsgZGlzdGFuY2VGcm9tQ2VudGVyICsgZGlzdCk7XHJcbiAgbG93ZXJUZXh0LnRyYW5zbGF0ZVkgPSBNYXRoLmNvcyh6ICogTWF0aC5QSS8xODApKiAoKGFwcC5pb3M/IDIwOiAwKSArIGRpc3RhbmNlRnJvbUNlbnRlciArIGRpc3QpICsgeVRyYW5zbGF0ZTtcclxuICBsb3dlclRleHQucm90YXRlID0gLXo7XHJcblxyXG4gIHVwcGVyVGV4dC50ZXh0ID0gMTAqIE1hdGguZmxvb3IoKC15ICsgMTApLzEwKTtcclxuICB1cHBlclRleHQudHJhbnNsYXRlWCA9IE1hdGguc2luKHogKiBNYXRoLlBJLzE4MCkqICgoYXBwLmlvcz8gLTIwOiAwKSArIGRpc3RhbmNlRnJvbUNlbnRlciAtIGRpc3QpO1xyXG4gIHVwcGVyVGV4dC50cmFuc2xhdGVZID0gTWF0aC5jb3MoeiAqIE1hdGguUEkvMTgwKSogKChhcHAuaW9zPyAtMjA6IDApICsgZGlzdGFuY2VGcm9tQ2VudGVyIC0gZGlzdCkgKyB5VHJhbnNsYXRlO1xyXG4gIHVwcGVyVGV4dC5yb3RhdGUgPSAtejtcclxufTtcclxuXHJcbmNvbnN0IHJvdGF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcIiB5OiBcIiArIGRhdGEueSArIFwiIHo6IFwiICsgZGF0YS56KTtcclxuICAgIHggPSBkYXRhLng7XHJcbiAgICB5ID0gZGF0YS55O1xyXG4gICAgeiA9IGRhdGEuejtcclxuICAgIGlmKGFwcC5pb3MpIHVwZGF0ZUNhbGxiYWNrKCk7IC8vIGlvcyBkb2Vzbid0IHNlZW0gdG8gZXhwb3NlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGZyYW1lIHVwZGF0ZSBpbiB0aGUgY2FtZXJhIHByZXZpZXc7IHRoZXJlZm9yZSwgd2UnbGwgaG9wIG9uIHRoZSByb3RhdGlvbiBjYWxsYmFja1xyXG59O1xyXG5cclxuLy8gZXhwb3J0IGZ1bmN0aW9uIHNob3dTaWRlRHJhd2VyKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4vLyAgICAgY29uc29sZS5sb2coXCJTaG93IFNpZGVEcmF3ZXIgdGFwcGVkLlwiKTtcclxuLy8gfVxyXG5cclxuLy9UT0RPOiBzcGxpdCB1cCB0aGUgY29kZVxyXG5leHBvcnQgZnVuY3Rpb24gb25Mb2FkZWQoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgb3JpZW50YXRpb24uc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIiwgKCkgPT4ge30pO1xyXG4gIGlmIChhcHAuYW5kcm9pZCAmJiBwbGF0Zm9ybS5kZXZpY2Uuc2RrVmVyc2lvbiA+PSAnMjEnKSB7XHJcbiAgICAgIGNvbnN0IFZpZXcgOmFueSA9IGFuZHJvaWQudmlldy5WaWV3O1xyXG4gICAgICBjb25zdCB3aW5kb3cgPSBhcHAuYW5kcm9pZC5zdGFydEFjdGl2aXR5LmdldFdpbmRvdygpO1xyXG4gICAgICAvLyBzZXQgdGhlIHN0YXR1cyBiYXIgdG8gQ29sb3IuVHJhbnNwYXJlbnRcclxuICAgICAgLy8gd2luZG93LnNldFN0YXR1c0JhckNvbG9yKDB4MDAwMDAwKTtcclxuICAgICAgY29uc3QgZGVjb3JWaWV3ID0gd2luZG93LmdldERlY29yVmlldygpO1xyXG4gICAgICBkZWNvclZpZXcuc2V0U3lzdGVtVWlWaXNpYmlsaXR5KFxyXG4gICAgICAgICAgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfU1RBQkxFXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX0hJREVfTkFWSUdBVElPTlxyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9GVUxMU0NSRUVOXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSElERV9OQVZJR0FUSU9OIC8vIGhpZGUgbmF2IGJhclxyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0ZVTExTQ1JFRU4gLy8gaGlkZSBzdGF0dXMgYmFyXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSU1NRVJTSVZFX1NUSUNLWSk7XHJcbiAgfVxyXG4gIGNhbWVyYVByZXZpZXcub25Mb2FkZWQoYXJncywgXCJwbGFjZWhvbGRlci12aWV3XCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25DcmVhdGluZ1ZpZXcoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgY2hhcnRzLmluaXRHcmFwaChwYWdlKTtcclxuICBpbnN0cnVjdGlvbnMudHJpZ2dlcjEocGFnZSk7XHJcbiAgaWYoYXBwLmFuZHJvaWQpIHtcclxuICAgIHBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9uKGFuZHJvaWRbXCJNYW5pZmVzdFwiXS5wZXJtaXNzaW9uLkNBTUVSQSwgXCJJIG5lZWQgdGhlc2UgcGVybWlzc2lvbnMgZm9yIHRoZSB2aWV3ZmluZGVyXCIpXHJcbiAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiV29vIEhvbywgSSBoYXZlIHRoZSBwb3dlciFcIik7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJVaCBvaCwgbm8gcGVybWlzc2lvbnMgLSBwbGFuIEIgdGltZSFcIik7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgaWYoYXBwLmFuZHJvaWQpIHBhcmFtcy5pbml0aWFsaXplKCk7XHJcbiAgY2FtZXJhUHJldmlldy5vbkNyZWF0aW5nVmlldyh1cGRhdGVDYWxsYmFjaywgYXJncyk7XHJcbiAgaWYgKGFwcC5pb3MgIT09IHVuZGVmaW5lZCkgcGFyYW1zLmluaXRpYWxpemUoKTtcclxuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKHJvdGF0aW9uQ2FsbGJhY2ssICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcclxuICBjb25zdCBtYXhTaXplID0gY2FtZXJhUHJldmlldy5nZXRNYXhTaXplKCk7XHJcbiAgcGFyYW1zLnNldFZhcnMobWF4U2l6ZVswXSwgbWF4U2l6ZVsxXSk7XHJcbiAgLy8gY29uc29sZS5sb2cocGFyYW1zLmdldFZlcnRpY2FsRk9WKCkgKyBcIiBcIiArIHBhcmFtcy5nZXRIb3Jpem9udGFsRk9WKCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25UYWtlU2hvdChhcmdzOiBFdmVudERhdGEpIHtcclxuICBjYW1lcmFQcmV2aWV3Lm9uVGFrZVNob3QoYXJncyk7XHJcbiAgaW5zdHJ1Y3Rpb25zLnRyaWdnZXIzKHgpO1xyXG4gIGlzT24gPSAhaXNPbjtcclxuXHJcbiAgY2FwdHVyZWJ0bi5hbmltYXRlKHtcclxuICAgIHNjYWxlOiB7IHg6IDEuMiwgeTogMS4yIH0sXHJcbiAgICBkdXJhdGlvbjogMTAwXHJcbiAgfSkudGhlbigoKT0+IHtcclxuICAgIGNhcHR1cmVidG4uYW5pbWF0ZShcclxuICAgICAge1xyXG4gICAgICAgIHNjYWxlOiB7IHg6IDEsIHk6IDF9LFxyXG4gICAgICAgIGR1cmF0aW9uOiAzMDAsXHJcbiAgICAgICAgY3VydmU6IEFuaW1hdGlvbkN1cnZlLnNwcmluZ1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgcmVjb3Jkc3RvcC5zcmMgPSBpc09uPyBcInJlczovL3N0b3BcIiA6IFwicmVzOi8vcmVjb3JkXCI7XHJcbiAgfSk7XHJcbiAgY29uc29sZS5sb2coXCJlbDogXCIgKyB5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9uQ2xlYXIoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgY2hhcnRzLmNsZWFyKCk7XHJcbiAgY2xlYXJidG4uYW5pbWF0ZSh7XHJcbiAgICBzY2FsZTogeyB4OiAxLjIsIHk6IDEuMiB9LFxyXG4gICAgZHVyYXRpb246IDEwMFxyXG4gIH0pLnRoZW4oKCk9PiB7XHJcbiAgICBjbGVhcmJ0bi5hbmltYXRlKHtcclxuICAgICAgICBzY2FsZTogeyB4OiAxLCB5OiAxfSxcclxuICAgICAgICBkdXJhdGlvbjogMzAwLFxyXG4gICAgICAgIGN1cnZlOiBBbmltYXRpb25DdXJ2ZS5zcHJpbmdcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGluZ1RvKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gICAgcGFnZSA9IDxQYWdlPmFyZ3Mub2JqZWN0O1xyXG4gICAgY3Jvc3NoYWlyID0gcGFnZS5nZXRWaWV3QnlJZChcImNyb3NzaGFpclwiKTtcclxuICAgIGRvdWJsZWxpbmUgPSBwYWdlLmdldFZpZXdCeUlkKFwiZG91YmxlbGluZVwiKTtcclxuICAgIHVwcGVyVGV4dCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJ1cHBlclRleHRcIik7XHJcbiAgICBsb3dlclRleHQgPSBwYWdlLmdldFZpZXdCeUlkKFwibG93ZXJUZXh0XCIpO1xyXG4gICAgY2FwdHVyZWJ0biA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJjYXB0dXJlYnRuXCIpO1xyXG4gICAgY2xlYXJidG4gPSBwYWdlLmdldFZpZXdCeUlkKFwiY2xlYXJidG5cIik7XHJcbiAgICByZWNvcmRzdG9wID0gcGFnZS5nZXRWaWV3QnlJZChcInJlY29yZHN0b3BcIik7XHJcbn1cclxuXHJcbmFwcC5vbihhcHAucmVzdW1lRXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcclxuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKHJvdGF0aW9uQ2FsbGJhY2ssICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcclxuICBjYW1lcmFQcmV2aWV3Lm9uUmVzdW1lKCk7XHJcbn0pO1xyXG5hcHAub24oYXBwLnN1c3BlbmRFdmVudCwgZnVuY3Rpb24oYXJncykge1xyXG4gIGNhbWVyYVByZXZpZXcub25QYXVzZSgpO1xyXG4gIHJvdFZlY3Rvci5zdG9wUm90VXBkYXRlcygpO1xyXG4gIGNoYXJ0cy5vbkV4aXQoKTtcclxufSk7XHJcbmFwcC5vbihhcHAuZXhpdEV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XHJcbiAgY29uc29sZS5sb2coXCJPbiBFeGl0dGluZ1wiKTtcclxuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcclxufSk7XHJcbiJdfQ==