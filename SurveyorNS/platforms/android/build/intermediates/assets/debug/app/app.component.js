"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var camera = require("nativescript-camera");
var rotVector = require("nativescript-rotation-vector");
// the @ represents a decorator that tells how this component/thing on the screen will look.
// More here: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md
var AppComponent = (function () {
    function AppComponent() {
        camera.requestPermissions();
        rotVector.startRotUpdates(function (data) {
            console.log("x: " + data.x + "y: " + data.y + "z: " + data.z);
        }.bind(this));
        this.picture = "~/images/apple.jpg";
    }
    AppComponent.prototype.takePicture = function () {
        var _this = this;
        camera.takePicture().then(function (picture) {
            _this.picture = picture;
        });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        template: " <!-- don't forget the ticks; it's important. They're for ES2015 template literals -->\n   <!--     Make sure they're <...></> and not just <.../>     -->\n  <ActionBar title=\"{N} Surveyor Camera\"></ActionBar>\n  <StackLayout horizontalAlignment=\"center\" verticalAlignment=\"center\">\n      <Image [src]=\"picture\" width=\"200\" height=\"200\"></Image> <!--http://nsimage.brosteins.com/-->\n      <Button text=\"Capture\" (tap)=\"takePicture()\" class=\"btn btn-primary\"></Button>\n  </StackLayout>\n  "
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUsxRCw0RkFBNEY7QUFDNUYsOEZBQThGO0FBYTlGLElBQWEsWUFBWTtJQUl2QjtRQUNFLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTVCLFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBUyxJQUFJO1lBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDO0lBQ3RDLENBQUM7SUFDTSxrQ0FBVyxHQUFsQjtRQUFBLGlCQUlHO1FBSEcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDN0IsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBakJELElBaUJDO0FBakJZLFlBQVk7SUFaeEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSwrZkFPVDtLQUNGLENBQUM7O0dBRVcsWUFBWSxDQWlCeEI7QUFqQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3JcIjtcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlld1wiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwiYXBwbGljYXRpb25cIjtcblxuLy8gdGhlIEAgcmVwcmVzZW50cyBhIGRlY29yYXRvciB0aGF0IHRlbGxzIGhvdyB0aGlzIGNvbXBvbmVudC90aGluZyBvbiB0aGUgc2NyZWVuIHdpbGwgbG9vay5cbi8vIE1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LUhhbmRib29rL2Jsb2IvbWFzdGVyL3BhZ2VzL0RlY29yYXRvcnMubWRcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJteS1hcHBcIixcbiAgdGVtcGxhdGU6IGAgPCEtLSBkb24ndCBmb3JnZXQgdGhlIHRpY2tzOyBpdCdzIGltcG9ydGFudC4gVGhleSdyZSBmb3IgRVMyMDE1IHRlbXBsYXRlIGxpdGVyYWxzIC0tPlxyXG4gICA8IS0tICAgICBNYWtlIHN1cmUgdGhleSdyZSA8Li4uPjwvPiBhbmQgbm90IGp1c3QgPC4uLi8+ICAgICAtLT5cclxuICA8QWN0aW9uQmFyIHRpdGxlPVwie059IFN1cnZleW9yIENhbWVyYVwiPjwvQWN0aW9uQmFyPlxyXG4gIDxTdGFja0xheW91dCBob3Jpem9udGFsQWxpZ25tZW50PVwiY2VudGVyXCIgdmVydGljYWxBbGlnbm1lbnQ9XCJjZW50ZXJcIj5cclxuICAgICAgPEltYWdlIFtzcmNdPVwicGljdHVyZVwiIHdpZHRoPVwiMjAwXCIgaGVpZ2h0PVwiMjAwXCI+PC9JbWFnZT4gPCEtLWh0dHA6Ly9uc2ltYWdlLmJyb3N0ZWlucy5jb20vLS0+XHJcbiAgICAgIDxCdXR0b24gdGV4dD1cIkNhcHR1cmVcIiAodGFwKT1cInRha2VQaWN0dXJlKClcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjwvQnV0dG9uPlxyXG4gIDwvU3RhY2tMYXlvdXQ+XG4gIGBcbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICBwdWJsaWMgcGljdHVyZTogYW55O1xuICBwdWJsaWMgcm9sbDogYW55O1xuICBwdWJsaWMgcGl0Y2g6IGFueTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY2FtZXJhLnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuXG4gICAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcInk6IFwiICsgZGF0YS55ICsgXCJ6OiBcIiArIGRhdGEueik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnBpY3R1cmUgPSBcIn4vaW1hZ2VzL2FwcGxlLmpwZ1wiO1xuICB9XG4gIHB1YmxpYyB0YWtlUGljdHVyZSgpIHtcclxuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUoKS50aGVuKHBpY3R1cmUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBpY3R1cmUgPSBwaWN0dXJlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxufVxuIl19