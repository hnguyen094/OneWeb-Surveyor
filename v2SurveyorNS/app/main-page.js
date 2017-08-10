/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_view_model_1 = require("./main-view-model");
var cameraPreview = require("./nativescript-camera-preview/nativescript-camera-preview");
var rotVector = require("./nativescript-rotation-vector/index");
var app = require("application");
var platform = require("platform");
var orientation = require("nativescript-screen-orientation");
var params = require("./nativescript-fov/nativescript-fov");
var permissions = require("nativescript-permissions");
var crosshair;
var doubleline;
var upperText;
var lowerText;
var x, y, z;
var measuredWidth;
var page;
var OUTER_CIRCLE_DIAMETER = 2;
var ANGLE_BETWEEN_LINES = 10;
var updateCallback = function () {
    // console.log("Entered updateCallback");
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
    rotVector.startRotUpdates(function (data) {
        //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        x = data.x;
        y = data.y;
        z = data.z;
        if (app.ios)
            updateCallback(); // ios doesn't seem to expose a callback for every frame update in the camera preview; therefore, we'll hop on the rotation callback
    }, { sensorDelay: "game" });
    var maxSize = cameraPreview.getMaxSize();
    params.setVars(maxSize[0], maxSize[1]);
    measuredWidth = params.degrees2Pixels(OUTER_CIRCLE_DIAMETER);
    // console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}
exports.onCreatingView = onCreatingView;
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
    console.log("el: " + y);
}
exports.onTakeShot = onTakeShot;
function navigatingTo(args) {
    page = args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
    page.bindingContext = new main_view_model_1.HelloWorldModel();
}
exports.navigatingTo = navigatingTo;
app.on(app.resumeEvent, function (args) {
    rotVector.startRotUpdates(function (data) {
        //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        x = data.x;
        y = data.y;
        z = data.z;
        if (app.ios)
            updateCallback(); // ios doesn't seem to expose a callback for every frame update in the camera preview; therefore, we'll hop on the rotation callback
    }, { sensorDelay: "game" });
    cameraPreview.onResume();
});
app.on(app.suspendEvent, function (args) {
    cameraPreview.onPause();
    rotVector.stopRotUpdates();
});
app.on(app.exitEvent, function (args) {
    rotVector.stopRotUpdates();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUlGLHFEQUFvRDtBQUNwRCx5RkFBMkY7QUFDM0YsZ0VBQWtFO0FBQ2xFLGlDQUFtQztBQUduQyxtQ0FBcUM7QUFDckMsNkRBQStEO0FBQy9ELDREQUE4RDtBQUM5RCxzREFBd0Q7QUFFeEQsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxVQUFlLENBQUM7QUFDcEIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNaLElBQUksYUFBYSxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDO0FBRVQsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFFL0IsSUFBTSxjQUFjLEdBQUc7SUFDckIseUNBQXlDO0lBQ3pDLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNsRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hCLEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxjQUFjO1lBQ2pCLENBQUMsRUFBRSxjQUFjO1NBQ2xCO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsVUFBVTtTQUNkO1FBQ0QsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNWLFFBQVEsRUFBRSxDQUFDO0tBQ1osQ0FBQyxDQUFDO0lBRUgsSUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFV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QyxjQUFjLEVBQUUsQ0FBQyxDQUFDLG9JQUFvSTtJQUN0SyxDQUFDLEVBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3QixhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7QUFFM0IsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBUyxJQUFJO0lBQ3BDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBUyxJQUFJO0lBQ2pDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5JbiBOYXRpdmVTY3JpcHQsIGEgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgYW4gWE1MIGZpbGUgaXMga25vd24gYXNcbmEgY29kZS1iZWhpbmQgZmlsZS4gVGhlIGNvZGUtYmVoaW5kIGlzIGEgZ3JlYXQgcGxhY2UgdG8gcGxhY2UgeW91ciB2aWV3XG5sb2dpYywgYW5kIHRvIHNldCB1cCB5b3VyIHBhZ2XigJlzIGRhdGEgYmluZGluZy5cbiovXG5cbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndWkvcGFnZSc7XG5pbXBvcnQgeyBIZWxsb1dvcmxkTW9kZWwgfSBmcm9tICcuL21haW4tdmlldy1tb2RlbCc7XG5pbXBvcnQgKiBhcyBjYW1lcmFQcmV2aWV3IGZyb20gJy4vbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3L25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldyc7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LXJvdGF0aW9uLXZlY3Rvci9pbmRleFwiO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0ICogYXMgZnJhbWVNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWVcIjtcbmltcG9ydCAqIGFzIGFuaW1hdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9hbmltYXRpb25cIjtcbmltcG9ydCAqIGFzIHBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xuaW1wb3J0ICogYXMgb3JpZW50YXRpb24gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zY3JlZW4tb3JpZW50YXRpb25cIjtcbmltcG9ydCAqIGFzIHBhcmFtcyBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtZm92L25hdGl2ZXNjcmlwdC1mb3ZcIjtcbmltcG9ydCAqIGFzIHBlcm1pc3Npb25zIGZyb20gXCJuYXRpdmVzY3JpcHQtcGVybWlzc2lvbnNcIjtcblxubGV0IGNyb3NzaGFpciA6YW55O1xubGV0IGRvdWJsZWxpbmUgOmFueTtcbmxldCB1cHBlclRleHQgOmFueTtcbmxldCBsb3dlclRleHQgOmFueTtcbmxldCB4LCB5LCB6O1xubGV0IG1lYXN1cmVkV2lkdGg7XG5sZXQgcGFnZTtcblxuY29uc3QgT1VURVJfQ0lSQ0xFX0RJQU1FVEVSID0gMjtcbmNvbnN0IEFOR0xFX0JFVFdFRU5fTElORVMgPSAxMDtcblxuY29uc3QgdXBkYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgLy8gY29uc29sZS5sb2coXCJFbnRlcmVkIHVwZGF0ZUNhbGxiYWNrXCIpO1xuICBjb25zdCB5VHJhbnNsYXRlID0gYXBwLmlvcz8gLTIwIDogMDtcbiAgY29uc3Qgc2NhbGVDcm9zc2hhaXIgPSBwYXJhbXMuZGVncmVlczJTY2FsZShPVVRFUl9DSVJDTEVfRElBTUVURVIsIGNyb3NzaGFpci5nZXRNZWFzdXJlZEhlaWdodCgpKTtcbiAgY3Jvc3NoYWlyLmFuaW1hdGUoe1xuICAgIHNjYWxlOiB7XG4gICAgICB4OiBzY2FsZUNyb3NzaGFpcixcbiAgICAgIHk6IHNjYWxlQ3Jvc3NoYWlyXG4gICAgfSxcbiAgICB0cmFuc2xhdGU6IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiB5VHJhbnNsYXRlXG4gICAgfSxcbiAgICByb3RhdGU6IC16LFxuICAgIGR1cmF0aW9uOiAwXG4gIH0pO1xuXG4gIGNvbnN0IHNjYWxlRG91YmxlTGluZSA9IHBhcmFtcy5kZWdyZWVzMlNjYWxlKEFOR0xFX0JFVFdFRU5fTElORVMsIGRvdWJsZWxpbmUuZ2V0TWVhc3VyZWRIZWlnaHQoKSk7XG4gIGNvbnN0IGRpc3RhbmNlRnJvbUNlbnRlciA9IHBhcmFtcy5waXhlbHMyRHAoKHBhcmFtcy5kZWdyZWVzMlBpeGVscygoLXkgJSBBTkdMRV9CRVRXRUVOX0xJTkVTKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gQU5HTEVfQkVUV0VFTl9MSU5FUy8yICogKHk+MD8gLTE6IDEpKSkpO1xuICBsb3dlclRleHQudGV4dCA9IDEwKiBNYXRoLmZsb29yKC15LzEwKTtcbiAgdXBwZXJUZXh0LnRleHQgPSAxMCogTWF0aC5mbG9vcigoLXkrMTApLzEwKTtcbiAgZG91YmxlbGluZS5hbmltYXRlKHtcbiAgICBzY2FsZToge1xuICAgICAgeDogc2NhbGVEb3VibGVMaW5lLFxuICAgICAgeTogc2NhbGVEb3VibGVMaW5lXG4gICAgfSxcbiAgICB0cmFuc2xhdGU6IHtcbiAgICAgIHggOiBNYXRoLnNpbih6Kk1hdGguUEkvMTgwKSpkaXN0YW5jZUZyb21DZW50ZXIsXG4gICAgICB5OiBNYXRoLmNvcyh6Kk1hdGguUEkvMTgwKSpkaXN0YW5jZUZyb21DZW50ZXIgKyB5VHJhbnNsYXRlXG4gICAgfSxcblxuICAgIHJvdGF0ZTogLXosXG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG4gIGxvd2VyVGV4dC5hbmltYXRlKHtcbiAgICB0cmFuc2xhdGU6IHtcbiAgICAgIHggOiBNYXRoLnNpbih6Kk1hdGguUEkvMTgwKSogKGRpc3RhbmNlRnJvbUNlbnRlcitzY2FsZURvdWJsZUxpbmUqcGFyYW1zLmRlZ3JlZXMyUGl4ZWxzKEFOR0xFX0JFVFdFRU5fTElORVMvMikpLFxuICAgICAgeSA6IE1hdGguY29zKHoqTWF0aC5QSS8xODApKiAoZGlzdGFuY2VGcm9tQ2VudGVyK3NjYWxlRG91YmxlTGluZSpwYXJhbXMuZGVncmVlczJQaXhlbHMoQU5HTEVfQkVUV0VFTl9MSU5FUy8yKSkgKyB5VHJhbnNsYXRlXG4gICAgfSxcbiAgICByb3RhdGU6IC16LFxuICAgIGR1cmF0aW9uOiAwXG4gIH0pO1xuICB1cHBlclRleHQuYW5pbWF0ZSh7XG4gICAgdHJhbnNsYXRlOiB7XG4gICAgICB4IDogIE1hdGguc2luKHoqTWF0aC5QSS8xODApKiAoZGlzdGFuY2VGcm9tQ2VudGVyLXNjYWxlRG91YmxlTGluZSpwYXJhbXMuZGVncmVlczJQaXhlbHMoQU5HTEVfQkVUV0VFTl9MSU5FUy8yKSksXG4gICAgICB5IDogIE1hdGguY29zKHoqTWF0aC5QSS8xODApKiAoZGlzdGFuY2VGcm9tQ2VudGVyLXNjYWxlRG91YmxlTGluZSpwYXJhbXMuZGVncmVlczJQaXhlbHMoQU5HTEVfQkVUV0VFTl9MSU5FUy8yKSkgKyB5VHJhbnNsYXRlXG4gICAgfSxcbiAgICByb3RhdGU6IC16LFxuICAgIGR1cmF0aW9uOiAwXG4gIH0pO1xuICBpZiAoYXBwLmlvcykge1xuICAgIGxldCBjYW1lcmFWaWV3ID0gcGFnZS5nZXRWaWV3QnlJZChcInBsYWNlaG9sZGVyLXZpZXdcIik7XG4gICAgY2FtZXJhVmlldy5hbmltYXRlKHtcbiAgICAgIHNjYWxlOiB7XG4gICAgICAgIHg6IHBsYXRmb3JtLnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodFBpeGVscy9jYW1lcmFWaWV3LmdldE1lYXN1cmVkSGVpZ2h0KCksXG4gICAgICAgIHk6IHBsYXRmb3JtLnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodFBpeGVscy9jYW1lcmFWaWV3LmdldE1lYXN1cmVkSGVpZ2h0KClcbiAgICAgIH0sXG4gICAgICB0cmFuc2xhdGU6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogYXBwLmlvcz8gLTEwIDogMFxuICAgICAgfSxcbiAgICAgIGR1cmF0aW9uOiAyMDAwXG4gICAgfSk7XG4gIH1cblxufTtcblxuLy8gZXhwb3J0IGZ1bmN0aW9uIHNob3dTaWRlRHJhd2VyKGFyZ3M6IEV2ZW50RGF0YSkge1xuLy8gICAgIGNvbnNvbGUubG9nKFwiU2hvdyBTaWRlRHJhd2VyIHRhcHBlZC5cIik7XG4vLyB9XG5cbi8vVE9ETzogc3BsaXQgdXAgdGhlIGNvZGVcbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWRlZChhcmdzOiBFdmVudERhdGEpIHtcbiAgb3JpZW50YXRpb24uc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIiwgKCkgPT4ge30pO1xuICBpZiAoYXBwLmFuZHJvaWQgJiYgcGxhdGZvcm0uZGV2aWNlLnNka1ZlcnNpb24gPj0gJzIxJykge1xuICAgICAgY29uc3QgVmlldyA6YW55ID0gYW5kcm9pZC52aWV3LlZpZXc7XG4gICAgICBjb25zdCB3aW5kb3cgPSBhcHAuYW5kcm9pZC5zdGFydEFjdGl2aXR5LmdldFdpbmRvdygpO1xuICAgICAgLy8gc2V0IHRoZSBzdGF0dXMgYmFyIHRvIENvbG9yLlRyYW5zcGFyZW50XG4gICAgICAvLyB3aW5kb3cuc2V0U3RhdHVzQmFyQ29sb3IoMHgwMDAwMDApO1xuICAgICAgY29uc3QgZGVjb3JWaWV3ID0gd2luZG93LmdldERlY29yVmlldygpO1xuICAgICAgZGVjb3JWaWV3LnNldFN5c3RlbVVpVmlzaWJpbGl0eShcbiAgICAgICAgICBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9TVEFCTEVcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX0hJREVfTkFWSUdBVElPTlxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfRlVMTFNDUkVFTlxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19ISURFX05BVklHQVRJT04gLy8gaGlkZSBuYXYgYmFyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0ZVTExTQ1JFRU4gLy8gaGlkZSBzdGF0dXMgYmFyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0lNTUVSU0lWRV9TVElDS1kpO1xuICB9XG4gIGNhbWVyYVByZXZpZXcub25Mb2FkZWQoYXJncywgXCJwbGFjZWhvbGRlci12aWV3XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25DcmVhdGluZ1ZpZXcoYXJnczogRXZlbnREYXRhKSB7XG4gIGlmKGFwcC5hbmRyb2lkKSB7XG4gICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oYW5kcm9pZFtcIk1hbmlmZXN0XCJdLnBlcm1pc3Npb24uQ0FNRVJBLCBcIkkgbmVlZCB0aGVzZSBwZXJtaXNzaW9ucyBmb3IgdGhlIHZpZXdmaW5kZXJcIilcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIldvbyBIb28sIEkgaGF2ZSB0aGUgcG93ZXIhXCIpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgIGNvbnNvbGUubG9nKFwiVWggb2gsIG5vIHBlcm1pc3Npb25zIC0gcGxhbiBCIHRpbWUhXCIpO1xuICAgIH0pO1xuICB9XG4gIGlmKGFwcC5hbmRyb2lkKSBwYXJhbXMuaW5pdGlhbGl6ZSgpO1xuICBjYW1lcmFQcmV2aWV3Lm9uQ3JlYXRpbmdWaWV3KHVwZGF0ZUNhbGxiYWNrLCBhcmdzKTtcbiAgaWYgKGFwcC5pb3MgIT09IHVuZGVmaW5lZCkgcGFyYW1zLmluaXRpYWxpemUoKTtcbiAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcIiB5OiBcIiArIGRhdGEueSArIFwiIHo6IFwiICsgZGF0YS56KTtcbiAgICAgIHggPSBkYXRhLng7XG4gICAgICB5ID0gZGF0YS55O1xuICAgICAgeiA9IGRhdGEuejtcbiAgICAgIGlmKGFwcC5pb3MpIHVwZGF0ZUNhbGxiYWNrKCk7IC8vIGlvcyBkb2Vzbid0IHNlZW0gdG8gZXhwb3NlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGZyYW1lIHVwZGF0ZSBpbiB0aGUgY2FtZXJhIHByZXZpZXc7IHRoZXJlZm9yZSwgd2UnbGwgaG9wIG9uIHRoZSByb3RhdGlvbiBjYWxsYmFja1xuICB9LCAgeyBzZW5zb3JEZWxheTogXCJnYW1lXCIgfSk7XG4gIGNvbnN0IG1heFNpemUgPSBjYW1lcmFQcmV2aWV3LmdldE1heFNpemUoKTtcbiAgcGFyYW1zLnNldFZhcnMobWF4U2l6ZVswXSwgbWF4U2l6ZVsxXSk7XG4gIG1lYXN1cmVkV2lkdGggPSBwYXJhbXMuZGVncmVlczJQaXhlbHMoT1VURVJfQ0lSQ0xFX0RJQU1FVEVSKTtcbiAgLy8gY29uc29sZS5sb2cocGFyYW1zLmdldFZlcnRpY2FsRk9WKCkgKyBcIiBcIiArIHBhcmFtcy5nZXRIb3Jpem9udGFsRk9WKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25UYWtlU2hvdChhcmdzOiBFdmVudERhdGEpIHtcbiAgY2FtZXJhUHJldmlldy5vblRha2VTaG90KGFyZ3MpO1xuICBjb25zb2xlLmxvZyhcImVsOiBcIiArIHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGluZ1RvKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIHBhZ2UgPSA8UGFnZT5hcmdzLm9iamVjdDtcbiAgICBjcm9zc2hhaXIgPSBwYWdlLmdldFZpZXdCeUlkKFwiY3Jvc3NoYWlyXCIpO1xuICAgIGRvdWJsZWxpbmUgPSBwYWdlLmdldFZpZXdCeUlkKFwiZG91YmxlbGluZVwiKTtcbiAgICB1cHBlclRleHQgPSBwYWdlLmdldFZpZXdCeUlkKFwidXBwZXJUZXh0XCIpO1xuICAgIGxvd2VyVGV4dCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJsb3dlclRleHRcIik7XG4gICAgcGFnZS5iaW5kaW5nQ29udGV4dCA9IG5ldyBIZWxsb1dvcmxkTW9kZWwoKTtcbn1cblxuYXBwLm9uKGFwcC5yZXN1bWVFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJ4OiBcIiArIGRhdGEueCArIFwiIHk6IFwiICsgZGF0YS55ICsgXCIgejogXCIgKyBkYXRhLnopO1xuICAgICAgeCA9IGRhdGEueDtcbiAgICAgIHkgPSBkYXRhLnk7XG4gICAgICB6ID0gZGF0YS56O1xuICAgICAgaWYoYXBwLmlvcykgdXBkYXRlQ2FsbGJhY2soKTsgLy8gaW9zIGRvZXNuJ3Qgc2VlbSB0byBleHBvc2UgYSBjYWxsYmFjayBmb3IgZXZlcnkgZnJhbWUgdXBkYXRlIGluIHRoZSBjYW1lcmEgcHJldmlldzsgdGhlcmVmb3JlLCB3ZSdsbCBob3Agb24gdGhlIHJvdGF0aW9uIGNhbGxiYWNrXG4gIH0sICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcbiAgY2FtZXJhUHJldmlldy5vblJlc3VtZSgpO1xuXG59KTtcbmFwcC5vbihhcHAuc3VzcGVuZEV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XG4gIGNhbWVyYVByZXZpZXcub25QYXVzZSgpO1xuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcbn0pO1xuYXBwLm9uKGFwcC5leGl0RXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcbiAgcm90VmVjdG9yLnN0b3BSb3RVcGRhdGVzKCk7XG59KTtcbiJdfQ==