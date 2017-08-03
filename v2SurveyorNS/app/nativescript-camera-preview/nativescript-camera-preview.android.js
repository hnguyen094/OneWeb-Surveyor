// TODO: Figure out if things commented with UNSURE are necessary
 /*
  * Function: implements the android version of the camera2 API for Android.
  * Author: Hung Nguyen
  * Many/all of the code comes from the two linked github repositories, with added features for Nativescript
  * Works Cited:
  * Android implementation: https://github.com/googlesamples/android-Camera2Basic/blob/master/Application/src/main/java/com/example/android/camera2basic/Camera2BasicFragment.java
  * Nativescript {N} implementation: https://github.com/NickIliev/NativeScript-cameraApp-poc
  *
  * Note: 'var' has been replaced with either 'let' or 'const' for the sake of scope. There shouldn't be any 'var's left.
  * See here for more general info: https://www.typescriptlang.org/docs/handbook/variable-declarations.html
  */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilsModule = require("tns-core-modules/utils/utils");
const platformModule = require("tns-core-modules/platform");
const app = require('application');
const common = require('./nativescript-camera-preview-common');

const REQUEST_CAMERA_PERMISSION     = 1;
const STATE_PREVIEW                 = 0;
const STATE_WAITING_LOCK            = 1;
const STATE_WAITING_PRECAPTURE      = 2;
const STATE_WAITING_NON_PRECAPTURE  = 3;
const STATE_PICTURE_TAKEN           = 4;
const MAX_PREVIEW_WIDTH             = 1080; // max preview width guaranteed by Camera2 API
const MAX_PREVIEW_HEIGHT            = 1920; // max preview height guaranteed by Camera2 API

/**
from Java : public static interface
See github repo at the link on the top of this page to better understand
*/
const mSurfaceTextureListener = new android.view.TextureView.SurfaceTextureListener({
    onSurfaceTextureAvailable: function(texture, width, height) {
        console.log('onSurfaceTextureAvailable');
        createCameraPreviewSession();
        // openCamera()

        // common.cameraView.animate({
        //   scale: {
        //     x: platformModule.screen.mainScreen.heightPixels/common.cameraView.getMeasuredHeight(),
        //     y: platformModule.screen.mainScreen.heightPixels/common.cameraView.getMeasuredHeight()},
        //   duration: 2000
        // });
    },

    onSurfaceTextureSizeChanged: function(texture) {
        console.log('onSurfaceTextureSizeChanged');
        // configureTransform(width, height);
    },

    onSurfaceTextureDestroyed: function(texture) {
        console.log('Entering onSurfaceTextureDestroyed');
        return true;
    },

    onSurfaceTextureUpdated: function(texture) {
      surfaceUpdateCallback();
    },
});

let mCameraId; // Type: String
let mTextureView; // Type: AutoFitTextureView (extends TextureView)
let mCaptureSession; // Type: CameraCaptureSession
let mCameraDevice; // Type: CameraDevice // Reference to the opened CameraDevice
let mPreviewSize; // Type: Size // preview size of the camera preview

/**
Class: from Java : public static abstract class
See github repo at the link on the top of this page to better understand
*/
const MyStateCallback = android.hardware.camera2.CameraDevice.StateCallback.extend({
    onOpened: function(cameraDevice) {
      /*
      mCameraOpenCloseLock.release();
      mCameraDevice = cameraDevice;
      createCameraPreviewSession();
      */
        console.log("Entering onOpened " + cameraDevice);
        mCameraOpenCloseLock.release();
        mCameraDevice = cameraDevice;
        createCameraPreviewSession();
    },

    onDisconnected: function(cameraDevice) {
      /*
      mCameraOpenCloseLock.release();
      cameraDevice.close();
      mCameraDevice = null;
      */
        console.log("onDisconnected");
        mCameraOpenCloseLock.release();
        cameraDevice.close();
        mCameraDevice = null;
    },

    onError: function(cameraDevice, error) {
      /*
      mCameraOpenCloseLock.release();
      cameraDevice.close();
      mCameraDevice = null;
      Activity activity = getActivity();
      if (null != activity) {
          activity.finish();
      }
      */
        console.log("Entering onError");
        console.log("onError: device = " + cameraDevice);
        console.log("onError: error =  " + error);
        mCameraOpenCloseLock.release();
        cameraDevice.close();
        mCameraDevice = null;
        const activity = app.android.context;
        if (activity != null) {
          activity.finish();
        }
    },

    onClosed: function(cameraDevice) {
        console.log("onClosed");
    }
  });

