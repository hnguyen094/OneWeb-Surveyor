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
  template: "interface.html"
})

export class AppComponent {
  constructor() {
    camera.requestPermissions();
    //cameraPreview.onLoaded();

    rotVector.startRotUpdates(function(data) {
        //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
    });
  }
  public onCreatingView(args) {
    cameraPreview.onCreatingView(args);
  }
}
