import * as THREE from "three";
import { floorMaterial, normalMaterial, wallMaterial } from "../materials";
import { IBalconyGrid, IBalconyMaterials, IBalconyRailing, IBalconySettings, IDoorSettings, IStairsSettings, ITopRailings, IWallSettings } from "./baseShapes";
import { IHouseFloorSettings, IHouseRoofSettings } from "../houses/base";
import { RoofBoxWallPlain } from "./roofBoxWall.plain";
import { RoofBoxWallD1 } from "./roofBoxWall.d1";

const roofHeight = 0.2;
const railingHeight = 1 - roofHeight;
const railingSpace = 0.3;
const railingMaterial: IBalconyMaterials = {
    default: new THREE.MeshLambertMaterial({ color: 0x00ff00 }), // Green railing
    alu: new THREE.MeshLambertMaterial({ color: 0x111111 }) // Dark grey railing
}
const placeHolder = 1;

const roofFrontWallSettings = {
    width: placeHolder,
    height: roofHeight,
    depth: placeHolder,
    material: wallMaterial,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
};
const roofLateraWallSettings = {
    width: placeHolder,
    height: roofHeight,
    depth: placeHolder,
    material: wallMaterial,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
};

const roofBoxSettings: IHouseFloorSettings = {
    FrontWallSettings: RoofBoxWallPlain,
    LeftWallSettings: RoofBoxWallD1,
    RightWallSettings: RoofBoxWallPlain,
    BackWallSettings: RoofBoxWallPlain,
};

const topFrontRailing: IBalconyGrid = {
    materials: railingMaterial,
    width: Math.abs(roofFrontWallSettings.width + 2 * roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};

const topLeftRailing: IBalconyGrid = {
    materials: railingMaterial,
    width: Math.abs(roofLateraWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: true
};

const topBackRailing: IBalconyGrid = {
    materials: railingMaterial,
    width: Math.abs(roofFrontWallSettings.width + 2 * roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};

const topRightRailing: IBalconyGrid = {
    materials: railingMaterial,
    width: Math.abs(roofLateraWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};

const flatRailing: IBalconyGrid = {
    materials: railingMaterial,
    space: railingSpace,
    railwidth: 0.01,
    hasExits: false
};

const topRailings: ITopRailings = {
    front: topFrontRailing,
    left: topLeftRailing,
    back: topBackRailing,
    right: topRightRailing,
    flat: flatRailing
}


export const RoofBoxHasRailingsSideExits: IHouseRoofSettings = {
    FrontWallSettings: roofFrontWallSettings,
    LeftWallSettings: roofLateraWallSettings,
    BackWallSettings: roofFrontWallSettings,
    RightWallSettings: roofLateraWallSettings,
    RoofBoxSettings: roofBoxSettings,
    Railings: topRailings,
    IsAShaped: false,
}

