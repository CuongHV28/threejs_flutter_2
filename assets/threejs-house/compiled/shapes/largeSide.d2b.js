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
exports.LargeSideD2B = void 0;
var THREE = __importStar(require("three"));
var materials_1 = require("../materials");
var wallWidth = 10;
var wallHeight = 2;
var wallDepth = 0.25;
var balconySettings1 = {
    width: 3,
    height: 0.1,
    depth: 2,
    isFullLength: true,
    material: materials_1.normalMaterial,
};
var doorSettings1 = {
    width: 0.15,
    height: 0.5,
    depth: 1,
    offsetLeft: 0.3,
    offsetGround: 0,
    balcony: balconySettings1,
};
var doorSettings2 = {
    width: 0.1,
    height: 0.5,
    depth: 1,
    offsetLeft: 0.8,
    offsetGround: 0,
    balcony: undefined,
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
exports.LargeSideD2B = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: materials_1.wallMaterial,
    doors: [doorSettings1, doorSettings2],
    windows: undefined,
    stairs: stairSettings,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
//# sourceMappingURL=largeSide.d2b.js.map