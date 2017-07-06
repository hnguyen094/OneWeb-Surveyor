/* Author: Hung Nguyen
 * Function: Enables the camera
 * Code from: https://developer.android.com/guide/topics/media/camera.html
 */

package com.example.hnguyen.surveyor;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Camera;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.Uri;
import android.nfc.Tag;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import org.opencv.core.CvType;
import org.opencv.core.Mat;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static android.provider.MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE;


/**
 * Created by hnguyen on 6/26/2017.
 */ //TODO: Add comments
//TODO: Decompose
public class CameraActivity extends Activity {

    public static final int MEDIA_TYPE_IMAGE = 1; //Constants //TODO: Possibly move?
    // Objects
    private boolean isFirstPicture = false;
    private Camera mCamera;
    private CameraPreview mPreview;
    private SensorManager sensorManager;
    private Sensor rotSensor;
    private ImageView circleIcon;
    private Button captureButton;
    private Button stitchButton;
    private Mat img1, img2;
    private byte[] img1_data, img2_data;
    // Listeners
    private SensorEventListener rvListener;
    // Callbacks
    private Camera.PictureCallback mPicture;
    // Used to load the 'native-lib' library on application startup.
    static {
        System.loadLibrary("native-lib");
    }

    /**
     * Function: A safe way to get a camera instance
     * @return the camera instance
     */
    public static Camera getCameraInstance(){
        Camera c = null;
        try {
            c = Camera.open(Constants.CAMERA);
        } catch (Exception e) {
            // Camera is not available (in use or does not exist)
        }
        return c; // returns null if camera is unavailable
    }

