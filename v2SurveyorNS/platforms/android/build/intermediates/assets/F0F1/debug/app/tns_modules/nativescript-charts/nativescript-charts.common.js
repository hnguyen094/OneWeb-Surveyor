"use strict";
var app = require("application");
var Common = (function () {
    function Common() {
        this.message = Utils.SUCCESS_MSG();
    }
    return Common;
}());
exports.Common = Common;
var Utils = (function () {
    function Utils() {
    }
    Utils.SUCCESS_MSG = function () {
        var msg = "Your plugin is working on " + (app.android ? "Android" : "iOS") + ".";
        return msg;
    };
    return Utils;
}());
exports.Utils = Utils;
