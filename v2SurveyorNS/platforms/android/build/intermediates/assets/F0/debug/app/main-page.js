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
var crosshair;
var x, y, z;
function showSideDrawer(args) {
    console.log("Show SideDrawer tapped.");
}
exports.showSideDrawer = showSideDrawer;
function onLoaded(args) {
    var View = android.view.View;
    //
    // if (app.android && platform.device.sdkVersion >= '21') {
    //     var window = app.android.startActivity.getWindow();
    //     // set the status bar to Color.Transparent
    //     window.setStatusBarColor(0x000000);
    //     var decorView = window.getDecorView();
    //     decorView.setSystemUiVisibility(
    //         View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    //         | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
    //         | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    //         | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
    //         | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
    //         | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    // }
    cameraPreview.requestPermissions();
    cameraPreview.onLoaded(args);
    var myPage = args.object;
    crosshair = myPage.getViewById("crosshair");
    crosshair.animate({
        scale: { x: 2.25, y: 2.25 },
        duration: 0
    });
    rotVector.startRotUpdates(function (data) {
        //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        x = data.x;
        y = data.y;
        z = data.z;
    }, { sensorDelay: "game" });
}
exports.onLoaded = onLoaded;
function onCreatingView(args) {
    cameraPreview.onCreatingView(function () {
        crosshair.animate({
            rotate: -z,
            duration: 0
        });
    }, args);
}
exports.onCreatingView = onCreatingView;
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUlGLHFEQUFvRDtBQUNwRCx5RkFBMkY7QUFDM0YsZ0VBQWtFO0FBQ2xFLGlDQUFtQztBQU1uQyxJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBRVYsd0JBQStCLElBQWU7SUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFGRCx3Q0FFQztBQUVELGtCQUF5QixJQUFlO0lBQ3RDLElBQUksSUFBSSxHQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2xDLEVBQUU7SUFDRiwyREFBMkQ7SUFDM0QsMERBQTBEO0lBQzFELGlEQUFpRDtJQUNqRCwwQ0FBMEM7SUFDMUMsNkNBQTZDO0lBQzdDLHVDQUF1QztJQUN2Qyw0Q0FBNEM7SUFDNUMsdURBQXVEO0lBQ3ZELGtEQUFrRDtJQUNsRCxnRUFBZ0U7SUFDaEUsOERBQThEO0lBQzlELG1EQUFtRDtJQUNuRCxJQUFJO0lBRUosYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDbkMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixJQUFJLE1BQU0sR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQy9CLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDaEIsS0FBSyxFQUFFLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFDO1FBQ3pCLFFBQVEsRUFBRSxDQUFDO0tBQ1osQ0FBQyxDQUFDO0lBQ0gsU0FBUyxDQUFDLGVBQWUsQ0FBQyxVQUFTLElBQUk7UUFDbkMsa0VBQWtFO1FBQ2xFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNmLENBQUMsRUFBRyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUEvQkQsNEJBK0JDO0FBQ0Qsd0JBQStCLElBQWU7SUFDNUMsYUFBYSxDQUFDLGNBQWMsQ0FBQztRQUMzQixTQUFTLENBQUMsT0FBTyxDQUFDO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDVixRQUFRLEVBQUUsQ0FBQztTQUNaLENBQUMsQ0FBQztJQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNYLENBQUM7QUFQRCx3Q0FPQztBQUNELG9CQUEyQixJQUFlO0lBQ3hDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUZELGdDQUVDO0FBQ0Qsd0VBQXdFO0FBQ3hFLHNCQUE2QixJQUFlO0lBQ3hDOzs7O01BSUU7SUFDRixJQUFJLElBQUksR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBRTdCOzs7Ozs7Ozs7TUFTRTtJQUNGLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRCwrR0FBK0c7QUFDL0csR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVMsSUFBSTtJQUNuQyx1QkFBdUI7QUFDekIsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBUyxJQUFJO0lBQ3BDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQUk7SUFDakMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkluIE5hdGl2ZVNjcmlwdCwgYSBmaWxlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBhbiBYTUwgZmlsZSBpcyBrbm93biBhc1xuYSBjb2RlLWJlaGluZCBmaWxlLiBUaGUgY29kZS1iZWhpbmQgaXMgYSBncmVhdCBwbGFjZSB0byBwbGFjZSB5b3VyIHZpZXdcbmxvZ2ljLCBhbmQgdG8gc2V0IHVwIHlvdXIgcGFnZeKAmXMgZGF0YSBiaW5kaW5nLlxuKi9cblxuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSAnZGF0YS9vYnNlcnZhYmxlJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICd1aS9wYWdlJztcbmltcG9ydCB7IEhlbGxvV29ybGRNb2RlbCB9IGZyb20gJy4vbWFpbi12aWV3LW1vZGVsJztcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSAnLi9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXcvbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3JztcbmltcG9ydCAqIGFzIHJvdFZlY3RvciBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtcm90YXRpb24tdmVjdG9yL2luZGV4XCI7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgKiBhcyBmcmFtZU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9mcmFtZVwiO1xuaW1wb3J0ICogYXMgYW5pbWF0aW9uIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2FuaW1hdGlvblwiO1xuaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XG5cblxubGV0IGNyb3NzaGFpciA6YW55O1xubGV0IHgseSx6O1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvd1NpZGVEcmF3ZXIoYXJnczogRXZlbnREYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJTaG93IFNpZGVEcmF3ZXIgdGFwcGVkLlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9hZGVkKGFyZ3M6IEV2ZW50RGF0YSkge1xuICB2YXIgVmlldyA6YW55ID0gYW5kcm9pZC52aWV3LlZpZXc7XG4gIC8vXG4gIC8vIGlmIChhcHAuYW5kcm9pZCAmJiBwbGF0Zm9ybS5kZXZpY2Uuc2RrVmVyc2lvbiA+PSAnMjEnKSB7XG4gIC8vICAgICB2YXIgd2luZG93ID0gYXBwLmFuZHJvaWQuc3RhcnRBY3Rpdml0eS5nZXRXaW5kb3coKTtcbiAgLy8gICAgIC8vIHNldCB0aGUgc3RhdHVzIGJhciB0byBDb2xvci5UcmFuc3BhcmVudFxuICAvLyAgICAgd2luZG93LnNldFN0YXR1c0JhckNvbG9yKDB4MDAwMDAwKTtcbiAgLy8gICAgIHZhciBkZWNvclZpZXcgPSB3aW5kb3cuZ2V0RGVjb3JWaWV3KCk7XG4gIC8vICAgICBkZWNvclZpZXcuc2V0U3lzdGVtVWlWaXNpYmlsaXR5KFxuICAvLyAgICAgICAgIFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX1NUQUJMRVxuICAvLyAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfSElERV9OQVZJR0FUSU9OXG4gIC8vICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9GVUxMU0NSRUVOXG4gIC8vICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0hJREVfTkFWSUdBVElPTiAvLyBoaWRlIG5hdiBiYXJcbiAgLy8gICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfRlVMTFNDUkVFTiAvLyBoaWRlIHN0YXR1cyBiYXJcbiAgLy8gICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSU1NRVJTSVZFX1NUSUNLWSk7XG4gIC8vIH1cblxuICBjYW1lcmFQcmV2aWV3LnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuICBjYW1lcmFQcmV2aWV3Lm9uTG9hZGVkKGFyZ3MpO1xuICBsZXQgbXlQYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XG4gIGNyb3NzaGFpciA9IG15UGFnZS5nZXRWaWV3QnlJZChcImNyb3NzaGFpclwiKTtcbiAgY3Jvc3NoYWlyLmFuaW1hdGUoe1xuICAgIHNjYWxlOiB7eDogMi4yNSwgeTogMi4yNX0sXG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG4gIHJvdFZlY3Rvci5zdGFydFJvdFVwZGF0ZXMoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIng6IFwiICsgZGF0YS54ICsgXCIgeTogXCIgKyBkYXRhLnkgKyBcIiB6OiBcIiArIGRhdGEueik7XG4gICAgICB4ID0gZGF0YS54O1xuICAgICAgeSA9IGRhdGEueTtcbiAgICAgIHogPSBkYXRhLno7XG4gIH0sICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbkNyZWF0aW5nVmlldyhhcmdzOiBFdmVudERhdGEpIHtcbiAgY2FtZXJhUHJldmlldy5vbkNyZWF0aW5nVmlldyhmdW5jdGlvbigpIHtcbiAgICBjcm9zc2hhaXIuYW5pbWF0ZSh7XG4gICAgICByb3RhdGU6IC16LFxuICAgICAgZHVyYXRpb246IDBcbiAgICB9KTtcbiAgfSwgYXJncyk7XG59XG5leHBvcnQgZnVuY3Rpb24gb25UYWtlU2hvdChhcmdzOiBFdmVudERhdGEpIHtcbiAgY2FtZXJhUHJldmlldy5vblRha2VTaG90KGFyZ3MpO1xufVxuLy8gRXZlbnQgaGFuZGxlciBmb3IgUGFnZSBcIm5hdmlnYXRpbmdUb1wiIGV2ZW50IGF0dGFjaGVkIGluIG1haW4tcGFnZS54bWxcbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0aW5nVG8oYXJnczogRXZlbnREYXRhKSB7XG4gICAgLypcbiAgICBUaGlzIGdldHMgYSByZWZlcmVuY2UgdGhpcyBwYWdl4oCZcyA8UGFnZT4gVUkgY29tcG9uZW50LiBZb3UgY2FuXG4gICAgdmlldyB0aGUgQVBJIHJlZmVyZW5jZSBvZiB0aGUgUGFnZSB0byBzZWUgd2hhdOKAmXMgYXZhaWxhYmxlIGF0XG4gICAgaHR0cHM6Ly9kb2NzLm5hdGl2ZXNjcmlwdC5vcmcvYXBpLXJlZmVyZW5jZS9jbGFzc2VzL191aV9wYWdlXy5wYWdlLmh0bWxcbiAgICAqL1xuICAgIGxldCBwYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XG5cbiAgICAvKlxuICAgIEEgcGFnZeKAmXMgYmluZGluZ0NvbnRleHQgaXMgYW4gb2JqZWN0IHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gcGVyZm9ybVxuICAgIGRhdGEgYmluZGluZyBiZXR3ZWVuIFhNTCBtYXJrdXAgYW5kIFR5cGVTY3JpcHQgY29kZS4gUHJvcGVydGllc1xuICAgIG9uIHRoZSBiaW5kaW5nQ29udGV4dCBjYW4gYmUgYWNjZXNzZWQgdXNpbmcgdGhlIHt7IH19IHN5bnRheCBpbiBYTUwuXG4gICAgSW4gdGhpcyBleGFtcGxlLCB0aGUge3sgbWVzc2FnZSB9fSBhbmQge3sgb25UYXAgfX0gYmluZGluZ3MgYXJlIHJlc29sdmVkXG4gICAgYWdhaW5zdCB0aGUgb2JqZWN0IHJldHVybmVkIGJ5IGNyZWF0ZVZpZXdNb2RlbCgpLlxuXG4gICAgWW91IGNhbiBsZWFybiBtb3JlIGFib3V0IGRhdGEgYmluZGluZyBpbiBOYXRpdmVTY3JpcHQgYXRcbiAgICBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9jb3JlLWNvbmNlcHRzL2RhdGEtYmluZGluZy5cbiAgICAqL1xuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBuZXcgSGVsbG9Xb3JsZE1vZGVsKCk7XG59XG5cbi8vVE9ETzogQ2FtZXJhIG9uUmVzdW1lLCB3aGVuIGl0J3MgbG9zdC4gRllJOiBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9jb3JlLWNvbmNlcHRzL2FwcGxpY2F0aW9uLWxpZmVjeWNsZVxuYXBwLm9uKGFwcC5yZXN1bWVFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICAvL29uQ3JlYXRpbmdWaWV3KGFyZ3MpO1xufSk7XG5hcHAub24oYXBwLnN1c3BlbmRFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcbn0pO1xuYXBwLm9uKGFwcC5leGl0RXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcbiAgcm90VmVjdG9yLnN0b3BSb3RVcGRhdGVzKCk7XG59KTtcbiJdfQ==