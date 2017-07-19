Object.defineProperty(exports, "__esModule", { value: true });
var application = require("application");
var sensorListener;
var sensorManager;
var rotSensor;
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
function startRotUpdates(callback, options) {
    if (sensorListener) {
        throw new Error("Already listening for rotational vector sensor updates.");
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
    if (!rotSensor) {
        rotSensor = sensorManager.getDefaultSensor(android.hardware.Sensor.TYPE_ROTATION_VECTOR);
        if (!rotSensor) {
            throw Error("Could get rotation vector sensor.");
        }
    }
    sensorListener = new android.hardware.SensorEventListener({
        onAccuracyChanged: function (sensor, accuracy) {
          switch(accuracy) {
            case android.hardware.SensorManager.SENSOR_STATUS_ACCURACY_LOW: {
              console.log("low accuracy");
              break;
            }
            case android.hardware.SensorManager.SENSOR_STATUS_ACCURACY_MEDIUM: {
              console.log("medium accuracy");
              break;
            }
            case android.hardware.SensorManager.SENSOR_STATUS_ACCURACY_HIGH: {
              console.log("high accuracy");
              break;
            }
            case android.hardware.SensorManager.SENSOR_STATUS_ACCURACY_UNRELIABL: {
              console.log("unreliable accuracy");
              break;
            }
            default: {
              console.log("Unrecognized accuracy");
              break;
            }
          }
        },
        onSensorChanged: function (event) {
          var rotationMatrix = Array.create("float", 16);
          android.hardware.SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
          var remappedRotationMatrix =  Array.create("float", 16);
          android.hardware.SensorManager.remapCoordinateSystem(rotationMatrix, android.hardware.SensorManager.AXIS_X, android.hardware.SensorManager.AXIS_Z, remappedRotationMatrix);
          var orientations =  Array.create("float", 3);
          android.hardware.SensorManager.getOrientation(remappedRotationMatrix, orientations);
          for (let i = 0; i < 3; i++) {
            orientations[i] = java.lang.Math.toDegrees(orientations[i]);
          }
            wrappedCallback({
                x: orientations[0],
                y: orientations[1],
                z: orientations[2],
            });
        }
    });
    var nativeDelay = getNativeDelay(options);
    sensorManager.registerListener(sensorListener, rotSensor, nativeDelay);
}
exports.startRotUpdates = startRotUpdates;
function stopRotUpdates() {
    if (!sensorListener) {
        throw new Error("Currently not listening for rotational vector events.");
    }
    sensorManager.unregisterListener(sensorListener);
    sensorListener = undefined;
}
exports.stopRotUpdates = stopRotUpdates;
