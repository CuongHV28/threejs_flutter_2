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
exports.settingsMap = void 0;
var THREE = __importStar(require("three"));
var smallSide_d1_1 = require("./smallSide.d1");
var smallSide_plain_1 = require("./smallSide.plain");
var largeSide_plain_1 = require("./largeSide.plain");
var largeSide_w1_1 = require("./largeSide.w1");
var roofAShape_1 = require("./roofAShape");
var roofBoxNoRailings_1 = require("./roofBoxNoRailings");
var largeSide_garage_1 = require("./largeSide.garage");
var largeSide_d2b_1 = require("./largeSide.d2b");
var largeSide_w2_1 = require("./largeSide.w2");
var largeSide_d1_1 = require("./largeSide.d1");
var largeSide_d1_w1_1 = require("./largeSide.d1.w1");
var largeSide_d1_w2_mid_1 = require("./largeSide.d1.w2.mid");
var largeSide_d1_w2_s1_1 = require("./largeSide.d1.w2.s1");
var roofBoxHasRailingsNoExit_1 = require("./roofBoxHasRailingsNoExit");
var roofBoxHasRailingsSideExits_1 = require("./roofBoxHasRailingsSideExits");
var largeSide_d2_1 = require("./largeSide.d2");
var smallSide_d2_1 = require("./smallSide.d2");
var smallSide_d1_b_1 = require("./smallSide.d1.b");
var smallSide_d1_w1_1 = require("./smallSide.d1.w1");
var smallSide_garage_1 = require("./smallSide.garage");
var smallSide_w1_1 = require("./smallSide.w1");
var smallSide_w2_1 = require("./smallSide.w2");
//stairs settings
var stepWidth = 0.1; // Width of each step is 0.1 * floorwidth
var steps = 10;
var stepHeight = 0.1; // Height of each step is 0.1 * height of the stair
var stepDepth = 0.1; // Depth of each step is 0.1 * width of the stair
var stairSettings = {
    steps: steps,
    stepWidth: stepWidth,
    stepHeight: stepHeight,
    stepDepth: stepDepth,
    material: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};
exports.settingsMap = {
    SmallSideD1: smallSide_d1_1.SmallSideD1,
    SmallSideD2: smallSide_d2_1.SmallSideD2,
    SmallSidePlain: smallSide_plain_1.SmallSidePlain,
    SmallSideD1B: smallSide_d1_b_1.SmallSideD1B,
    SmallSideD1W1: smallSide_d1_w1_1.SmallSideD1W1,
    SmallSideGarage: smallSide_garage_1.SmallSideGarage,
    SmallSideW1: smallSide_w1_1.SmallSideW1,
    SmallSideW2: smallSide_w2_1.SmallSideW2,
    LargeSideD1: largeSide_d1_1.LargeSideD1,
    LargeSideD1W1: largeSide_d1_w1_1.LargeSideD1W1,
    LargeSideD2W2Mid: largeSide_d1_w2_mid_1.LargeSideD2W2Mid,
    LargeSideD1W2S1: largeSide_d1_w2_s1_1.LargeSideD1W2S1,
    LargeSidePlain: largeSide_plain_1.LargeSidePlain,
    LargeSideW1: largeSide_w1_1.LargeSideW1,
    LargeSideGarage: largeSide_garage_1.LargeSideGarage,
    LargeSideD2: largeSide_d2_1.LargeSideD2,
    LargeSideD2B: largeSide_d2b_1.LargeSideD2B,
    LargeSideW2: largeSide_w2_1.LargeSideW2,
    stairSettings: stairSettings,
    RoofAShaped: roofAShape_1.RoofAShaped,
    RoofBoxNoRailings: roofBoxNoRailings_1.RoofBoxNoRailings,
    RoofBoxHasRailingsSideExits: roofBoxHasRailingsSideExits_1.RoofBoxHasRailingsSideExits,
    RoofBoxHasRailingsNoExits: roofBoxHasRailingsNoExit_1.RoofBoxHasRailingsNoExits
};
//# sourceMappingURL=settingsMap.js.map