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
var crosshair;
var doubleline;
var x, y, z;
var measuredWidth;
var OUTER_CIRCLE_DIAMETER = 2;
var DISTANCE_BETWEEN_LINES = 10;
function showSideDrawer(args) {
    console.log("Show SideDrawer tapped.");
}
exports.showSideDrawer = showSideDrawer;
//TODO: split up the code
function onLoaded(args) {
    orientation.setCurrentOrientation("portrait", function () { });
    var View = android.view.View;
    if (app.android && platform.device.sdkVersion >= '21') {
        var window_1 = app.android.startActivity.getWindow();
        // set the status bar to Color.Transparent
        window_1.setStatusBarColor(0x000000);
        var decorView = window_1.getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
    //cameraPreview.requestPermissions();
    cameraPreview.onLoaded(args);
    rotVector.startRotUpdates(function (data) {
        //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        x = data.x;
        y = data.y;
        z = data.z;
    }, { sensorDelay: "game" });
}
exports.onLoaded = onLoaded;
function onCreatingView(args) {
    params.initialize();
    cameraPreview.onCreatingView(function () {
        crosshair.animate({
            scale: {
                x: params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight()),
                y: params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight())
            },
            rotate: -z,
            duration: 0
        });
        var y2 = -params.degrees2Pixels(y);
        doubleline.animate({
            scale: {
                x: params.degrees2Scale(DISTANCE_BETWEEN_LINES, doubleline.getMeasuredHeight()),
                y: params.degrees2Scale(DISTANCE_BETWEEN_LINES, doubleline.getMeasuredHeight())
            },
            translate: {
                x: 0,
                y: params.pixels2Dp((params.degrees2Pixels(-y)) %
                    params.degrees2Pixels(DISTANCE_BETWEEN_LINES))
            },
            rotate: -z,
            duration: 0
        });
    }, args);
    var maxSize = cameraPreview.getMaxSize();
    params.setVars(maxSize[0], maxSize[1]);
    measuredWidth = params.degrees2Pixels(OUTER_CIRCLE_DIAMETER);
    console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}
