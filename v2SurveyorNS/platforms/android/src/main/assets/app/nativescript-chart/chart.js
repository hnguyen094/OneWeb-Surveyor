"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("platform");
var bitmapFactory = require("nativescript-bitmap-factory");
var page;
var ele = [];
var maxEle;
var minEle;
var imgSrc = null;
var timer;
var bmp;
var width = platform.screen.mainScreen.widthPixels / 360;
var heightMult = platform.screen.mainScreen.heightPixels / 4;
function initGraph(myPage) {
    bmp = bitmapFactory.create(platform.screen.mainScreen.widthPixels, heightMult);
    page = myPage;
    maxEle = 60;
    minEle = 0;
    timer = 60;
    for (var i = 0; i < 360; i++) {
        ele.push((maxEle + minEle) / 2);
        var heightPercent = (ele[i] - minEle) / (maxEle - minEle);
        bmp.drawRect(width + "x" + (heightMult * heightPercent), (i * width) + "," + heightMult * (1 - heightPercent), "#1b5675", "#1b5675");
    }
    imgSrc = bmp.toImageSource();
    page.getViewById("graph").src = imgSrc;
}
exports.initGraph = initGraph;
function updateGraph(azimuth, elevation) {
    return __awaiter(this, void 0, void 0, function () {
        var i, heightPercent;
        return __generator(this, function (_a) {
            ele[Math.floor(azimuth) + 180] = -elevation < minEle ? minEle : -elevation > maxEle ? maxEle : -elevation;
            // console.log("az-el: " + azimuth + "-  " + ele[azimuth]);
            if (timer > 0) {
                timer--;
            }
            else {
                timer = 60;
                bmp.dispose();
                bmp = bitmapFactory.create(platform.screen.mainScreen.widthPixels, heightMult);
                for (i = 0; i < 360; i++) {
                    console.log(ele[i]);
                    heightPercent = (ele[i] - minEle) / (maxEle - minEle);
                    // console.log("height: "+ heightPercent);
                    bmp.drawRect(width + "x" + (heightMult * heightPercent), (i * width) + "," + heightMult * (1 - heightPercent), "#1b5675", "#1b5675");
                }
                imgSrc = bmp.toImageSource();
                page.getViewById("graph").src = imgSrc;
            }
            return [2 /*return*/];
        });
    });
}
exports.updateGraph = updateGraph;
function onExit() {
    // bmp.dispose();
}
exports.onExit = onExit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXFDO0FBQ3JDLDJEQUE2RDtBQUk3RCxJQUFJLElBQUksQ0FBQztBQUNULElBQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztBQUV6QixJQUFJLE1BQWUsQ0FBQztBQUNwQixJQUFJLE1BQWUsQ0FBQztBQUVwQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsSUFBSSxLQUFhLENBQUM7QUFDbEIsSUFBSSxHQUFHLENBQUM7QUFDUixJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUMsR0FBRyxDQUFDO0FBQ3pELElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBQyxDQUFDLENBQUM7QUFFN0QsbUJBQTBCLE1BQU07SUFDOUIsR0FBRyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlFLElBQUksR0FBRyxNQUFNLENBQUM7SUFDZCxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ1osTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNYLEtBQUssR0FBRyxFQUFFLENBQUM7SUFFWCxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUUsTUFBTSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUMsQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxVQUFVLEdBQUUsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3RJLENBQUM7SUFDRCxNQUFNLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzdCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztBQUN6QyxDQUFDO0FBZEQsOEJBY0M7QUFFRCxxQkFBa0MsT0FBTyxFQUFFLFNBQVM7Ozs7WUFDbEQsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFFLE1BQU0sR0FBRSxDQUFDLFNBQVMsR0FBRyxNQUFNLEdBQUUsTUFBTSxHQUFFLENBQUMsU0FBUyxDQUFDO1lBRXBHLDJEQUEyRDtZQUMzRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFLLEVBQUUsQ0FBQztZQUNWLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNYLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDZCxHQUFHLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzlFLEdBQUcsQ0FBQSxDQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNkLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBQyxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDeEQsMENBQTBDO29CQUMxQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLFVBQVUsR0FBRSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3RJLENBQUM7Z0JBQ0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQ3pDLENBQUM7Ozs7Q0FDRjtBQW5CRCxrQ0FtQkM7QUFDRDtJQUNFLGlCQUFpQjtBQUNuQixDQUFDO0FBRkQsd0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0ICogYXMgYml0bWFwRmFjdG9yeSBmcm9tIFwibmF0aXZlc2NyaXB0LWJpdG1hcC1mYWN0b3J5XCI7XHJcbmltcG9ydCAqIGFzIGtub3duQ29sb3JzIGZyb20gXCJjb2xvci9rbm93bi1jb2xvcnNcIjtcclxuaW1wb3J0ICogYXMgSW1hZ2VNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvaW1hZ2VcIjtcclxuXHJcbmxldCBwYWdlO1xyXG5jb25zdCBlbGU6IG51bWJlcltdID0gW107XHJcblxyXG5sZXQgbWF4RWxlIDogbnVtYmVyO1xyXG5sZXQgbWluRWxlIDogbnVtYmVyO1xyXG5cclxubGV0IGltZ1NyYyA9IG51bGw7XHJcbmxldCB0aW1lcjogbnVtYmVyO1xyXG5sZXQgYm1wO1xyXG5jb25zdCB3aWR0aCA9IHBsYXRmb3JtLnNjcmVlbi5tYWluU2NyZWVuLndpZHRoUGl4ZWxzLzM2MDtcclxuY29uc3QgaGVpZ2h0TXVsdCA9IHBsYXRmb3JtLnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodFBpeGVscy80O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRHcmFwaChteVBhZ2UpIHtcclxuICBibXAgPSBiaXRtYXBGYWN0b3J5LmNyZWF0ZShwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi53aWR0aFBpeGVscyxoZWlnaHRNdWx0KTtcclxuICBwYWdlID0gbXlQYWdlO1xyXG4gIG1heEVsZSA9IDYwO1xyXG4gIG1pbkVsZSA9IDA7XHJcbiAgdGltZXIgPSA2MDtcclxuXHJcbiAgZm9yKGxldCBpID0gMDsgaSA8IDM2MDsgaSsrKSB7XHJcbiAgICBlbGUucHVzaCgobWF4RWxlKyBtaW5FbGUpLzIpO1xyXG4gICAgY29uc3QgaGVpZ2h0UGVyY2VudCA9IChlbGVbaV0gLSBtaW5FbGUpLyhtYXhFbGUtbWluRWxlKTtcclxuICAgIGJtcC5kcmF3UmVjdCh3aWR0aCArIFwieFwiICsgKGhlaWdodE11bHQgKiBoZWlnaHRQZXJjZW50KSwgKGkgKiB3aWR0aCkgKyBcIixcIiArIGhlaWdodE11bHQqICgxIC0gaGVpZ2h0UGVyY2VudCksIFwiIzFiNTY3NVwiLCBcIiMxYjU2NzVcIik7XHJcbiAgfVxyXG4gIGltZ1NyYyA9IGJtcC50b0ltYWdlU291cmNlKCk7XHJcbiAgcGFnZS5nZXRWaWV3QnlJZChcImdyYXBoXCIpLnNyYyA9IGltZ1NyYztcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUdyYXBoKGF6aW11dGgsIGVsZXZhdGlvbikge1xyXG4gIGVsZVtNYXRoLmZsb29yKGF6aW11dGgpKzE4MF0gPSAtZWxldmF0aW9uIDwgbWluRWxlPyBtaW5FbGUgOi1lbGV2YXRpb24gPiBtYXhFbGU/IG1heEVsZTogLWVsZXZhdGlvbjtcclxuXHJcbiAgLy8gY29uc29sZS5sb2coXCJhei1lbDogXCIgKyBhemltdXRoICsgXCItICBcIiArIGVsZVthemltdXRoXSk7XHJcbiAgaWYgKHRpbWVyID4gMCkge1xyXG4gICAgdGltZXItLTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGltZXIgPSA2MDtcclxuICAgIGJtcC5kaXNwb3NlKCk7XHJcbiAgICBibXAgPSBiaXRtYXBGYWN0b3J5LmNyZWF0ZShwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi53aWR0aFBpeGVscyxoZWlnaHRNdWx0KTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCAzNjA7IGkrKykge1xyXG4gICAgICBjb25zb2xlLmxvZyhlbGVbaV0pO1xyXG4gICAgICBjb25zdCBoZWlnaHRQZXJjZW50ID0gKGVsZVtpXSAtIG1pbkVsZSkvKG1heEVsZS1taW5FbGUpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcImhlaWdodDogXCIrIGhlaWdodFBlcmNlbnQpO1xyXG4gICAgICBibXAuZHJhd1JlY3Qod2lkdGggKyBcInhcIiArIChoZWlnaHRNdWx0ICogaGVpZ2h0UGVyY2VudCksIChpICogd2lkdGgpICsgXCIsXCIgKyBoZWlnaHRNdWx0KiAoMSAtIGhlaWdodFBlcmNlbnQpLCBcIiMxYjU2NzVcIiwgXCIjMWI1Njc1XCIpO1xyXG4gICAgfVxyXG4gICAgaW1nU3JjID0gYm1wLnRvSW1hZ2VTb3VyY2UoKTtcclxuICAgIHBhZ2UuZ2V0Vmlld0J5SWQoXCJncmFwaFwiKS5zcmMgPSBpbWdTcmM7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBvbkV4aXQoKSB7XHJcbiAgLy8gYm1wLmRpc3Bvc2UoKTtcclxufVxyXG4iXX0=