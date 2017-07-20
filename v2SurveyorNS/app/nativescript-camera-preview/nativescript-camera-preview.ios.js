"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var output;
var common = require('./nativescript-camera-preview-common');

exports.getMaxSize = function () {

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
  output.captureStillImageAsynchronouslyFromConnectionCompletionHandler(videoConnection, function (buffer, error) {
      var imageData = AVCaptureStillImageOutput.jpegStillImageNSDataRepresentation(buffer);
      var image = UIImage.imageWithData(imageData);
      UIImageWriteToSavedPhotosAlbum(image, null, null, null);
      AudioServicesPlaySystemSound(144);
  });
}

exports.onCreatingView = function(callback, args) {
  var session = new AVCaptureSession();
  session.sessionPreset = AVCaptureSessionPreset1280x720;
  var wrappedCallback = zonedCallback(callback);
  // Adding capture device
  var device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo);
  var input = AVCaptureDeviceInput.deviceInputWithDeviceError(device, null);
  if (!input) {
      throw new Error("Error trying to open camera.");
  }
  session.addInput(input);

  output = new AVCaptureStillImageOutput();
  session.addOutput(output);

  session.startRunning();

  var videoLayer = AVCaptureVideoPreviewLayer.layerWithSession(session);

  var view = UIView.alloc().initWithFrame({ origin: { x: 0, y: 0 }, size: { width: 400, height: 600 } });
  videoLayer.frame = view.bounds;
  view.layer.addSublayer(videoLayer);
  args.view = view;
}
