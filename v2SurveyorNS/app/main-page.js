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
var crosshair;
var x, y, z;
function showSideDrawer(args) {
    console.log("Show SideDrawer tapped.");
}
exports.showSideDrawer = showSideDrawer;
function onLoaded(args) {
    var View = android.view.View;
    if (app.android && platform.device.sdkVersion >= '21') {
        var window = app.android.startActivity.getWindow();
        // set the status bar to Color.Transparent
        window.setStatusBarColor(0x000000);
        var decorView = window.getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
    cameraPreview.requestPermissions();
    cameraPreview.onLoaded(args);
    var myPage = args.object;
    crosshair = myPage.getViewById("crosshair");
    // crosshair.animate({
    //   scale: {x: 2.25, y: 2.25},
    //   duration: 0
    // });
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
        // crosshair.animate({
        //   rotate: -z,
        //   duration: 0.01
        // });
    }, 1080, 1920, args);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUlGLHFEQUFvRDtBQUNwRCx5RkFBMkY7QUFDM0YsZ0VBQWtFO0FBQ2xFLGlDQUFtQztBQUduQyxtQ0FBcUM7QUFHckMsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUVWLHdCQUErQixJQUFlO0lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRkQsd0NBRUM7QUFFRCxrQkFBeUIsSUFBZTtJQUN0QyxJQUFJLElBQUksR0FBUSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUVsQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkQsMENBQTBDO1FBQzFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEMsU0FBUyxDQUFDLHFCQUFxQixDQUMzQixJQUFJLENBQUMsNEJBQTRCO2NBQy9CLElBQUksQ0FBQyxxQ0FBcUM7Y0FDMUMsSUFBSSxDQUFDLGdDQUFnQztjQUNyQyxJQUFJLENBQUMsOEJBQThCLENBQUMsZUFBZTtjQUNuRCxJQUFJLENBQUMseUJBQXlCLENBQUMsa0JBQWtCO2NBQ2pELElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxhQUFhLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNuQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLElBQUksTUFBTSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDL0IsU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUMsc0JBQXNCO0lBQ3RCLCtCQUErQjtJQUMvQixnQkFBZ0I7SUFDaEIsTUFBTTtJQUNOLFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBUyxJQUFJO1FBQ25DLGtFQUFrRTtRQUNsRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDLEVBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBL0JELDRCQStCQztBQUNELHdCQUErQixJQUFlO0lBQzVDLGFBQWEsQ0FBQyxjQUFjLENBQUM7UUFDM0Isc0JBQXNCO1FBQ3RCLGdCQUFnQjtRQUNoQixtQkFBbUI7UUFDbkIsTUFBTTtJQUNSLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFQRCx3Q0FPQztBQUNELG9CQUEyQixJQUFlO0lBQ3hDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUZELGdDQUVDO0FBQ0Qsd0VBQXdFO0FBQ3hFLHNCQUE2QixJQUFlO0lBQ3hDOzs7O01BSUU7SUFDRixJQUFJLElBQUksR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBRTdCOzs7Ozs7Ozs7TUFTRTtJQUNGLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRCwrR0FBK0c7QUFDL0csR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVMsSUFBSTtJQUNuQyx1QkFBdUI7QUFDekIsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBUyxJQUFJO0lBQ3BDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQUk7SUFDakMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkluIE5hdGl2ZVNjcmlwdCwgYSBmaWxlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBhbiBYTUwgZmlsZSBpcyBrbm93biBhc1xuYSBjb2RlLWJlaGluZCBmaWxlLiBUaGUgY29kZS1iZWhpbmQgaXMgYSBncmVhdCBwbGFjZSB0byBwbGFjZSB5b3VyIHZpZXdcbmxvZ2ljLCBhbmQgdG8gc2V0IHVwIHlvdXIgcGFnZeKAmXMgZGF0YSBiaW5kaW5nLlxuKi9cblxuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSAnZGF0YS9vYnNlcnZhYmxlJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICd1aS9wYWdlJztcbmltcG9ydCB7IEhlbGxvV29ybGRNb2RlbCB9IGZyb20gJy4vbWFpbi12aWV3LW1vZGVsJztcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSAnLi9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXcvbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3JztcbmltcG9ydCAqIGFzIHJvdFZlY3RvciBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtcm90YXRpb24tdmVjdG9yL2luZGV4XCI7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgKiBhcyBmcmFtZU1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9mcmFtZVwiO1xuaW1wb3J0ICogYXMgYW5pbWF0aW9uIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2FuaW1hdGlvblwiO1xuaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XG5cblxubGV0IGNyb3NzaGFpciA6YW55O1xubGV0IHgseSx6O1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvd1NpZGVEcmF3ZXIoYXJnczogRXZlbnREYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJTaG93IFNpZGVEcmF3ZXIgdGFwcGVkLlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9hZGVkKGFyZ3M6IEV2ZW50RGF0YSkge1xuICB2YXIgVmlldyA6YW55ID0gYW5kcm9pZC52aWV3LlZpZXc7XG5cbiAgaWYgKGFwcC5hbmRyb2lkICYmIHBsYXRmb3JtLmRldmljZS5zZGtWZXJzaW9uID49ICcyMScpIHtcbiAgICAgIHZhciB3aW5kb3cgPSBhcHAuYW5kcm9pZC5zdGFydEFjdGl2aXR5LmdldFdpbmRvdygpO1xuICAgICAgLy8gc2V0IHRoZSBzdGF0dXMgYmFyIHRvIENvbG9yLlRyYW5zcGFyZW50XG4gICAgICB3aW5kb3cuc2V0U3RhdHVzQmFyQ29sb3IoMHgwMDAwMDApO1xuICAgICAgdmFyIGRlY29yVmlldyA9IHdpbmRvdy5nZXREZWNvclZpZXcoKTtcbiAgICAgIGRlY29yVmlldy5zZXRTeXN0ZW1VaVZpc2liaWxpdHkoXG4gICAgICAgICAgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfU1RBQkxFXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9ISURFX05BVklHQVRJT05cbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX0ZVTExTQ1JFRU5cbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSElERV9OQVZJR0FUSU9OIC8vIGhpZGUgbmF2IGJhclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19GVUxMU0NSRUVOIC8vIGhpZGUgc3RhdHVzIGJhclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19JTU1FUlNJVkVfU1RJQ0tZKTtcbiAgfVxuXG4gIGNhbWVyYVByZXZpZXcucmVxdWVzdFBlcm1pc3Npb25zKCk7XG4gIGNhbWVyYVByZXZpZXcub25Mb2FkZWQoYXJncyk7XG4gIGxldCBteVBhZ2UgPSA8UGFnZT5hcmdzLm9iamVjdDtcbiAgY3Jvc3NoYWlyID0gbXlQYWdlLmdldFZpZXdCeUlkKFwiY3Jvc3NoYWlyXCIpO1xuICAvLyBjcm9zc2hhaXIuYW5pbWF0ZSh7XG4gIC8vICAgc2NhbGU6IHt4OiAyLjI1LCB5OiAyLjI1fSxcbiAgLy8gICBkdXJhdGlvbjogMFxuICAvLyB9KTtcbiAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcIiB5OiBcIiArIGRhdGEueSArIFwiIHo6IFwiICsgZGF0YS56KTtcbiAgICAgIHggPSBkYXRhLng7XG4gICAgICB5ID0gZGF0YS55O1xuICAgICAgeiA9IGRhdGEuejtcbiAgfSwgIHsgc2Vuc29yRGVsYXk6IFwiZ2FtZVwiIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uQ3JlYXRpbmdWaWV3KGFyZ3M6IEV2ZW50RGF0YSkge1xuICBjYW1lcmFQcmV2aWV3Lm9uQ3JlYXRpbmdWaWV3KGZ1bmN0aW9uKCkge1xuICAgIC8vIGNyb3NzaGFpci5hbmltYXRlKHtcbiAgICAvLyAgIHJvdGF0ZTogLXosXG4gICAgLy8gICBkdXJhdGlvbjogMC4wMVxuICAgIC8vIH0pO1xuICB9LCAxMDgwLCAxOTIwLCBhcmdzKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvblRha2VTaG90KGFyZ3M6IEV2ZW50RGF0YSkge1xuICBjYW1lcmFQcmV2aWV3Lm9uVGFrZVNob3QoYXJncyk7XG59XG4vLyBFdmVudCBoYW5kbGVyIGZvciBQYWdlIFwibmF2aWdhdGluZ1RvXCIgZXZlbnQgYXR0YWNoZWQgaW4gbWFpbi1wYWdlLnhtbFxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRpbmdUbyhhcmdzOiBFdmVudERhdGEpIHtcbiAgICAvKlxuICAgIFRoaXMgZ2V0cyBhIHJlZmVyZW5jZSB0aGlzIHBhZ2XigJlzIDxQYWdlPiBVSSBjb21wb25lbnQuIFlvdSBjYW5cbiAgICB2aWV3IHRoZSBBUEkgcmVmZXJlbmNlIG9mIHRoZSBQYWdlIHRvIHNlZSB3aGF04oCZcyBhdmFpbGFibGUgYXRcbiAgICBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9hcGktcmVmZXJlbmNlL2NsYXNzZXMvX3VpX3BhZ2VfLnBhZ2UuaHRtbFxuICAgICovXG4gICAgbGV0IHBhZ2UgPSA8UGFnZT5hcmdzLm9iamVjdDtcblxuICAgIC8qXG4gICAgQSBwYWdl4oCZcyBiaW5kaW5nQ29udGV4dCBpcyBhbiBvYmplY3QgdGhhdCBzaG91bGQgYmUgdXNlZCB0byBwZXJmb3JtXG4gICAgZGF0YSBiaW5kaW5nIGJldHdlZW4gWE1MIG1hcmt1cCBhbmQgVHlwZVNjcmlwdCBjb2RlLiBQcm9wZXJ0aWVzXG4gICAgb24gdGhlIGJpbmRpbmdDb250ZXh0IGNhbiBiZSBhY2Nlc3NlZCB1c2luZyB0aGUge3sgfX0gc3ludGF4IGluIFhNTC5cbiAgICBJbiB0aGlzIGV4YW1wbGUsIHRoZSB7eyBtZXNzYWdlIH19IGFuZCB7eyBvblRhcCB9fSBiaW5kaW5ncyBhcmUgcmVzb2x2ZWRcbiAgICBhZ2FpbnN0IHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgY3JlYXRlVmlld01vZGVsKCkuXG5cbiAgICBZb3UgY2FuIGxlYXJuIG1vcmUgYWJvdXQgZGF0YSBiaW5kaW5nIGluIE5hdGl2ZVNjcmlwdCBhdFxuICAgIGh0dHBzOi8vZG9jcy5uYXRpdmVzY3JpcHQub3JnL2NvcmUtY29uY2VwdHMvZGF0YS1iaW5kaW5nLlxuICAgICovXG4gICAgcGFnZS5iaW5kaW5nQ29udGV4dCA9IG5ldyBIZWxsb1dvcmxkTW9kZWwoKTtcbn1cblxuLy9UT0RPOiBDYW1lcmEgb25SZXN1bWUsIHdoZW4gaXQncyBsb3N0LiBGWUk6IGh0dHBzOi8vZG9jcy5uYXRpdmVzY3JpcHQub3JnL2NvcmUtY29uY2VwdHMvYXBwbGljYXRpb24tbGlmZWN5Y2xlXG5hcHAub24oYXBwLnJlc3VtZUV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XG4gIC8vb25DcmVhdGluZ1ZpZXcoYXJncyk7XG59KTtcbmFwcC5vbihhcHAuc3VzcGVuZEV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XG4gIHJvdFZlY3Rvci5zdG9wUm90VXBkYXRlcygpO1xufSk7XG5hcHAub24oYXBwLmV4aXRFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcbn0pO1xuIl19