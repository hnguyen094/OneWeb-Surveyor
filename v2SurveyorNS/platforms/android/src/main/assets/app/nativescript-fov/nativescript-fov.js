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
