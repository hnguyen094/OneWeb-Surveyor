"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_source_1 = require("tns-core-modules/image-source");
var ImageFilters = (function () {
    function ImageFilters() {
        this._context = new CIContext(null);
    }
    ImageFilters.prototype.sepiaEffect = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 0.5; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_1 = _this._createFilter("CISepiaTone", inputImage);
                filter_1.setValueForKey(intensity, kCIInputIntensityKey);
                var result = _this._processImage(filter_1);
                resolve(result);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    ImageFilters.prototype.gamma = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_2 = _this._createFilter("CIGammaAdjust", inputImage);
                filter_2.setValueForKey(intensity, kCIInputBoostKey);
                var result = _this._processImage(filter_2);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.invert = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_3 = _this._createFilter("CIColorInvert", inputImage);
                var result = _this._processImage(filter_3);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.chromeEffect = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_4 = _this._createFilter("CIPhotoEffectChrome", inputImage);
                var result = _this._processImage(filter_4);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.fadeEffect = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_5 = _this._createFilter("CIPhotoEffectFade", inputImage);
                var result = _this._processImage(filter_5);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.vintage = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_6 = _this._createFilter("CIPhotoEffectInstant", inputImage);
                var result = _this._processImage(filter_6);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.colorize = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_7 = _this._createFilter("CIColorMonochrome", inputImage);
                filter_7.setValueForKey(intensity, kCIInputIntensityKey);
                var result = _this._processImage(filter_7);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.motionBlur = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_8 = _this._createFilter("CIMotionBlur", inputImage);
                var result = _this._processImage(filter_8);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.comicBook = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_9 = _this._createFilter("CIComicEffect", inputImage);
                var result = _this._processImage(filter_9);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.crystalize = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_10 = _this._createFilter("CICrystallize", inputImage);
                var result = _this._processImage(filter_10);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.colorEdges = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_11 = _this._createFilter("CIEdges", inputImage);
                var result = _this._processImage(filter_11);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.coloringBook = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_12 = _this._createFilter("CIEdgeWork", inputImage);
                var result = _this._processImage(filter_12);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.dull = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_13 = _this._createFilter("CIGloom", inputImage);
                var result = _this._processImage(filter_13);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.threeD = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_14 = _this._createFilter("CIHeightFieldFromMask", inputImage);
                var result = _this._processImage(filter_14);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.sketch = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_15 = _this._createFilter("CILineOverlay", inputImage);
                var result = _this._processImage(filter_15);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.pointillize = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_16 = _this._createFilter("CIPointillize", inputImage);
                var result = _this._processImage(filter_16);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.spotLight = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_17 = _this._createFilter("CISpotLight", inputImage);
                var result = _this._processImage(filter_17);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.kaleidoscope = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_18 = _this._createFilter("CIKaleidoscope", inputImage);
                var result = _this._processImage(filter_18);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.opTile = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_19 = _this._createFilter("CIOpTile", inputImage);
                var result = _this._processImage(filter_19);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.perspectiveTile = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_20 = _this._createFilter("CIPerspectiveTile", inputImage);
                var result = _this._processImage(filter_20);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.twirl = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_21 = _this._createFilter("CITwirlDistortion", inputImage);
                var result = _this._processImage(filter_21);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.exposure = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_22 = _this._createFilter("CIExposureAdjust", inputImage);
                filter_22.setValueForKey(intensity, kCIInputEVKey);
                var result = _this._processImage(filter_22);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.brightness = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_23 = _this._createFilter("CIColorControls", inputImage);
                filter_23.setValueForKey(intensity, kCIInputBrightnessKey);
                filter_23.setValueForKey(1.05, kCIInputContrastKey);
                var result = _this._processImage(filter_23);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.vibrant = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_24 = _this._createFilter("CIColorControls", inputImage);
                filter_24.setValueForKey(intensity * 2, kCIInputSaturationKey);
                var result = _this._processImage(filter_24);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.gaussianBlur = function (img, radius) {
        var _this = this;
        if (radius === void 0) { radius = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_25 = _this._createFilter("CIGaussianBlur", inputImage);
                filter_25.setValueForKey(radius, kCIInputRadiusKey);
                var result = _this._processImage(filter_25);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.blackAndWhite = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_26 = _this._createFilter("CIPhotoEffectMono", inputImage);
                var result = _this._processImage(filter_26);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.tonalEffect = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_27 = _this._createFilter("CIPhotoEffectTonal", inputImage);
                var result = _this._processImage(filter_27);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.circularWrap = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_28 = _this._createFilter("CICircularWrap", inputImage);
                var result = _this._processImage(filter_28);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.holeDistort = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_29 = _this._createFilter("CIHoleDistortion", inputImage);
                var result = _this._processImage(filter_29);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.lightTunnel = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_30 = _this._createFilter("CILightTunnel", inputImage);
                var result = _this._processImage(filter_30);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.pinchDistort = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_31 = _this._createFilter("CIPinchDistortion", inputImage);
                var result = _this._processImage(filter_31);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.torusLensDistort = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_32 = _this._createFilter("CITorusLensDistortion", inputImage);
                var result = _this._processImage(filter_32);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.vortexDistort = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_33 = _this._createFilter("CIVortexDistortion", inputImage);
                var result = _this._processImage(filter_33);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.circularScreen = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_34 = _this._createFilter("CICircularScreen", inputImage);
                var result = _this._processImage(filter_34);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.halftone = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_35 = _this._createFilter("CICMYKHalftone", inputImage);
                var result = _this._processImage(filter_35);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.lineScreen = function (img) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_36 = _this._createFilter("CILineScreen", inputImage);
                var result = _this._processImage(filter_36);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.contrast = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_37 = _this._createFilter("CIColorControls", inputImage);
                filter_37.setValueForKey(intensity * 4, kCIInputContrastKey);
                var result = _this._processImage(filter_37);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.sharpen = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_38 = _this._createFilter("CISharpenLuminance", inputImage);
                filter_38.setValueForKey(intensity, kCIInputSharpnessKey);
                var result = _this._processImage(filter_38);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype.posterize = function (img, intensity) {
        var _this = this;
        if (intensity === void 0) { intensity = 1; }
        return new Promise(function (resolve, reject) {
            try {
                var inputImage = _this._createCGImage(img);
                var filter_39 = _this._createFilter("CIColorPosterize", inputImage);
                filter_39.setValueForKey(intensity, kCIInputIntensityKey);
                var result = _this._processImage(filter_39);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
    };
    ImageFilters.prototype._createCGImage = function (img) {
        var cgImg = CIImage.alloc().initWithCGImage(img.ios.image.CGImage);
        return cgImg;
    };
    ImageFilters.prototype._createOutputCGImage = function (img) {
        var outputCGImage = this._context.createCGImageFromRect(img, img.extent);
        return outputCGImage;
    };
    ImageFilters.prototype._createFilter = function (name, img) {
        var filter = CIFilter.filterWithName(name);
        filter.setValueForKey(img, kCIInputImageKey);
        filter.setDefaults();
        return filter;
    };
    ImageFilters.prototype._processImage = function (filter) {
        var filteredImg = filter.valueForKey(kCIOutputImageKey);
        var outputCGImage = this._createOutputCGImage(filteredImg);
        var outputUIImage = UIImage.imageWithCGImage(outputCGImage);
        var result = image_source_1.fromNativeSource(outputUIImage);
        return result;
    };
    return ImageFilters;
}());
exports.ImageFilters = ImageFilters;
