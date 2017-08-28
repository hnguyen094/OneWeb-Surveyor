"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

const platformModule = require("tns-core-modules/platform"); //needed for screen size
/*The export keyword is used to make the variables accessible to other files that import it*/
exports.verticalFOV; // assumes of the largest resolution w/o discrimination to ratio
exports.horizontalFOV; // assumes of the largest resolution w/o discrimination to ratio
exports.z; // constant value of the camera
exports.maxPictureWidth; // constant value of the phone
exports.maxPictureHeight; // not used

/** Function: converts the degrees to pixels
 * @param angle the angle you want to convert to pixels
 */
exports.degrees2Pixels= function(angle) {
  let x = 2 * exports.z * Math.tan(angle * Math.PI / 180 / 2);
  return x * platformModule.screen.mainScreen.heightPixels/exports.maxPictureWidth; // height pixels because screen is vertical (I think)
}

/** Function: converts angle to scale/multiplier
 * @param angle the angle to convert
 * @param length  the length of the view
 */
exports.degrees2Scale= function(angle, length) {
  return exports.degrees2Pixels(angle) / length;
}

/** Function: converts dp (a pixel-independent unit) to pixels
 * @param dp  the dp to convert
 */
exports.dp2Pixels = function(dp) {
  return dp * platformModule.screen.mainScreen.scale;
}

/** Function: convert pixels to dp
 * @param pixels  the pixels to convert
 */
exports.pixels2Dp = function(pixels) {
  return pixels / platformModule.screen.mainScreen.scale;
}

/** Function: set the width and height and the z variable
 */
exports.setVarsHelper = function (maxWidth, maxHeight) { // exports for private use, rather than public
  exports.maxPictureHeight = maxHeight;
  exports.maxPictureWidth = maxWidth;
  exports.z = maxWidth/2/Math.tan(exports.horizontalFOV * Math.PI / 180 / 2);
}

/** Function: gets the vertical FOV
 * UNUSED
 */
exports.getVerticalFOV = function () {
  return exports.verticalFOV;
}

/** Function: gets the horizontal FOV
 * UNUSED
 */
exports.getHorizontalFOV = function() {
  return exports.horizontalFOV;
}