let mBackgroundThread; // NEW: // Type: HandlerThread // An additional thread for running tasks that shouldn't block the UI
let mBackgroundHandler; // Type: Handler // Handler to run things in the background
let mImageReader; // Type: ImageReader // handles still image capture

/**
(example for: java static interface to javaScript )
from Java : public static interface
See github repo at the link on the top of this page to better understand
*/
const mOnImageAvailableListener = new android.media.ImageReader.OnImageAvailableListener({
    onImageAvailable: function (reader) {
      // mBackgroundHandler.post(new ImageSaver(reader.acquireNextImage(), mFile));
        // here we should save our image to file when image is available
        console.log("onImageAvailable");
        console.log(reader);
    }
});

let mPreviewRequestBuilder; // Type: CaptureRequest.Builder
let mPreviewRequest; // Type CaptureRequest // Generated by mPreviewRequestBuilder
let mState                  = STATE_PREVIEW; // Type: int // current state of camera as defined by constants above
let mCameraOpenCloseLock    = new java.util.concurrent.Semaphore(1); // Type: Semaphore // Prevent the app from exiting before closing the camera
let mFlashSupported; // Unused // Type: boolean
let mSensorOrientation; // Unused // Type: int

/**
Class: from Java ; public static abstract class.
See github repo at the link on the top of this page to better understand
*/
const MyCaptureSessionCaptureCallback =  android.hardware.camera2.CameraCaptureSession.CaptureCallback.extend({
  process: function(result) {
    switch (mState) {
      case STATE_PREVIEW: {// We have nothing to do when the camera preview is working normally.
        break;
      }
      case STATE_WAITING_LOCK: {
        const afState = result.get(android.hardware.camera2.CaptureResult.CONTROL_AF_STATE);
        if (afState === null) {
          captureStillPicture();
        } else if (android.hardware.camera2.CaptureResult.CONTROL_AF_STATE_FOCUSED_LOCKED == afState ||
                android.hardware.camera2.CaptureResult.CONTROL_AF_STATE_NOT_FOCUSED_LOCKED == afState) {
          // CONTROL_AE_STATE can be null on some devices
          const aeState = result.get(android.hardware.camera2.CaptureResult.CONTROL_AE_STATE);
          if (aeState === null ||
                  aeState == android.hardware.camera2.CaptureResult.CONTROL_AE_STATE_CONVERGED) {
              mState = STATE_PICTURE_TAKEN;
              captureStillPicture();
          } else {
              runPrecaptureSequence();
          }
        }
        break;
      }
      case STATE_WAITING_PRECAPTURE: {
        // CONTROL_AE_STATE can be null on some devices
        const aeState = result.get(android.hardware.camera2.CaptureResult.CONTROL_AE_STATE);
        if (aeState === null ||
              aeState == android.hardware.camera2.CaptureResult.CONTROL_AE_STATE_PRECAPTURE ||
              aeState == android.hardware.camera2.CaptureRequest.CONTROL_AE_STATE_FLASH_REQUIRED) {
          mState = STATE_WAITING_NON_PRECAPTURE;
        }
        break;
      }
      case STATE_WAITING_NON_PRECAPTURE: {
        // CONTROL_AE_STATE can be null on some devices
        const aeState = result.get(android.hardware.camera2.CaptureResult.CONTROL_AE_STATE);
        if (aeState === null || aeState != android.hardware.camera2.CaptureResult.CONTROL_AE_STATE_PRECAPTURE) {
          mState = STATE_PICTURE_TAKEN;
          captureStillPicture();
        }
        break;
      }
    }
  },

  onCaptureProgressed: function(/*CameraCaptureSession*/session, /*CaptureRequest*/request, /*CaptureResult*/partialResult) {
      this.process(partialResult);
  },

  onCaptureCompleted: function (session, request, result) {
      this.process(result);
  }
});

