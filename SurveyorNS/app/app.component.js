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
        rotVector.startRotUpdates(function (data) {
            console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        }.bind(this));
        this.picture = "~/images/apple.jpg";
    }
    AppComponent.prototype.takePicture = function () {
        var _this = this;
        camera.takePicture().then(function (picture) {
            _this.picture = picture;
        });
    };
    AppComponent.prototype.onCreateView = function () {
        cameraPreview.onCreateView();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        template: " <!-- don't forget the ticks; it's important. They're for ES2015 template literals -->\n   <!--     Make sure they're <...></> and not just <.../>     -->\n  <ActionBar title=\"{N} Surveyor Camera\"></ActionBar>\n  <StackLayout horizontalAlignment=\"center\" verticalAlignment=\"center\">\n      <Image [src]=\"picture\" width=\"200\" height=\"200\"></Image> <!--http://nsimage.brosteins.com/-->\n      <Button text=\"Capture\" (tap)=\"takePicture()\" class=\"btn btn-primary\"></Button>\n      <Placeholder creatingView=\"onCreatingView()\" id=\"placeholder-view\"></Placeholder>\n  </StackLayout>\n  "
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUMxRCwyREFBNkQ7QUFJN0QsNEZBQTRGO0FBQzVGLDhGQUE4RjtBQWM5RixJQUFhLFlBQVk7SUFJdkI7UUFDRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUU1QixTQUFTLENBQUMsZUFBZSxDQUFDLFVBQVMsSUFBSTtZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQztJQUN0QyxDQUFDO0lBQ00sa0NBQVcsR0FBbEI7UUFBQSxpQkFJRztRQUhHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO1lBQzdCLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNJLG1DQUFZLEdBQW5CO1FBQ0UsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFwQkQsSUFvQkM7QUFwQlksWUFBWTtJQWJ4QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFLDRsQkFRVDtLQUNGLENBQUM7O0dBRVcsWUFBWSxDQW9CeEI7QUFwQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3JcIjtcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlld1wiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwiYXBwbGljYXRpb25cIjtcblxuLy8gdGhlIEAgcmVwcmVzZW50cyBhIGRlY29yYXRvciB0aGF0IHRlbGxzIGhvdyB0aGlzIGNvbXBvbmVudC90aGluZyBvbiB0aGUgc2NyZWVuIHdpbGwgbG9vay5cbi8vIE1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LUhhbmRib29rL2Jsb2IvbWFzdGVyL3BhZ2VzL0RlY29yYXRvcnMubWRcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJteS1hcHBcIixcbiAgdGVtcGxhdGU6IGAgPCEtLSBkb24ndCBmb3JnZXQgdGhlIHRpY2tzOyBpdCdzIGltcG9ydGFudC4gVGhleSdyZSBmb3IgRVMyMDE1IHRlbXBsYXRlIGxpdGVyYWxzIC0tPlxyXG4gICA8IS0tICAgICBNYWtlIHN1cmUgdGhleSdyZSA8Li4uPjwvPiBhbmQgbm90IGp1c3QgPC4uLi8+ICAgICAtLT5cclxuICA8QWN0aW9uQmFyIHRpdGxlPVwie059IFN1cnZleW9yIENhbWVyYVwiPjwvQWN0aW9uQmFyPlxyXG4gIDxTdGFja0xheW91dCBob3Jpem9udGFsQWxpZ25tZW50PVwiY2VudGVyXCIgdmVydGljYWxBbGlnbm1lbnQ9XCJjZW50ZXJcIj5cbiAgICAgIDxJbWFnZSBbc3JjXT1cInBpY3R1cmVcIiB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjIwMFwiPjwvSW1hZ2U+IDwhLS1odHRwOi8vbnNpbWFnZS5icm9zdGVpbnMuY29tLy0tPlxyXG4gICAgICA8QnV0dG9uIHRleHQ9XCJDYXB0dXJlXCIgKHRhcCk9XCJ0YWtlUGljdHVyZSgpXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48L0J1dHRvbj5cclxuICAgICAgPFBsYWNlaG9sZGVyIGNyZWF0aW5nVmlldz1cIm9uQ3JlYXRpbmdWaWV3KClcIiBpZD1cInBsYWNlaG9sZGVyLXZpZXdcIj48L1BsYWNlaG9sZGVyPlxyXG4gIDwvU3RhY2tMYXlvdXQ+XG4gIGBcbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICBwdWJsaWMgcGljdHVyZTogYW55O1xuICBwdWJsaWMgcm9sbDogYW55O1xuICBwdWJsaWMgcGl0Y2g6IGFueTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY2FtZXJhLnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuXG4gICAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcIiB5OiBcIiArIGRhdGEueSArIFwiIHo6IFwiICsgZGF0YS56KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMucGljdHVyZSA9IFwifi9pbWFnZXMvYXBwbGUuanBnXCI7XG4gIH1cbiAgcHVibGljIHRha2VQaWN0dXJlKCkge1xyXG4gICAgICAgIGNhbWVyYS50YWtlUGljdHVyZSgpLnRoZW4ocGljdHVyZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGljdHVyZSA9IHBpY3R1cmU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XG4gIHB1YmxpYyBvbkNyZWF0ZVZpZXcoKSB7XG4gICAgY2FtZXJhUHJldmlldy5vbkNyZWF0ZVZpZXcoKTtcbiAgfVxufVxuIl19