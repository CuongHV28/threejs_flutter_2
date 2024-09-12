"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoofBoxWallPlain = void 0;
var materials_1 = require("../materials");
var wallWidth = 4;
var wallHeight = 1.75;
var wallDepth = 0.25;
exports.RoofBoxWallPlain = {
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
//# sourceMappingURL=roofBoxWall.plain.js.map