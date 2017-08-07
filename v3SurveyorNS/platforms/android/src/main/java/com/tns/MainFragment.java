package com.tns;

@com.tns.JavaScriptImplementation(javaScriptFile = "./fragment.js")
public class MainFragment extends android.app.Fragment implements com.tns.NativeScriptHashCodeProvider {
	public MainFragment(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public android.view.View onCreateView(android.view.LayoutInflater param_0, android.view.ViewGroup param_1, android.os.Bundle param_2)  {
		java.lang.Object[] args = new java.lang.Object[3];
		args[0] = param_0;
		args[1] = param_1;
		args[2] = param_2;
		return (android.view.View)com.tns.Runtime.callJSMethod(this, "onCreateView", android.view.View.class, args);
	}

	public void onResume()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onResume", void.class, args);
	}

	public void onPause()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onPause", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
