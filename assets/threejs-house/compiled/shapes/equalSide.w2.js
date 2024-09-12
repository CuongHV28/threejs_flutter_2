"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EqualSideW2 = void 0;
var materials_1 = require("../materials");
var wallWidth = 8;
var wallHeight = 2;
var wallDepth = 0.25;
var windowSettings1 = {
    width: 0.25,
    height: 0.25,
    depth: 1,
    offsetLeft: 0.84,
    offsetGround: 0.4,
};
var windowSettings2 = {
    width: 0.2,
    height: 0.2,
    depth: 1,
    offsetLeft: 0.2,
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
var floorThickness = 0.1; // Thickness of the floor
exports.EqualSideW2 = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: undefined,
    windows: [windowSettings1, windowSettings2],
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=equalSide.w2.js.map