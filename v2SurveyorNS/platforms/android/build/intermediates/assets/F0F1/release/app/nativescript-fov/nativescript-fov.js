"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const common = require('./nativescript-fov-common');

let mCamera = null;
let params = null;

// functions pulled from the common module code
exports.degrees2Pixels = common.degrees2Pixels;
exports.degrees2Scale = common.degrees2Scale;
exports.dp2Pixels = common.dp2Pixels;
exports.pixels2Dp = common.pixels2Dp;
exports.getVerticalFOV = common.getVerticalFOV;
exports.getHorizontalFOV = common.getHorizontalFOV;

/** Function: sets the FOV from the params
 */
function setFOV() {
  common.verticalFOV = params.getVerticalViewAngle();
  common.horizontalFOV = params.getHorizontalViewAngle();
}

/** Function: Runs the setVarsHelper
 */
exports.setVars = function (maxWidth, maxHeight) {
  common.setVarsHelper(maxWidth, maxHeight);
}

/** Function: saves the params object by opening and closing the camera
 */
exports.initialize = function () {
  mCamera = android.hardware.Camera.open(0); // TODO: change which camera to open, so it doesn't error out
  params = mCamera.getParameters();
  mCamera.release();
  mCamera = null;
  setFOV();
}
