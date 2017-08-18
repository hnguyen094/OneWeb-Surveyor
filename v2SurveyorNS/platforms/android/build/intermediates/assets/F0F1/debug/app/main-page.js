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
var OUTER_CIRCLE_DIAMETER = 2;
var ANGLE_BETWEEN_LINES = 10;
var updateCallback = function () {
    // console.log("Entered updateCallback");
    charts.updateGraph(x, y);
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
    if (app.android) {
        permissions.requestPermission(android["Manifest"].permission.CAMERA, "I need these permissions for the viewfinder")
            .then(function () {
            console.log("Woo Hoo, I have the power!");
            charts.initGraph(page);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztFQUlFOztBQUlGLHlGQUEyRjtBQUMzRixnRUFBa0U7QUFDbEUsaUNBQW1DO0FBR25DLG1DQUFxQztBQUNyQyw2REFBK0Q7QUFDL0QsNERBQThEO0FBQzlELHNEQUF3RDtBQUN4RCxtREFBcUQ7QUFFckQsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxVQUFlLENBQUM7QUFDcEIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNaLElBQUksYUFBYSxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDO0FBRVQsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFFL0IsSUFBTSxjQUFjLEdBQUc7SUFDckIseUNBQXlDO0lBRXpDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhCLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNsRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hCLEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxjQUFjO1lBQ2pCLENBQUMsRUFBRSxjQUFjO1NBQ2xCO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsVUFBVTtTQUNkO1FBQ0QsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNWLFFBQVEsRUFBRSxDQUFDO0tBQ1osQ0FBQyxDQUFDO0lBRUgs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LENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBUyxJQUFJO0lBQ3BDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVMsSUFBSTtJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNCLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbkluIE5hdGl2ZVNjcmlwdCwgYSBmaWxlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBhbiBYTUwgZmlsZSBpcyBrbm93biBhc1xyXG5hIGNvZGUtYmVoaW5kIGZpbGUuIFRoZSBjb2RlLWJlaGluZCBpcyBhIGdyZWF0IHBsYWNlIHRvIHBsYWNlIHlvdXIgdmlld1xyXG5sb2dpYywgYW5kIHRvIHNldCB1cCB5b3VyIHBhZ2XigJlzIGRhdGEgYmluZGluZy5cclxuKi9cclxuXHJcbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICd1aS9wYWdlJztcclxuaW1wb3J0ICogYXMgY2FtZXJhUHJldmlldyBmcm9tICcuL25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldy9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXcnO1xyXG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LXJvdGF0aW9uLXZlY3Rvci9pbmRleFwiO1xyXG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCAqIGFzIGZyYW1lTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lXCI7XHJcbmltcG9ydCAqIGFzIGFuaW1hdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9hbmltYXRpb25cIjtcclxuaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCAqIGFzIG9yaWVudGF0aW9uIGZyb20gXCJuYXRpdmVzY3JpcHQtc2NyZWVuLW9yaWVudGF0aW9uXCI7XHJcbmltcG9ydCAqIGFzIHBhcmFtcyBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtZm92L25hdGl2ZXNjcmlwdC1mb3ZcIjtcclxuaW1wb3J0ICogYXMgcGVybWlzc2lvbnMgZnJvbSBcIm5hdGl2ZXNjcmlwdC1wZXJtaXNzaW9uc1wiO1xyXG5pbXBvcnQgKiBhcyBjaGFydHMgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWNoYXJ0L2NoYXJ0XCI7XHJcblxyXG5sZXQgY3Jvc3NoYWlyIDphbnk7XHJcbmxldCBkb3VibGVsaW5lIDphbnk7XHJcbmxldCB1cHBlclRleHQgOmFueTtcclxubGV0IGxvd2VyVGV4dCA6YW55O1xyXG5sZXQgeCwgeSwgejtcclxubGV0IG1lYXN1cmVkV2lkdGg7XHJcbmxldCBwYWdlO1xyXG5cclxuY29uc3QgT1VURVJfQ0lSQ0xFX0RJQU1FVEVSID0gMjtcclxuY29uc3QgQU5HTEVfQkVUV0VFTl9MSU5FUyA9IDEwO1xyXG5cclxuY29uc3QgdXBkYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICAvLyBjb25zb2xlLmxvZyhcIkVudGVyZWQgdXBkYXRlQ2FsbGJhY2tcIik7XHJcblxyXG4gIGNoYXJ0cy51cGRhdGVHcmFwaCh4LHkpO1xyXG5cclxuICBjb25zdCB5VHJhbnNsYXRlID0gYXBwLmlvcz8gLTIwIDogMDtcclxuICBjb25zdCBzY2FsZUNyb3NzaGFpciA9IHBhcmFtcy5kZWdyZWVzMlNjYWxlKE9VVEVSX0NJUkNMRV9ESUFNRVRFUiwgY3Jvc3NoYWlyLmdldE1lYXN1cmVkSGVpZ2h0KCkpO1xyXG4gIGNyb3NzaGFpci5hbmltYXRlKHtcclxuICAgIHNjYWxlOiB7XHJcbiAgICAgIHg6IHNjYWxlQ3Jvc3NoYWlyLFxyXG4gICAgICB5OiBzY2FsZUNyb3NzaGFpclxyXG4gICAgfSxcclxuICAgIHRyYW5zbGF0ZToge1xyXG4gICAgICB4OiAwLFxyXG4gICAgICB5OiB5VHJhbnNsYXRlXHJcbiAgICB9LFxyXG4gICAgcm90YXRlOiAteixcclxuICAgIGR1cmF0aW9uOiAwXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNjYWxlRG91YmxlTGluZSA9IHBhcmFtcy5kZWdyZWVzMlNjYWxlKEFOR0xFX0JFVFdFRU5fTElORVMsIGRvdWJsZWxpbmUuZ2V0TWVhc3VyZWRIZWlnaHQoKSk7XHJcbiAgY29uc3QgZGlzdGFuY2VGcm9tQ2VudGVyID0gcGFyYW1zLnBpeGVsczJEcCgocGFyYW1zLmRlZ3JlZXMyUGl4ZWxzKCgteSAlIEFOR0xFX0JFVFdFRU5fTElORVMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEFOR0xFX0JFVFdFRU5fTElORVMvMiAqICh5PjA/IC0xOiAxKSkpKTtcclxuICBsb3dlclRleHQudGV4dCA9IDEwKiBNYXRoLmZsb29yKC15LzEwKTtcclxuICB1cHBlclRleHQudGV4dCA9IDEwKiBNYXRoLmZsb29yKCgteSsxMCkvMTApO1xyXG4gIGRvdWJsZWxpbmUuYW5pbWF0ZSh7XHJcbiAgICBzY2FsZToge1xyXG4gICAgICB4OiBzY2FsZURvdWJsZUxpbmUsXHJcbiAgICAgIHk6IHNjYWxlRG91YmxlTGluZVxyXG4gICAgfSxcclxuICAgIHRyYW5zbGF0ZToge1xyXG4gICAgICB4IDogTWF0aC5zaW4oeipNYXRoLlBJLzE4MCkqZGlzdGFuY2VGcm9tQ2VudGVyLFxyXG4gICAgICB5OiBNYXRoLmNvcyh6Kk1hdGguUEkvMTgwKSpkaXN0YW5jZUZyb21DZW50ZXIgKyB5VHJhbnNsYXRlXHJcbiAgICB9LFxyXG5cclxuICAgIHJvdGF0ZTogLXosXHJcbiAgICBkdXJhdGlvbjogMFxyXG4gIH0pO1xyXG4gIGxvd2VyVGV4dC5hbmltYXRlKHtcclxuICAgIHRyYW5zbGF0ZToge1xyXG4gICAgICB4IDogTWF0aC5zaW4oeipNYXRoLlBJLzE4MCkqIChkaXN0YW5jZUZyb21DZW50ZXIrc2NhbGVEb3VibGVMaW5lKnBhcmFtcy5kZWdyZWVzMlBpeGVscyhBTkdMRV9CRVRXRUVOX0xJTkVTLzIpKSxcclxuICAgICAgeSA6IE1hdGguY29zKHoqTWF0aC5QSS8xODApKiAoZGlzdGFuY2VGcm9tQ2VudGVyK3NjYWxlRG91YmxlTGluZSpwYXJhbXMuZGVncmVlczJQaXhlbHMoQU5HTEVfQkVUV0VFTl9MSU5FUy8yKSkgKyB5VHJhbnNsYXRlXHJcbiAgICB9LFxyXG4gICAgcm90YXRlOiAteixcclxuICAgIGR1cmF0aW9uOiAwXHJcbiAgfSk7XHJcbiAgdXBwZXJUZXh0LmFuaW1hdGUoe1xyXG4gICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgIHggOiAgTWF0aC5zaW4oeipNYXRoLlBJLzE4MCkqIChkaXN0YW5jZUZyb21DZW50ZXItc2NhbGVEb3VibGVMaW5lKnBhcmFtcy5kZWdyZWVzMlBpeGVscyhBTkdMRV9CRVRXRUVOX0xJTkVTLzIpKSxcclxuICAgICAgeSA6ICBNYXRoLmNvcyh6Kk1hdGguUEkvMTgwKSogKGRpc3RhbmNlRnJvbUNlbnRlci1zY2FsZURvdWJsZUxpbmUqcGFyYW1zLmRlZ3JlZXMyUGl4ZWxzKEFOR0xFX0JFVFdFRU5fTElORVMvMikpICsgeVRyYW5zbGF0ZVxyXG4gICAgfSxcclxuICAgIHJvdGF0ZTogLXosXHJcbiAgICBkdXJhdGlvbjogMFxyXG4gIH0pO1xyXG4gIGlmIChhcHAuaW9zKSB7XHJcbiAgICBsZXQgY2FtZXJhVmlldyA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJwbGFjZWhvbGRlci12aWV3XCIpO1xyXG4gICAgY2FtZXJhVmlldy5hbmltYXRlKHtcclxuICAgICAgc2NhbGU6IHtcclxuICAgICAgICB4OiBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMvY2FtZXJhVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpLFxyXG4gICAgICAgIHk6IHBsYXRmb3JtLnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodFBpeGVscy9jYW1lcmFWaWV3LmdldE1lYXN1cmVkSGVpZ2h0KClcclxuICAgICAgfSxcclxuICAgICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiBhcHAuaW9zPyAtMTAgOiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59O1xyXG5cclxuY29uc3Qgcm90YXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJ4OiBcIiArIGRhdGEueCArIFwiIHk6IFwiICsgZGF0YS55ICsgXCIgejogXCIgKyBkYXRhLnopO1xyXG4gICAgeCA9IGRhdGEueDtcclxuICAgIHkgPSBkYXRhLnk7XHJcbiAgICB6ID0gZGF0YS56O1xyXG4gICAgaWYoYXBwLmlvcykgdXBkYXRlQ2FsbGJhY2soKTsgLy8gaW9zIGRvZXNuJ3Qgc2VlbSB0byBleHBvc2UgYSBjYWxsYmFjayBmb3IgZXZlcnkgZnJhbWUgdXBkYXRlIGluIHRoZSBjYW1lcmEgcHJldmlldzsgdGhlcmVmb3JlLCB3ZSdsbCBob3Agb24gdGhlIHJvdGF0aW9uIGNhbGxiYWNrXHJcbn07XHJcblxyXG4vLyBleHBvcnQgZnVuY3Rpb24gc2hvd1NpZGVEcmF3ZXIoYXJnczogRXZlbnREYXRhKSB7XHJcbi8vICAgICBjb25zb2xlLmxvZyhcIlNob3cgU2lkZURyYXdlciB0YXBwZWQuXCIpO1xyXG4vLyB9XHJcblxyXG4vL1RPRE86IHNwbGl0IHVwIHRoZSBjb2RlXHJcbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWRlZChhcmdzOiBFdmVudERhdGEpIHtcclxuICBvcmllbnRhdGlvbi5zZXRDdXJyZW50T3JpZW50YXRpb24oXCJwb3J0cmFpdFwiLCAoKSA9PiB7fSk7XHJcbiAgaWYgKGFwcC5hbmRyb2lkICYmIHBsYXRmb3JtLmRldmljZS5zZGtWZXJzaW9uID49ICcyMScpIHtcclxuICAgICAgY29uc3QgVmlldyA6YW55ID0gYW5kcm9pZC52aWV3LlZpZXc7XHJcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGFwcC5hbmRyb2lkLnN0YXJ0QWN0aXZpdHkuZ2V0V2luZG93KCk7XHJcbiAgICAgIC8vIHNldCB0aGUgc3RhdHVzIGJhciB0byBDb2xvci5UcmFuc3BhcmVudFxyXG4gICAgICAvLyB3aW5kb3cuc2V0U3RhdHVzQmFyQ29sb3IoMHgwMDAwMDApO1xyXG4gICAgICBjb25zdCBkZWNvclZpZXcgPSB3aW5kb3cuZ2V0RGVjb3JWaWV3KCk7XHJcbiAgICAgIGRlY29yVmlldy5zZXRTeXN0ZW1VaVZpc2liaWxpdHkoXHJcbiAgICAgICAgICBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9TVEFCTEVcclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfSElERV9OQVZJR0FUSU9OXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX0ZVTExTQ1JFRU5cclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19ISURFX05BVklHQVRJT04gLy8gaGlkZSBuYXYgYmFyXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfRlVMTFNDUkVFTiAvLyBoaWRlIHN0YXR1cyBiYXJcclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19JTU1FUlNJVkVfU1RJQ0tZKTtcclxuICB9XHJcbiAgY2FtZXJhUHJldmlldy5vbkxvYWRlZChhcmdzLCBcInBsYWNlaG9sZGVyLXZpZXdcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvbkNyZWF0aW5nVmlldyhhcmdzOiBFdmVudERhdGEpIHtcclxuICBpZihhcHAuYW5kcm9pZCkge1xyXG4gICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oYW5kcm9pZFtcIk1hbmlmZXN0XCJdLnBlcm1pc3Npb24uQ0FNRVJBLCBcIkkgbmVlZCB0aGVzZSBwZXJtaXNzaW9ucyBmb3IgdGhlIHZpZXdmaW5kZXJcIilcclxuICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJXb28gSG9vLCBJIGhhdmUgdGhlIHBvd2VyIVwiKTtcclxuICAgICAgIGNoYXJ0cy5pbml0R3JhcGgocGFnZSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJVaCBvaCwgbm8gcGVybWlzc2lvbnMgLSBwbGFuIEIgdGltZSFcIik7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgaWYoYXBwLmFuZHJvaWQpIHBhcmFtcy5pbml0aWFsaXplKCk7XHJcbiAgY2FtZXJhUHJldmlldy5vbkNyZWF0aW5nVmlldyh1cGRhdGVDYWxsYmFjaywgYXJncyk7XHJcbiAgaWYgKGFwcC5pb3MgIT09IHVuZGVmaW5lZCkgcGFyYW1zLmluaXRpYWxpemUoKTtcclxuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKHJvdGF0aW9uQ2FsbGJhY2ssICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcclxuICBjb25zdCBtYXhTaXplID0gY2FtZXJhUHJldmlldy5nZXRNYXhTaXplKCk7XHJcbiAgcGFyYW1zLnNldFZhcnMobWF4U2l6ZVswXSwgbWF4U2l6ZVsxXSk7XHJcbiAgbWVhc3VyZWRXaWR0aCA9IHBhcmFtcy5kZWdyZWVzMlBpeGVscyhPVVRFUl9DSVJDTEVfRElBTUVURVIpO1xyXG4gIC8vIGNvbnNvbGUubG9nKHBhcmFtcy5nZXRWZXJ0aWNhbEZPVigpICsgXCIgXCIgKyBwYXJhbXMuZ2V0SG9yaXpvbnRhbEZPVigpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9uVGFrZVNob3QoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgY2FtZXJhUHJldmlldy5vblRha2VTaG90KGFyZ3MpO1xyXG4gIGNvbnNvbGUubG9nKFwiZWw6IFwiICsgeSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0aW5nVG8oYXJnczogRXZlbnREYXRhKSB7XHJcbiAgICBwYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XHJcbiAgICBjcm9zc2hhaXIgPSBwYWdlLmdldFZpZXdCeUlkKFwiY3Jvc3NoYWlyXCIpO1xyXG4gICAgZG91YmxlbGluZSA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJkb3VibGVsaW5lXCIpO1xyXG4gICAgdXBwZXJUZXh0ID0gcGFnZS5nZXRWaWV3QnlJZChcInVwcGVyVGV4dFwiKTtcclxuICAgIGxvd2VyVGV4dCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJsb3dlclRleHRcIik7XHJcbn1cclxuXHJcbmFwcC5vbihhcHAucmVzdW1lRXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcclxuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKHJvdGF0aW9uQ2FsbGJhY2ssICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcclxuICBjYW1lcmFQcmV2aWV3Lm9uUmVzdW1lKCk7XHJcblxyXG59KTtcclxuYXBwLm9uKGFwcC5zdXNwZW5kRXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcclxuICBjYW1lcmFQcmV2aWV3Lm9uUGF1c2UoKTtcclxuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcclxuICBjaGFydHMub25FeGl0KCk7XHJcbn0pO1xyXG5hcHAub24oYXBwLmV4aXRFdmVudCwgZnVuY3Rpb24oYXJncykge1xyXG4gIGNvbnNvbGUubG9nKFwiT24gRXhpdHRpbmdcIik7XHJcbiAgcm90VmVjdG9yLnN0b3BSb3RVcGRhdGVzKCk7XHJcbn0pO1xyXG4iXX0=