// common function called onLoaded for the camerapreview

"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

/**
  Function: gets the current page and the Placeholder view id of the camerapreview
  @param args the argument containing the page; left for default
  @param idName the id of the camera preview placeholder
*/
function onLoaded(args, idName) {
  exports.cameraView = exports.page.getViewById(idName);
}
exports.onLoaded = onLoaded;
