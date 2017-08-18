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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztFQUlFOztBQUlGLHlGQUEyRjtBQUMzRixnRUFBa0U7QUFDbEUsaUNBQW1DO0FBR25DLG1DQUFxQztBQUNyQyw2REFBK0Q7QUFDL0QsNERBQThEO0FBQzlELHNEQUF3RDtBQUN4RCxtREFBcUQ7QUFFckQsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxVQUFlLENBQUM7QUFDcEIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNaLElBQUksYUFBYSxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDO0FBQ1QsSUFBSSxJQUFJLEdBQVksS0FBSyxDQUFDO0FBRTFCLElBQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBRS9CLElBQU0sY0FBYyxHQUFHO0lBQ3JCLHlDQUF5QztJQUV6QyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO1FBQ1AsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNsRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hCLEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxjQUFjO1lBQ2pCLENBQUMsRUFBRSxjQUFjO1NBQ2xCO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFD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QVMsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN0RSxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7QUFFM0IsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBUyxJQUFJO0lBQ3BDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVMsSUFBSTtJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNCLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5JbiBOYXRpdmVTY3JpcHQsIGEgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgYW4gWE1MIGZpbGUgaXMga25vd24gYXNcbmEgY29kZS1iZWhpbmQgZmlsZS4gVGhlIGNvZGUtYmVoaW5kIGlzIGEgZ3JlYXQgcGxhY2UgdG8gcGxhY2UgeW91ciB2aWV3XG5sb2dpYywgYW5kIHRvIHNldCB1cCB5b3VyIHBhZ2XigJlzIGRhdGEgYmluZGluZy5cbiovXG5cbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndWkvcGFnZSc7XG5pbXBvcnQgKiBhcyBjYW1lcmFQcmV2aWV3IGZyb20gJy4vbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3L25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldyc7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LXJvdGF0aW9uLXZlY3Rvci9pbmRleFwiO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0ICogYXMgZnJhbWVNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWVcIjtcbmltcG9ydCAqIGFzIGFuaW1hdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9hbmltYXRpb25cIjtcbmltcG9ydCAqIGFzIHBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xuaW1wb3J0ICogYXMgb3JpZW50YXRpb24gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zY3JlZW4tb3JpZW50YXRpb25cIjtcbmltcG9ydCAqIGFzIHBhcmFtcyBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtZm92L25hdGl2ZXNjcmlwdC1mb3ZcIjtcbmltcG9ydCAqIGFzIHBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcbmltcG9ydCAqIGFzIGNoYXJ0cyBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtY2hhcnQvY2hhcnRcIjtcblxubGV0IGNyb3NzaGFpcjogYW55O1xubGV0IGRvdWJsZWxpbmU6IGFueTtcbmxldCB1cHBlclRleHQ6IGFueTtcbmxldCBsb3dlclRleHQ6IGFueTtcbmxldCB4LCB5LCB6O1xubGV0IG1lYXN1cmVkV2lkdGg7XG5sZXQgcGFnZTtcbmxldCBpc09uOiBib29sZWFuID0gZmFsc2U7XG5cbmNvbnN0IE9VVEVSX0NJUkNMRV9ESUFNRVRFUiA9IDI7XG5jb25zdCBBTkdMRV9CRVRXRUVOX0xJTkVTID0gMTA7XG5cbmNvbnN0IHVwZGF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIC8vIGNvbnNvbGUubG9nKFwiRW50ZXJlZCB1cGRhdGVDYWxsYmFja1wiKTtcblxuICBpZihpc09uKXtcbiAgICBjaGFydHMudXBkYXRlR3JhcGgoeCx5KTtcbiAgfVxuXG4gIGNvbnN0IHlUcmFuc2xhdGUgPSBhcHAuaW9zPyAtMjAgOiAwO1xuICBjb25zdCBzY2FsZUNyb3NzaGFpciA9IHBhcmFtcy5kZWdyZWVzMlNjYWxlKE9VVEVSX0NJUkNMRV9ESUFNRVRFUiwgY3Jvc3NoYWlyLmdldE1lYXN1cmVkSGVpZ2h0KCkpO1xuICBjcm9zc2hhaXIuYW5pbWF0ZSh7XG4gICAgc2NhbGU6IHtcbiAgICAgIHg6IHNjYWxlQ3Jvc3NoYWlyLFxuICAgICAgeTogc2NhbGVDcm9zc2hhaXJcbiAgICB9LFxuICAgIHRyYW5zbGF0ZToge1xuICAgICAgeDogMCxcbiAgICAgIHk6IHlUcmFuc2xhdGVcbiAgICB9LFxuICAgIHJvdGF0ZTogLXosXG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG5cbiAgY29uc3Qgc2NhbGVEb3VibGVMaW5lID0gcGFyYW1zLmRlZ3JlZXMyU2NhbGUoQU5HTEVfQkVUV0VFTl9MSU5FUywgZG91YmxlbGluZS5nZXRNZWFzdXJlZEhlaWdodCgpKTtcbiAgY29uc3QgZGlzdGFuY2VGcm9tQ2VudGVyID0gcGFyYW1zLnBpeGVsczJEcCgocGFyYW1zLmRlZ3JlZXMyUGl4ZWxzKCgteSAlIEFOR0xFX0JFVFdFRU5fTElORVMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBBTkdMRV9CRVRXRUVOX0xJTkVTLzIgKiAoeT4wPyAtMTogMSkpKSk7XG4gIGxvd2VyVGV4dC50ZXh0ID0gMTAqIE1hdGguZmxvb3IoLXkvMTApO1xuICB1cHBlclRleHQudGV4dCA9IDEwKiBNYXRoLmZsb29yKCgteSsxMCkvMTApO1xuICBkb3VibGVsaW5lLmFuaW1hdGUoe1xuICAgIHNjYWxlOiB7XG4gICAgICB4OiBzY2FsZURvdWJsZUxpbmUsXG4gICAgICB5OiBzY2FsZURvdWJsZUxpbmVcbiAgICB9LFxuICAgIHRyYW5zbGF0ZToge1xuICAgICAgeCA6IE1hdGguc2luKHoqTWF0aC5QSS8xODApKmRpc3RhbmNlRnJvbUNlbnRlcixcbiAgICAgIHk6IE1hdGguY29zKHoqTWF0aC5QSS8xODApKmRpc3RhbmNlRnJvbUNlbnRlciArIHlUcmFuc2xhdGVcbiAgICB9LFxuXG4gICAgcm90YXRlOiAteixcbiAgICBkdXJhdGlvbjogMFxuICB9KTtcbiAgbG93ZXJUZXh0LmFuaW1hdGUoe1xuICAgIHRyYW5zbGF0ZToge1xuICAgICAgeCA6IE1hdGguc2luKHoqTWF0aC5QSS8xODApKiAoZGlzdGFuY2VGcm9tQ2VudGVyK3NjYWxlRG91YmxlTGluZSpwYXJhbXMuZGVncmVlczJQaXhlbHMoQU5HTEVfQkVUV0VFTl9MSU5FUy8yKSksXG4gICAgICB5IDogTWF0aC5jb3MoeipNYXRoLlBJLzE4MCkqIChkaXN0YW5jZUZyb21DZW50ZXIrc2NhbGVEb3VibGVMaW5lKnBhcmFtcy5kZWdyZWVzMlBpeGVscyhBTkdMRV9CRVRXRUVOX0xJTkVTLzIpKSArIHlUcmFuc2xhdGVcbiAgICB9LFxuICAgIHJvdGF0ZTogLXosXG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG4gIHVwcGVyVGV4dC5hbmltYXRlKHtcbiAgICB0cmFuc2xhdGU6IHtcbiAgICAgIHggOiAgTWF0aC5zaW4oeipNYXRoLlBJLzE4MCkqIChkaXN0YW5jZUZyb21DZW50ZXItc2NhbGVEb3VibGVMaW5lKnBhcmFtcy5kZWdyZWVzMlBpeGVscyhBTkdMRV9CRVRXRUVOX0xJTkVTLzIpKSxcbiAgICAgIHkgOiAgTWF0aC5jb3MoeipNYXRoLlBJLzE4MCkqIChkaXN0YW5jZUZyb21DZW50ZXItc2NhbGVEb3VibGVMaW5lKnBhcmFtcy5kZWdyZWVzMlBpeGVscyhBTkdMRV9CRVRXRUVOX0xJTkVTLzIpKSArIHlUcmFuc2xhdGVcbiAgICB9LFxuICAgIHJvdGF0ZTogLXosXG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG4gIGlmIChhcHAuaW9zKSB7XG4gICAgbGV0IGNhbWVyYVZpZXcgPSBwYWdlLmdldFZpZXdCeUlkKFwicGxhY2Vob2xkZXItdmlld1wiKTtcbiAgICBjYW1lcmFWaWV3LmFuaW1hdGUoe1xuICAgICAgc2NhbGU6IHtcbiAgICAgICAgeDogcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0UGl4ZWxzL2NhbWVyYVZpZXcuZ2V0TWVhc3VyZWRIZWlnaHQoKSxcbiAgICAgICAgeTogcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0UGl4ZWxzL2NhbWVyYVZpZXcuZ2V0TWVhc3VyZWRIZWlnaHQoKVxuICAgICAgfSxcbiAgICAgIHRyYW5zbGF0ZToge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiBhcHAuaW9zPyAtMTAgOiAwXG4gICAgICB9LFxuICAgICAgZHVyYXRpb246IDIwMDBcbiAgICB9KTtcbiAgfVxuXG59O1xuXG5jb25zdCByb3RhdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vY29uc29sZS5sb2coXCJ4OiBcIiArIGRhdGEueCArIFwiIHk6IFwiICsgZGF0YS55ICsgXCIgejogXCIgKyBkYXRhLnopO1xuICAgIHggPSBkYXRhLng7XG4gICAgeSA9IGRhdGEueTtcbiAgICB6ID0gZGF0YS56O1xuICAgIGlmKGFwcC5pb3MpIHVwZGF0ZUNhbGxiYWNrKCk7IC8vIGlvcyBkb2Vzbid0IHNlZW0gdG8gZXhwb3NlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGZyYW1lIHVwZGF0ZSBpbiB0aGUgY2FtZXJhIHByZXZpZXc7IHRoZXJlZm9yZSwgd2UnbGwgaG9wIG9uIHRoZSByb3RhdGlvbiBjYWxsYmFja1xufTtcblxuLy8gZXhwb3J0IGZ1bmN0aW9uIHNob3dTaWRlRHJhd2VyKGFyZ3M6IEV2ZW50RGF0YSkge1xuLy8gICAgIGNvbnNvbGUubG9nKFwiU2hvdyBTaWRlRHJhd2VyIHRhcHBlZC5cIik7XG4vLyB9XG5cbi8vVE9ETzogc3BsaXQgdXAgdGhlIGNvZGVcbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWRlZChhcmdzOiBFdmVudERhdGEpIHtcbiAgb3JpZW50YXRpb24uc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIiwgKCkgPT4ge30pO1xuICBpZiAoYXBwLmFuZHJvaWQgJiYgcGxhdGZvcm0uZGV2aWNlLnNka1ZlcnNpb24gPj0gJzIxJykge1xuICAgICAgY29uc3QgVmlldyA6YW55ID0gYW5kcm9pZC52aWV3LlZpZXc7XG4gICAgICBjb25zdCB3aW5kb3cgPSBhcHAuYW5kcm9pZC5zdGFydEFjdGl2aXR5LmdldFdpbmRvdygpO1xuICAgICAgLy8gc2V0IHRoZSBzdGF0dXMgYmFyIHRvIENvbG9yLlRyYW5zcGFyZW50XG4gICAgICAvLyB3aW5kb3cuc2V0U3RhdHVzQmFyQ29sb3IoMHgwMDAwMDApO1xuICAgICAgY29uc3QgZGVjb3JWaWV3ID0gd2luZG93LmdldERlY29yVmlldygpO1xuICAgICAgZGVjb3JWaWV3LnNldFN5c3RlbVVpVmlzaWJpbGl0eShcbiAgICAgICAgICBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9TVEFCTEVcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX0hJREVfTkFWSUdBVElPTlxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfRlVMTFNDUkVFTlxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19ISURFX05BVklHQVRJT04gLy8gaGlkZSBuYXYgYmFyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0ZVTExTQ1JFRU4gLy8gaGlkZSBzdGF0dXMgYmFyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0lNTUVSU0lWRV9TVElDS1kpO1xuICB9XG4gIGNhbWVyYVByZXZpZXcub25Mb2FkZWQoYXJncywgXCJwbGFjZWhvbGRlci12aWV3XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25DcmVhdGluZ1ZpZXcoYXJnczogRXZlbnREYXRhKSB7XG4gIGNoYXJ0cy5pbml0R3JhcGgocGFnZSk7XG4gIGlmKGFwcC5hbmRyb2lkKSB7XG4gICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oYW5kcm9pZFtcIk1hbmlmZXN0XCJdLnBlcm1pc3Npb24uQ0FNRVJBLCBcIkkgbmVlZCB0aGVzZSBwZXJtaXNzaW9ucyBmb3IgdGhlIHZpZXdmaW5kZXJcIilcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIldvbyBIb28sIEkgaGF2ZSB0aGUgcG93ZXIhXCIpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgIGNvbnNvbGUubG9nKFwiVWggb2gsIG5vIHBlcm1pc3Npb25zIC0gcGxhbiBCIHRpbWUhXCIpO1xuICAgIH0pO1xuICB9XG4gIGlmKGFwcC5hbmRyb2lkKSBwYXJhbXMuaW5pdGlhbGl6ZSgpO1xuICBjYW1lcmFQcmV2aWV3Lm9uQ3JlYXRpbmdWaWV3KHVwZGF0ZUNhbGxiYWNrLCBhcmdzKTtcbiAgaWYgKGFwcC5pb3MgIT09IHVuZGVmaW5lZCkgcGFyYW1zLmluaXRpYWxpemUoKTtcbiAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhyb3RhdGlvbkNhbGxiYWNrLCAgeyBzZW5zb3JEZWxheTogXCJnYW1lXCIgfSk7XG4gIGNvbnN0IG1heFNpemUgPSBjYW1lcmFQcmV2aWV3LmdldE1heFNpemUoKTtcbiAgcGFyYW1zLnNldFZhcnMobWF4U2l6ZVswXSwgbWF4U2l6ZVsxXSk7XG4gIG1lYXN1cmVkV2lkdGggPSBwYXJhbXMuZGVncmVlczJQaXhlbHMoT1VURVJfQ0lSQ0xFX0RJQU1FVEVSKTtcbiAgLy8gY29uc29sZS5sb2cocGFyYW1zLmdldFZlcnRpY2FsRk9WKCkgKyBcIiBcIiArIHBhcmFtcy5nZXRIb3Jpem9udGFsRk9WKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25UYWtlU2hvdChhcmdzOiBFdmVudERhdGEpIHtcbiAgY2FtZXJhUHJldmlldy5vblRha2VTaG90KGFyZ3MpO1xuICBpc09uID0gIWlzT247XG4gIGNvbnNvbGUubG9nKFwiZWw6IFwiICsgeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0aW5nVG8oYXJnczogRXZlbnREYXRhKSB7XG4gICAgcGFnZSA9IDxQYWdlPmFyZ3Mub2JqZWN0O1xuICAgIGNyb3NzaGFpciA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJjcm9zc2hhaXJcIik7XG4gICAgZG91YmxlbGluZSA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJkb3VibGVsaW5lXCIpO1xuICAgIHVwcGVyVGV4dCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJ1cHBlclRleHRcIik7XG4gICAgbG93ZXJUZXh0ID0gcGFnZS5nZXRWaWV3QnlJZChcImxvd2VyVGV4dFwiKTtcbn1cblxuYXBwLm9uKGFwcC5yZXN1bWVFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKHJvdGF0aW9uQ2FsbGJhY2ssICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcbiAgY2FtZXJhUHJldmlldy5vblJlc3VtZSgpO1xuXG59KTtcbmFwcC5vbihhcHAuc3VzcGVuZEV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XG4gIGNhbWVyYVByZXZpZXcub25QYXVzZSgpO1xuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcbiAgY2hhcnRzLm9uRXhpdCgpO1xufSk7XG5hcHAub24oYXBwLmV4aXRFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICBjb25zb2xlLmxvZyhcIk9uIEV4aXR0aW5nXCIpO1xuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcbn0pO1xuIl19