"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

function Degrees2Pixels = function(angleDeg) {
  let x = 2*z*Math.tan(angleDeg * Math.PI / 180 / 2);
  return x * platformModule.screen.mainScreen.widthPixels/maxPictureWidth;
}

exports.Degrees2Pixels = 
