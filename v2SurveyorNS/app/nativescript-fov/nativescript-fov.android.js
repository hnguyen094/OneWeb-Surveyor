let mCamera = null;
let params = null;
let verticalFOV;
let horizontalFOV;
exports.onLoaded = function () {
  mCamera = android.hardware.Camera.open(0);
  params = mCamera.getParameters();
  mCamera.release();
  mCamera = null;
  verticalFOV = params.getVerticalViewAngle();
  horizontalFOV = params.getHorizontalViewAngle();

}
exports.getVerticalFOV = function () {
  console.log("verticalFOV " + verticalFOV);
  return verticalFOV;
}
exports.getHorizontalFOV = function() {
  console.log("horizontalFOV " + horizontalFOV);
  return horizontalFOV;
}
