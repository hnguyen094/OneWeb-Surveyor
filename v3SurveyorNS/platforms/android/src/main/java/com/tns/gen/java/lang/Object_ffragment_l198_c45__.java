package com.tns.gen.java.lang;

public class Object_ffragment_l198_c45__ extends java.lang.Object implements com.tns.NativeScriptHashCodeProvider, java.util.Comparator {
	public Object_ffragment_l198_c45__(){
		super();
		com.tns.Runtime.initInstance(this);
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = true;
		com.tns.Runtime.callJSMethod(this, "init", void.class, args);
	}

	public int compare(java.lang.Object param_0, java.lang.Object param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		return (int)com.tns.Runtime.callJSMethod(this, "compare", int.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
