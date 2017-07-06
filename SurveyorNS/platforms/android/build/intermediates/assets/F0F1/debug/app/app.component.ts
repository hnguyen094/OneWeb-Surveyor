import { Component } from "@angular/core";
import * as Camera from "nativescript-camera";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {

    public picture: any;

    public constructor() {
        this.picture = "https://placehold.it/200x200";
    }

    public takePicture() {
        Camera.takePicture().then(picture => {
            this.picture = picture;
        });
    }

}
