"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var camera = require("nativescript-camera");
var rotVector = require("nativescript-rotation-vector");
var cameraPreview = require("./nativescript-camera-preview/nativescript-camera-preview");
// FrameModule is needed in order to have an option to navigate to the new page.
var frameModule = require("tns-core-modules/ui/frame");
// the @ represents a decorator that tells how this component/thing on the screen will look.
// More here: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md
var AppComponent = (function () {
    function AppComponent() {
        camera.requestPermissions();
        console.log("about to load");
        cameraPreview.onLoaded(frameModule.topmost().currentPage);
        console.log("loaded and frame is " + frameModule.topmost().currentPage);
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
        templateUrl: "./template.html"
        /*
          template :
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQThDO0FBQzlDLHdEQUEwRDtBQUMxRCx5RkFBMkY7QUFJM0YsZ0ZBQWdGO0FBQ2hGLHVEQUF5RDtBQUV6RCw0RkFBNEY7QUFDNUYsOEZBQThGO0FBaUI5RixJQUFhLFlBQVk7SUFFdkI7UUFDRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdCLGFBQWEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pFLFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBUyxJQUFJO1lBQ25DLGtFQUFrRTtRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUM7SUFDdEMsQ0FBQztJQUNNLGtDQUFXLEdBQWxCO1FBQUEsaUJBSUc7UUFIRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTztZQUM3QixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDSSwrQkFBUSxHQUFmLFVBQWdCLElBQUk7UUFDbEIsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNNLHFDQUFjLEdBQXJCLFVBQXNCLElBQUk7UUFDeEIsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ00saUNBQVUsR0FBakIsVUFBa0IsSUFBSTtRQUNwQixhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUExQkQsSUEwQkM7QUExQlksWUFBWTtJQWhCeEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFdBQVcsRUFBRSxpQkFBaUI7UUFDaEM7Ozs7Ozs7Ozs7Y0FVTTtLQUNMLENBQUM7O0dBRVcsWUFBWSxDQTBCeEI7QUExQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIm5hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3JcIjtcbmltcG9ydCAqIGFzIGNhbWVyYVByZXZpZXcgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3L25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlld1wiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCAqIGFzIHBhZ2VNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvcGFnZVwiO1xuLy8gRnJhbWVNb2R1bGUgaXMgbmVlZGVkIGluIG9yZGVyIHRvIGhhdmUgYW4gb3B0aW9uIHRvIG5hdmlnYXRlIHRvIHRoZSBuZXcgcGFnZS5cbmltcG9ydCAqIGFzIGZyYW1lTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lXCI7XG5cbi8vIHRoZSBAIHJlcHJlc2VudHMgYSBkZWNvcmF0b3IgdGhhdCB0ZWxscyBob3cgdGhpcyBjb21wb25lbnQvdGhpbmcgb24gdGhlIHNjcmVlbiB3aWxsIGxvb2suXG4vLyBNb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC1IYW5kYm9vay9ibG9iL21hc3Rlci9wYWdlcy9EZWNvcmF0b3JzLm1kXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibXktYXBwXCIsXG4gIHRlbXBsYXRlVXJsOiBcIi4vdGVtcGxhdGUuaHRtbFwiXHJcbi8qXHJcbiAgdGVtcGxhdGUgOlxyXG4gIGAgPCEtLSBkb24ndCBmb3JnZXQgdGhlIHRpY2tzOyBpdCdzIGltcG9ydGFudC4gVGhleSdyZSBmb3IgRVMyMDE1IHRlbXBsYXRlIGxpdGVyYWxzIC0tPlxyXG4gICA8IS0tICAgICBNYWtlIHN1cmUgdGhleSdyZSA8Li4uPjwvPiBhbmQgbm90IGp1c3QgPC4uLi8+ICAgICAtLT5cclxuICA8QWN0aW9uQmFyIHRpdGxlPVwie059IFN1cnZleW9yIENhbWVyYVwiPjwvQWN0aW9uQmFyPlxyXG4gIDxTdGFja0xheW91dCBob3Jpem9udGFsQWxpZ25tZW50PVwiY2VudGVyXCIgdmVydGljYWxBbGlnbm1lbnQ9XCJjZW50ZXJcIj5cbiAgICAgIDxJbWFnZSBbc3JjXT1cInBpY3R1cmVcIiB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjIwMFwiPjwvSW1hZ2U+IDwhLS1odHRwOi8vbnNpbWFnZS5icm9zdGVpbnMuY29tLy0tPlxuICAgICAgPEJ1dHRvbiB0ZXh0PVwiQ2FwdHVyZVwiICh0YXApPVwib25DcmVhdGluZ1ZpZXcoKVwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PC9CdXR0b24+XG4gICAgICA8UGxhY2Vob2xkZXIgY3JlYXRpbmdWaWV3ID0gXCJvbkNyZWF0aW5nVmlld1wiIGlkPVwicGxhY2Vob2xkZXItdmlld1wiPjwvUGxhY2Vob2xkZXI+XHJcbiAgPC9TdGFja0xheW91dD5cclxuICBgICovXHJcbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICBwdWJsaWMgcGljdHVyZTogYW55O1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjYW1lcmEucmVxdWVzdFBlcm1pc3Npb25zKCk7XG4gICAgY29uc29sZS5sb2coXCJhYm91dCB0byBsb2FkXCIpO1xuICAgIGNhbWVyYVByZXZpZXcub25Mb2FkZWQoZnJhbWVNb2R1bGUudG9wbW9zdCgpLmN1cnJlbnRQYWdlKTtcbiAgICBjb25zb2xlLmxvZyhcImxvYWRlZCBhbmQgZnJhbWUgaXMgXCIgICsgZnJhbWVNb2R1bGUudG9wbW9zdCgpLmN1cnJlbnRQYWdlKTtcbiAgICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIng6IFwiICsgZGF0YS54ICsgXCIgeTogXCIgKyBkYXRhLnkgKyBcIiB6OiBcIiArIGRhdGEueik7XG4gICAgfSk7XG4gICAgdGhpcy5waWN0dXJlID0gXCJ+L2ltYWdlcy9hcHBsZS5qcGdcIjtcbiAgfVxuICBwdWJsaWMgdGFrZVBpY3R1cmUoKSB7XHJcbiAgICAgICAgY2FtZXJhLnRha2VQaWN0dXJlKCkudGhlbihwaWN0dXJlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gcGljdHVyZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cbiAgcHVibGljIG9uTG9hZGVkKGFyZ3MpIHtcbiAgICBjYW1lcmFQcmV2aWV3Lm9uTG9hZGVkKGFyZ3Mub2JqZWN0KTtcbiAgfVxuICBwdWJsaWMgb25DcmVhdGluZ1ZpZXcoYXJncykge1xuICAgIGNhbWVyYVByZXZpZXcub25DcmVhdGluZ1ZpZXcoYXJncyk7XG4gIH1cbiAgcHVibGljIG9uVGFrZVNob3QoYXJncykge1xuICAgIGNhbWVyYVByZXZpZXcub25UYWtlU2hvdChhcmdzKTtcbiAgfVxufVxuIl19