"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require('./nativescript-fov-common');

const ERROR_ADJUSTMENT = 63/59.68; // 63 is the correct, actual FOV; 59.68 is the API-given FOV

exports.degrees2Pixels = common.degrees2Pixels;
exports.degrees2Scale = common.degrees2Scale;
exports.dp2Pixels = common.dp2Pixels;
exports.pixels2Dp = common.pixels2Dp;
exports.getVerticalFOV = common.getVerticalFOV;
exports.getHorizontalFOV = common.getHorizontalFOV;

function setFOV(HFOV) {
  common.horizontalFOV = HFOV * ERROR_ADJUSTMENT; // the constant hopefully corrects every device.
  common.verticalFOV = 180/ Math.PI * 2* Math.atan(Math.tan(common.horizontalFOV * Math.PI/180/2) * 9/16); //TODO: Fix the aspect ratio constant
}
exports.setVars = function (maxWidth, maxHeight) {
  common.setVarsHelper(maxWidth, maxHeight);
}

exports.initialize = function () {
  const device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo);
  setFOV(device.activeFormat.videoFieldOfView);
}
