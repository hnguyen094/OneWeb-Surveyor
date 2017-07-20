"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require('./nativescript-fov-common');

exports.Degrees2Pixels = common.Degrees2Pixels;
exports.getVerticalFOV = common.getVerticalFOV;
exports.getHorizontalFOV = common.getHorizontalFOV;

exports.setVars = function (maxWidth, maxHeight) {
  setFOV();
  common.setVarsHelper(maxWidth, maxHeight);
}

exports.initialize = function () {

}
