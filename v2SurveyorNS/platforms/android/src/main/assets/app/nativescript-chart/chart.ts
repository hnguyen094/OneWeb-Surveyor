import * as platform from "platform";
import * as knownColors from "color/known-colors";
import * as ImageModule from "tns-core-modules/ui/image";

let page;
const ele: number[] = [];

let maxEle: number;
let minEle: number;
let targetEle: number;
let prevIndex: number;
let smoothingRange: number; // when there is a data skip in the azimuth, we want to smooth it out linearly. This is the max range of the smoothing. Any jumps more than 20 will not be smoothed

const width = platform.screen.mainScreen.widthPixels / 360 /platform.screen.mainScreen.scale; // in dp
const maxHeight = platform.screen.mainScreen.heightPixels / 8 /platform.screen.mainScreen.scale; // in dp

export function initGraph(myPage) {
  console.log("Entering initGraph");
  page = myPage;
  maxEle = 60;
  minEle = 0;
  smoothingRange = 20;
  page.getViewById("graph").height = maxHeight;
  // const targetline = page.getViewById("ltarget");
  // targetline.height = width;

  for(let i = 0; i < 360; i++) {
    console.log("dealing with: "+ i);
    ele.push((maxEle+ minEle)/2);
    const heightPercent = (ele[i] - minEle)/(maxEle - minEle);
    page.getViewById("l"+i).height = maxHeight;
  }
}

export function updateGraph(azimuth, elevation) {
  const az = Math.floor(azimuth) + 180;
  ele[az] = -elevation<minEle? minEle: -elevation>maxEle? maxEle: -elevation;

  const currentView = page.getViewById("l"+az);
  currentView.height = maxHeight * ele2Percent(ele[az]);

  const dif = az-prevIndex;
  if(Math.abs(dif) > 1 && Math.abs(dif) < smoothingRange) {
    let start, end;
    if(dif > 0) {
      start = prevIndex + 1;
      end = az;
    } else {
      start = az + 1;
      end = prevIndex;
    }
    for (let i = start; i < end; i++) {
      ele[i] = ele[start-1] + (i - start+1) / (dif-1) * (ele[az]-ele[prevIndex]);
      page.getViewById("l"+(i)).height = maxHeight * ele2Percent(ele[i]);
    }
  }
  prevIndex = az;
}

function ele2Percent(elevation) {
  return (elevation - minEle)/(maxEle-minEle);
}

export function onExit() {
}
