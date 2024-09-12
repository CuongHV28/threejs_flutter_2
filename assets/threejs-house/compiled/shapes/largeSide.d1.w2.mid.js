"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LargeSideD2W2Mid = void 0;
var THREE = __importStar(require("three"));
var materials_1 = require("../materials");
var wallWidth = 10;
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
    width: 0.2,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.5,
    offsetGround: 0,
    balcony: undefined,
};
var doorSettings2 = {
    width: 0.25,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.6,
    offsetGround: 0,
    balcony: balconySettings2,
};
var floorThickness = 0.1; // Thickness of the floor
//stairs settings
var steps = 10;
var stepWidth = 1;
var stepHeight = (wallHeight - floorThickness) / steps;
var stairSettings = {
    steps: steps,
    stepWidth: stepWidth,
    stepHeight: stepHeight,
    stepDepth: 0.5,
    material: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
exports.LargeSideD2W2Mid = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: [doorSettings1],
    windows: [windowSettings1, windowSettings2],
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=largeSide.d1.w2.mid.js.map