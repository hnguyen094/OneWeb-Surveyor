package com.tns.gen.android.hardware;

public class SensorEventListener implements android.hardware.SensorEventListener {
	public SensorEventListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onSensorChanged(android.hardware.SensorEvent param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onSensorChanged", void.class, args);
	}

	public void onAccuracyChanged(android.hardware.Sensor param_0, int param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onAccuracyChanged", void.class, args);
	}

}
