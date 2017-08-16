import * as platform from "platform";
import * as knownColors from "color/known-colors";
import * as ImageModule from "tns-core-modules/ui/image";

let page;
const ele: number[] = [];

let maxEle : number;
let minEle : number;

const width = platform.screen.mainScreen.widthPixels / 360;
const maxHeight = platform.screen.mainScreen.heightPixels / 4;

export function initGraph(myPage) {
  console.log("Entering initGraph");
  page = myPage;
  maxEle = 60;
  minEle = 0;
  for(let i = 0; i < 360; i++) {
    ele.push((maxEle+ minEle)/2);
    const heightPercent = (ele[i] - minEle)/(maxEle - minEle);
  }
}

export function updateGraph(azimuth, elevation) {
  ele[Math.floor(azimuth) + 180] = -elevation<minEle? minEle: -elevation>maxEle? maxEle: -elevation;
}
export function onExit() {
  // bmp.dispose();
}
