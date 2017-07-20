"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

const platformModule = require("tns-core-modules/platform"); //needed for screen size
/*The export keyword is used to make the variables accessible to other files that import it*/
exports.verticalFOV; // assumes of the largest resolution w/o discrimination to ratio
exports.horizontalFOV; // assumes of the largest resolution w/o discrimination to ratio
exports.z; // constant value of the camera
exports.maxPictureWidth; // constant value of the phone
exports.maxPictureHeight; // not used

exports.degrees2Pixels= function(angle) {
  let x = 2 * z * Math.tan(angle * Math.PI / 180 / 2);
  return x * platformModule.screen.mainScreen.widthPixels/exports.maxPictureWidth;
}

exports.setVarsHelper = function (maxWidth, maxHeight) { // exports for private use, rather than public
  exports.maxPictureHeight = maxHeight;
  exports.maxPictureWidth = maxWidth;
  exports.z = maxWidth/(2*Math.tan(exports.horizontalFOV * Math.PI / 180 / 2));
}

exports.getVerticalFOV = function () {
  return exports.verticalFOV;
}

exports.getHorizontalFOV = function() {
  return exports.horizontalFOV;
}
