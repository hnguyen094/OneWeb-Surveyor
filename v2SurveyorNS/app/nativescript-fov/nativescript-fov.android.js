"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const common = require('./nativescript-fov-common');

let mCamera = null;
let params = null;

exports.degrees2Pixels = common.degrees2Pixels;
exports.degrees2Scale = common.degrees2Scale;
exports.getVerticalFOV = common.getVerticalFOV;
exports.getHorizontalFOV = common.getHorizontalFOV;

function setFOV() {
  common.verticalFOV = params.getVerticalViewAngle();
  common.horizontalFOV = params.getHorizontalViewAngle();
}

exports.setVars = function (maxWidth, maxHeight) {
  common.setVarsHelper(maxWidth, maxHeight);
}

exports.initialize = function () {
  mCamera = android.hardware.Camera.open(0); // TODO: change which camera to open, so it doesn't error out
  params = mCamera.getParameters();
  mCamera.release();
  mCamera = null;
  setFOV();
}


// where height is the taller side (horizontalFOV), width is the shorter side (verticalFOV)
function calc(maxWidth, maxHeight) {
  // https://stackoverflow.com/questions/3261776/determine-angle-of-view-of-smartphone-camera
  // z is the conversion value in going from angle to pixel using the formula:
  // x = 2*z*tan(angle/2) where FOV is in radians and x is the pixel value
  // for example, 1 degree is represented by 2*z*tan(1 * Math.PI /180 /2) pixels
  // notice that this is the picture pixel(when data is saved), not the on screen pixels (of the preview)
  // if we assume that the taller side is consant (aka, when I display 1280x720, the 1280 can be directly mapped onto the maxWidth
  // whereas the 720 is actually mapped to some cropped version of maxHeight) then we can also do the equivalent math:
  // x1 = x * 1280/maxWidth where x1 is the screen pixel value equivalent of x
}
