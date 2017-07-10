import { Component } from "@angular/core";
import * as camera from "nativescript-camera";
import * as rotVector from "nativescript-rotation-vector";
import * as cameraPreview from "./nativescript-camera-preview/nativescript-camera-preview";
import { Image } from "ui/image";
import * as app from "application";

// the @ represents a decorator that tells how this component/thing on the screen will look.
// More here: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md
@Component({
  selector: "my-app",
  template: ` <!-- don't forget the ticks; it's important. They're for ES2015 template literals -->
   <!--     Make sure they're <...></> and not just <.../>     -->
  <ActionBar title="{N} Surveyor Camera"></ActionBar>
  <StackLayout horizontalAlignment="center" verticalAlignment="center">
      <Image [src]="picture" width="200" height="200"></Image> <!--http://nsimage.brosteins.com/-->
      <Button text="Capture" (tap)="onCreatingView()" class="btn btn-primary"></Button>
      <Placeholder creatingView = "onCreatingView" id="placeholder-view"></Placeholder>
  </StackLayout>
  `
})

export class AppComponent {
  public picture: any;
  constructor() {
    camera.requestPermissions();
    //cameraPreview.onLoaded();

    rotVector.startRotUpdates(function(data) {
        //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
    });
    this.picture = "~/images/apple.jpg";
  }
  public takePicture() {
        camera.takePicture().then(picture => {
            this.picture = picture;
        });
    }
  public onCreatingView(args) {
    console.dir(cameraPreview);
    cameraPreview.onCreatingView(args);
  }
}
