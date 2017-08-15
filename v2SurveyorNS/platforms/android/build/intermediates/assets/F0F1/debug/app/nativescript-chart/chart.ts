import * as platform from "platform";
import * as bitmapFactory from "nativescript-bitmap-factory";
import * as knownColors from "color/known-colors";
import * as ImageModule from "tns-core-modules/ui/image";

let page;
const ele: number[] = [];

let maxEle : number;
let minEle : number;

let imgSrc = null;
let timer: number;
let bmp;
const width = platform.screen.mainScreen.widthPixels/360;
const heightMult = platform.screen.mainScreen.heightPixels/4;

export function initGraph(myPage) {
  bmp = bitmapFactory.create(platform.screen.mainScreen.widthPixels,heightMult);
  page = myPage;
  maxEle = 60;
  minEle = 0;
  timer = 60;

  for(let i = 0; i < 360; i++) {
    ele.push((maxEle+ minEle)/2);
    const heightPercent = (ele[i] - minEle)/(maxEle-minEle);
    bmp.drawRect(width + "x" + (heightMult * heightPercent), (i * width) + "," + heightMult* (1 - heightPercent), "#1b5675", "#1b5675");
  }
  imgSrc = bmp.toImageSource();
  page.getViewById("graph").src = imgSrc;
}

export async function updateGraph(azimuth, elevation) {
  ele[Math.floor(azimuth)+180] = -elevation < minEle? minEle :-elevation > maxEle? maxEle: -elevation;

  // console.log("az-el: " + azimuth + "-  " + ele[azimuth]);
  if (timer > 0) {
    timer--;
  } else {
    timer = 60;
    bmp.dispose();
    bmp = bitmapFactory.create(platform.screen.mainScreen.widthPixels,heightMult);
    for(let i = 0; i < 360; i++) {
      console.log(ele[i]);
      const heightPercent = (ele[i] - minEle)/(maxEle-minEle);
      // console.log("height: "+ heightPercent);
      bmp.drawRect(width + "x" + (heightMult * heightPercent), (i * width) + "," + heightMult* (1 - heightPercent), "#1b5675", "#1b5675");
    }
    imgSrc = bmp.toImageSource();
    page.getViewById("graph").src = imgSrc;
  }
}
export function onExit() {
  // bmp.dispose();
}
