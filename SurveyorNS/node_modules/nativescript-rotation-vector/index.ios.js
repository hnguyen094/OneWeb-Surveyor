Object.defineProperty(exports, "__esModule", { value: true });
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
        accManager.startDeviceMotionUpdatesToQueueWithHandler(queue, function (data, error) {
            dispatch_async(main_queue, function () {
                wrappedCallback({
                    x: data.attitude.roll, // TODO: Probably doesn't work
                    y: data.attitude.pitch,
                    z: data.attitude.yaw
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
