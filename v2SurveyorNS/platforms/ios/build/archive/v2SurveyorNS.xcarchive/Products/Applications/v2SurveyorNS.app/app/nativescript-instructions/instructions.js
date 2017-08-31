"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("platform");
var isStart = false;
var isEleAbove0 = false;
var isElePast40 = false;
var isPressed = false;
var largeDeltaAz = false;
var oldAz = 0;
var page;
var pt1, pt2, pt3, pt4, pt5;
var currentView;
var translateY = platform.screen.mainScreen.heightPixels / 8 / platform.screen.mainScreen.scale;
function trigger1(mPage) {
    if (!isStart) {
        page = mPage;
        pt1 = page.getViewById("pt1");
        pt2 = page.getViewById("pt2");
        pt3 = page.getViewById("pt3");
        pt4 = page.getViewById("pt4");
        pt5 = page.getViewById("pt5");
        pt1.translateY = translateY;
        pt2.translateY = translateY;
        pt3.translateY = translateY;
        pt4.translateY = translateY;
        pt5.translateY = translateY;
        currentView = pt1;
    }
}
exports.trigger1 = trigger1;
function trigger2(ele) {
    if (!isEleAbove0) {
        isEleAbove0 = -ele > 0;
        if (isEleAbove0) {
            fadeaway(pt2);
        }
    }
    else if (-ele > 40) {
        pt5.opacity = 1;
    }
    else {
        pt5.opacity = 0;
    }
}
exports.trigger2 = trigger2;
function trigger3(az) {
    if (!isPressed) {
        fadeaway(pt3);
    }
    oldAz = az;
    isPressed = true;
}
exports.trigger3 = trigger3;
function trigger4(az) {
    if (!largeDeltaAz && isPressed) {
        largeDeltaAz = Math.abs(oldAz - az) > 20;
        if (largeDeltaAz) {
            end(pt3, pt4);
        }
    }
}
exports.trigger4 = trigger4;
function fadeaway(newView) {
    return currentView.animate({
        opacity: 0,
        duration: 1000
    }).then(function () {
        newView.animate({
            opacity: 1,
            duration: 1000
        });
        currentView = newView;
    });
}
function end(oldView, newView) {
    oldView.animate({
        opacity: 0,
        duration: 1000
    }).then(function () {
        newView.animate({
            opacity: 1,
            duration: 2000
        }).then(function () {
            newView.animate({
                opacity: 0,
                duration: 2000
            });
            currentView = newView;
        });
    });
}
function hide(view) {
    view.animate({
        opacity: 0,
        duration: 1000
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5zdHJ1Y3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXFDO0FBRXJDLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztBQUM3QixJQUFJLFdBQVcsR0FBWSxLQUFLLENBQUM7QUFDakMsSUFBSSxXQUFXLEdBQVksS0FBSyxDQUFDO0FBQ2pDLElBQUksU0FBUyxHQUFZLEtBQUssQ0FBQztBQUMvQixJQUFJLFlBQVksR0FBWSxLQUFLLENBQUM7QUFDbEMsSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDO0FBRXRCLElBQUksSUFBSSxDQUFDO0FBQ1QsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQzVCLElBQUksV0FBVyxDQUFDO0FBQ2hCLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO0FBRWpHLGtCQUF5QixLQUFLO0lBQzVCLEVBQUUsQ0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNaLElBQUksR0FBRyxLQUFLLENBQUM7UUFDYixHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixHQUFHLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztR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dGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcblxyXG5sZXQgaXNTdGFydDogYm9vbGVhbiA9IGZhbHNlO1xyXG5sZXQgaXNFbGVBYm92ZTA6IGJvb2xlYW4gPSBmYWxzZTtcclxubGV0IGlzRWxlUGFzdDQwOiBib29sZWFuID0gZmFsc2U7XHJcbmxldCBpc1ByZXNzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxubGV0IGxhcmdlRGVsdGFBejogYm9vbGVhbiA9IGZhbHNlO1xyXG5sZXQgb2xkQXo6IG51bWJlciA9IDA7XHJcblxyXG5sZXQgcGFnZTtcclxubGV0IHB0MSwgcHQyLCBwdDMsIHB0NCwgcHQ1O1xyXG5sZXQgY3VycmVudFZpZXc7XHJcbmNvbnN0IHRyYW5zbGF0ZVkgPSBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMgLyA4IC9wbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5zY2FsZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyMShtUGFnZSkge1xyXG4gIGlmKCFpc1N0YXJ0KSB7XHJcbiAgICBwYWdlID0gbVBhZ2U7XHJcbiAgICBwdDEgPSBwYWdlLmdldFZpZXdCeUlkKFwicHQxXCIpO1xyXG4gICAgcHQyID0gcGFnZS5nZXRWaWV3QnlJZChcInB0MlwiKTtcclxuICAgIHB0MyA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJwdDNcIik7XHJcbiAgICBwdDQgPSBwYWdlLmdldFZpZXdCeUlkKFwicHQ0XCIpO1xyXG4gICAgcHQ1ID0gcGFnZS5nZXRWaWV3QnlJZChcInB0NVwiKTtcclxuICAgIHB0MS50cmFuc2xhdGVZID0gdHJhbnNsYXRlWTtcclxuICAgIHB0Mi50cmFuc2xhdGVZID0gdHJhbnNsYXRlWTtcclxuICAgIHB0My50cmFuc2xhdGVZID0gdHJhbnNsYXRlWTtcclxuICAgIHB0NC50cmFuc2xhdGVZID0gdHJhbnNsYXRlWTtcclxuICAgIHB0NS50cmFuc2xhdGVZID0gdHJhbnNsYXRlWTtcclxuICAgIGN1cnJlbnRWaWV3ID0gcHQxO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRyaWdnZXIyKGVsZSkge1xyXG4gIGlmKCFpc0VsZUFib3ZlMCkge1xyXG4gICAgaXNFbGVBYm92ZTAgPSAtZWxlID4gMDtcclxuICAgIGlmKGlzRWxlQWJvdmUwKSB7XHJcbiAgICAgIGZhZGVhd2F5KHB0Mik7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmKC1lbGUgPiA0MCkge1xyXG4gICAgcHQ1Lm9wYWNpdHkgPSAxO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwdDUub3BhY2l0eSA9IDA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdHJpZ2dlcjMoYXopIHtcclxuICBpZighaXNQcmVzc2VkKSB7XHJcbiAgICBmYWRlYXdheShwdDMpO1xyXG4gIH1cclxuICBvbGRBeiA9IGF6O1xyXG4gIGlzUHJlc3NlZCA9IHRydWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyNChheikge1xyXG4gIGlmKCFsYXJnZURlbHRhQXogJiYgaXNQcmVzc2VkKXtcclxuICAgIGxhcmdlRGVsdGFBeiA9IE1hdGguYWJzKG9sZEF6LWF6KSA+IDIwO1xyXG4gICAgaWYobGFyZ2VEZWx0YUF6KSB7XHJcbiAgICAgIGVuZChwdDMsIHB0NCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmYWRlYXdheShuZXdWaWV3KSB7XHJcbiAgcmV0dXJuIGN1cnJlbnRWaWV3LmFuaW1hdGUoe1xyXG4gICAgb3BhY2l0eTogMCxcclxuICAgIGR1cmF0aW9uOiAxMDAwXHJcbiAgfSkudGhlbigoKT0+e1xyXG4gICAgbmV3Vmlldy5hbmltYXRlKHtcclxuICAgICAgb3BhY2l0eTogMSxcclxuICAgICAgZHVyYXRpb246IDEwMDBcclxuICAgIH0pO1xyXG4gICAgY3VycmVudFZpZXcgPSBuZXdWaWV3O1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbmQob2xkVmlldywgbmV3Vmlldykge1xyXG4gIG9sZFZpZXcuYW5pbWF0ZSh7XHJcbiAgICBvcGFjaXR5OiAwLFxyXG4gICAgZHVyYXRpb246IDEwMDBcclxuICB9KS50aGVuKCgpID0+e1xyXG4gICAgbmV3Vmlldy5hbmltYXRlKHtcclxuICAgICAgb3BhY2l0eTogMSxcclxuICAgICAgZHVyYXRpb246IDIwMDBcclxuICAgIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICBuZXdWaWV3LmFuaW1hdGUoe1xyXG4gICAgICAgIG9wYWNpdHk6MCxcclxuICAgICAgICBkdXJhdGlvbjogMjAwMFxyXG4gICAgICB9KTtcclxuICAgICAgY3VycmVudFZpZXcgPSBuZXdWaWV3O1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gaGlkZSh2aWV3KSB7XHJcbiAgdmlldy5hbmltYXRlKHtcclxuICAgIG9wYWNpdHk6IDAsXHJcbiAgICBkdXJhdGlvbjogMTAwMFxyXG4gIH0pO1xyXG59XHJcbiJdfQ==