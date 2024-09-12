"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EqualSidePlain = void 0;
var materials_1 = require("../materials");
var wallWidth = 8;
var wallHeight = 2;
var wallDepth = 0.25;
exports.EqualSidePlain = {
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
//# sourceMappingURL=equalSide.plain.js.map