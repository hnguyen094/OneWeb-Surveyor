const frame = require("ui/frame");
const fragment = require("./fragment.js");
const R = org.nativescript.v3SurveyorNS.R;
//console.dir(R);
const superProto = android.app.Activity.prototype;
const Activity = android.app.Activity.extend("com.tns.MainActivity", {
    onCreate: function(savedInstanceState) {
        if(!this._callbacks) {
            frame.setActivityCallbacks(this);
        }
        // Modules will take care of calling super.onCreate, do not call it here
        this._callbacks.onCreate(this, savedInstanceState, superProto.onCreate);
        this.setContentView(R.layout.activity_camera);
        if (savedInstanceState == null) {
          this.getFragmentManager().beginTransaction()
            .replace(R.id.container, new fragment.Camera2BasicFragment())
            .commit();
        }
    }
});
