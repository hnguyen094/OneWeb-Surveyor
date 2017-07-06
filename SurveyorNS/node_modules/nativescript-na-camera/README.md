# NativeScript NA Camera plugin

<img src="/docs/images/screenshot.png" width="188" alt="Demo screenshot (iOS)" title="Demo screenshot (iOS)" />

**NOTE! Android is currently not supported.**

A NativeScript camera that utilizes *AVFoundation* for iOS.

## Installation

`$ tns plugin add nativescript-na-camera`

## Usage

**XML**

```xml
<Page navigatingTo="navigatingTo" xmlns:NACamera="nativescript-na-camera">
  <StackLayout>
    <NACamera:Camera id="cameraPreview" />
    <Button text="Capture" id="capturePhoto" tap="capturePhoto" />
    <Button text="New photo" id="newPhoto" tap="newPhoto" />
  </StackLayout>
</Page>
```

**JS**

```js
var NACamera = require("nativescript-na-camera");

var page;

exports.navigatingTo = function(args) {
  page = args.object;
  
  NACamera.start();
};

exports.capturePhoto = function(args) {
  NACamera.capturePhoto({
    saveToLibrary: true
  }).then(function(image, savedToLibrary) {
    NACamera.stop();
    if(savedToLibrary) console.log("Photo was saved to library!");
    // Do something more...
  }, function(error) {
    console.error(error);
  });
};

exports.newPhoto = function(args) {
  NACamera.start();
};
```

**Note!** `NACamera.start()` must be fired to initiate the camera preview. It is recommended to stop the camera once the preview is out of view in the UI using `NACamera.stop()`.

### Methods

#### capturePhoto()

To capture a photo.

*The resolution of captured photo is the proportion of the camera preview.*

`capturePhoto(props)`

- **props** - Set any capture properties (optional).
  - **saveToLibrary** - Saves the photo to the library upon capture (defaults to `false`).
  - **mirrorCorrection** - Correct mirroring when capturing with the front camera (defaults to `true`).
  - **playSound** - Plays a capture sound (defaults to `true`).
  - **simulatorDebug** - For testing on a simulator where a camera device is not available (defaults to `false`).
  - **simulatorImage** - The image source (defaults to empty string).
- Returns a then promise:
  - **resolve**
    - **image** - The captured photo as an image source.
    - **savedToLibrary** - Reference to `props.saveToLibrary` which is either `true` or `false`.
  - **reject**
    - **error** - The error message.

```js
NACamera.capturePhoto({
  saveToLibrary: true
}).then(function(image, savedToLibrary) {
  NACamera.stop();
  if(savedToLibrary) console.log("Photo was saved to library!");
  // Do something more...
}, function(error) {
  console.error(error);
});
```

---------

#### saveToLibrary()

Save an image to the library.

`saveToLibrary(image)`

* **image** - The image source that should be saved to the library.
* Returns `true`.

```js
NACamera.saveToLibrary(image);
```

------

#### setTorchMode()

Set the torch mode (if available).

`setTorchMode(condition)`

- **condition** - Boolean value.
- Returns `true` or `false` depending on availability.

```js
NACamera.setTorchMode(true); // Torch on
NACamera.setTorchMode(false); // Torch off
```

------

#### setFlashMode()

Set the flash mode (if available).

`setFlashMode(condition)`

- **condition** - Boolean value.
- Returns `true` or `false` depending on availability.

```js
NACamera.setFlashMode(true); // Flash on
NACamera.setFlashMode(false); // Flash off
```

------

#### setDevicePosition()

Set the camera device position (back or front camera, if available).

`setDevicePosition(position)`

- **position** - String value. Must be either `"back"` or `"front"`.
- Returns `true` or `false` depending on availability.

```js
NACamera.setDevicePosition("back"); // Back camera
NACamera.setDevicePosition("front"); // Front camera
```

------

#### hasDevicePosition()

Check if a camera device position is available.

`hasDevicePosition(position)`

- **position** - String value. Must be either `"back"` or `"front"`.
- Returns `true` or `false` depending on availability.

```js
var hasBackCamera = NACamera.hasDevicePosition("back");
var hasFrontCamera = NACamera.hasDevicePosition("front");
```

------

#### Other methods

- `start()` - Start the camera session.
  - Returns `boolean`
- `stop()` - Stop the camera session.
  - Returns `boolean`
- `devicesAvailable()` - Check if any camera is available.
  - Returns `boolean`
- `getTorchMode()` - Get the current torch mode.
  - Returns `boolean`
- `hasTorchMode()` - Check if the camera's current device position has a torch available.
  - Returns `boolean`
- `getFlashMode()` - Get the current flash mode.
  - Returns `boolean`
- `hasFlashMode()` - Check if the camera's current device position has a flash available.
  - Returns `boolean`
- `getDevicePosition()` - Check if the camera's current device position is either back or front.
  - Returns `"back"` or `"front"`

## Known issues

- No Android compatibility, yet.

## To-do list

- Video recording

Please post an issue if you have any other ideas!

## History

#### Version 1.1.0 (November 21, 2016)

- Pinch-to-zoom feature
- Tap-to-focus feature
- Added mirror correction property when capturing with the front camera (See `capturePhoto()` documentation).

#### Version 1.0.0 (November 10, 2016)

- First release!

## Credits

- [NordlingArt](https://github.com/NordlingArt)

## License

[MIT](/LICENSE) - for {N} version 2.0.0+