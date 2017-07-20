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

const STATE_PREVIEW                 = 0; // UNSURE
const STATE_WAITING_LOCK            = 1; // UNSURE
const STATE_WAITING_PRECAPTURE      = 2; // UNSURE
const STATE_WAITING_NON_PRECAPTURE  = 3; // UNSURE
const STATE_PICTURE_TAKEN           = 4; // UNSURE
const MAX_PREVIEW_WIDTH             = 1080; // max preview width guaranteed by Camera2 API
const MAX_PREVIEW_HEIGHT            = 1920; // max preview height guaranteed by Camera2 API
const REQUEST_IMAGE_CAPTURE         = 3453;
const REQUEST_REQUIRED_PERMISSIONS  = 1234;

let maxHeight;
let maxWidth;
let mCameraId;
let mCaptureSession;
let mCameraDevice;
let mStateCallBack;
let mBackgroundHandler      = null;
let mCameraOpenCloseLock    = new java.util.concurrent.Semaphore(1); // UNSURE
let mTextureView;
let mSurfaceTexture;
let mPreviewRequestBuilder;
let mPreviewRequest;
let mImageReader;
let mCaptureCallback; // UNSURE
let mFile; // UNSURE
let mPreviewSize; // UNSURE
let mState                  = STATE_PREVIEW;
let wrappedCallback;

/**
Note: onLoaded is a function that works on both iOS and Android from the common files.
exports allows it to be exposed for outside use
*/
exports.onLoaded = common.onLoaded;

exports.getMaxSize = function () {
  return [maxWidth, maxHeight];
}

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
        android.support.v4.app.ActivityCompat.requestPermissions(app.android.currentContext, [android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], REQUEST_REQUIRED_PERMISSIONS);
    }
};

/**
Function: Takes a picture.
*/
const lockFocus = function() { //TODO: could be error with private/scope
  mState = STATE_WAITING_LOCK;
  mCaptureSession.capture(mPreviewRequestBuilder.build(), mCaptureCallback, mBackgroundHandler);
}

/**
Function: prepares the camera while waiting for capture. // UNSURE
*/
const runPrecaptureSequence = function() {
    // This is how to tell the camera to trigger.
    mPreviewRequestBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AE_PRECAPTURE_TRIGGER, android.hardware.camera2.CaptureRequest.CONTROL_AE_PRECAPTURE_TRIGGER_START);
    // Tell #mCaptureCallback to wait for the precapture sequence to be set.
    mState = STATE_WAITING_PRECAPTURE;
    mCaptureSession.capture(mPreviewRequestBuilder.build(), mCaptureCallback, mBackgroundHandler);
}

/**
Function: captures a still picture. // UNSURE
*/
const captureStillPicture = function() {
    // This is the CaptureRequest.Builder that we use to take a picture.
    const captureBuilder = mCameraDevice.createCaptureRequest(android.hardware.camera2.CameraDevice.TEMPLATE_STILL_CAPTURE);
    captureBuilder.addTarget(mImageReader.getSurface());
    // Use the same AE and AF modes as the preview.
    captureBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE, android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
            setAutoFlash(captureBuilder);
    // java class: extends the CaptureCallback class
    const CaptureCallback = android.hardware.camera2.CameraCaptureSession.CaptureCallback.extend({
        onCaptureCompleted: function (session, request, result) {
            console.log("onCaptureCompleted");
        }
    });
    mCaptureSession.stopRepeating();
    mCaptureSession.capture(captureBuilder.build(), CaptureCallback, null);
}

