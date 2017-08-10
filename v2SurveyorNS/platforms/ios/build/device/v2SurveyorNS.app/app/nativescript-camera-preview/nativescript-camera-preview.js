"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platformModule = require("tns-core-modules/platform");
const application = require("application");


let output;
let session;
let maxWidth;
let maxHeight;
const common = require('./nativescript-camera-preview-common');

exports.onLoaded = common.onLoaded;
exports.getMaxSize = function () {
  return [maxWidth, maxHeight];
}

exports.onPause = function () {
  if(session) {
      if(session.isRunning) {
        session.stopRunning();
      }
  }
}

exports.onResume = function () {
  if(session) {
    if(!session.isRunning) {
      session.startRunning();
    }
  }
}

const setMaxSize = function (width, height) {
  maxWidth = width;
  maxHeight = height;
}

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

exports.onTakeShot = function(args) {
  var videoConnection = output.connections[0];
  console.dir(output);
}

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
