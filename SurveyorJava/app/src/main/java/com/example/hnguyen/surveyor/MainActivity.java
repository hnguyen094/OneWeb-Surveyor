package com.example.hnguyen.surveyor;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {


    SensorManager sensorManager;
    Sensor rotSensor;
    // Create a listener
    SensorEventListener rvListener;

    // Used to load the 'native-lib' library on application startup.
    static {
        System.loadLibrary("native-lib");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) { // TODO: decompose
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        sensorManager =
                (SensorManager) getSystemService(SENSOR_SERVICE);
        rotSensor =
                sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        // Create a listener
        rvListener = new SensorEventListener() {
            @Override
            public void onSensorChanged(SensorEvent sensorEvent) {
                TextView tv = (TextView) findViewById(R.id.display_info); // TODO: Delete
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
                tv.setText(stringFromJNI()); // TODO: Delete
                // tv.setText(""+ orientations[1]); // TODO: Delete
                if(orientations[1]< -45) {
                    getWindow().getDecorView().setBackgroundColor(Color.YELLOW);
                } else
                    getWindow().getDecorView().setBackgroundColor(Color.WHITE);

            }

            @Override
            public void onAccuracyChanged(Sensor sensor, int i) {
            }
        };

    }

    @Override
    protected void onResume() {
        super.onResume();
        sensorManager.registerListener(rvListener,
                rotSensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @Override
    protected void onPause() {
        super.onPause();
        sensorManager.unregisterListener(rvListener);
    }

    private boolean checkCameraHardware(Context context) {
        if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)){
            // this device has a camera
            return true;
        } else {
            // no camera on this device
            return false;
        }
    }

    /**
     * A native method that is implemented by the 'native-lib' native library,
     * which is packaged with this application.
     */
    public native String stringFromJNI();
}
