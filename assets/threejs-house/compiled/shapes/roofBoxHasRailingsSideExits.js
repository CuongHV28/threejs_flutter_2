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
exports.RoofBoxHasRailingsSideExits = void 0;
var THREE = __importStar(require("three"));
var materials_1 = require("../materials");
var roofBoxWall_plain_1 = require("./roofBoxWall.plain");
var roofBoxWall_d1_1 = require("./roofBoxWall.d1");
var roofHeight = 0.2;
var railingHeight = 1 - roofHeight;
var railingSpace = 0.3;
var railingMaterial = {
    default: new THREE.MeshLambertMaterial({ color: 0x00ff00 }), // Green railing
    alu: new THREE.MeshLambertMaterial({ color: 0x111111 }) // Dark grey railing
};
var placeHolder = 1;
var roofFrontWallSettings = {
    width: placeHolder,
    height: roofHeight,
    depth: placeHolder,
    material: materials_1.wallMaterial,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
};
var roofLateraWallSettings = {
    width: placeHolder,
    height: roofHeight,
    depth: placeHolder,
    material: materials_1.wallMaterial,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
};
var roofBoxSettings = {
    FrontWallSettings: roofBoxWall_plain_1.RoofBoxWallPlain,
    LeftWallSettings: roofBoxWall_d1_1.RoofBoxWallD1,
    RightWallSettings: roofBoxWall_plain_1.RoofBoxWallPlain,
    BackWallSettings: roofBoxWall_plain_1.RoofBoxWallPlain,
};
var topFrontRailing = {
    materials: railingMaterial,
    width: Math.abs(roofFrontWallSettings.width + 2 * roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};
var topLeftRailing = {
    materials: railingMaterial,
    width: Math.abs(roofLateraWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: true
};
var topBackRailing = {
    materials: railingMaterial,
    width: Math.abs(roofFrontWallSettings.width + 2 * roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};
var topRightRailing = {
    materials: railingMaterial,
    width: Math.abs(roofLateraWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};
var flatRailing = {
    materials: railingMaterial,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};
var topRailings = {
    front: topFrontRailing,
    left: topLeftRailing,
    back: topBackRailing,
    right: topRightRailing,
    flat: flatRailing
};
exports.RoofBoxHasRailingsSideExits = {
    FrontWallSettings: roofFrontWallSettings,
    LeftWallSettings: roofLateraWallSettings,
    BackWallSettings: roofFrontWallSettings,
    RightWallSettings: roofLateraWallSettings,
    RoofBoxSettings: roofBoxSettings,
    Railings: topRailings,
    IsAShaped: false,
};
//# sourceMappingURL=roofBoxHasRailingsSideExits.js.map