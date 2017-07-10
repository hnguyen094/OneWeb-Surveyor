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
        this.picture = "~/images/apple.jpg";
    }
    AppComponent.prototype.takePicture = function () {
        var _this = this;
        camera.takePicture().then(function (picture) {
            _this.picture = picture;
        });
    };
    AppComponent.prototype.onCreatingView = function (args) {
        cameraPreview.onCreatingView(args);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        template: " <!-- don't forget the ticks; it's important. They're for ES2015 template literals -->\n   <!--     Make sure they're <...></> and not just <.../>     -->\n  <ActionBar title=\"{N} Surveyor Camera\"></ActionBar>\n  <StackLayout horizontalAlignment=\"center\" verticalAlignment=\"center\">\n      <Image [src]=\"picture\" width=\"200\" height=\"200\"></Image> <!--http://nsimage.brosteins.com/-->\n      <Button text=\"Capture\" (tap)=\"onCreatingView()\" class=\"btn btn-primary\"></Button>\n      <Placeholder creatingView = \"onCreatingView\" id=\"placeholder-view\"></Placeholder>\n  </StackLayout>\n  "
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUMxRCx5RkFBMkY7QUFJM0YsNEZBQTRGO0FBQzVGLDhGQUE4RjtBQWM5RixJQUFhLFlBQVk7SUFFdkI7UUFDRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QiwyQkFBMkI7UUFFM0IsU0FBUyxDQUFDLGVBQWUsQ0FBQyxVQUFTLElBQUk7WUFDbkMsa0VBQWtFO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQztJQUN0QyxDQUFDO0lBQ00sa0NBQVcsR0FBbEI7UUFBQSxpQkFJRztRQUhHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO1lBQzdCLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNJLHFDQUFjLEdBQXJCLFVBQXNCLElBQUk7UUFDeEIsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLFlBQVk7SUFieEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSwrbEJBUVQ7S0FDRixDQUFDOztHQUVXLFlBQVksQ0FtQnhCO0FBbkJZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCAqIGFzIGNhbWVyYSBmcm9tIFwibmF0aXZlc2NyaXB0LWNhbWVyYVwiO1xuaW1wb3J0ICogYXMgcm90VmVjdG9yIGZyb20gXCJuYXRpdmVzY3JpcHQtcm90YXRpb24tdmVjdG9yXCI7XG5pbXBvcnQgKiBhcyBjYW1lcmFQcmV2aWV3IGZyb20gXCIuL25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldy9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXdcIjtcbmltcG9ydCB7IEltYWdlIH0gZnJvbSBcInVpL2ltYWdlXCI7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5cbi8vIHRoZSBAIHJlcHJlc2VudHMgYSBkZWNvcmF0b3IgdGhhdCB0ZWxscyBob3cgdGhpcyBjb21wb25lbnQvdGhpbmcgb24gdGhlIHNjcmVlbiB3aWxsIGxvb2suXG4vLyBNb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC1IYW5kYm9vay9ibG9iL21hc3Rlci9wYWdlcy9EZWNvcmF0b3JzLm1kXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibXktYXBwXCIsXG4gIHRlbXBsYXRlOiBgIDwhLS0gZG9uJ3QgZm9yZ2V0IHRoZSB0aWNrczsgaXQncyBpbXBvcnRhbnQuIFRoZXkncmUgZm9yIEVTMjAxNSB0ZW1wbGF0ZSBsaXRlcmFscyAtLT5cclxuICAgPCEtLSAgICAgTWFrZSBzdXJlIHRoZXkncmUgPC4uLj48Lz4gYW5kIG5vdCBqdXN0IDwuLi4vPiAgICAgLS0+XHJcbiAgPEFjdGlvbkJhciB0aXRsZT1cIntOfSBTdXJ2ZXlvciBDYW1lcmFcIj48L0FjdGlvbkJhcj5cclxuICA8U3RhY2tMYXlvdXQgaG9yaXpvbnRhbEFsaWdubWVudD1cImNlbnRlclwiIHZlcnRpY2FsQWxpZ25tZW50PVwiY2VudGVyXCI+XG4gICAgICA8SW1hZ2UgW3NyY109XCJwaWN0dXJlXCIgd2lkdGg9XCIyMDBcIiBoZWlnaHQ9XCIyMDBcIj48L0ltYWdlPiA8IS0taHR0cDovL25zaW1hZ2UuYnJvc3RlaW5zLmNvbS8tLT5cbiAgICAgIDxCdXR0b24gdGV4dD1cIkNhcHR1cmVcIiAodGFwKT1cIm9uQ3JlYXRpbmdWaWV3KClcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjwvQnV0dG9uPlxuICAgICAgPFBsYWNlaG9sZGVyIGNyZWF0aW5nVmlldyA9IFwib25DcmVhdGluZ1ZpZXdcIiBpZD1cInBsYWNlaG9sZGVyLXZpZXdcIj48L1BsYWNlaG9sZGVyPlxyXG4gIDwvU3RhY2tMYXlvdXQ+XG4gIGBcbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICBwdWJsaWMgcGljdHVyZTogYW55O1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjYW1lcmEucmVxdWVzdFBlcm1pc3Npb25zKCk7XG4gICAgLy9jYW1lcmFQcmV2aWV3Lm9uTG9hZGVkKCk7XG5cbiAgICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIng6IFwiICsgZGF0YS54ICsgXCIgeTogXCIgKyBkYXRhLnkgKyBcIiB6OiBcIiArIGRhdGEueik7XG4gICAgfSk7XG4gICAgdGhpcy5waWN0dXJlID0gXCJ+L2ltYWdlcy9hcHBsZS5qcGdcIjtcbiAgfVxuICBwdWJsaWMgdGFrZVBpY3R1cmUoKSB7XHJcbiAgICAgICAgY2FtZXJhLnRha2VQaWN0dXJlKCkudGhlbihwaWN0dXJlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gcGljdHVyZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cbiAgcHVibGljIG9uQ3JlYXRpbmdWaWV3KGFyZ3MpIHtcbiAgICBjYW1lcmFQcmV2aWV3Lm9uQ3JlYXRpbmdWaWV3KGFyZ3MpO1xuICB9XG59XG4iXX0=