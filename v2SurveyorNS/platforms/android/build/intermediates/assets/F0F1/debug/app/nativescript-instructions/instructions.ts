import * as platform from "platform";

let isStart: boolean = false;
let isEleAbove0: boolean = false;
let isPressed: boolean = false;
let largeDeltaAz: boolean = false;
let oldAz: number = 0;

let page;
let pt1, pt2, pt3, pt4;
const translateY = platform.screen.mainScreen.heightPixels / 8 /platform.screen.mainScreen.scale;

export function trigger1(mPage) {
  if(!isStart) {
    page = mPage;
    pt1 = page.getViewById("pt1");
    pt2 = page.getViewById("pt2");
    pt3 = page.getViewById("pt3");
    pt4 = page.getViewById("pt4");
    pt1.translateY = translateY;
    pt2.translateY = translateY;
    pt3.translateY = translateY;
    pt4.translateY = translateY;
  }
}

export function trigger2(ele) {
  if(!isEleAbove0) {
    isEleAbove0 = -ele > 0;
    if(isEleAbove0) {
      fadeaway(pt1, pt2);
    }
  }
}

export function trigger3(az) {
  if(!isPressed) {
    fadeaway(pt2, pt3);
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

function fadeaway(oldView, newView) {
  return oldView.animate({
    opacity: 0,
    duration: 1000
  }).then(()=>{
    newView.animate({
      opacity: 1,
      duration: 1000
    });
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
    });
  });
}
