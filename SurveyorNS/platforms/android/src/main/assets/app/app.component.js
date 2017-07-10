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
    AppComponent.prototype.onLoaded = function (args) {
        cameraPreview.onLoaded(args.object);
    };
    AppComponent.prototype.onCreatingView = function (args) {
        cameraPreview.onCreatingView(args);
    };
    AppComponent.prototype.onTakeShot = function (args) {
        cameraPreview.onTakeShot(args);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        templateUrl: "./interface.html"
        /*
          ` <!-- don't forget the ticks; it's important. They're for ES2015 template literals -->
           <!--     Make sure they're <...></> and not just <.../>     -->
          <ActionBar title="{N} Surveyor Camera"></ActionBar>
          <StackLayout horizontalAlignment="center" verticalAlignment="center">
              <Image [src]="picture" width="200" height="200"></Image> <!--http://nsimage.brosteins.com/-->
              <Button text="Capture" (tap)="onCreatingView()" class="btn btn-primary"></Button>
              <Placeholder creatingView = "onCreatingView" id="placeholder-view"></Placeholder>
          </StackLayout>
          ` */
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUMxRCx5RkFBMkY7QUFJM0YsNEZBQTRGO0FBQzVGLDhGQUE4RjtBQWdCOUYsSUFBYSxZQUFZO0lBRXZCO1FBQ0UsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDNUIsMkJBQTJCO1FBRTNCLFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBUyxJQUFJO1lBQ25DLGtFQUFrRTtRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUM7SUFDdEMsQ0FBQztJQUNNLGtDQUFXLEdBQWxCO1FBQUEsaUJBSUc7UUFIRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTztZQUM3QixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDSSwrQkFBUSxHQUFmLFVBQWdCLElBQUk7UUFDbEIsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNNLHFDQUFjLEdBQXJCLFVBQXNCLElBQUk7UUFDeEIsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ00saUNBQVUsR0FBakIsVUFBa0IsSUFBSTtRQUNwQixhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6QlksWUFBWTtJQWZ4QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFFBQVE7UUFDbEIsV0FBVyxFQUFFLGtCQUFrQjtRQUNqQzs7Ozs7Ozs7O2NBU007S0FDTCxDQUFDOztHQUVXLFlBQVksQ0F5QnhCO0FBekJZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCAqIGFzIGNhbWVyYSBmcm9tIFwibmF0aXZlc2NyaXB0LWNhbWVyYVwiO1xuaW1wb3J0ICogYXMgcm90VmVjdG9yIGZyb20gXCJuYXRpdmVzY3JpcHQtcm90YXRpb24tdmVjdG9yXCI7XG5pbXBvcnQgKiBhcyBjYW1lcmFQcmV2aWV3IGZyb20gXCIuL25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldy9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXdcIjtcbmltcG9ydCB7IEltYWdlIH0gZnJvbSBcInVpL2ltYWdlXCI7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5cbi8vIHRoZSBAIHJlcHJlc2VudHMgYSBkZWNvcmF0b3IgdGhhdCB0ZWxscyBob3cgdGhpcyBjb21wb25lbnQvdGhpbmcgb24gdGhlIHNjcmVlbiB3aWxsIGxvb2suXG4vLyBNb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC1IYW5kYm9vay9ibG9iL21hc3Rlci9wYWdlcy9EZWNvcmF0b3JzLm1kXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibXktYXBwXCIsXG4gIHRlbXBsYXRlVXJsOiBcIi4vaW50ZXJmYWNlLmh0bWxcIlxyXG4vKlxyXG4gIGAgPCEtLSBkb24ndCBmb3JnZXQgdGhlIHRpY2tzOyBpdCdzIGltcG9ydGFudC4gVGhleSdyZSBmb3IgRVMyMDE1IHRlbXBsYXRlIGxpdGVyYWxzIC0tPlxyXG4gICA8IS0tICAgICBNYWtlIHN1cmUgdGhleSdyZSA8Li4uPjwvPiBhbmQgbm90IGp1c3QgPC4uLi8+ICAgICAtLT5cclxuICA8QWN0aW9uQmFyIHRpdGxlPVwie059IFN1cnZleW9yIENhbWVyYVwiPjwvQWN0aW9uQmFyPlxyXG4gIDxTdGFja0xheW91dCBob3Jpem9udGFsQWxpZ25tZW50PVwiY2VudGVyXCIgdmVydGljYWxBbGlnbm1lbnQ9XCJjZW50ZXJcIj5cbiAgICAgIDxJbWFnZSBbc3JjXT1cInBpY3R1cmVcIiB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjIwMFwiPjwvSW1hZ2U+IDwhLS1odHRwOi8vbnNpbWFnZS5icm9zdGVpbnMuY29tLy0tPlxuICAgICAgPEJ1dHRvbiB0ZXh0PVwiQ2FwdHVyZVwiICh0YXApPVwib25DcmVhdGluZ1ZpZXcoKVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PC9CdXR0b24+XG4gICAgICA8UGxhY2Vob2xkZXIgY3JlYXRpbmdWaWV3ID0gXCJvbkNyZWF0aW5nVmlld1wiIGlkPVwicGxhY2Vob2xkZXItdmlld1wiPjwvUGxhY2Vob2xkZXI+XHJcbiAgPC9TdGFja0xheW91dD5cclxuICBgICovXHJcbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICBwdWJsaWMgcGljdHVyZTogYW55O1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjYW1lcmEucmVxdWVzdFBlcm1pc3Npb25zKCk7XG4gICAgLy9jYW1lcmFQcmV2aWV3Lm9uTG9hZGVkKCk7XG5cbiAgICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIng6IFwiICsgZGF0YS54ICsgXCIgeTogXCIgKyBkYXRhLnkgKyBcIiB6OiBcIiArIGRhdGEueik7XG4gICAgfSk7XG4gICAgdGhpcy5waWN0dXJlID0gXCJ+L2ltYWdlcy9hcHBsZS5qcGdcIjtcbiAgfVxuICBwdWJsaWMgdGFrZVBpY3R1cmUoKSB7XHJcbiAgICAgICAgY2FtZXJhLnRha2VQaWN0dXJlKCkudGhlbihwaWN0dXJlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gcGljdHVyZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cbiAgcHVibGljIG9uTG9hZGVkKGFyZ3MpIHtcbiAgICBjYW1lcmFQcmV2aWV3Lm9uTG9hZGVkKGFyZ3Mub2JqZWN0KTtcbiAgfVxuICBwdWJsaWMgb25DcmVhdGluZ1ZpZXcoYXJncykge1xuICAgIGNhbWVyYVByZXZpZXcub25DcmVhdGluZ1ZpZXcoYXJncyk7XG4gIH1cbiAgcHVibGljIG9uVGFrZVNob3QoYXJncykge1xuICAgIGNhbWVyYVByZXZpZXcub25UYWtlU2hvdChhcmdzKTtcbiAgfVxufVxuIl19