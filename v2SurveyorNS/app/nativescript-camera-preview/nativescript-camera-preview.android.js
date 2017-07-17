"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilsModule = require("tns-core-modules/utils/utils");
var mCameraId;
var mCaptureSession;
var mCameraDevice;
var mStateCallBack;
var mBackgroundHandler = null;
var mCameraOpenCloseLock = new java.util.concurrent.Semaphore(1);
var mTextureView;
var mSurfaceTexture;
var mPreviewRequestBuilder;
var mPreviewRequest;
var mImageReader;
var mCaptureCallback;
var mFile;
// var mPreviewSize;

const STATE_PREVIEW = 0;
const STATE_WAITING_LOCK = 1;
const STATE_WAITING_PRECAPTURE = 2;
const STATE_WAITING_NON_PRECAPTURE = 3;
const STATE_PICTURE_TAKEN = 4;
var mState = STATE_PREVIEW;
/**
 * Max preview width that is guaranteed by Camera2 API
 */
const MAX_PREVIEW_WIDTH = 1920;
/**
 * Max preview height that is guaranteed by Camera2 API
 */
const MAX_PREVIEW_HEIGHT = 1080;

var wrappedCallback;

const REQUEST_IMAGE_CAPTURE = 3453;
const REQUEST_REQUIRED_PERMISSIONS = 1234;

var app = require('application');
var common = require('./nativescript-camera-preview-common');

