"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require('./nativescript-fov-common');

exports.degrees2Pixels = common.degrees2Pixels;
exports.degrees2Scale = common.degrees2Scale;
exports.dp2Pixels = common.dp2Pixels;
exports.pixels2Dp = common.pixels2Dp;
exports.getVerticalFOV = common.getVerticalFOV;
exports.getHorizontalFOV = common.getHorizontalFOV;

function setFOV(HFOV) {
  common.horizontalFOV = HFOV;
  common.verticalFOV = 180/ Math.PI * 2* Math.atan(Math.tan(HFOV * Math.PI/180/2) * 9/16); //TODO: Fix the aspect ratio constant
  console.log("HFOV x VFOV: " + common.horizontalFOV + "x" + common.verticalFOV); //TODO: Make sure they're consistent with the android
}
exports.setVars = function (maxWidth, maxHeight) {
  common.setVarsHelper(maxWidth, maxHeight);
}

exports.initialize = function () {
  const device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo);
  setFOV(device.activeFormat.videoFieldOfView);
}
