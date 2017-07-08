Object.defineProperty(exports, "__esModule", { value: true });
var application = require("application");
var baseAcceleration = -9.81;
var sensorListener;
var sensorManager;
var accelerometerSensor;
function getNativeDelay(options) {
    if (!options || !options.sensorDelay) {
        return android.hardware.SensorManager.SENSOR_DELAY_NORMAL;
    }
    switch (options.sensorDelay) {
        case "normal":
            return android.hardware.SensorManager.SENSOR_DELAY_NORMAL;
        case "game":
            return android.hardware.SensorManager.SENSOR_DELAY_GAME;
        case "ui":
            return android.hardware.SensorManager.SENSOR_DELAY_UI;
        case "fastest":
            return android.hardware.SensorManager.SENSOR_DELAY_FASTEST;
    }
}
function startAccelerometerUpdates(callback, options) {
    if (sensorListener) {
        throw new Error("Already listening for accelerometer updates.");
    }
    var wrappedCallback = zonedCallback(callback);
    var activity = application.android.foregroundActivity;
    if (!activity) {
        throw Error("Could not get foregroundActivity.");
    }
    if (!sensorManager) {
        sensorManager = activity.getSystemService(android.content.Context.SENSOR_SERVICE);
        if (!sensorManager) {
            throw Error("Could not initialize SensorManager.");
        }
    }
    if (!accelerometerSensor) {
        accelerometerSensor = sensorManager.getDefaultSensor(android.hardware.Sensor.TYPE_ROTATION_VECTOR);
        if (!accelerometerSensor) {
            throw Error("Could get accelerometer sensor.");
        }
    }
    sensorListener = new android.hardware.SensorEventListener({
        onAccuracyChanged: function (sensor, accuracy) {
        },
        onSensorChanged: function (event) {
          console.log("first matrix: ");
          var rotationMatrix = Array.create("float", 16);
          console.log("native call from SensorManager");
          android.hardware.SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
          console.log("second matrix. This is rotationMatrix: " + rotationMatrix);
          var remappedRotationMatrix =  Array.create("float", 16);
          console.log("remapcoordinate system:");
          android.hardware.SensorManager.remapCoordinateSystem(rotationMatrix, android.hardware.SensorManager.AXIS_X, android.hardware.SensorManager.AXIS_Z, remappedRotationMatrix);
          var orientations =  Array.create("float", 3);
          console.log("get orientations");
          android.hardware.SensorManager.getOrientation(remappedRotationMatrix, orientations);
          for (let i = 0; i < 3; i++) {
            console.log("Step " + i + "in this loop");
            orientations[i] = java.lang.Math.toDegrees(orientations[i]);
          }
            console.log("weird callback");
            wrappedCallback({
                x: orientations[0] / baseAcceleration,
                y: orientations[1] / baseAcceleration,
                z: orientations[2] / baseAcceleration
            });
        }
    });
    var nativeDelay = getNativeDelay(options);
    sensorManager.registerListener(sensorListener, accelerometerSensor, nativeDelay);
}
exports.startAccelerometerUpdates = startAccelerometerUpdates;
function stopAccelerometerUpdates() {
    if (!sensorListener) {
        throw new Error("Currently not listening for acceleration events.");
    }
    sensorManager.unregisterListener(sensorListener);
    sensorListener = undefined;
}
exports.stopAccelerometerUpdates = stopAccelerometerUpdates;
