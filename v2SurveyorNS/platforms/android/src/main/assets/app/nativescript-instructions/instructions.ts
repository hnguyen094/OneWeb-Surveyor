// A quick implementation of instructions
import * as platform from "platform";

let isStart: boolean = false;
let isEleAbove0: boolean = false;
let isPressed: boolean = false;
let largeDeltaAz: boolean = false;
let oldAz: number = 0;

let page;
let pt1, pt2, pt3, pt4, pt5;
let currentView;
const translateY = platform.screen.mainScreen.heightPixels / 8 /platform.screen.mainScreen.scale;

// Function: triggers at the start of the application
export function trigger1(mPage) {
  if(!isStart) {
    page = mPage;
    pt1 = page.getViewById("pt1");
    pt2 = page.getViewById("pt2");
    pt3 = page.getViewById("pt3");
    pt4 = page.getViewById("pt4");
    pt5 = page.getViewById("pt5");
    pt1.translateY = translateY;
    pt2.translateY = translateY;
    pt3.translateY = translateY;
    pt4.translateY = translateY;
    pt5.translateY = translateY;
    currentView = pt1;
  }
}

// Function: triggers every update; dependent on elevation
export function trigger2(ele) {
  if(!isEleAbove0) {
    isEleAbove0 = -ele > 0;
    if(isEleAbove0) {
      fadeaway(pt2);
    }
  } else if(-ele > 40) {
    pt5.opacity = 1;
  } else {
    pt5.opacity = 0;
  }
}

// Function: triggers at the first click; dependent on button press
export function trigger3(az) {
  if(!isPressed) {
    fadeaway(pt3);
    isEleAbove0 = true;
  }
  oldAz = az;
  isPressed = true;
}

// Function: triggers every update; dependent on large delta azimuth
export function trigger4(az) {
  if(!largeDeltaAz && isPressed){
    largeDeltaAz = Math.abs(oldAz-az) > 20;
    if(largeDeltaAz) {
      end(pt3, pt4);
    }
  }
}

// Function: animates the currentView away and animate the newView in
// Also sets the newView to the currentView
function fadeaway(newView) {
  return currentView.animate({
    opacity: 0,
    duration: 1000
  }).then(()=>{
    newView.animate({
      opacity: 1,
      duration: 1000
    });
    currentView = newView;
  });
}

// Function: used exclusively as a timed animation to hide, show, then hide again
// Also sets the newView to the currentView
function end(oldView, newView) {
  oldView.animate({
    opacity: 0,
    duration: 1000
  }).then(() =>{
    newView.animate({
      opacity: 1,
      duration: 2000
    }).then(() => {
      newView.animate({
        opacity:0,
        duration: 2000
      });
      currentView = newView;
    });
  });
}

// Function: hides a view
// Does not set/reset the currentView
function hide(view) {
  view.animate({
    opacity: 0,
    duration: 1000
  });
}
