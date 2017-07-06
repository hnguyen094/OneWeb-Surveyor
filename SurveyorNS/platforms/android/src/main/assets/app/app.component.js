"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var camera = require("nativescript-camera");
var accelerometer = require("nativescript-accelerometer");
var AppComponent = (function () {
    function AppComponent() {
        camera.requestPermissions();
        accelerometer.startAccelerometerUpdates(function (data) {
            this.roll = Math.atan2(data.y, data.z) * 180 / Math.PI;
            this.pitch = Math.atan2(-data.x, Math.sqrt(data.y * data.y + data.z * data.z)) * 180 / Math.PI;
            //console.log("x: " + data.x + "y: " + data.y + "z: " + data.z);
            console.log("roll: " + this.roll + "pitch: " + this.pitch);
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
        template: "\n  <ActionBar title=\"{N} Camera Example\"></ActionBar>\n  <StackLayout horizontalAlignment=\"center\" verticalAlignment=\"center\">\n      <Image [src]=\"picture\" width=\"200\" height=\"200\"></Image>\n      <Button text=\"Capture\" (tap)=\"takePicture()\" class=\"btn btn-primary\"></Button>\n  </StackLayout>\n  "
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLDBEQUE0RDtBQWM1RCxJQUFhLFlBQVk7SUFJdkI7UUFDRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QixhQUFhLENBQUMseUJBQXlCLENBQUMsVUFBUyxJQUFJO1lBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNyRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDekYsZ0VBQWdFO1lBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDO0lBQ3RDLENBQUM7SUFDTSxrQ0FBVyxHQUFsQjtRQUFBLGlCQUlHO1FBSEcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87WUFDN0IsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLFlBQVk7SUFWeEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSwrVEFNVDtLQUNGLENBQUM7O0dBQ1csWUFBWSxDQW1CeEI7QUFuQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgKiBhcyBhY2NlbGVyb21ldGVyIGZyb20gXCJuYXRpdmVzY3JpcHQtYWNjZWxlcm9tZXRlclwiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcbmltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gXCJhcHBsaWNhdGlvblwiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibXktYXBwXCIsXG4gIHRlbXBsYXRlOiBgXHJcbiAgPEFjdGlvbkJhciB0aXRsZT1cIntOfSBDYW1lcmEgRXhhbXBsZVwiPjwvQWN0aW9uQmFyPlxyXG4gIDxTdGFja0xheW91dCBob3Jpem9udGFsQWxpZ25tZW50PVwiY2VudGVyXCIgdmVydGljYWxBbGlnbm1lbnQ9XCJjZW50ZXJcIj5cclxuICAgICAgPEltYWdlIFtzcmNdPVwicGljdHVyZVwiIHdpZHRoPVwiMjAwXCIgaGVpZ2h0PVwiMjAwXCI+PC9JbWFnZT5cclxuICAgICAgPEJ1dHRvbiB0ZXh0PVwiQ2FwdHVyZVwiICh0YXApPVwidGFrZVBpY3R1cmUoKVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PC9CdXR0b24+XHJcbiAgPC9TdGFja0xheW91dD5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICBwdWJsaWMgcGljdHVyZTogYW55O1xuICBwdWJsaWMgcm9sbDogYW55O1xuICBwdWJsaWMgcGl0Y2g6IGFueTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY2FtZXJhLnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuICAgIGFjY2VsZXJvbWV0ZXIuc3RhcnRBY2NlbGVyb21ldGVyVXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMucm9sbCA9IE1hdGguYXRhbjIoZGF0YS55LCBkYXRhLnopICogMTgwL01hdGguUEk7XG4gICAgICAgIHRoaXMucGl0Y2ggPSBNYXRoLmF0YW4yKC1kYXRhLngsIE1hdGguc3FydChkYXRhLnkqZGF0YS55ICsgZGF0YS56KmRhdGEueikpICogMTgwL01hdGguUEk7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ4OiBcIiArIGRhdGEueCArIFwieTogXCIgKyBkYXRhLnkgKyBcIno6IFwiICsgZGF0YS56KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJyb2xsOiBcIiArIHRoaXMucm9sbCArIFwicGl0Y2g6IFwiICsgdGhpcy5waXRjaCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnBpY3R1cmUgPSBcIn4vaW1hZ2VzL2FwcGxlLmpwZ1wiO1xuICB9XG4gIHB1YmxpYyB0YWtlUGljdHVyZSgpIHtcclxuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUoKS50aGVuKHBpY3R1cmUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBpY3R1cmUgPSBwaWN0dXJlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxufVxuIl19