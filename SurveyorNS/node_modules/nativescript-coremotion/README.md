# NativeScript Core Motion Plugin
Core Motion plugin for NativeScript

## Installation
```
tns plugin add nativescript-coremotion
```

## Usage
```
var Coremotion = require('nativescript-coremotion');
```
### Accelerometer
#### isAccelerometerAvailable()
Will return a boolean indicating of the current device supports the accelerometer.

```
Coremotion.isAccelerometerAvailable()
```
#### isAccelerometerActive()
Will return a boolean indicating if Core Motion is currently returning accelerometer data.

```
Coremotion.isAccelerometerActive()
```
#### setAccelerometerUpdateInterval()
Accepts a number, allows changes to the update interval in seconds.

```
Coremotion.setAccelerometerUpdateInterval(.2);
```
#### startAccelerometerUpdates()
Accepts a callback that returns acceleration as the following:
> {x, y, z}

```
Coremotion.startAccelerometerUpdates(callback);
```
#### stopAccelerometerUpdates()
Stops Core Motion from sending accelerometer updates.

```
Coremotion.stopAccelerometerUpdates()
```
### Gyroscope
#### isGyroscopeAvailable()
Will return a boolean indicating of the current device supports the gyroscope.

```
Coremotion.isGyroscopeAvailable()
```
#### isGyroscopeActive()
Will return a boolean indicating if Core Motion is currently returning gyroscope data.

```
Coremotion.isGyroscopeActive()
```
#### setGyroscopeUpdateInterval()
Accepts a number, allows changes to the update interval in seconds.

```
Coremotion.setGyroscopeUpdateInterval(.2);
```
#### startGyroscopeUpdates()
Accepts a callback that returns rotationRate as the following:
> {x, y, z}


```
Coremotion.startGyroscopeUpdates(callback);
```
#### stopGyroscopeUpdates()
Stops Core Motion from sending gyroscope updates.

```
Coremotion.stopGyroscopeUpdates()
```
### Magnetrometer
#### isMagnetometerAvailable()
Will return a boolean indicating of the current device supports the magnetometer.

```
Coremotion.isMagnetometerAvailable()
```
#### isMagnetometerActive()
Will return a boolean indicating if Core Motion is currently returning magnetometer data.

```
Coremotion.isMagnetometerActive()
```
#### setMagnetometerUpdateInterval()
Accepts a number, allows changes to the update interval in seconds.

```
Coremotion.setMagnetometerUpdateInterval(.2);
```
#### startMagnetometerUpdates()
Accepts a callback that returns magneticField as the following:
> {x, y, z}


```
Coremotion.startMagnetometerUpdates(callback);
```
#### stopMagnetometerUpdates()
Stops Core Motion from sending magnetometer updates.

```
Coremotion.stopMagnetometerUpdates()
```
### DeviceMotion
#### isDeviceMotionAvailable()
Will return a boolean indicating of the current device supports deviceMotion.

```
Coremotion.isDeviceMotionAvailable()
```
#### isDeviceMotionActive()
Will return a boolean indicating if Core Motion is currently returning deviceMotion data.

```
Coremotion.isDeviceMotionActive()
```
#### setDeviceMotionUpdateInterval()
Accepts a number, allows changes to the update interval in seconds.

```
Coremotion.setDeviceMotionUpdateInterval(.2);
```
#### startDeviceMotionUpdates()
Accepts a callback that returns the following:
> attitude: {pitch, roll, yaw},
> 
> gravity: {x, y, z},
> 
> userAcceleration: {x, y, z},
> 
> magneticField: {
  accuracy,
  field: {x, y, z}
},

>rotationRate: {x, y, z}

```
Coremotion.startDeviceMotionUpdates(callback);
```
#### stopDeviceMotionUpdates()
Stops Core Motion from sending deviceMotion updates.

```
Coremotion.stopDeviceMotionUpdates()
```

### Altimeter
#### isRelativeAltitudeAvailable()
Will return a boolean indicating of the current device supports Relative Altitude.

```
Coremotion.isRelativeAltitudeAvailable()
```
#### isRelativeAltitudeActive()
Will return a boolean indicating if Core Motion is currently returning Relative Altitude data.

```
Coremotion.isRelativeAltitudeActive()
```

#### startRelativeAltitudeUpdates()
Accepts a callback that returns the following:
> {pressure, relativeAltitude}

```
Coremotion.startRelativeAltitudeUpdates(callback);
```
#### stopDeviceMotionUpdates()
Stops Core Motion from sending Relative Altitude updates.

```
Coremotion.stopRelativeAltitudeUpdates()
```


## Notes
Plugin is iOS only as Core Motion does not exist on Android.

Plugin requires NativeScript 2.3.0 or higher, well, because it works on that.

Plugin was tested against iOS 10 using Xcode 8.

There was an existing nativescript-accelerometer that only exposed a small subset of Core Motion, would have made PRs against it if the namespace would have permitted.

The ```isXYZActive()``` does not re-query Core Motion at this time, but simply returns a boolean set in the plugin.

## Warranty

There is none. You accept any and all responsiblity and liability that comes with putting this into your app. Additionally, you agree to pay my legal bills if you use this and someone sues me because it was in your app.