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
              // console.log("GLK matrix invert is " +GLKit);
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
              const quat = data.attitude.quaternion;
                wrappedCallback({
                    x: -180/Math.PI * Math.atan2(2*(quat.y*quat.w - quat.x*quat.z), 1- 2*quat.y*quat.y - 2*quat.z*quat.z), // TODO: Probably doesn't work
                    y: -180/Math.PI * Math.atan2(2*(quat.x*quat.w + quat.y*quat.z), 1- 2*quat.x*quat.x - 2*quat.z*quat.z),
                    z: -180/Math.PI * Math.asin(2*(quat.x*quat.z - quat.w*quat.y)) // yaw
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
