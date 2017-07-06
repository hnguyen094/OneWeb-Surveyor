"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Camera = require("nativescript-camera");
var AppComponent = (function () {
    function AppComponent() {
        this.picture = "https://placehold.it/200x200";
    }
    AppComponent.prototype.takePicture = function () {
        var _this = this;
        Camera.takePicture().then(function (picture) {
            _this.picture = picture;
        });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        templateUrl: "app.component.html",
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBTTlDLElBQWEsWUFBWTtJQUlyQjtRQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsOEJBQThCLENBQUM7SUFDbEQsQ0FBQztJQUVNLGtDQUFXLEdBQWxCO1FBQUEsaUJBSUM7UUFIRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTztZQUM3QixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTCxtQkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksWUFBWTtJQUp4QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLFFBQVE7UUFDbEIsV0FBVyxFQUFFLG9CQUFvQjtLQUNwQyxDQUFDOztHQUNXLFlBQVksQ0FjeEI7QUFkWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyBDYW1lcmEgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jYW1lcmFcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibXktYXBwXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiYXBwLmNvbXBvbmVudC5odG1sXCIsXG59KVxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG5cbiAgICBwdWJsaWMgcGljdHVyZTogYW55O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBpY3R1cmUgPSBcImh0dHBzOi8vcGxhY2Vob2xkLml0LzIwMHgyMDBcIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgdGFrZVBpY3R1cmUoKSB7XG4gICAgICAgIENhbWVyYS50YWtlUGljdHVyZSgpLnRoZW4ocGljdHVyZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBpY3R1cmUgPSBwaWN0dXJlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cbiJdfQ==