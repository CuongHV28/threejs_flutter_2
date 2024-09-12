"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallSideW2 = void 0;
var materials_1 = require("../materials");
var wallWidth = 6;
var wallHeight = 2;
var wallDepth = 0.25;
var windowSettings1 = {
    width: 0.2,
    height: 0.4,
    depth: 1,
    offsetLeft: 0.3,
    offsetGround: 0.5,
};
var windowSettings2 = {
    width: 0.4,
    height: 0.4,
    depth: 1,
    offsetLeft: 0.7,
    offsetGround: 0.5,
};
var windowSettings3 = {
    width: 0.5,
    height: 0.5,
    depth: 1,
    offsetLeft: 0.5,
    offsetGround: 0.4,
};
var windowSettings4 = {
    width: 0.2,
    height: 0.2,
    depth: 1,
    offsetLeft: 0.25,
    offsetGround: 0.5,
};
exports.SmallSideW2 = {
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
//# sourceMappingURL=smallSide.w2.js.map