    /**
     * Function: Initializing variables and Listeners
     * @param savedInstanceState default param for super
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        isFirstPicture = true;
        setContentView(R.layout.activity_main);
        mCamera = getCameraInstance();
        mPreview = new CameraPreview(this, mCamera);
        FrameLayout preview = (FrameLayout) findViewById(R.id.camera_preview);
        preview.addView(mPreview);
        captureButton = (Button) findViewById(R.id.button_capture);
        stitchButton = (Button) findViewById(R.id.button_stitch);
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        rotSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        img1 = null;
        img2 = null;
        img1_data = null;
        img2_data = null;
        // Listeners
        rvListener = new SensorEventListener() {
            @Override
            public void onSensorChanged(SensorEvent sensorEvent) { // TODO: SetPreviewCallback to refresh less often
                TextView tv = (TextView) findViewById(R.id.display_info);
                float[] rotationMatrix = new float[16];
                SensorManager.getRotationMatrixFromVector(
                        rotationMatrix, sensorEvent.values);
                // Remap coordinate system
                float[] remappedRotationMatrix = new float[16];
                SensorManager.remapCoordinateSystem(rotationMatrix,
                        SensorManager.AXIS_X,
                        SensorManager.AXIS_Z,
                        remappedRotationMatrix);
                // Convert to orientations
                float[] orientations = new float[3];
                SensorManager.getOrientation(remappedRotationMatrix, orientations);

                // Convert from radians to degrees
                for(int i = 0; i < 3; i++) {
                    orientations[i] = (float)(Math.toDegrees(orientations[i]));
                }
                //tv.setText(stringFromJNI()); // TODO: Delete & put back next line
                tv.setText("Tilt (<90): "+ String.format("%f", orientations[1])); // TODO: put in strings for translation purposes
                circleIcon = (ImageView) findViewById(R.id.icon);
                if(Constants.ELEVATION_ANGLE < 0 && orientations[1] < Constants.ELEVATION_ANGLE ||
                        Constants.ELEVATION_ANGLE > 0 && orientations[1] > Constants.ELEVATION_ANGLE) {
                    circleIcon.setVisibility(View.VISIBLE);
                } else
                    circleIcon.setVisibility(View.INVISIBLE);

            }
            @Override
            public void onAccuracyChanged(Sensor sensor, int i) {
            }
        };
        mPicture = new Camera.PictureCallback() {
            @Override
            public void onPictureTaken(byte[] data, Camera camera) {
                File pictureFile = getOutputMediaFile(MEDIA_TYPE_IMAGE);
                if (pictureFile == null) {
                    Log.d("activity", "Error creating media file, check storage permissions: ");
                    return;
                }
                try {
                    FileOutputStream fos = new FileOutputStream(pictureFile);
                    fos.write(data);
                    fos.close();

                    // OpenCV implementation
                    Mat mat = new Mat();
                    mat.put(0, 0, data); //TODO fix this. wat is height and width? if not u be reopening that picture from file
                    if(img1==null) {
                        img1 = mat;
                        img1_data = data;
                    } else {
                        img2 = mat;
                        img2_data = data;
                    }
                } catch (FileNotFoundException e) {
                    Log.d("onPictureTaken", "File not found: " + e.getMessage());
                } catch (IOException e) {
                    Log.d("onPictureTaken", "Error accessing file: " + e.getMessage());
                }
                FrameLayout preview = (FrameLayout) findViewById(R.id.camera_preview);
                preview.removeView(mPreview);
                preview.addView(mPreview);
            }
        };
        captureButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Log.d("captureListener","Capture activated");
                        mCamera.takePicture(null, null, mPicture);
                    }
                }
        );
        stitchButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Log.d("capture2Listener", "Capture2 activated: " + img1.getNativeObjAddr() + " and " + img2.getNativeObjAddr());
                        int errorCode = stitch(img1.getNativeObjAddr(), img2.getNativeObjAddr());
                        Log.d("capture2Listener", img1.toString());
                    }
                }
        );
    }

    /**
     * Function: Resume when switching back into the app
     * Registers the sensor listener
     */
    @Override
    protected void onResume() {
        super.onResume();
        sensorManager.registerListener(rvListener,
                rotSensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    /**
     * Function: Pauses when the app isn't in focused
     * Releases the camera and pauses the sensor
     */
    @Override
    protected void onPause() {
        super.onPause();
        releaseCamera();
        sensorManager.unregisterListener(rvListener);
    }

    /**
     * Function: safely releases the camera if null
     */
    private void releaseCamera(){
        if (mCamera != null) {
            mCamera.release();
            mCamera = null;
        }
    }
    /** Create a file Uri for saving an image or video */
    private Uri getOutputMediaFileUri(int type){
        return Uri.fromFile(getOutputMediaFile(type));
    }

    /**
     * Create a file Uri for saving an image or video
     * @param type is an integer for image or video (MEDIA_TYPE_IMAGE or MEDIA_TYPE_VIDEO)
     * @return
     */
    private File getOutputMediaFile(int type) {
        Log.d("getOutputMediaFile", "in getoutputmediafile");
        //TODO: make this less public Using Context.getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        File mediaStorageDir = Environment.getExternalStorageState()==Environment.MEDIA_MOUNTED? // Choose SD card if it exists
                new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "MyCameraApp") :
                new File("/storage/emulated/0/" + Environment.DIRECTORY_PICTURES + "/" + "MyCameraApp"); //TODO: fix hardcoded location
        if (!mediaStorageDir.exists()){
            if (! mediaStorageDir.mkdirs()){
                Log.d("MyCameraApp", "failed to create directory");
                return null;
            }
        }
        File mediaFile;
        if (type == MEDIA_TYPE_IMAGE){
            if (isFirstPicture) {
                mediaFile = new File(mediaStorageDir.getPath() + File.separator +
                        "IMG_first" + ".jpg"); // modified from the original IMG_timestamp.jpg format
                isFirstPicture = false;
                Log.d("Image Type", "IMG_first");
            } else {
                mediaFile = new File(mediaStorageDir.getPath() + File.separator +
                        "IMG_second" + ".jpg"); // modified from the original IMG_timestamp.jpg format
                Log.d("Image Type", "IMG_second");
            }
        } else {
            return null;
        }
        return mediaFile;
    }
    // TODO Add this in the use:
    private boolean checkCameraHardware(Context context) {
        if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)){
            return true; // this device has a camera
        } else {
            return false; // no camera on this device
        }
    }

    /**
     * Native methods that is implemented by the 'native-lib' native library,
     * which is packaged with this application. Example
     */
    public native String stringFromJNI();
    public native int stitch(long img1Addr, long img2Addr);
}