const mCaptureCallback = new MyCaptureSessionCaptureCallback(); // An instance of the above
let maxHeight; // the height that is needed to be queried by getMaxSize
let maxWidth; // the height that is needed to be queried by getMaxSize
let surfaceUpdateCallback; // function to be ran at every surface update from outside the module

/**
Class: a comparator class for two sizes. Extends the java comparator class.
Used in sorting functions.
*/
let CompareSizesByArea_constructorCalled = false;
const CompareSizesByArea = java.lang.Object.extend({
  interfaces: [java.util.Comparator],
  /**
  Function: constructor
  */
  init: function() {
    CompareSizesByArea_constructorCalled = true;
  },
  /**
  Function: Overwrite the default compare function for sizes
  Returns: +1 if the first is larger, -1 if the second is larger, 0, if equal.
  */
  compare: function(lhs, rhs) {
    return java.lang.Long.signum(lhs.getWidth() * lhs.getHeight() -
          rhs.getWidth() * rhs.getHeight());
  }
});

/**
Class: a TextureView class. Extends the TextureView class.
Used for autoresizing a TextureView by aspectRatio.
Note: variables below are part of the class, but I am unsure if they could go inside the extend function
*/
let AutoFitTextureView_constructorCalled = false; //TODO: See if I can add this inside?
let mRatioWidth = 0;
let mRatioHeight= 0;
const AutoFitTextureView = android.view.TextureView.extend({
    /**
    Function: constructor
    @param  context see TextureView's constructor
    @param  value see TextureView's constructor. Should be null.
    */
    init: function(context, value) {
        console.log("Entering AutoFitTextureView");
        AutoFitTextureView_constructorCalled = true;
    },
    /**
    Function: sets the aspect ratio of the textureview.
    @param  width   the width for the ratio.
    @param  height  the height for the ratio.
    */
    setAspectRatio: function(width, height) {
      console.log("Entering setAspectRatio");
        if (width < 0 || height < 0) {
          console.log("error with aspect ratio function");
        }
        mRatioWidth = width;
        mRatioHeight= height;
        this.super.requestLayout();
    },
    /**
    Function: extends the default onMeasure function. Sets the dimension with the ratio dimensions
    @param  widthMeasureSpec  used for TextureView's onMeasure function
    @param  heightMeasureSpec   used for TextureView's onMeasure function
    */
    onMeasure: function(widthMeasureSpec, heightMeasureSpec) {
      console.log("Entering onMeasure");
        this.super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        const width = this.super.getMeasuredWidth();
        const height = this.super.getMeasuredHeight();
        if (0 == mRatioWidth || 0 == mRatioHeight) {
          this.super.setMeasuredDimension(width, height);
        } else {
          if (width < height * mRatioWidth / mRatioHeight) {
            this.super.setMeasuredDimension(width, width * mRatioHeight / mRatioWidth);
          } else {
            this.super.setMeasuredDimension(height * mRatioWidth / mRatioHeight, height);
          }
        }
    }
});

