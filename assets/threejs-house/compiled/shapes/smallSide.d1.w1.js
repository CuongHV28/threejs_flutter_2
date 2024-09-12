"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallSideD1W1 = void 0;
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
var windowSettings1 = {
    width: 0.1,
    height: 0.1,
    depth: 1,
    offsetLeft: 0.5,
    offsetGround: 0.8,
};
var windowSettings2 = {
    width: 0.2,
    height: 0.2,
    depth: 1,
    offsetLeft: 0.9,
    offsetGround: 0.5,
};
var windowSettings3 = {
    width: 0.2,
    height: 0.2,
    depth: 1,
    offsetLeft: 0.25,
    offsetGround: 0.5,
};
var windowSettings4 = {
    width: 0.2,
    height: 0.2,
    depth: 1,
    offsetLeft: 0.25,
    offsetGround: 0.5,
};
exports.SmallSideD1W1 = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: [doorSettings2],
    windows: [windowSettings3],
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=smallSide.d1.w1.js.map