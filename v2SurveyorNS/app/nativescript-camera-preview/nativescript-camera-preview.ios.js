/* Function: Implements the iOS camera preview
 * Works Cited:
 * This module is based on: https://github.com/NativeScript/sample-iOS-CameraApp
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require('./nativescript-camera-preview-common');

let output;
let session;
let maxWidth;
let maxHeight;

/* Function: onLoaded from common that gets passed through
 */
exports.onLoaded = common.onLoaded;
exports.getMaxSize = function () {
  return [maxWidth, maxHeight];
}

/* Function: gets called when the app is paused to pause the session
 */
exports.onPause = function () {
  if(session) {
      if(session.isRunning) {
        session.stopRunning();
      }
  }
}

/* Function: Gets called when the app is resumed to restart the session
 */
exports.onResume = function () {
  if(session) {
    if(!session.isRunning) {
      session.startRunning();
    }
  }
}

/* Function: Sets the max size of the camera
 */
const setMaxSize = function (width, height) {
  maxWidth = width;
  maxHeight = height;
}

/* Function: Request the Photo Library permissions for iOS
 */
exports.requestPermissions = function () {
    var authStatus = PHPhotoLibrary.authorizationStatus();
    if (authStatus === 0) {
      PHPhotoLibrary.requestAuthorization(function (auth) {
        if (auth === 3) {
          if (trace.isEnabled()) {
            trace.write("Application can access photo library assets.", trace.categories.Debug);
          }
          return;
        }
      });
    }
    else if (authStatus !== 3) {
      if (trace.isEnabled()) {
        trace.write("Application can not access photo library assets.", trace.categories.Debug);
      }
    }
};

/* Function: Used when the user takes a picture
 * UNUSED
 */
exports.onTakeShot = function(args) {
  var videoConnection = output.connections[0];
  console.dir(output);
}

/** Function: creates the view for the placeholder and starts the cameraDevice
 * @param callback  the callback function when it updates. UNUSED because it is currently done in main-page
 */
exports.onCreatingView = function(callback, args) {
  session = new AVCaptureSession();
  if(session.canSetSessionPreset(AVCaptureSessionPreset1920x1080)) {
    session.sessionPreset = AVCaptureSessionPreset1920x1080;
  } else {
    session.sessionPreset = AVCaptureSessionPresetHigh;
  }
  var wrappedCallback = zonedCallback(callback);
  // Adding capture device
  var device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo);
  var input = AVCaptureDeviceInput.deviceInputWithDeviceError(device, null);
  if (!input) {
      throw new Error("Error trying to open camera.");
  }
  session.addInput(input);
  output = new AVCapturePhotoOutput();
  session.addOutput(output);
  session.startRunning();
  var videoLayer = AVCaptureVideoPreviewLayer.layerWithSession(session);
  let dimensions = CMVideoFormatDescriptionGetDimensions(device.activeFormat.formatDescription);
  setMaxSize(dimensions.width, dimensions.height);
  var view = UIView.alloc().initWithFrame({ origin: { x: 0, y: 0 }, size: { width: 300, height: 300*16/9} });
  videoLayer.frame = view.bounds;
  view.layer.addSublayer(videoLayer);
  args.view = view;
}
