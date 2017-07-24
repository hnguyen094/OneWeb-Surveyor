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

let crosshair :any;
let doubleline :any;
let x, y, z;
let measuredWidth;

const OUTER_CIRCLE_DIAMETER = 2;
const DISTANCE_BETWEEN_LINES = 10;

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
  //cameraPreview.requestPermissions();
  cameraPreview.onLoaded(args);
  rotVector.startRotUpdates(function(data) {
      //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
      x = data.x;
      y = data.y;
      z = data.z;
  },  { sensorDelay: "game" });
}

export function onCreatingView(args: EventData) {
  params.initialize();
  cameraPreview.onCreatingView(function() {
    crosshair.animate({
      scale: {
        x: params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight()),
        y: params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight())
      },
      rotate: -z,
      duration: 0
    });
    let y2 = -params.degrees2Pixels(y);
    doubleline.animate({
      scale: {
        x: params.degrees2Scale(DISTANCE_BETWEEN_LINES, doubleline.getMeasuredHeight()),
        y: params.degrees2Scale(DISTANCE_BETWEEN_LINES, doubleline.getMeasuredHeight())
      },
      translate: { x : 0, y: 2560/4},
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
    let page = <Page>args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
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
});
app.on(app.suspendEvent, function(args) {
  rotVector.stopRotUpdates();
});
app.on(app.exitEvent, function(args) {
  rotVector.stopRotUpdates();
});
