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
  let x = 2 * exports.z * Math.tan(angle * Math.PI / 180 / 2);
  return x * platformModule.screen.mainScreen.heightPixels/exports.maxPictureWidth; // height pixels because screen is vertical (I think)
}

exports.degrees2Scale= function(angle, length) {
  return exports.degrees2Pixels(angle) / length;
}

exports.setVarsHelper = function (maxWidth, maxHeight) { // exports for private use, rather than public
  exports.maxPictureHeight = maxHeight;
  exports.maxPictureWidth = maxWidth;
  exports.z = maxWidth/2/Math.tan(exports.horizontalFOV * Math.PI / 180 / 2);
  // tan(fov/2) = (l/2)/d
  // d = (l/2)/tan(fov/2)
  // l = tan(fov/2)*d*2 // x = tan(angle/2) * z * 2
  // angle = 2*Math.atan(z/2/d)
}

exports.getVerticalFOV = function () {
  return exports.verticalFOV;
}

exports.getHorizontalFOV = function() {
  return exports.horizontalFOV;
}
