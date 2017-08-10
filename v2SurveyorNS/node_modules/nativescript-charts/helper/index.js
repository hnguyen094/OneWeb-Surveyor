"use strict";
var color_1 = require("color");
function resolveColor(color) {
    if (typeof color == "string" && color_1.Color.isValid(color)) {
        return new color_1.Color(color).argb;
    }
    else if (typeof color == "number") {
        return new color_1.Color(color).argb;
    }
    return new color_1.Color("black").argb;
}
exports.resolveColor = resolveColor;
