"use strict";
Object.defineProperty(exports, "__esModule", {value : true});

let page;

const app = require('application');
function onLoaded(args) {
  console.log("Loaded!");
  page = args;
}
exports.onLoaded = onLoaded;
