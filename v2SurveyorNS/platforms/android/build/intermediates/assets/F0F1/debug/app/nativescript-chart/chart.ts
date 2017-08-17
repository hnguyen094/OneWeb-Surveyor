import * as platform from "platform";
import * as knownColors from "color/known-colors";
import * as ImageModule from "tns-core-modules/ui/image";

let page;
const ele: number[] = [];

let maxEle : number;
let minEle : number;
let timer : number;

const width = platform.screen.mainScreen.widthPixels / 360;
const maxHeight = platform.screen.mainScreen.heightPixels / 4;

export function initGraph(myPage) {
  console.log("Entering initGraph");
  page = myPage;
  console.log("l0 is " + page.getViewById("l0"));
  maxEle = 60;
  minEle = 0;
  timer = 10;
  page.addCss("#graph" + " {height: " + maxHeight + "}");
  for(let i = 0; i < 360; i++) {
    console.log("dealing with: "+ i);
    ele.push((maxEle+ minEle)/2);
    const heightPercent = (ele[i] - minEle)/(maxEle - minEle);
    // page.addCss("#l" + i + " {height: " + heightPercent*maxHeight + "}");
  }
}

export function updateGraph(azimuth, elevation) {
  const az = Math.floor(azimuth) + 180;
  ele[az] = -elevation<minEle? minEle: -elevation>maxEle? maxEle: -elevation;
  const heightPercent = (ele[az] - minEle)/(maxEle-minEle);
  const currentView = page.getViewById("l"+az);
  currentView.animate({
    translate: {
      x: 0,
      y: 100/2
    },
    scale: {
      x: 1,
      y: heightPercent
    }
  });
}
export function onExit() {
  // bmp.dispose();
}
