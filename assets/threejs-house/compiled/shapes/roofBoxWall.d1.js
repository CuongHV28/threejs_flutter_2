"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoofBoxWallD1 = void 0;
var materials_1 = require("../materials");
var wallWidth = 4;
var wallHeight = 1.75;
var wallDepth = 0.25;
var doorSettings = {
    width: 0.3,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.6,
    offsetGround: 0,
    balcony: undefined,
};
exports.RoofBoxWallD1 = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: [doorSettings],
    windows: undefined,
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=roofBoxWall.d1.js.map