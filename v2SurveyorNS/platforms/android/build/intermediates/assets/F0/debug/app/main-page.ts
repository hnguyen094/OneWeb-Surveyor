/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { HelloWorldModel } from './main-view-model';
import * as cameraPreview from './nativescript-camera-preview/nativescript-camera-preview';
import * as rotVector from "./nativescript-rotation-vector/index";
import * as app from "application";
import * as frameModule from "tns-core-modules/ui/frame";
import * as animation from "tns-core-modules/ui/animation";
import * as platform from "platform";
import * as orientation from "nativescript-screen-orientation";
import * as params from "./nativescript-fov/nativescript-fov";
import * as permissions from "nativescript-permissions";

let crosshair :any;
let doubleline :any;
let upperText :any;
let lowerText :any;
let x, y, z;
let measuredWidth;
let page;

const OUTER_CIRCLE_DIAMETER = 2;
const ANGLE_BETWEEN_LINES = 10;

export function showSideDrawer(args: EventData) {
    console.log("Show SideDrawer tapped.");
}

//TODO: split up the code
export function onLoaded(args: EventData) {
  orientation.setCurrentOrientation("portrait", () => {});
  const View :any = android.view.View;
  if (app.android && platform.device.sdkVersion >= '21') {
      const window = app.android.startActivity.getWindow();
      // set the status bar to Color.Transparent
      window.setStatusBarColor(0x000000);
      const decorView = window.getDecorView();
      decorView.setSystemUiVisibility(
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
          | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
          | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  }
  cameraPreview.onLoaded(args, "placeholder-view");


  rotVector.startRotUpdates(function(data) {
      // console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
      x = data.x;
      y = data.y;
      z = data.z;
  },  { sensorDelay: "game" });
}

export function onCreatingView(args: EventData) {
  permissions.requestPermission(android["Manifest"].permission.CAMERA, "I need these permissions for the viewfinder")
  .then(function() {
     console.log("Woo Hoo, I have the power!");
  })
  .catch(function() {
     console.log("Uh oh, no permissions - plan B time!");
  });
  params.initialize();
  cameraPreview.onCreatingView(function() {
    const scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
    crosshair.animate({
      scale: {
        x: scaleCrosshair,
        y: scaleCrosshair
      },
      rotate: -z,
      duration: 0
    });

    const scaleDoubleLine = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight());
    const distanceFromCenter = params.pixels2Dp((params.degrees2Pixels((-y % ANGLE_BETWEEN_LINES)
                              - ANGLE_BETWEEN_LINES/2 * (y>0? -1: 1))));
    lowerText.text = 10* Math.floor(-y/10);
    upperText.text = 10* Math.floor((-y+10)/10);
    doubleline.animate({
      scale: {
        x: scaleDoubleLine,
        y: scaleDoubleLine
      },
      translate: {
        x : Math.sin(z*Math.PI/180)*distanceFromCenter,
        y: Math.cos(z*Math.PI/180)*distanceFromCenter
      },

      rotate: -z,
      duration: 0
    });
    lowerText.animate({
      translate: {
        x : Math.sin(z*Math.PI/180)* (distanceFromCenter+scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2)),
        y : Math.cos(z*Math.PI/180)* (distanceFromCenter+scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2))
      },
      rotate: -z,
      duration: 0
    });
    upperText.animate({
      translate: {
        x :  Math.sin(z*Math.PI/180)* (distanceFromCenter-scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2)),
        y :  Math.cos(z*Math.PI/180)* (distanceFromCenter-scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2))
      },
      rotate: -z,
      duration: 0
    });

  }, args);
  const maxSize = cameraPreview.getMaxSize();
  params.setVars(maxSize[0], maxSize[1]);
  measuredWidth = params.degrees2Pixels(OUTER_CIRCLE_DIAMETER);
  console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}

export function onTakeShot(args: EventData) {
  cameraPreview.onTakeShot(args);
  console.log("el: " + y);
}

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    page = <Page>args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and TypeScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().


    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    page.bindingContext = new HelloWorldModel();
}

//TODO: Camera onResume, when it's lost. FYI: https://docs.nativescript.org/core-concepts/application-lifecycle
app.on(app.resumeEvent, function(args) {
  //onCreatingView(args);
  cameraPreview.onResume();
});
app.on(app.suspendEvent, function(args) {
  cameraPreview.onPause();
  rotVector.stopRotUpdates();
});
app.on(app.exitEvent, function(args) {
  rotVector.stopRotUpdates();
});
