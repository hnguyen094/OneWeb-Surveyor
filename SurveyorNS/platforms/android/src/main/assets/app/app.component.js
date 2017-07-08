"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var camera = require("nativescript-camera");
var rotVector = require("nativescript-rotation-vector");
var cameraPreview = require("nativescript-camera-preview");
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
        console.dir(cameraPreview);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUMxRCwyREFBNkQ7QUFJN0QsNEZBQTRGO0FBQzVGLDhGQUE4RjtBQWM5RixJQUFhLFlBQVk7SUFFdkI7UUFDRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QiwyQkFBMkI7UUFFM0IsU0FBUyxDQUFDLGVBQWUsQ0FBQyxVQUFTLElBQUk7WUFDbkMsa0VBQWtFO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQztJQUN0QyxDQUFDO0lBQ00sa0NBQVcsR0FBbEI7UUFBQSxpQkFJRztRQUhHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO1lBQzdCLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNJLHFDQUFjLEdBQXJCLFVBQXNCLElBQUk7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQixhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFwQkQsSUFvQkM7QUFwQlksWUFBWTtJQWJ4QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFLCtsQkFRVDtLQUNGLENBQUM7O0dBRVcsWUFBWSxDQW9CeEI7QUFwQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3JcIjtcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlld1wiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwiYXBwbGljYXRpb25cIjtcblxuLy8gdGhlIEAgcmVwcmVzZW50cyBhIGRlY29yYXRvciB0aGF0IHRlbGxzIGhvdyB0aGlzIGNvbXBvbmVudC90aGluZyBvbiB0aGUgc2NyZWVuIHdpbGwgbG9vay5cbi8vIE1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LUhhbmRib29rL2Jsb2IvbWFzdGVyL3BhZ2VzL0RlY29yYXRvcnMubWRcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJteS1hcHBcIixcbiAgdGVtcGxhdGU6IGAgPCEtLSBkb24ndCBmb3JnZXQgdGhlIHRpY2tzOyBpdCdzIGltcG9ydGFudC4gVGhleSdyZSBmb3IgRVMyMDE1IHRlbXBsYXRlIGxpdGVyYWxzIC0tPlxyXG4gICA8IS0tICAgICBNYWtlIHN1cmUgdGhleSdyZSA8Li4uPjwvPiBhbmQgbm90IGp1c3QgPC4uLi8+ICAgICAtLT5cclxuICA8QWN0aW9uQmFyIHRpdGxlPVwie059IFN1cnZleW9yIENhbWVyYVwiPjwvQWN0aW9uQmFyPlxyXG4gIDxTdGFja0xheW91dCBob3Jpem9udGFsQWxpZ25tZW50PVwiY2VudGVyXCIgdmVydGljYWxBbGlnbm1lbnQ9XCJjZW50ZXJcIj5cbiAgICAgIDxJbWFnZSBbc3JjXT1cInBpY3R1cmVcIiB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjIwMFwiPjwvSW1hZ2U+IDwhLS1odHRwOi8vbnNpbWFnZS5icm9zdGVpbnMuY29tLy0tPlxuICAgICAgPEJ1dHRvbiB0ZXh0PVwiQ2FwdHVyZVwiICh0YXApPVwib25DcmVhdGluZ1ZpZXcoKVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PC9CdXR0b24+XG4gICAgICA8UGxhY2Vob2xkZXIgY3JlYXRpbmdWaWV3ID0gXCJvbkNyZWF0aW5nVmlld1wiIGlkPVwicGxhY2Vob2xkZXItdmlld1wiPjwvUGxhY2Vob2xkZXI+XHJcbiAgPC9TdGFja0xheW91dD5cbiAgYFxufSlcblxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gIHB1YmxpYyBwaWN0dXJlOiBhbnk7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNhbWVyYS5yZXF1ZXN0UGVybWlzc2lvbnMoKTtcbiAgICAvL2NhbWVyYVByZXZpZXcub25Mb2FkZWQoKTtcblxuICAgIHJvdFZlY3Rvci5zdGFydFJvdFVwZGF0ZXMoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcIiB5OiBcIiArIGRhdGEueSArIFwiIHo6IFwiICsgZGF0YS56KTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY3R1cmUgPSBcIn4vaW1hZ2VzL2FwcGxlLmpwZ1wiO1xuICB9XG4gIHB1YmxpYyB0YWtlUGljdHVyZSgpIHtcclxuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUoKS50aGVuKHBpY3R1cmUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBpY3R1cmUgPSBwaWN0dXJlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxuICBwdWJsaWMgb25DcmVhdGluZ1ZpZXcoYXJncykge1xuICAgIGNvbnNvbGUuZGlyKGNhbWVyYVByZXZpZXcpO1xuICAgIGNhbWVyYVByZXZpZXcub25DcmVhdGluZ1ZpZXcoYXJncyk7XG4gIH1cbn1cbiJdfQ==