/**
Function: creates the surface to draw the camera preview.
*/
const createCameraPreviewSession = function() {
    console.log("createCameraPreviewSession");
    if (!mSurfaceTexture || !mCameraDevice) {
        return;
    }
    let texture = mTextureView.getSurfaceTexture();
    texture.setDefaultBufferSize(mPreviewSize.getWidth(), mPreviewSize.getHeight()); // sets the default buffer to the preview we want
    let surface = new android.view.Surface(texture); // the surface that will hold the preview
    mPreviewRequestBuilder = mCameraDevice.createCaptureRequest(android.hardware.camera2.CameraDevice.TEMPLATE_PREVIEW);
    mPreviewRequestBuilder.addTarget(surface);
    let surfaceList = new java.util.ArrayList();
    surfaceList.add(surface);
    mCameraDevice.createCaptureSession(surfaceList, new MyCameraCaptureSessionStateCallback(), null);
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
exports.onCreatingView = function(callback, args) {
  const appContext = app.android.context;
  const cameraManager = appContext.getSystemService(android.content.Context.CAMERA_SERVICE);
  const cameras = cameraManager.getCameraIdList();
  mTextureView = new AutoFitTextureView(appContext, null);
  wrappedCallback = zonedCallback(callback);
  for (let index = cameras.length-1; index >= 0; index--) { //TODO: break these into small functions
      let currentCameraSpecs = cameraManager.getCameraCharacteristics(cameras[index]);
      //console.log(currentCameraSpecs);
      //console.dir(currentCameraSpecs);
      // get available lenses and set the camera-type (front or back)
      let facing = currentCameraSpecs.get(android.hardware.camera2.CameraCharacteristics.LENS_FACING);
      if (facing !== null && facing == android.hardware.camera2.CameraCharacteristics.LENS_FACING_BACK) {
        console.log("BACK camera");
        mCameraId = cameras[index];
      } else {
        console.log("FRONT camera");
      }
      // get all available sizes and set the format
      const map = currentCameraSpecs.get(android.hardware.camera2.CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
      const format = map.getOutputSizes(android.graphics.ImageFormat.JPEG);
      // for(let i= 0; i < format.length;i++) {
      //   console.log(format[i]);
      // }
      //TODO: Remove debugging console.logs()
      // For still image captures, we use the largest available size.
      const largest = java.util.Collections.max(java.util.Arrays.asList(format), new CompareSizesByArea());
      setMaxSize(largest.getWidth(), largest.getHeight());
      mImageReader = android.media.ImageReader.newInstance(largest.getWidth(), largest.getHeight(),
        android.graphics.ImageFormat.JPEG, /*maxImages*/2);
      mImageReader.setOnImageAvailableListener(mOnImageAvailableListener, mBackgroundHandler);

      let maxPreviewWidth = platformModule.screen.mainScreen.widthPixels;
      let maxPreviewHeight = platformModule.screen.mainScreen.heightPixels;
      if(maxPreviewWidth > MAX_PREVIEW_WIDTH) {
        maxPreviewWidth = MAX_PREVIEW_WIDTH;
      }
      if (maxPreviewHeight > MAX_PREVIEW_HEIGHT) {
        maxPreviewHeight = MAX_PREVIEW_HEIGHT;
      }
      mPreviewSize = chooseOptimalSize(map.getOutputSizes(android.graphics.SurfaceTexture.class),
              null, null, maxPreviewWidth, maxPreviewHeight);
      mTextureView.setAspectRatio(mPreviewSize.getHeight(), mPreviewSize.getWidth());
  }
  mStateCallBack = new MyStateCallback();
  //API 23 runtime permission check
  if (android.os.Build.VERSION.SDK_INT > android.os.Build.VERSION_CODES.LOLLIPOP_MR1){
      console.log("checking presmisions ....");
      if(android.support.v4.content.ContextCompat.checkSelfPermission(appContext, android.Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_GRANTED) {
          console.log("Permission already granted.");
      } else if(android.support.v4.content.ContextCompat.checkSelfPermission(appContext, android.Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_DENIED) {
          console.log("Permission not granted.");
      }
  }
  cameraManager.openCamera(mCameraId, mStateCallBack, mBackgroundHandler);
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
    //console.log("Optimal size");
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


let CompareSizesByArea_constructorCalled = false; // UNSURE
/**
Class: a comparator class for two sizes. Extends the java comparator class.
Used in sorting functions.
*/
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
        AutoFitTextureView_constructorCalled = true;
    },
    /**
    Function: sets the aspect ratio of the textureview.
    @param  width   the width for the ratio.
    @param  height  the height for the ratio.
    */
    setAspectRatio: function(width, height) {
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
        mPreviewRequest = mPreviewRequestBuilder.build(); // displaying the camera preview
        mCaptureSession.setRepeatingRequest(mPreviewRequest, new MyCaptureSessionCaptureCallback(), null);
    },

    onConfigureFailed: function(cameraCaptureSession) {
        console.log("onConfigureFailed " + cameraCaptureSession);
    }
});

/**
Class: from Java ; public static abstract class.
See github repo at the link on the top of this page to better understand
*/
const MyCaptureSessionCaptureCallback = android.hardware.camera2.CameraCaptureSession.CaptureCallback.extend({
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

    onCaptureProgressed: function(session, request, partialResult) {
        this.process(partialResult);
    },

    onCaptureCompleted: function (session, request, result) {
        this.process(result);
    },

    onCaptureFailed: function (session, request, failure) {
        console.log(failure);
    }
});

/**
(example for: java static interface to javaScript )
from Java : public static interface
See github repo at the link on the top of this page to better understand
*/
const mOnImageAvailableListener = new android.media.ImageReader.OnImageAvailableListener({
    onImageAvailable: function (reader) {
        // here we should save our image to file when image is available
        console.log("onImageAvailable");
        console.log(reader);
    }
});

/**
from Java : public static interface
See github repo at the link on the top of this page to better understand
*/
const mSurfaceTextureListener = new android.view.TextureView.SurfaceTextureListener({
    onSurfaceTextureAvailable: function(texture, width, height) {
        console.log('onSurfaceTextureAvailable');
        mSurfaceTexture = texture;
        createCameraPreviewSession();
    },

    onSurfaceTextureSizeChanged: function(texture) {
        console.log('onSurfaceTextureSizeChanged');
        // configureTransform(width, height);
    },

    onSurfaceTextureDestroyed: function(texture) {
        return true;
    },

    onSurfaceTextureUpdated: function(texture) {
      wrappedCallback();
    },
});

/**
Class: from Java : public static abstract class
See github repo at the link on the top of this page to better understand
*/
const MyStateCallback = android.hardware.camera2.CameraDevice.StateCallback.extend({
    onOpened: function(cameraDevice) {
        console.log("onOpened " + cameraDevice);

        mCameraOpenCloseLock.release();
        mCameraDevice = cameraDevice;
        createCameraPreviewSession();
    },

    onDisconnected: function(cameraDevice) {
        console.log("onDisconnected");

        mCameraOpenCloseLock.release();
        cameraDevice.close();
        mCameraDevice = null;
    },

    onError: function(cameraDevice, error) {
        console.log("onError");
        console.log("onError: device = " + cameraDevice);
        console.log("onError: error =  " + error);

        mCameraOpenCloseLock.release();
        cameraDevice.close();
        mCameraDevice = null;
    },

    onClosed: function(cameraDevice) {
        console.log("onClosed");
    }
});
