"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var camera = require("nativescript-camera");
var rotVector = require("nativescript-rotation-vector");
var cameraPreview = require("./nativescript-camera-preview/nativescript-camera-preview");
// the @ represents a decorator that tells how this component/thing on the screen will look.
// More here: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md
var AppComponent = (function () {
    function AppComponent() {
        camera.requestPermissions();
        //cameraPreview.onLoaded();
        rotVector.startRotUpdates(function (data) {
            //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        });
    }
    AppComponent.prototype.onCreatingView = function (args) {
        cameraPreview.onCreatingView(args);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        template: "interface.html"
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUMxRCx5RkFBMkY7QUFJM0YsNEZBQTRGO0FBQzVGLDhGQUE4RjtBQU05RixJQUFhLFlBQVk7SUFDdkI7UUFDRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QiwyQkFBMkI7UUFFM0IsU0FBUyxDQUFDLGVBQWUsQ0FBQyxVQUFTLElBQUk7WUFDbkMsa0VBQWtFO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNNLHFDQUFjLEdBQXJCLFVBQXNCLElBQUk7UUFDeEIsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLFlBQVk7SUFMeEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSxnQkFBZ0I7S0FDM0IsQ0FBQzs7R0FFVyxZQUFZLENBWXhCO0FBWlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3JcIjtcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3L25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlld1wiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwiYXBwbGljYXRpb25cIjtcblxuLy8gdGhlIEAgcmVwcmVzZW50cyBhIGRlY29yYXRvciB0aGF0IHRlbGxzIGhvdyB0aGlzIGNvbXBvbmVudC90aGluZyBvbiB0aGUgc2NyZWVuIHdpbGwgbG9vay5cbi8vIE1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LUhhbmRib29rL2Jsb2IvbWFzdGVyL3BhZ2VzL0RlY29yYXRvcnMubWRcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJteS1hcHBcIixcbiAgdGVtcGxhdGU6IFwiaW50ZXJmYWNlLmh0bWxcIlxyXG59KVxuXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY2FtZXJhLnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuICAgIC8vY2FtZXJhUHJldmlldy5vbkxvYWRlZCgpO1xuXG4gICAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ4OiBcIiArIGRhdGEueCArIFwiIHk6IFwiICsgZGF0YS55ICsgXCIgejogXCIgKyBkYXRhLnopO1xuICAgIH0pO1xuICB9XG4gIHB1YmxpYyBvbkNyZWF0aW5nVmlldyhhcmdzKSB7XG4gICAgY2FtZXJhUHJldmlldy5vbkNyZWF0aW5nVmlldyhhcmdzKTtcbiAgfVxufVxuIl19