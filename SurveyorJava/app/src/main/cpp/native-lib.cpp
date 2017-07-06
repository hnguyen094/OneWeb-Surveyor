#include <jni.h>
#include <iostream>
#include <fstream>
#include <string>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/stitching.hpp>

using namespace std;
using namespace cv;

// JNI Instructions for opencv: https://github.com/leadrien/opencv_native_androidstudio

extern "C"
JNIEXPORT jstring JNICALL
Java_com_example_hnguyen_surveyor_CameraActivity_stringFromJNI(
        JNIEnv* env,
        jobject /* this */) {
    std::string hello = "Hello from C++";
    return env->NewStringUTF(hello.c_str());
}

extern "C"
JNIEXPORT int JNICALL
Java_com_example_hnguyen_surveyor_CameraActivity_stitch(
        JNIEnv *env,
        jobject instance,
        jlong img1Addr, jlong img2Addr) {
    if (img1Addr == NULL || img2Addr == NULL)
        return 1;
    cv::Mat& img1 = *(Mat*)img1Addr;
    cv::Mat& img2 = *(Mat*)img2Addr;
    vector<cv::Mat> imgs;
    imgs.push_back(img1);
    imgs.push_back(img2);
    Ptr<Stitcher> stitcher = Stitcher::create(Stitcher::PANORAMA, false);
    Stitcher::Status status = stitcher->stitch(imgs, img1);
    // TODO
    if (status != Stitcher::OK)
    {
        cout << "Can't stitch images, error code = " << int(status) << endl;
    }
    return 0;
}