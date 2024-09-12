import * as THREE from 'three';
import { SmallSideD1 } from './smallSide.d1';
import { SmallSidePlain } from './smallSide.plain';
import { LargeSidePlain } from './largeSide.plain';
import { LargeSideW1 } from './largeSide.w1';
import { IBalconyMaterials, IBalconyRailing, IStairsSettings, ITopRailings, IWallSettings } from './baseShapes';
import { wallMaterial } from '../materials';
import { IHouseFloorSettings, IHouseRoofSettings } from '../houses/base';
import { RoofBoxWallPlain } from './roofBoxWall.plain';
import { RoofBoxWallD1 } from './roofBoxWall.d1';
import { RoofAShaped } from './roofAShape';
import { RoofBoxNoRailings } from './roofBoxNoRailings';
import { LargeSideGarage } from './largeSide.garage';
import { LargeSideD2B } from './largeSide.d2b';
import { LargeSideW2 } from './largeSide.w2';
import { LargeSideD1 } from './largeSide.d1';
import { LargeSideD1W1 } from './largeSide.d1.w1';
import { LargeSideD2W2Mid } from './largeSide.d1.w2.mid';
import { LargeSideD1W2S1 } from './largeSide.d1.w2.s1';
import { RoofBoxHasRailingsNoExits } from './roofBoxHasRailingsNoExit';
import { RoofBoxHasRailingsSideExits } from './roofBoxHasRailingsSideExits';
import { LargeSideD2 } from './largeSide.d2';
import { SmallSideD2 } from './smallSide.d2';
import { SmallSideD1B } from './smallSide.d1.b';
import { SmallSideD1W1 } from './smallSide.d1.w1';
import { SmallSideGarage } from './smallSide.garage';
import { SmallSideW1 } from './smallSide.w1';
import { SmallSideW2 } from './smallSide.w2';

//stairs settings
const stepWidth = 0.1;  // Width of each step is 0.1 * floorwidth
const steps = 10;
const stepHeight = 0.1; // Height of each step is 0.1 * height of the stair
const stepDepth = 0.1; // Depth of each step is 0.1 * width of the stair
const stairSettings: IStairsSettings = {
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

export const settingsMap: { [key: string]: IWallSettings | IStairsSettings | IHouseRoofSettings } = {
    SmallSideD1,
    SmallSideD2,
    SmallSidePlain,
    SmallSideD1B,
    SmallSideD1W1,
    SmallSideGarage,
    SmallSideW1,
    SmallSideW2,
    LargeSideD1,
    LargeSideD1W1,
    LargeSideD2W2Mid,
    LargeSideD1W2S1,
    LargeSidePlain,
    LargeSideW1,
    LargeSideGarage,
    LargeSideD2,
    LargeSideD2B,
    LargeSideW2,
    stairSettings,
    RoofAShaped,
    RoofBoxNoRailings,
    RoofBoxHasRailingsSideExits,
    RoofBoxHasRailingsNoExits
};