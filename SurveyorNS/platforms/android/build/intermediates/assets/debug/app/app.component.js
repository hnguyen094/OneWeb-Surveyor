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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUMxRCwyREFBNkQ7QUFJN0QsNEZBQTRGO0FBQzVGLDhGQUE4RjtBQWM5RixJQUFhLFlBQVk7SUFFdkI7UUFDRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUU1QixTQUFTLENBQUMsZUFBZSxDQUFDLFVBQVMsSUFBSTtZQUNuQyxrRUFBa0U7UUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDO0lBQ3RDLENBQUM7SUFDTSxrQ0FBVyxHQUFsQjtRQUFBLGlCQUlHO1FBSEcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDN0IsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0kscUNBQWMsR0FBckIsVUFBc0IsSUFBSTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNCLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQztBQW5CWSxZQUFZO0lBYnhCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUUsK2xCQVFUO0tBQ0YsQ0FBQzs7R0FFVyxZQUFZLENBbUJ4QjtBQW5CWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyBjYW1lcmEgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jYW1lcmFcIjtcbmltcG9ydCAqIGFzIHJvdFZlY3RvciBmcm9tIFwibmF0aXZlc2NyaXB0LXJvdGF0aW9uLXZlY3RvclwiO1xuaW1wb3J0ICogYXMgY2FtZXJhUHJldmlldyBmcm9tIFwibmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3XCI7XG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gXCJ1aS9pbWFnZVwiO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJhcHBsaWNhdGlvblwiO1xuXG4vLyB0aGUgQCByZXByZXNlbnRzIGEgZGVjb3JhdG9yIHRoYXQgdGVsbHMgaG93IHRoaXMgY29tcG9uZW50L3RoaW5nIG9uIHRoZSBzY3JlZW4gd2lsbCBsb29rLlxuLy8gTW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQtSGFuZGJvb2svYmxvYi9tYXN0ZXIvcGFnZXMvRGVjb3JhdG9ycy5tZFxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcIm15LWFwcFwiLFxuICB0ZW1wbGF0ZTogYCA8IS0tIGRvbid0IGZvcmdldCB0aGUgdGlja3M7IGl0J3MgaW1wb3J0YW50LiBUaGV5J3JlIGZvciBFUzIwMTUgdGVtcGxhdGUgbGl0ZXJhbHMgLS0+XHJcbiAgIDwhLS0gICAgIE1ha2Ugc3VyZSB0aGV5J3JlIDwuLi4+PC8+IGFuZCBub3QganVzdCA8Li4uLz4gICAgIC0tPlxyXG4gIDxBY3Rpb25CYXIgdGl0bGU9XCJ7Tn0gU3VydmV5b3IgQ2FtZXJhXCI+PC9BY3Rpb25CYXI+XHJcbiAgPFN0YWNrTGF5b3V0IGhvcml6b250YWxBbGlnbm1lbnQ9XCJjZW50ZXJcIiB2ZXJ0aWNhbEFsaWdubWVudD1cImNlbnRlclwiPlxuICAgICAgPEltYWdlIFtzcmNdPVwicGljdHVyZVwiIHdpZHRoPVwiMjAwXCIgaGVpZ2h0PVwiMjAwXCI+PC9JbWFnZT4gPCEtLWh0dHA6Ly9uc2ltYWdlLmJyb3N0ZWlucy5jb20vLS0+XG4gICAgICA8QnV0dG9uIHRleHQ9XCJDYXB0dXJlXCIgKHRhcCk9XCJvbkNyZWF0aW5nVmlldygpXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48L0J1dHRvbj5cbiAgICAgIDxQbGFjZWhvbGRlciBjcmVhdGluZ1ZpZXcgPSBcIm9uQ3JlYXRpbmdWaWV3XCIgaWQ9XCJwbGFjZWhvbGRlci12aWV3XCI+PC9QbGFjZWhvbGRlcj5cclxuICA8L1N0YWNrTGF5b3V0PlxuICBgXG59KVxuXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgcHVibGljIHBpY3R1cmU6IGFueTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY2FtZXJhLnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuXG4gICAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ4OiBcIiArIGRhdGEueCArIFwiIHk6IFwiICsgZGF0YS55ICsgXCIgejogXCIgKyBkYXRhLnopO1xuICAgIH0pO1xuICAgIHRoaXMucGljdHVyZSA9IFwifi9pbWFnZXMvYXBwbGUuanBnXCI7XG4gIH1cbiAgcHVibGljIHRha2VQaWN0dXJlKCkge1xyXG4gICAgICAgIGNhbWVyYS50YWtlUGljdHVyZSgpLnRoZW4ocGljdHVyZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGljdHVyZSA9IHBpY3R1cmU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XG4gIHB1YmxpYyBvbkNyZWF0aW5nVmlldyhhcmdzKSB7XG4gICAgY29uc29sZS5kaXIoY2FtZXJhUHJldmlldyk7XG4gICAgY2FtZXJhUHJldmlldy5vbkNyZWF0aW5nVmlldyhhcmdzKTtcbiAgfVxufVxuIl19