/**
Class: from Java ; public static abstract class.
See github repo at the link on the top of this page to better understand
*/
const MyCameraCaptureSessionStateCallback = android.hardware.camera2.CameraCaptureSession.StateCallback.extend({
    onConfigured: function(cameraCaptureSession) {
        console.log("onConfigured " + cameraCaptureSession);
        if (mCameraDevice === null) {
            return;
        }
        mCaptureSession = cameraCaptureSession;
        try {
          // mPreviewRequestBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE,
          //     android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
          mPreviewRequest = mPreviewRequestBuilder.build();
          mCaptureSession.setRepeatingRequest(mPreviewRequest,
              mCaptureCallback, mBackgroundHandler);
        } catch(e) {
          console.log("Error: Can't configure mCaptureSession.");
        }
    },

    onConfigureFailed: function(cameraCaptureSession) {
        console.log("onConfigureFailed " + cameraCaptureSession);
    }
});

/**
Note: onLoaded is a function that works on both iOS and Android from the common files.
exports allows it to be exposed for outside use
*/
exports.onLoaded = common.onLoaded;

/**
@return   the max size that the JPEG image can be. This should be the same as the
maximum sensor size (which is what is actually needed) to calculate the FOV
*/
exports.getMaxSize = function () {
  return [maxWidth, maxHeight];
}

/**
Function: Function that handles what happens when the app pauses
Note: Empty for now //TODO
*/
exports.onPause = function() {
  console.log('Entering onPause');
  closeCamera();
  stopBackgroundThread();
};

/**
Function: function that handles what happens when the app resumes
Note: Empty for now //TODO
*/
exports.onResume = function() {
  console.log("entering onResume");
  //startBackgroundThread(); //TODO: When starting another thread, typescript couldn't find this module anymore. Need to fix
  if (!mTextureView) {
    return;
  }
  if (mTextureView.isAvailable()) {
    console.log("mTextureView is available!");
    // When the screen is turned off and turned back on, the SurfaceTexture is already
    // available, and "onSurfaceTextureAvailable" will not be called. In that case, we can open
    // a camera and start preview from here (otherwise, we wait until the surface is ready in
    // the SurfaceTextureListener).
    openCamera(mTextureView.getWidth(), mTextureView.getHeight());
  } else {
    mTextureView.setSurfaceTextureListener(mSurfaceTextureListener);
  }
}

