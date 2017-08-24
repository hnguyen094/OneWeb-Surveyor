/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import * as cameraPreview from './nativescript-camera-preview/nativescript-camera-preview';
import * as rotVector from "./nativescript-rotation-vector/index";
import * as app from "application";
import * as platform from "platform";
import * as orientation from "nativescript-screen-orientation";
import * as params from "./nativescript-fov/nativescript-fov";
import * as permissions from "nativescript-permissions";
import * as charts from "./nativescript-chart/chart";
import * as instructions from "./nativescript-instructions/instructions";
import {AnimationCurve} from "ui/enums";

let crosshair: any;
let doubleline: any;
let upperText: any;
let lowerText: any;
let capturebtn: any;
let clearbtn: any;
let recordstop: any;
let x, y, z;
let page;
let isOn: boolean = false;
let isFirst = true;
let timer: number = 100;
// let filters;

const OUTER_CIRCLE_DIAMETER = 2;
const ANGLE_BETWEEN_LINES = 10;
const yTranslate = app.ios? -20 : 0;

// Function: resizes the necessary graphics at startup
const resize = function() {
  const scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
  crosshair.scaleX = scaleCrosshair;
  crosshair.scaleY = scaleCrosshair;
  crosshair.translateY = yTranslate;

  const scaleDoubleLine = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight());
  doubleline.scaleX = scaleDoubleLine;
  doubleline.scaleY = scaleDoubleLine;

  let cameraView = page.getViewById("placeholder-view");
  cameraView.animate({
    scale: {
      x: platform.screen.mainScreen.heightPixels/cameraView.getMeasuredHeight(),
      y: platform.screen.mainScreen.heightPixels/cameraView.getMeasuredHeight()
    },
    translate: {
      x: 0,
      y: app.ios? -10 : 0
    },
    duration: 200
  });

};

// Function: the update that animates all the graphics
const updateCallback = function() {
  charts.updateGraph(x,y, isOn);
  instructions.trigger2(y);
  instructions.trigger4(x);
  if(isFirst) {
    resize();
    isFirst = false;
  }
  crosshair.rotate = -z;
  const distanceFromCenter = params.pixels2Dp((params.degrees2Pixels((-y % ANGLE_BETWEEN_LINES)
                            - ANGLE_BETWEEN_LINES/2 * (y>0? -1: 1))));
  doubleline.translateX = Math.sin(z*Math.PI/180)*distanceFromCenter;
  doubleline.translateY =  Math.cos(z*Math.PI/180)*distanceFromCenter + yTranslate;
  doubleline.rotate = -z;

  const dist = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight())*params.degrees2Pixels(ANGLE_BETWEEN_LINES/2);

  lowerText.text = 10* Math.floor(-y/10);
  lowerText.translateX = Math.sin(z * Math.PI/180)* ((app.ios? 20: 0) + distanceFromCenter + dist);
  lowerText.translateY = Math.cos(z * Math.PI/180)* ((app.ios? 20: 0) + distanceFromCenter + dist) + yTranslate;
  lowerText.rotate = -z;

  upperText.text = 10* Math.floor((-y + 10)/10);
  upperText.translateX = Math.sin(z * Math.PI/180)* ((app.ios? -20: 0) + distanceFromCenter - dist);
  upperText.translateY = Math.cos(z * Math.PI/180)* ((app.ios? -20: 0) + distanceFromCenter - dist) + yTranslate;
  upperText.rotate = -z;
};

// Function: updates the x/y/z values from the rotation callback
const rotationCallback = function(data) {
    x = data.x;
    y = data.y;
    z = data.z;
    if(app.ios) updateCallback(); // ios doesn't seem to expose a callback for every frame update in the camera preview; therefore, we'll hop on the rotation callback
};

// Function: sets the pap to be fullscreen and orientation to be always portrait
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

// Function: creates the graph, instructions, view, permissions, FOV when initializing placeholder
export function onCreatingView(args: EventData) {
  charts.initGraph(page);
  instructions.trigger1(page);
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
  rotVector.startRotUpdates(rotationCallback,  { sensorDelay: "game" });
  const maxSize = cameraPreview.getMaxSize();
  params.setVars(maxSize[0], maxSize[1]);
}

// Function: When the record button is pressed
export function onTakeShot(args: EventData) {
  cameraPreview.onTakeShot(args);
  instructions.trigger3(x);
  isOn = !isOn;

  capturebtn.animate({
    scale: { x: 1.2, y: 1.2 },
    duration: 100
  }).then(()=> {
    capturebtn.animate(
      {
        scale: { x: 1, y: 1},
        duration: 300,
        curve: AnimationCurve.spring
      }
    );
    recordstop.src = isOn? "res://stop" : "res://record";
  });
  console.log("el: " + y);
}

// Function: when the clear button is pressed (for charts)
export function onClear(args: EventData) {
  charts.clear();
  clearbtn.animate({
    scale: { x: 1.2, y: 1.2 },
    duration: 100
  }).then(()=> {
    clearbtn.animate({
        scale: { x: 1, y: 1},
        duration: 300,
        curve: AnimationCurve.spring
    });
  });
}

// Function: sets the view variables from the page
export function navigatingTo(args: EventData) {
    page = <Page>args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
    capturebtn = page.getViewById("capturebtn");
    clearbtn = page.getViewById("clearbtn");
    recordstop = page.getViewById("recordstop");
}

// Function: Resumes the app
app.on(app.resumeEvent, function(args) {
  rotVector.startRotUpdates(rotationCallback,  { sensorDelay: "game" });
  cameraPreview.onResume();
});

// Function: Pauses the app
app.on(app.suspendEvent, function(args) {
  cameraPreview.onPause();
  rotVector.stopRotUpdates();
  charts.onExit();
});

// Function: when the app exits
// UNUSED
app.on(app.exitEvent, function(args) {
  console.log("On Exitting");
  rotVector.stopRotUpdates();
});
