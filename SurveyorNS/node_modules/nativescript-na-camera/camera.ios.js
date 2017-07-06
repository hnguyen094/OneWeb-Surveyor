var frameModule = require("ui/frame");
var builder = require("ui/builder");
var gestures = require("ui/gestures");
var imageSource = require("image-source");
var View = require("ui/core/view").View;
var StackLayout = require("ui/layouts/stack-layout").StackLayout;
var AbsoluteLayout = require("ui/layouts/absolute-layout").AbsoluteLayout;
var colorModule = require("color");

var NACamera = {};
var _bounds, _session, _device, _input, _output, _previewLayer;
var _torchMode = false, _flashMode = false;
var _onFocusDelay;
var errorCameraDeviceUnavailable = "Error: Camera device unavailable.";
var errorCameraTorchUnavailable = "Error: Camera torch unavailable.";
var errorCameraFlashUnavailable = "Error: Camera flash unavailable.";

NACamera.Camera = (function(_super) {
  __extends(Camera, _super);
  function Camera() {
    _super.call(this);
    
    this.constructView();
    enablePinchToZoom(this);
    enableTapToFocus(this);
  }
  
  Camera.prototype.constructView = function() {
    _this = this;
    _nativeView = this.ios;
    
    _session = new AVCaptureSession();
    
    _device = deviceWithPosition(AVCaptureDevicePositionBack);
    _input = AVCaptureDeviceInput.deviceInputWithDeviceError(_device, null);
    
    if(_input) {
      _session.addInput(_input);
      
      _output = new AVCaptureStillImageOutput();
      _session.addOutput(_output);
      
      _previewLayer = AVCaptureVideoPreviewLayer.layerWithSession(_session);
      _previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
      _nativeView.layer.addSublayer(_previewLayer);
    }
  };
  
  Camera.prototype.onUnloaded = function() {
    if(_device) _session.stopRunning();
  };
  
  Camera.prototype.onLayout = function(left, top, right, bottom) {
    _super.prototype.onLayout.call(this, left, top, right, bottom);
    _this = this;
    _nativeView = this.ios;
    
    if(_input) {
      _bounds = _nativeView.bounds;
      _previewLayer.frame = _bounds;
      _previewLayer.position = CGPointMake(CGRectGetMidX(_bounds), CGRectGetMidY(_bounds));
    }
  };
  
  return Camera;
})(StackLayout);

// Start/stop camera
NACamera.start = function() {
  if(_device) _session.startRunning();
    else console.error("[NACamera.start] " + errorCameraDeviceUnavailable);
};

NACamera.stop = function() {
  if(_device) _session.stopRunning();
    else console.error("[NACamera.stop] " + errorCameraDeviceUnavailable);
};

// Capture photo
NACamera.capturePhoto = function(props = {}) {
  var defaults = {
    saveToLibrary: false,
    mirrorCorrection: true,
    playSound: true,
    simulatorDebug: false,
    simulatorImage: ""
  };
  for(var key in defaults) if(!props.hasOwnProperty(key)) props[key] = defaults[key];
  
  return new Promise(function(resolve, reject) {
    if(_output) {
      var videoConnection = _output.connections[0];

      _output.captureStillImageAsynchronouslyFromConnectionCompletionHandler(videoConnection, function(buffer, error) {
        if(NACamera.getDevicePosition() === "back") props.mirrorCorrection = false;
        
        var imageData = AVCaptureStillImageOutput.jpegStillImageNSDataRepresentation(buffer);
        var image = applyAspectFillImageInRect(UIImage.imageWithData(imageData), _bounds, props.mirrorCorrection);
        
        if(props.saveToLibrary) UIImageWriteToSavedPhotosAlbum(image, null, null, null);
        if(props.playSound) AudioServicesPlaySystemSound(144);
        
        resolve(imageSource.fromNativeSource(image), props.saveToLibrary);
      });
    } else if(props.simulatorDebug) {
      var image = applyAspectFillImageInRect(props.simulatorImage.ios.image, props.simulatorImage.ios.bounds);
      
      if(props.saveToLibrary) UIImageWriteToSavedPhotosAlbum(image, null, null, null);
      if(props.playSound) AudioServicesPlaySystemSound(144);
      resolve(imageSource.fromNativeSource(image), props.saveToLibrary);
    } else {
      console.error("[NACamera.capturePhoto]" + errorCameraDeviceUnavailable);
      reject(errorCameraDeviceUnavailable);
    }
  });
};

// Save to library
NACamera.saveToLibrary = function(image) {
  UIImageWriteToSavedPhotosAlbum(image.ios, null, null, null);
  return true;
};

// Get device state
NACamera.devicesAvailable = function() {
  var devices = AVCaptureDevice.devicesWithMediaType(AVMediaTypeVideo);
  return (devices.count > 0 ? true : false);
};

