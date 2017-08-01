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
        accManager.startDeviceMotionUpdatesToQueueWithHandler(CMAttitudeReferenceFrameXMagneticNorthZVertical, queue, function (data, error) {
            dispatch_async(main_queue, function () {
              console.log(accManager.availableAttitudeReferenceFrames(CMAttitudeReferenceFrameXMagneticNorthZVertical));


              let origin = data.gravity;
              console.log(origin);
              let original_matrix = data.attitude.rotationMatrix;
              console.log(GLKit);
              let temp_matrix = app.ios.GLKMatrix3Invert(original_matrix, null);
              let inverse_matrix;
              inverse_matrix.m11 = invert.m00;
              inverse_matrix.m12 = invert.m01;
              inverse_matrix.m13 = invert.m02;
              inverse_matrix.m21 = invert.m10;
              inverse_matrix.m22 = invert.m11;
              inverse_matrix.m23 = invert.m12;
              inverse_matrix.m31 = invert.m20;
              inverse_matrix.m32 = invert.m21;
              inverse_matrix.m33 = invert.m22;
              let result;
              result.x = origin.x * inverse_matrix.m11 + origin.y * inverse_matrix.m12 + origin.z * inverse_matrix.m13;
              result.y = origin.x * inverse_matrix.m21 + origin.y * inverse_matrix.m22 + origin.z * inverse_matrix.m23;
              result.z = origin.x * inverse_matrix.m31 + origin.y * inverse_matrix.m32 + origin.z * inverse_matrix.m33;

              //let inverse_matrix = original_matrix.inverse(); // TODO: Implement

                wrappedCallback({
                    x: result.x * 180/ Math.PI, // TODO: Probably doesn't work
                    y: result.y * 180 /Math.PI,
                    z: result.z * 180/ Math.PI
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