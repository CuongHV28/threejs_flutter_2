"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LargeSideW1 = void 0;
var materials_1 = require("../materials");
var wallWidth = 10;
var wallHeight = 2;
var wallDepth = 0.25;
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
exports.LargeSideW1 = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: undefined,
    windows: [windowSettings4],
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=largeSide.w1.js.map