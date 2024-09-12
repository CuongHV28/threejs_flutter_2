"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallSidePlain = void 0;
var materials_1 = require("../materials");
var wallWidth = 6;
var wallHeight = 2;
var wallDepth = 0.25;
exports.SmallSidePlain = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: undefined,
    windows: undefined,
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=smallSide.plain.js.map