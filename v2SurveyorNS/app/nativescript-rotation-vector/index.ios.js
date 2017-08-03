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

function remapRotationMatrix(rotationMatrix) { // convrted from Android's version
  const r = rotationMatrix;
  const matrixArray = [r.m11, r.m12, r.m13, r.m21, r.m22, r.m23, r.m31, r.m32, r.m33];
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
  resultOrientation[1] = Math.asin(-matrixArray[7]);
  resultOrientation[2] = Math.atan2(-matrixArray[8], matrixArray[10]);
}

function startRotUpdates(callback, options) {
    if (isListening) {
        throw new Error("Already listening for motion updates.");
    }
    var wrappedCallback = zonedCallback(callback);
    if (!accManager) {
        accManager = CMMotionManager.alloc().init();
    }
    accManager.deviceMotionUpdateInterval = getNativeDelay(options);
    if (accManager.deviceMotionAvailable) {
        var queue = NSOperationQueue.alloc().init();
        console.log("motionamanger "+ CMMotionManager);
        console.dir(accManager);
        var referenceFrame = CMAttitudeReferenceFrame.CMAttitudeReferenceFrameXArbitraryCorrectedZVertical;
        console.log("Ref frame " + referenceFrame);
        accManager.startDeviceMotionUpdatesUsingReferenceFrameToQueueWithHandler(referenceFrame, queue, function (data, error) {
            dispatch_async(main_queue, function () {
              // console.dir(accManager);
              // let origin = data.gravity;
              // console.log(origin);
              // let original_matrix = data.attitude.rotationMatrix;

              // let temp_matrix = GLKMatrix3Invert(original_matrix, null);
              // let inverse_matrix;
              // inverse_matrix.m11 = invert.m00;
              // inverse_matrix.m12 = invert.m01;
              // inverse_matrix.m13 = invert.m02;
              // inverse_matrix.m21 = invert.m10;
              // inverse_matrix.m22 = invert.m11;
              // inverse_matrix.m23 = invert.m12;
              // inverse_matrix.m31 = invert.m20;
              // inverse_matrix.m32 = invert.m21;
              // inverse_matrix.m33 = invert.m22;
              // let result;
              // result.x = origin.x * inverse_matrix.m11 + origin.y * inverse_matrix.m12 + origin.z * inverse_matrix.m13;
              // result.y = origin.x * inverse_matrix.m21 + origin.y * inverse_matrix.m22 + origin.z * inverse_matrix.m23;
              // result.z = origin.x * inverse_matrix.m31 + origin.y * inverse_matrix.m32 + origin.z * inverse_matrix.m33;

              //let inverse_matrix = original_matrix.inverse(); // TODO: Implement

              const orientations = getOrientation(remapRotationMatrix(data.attitude.rotationMatrix));

                wrappedCallback({
                //     x: -180/Math.PI * Math.atan2(2*(quat.y*quat.w - quat.x*quat.z), 1- 2*quat.y*quat.y - 2*quat.z*quat.z), // TODO: Probably doesn't work
                //     y: -Math.atan2(2 * (quat.x * quat.w + quat.y * quat.z), 1 - 2 * quat.x * quat.x - 2 * quat.z * quat.z) * 180 / Math.PI,
                //     z: Math.atan2(2 * (quat.y * quat.w - quat.x * quat.z), 1 - 2 * quat.y * quat.y - 2 * quat.z * quat.z) * 180/ Math.PI
                       x: 180/Math.PI * orientations[0],
                       y: 180/Math.PI * orientations[1],
                       z: 180/Math.PI * orientations[2]
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
    accManager.stopRotUpdates();
    isListening = false;
}
exports.stopRotUpdates = stopRotUpdates;
