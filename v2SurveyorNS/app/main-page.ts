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

const updateCallback = function() {
  // console.log("Entered updateCallback");
  const scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
  crosshair.animate({
    scale: {
      x: scaleCrosshair,
      y: scaleCrosshair
    },
    translate: {
      x: 0,
      y: app.ios? -10 : 0
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
      y: Math.cos(z*Math.PI/180)*distanceFromCenter + (app.ios? -10 : 0)
    },

    rotate: -z,
    duration: 0
  });
  lowerText.animate({
    translate: {
      x : Math.sin(z*Math.PI/180)* (distanceFromCenter+scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2)),
      y : Math.cos(z*Math.PI/180)* (distanceFromCenter+scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2)) + (app.ios? -10 : 0)
    },
    rotate: -z,
    duration: 0
  });
  upperText.animate({
    translate: {
      x :  Math.sin(z*Math.PI/180)* (distanceFromCenter-scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2)),
      y :  Math.cos(z*Math.PI/180)* (distanceFromCenter-scaleDoubleLine*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2)) + (app.ios? -10 : 0)
    },
    rotate: -z,
    duration: 0
  });
  if (app.ios) {
    let cameraView = page.getViewById("placeholder-view");
    cameraView.animate({
      scale: {
        x: platform.screen.mainScreen.heightPixels/cameraView.getMeasuredHeight(),
        y: platform.screen.mainScreen.heightPixels/cameraView.getMeasuredHeight()
      },
      translate: {
        x: 0,
        y: app.ios? 10 : 0
      },
      duration: 2000
    });
  }

};

// export function showSideDrawer(args: EventData) {
//     console.log("Show SideDrawer tapped.");
// }

//TODO: split up the code
export function onLoaded(args: EventData) {
  orientation.setCurrentOrientation("portrait", () => {});
  if (app.android && platform.device.sdkVersion >= '21') {
      const View :any = android.view.View;
      const window = app.android.startActivity.getWindow();
      // set the status bar to Color.Transparent
      // window.setStatusBarColor(0x000000);
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
}

export function onCreatingView(args: EventData) {
  if(app.android) {
    permissions.requestPermission(android["Manifest"].permission.CAMERA, "I need these permissions for the viewfinder")
    .then(function() {
       console.log("Woo Hoo, I have the power!");
    })
    .catch(function() {
       console.log("Uh oh, no permissions - plan B time!");
    });
  }

  if(app.android) params.initialize();
  cameraPreview.onCreatingView(updateCallback, args);
  if (app.ios !== undefined) params.initialize();
  const maxSize = cameraPreview.getMaxSize();
  params.setVars(maxSize[0], maxSize[1]);
  measuredWidth = params.degrees2Pixels(OUTER_CIRCLE_DIAMETER);
  // console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}

export function onTakeShot(args: EventData) {
  cameraPreview.onTakeShot(args);
  console.log("el: " + y);
}

export function navigatingTo(args: EventData) {
    page = <Page>args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
    page.bindingContext = new HelloWorldModel();
}

app.on(app.resumeEvent, function(args) {
  rotVector.startRotUpdates(function(data) {
      //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
      x = data.x;
      y = data.y;
      z = data.z;
      if(app.ios) updateCallback(); // ios doesn't seem to expose a callback for every frame update in the camera preview; therefore, we'll hop on the rotation callback
  },  { sensorDelay: "game" });
  cameraPreview.onResume();

});
app.on(app.suspendEvent, function(args) {
  cameraPreview.onPause();
  rotVector.stopRotUpdates();
});
app.on(app.exitEvent, function(args) {
  rotVector.stopRotUpdates();
});
