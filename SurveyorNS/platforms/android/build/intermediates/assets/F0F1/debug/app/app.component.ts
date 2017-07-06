import { Component } from "@angular/core";
import * as camera from "nativescript-camera";
import * as accelerometer from "nativescript-accelerometer";
import { Image } from "ui/image";
import * as application from "application";

@Component({
  selector: "my-app",
  template: `
  <ActionBar title="{N} Camera Example"></ActionBar>
  <StackLayout horizontalAlignment="center" verticalAlignment="center">
      <Image [src]="picture" width="200" height="200"></Image>
      <Button text="Capture" (tap)="takePicture()" class="btn btn-primary"></Button>
  </StackLayout>
  `
})
export class AppComponent {
  public picture: any;
  public roll: any;
  public pitch: any;
  constructor() {
    camera.requestPermissions();
    accelerometer.startAccelerometerUpdates(function(data) {
        this.roll = Math.atan2(data.y, data.z) * 180/Math.PI;
        this.pitch = Math.atan2(-data.x, Math.sqrt(data.y*data.y + data.z*data.z)) * 180/Math.PI;
        //console.log("x: " + data.x + "y: " + data.y + "z: " + data.z);
        console.log("roll: " + this.roll + "pitch: " + this.pitch);
    }.bind(this));
    this.picture = "~/images/apple.jpg";
  }
  public takePicture() {
        camera.takePicture().then(picture => {
            this.picture = picture;
        });
    }
}
