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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUkxRCw0RkFBNEY7QUFDNUYsOEZBQThGO0FBYTlGLElBQWEsWUFBWTtJQUl2QjtRQUNFLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTVCLFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBUyxJQUFJO1lBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDO0lBQ3RDLENBQUM7SUFDTSxrQ0FBVyxHQUFsQjtRQUFBLGlCQUlHO1FBSEcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDN0IsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBakJELElBaUJDO0FBakJZLFlBQVk7SUFaeEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSwrZkFPVDtLQUNGLENBQUM7O0dBRVcsWUFBWSxDQWlCeEI7QUFqQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3JcIjtcbmltcG9ydCB7IEltYWdlIH0gZnJvbSBcInVpL2ltYWdlXCI7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5cbi8vIHRoZSBAIHJlcHJlc2VudHMgYSBkZWNvcmF0b3IgdGhhdCB0ZWxscyBob3cgdGhpcyBjb21wb25lbnQvdGhpbmcgb24gdGhlIHNjcmVlbiB3aWxsIGxvb2suXG4vLyBNb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC1IYW5kYm9vay9ibG9iL21hc3Rlci9wYWdlcy9EZWNvcmF0b3JzLm1kXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibXktYXBwXCIsXG4gIHRlbXBsYXRlOiBgIDwhLS0gZG9uJ3QgZm9yZ2V0IHRoZSB0aWNrczsgaXQncyBpbXBvcnRhbnQuIFRoZXkncmUgZm9yIEVTMjAxNSB0ZW1wbGF0ZSBsaXRlcmFscyAtLT5cclxuICAgPCEtLSAgICAgTWFrZSBzdXJlIHRoZXkncmUgPC4uLj48Lz4gYW5kIG5vdCBqdXN0IDwuLi4vPiAgICAgLS0+XHJcbiAgPEFjdGlvbkJhciB0aXRsZT1cIntOfSBTdXJ2ZXlvciBDYW1lcmFcIj48L0FjdGlvbkJhcj5cclxuICA8U3RhY2tMYXlvdXQgaG9yaXpvbnRhbEFsaWdubWVudD1cImNlbnRlclwiIHZlcnRpY2FsQWxpZ25tZW50PVwiY2VudGVyXCI+XHJcbiAgICAgIDxJbWFnZSBbc3JjXT1cInBpY3R1cmVcIiB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjIwMFwiPjwvSW1hZ2U+IDwhLS1odHRwOi8vbnNpbWFnZS5icm9zdGVpbnMuY29tLy0tPlxyXG4gICAgICA8QnV0dG9uIHRleHQ9XCJDYXB0dXJlXCIgKHRhcCk9XCJ0YWtlUGljdHVyZSgpXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48L0J1dHRvbj5cclxuICA8L1N0YWNrTGF5b3V0PlxuICBgXG59KVxuXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgcHVibGljIHBpY3R1cmU6IGFueTtcbiAgcHVibGljIHJvbGw6IGFueTtcbiAgcHVibGljIHBpdGNoOiBhbnk7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNhbWVyYS5yZXF1ZXN0UGVybWlzc2lvbnMoKTtcblxuICAgIHJvdFZlY3Rvci5zdGFydFJvdFVwZGF0ZXMoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIng6IFwiICsgZGF0YS54ICsgXCJ5OiBcIiArIGRhdGEueSArIFwiejogXCIgKyBkYXRhLnopO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgdGhpcy5waWN0dXJlID0gXCJ+L2ltYWdlcy9hcHBsZS5qcGdcIjtcbiAgfVxuICBwdWJsaWMgdGFrZVBpY3R1cmUoKSB7XHJcbiAgICAgICAgY2FtZXJhLnRha2VQaWN0dXJlKCkudGhlbihwaWN0dXJlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gcGljdHVyZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cbn1cbiJdfQ==