// Torch mode
NACamera.setTorchMode = function(condition) {
  if(typeof condition !== "undefined" && _device && _device.hasTorch) {
    _device.lockForConfiguration(null);
//    _session.beginConfiguration();
    
    if(condition === true) {
      _device.torchMode = AVCaptureTorchModeOn;
      _torchMode = true;
      return true;
    } else if(condition === false) {
      _device.torchMode = AVCaptureTorchModeOff;
      _torchMode = false;
      return false;
    }
    
    _device.unlockForConfiguration();
//    _session.commitConfiguration();
  } else {
    console.error("[NACamera.setTorchMode] " + errorCameraTorchUnavailable);
    _torchMode = false;
    return false;
  }
};

NACamera.getTorchMode = function() {
  return _torchMode;
};

NACamera.hasTorchMode = function() {
  return (_device && _device.hasTorch ? true : false);
};

// Flash mode
NACamera.setFlashMode = function(condition) {
  if(typeof condition !== "undefined" && _device && _device.hasFlash) {
    _device.lockForConfiguration(null);
    
    if(condition === true) {
      _device.flashMode = AVCaptureFlashModeOn;
      _flashMode = true;
      return true;
    } else if(condition === false) {
      _device.flashMode = AVCaptureFlashModeOff;
      _flashMode = false;
      return false;
    }
    
    _device.unlockForConfiguration();
  } else {
    console.error("[NACamera.setFlashMode] " + errorCameraFlashUnavailable);
    _flashMode = false;
    return false;
  }
};

NACamera.getFlashMode = function() {
  return _flashMode;
};

NACamera.hasFlashMode = function() {
  return (_device && _device.hasFlash ? true : false);
};

// Camera position
NACamera.setDevicePosition = function(position) {
  if(typeof position !== "undefined" && _device) {
    _session.removeInput(_input);
    
    if(_device.position == AVCaptureDevicePositionBack) {
      _device = deviceWithPosition(AVCaptureDevicePositionFront);
    } else {
      _device = deviceWithPosition(AVCaptureDevicePositionBack);
    }
    
    _input = AVCaptureDeviceInput.alloc().initWithDeviceError(_device, null);
    
    if(_input) {
      _session.addInput(_input);
      return true;
    } else {
      console.error("[NACamera.setCameraPosition] " + errorCameraDeviceUnavailable);
      return false;
    }
  } else {
    console.error("[NACamera.setCameraPosition] " + errorCameraDeviceUnavailable);
    return false;
  }
};

NACamera.getDevicePosition = function() {
  if(_device) {
    if(_device.position == AVCaptureDevicePositionBack) return "back";
      else if(_device.position == AVCaptureDevicePositionFront) return "front";
  }
  return null;
};

NACamera.hasDevicePosition = function(position) {
  if(position === "back") position = AVCaptureDevicePositionBack;
    else if(position === "front") position = AVCaptureDevicePositionFront;
    else position = null;
  
  return (position && deviceWithPosition(position) ? true : false);
};

module.exports = NACamera;


/* INTERNAL METHODS
==================================== */
// Camera with position
var deviceWithPosition = function(position) {
  var devices = AVCaptureDevice.devicesWithMediaType(AVMediaTypeVideo);
  
  for(var i = 0; i < devices.count; i++) if(devices[i].position == position) return devices[i];
  return null;
};

// Apply AspectFill ratio on captured photo
var applyAspectFillImageInRect = function(image, bounds, mirror = false) {
  var minSize = Math.min(image.size.width, image.size.height);
  var aspectRatio = Math.min(minSize / bounds.size.width, minSize / bounds.size.height);
  var width = Math.round(bounds.size.width * aspectRatio);
  var height = Math.round(bounds.size.height * aspectRatio);
  var rect = { origin: { x: 0, y: 0 }, size: { width: width, height: height } };
  
  var renderView = UIView.alloc().initWithFrame(rect);
  var imageView = UIImageView.alloc().initWithFrame(renderView.bounds);
  
  imageView.image = image;
  imageView.contentMode = UIViewContentModeScaleAspectFill;
  renderView.addSubview(imageView);
  
  if(mirror) imageView.transform = CGAffineTransformMakeScale(-1, 1);
  
  UIGraphicsBeginImageContext(rect.size);
  var context = UIGraphicsGetCurrentContext();
  renderView.layer.renderInContext(context);
  var newImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
//  var imageData = UIImageJPEGRepresentation(newImage, 1);
  
  return newImage;
//  return UIImage.imageWithData(imageData);
};

