Object.defineProperty(exports, "__esModule", { value: true });
var app = require("application");
var accManager;
var isListening = false;
var main_queue = dispatch_get_current_queue();
function getNativeDelay(options) {
    if (!options || !options.sensorDelay) {
        return 0.2;
    }
    switch (options.sensorDelay) {
        case "normal":
            return 0.2;
        case "ui":
            return 0.06;
        case "game":
            return 0.02;
        case "fastest":
            return 0.001;
    }
}
// From: https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/hardware/SensorManager.java#1277
function remapRotationMatrix(rotationMatrix) {
  const r = rotationMatrix;
  const matrixArray = [-r.m11, -r.m21, -r.m31, -r.m12, -r.m22, -r.m32, -r.m13, -r.m23, -r.m33];
  let resultMatrixArray = [0,0,0,0,0,0,0,0,0];
  // defining the two axis, instead of as a param
  let X = 1;
  let Y = 3;
  // Z is "the other" axis, either +/- sign(X)*sign(Y)
  // by Exclusive Or'ing and the (+/-) is calculated below
  let Z = X ^ Y;
  //extract the axis, with offset to 0-2
  const x = (X & 0x3)-1;
  const y = (Y & 0x3)-1;
  const z = (Z & 0x3)-1;
  // sign of Z
  const axis_y = (z+1)%3;
  const axis_z = (z+2)%3;
  if(((x^axis_y)|(y^axis_z)) != 0) {
    Z ^= 0x80;
  }
  const sx = (X>=0x80);
  const sy = (Y>=0x80);
  const sz = (Z>=0x80);
  // Perform R * r, in avoiding actual muls and adds.
  for (let j = 0; j < 3; j++) {
    const offset = j * 3;
    for (let i = 0; i < 3; i++){
      if(x==i) resultMatrixArray[offset+i] = sx ? -matrixArray[offset+0] : matrixArray[offset+0];
      if(y==i) resultMatrixArray[offset+i] = sy ? -matrixArray[offset+1] : matrixArray[offset+1];
      if(z==i) resultMatrixArray[offset+i] = sz ? -matrixArray[offset+2] : matrixArray[offset+2];
    }
  }
  return resultMatrixArray;
}

function getOrientation(matrixArray) { //converted from Android's version
  const resultOrientation = [0,0,0];
  resultOrientation[0] = Math.atan2(matrixArray[1], matrixArray[4]);
  resultOrientation[1] = Math.asin(matrixArray[7]);
  resultOrientation[2] = -Math.atan2(-matrixArray[6], -matrixArray[8]);
  return resultOrientation;
}

function startRotUpdates(callback, options) {
    if (isListening) {
        console.log("Already listening for motion updates.");
        return;
    }
    var wrappedCallback = zonedCallback(callback);
    if (!accManager) {
        accManager = CMMotionManager.alloc().init();
    }
    accManager.deviceMotionUpdateInterval = getNativeDelay(options);
    if (accManager.deviceMotionAvailable) {
        var queue = NSOperationQueue.alloc().init();
        var referenceFrame = CMAttitudeReferenceFrame.CMAttitudeReferenceFrameXMagneticNorthZVertical;
        accManager.startDeviceMotionUpdatesUsingReferenceFrameToQueueWithHandler(referenceFrame, queue, function (data, error) {
            dispatch_async(main_queue, function () {
              const orientations = getOrientation(remapRotationMatrix(data.attitude.rotationMatrix));
              for(let i = 0; i < orientations.length; i++) {
                orientations[i] *= 180/Math.PI;
              }
                wrappedCallback({
                  x: orientations[0],
                  y: orientations[1],
                  z: orientations[2]
                });
            });
        });
        isListening = true;
    }
    else {
        throw new Error("Device Motion not available.");
    }
}
exports.startRotUpdates = startRotUpdates;
function stopRotUpdates() {
    if (!isListening) {
        throw new Error("Currently not listening for Device Motion events.");
    }
    accManager.stopDeviceMotionUpdates();
    isListening = false;
}
exports.stopRotUpdates = stopRotUpdates;
