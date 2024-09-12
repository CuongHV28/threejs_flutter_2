"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.woodMaterial = exports.wallMaterial3 = exports.wallMaterial2 = exports.wallMaterial = exports.windowMaterial = exports.roofMaterial = exports.floorMaterial = exports.groundMaterial = exports.phongMaterial = exports.lambert = exports.standartMaterial = exports.normalMaterial = exports.materialsMap = exports.colors = void 0;
var three_1 = require("three");
var colors = {
    ground: 0x333333,
    pavement: 0x999999,
    background: 0xf0f5f5,
    //background: 0xffffff,
    wall1: 0xff9999,
    wall2: 0xf4e4d5,
    wall3: 0xDFE8F3,
    window: 0x333333,
    alu: 0x111111,
    white: 0xffffff,
    awening: 0x0000ff,
    wood: 0xffffff,
    floor: 0x864427,
    roof: 0x330000,
    green: 0x008833
};
exports.colors = colors;
var normalMaterial = new three_1.MeshNormalMaterial();
exports.normalMaterial = normalMaterial;
var standartMaterial = new three_1.MeshStandardMaterial({ color: 0x666666 });
exports.standartMaterial = standartMaterial;
var lambert = new three_1.MeshLambertMaterial({ color: "#fff" });
exports.lambert = lambert;
var phongMaterial = new three_1.MeshPhongMaterial({ color: 0x0908ef });
exports.phongMaterial = phongMaterial;
var groundMaterial = new three_1.MeshStandardMaterial({
    color: colors.ground,
    transparent: true,
    opacity: 0.5,
});
exports.groundMaterial = groundMaterial;
var floorMaterial = new three_1.MeshLambertMaterial({
    color: colors.floor,
    side: three_1.DoubleSide
});
exports.floorMaterial = floorMaterial;
var roofMaterial = new three_1.MeshStandardMaterial({
    color: colors.roof,
    side: three_1.DoubleSide,
    metalness: 0.2,
    roughness: 0.5
});
exports.roofMaterial = roofMaterial;
var windowMaterial = new three_1.MeshStandardMaterial({ color: colors.window });
exports.windowMaterial = windowMaterial;
var wallMaterial = new three_1.MeshLambertMaterial({
    color: colors.wall1,
    side: three_1.DoubleSide
});
exports.wallMaterial = wallMaterial;
var wallMaterial2 = new three_1.MeshLambertMaterial({
    color: colors.wall2,
    side: three_1.DoubleSide
});
exports.wallMaterial2 = wallMaterial2;
var wallMaterial3 = new three_1.MeshLambertMaterial({
    color: colors.wall3,
    side: three_1.DoubleSide
});
exports.wallMaterial3 = wallMaterial3;
var woodMaterial = new three_1.MeshStandardMaterial({
    color: colors.wood,
    metalness: 0,
    roughness: 0.5
});
exports.woodMaterial = woodMaterial;
var materialsMap = {
    groundMaterial: groundMaterial,
    floorMaterial: floorMaterial,
    roofMaterial: roofMaterial,
    windowMaterial: windowMaterial,
    wallMaterial: wallMaterial,
    wallMaterial2: wallMaterial2,
    wallMaterial3: wallMaterial3,
    woodMaterial: woodMaterial,
    normalMaterial: normalMaterial,
    standartMaterial: standartMaterial,
    lambert: lambert,
    phongMaterial: phongMaterial
};
exports.materialsMap = materialsMap;
//# sourceMappingURL=materials.js.map