exports.requestPermissions = function () {
    if (android.support.v4.content.ContextCompat.checkSelfPermission(app.android.currentContext, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != android.content.pm.PackageManager.PERMISSION_GRANTED ||
        android.support.v4.content.ContextCompat.checkSelfPermission(app.android.currentContext, android.Manifest.permission.CAMERA) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
        android.support.v4.app.ActivityCompat.requestPermissions(app.android.currentContext, [android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], REQUEST_REQUIRED_PERMISSIONS);
    }
};

exports.onLoaded = common.onLoaded;
var lockFocus = function() { //TODO: could be error with private/scope
  mState = STATE_WAITING_LOCK;
  mCaptureSession.capture(mPreviewRequestBuilder.build(), mCaptureCallback, mBackgroundHandler);
}
var runPrecaptureSequence = function() {
    // This is how to tell the camera to trigger.
    mPreviewRequestBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AE_PRECAPTURE_TRIGGER, android.hardware.camera2.CaptureRequest.CONTROL_AE_PRECAPTURE_TRIGGER_START);
    // Tell #mCaptureCallback to wait for the precapture sequence to be set.
    mState = STATE_WAITING_PRECAPTURE;
    mCaptureSession.capture(mPreviewRequestBuilder.build(), mCaptureCallback, mBackgroundHandler);
}
var captureStillPicture = function() {
    // This is the CaptureRequest.Builder that we use to take a picture.
    var captureBuilder = mCameraDevice.createCaptureRequest(android.hardware.camera2.CameraDevice.TEMPLATE_STILL_CAPTURE);
    captureBuilder.addTarget(mImageReader.getSurface());

    // Use the same AE and AF modes as the preview.
    captureBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE, android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
            setAutoFlash(captureBuilder);

    var CaptureCallback = android.hardware.camera2.CameraCaptureSession.CaptureCallback.extend({
        onCaptureCompleted: function (session, request, result) {
            console.log("onCaptureCompleted");
            // console.log(mFile.toString());
        }
    });

    mCaptureSession.stopRepeating();
    mCaptureSession.capture(captureBuilder.build(), CaptureCallback, null);
}
var createCameraPreviewSession = function() {
    console.log("createCameraPreviewSession");

    if (!mSurfaceTexture || !mCameraDevice) {
        return;
    }

    var texture = mTextureView.getSurfaceTexture();
    // We configure the size of default buffer to be the size of camera preview we want.
    // texture.setDefaultSize(1920, 1440);

    // This is the output Surface we need to start preview.
    var surface = new android.view.Surface(texture);

    // // We set up a CaptureRequest.Builder with the output Surface.
    mPreviewRequestBuilder = mCameraDevice.createCaptureRequest(android.hardware.camera2.CameraDevice.TEMPLATE_PREVIEW);
    mPreviewRequestBuilder.addTarget(surface);

    var surfaceList = new java.util.ArrayList();
    surfaceList.add(surface);
    mCameraDevice.createCaptureSession(surfaceList, new MyCameraCaptureSessionStateCallback(), null);
}
exports.onTakeShot = function(args) {
  console.log("onTakeShot");
  lockFocus();
}
exports.onCreatingView = function(callback, args) {
  var appContext = app.android.context;
  var cameraManager = appContext.getSystemService(android.content.Context.CAMERA_SERVICE);
  var cameras = cameraManager.getCameraIdList();
  wrappedCallback = zonedCallback(callback);
  for (var index = 0; index < cameras.length; index++) {
      var currentCamera = cameras[index];
      var currentCameraSpecs = cameraManager.getCameraCharacteristics(currentCamera);
      // get available lenses and set the camera-type (front or back)
      var facing = currentCameraSpecs.get(android.hardware.camera2.CameraCharacteristics.LENS_FACING);

      if(facing !== null && facing == android.hardware.camera2.CameraCharacteristics.LENS_FACING_BACK) {
          console.log("BACK camera");
          mCameraId = currentCamera;
      }

      // get all available sizes ad set the format
      var map = currentCameraSpecs.get(android.hardware.camera2.CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
      var format = map.getOutputSizes(android.graphics.ImageFormat.JPEG);
      console.log("Format: " + format + " " + format.length + " " + format[0] + " " + format[1]+ " " + format[2]+ " " + format[3]+ " " + format[4]);
      // For still image captures, we use the largest available size.
      let largest = java.util.Collections.max(
        java.util.Arrays.asList(map.getOutputSizes(android.graphics.ImageFormat.JPEG)),
          new CompareSizesByArea());
      mImageReader = android.media.ImageReader.newInstance(largest.getWidth(), largest.getHeight(),
        android.graphics.ImageFormat.JPEG, /*maxImages*/2);
      // we are taking not the largest possible but some of the 5th in the list of resolutions
      if (format && format !== null) {
          var dimensions = format[0].toString().split('x');
          var largestWidth = +dimensions[0];
          var largestHeight = +dimensions[1];

          // set the output image characteristics
          mImageReader = new android.media.ImageReader.newInstance(largestWidth, largestHeight, android.graphics.ImageFormat.JPEG, /*maxImages*/2);
          mImageReader.setOnImageAvailableListener(mOnImageAvailableListener, mBackgroundHandler);
      }
      let displaySize = new android.graphics.Point();
      let maxPreviewWidth = displaySize.y;
      let maxPreviewHeight = displaySize.x;
      if(maxPreviewWidth > MAX_PREVIEW_WIDTH) {
        maxPreviewWidth = MAX_PREVIEW_WIDTH;
      }
      if (maxPreviewHeight > MAX_PREVIEW_HEIGHT) {
          maxPreviewHeight = MAX_PREVIEW_HEIGHT;
      }
      // Danger, W.R.! Attempting to use too large a preview size could  exceed the camera
      // bus' bandwidth limitation, resulting in gorgeous previews but the storage of
      // garbage capture data.
      /*mPreviewSize = chooseOptimalSize(map.getOutputSizes(android.graphics.SurfaceTexture.class),
              rotatedPreviewWidth, rotatedPreviewHeight, maxPreviewWidth,
              maxPreviewHeight, largest);
      */
  }
  mStateCallBack = new MyStateCallback();

  //API 23 runtime permission check
  if (android.os.Build.VERSION.SDK_INT > android.os.Build.VERSION_CODES.LOLLIPOP_MR1){
      console.log("checking presmisions ....");

      if(android.support.v4.content.ContextCompat.checkSelfPermission(appContext, android.Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_GRANTED){

          console.log("Permison already granted!!!!!");
          cameraManager.openCamera(mCameraId, mStateCallBack,mBackgroundHandler);

      } else if(android.support.v4.content.ContextCompat.checkSelfPermission(appContext, android.Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_DENIED) {
          console.log("NO PERMISIONS - about to try get them!!!"); // I am crashing here - wrong reference for shouldShowRequestPermissionRationale !?
      }
  } else {
      cameraManager.openCamera(mCameraId, mStateCallBack, mBackgroundHandler);
  }

  // cameraManager.openCamera(mCameraId, mStateCallBack, mBackgroundHandler);

  mTextureView = new AutoFitTextureView(app.android.context, null);
  mTextureView.setSurfaceTextureListener(mSurfaceTextureListener);
  args.view = mTextureView;
}

//TODO: Choose optimal size function : https://github.com/googlesamples/android-Camera2Basic/blob/master/Application/src/main/java/com/example/android/camera2basic/Camera2BasicFragment.java#L384
var chooseOptimalSize = function (choices, textureViewWidth,
  textureViewHeight, maxWidth, maxHeight, aspectRatio) {
    // Collect the supported resolutions that are at least as big as the preview Surface
    let bigEnough = new java.util.ArrayList();
    const x = aspectRatio.getWidth();
    const y = aspectRatio.getHeight();
    const ratio = y / x;
    for (let index = 0; index < choices.length; index++) {
      const optionRatio = choices[index].getHeight() / choices[index].getWidth();
      if (ratio == optionRatio) {
        bigEnough.add(choices[index]);
      }
    }

    // Pick the smallest of those big enough. If there is no one big enough, pick the
     // largest of those not big enough.
    if (bigEnough.size() > 0) {
      return java.util.Collections.min(bigEnough, new CompareSizesByArea());
    } else if (notBigEnough.size() > 0) {
      return java.util.Collections.max(notBigEnough, new CompareSizesByArea());
    } else {
      console.log("Couldn't find any suitable preview size");
      return choices[0];
    }
}

var CompareSizesByArea_constructorCalled = false;
var CompareSizesByArea = java.lang.Object.extend({
  interfaces: [java.util.Comparator],
  comparing: function() {},
  comparingDouble: function() {},
  comparingInt: function() {},
  comparingLong: function() {},
  equals: function() {},
  naturalOrder: function() {},
  nullsFirst: function() {},
  nullsLast: function() {},
  reversed: function() {},
  reverseOrder: function() {},
  thenComparing: function() {},
  thenComparingDouble: function() {},
  thenComparingInt: function() {},
  thenComparingLong: function() {},
  compare: function(lhs, rhs) {
    return java.lang.Long.signum(lhs.getWidth() * lhs.getHeight() -
          rhs.getWidth() * rhs.getHeight());
  },
  init: function() {
    CompareSizesByArea_constructorCalled = true;
  }
});

var AutoFitTextureView_constructorCalled = false;
let mRatioWidth = 0;
let mRatioHeight= 0;
var AutoFitTextureView = android.view.TextureView.extend({
    //constructor
    init: function(context, value) {
        AutoFitTextureView_constructorCalled = true;
        // this.super.init(context, null);
    },
    setAspectRatio: function(width, height) {
        if (width < 0 || height < 0) {
          console.log("error with aspect ratio function");
        }
        mRatioWidth = width;
        mRatioHeight= height;
        requestLayout();
    },
    onMeasure: function(widthMeasureSpec, heightMeasureSpec) {
        this.super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        let width = this.super.getMeasuredWidth();
        let height = this.super.getMeasuredHeight();
        console.log("width: " + width + " height: " + height);
        if (0 == mRatioWidth || 0 == mRatioHeight) {
          this.super.setMeasuredDimension(width, height);
        } else {
          if (width < height * mRatioWidth / mRatioHeight) {
            this.super.setMeasuredDimension(width, width * mRatioHeight / mRatioWidth);
          } else {
            this.super.setMeasuredDimension(height * mRatioWidth / mRatioHeight, height);
          }
        }
    },
    setMeasuredDimension: function(width, height) {},
    MeasureSpec: function(measurement) {}

});

// from Java ; public static abstract class
var MyCameraCaptureSessionStateCallback = android.hardware.camera2.CameraCaptureSession.StateCallback.extend({
    onConfigured: function(cameraCaptureSession) {
        console.log("onConfigured " + cameraCaptureSession);

        if (mCameraDevice === null) {
            return;
        }

        mCaptureSession = cameraCaptureSession;

        // mPreviewRequestBuilder.set(android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE, android.hardware.camera2.CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
        // // Flash is automatically enabled when necessary.
        // setAutoFlash(mPreviewRequestBuilder);

        // Finally, we start displaying the camera preview.
        mPreviewRequest = mPreviewRequestBuilder.build();
        mCaptureSession.setRepeatingRequest(mPreviewRequest, new MyCaptureSessionCaptureCallback(), null);

    },
    onConfigureFailed: function(cameraCaptureSession) {
        console.log("onConfigureFailed " + cameraCaptureSession);
    }
});

// from Java : public static abstract class
var MyCaptureSessionCaptureCallback = android.hardware.camera2.CameraCaptureSession.CaptureCallback.extend({
    process: function(result) {
        switch (mState) {
                case STATE_PREVIEW: {
                    // We have nothing to do when the camera preview is working normally.
                    break;
                }
                case STATE_WAITING_LOCK: {
                    var afState = result.get(android.hardware.camera2.CaptureResult.CONTROL_AF_STATE);
                    if (afState === null) {
                        captureStillPicture();
                    } else if (android.hardware.camera2.CaptureResult.CONTROL_AF_STATE_FOCUSED_LOCKED == afState ||
                            android.hardware.camera2.CaptureResult.CONTROL_AF_STATE_NOT_FOCUSED_LOCKED == afState) {
                        // CONTROL_AE_STATE can be null on some devices
                        var aeState = result.get(android.hardware.camera2.CaptureResult.CONTROL_AE_STATE);
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
                    var aeStatee = result.get(android.hardware.camera2.CaptureResult.CONTROL_AE_STATE);
                    if (aeStatee === null ||
                            aeStatee == android.hardware.camera2.CaptureResult.CONTROL_AE_STATE_PRECAPTURE ||
                            aeStatee == android.hardware.camera2.CaptureRequest.CONTROL_AE_STATE_FLASH_REQUIRED) {
                        mState = STATE_WAITING_NON_PRECAPTURE;
                    }
                    break;
                }
                case STATE_WAITING_NON_PRECAPTURE: {
                    // CONTROL_AE_STATE can be null on some devices
                    var aeStateee = result.get(android.hardware.camera2.CaptureResult.CONTROL_AE_STATE);
                    if (aeStateee === null || aeStateee != android.hardware.camera2.CaptureResult.CONTROL_AE_STATE_PRECAPTURE) {
                        mState = STATE_PICTURE_TAKEN;
                        captureStillPicture();
                    }
                    break;
                }
        }
    },
    onCaptureProgressed: function(session, request, partialResult) {
        // console.log("onCaptureProgressed");
        this.process(partialResult);
    },
    onCaptureCompleted: function (session, request, result) {
        // console.log("onCaptureCompleted");
        this.process(result);
    },
    onCaptureFailed: function (session, request, failure) {
        // console.log("onCaptureFailed");
        console.log(failure);
    }
});

// (example for: java static interface to javaScript )
// from Java : public static interface
var mOnImageAvailableListener = new android.media.ImageReader.OnImageAvailableListener({
    onImageAvailable: function (reader) {

        // here we should save our image to file when image is available
        console.log("onImageAvailable");
        console.log(reader);
    }
});

// from Java : public static interface
var mSurfaceTextureListener = new android.view.TextureView.SurfaceTextureListener({

    onSurfaceTextureAvailable: function(texture, width, height) {
        console.log('onSurfaceTextureAvailable');
        mSurfaceTexture = texture;
        createCameraPreviewSession();
        // openCamera(width, height);
    },

    onSurfaceTextureSizeChanged: function(texture) {
        console.log('onSurfaceTextureSizeChanged');
        // configureTransform(width, height);
    },

    onSurfaceTextureDestroyed: function(texture) {
        // console.log("onSurfaceTextureDestroyed");
        return true;
    },

    onSurfaceTextureUpdated: function(texture) {
      wrappedCallback();
        // console.log("onSurfaceTexturUpdated");
    },

});

// from Java : public static abstract class
var MyStateCallback = android.hardware.camera2.CameraDevice.StateCallback.extend({
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