const closeCamera = function() {
  try {
    mCameraOpenCloseLock.acquire();
    if (mCaptureSession != null) {
      mCaptureSession.close();
      mCaptureSession = null;
    }
    if (mCameraDevice != null) {
      mCameraDevice.close();
      mCameraDevice = null;
    }
    if (mImageReader != null) {
      mImageReader.close();
      mImageReader = null;
    }
  } catch(e) {
    throw Error("Interrupted while trying to lock camera closing.");
  } finally {
    mCameraOpenCloseLock.release();
  }
}
const startBackgroundThread= function () {
  console.log("Entering startBackgroundThread");
  mBackgroundThread = new android.os.HandlerThread("CameraBackground");
  mBackgroundThread.start();
  mBackgroundHandler  = new android.os.Handler(mBackgroundThread.getLooper());
}
const stopBackgroundThread = function () {
  console.log("Entering stopBackgroundThread");
  mBackgroundThread.quitSafely();
  console.log("Quitted safely");
  mBackgroundThread = null;
  mBackgroundHandler = null;
  // try {
  //   mBackgroundThread.join();
  //   console.log("Joined!");
  //
  // } catch(e) {
  //   throw Error("Error: BackgroundThread isn't stopping.");
  // }
}
const setUpCameraOutputs = function() {
  console.log("Entering setUpCameraOutputs");
  const activity = app.android.context;
  const cameraManager = activity.getSystemService(android.content.Context.CAMERA_SERVICE);
  const cameras = cameraManager.getCameraIdList();
  mTextureView = new AutoFitTextureView(activity, null);
  for (let i = 0; i < cameras.length; i++) { //TODO: break these into small functions
      let characteristics = cameraManager.getCameraCharacteristics(cameras[i]);
      // get available lenses and set the camera-type (front or back)
      let facing = characteristics.get(android.hardware.camera2.CameraCharacteristics.LENS_FACING);
      if (facing !== null && facing == android.hardware.camera2.CameraCharacteristics.LENS_FACING_FRONT) {
        continue;
      }
      console.log("Back camera");

      // get all available sizes and set the format
      const map = characteristics.get(android.hardware.camera2.CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
      if (map == null) {
        continue;
      }
      const format = map.getOutputSizes(android.graphics.ImageFormat.JPEG);
      // For still image captures, we use the largest available size.
      const largest = java.util.Collections.max(java.util.Arrays.asList(format), new CompareSizesByArea());
      setMaxSize(largest.getWidth(), largest.getHeight());
      mImageReader = android.media.ImageReader.newInstance(largest.getWidth(), largest.getHeight(),
        android.graphics.ImageFormat.JPEG, /*maxImages*/2);
      mImageReader.setOnImageAvailableListener(mOnImageAvailableListener, mBackgroundHandler);
      //ignore rotation logic here
      /*
      // Find out if we need to swap dimension to get the preview size relative to sensor
      // coordinate.
      int displayRotation = activity.getWindowManager().getDefaultDisplay().getRotation();
      //noinspection ConstantConditions
      mSensorOrientation = characteristics.get(CameraCharacteristics.SENSOR_ORIENTATION);
      boolean swappedDimensions = false;
      switch (displayRotation) {
          case Surface.ROTATION_0:
          case Surface.ROTATION_180:
              if (mSensorOrientation == 90 || mSensorOrientation == 270) {
                  swappedDimensions = true;
              }
              break;
          case Surface.ROTATION_90:
          case Surface.ROTATION_270:
              if (mSensorOrientation == 0 || mSensorOrientation == 180) {
                  swappedDimensions = true;
              }
              break;
          default:
              Log.e(TAG, "Display rotation is invalid: " + displayRotation);
      }
  */
      let maxPreviewWidth = platformModule.screen.mainScreen.widthPixels;
      let maxPreviewHeight = platformModule.screen.mainScreen.heightPixels;
      /*
      Point displaySize = new Point();
      activity.getWindowManager().getDefaultDisplay().getSize(displaySize);
      int rotatedPreviewWidth = width;
      int rotatedPreviewHeight = height;
      int maxPreviewWidth = displaySize.x;
      int maxPreviewHeight = displaySize.y;
      if (swappedDimensions) {
          rotatedPreviewWidth = height;
          rotatedPreviewHeight = width;
          maxPreviewWidth = displaySize.y;
          maxPreviewHeight = displaySize.x;
      }
      */
      if(maxPreviewWidth > MAX_PREVIEW_WIDTH) {
        maxPreviewWidth = MAX_PREVIEW_WIDTH;
      }
      if (maxPreviewHeight > MAX_PREVIEW_HEIGHT) {
        maxPreviewHeight = MAX_PREVIEW_HEIGHT;
      }
      mPreviewSize = chooseOptimalSize(map.getOutputSizes(android.graphics.SurfaceTexture.class),
              null, null, maxPreviewWidth, maxPreviewHeight);
      mTextureView.setAspectRatio(mPreviewSize.getHeight(), mPreviewSize.getWidth());
      // Check for flash here
      mCameraId = cameras[i];
      return;
  }
  try {

  } catch(e) {
    console.log("Error: Camera cannot be opened. Do you have the correct API?");
  }
}
const unlockFocus = function () {
  try {
    mPreviewRequestBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AF_TRIGGER,
      android.hardware.camera2.CameraMetadata.CONTROL_AF_TRIGGER_CANCEL);
    mCaptureSession.capture(mPreviewRequestBuilder.build(), mCaptureCallback,
      mBackgroundHandler);
    mState = STATE_PREVIEW;
    mCaptureSession.setRepeatingRequest(mPreviewRequest, mCaptureCallback,
      mBackgroundHandler);
  } catch(e) {
    throw Error("Error: Can't access camera.[unlockFocus]")
  }
}

