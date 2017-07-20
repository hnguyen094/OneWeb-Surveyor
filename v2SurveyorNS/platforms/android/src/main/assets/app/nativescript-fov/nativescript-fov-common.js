"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

const platformModule = require("tns-core-modules/platform");

let verticalFOV; // assumes of the largest resolution w/o discrimination to ratio
let horizontalFOV; // assumes of the largest resolution w/o discrimination to ratio
let z; // constant value of the camera
let maxPictureWidth; // constant value of the phone
let maxPictureHeight; // not used

exports.degrees2Pixels= function(angle) {
  let x = 2 * z * Math.tan(angle * Math.PI / 180 / 2);
  return x * platformModule.screen.mainScreen.widthPixels/maxPictureWidth;
}

exports.setVarsHelper = function (maxWidth, maxHeight) { // exports for private use, rather than public
  maxPictureHeight = maxHeight;
  maxPictureWidth = maxWidth;
  z = maxWidth/(2*Math.tan(horizontalFOV * Math.PI / 180 / 2));
}

exports.getVerticalFOV = function () {
  return verticalFOV;
}

exports.getHorizontalFOV = function() {
  return horizontalFOV;
}