exports.onCreatingView = onCreatingView;
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
    console.log("el: " + y);
}
exports.onTakeShot = onTakeShot;
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    var page = args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and TypeScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().

    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    page.bindingContext = new main_view_model_1.HelloWorldModel();
}
exports.navigatingTo = navigatingTo;
//TODO: Camera onResume, when it's lost. FYI: https://docs.nativescript.org/core-concepts/application-lifecycle
app.on(app.resumeEvent, function (args) {
    //onCreatingView(args);
});
app.on(app.suspendEvent, function (args) {
    rotVector.stopRotUpdates();
});
app.on(app.exitEvent, function (args) {
    rotVector.stopRotUpdates();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUlGLHFEQUFvRDtBQUNwRCx5RkFBMkY7QUFDM0YsZ0VBQWtFO0FBQ2xFLGlDQUFtQztBQUduQyxtQ0FBcUM7QUFDckMsNkRBQStEO0FBQy9ELDREQUE4RDtBQUU5RCxJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLFVBQWUsQ0FBQztBQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1osSUFBSSxhQUFhLENBQUM7QUFFbEIsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDaEMsSUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFFbEMsd0JBQStCLElBQWU7SUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFGRCx3Q0FFQztBQUVELHlCQUF5QjtBQUN6QixrQkFBeUIsSUFBZTtJQUN0QyxXQUFXLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLGNBQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsSUFBTSxJQUFJLEdBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQU0sUUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JELDBDQUEwQztRQUMxQyxRQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsSUFBTSxTQUFTLEdBQUcsUUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FDM0IsSUFBSSxDQUFDLDRCQUE0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QztJQUM3QixTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1Qzs7Ozs7Ozs7O01BU0U7SUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO0FBQ2hELENBQUM7QUFwQkQsb0NBb0JDO0FBRUQsK0dBQStHO0FBQy9HLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFTLElBQUk7SUFDbkMsdUJBQXVCO0FBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVMsSUFBSTtJQUNwQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBUyxJQUFJO0lBQ2pDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbkluIE5hdGl2ZVNjcmlwdCwgYSBmaWxlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBhbiBYTUwgZmlsZSBpcyBrbm93biBhc1xyXG5hIGNvZGUtYmVoaW5kIGZpbGUuIFRoZSBjb2RlLWJlaGluZCBpcyBhIGdyZWF0IHBsYWNlIHRvIHBsYWNlIHlvdXIgdmlld1xyXG5sb2dpYywgYW5kIHRvIHNldCB1cCB5b3VyIHBhZ2XigJlzIGRhdGEgYmluZGluZy5cclxuKi9cclxuXHJcbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICd1aS9wYWdlJztcclxuaW1wb3J0IHsgSGVsbG9Xb3JsZE1vZGVsIH0gZnJvbSAnLi9tYWluLXZpZXctbW9kZWwnO1xyXG5pbXBvcnQgKiBhcyBjYW1lcmFQcmV2aWV3IGZyb20gJy4vbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3L25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldyc7XHJcbmltcG9ydCAqIGFzIHJvdFZlY3RvciBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtcm90YXRpb24tdmVjdG9yL2luZGV4XCI7XHJcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0ICogYXMgZnJhbWVNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWVcIjtcclxuaW1wb3J0ICogYXMgYW5pbWF0aW9uIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2FuaW1hdGlvblwiO1xyXG5pbXBvcnQgKiBhcyBwbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0ICogYXMgb3JpZW50YXRpb24gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zY3JlZW4tb3JpZW50YXRpb25cIjtcclxuaW1wb3J0ICogYXMgcGFyYW1zIGZyb20gXCIuL25hdGl2ZXNjcmlwdC1mb3YvbmF0aXZlc2NyaXB0LWZvdlwiO1xyXG5cclxubGV0IGNyb3NzaGFpciA6YW55O1xyXG5sZXQgZG91YmxlbGluZSA6YW55O1xyXG5sZXQgeCwgeSwgejtcclxubGV0IG1lYXN1cmVkV2lkdGg7XHJcblxyXG5jb25zdCBPVVRFUl9DSVJDTEVfRElBTUVURVIgPSAyO1xyXG5jb25zdCBESVNUQU5DRV9CRVRXRUVOX0xJTkVTID0gMTA7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hvd1NpZGVEcmF3ZXIoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlNob3cgU2lkZURyYXdlciB0YXBwZWQuXCIpO1xyXG59XHJcblxyXG4vL1RPRE86IHNwbGl0IHVwIHRoZSBjb2RlXHJcbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWRlZChhcmdzOiBFdmVudERhdGEpIHtcclxuICBvcmllbnRhdGlvbi5zZXRDdXJyZW50T3JpZW50YXRpb24oXCJwb3J0cmFpdFwiLCAoKSA9PiB7fSk7XHJcbiAgY29uc3QgVmlldyA6YW55ID0gYW5kcm9pZC52aWV3LlZpZXc7XHJcbiAgaWYgKGFwcC5hbmRyb2lkICYmIHBsYXRmb3JtLmRldmljZS5zZGtWZXJzaW9uID49ICcyMScpIHtcclxuICAgICAgY29uc3Qgd2luZG93ID0gYXBwLmFuZHJvaWQuc3RhcnRBY3Rpdml0eS5nZXRXaW5kb3coKTtcclxuICAgICAgLy8gc2V0IHRoZSBzdGF0dXMgYmFyIHRvIENvbG9yLlRyYW5zcGFyZW50XHJcbiAgICAgIHdpbmRvdy5zZXRTdGF0dXNCYXJDb2xvcigweDAwMDAwMCk7XHJcbiAgICAgIGNvbnN0IGRlY29yVmlldyA9IHdpbmRvdy5nZXREZWNvclZpZXcoKTtcclxuICAgICAgZGVjb3JWaWV3LnNldFN5c3RlbVVpVmlzaWJpbGl0eShcclxuICAgICAgICAgIFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX1NUQUJMRVxyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9ISURFX05BVklHQVRJT05cclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfRlVMTFNDUkVFTlxyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0hJREVfTkFWSUdBVElPTiAvLyBoaWRlIG5hdiBiYXJcclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19GVUxMU0NSRUVOIC8vIGhpZGUgc3RhdHVzIGJhclxyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0lNTUVSU0lWRV9TVElDS1kpO1xyXG4gIH1cclxuICAvL2NhbWVyYVByZXZpZXcucmVxdWVzdFBlcm1pc3Npb25zKCk7XHJcbiAgY2FtZXJhUHJldmlldy5vbkxvYWRlZChhcmdzKTtcclxuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIng6IFwiICsgZGF0YS54ICsgXCIgeTogXCIgKyBkYXRhLnkgKyBcIiB6OiBcIiArIGRhdGEueik7XHJcbiAgICAgIHggPSBkYXRhLng7XHJcbiAgICAgIHkgPSBkYXRhLnk7XHJcbiAgICAgIHogPSBkYXRhLno7XHJcbiAgfSwgIHsgc2Vuc29yRGVsYXk6IFwiZ2FtZVwiIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25DcmVhdGluZ1ZpZXcoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgcGFyYW1zLmluaXRpYWxpemUoKTtcclxuICBjYW1lcmFQcmV2aWV3Lm9uQ3JlYXRpbmdWaWV3KGZ1bmN0aW9uKCkge1xyXG4gICAgY3Jvc3NoYWlyLmFuaW1hdGUoe1xyXG4gICAgICBzY2FsZToge1xyXG4gICAgICAgIHg6IHBhcmFtcy5kZWdyZWVzMlNjYWxlKE9VVEVSX0NJUkNMRV9ESUFNRVRFUiwgY3Jvc3NoYWlyLmdldE1lYXN1cmVkSGVpZ2h0KCkpLFxyXG4gICAgICAgIHk6IHBhcmFtcy5kZWdyZWVzMlNjYWxlKE9VVEVSX0NJUkNMRV9ESUFNRVRFUiwgY3Jvc3NoYWlyLmdldE1lYXN1cmVkSGVpZ2h0KCkpXHJcbiAgICAgIH0sXHJcbiAgICAgIHJvdGF0ZTogLXosXHJcbiAgICAgIGR1cmF0aW9uOiAwXHJcbiAgICB9KTtcclxuICAgIGxldCB5MiA9IC1wYXJhbXMuZGVncmVlczJQaXhlbHMoeSk7XHJcbiAgICBkb3VibGVsaW5lLmFuaW1hdGUoe1xyXG4gICAgICBzY2FsZToge1xyXG4gICAgICAgIHg6IHBhcmFtcy5kZWdyZWVzMlNjYWxlKERJU1RBTkNFX0JFVFdFRU5fTElORVMsIGRvdWJsZWxpbmUuZ2V0TWVhc3VyZWRIZWlnaHQoKSksXHJcbiAgICAgICAgeTogcGFyYW1zLmRlZ3JlZXMyU2NhbGUoRElTVEFOQ0VfQkVUV0VFTl9MSU5FUywgZG91YmxlbGluZS5nZXRNZWFzdXJlZEhlaWdodCgpKVxyXG4gICAgICB9LFxyXG4gICAgICB0cmFuc2xhdGU6IHtcclxuICAgICAgICB4IDogMCxcclxuICAgICAgICB5OiBwYXJhbXMucGl4ZWxzMkRwKChwYXJhbXMuZGVncmVlczJQaXhlbHMoLXkpKSAlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5kZWdyZWVzMlBpeGVscyhESVNUQU5DRV9CRVRXRUVOX0xJTkVTKSl9LFxyXG5cclxuICAgICAgcm90YXRlOiAteixcclxuICAgICAgZHVyYXRpb246IDBcclxuICAgIH0pO1xyXG5cclxuICB9LCBhcmdzKTtcclxuICBjb25zdCBtYXhTaXplID0gY2FtZXJhUHJldmlldy5nZXRNYXhTaXplKCk7XHJcbiAgcGFyYW1zLnNldFZhcnMobWF4U2l6ZVswXSwgbWF4U2l6ZVsxXSk7XHJcbiAgbWVhc3VyZWRXaWR0aCA9IHBhcmFtcy5kZWdyZWVzMlBpeGVscyhPVVRFUl9DSVJDTEVfRElBTUVURVIpO1xyXG4gIGNvbnNvbGUubG9nKHBhcmFtcy5nZXRWZXJ0aWNhbEZPVigpICsgXCIgXCIgKyBwYXJhbXMuZ2V0SG9yaXpvbnRhbEZPVigpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9uVGFrZVNob3QoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgY2FtZXJhUHJldmlldy5vblRha2VTaG90KGFyZ3MpO1xyXG4gIGNvbnNvbGUubG9nKFwiZWw6IFwiICsgeSk7XHJcbn1cclxuXHJcbi8vIEV2ZW50IGhhbmRsZXIgZm9yIFBhZ2UgXCJuYXZpZ2F0aW5nVG9cIiBldmVudCBhdHRhY2hlZCBpbiBtYWluLXBhZ2UueG1sXHJcbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0aW5nVG8oYXJnczogRXZlbnREYXRhKSB7XHJcbiAgICAvKlxyXG4gICAgVGhpcyBnZXRzIGEgcmVmZXJlbmNlIHRoaXMgcGFnZeKAmXMgPFBhZ2U+IFVJIGNvbXBvbmVudC4gWW91IGNhblxyXG4gICAgdmlldyB0aGUgQVBJIHJlZmVyZW5jZSBvZiB0aGUgUGFnZSB0byBzZWUgd2hhdOKAmXMgYXZhaWxhYmxlIGF0XHJcbiAgICBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9hcGktcmVmZXJlbmNlL2NsYXNzZXMvX3VpX3BhZ2VfLnBhZ2UuaHRtbFxyXG4gICAgKi9cclxuICAgIGxldCBwYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XHJcbiAgICBjcm9zc2hhaXIgPSBwYWdlLmdldFZpZXdCeUlkKFwiY3Jvc3NoYWlyXCIpO1xyXG4gICAgZG91YmxlbGluZSA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJkb3VibGVsaW5lXCIpO1xyXG4gICAgLypcclxuICAgIEEgcGFnZeKAmXMgYmluZGluZ0NvbnRleHQgaXMgYW4gb2JqZWN0IHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gcGVyZm9ybVxyXG4gICAgZGF0YSBiaW5kaW5nIGJldHdlZW4gWE1MIG1hcmt1cCBhbmQgVHlwZVNjcmlwdCBjb2RlLiBQcm9wZXJ0aWVzXHJcbiAgICBvbiB0aGUgYmluZGluZ0NvbnRleHQgY2FuIGJlIGFjY2Vzc2VkIHVzaW5nIHRoZSB7eyB9fSBzeW50YXggaW4gWE1MLlxyXG4gICAgSW4gdGhpcyBleGFtcGxlLCB0aGUge3sgbWVzc2FnZSB9fSBhbmQge3sgb25UYXAgfX0gYmluZGluZ3MgYXJlIHJlc29sdmVkXHJcbiAgICBhZ2FpbnN0IHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgY3JlYXRlVmlld01vZGVsKCkuXHJcblxyXG4gICAgWW91IGNhbiBsZWFybiBtb3JlIGFib3V0IGRhdGEgYmluZGluZyBpbiBOYXRpdmVTY3JpcHQgYXRcclxuICAgIGh0dHBzOi8vZG9jcy5uYXRpdmVzY3JpcHQub3JnL2NvcmUtY29uY2VwdHMvZGF0YS1iaW5kaW5nLlxyXG4gICAgKi9cclxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBuZXcgSGVsbG9Xb3JsZE1vZGVsKCk7XHJcbn1cclxuXHJcbi8vVE9ETzogQ2FtZXJhIG9uUmVzdW1lLCB3aGVuIGl0J3MgbG9zdC4gRllJOiBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9jb3JlLWNvbmNlcHRzL2FwcGxpY2F0aW9uLWxpZmVjeWNsZVxyXG5hcHAub24oYXBwLnJlc3VtZUV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XHJcbiAgLy9vbkNyZWF0aW5nVmlldyhhcmdzKTtcclxufSk7XHJcbmFwcC5vbihhcHAuc3VzcGVuZEV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XHJcbiAgcm90VmVjdG9yLnN0b3BSb3RVcGRhdGVzKCk7XHJcbn0pO1xyXG5hcHAub24oYXBwLmV4aXRFdmVudCwgZnVuY3Rpb24oYXJncykge1xyXG4gIHJvdFZlY3Rvci5zdG9wUm90VXBkYXRlcygpO1xyXG59KTtcclxuIl19