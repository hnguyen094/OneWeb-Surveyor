import * as platform from "platform";
import * as layout from "ui/layouts/grid-layout";

let page;
const ele: number[] = [];

let minEle: number = 0;
let targetEle: number = 40;
let maxEle: number = 60;
let prevIndex: number;
let smoothingRange: number = 20; // when there is a data skip in the azimuth, we want to smooth it out linearly. This is the max range of the smoothing. Any jumps more than 20 will not be smoothed

const width = platform.screen.mainScreen.widthPixels / 360 /platform.screen.mainScreen.scale; // in dp
const maxHeight = platform.screen.mainScreen.heightPixels / 8 /platform.screen.mainScreen.scale; // in dp

/** Function: initialize the graph with graph height, target line, and default values
 * @param myPage  used to eventually get views by id
 */
export function initGraph(myPage) {
  console.log("Entering initGraph");
  page = myPage;
  page.getViewById("graph").height = maxHeight;
  const ltarget = page.getViewById("ltarget");
  ltarget.height = width;
  ltarget.translateY = -maxHeight * ele2Percent(targetEle);

  for(let i = 0; i < 360; i++) {
    ele.push((maxEle+ minEle)/2); // start at 50%
    page.getViewById("l"+i).height = maxHeight * ele2Percent(ele[i]);
  }
}

/** Function: update the graph
 * @param azimuth an arbitrary azimuth
 * @param elevation the elevation at that azimuth
 * @param isOn  whether or not the record button is toggled on
 */
export function updateGraph(azimuth, elevation, isOn) {
  const az = Math.floor(azimuth) + 180;
  layout.GridLayout.setColumn(page.getViewById("lcursor"), az);
  if(isOn){
    ele[az] = -elevation<minEle? minEle: -elevation>maxEle? maxEle: -elevation;
    const currentView = page.getViewById("l"+az);
    currentView.height = maxHeight * ele2Percent(ele[az]);
    const dif = az-prevIndex;
    if(Math.abs(dif) > 1 && Math.abs(dif) < smoothingRange) { // the smoothing range
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
}

/* Function: clears the graph, and reset the bars
 */
export function clear() {
  for(let i = 0; i < 360; i++) {
    ele[i] = (maxEle+ minEle)/2;
    page.getViewById("l"+i).height = maxHeight * ele2Percent(ele[i]);
  }
}

/** Function: convert the elevation to the percentage of the maxHeight
 */
function ele2Percent(elevation) {
  return (elevation - minEle)/(maxEle-minEle);
}

/* Function: called when the app exits
 * UNUSED
 */
export function onExit() {
}