/**
Function: internally sets maxWidth and maxHeight when they are found
*/
const setMaxSize = function (width, height) {
  maxWidth = width;
  maxHeight = height;
}

/**
Function: requests the necessary permissions if they're not already granted for the camera
Requests for WRITE_EXTERNAL_STORAGE and CAMERA.
Note: exports allows it to be exposed for outside use
*/
exports.requestPermissions = function () {
    if (android.support.v4.content.ContextCompat.checkSelfPermission(app.android.currentContext, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != android.content.pm.PackageManager.PERMISSION_GRANTED ||
        android.support.v4.content.ContextCompat.checkSelfPermission(app.android.currentContext, android.Manifest.permission.CAMERA) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
        android.support.v4.app.ActivityCompat.requestPermissions(app.android.currentContext, [android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], REQUEST_CAMERA_PERMISSION);
    }
};

/**
Function: Takes a picture.
*/
const lockFocus = function() { //TODO: could be error with private/scope
  try {
    // Doesn't work, but won't complain unless I catch the error:
    // mPreviewRequestBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AF_TRIGGER,
    //      android.hardware.camera2.CameraMetadata.CONTROL_AF_TRIGGER_START);
    mState = STATE_WAITING_LOCK;
    mCaptureSession.capture(mPreviewRequestBuilder.build(), mCaptureCallback, mBackgroundHandler);
  } catch(e) {
    console.log("Error: Can't access camera.[lockFocus]");
  }
}

/**
Function: prepares the camera while waiting for capture. // UNSURE
*/
const runPrecaptureSequence = function() {
  try {
    mPreviewRequestBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AE_PRECAPTURE_TRIGGER,
        android.hardware.camera2.CaptureRequest.CONTROL_AE_PRECAPTURE_TRIGGER_START);
    mState = STATE_WAITING_PRECAPTURE;
    mCaptureSession.capture(mPreviewRequestBuilder.build(), mCaptureCallback, mBackgroundHandler);
  } catch(e) {
    throw Error("Error: Can't access camera.[runPrecaptureSequence]");
  }
}

/**
Function: captures a still picture. // UNSURE
*/
const captureStillPicture = function() {
  console.log("Entering captureStillPicture");
  try {
    const activity = app.android.currentContext;
    if (activity == null || mCameraDevice == null) {
      return;
    }
    const captureBuilder = mCameraDevice.createCaptureRequest(android.hardware.camera2.CameraDevice.TEMPLATE_PREVIEW);
    captureBuilder.addTarget(mImageReader.getSurface());
    captureBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE,
        android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
    const CaptureCallback = CameraCaptureSession.CaptureCallback().extend({
      onCaptureCompleted: function (session, request, result) {
        unlockFocus();
      }
    });
    mCaptureSession.stopRepeating();
    mCaptureSession.capture(captureBuilder.build(), CaptureCallback, null);
  } catch(e) {
    throw Error("Error: Can't access camera.[captureStillPicture]");
  }
}

/**
Function: creates the surface to draw the camera preview.
*/
const createCameraPreviewSession = function() {
    console.log("Entering createCameraPreviewSession");
    try {
      let texture = mTextureView.getSurfaceTexture();
      if (!mCameraDevice || !texture) {
          return;
      }
      texture.setDefaultBufferSize(mPreviewSize.getWidth(), mPreviewSize.getHeight()); // sets the default buffer to the preview we want
      let surface = new android.view.Surface(texture); // the surface that will hold the preview
      mPreviewRequestBuilder = mCameraDevice.createCaptureRequest(android.hardware.camera2.CameraDevice.TEMPLATE_PREVIEW);
      mPreviewRequestBuilder.addTarget(surface);
      let surfaceList = new java.util.ArrayList();
      surfaceList.add(surface);
      mCameraDevice.createCaptureSession(surfaceList, new MyCameraCaptureSessionStateCallback(), null);
    } catch(e) {
      throw Error("Error: can't access camera.[createCameraPreviewSession]");
    }
}

