"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EqualSideD1 = void 0;
var materials_1 = require("../materials");
var wallWidth = 8;
var wallHeight = 2;
var wallDepth = 0.25;
var doorSettings1 = {
    width: 0.25,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.2,
    offsetGround: 0,
    balcony: undefined,
};
var doorSettings2 = {
    width: 0.3,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.6,
    offsetGround: 0,
    balcony: undefined,
};
exports.EqualSideD1 = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: [doorSettings2],
    windows: undefined,
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=equalSide.d1.js.map