// Pinch to zoom
var enablePinchToZoom = function(view) {
  var lastZoomFactor = 1;
  
  view.on("pinch", function(e) {
    if(_device) {
      if(e.state === 1) {
        clearTimeout(_onFocusDelay);
        lastZoomFactor = _device.videoZoomFactor;
      } else if(e.state === 2) {
        var zoomFactor = lastZoomFactor * e.scale;
        zoomFactor = Math.min(_device.activeFormat.videoMaxZoomFactor, zoomFactor);
        zoomFactor = Math.max(1, zoomFactor);

        _device.lockForConfiguration(null);
        _device.videoZoomFactor = zoomFactor;
        _device.unlockForConfiguration();
      } else if(e.state === 3) {
        lastZoomFactor = zoomFactor;
      }
    } else {
      if(e.state === 1) {
        clearTimeout(_onFocusDelay);
        console.error(errorCameraDeviceUnavailable);
      }
    }
  });
};

// Tap to focus
var enableTapToFocus = function(view) {
  var focusPoint = {};
  
  var focusCircle = new AbsoluteLayout();
  var focusCircleSize = 48;
  focusCircle.width = focusCircle.height = focusCircleSize + 8;
  focusCircle.horizontalAlignment = "left";
  focusCircle.opacity = 0;
  focusCircle.clipToBounds = false;
  focusCircle.ios.layer.shadowColor = new colorModule.Color("#000000").ios.CGColor;
  focusCircle.ios.layer.shadowOffset = CGSizeZero;
  focusCircle.ios.layer.shadowOpacity = 0.25;
  focusCircle.ios.layer.shadowRadius = 2;
  
  var focusCircleOuter = new StackLayout();
  focusCircleOuter.width = focusCircleOuter.height = focusCircleSize;
  focusCircleOuter.marginTop = focusCircleOuter.marginLeft = 4;
  focusCircleOuter.borderWidth = 1;
  focusCircleOuter.borderColor = "#ffffff";
  focusCircleOuter.borderRadius = focusCircleSize / 2;
  
  var focusCircleInner = new StackLayout();
  focusCircleInner.width = focusCircleInner.height = focusCircleSize - 6;
  focusCircleInner.marginTop = focusCircleInner.marginLeft = 7;
  focusCircleInner.backgroundColor = new colorModule.Color(128, 255, 255, 255);
  focusCircleInner.borderRadius = focusCircleInner.width / 2;
  focusCircleInner.scaleX = focusCircleInner.scaleY = 0.01;
  
  focusCircle.addChild(focusCircleOuter);
  focusCircle.addChild(focusCircleInner);
  view.addChild(focusCircle);
  
  var animateFocusTimeout;
  var animateFocusCircle = function() {
    if(animateFocusTimeout) clearTimeout(animateFocusTimeout);
    
    focusCircle.translateX = focusPoint.x - (focusCircle.width / 2);
    focusCircle.translateY = focusPoint.y - (focusCircle.width / 2);
    focusCircle.scaleX = focusCircle.scaleY = 0.01;
    focusCircleInner.scaleX = focusCircleInner.scaleY = 0.01;
    focusCircleInner.opacity = 1;
    
    var duration = 250;
    var props = { opacity: 1, scale: { x: 1.2, y: 1.2 }, translate: { x: focusCircle.translateX, y: focusCircle.translateY }, duration: duration };
    
    focusCircle.animate(props).then(function() {
      props.scale = { x: 1, y: 1 };
      focusCircle.animate(props).then(function() {
        animateFocusTimeout = setTimeout(function() { focusCircle.opacity = 0; }, duration);
      });
    });
    
    focusCircleInner.animate({ scale: { x: 1, y: 1 }, duration: duration }).then(function() {
      focusCircleInner.animate({ opacity: 0, duration: duration });
    });
  };
  
  view.on("touch", function(e) {
    if(e.action === "down" && e.getPointerCount() === 1) {
      focusPoint.x = e.getX();
      focusPoint.y = e.getY();
      
      _onFocusDelay = setTimeout(function() {
        animateFocusCircle();
        
        if(_device) {
          if(_device.focusPointOfInterest && _device.isFocusModeSupported(AVCaptureFocusModeAutoFocus)) {
            _device.lockForConfiguration(null);
            
            _device.focusPointOfInterest = CGPointMake(focusPoint.x, focusPoint.y);
            _device.focusMode = AVCaptureFocusModeAutoFocus;
            
            if(_device.isExposureModeSupported(AVCaptureExposureModeAutoExpose))
              _device.exposureMode = AVCaptureExposureModeAutoExpose;
            
            _device.unlockForConfiguration();
          }
        } else {
          console.error(errorCameraDeviceUnavailable);
        }
      }, 200);
    }
    
    if(e.action === "move" && _onFocusDelay) clearTimeout(_onFocusDelay);
  });
};