/**
Function: called when the capture button is clicked.
@param  args  not used for Android, but kept for iOS.
Note: exports allows it to be exposed for outside use
*/
exports.onTakeShot = function(args) {
  console.log("onTakeShot");
  lockFocus();
}

/**
Function: sets up the camera to create the view
@param  callback  a callback function that is called every live camera image update
@param  args  the argument is used to set the view (converts AutoFitTextureView (extends TextureView) to NS View)
Note: exports allows it to be exposed for outside use
*/
//TODO TODO TODO TODO Fix Fix Fix Fix
exports.onCreatingView = function(callback, args) {
  console.log("Entering onCreatingView");
  setUpCameraOutputs();
  surfaceUpdateCallback = zonedCallback(callback);
  const activity = app.android.context;
  const cameraManager = activity.getSystemService(android.content.Context.CAMERA_SERVICE);
  let mStateCallBack = new MyStateCallback();
  try {
    if(!mCameraOpenCloseLock.tryAcquire(2500, java.util.concurrent.TimeUnit.MILLISECONDS)) {
      throw Error("Error: Timeout waiting to lock camera opening.")
    }
    cameraManager.openCamera(mCameraId, mStateCallBack, mBackgroundHandler);
  } catch(e) {
    throw Error("Error: camera opening can't be locked.");
  }
  mTextureView.setSurfaceTextureListener(mSurfaceTextureListener);
  args.view = mTextureView;
}

/**
Function: finds the optimal size to display fullscreen. It searches through the list of available preview sizes
          (choices) and collects the correct aspect ratio relative to textureViewWidth and textureViewHeight.
          Then, it picks the smallest of those bigEnough, or then the largest of those notBigEnough.
@param  choices   the different preview resolutions that the camera supports by default
@param textureViewWidth   the width of the texture. Fullscreen by default from where it's called
@param textureViewHeight  the height of the texture. Fullscreen by default from where it's called
@param maxWidth   The fullscreen width
@param maxHeight  The fullscreen height
Note: All the choices[i].getWidth/getHeight functions are measuring in landscape; therefore everything is switched
      backwards
*/
const chooseOptimalSize = function (choices, textureViewWidth, textureViewHeight, maxWidth, maxHeight) {
    console.log("Entering: chooseOptimalSize");
    if (textureViewWidth == null) textureViewWidth = maxWidth;
    if (textureViewHeight == null) textureViewHeight = maxHeight;
    const ratio = textureViewHeight / textureViewWidth;
    let bigEnough = new java.util.ArrayList();
    let notBigEnough = new java.util.ArrayList();
    //console.log("Ratio is " + ratio + " and texture sizes are: " + textureViewWidth + " " + textureViewHeight);
    for(let i = 0; i < choices.length; i++) {
      //console.log(choices[i]);
      if(choices[i].getHeight() <= maxWidth && choices[i].getWidth() <=maxHeight && choices[i].getWidth() == choices[i].getHeight() * ratio) {
        if (choices[i].getHeight() >= textureViewWidth && choices[i].getWidth() >= textureViewHeight) {
          bigEnough.add(choices[i]);
        } else {
          notBigEnough.add(choices[i]);
        }
      }
    }
    if (bigEnough.size() > 0) {
      //console.log("Big " + java.util.Collections.min(bigEnough, new CompareSizesByArea()));
      return java.util.Collections.max(bigEnough, new CompareSizesByArea());
    } else if (notBigEnough.size() > 0) {
      //console.log("Small " + java.util.Collections.max(notBigEnough, new CompareSizesByArea()));
      return java.util.Collections.max(notBigEnough, new CompareSizesByArea());
    } else {
      console.log("Couldn't find any suitable preview size. Picking the first choice.");
      return choices[0];
    }
}
