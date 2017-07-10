"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

var page;

var STATE_PREVIEW = 0;
var STATE_WAITING_LOCK = 1;
var STATE_WAITING_PRECAPTURE = 2;
var STATE_WAITING_NON_PRECAPTURE = 3;
var STATE_PICTURE_TAKEN = 4;
var mState = STATE_PREVIEW;

var app = require('application');
function onLoaded(args) {
  console.log("loaded!");
  page = args;
}
exports.onLoaded = onLoaded;
