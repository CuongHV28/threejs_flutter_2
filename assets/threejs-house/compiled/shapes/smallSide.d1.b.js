"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallSideD1B = void 0;
var materials_1 = require("../materials");
var wallWidth = 6;
var wallHeight = 2;
var wallDepth = 0.25;
var balconySettings1 = {
    width: 3,
    height: 0.3,
    depth: 2,
    isFullLength: true,
    material: materials_1.normalMaterial,
};
var balconySettings2 = {
    width: 3,
    height: 0.3,
    depth: 2,
    isFullLength: false,
    material: materials_1.normalMaterial,
};
var doorSettings1 = {
    width: 0.25,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.2,
    offsetGround: 0,
    balcony: balconySettings1,
};
var doorSettings2 = {
    width: 0.3,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.6,
    offsetGround: 0,
    balcony: undefined,
};
exports.SmallSideD1B = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: [doorSettings1],
    windows: undefined,
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=smallSide.d1.b.js.map