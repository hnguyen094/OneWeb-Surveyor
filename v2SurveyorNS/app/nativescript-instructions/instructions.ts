import * as platform from "platform";

let isStart: boolean = false;
let isEleAbove0: boolean = false;
let isElePast40: boolean = false;
let isPressed: boolean = false;
let largeDeltaAz: boolean = false;
let oldAz: number = 0;

let page;
let pt1, pt2, pt3, pt4, pt5;
let currentView;
const translateY = platform.screen.mainScreen.heightPixels / 8 /platform.screen.mainScreen.scale;

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

export function trigger3(az) {
  if(!isPressed) {
    fadeaway(pt3);
  }
  oldAz = az;
  isPressed = true;
}

export function trigger4(az) {
  if(!largeDeltaAz && isPressed){
    largeDeltaAz = Math.abs(oldAz-az) > 20;
    if(largeDeltaAz) {
      end(pt3, pt4);
    }
  }
}

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
function hide(view) {
  view.animate({
    opacity: 0,
    duration: 1000
  });
}
