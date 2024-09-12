import * as THREE from "three";
import { floorMaterial, normalMaterial, wallMaterial } from "../materials";
import { IBalconyMaterials, IBalconyRailing, IBalconySettings, IDoorSettings, IStairsSettings, ITopRailings, IWallSettings } from "./baseShapes";
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
const placeHolder  = 1;

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

const topFrontRailing: IBalconyRailing = {
    materials: railingMaterial,
    width: Math.abs(roofFrontWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.1,
    hasExits: false
};

const topLeftRailing: IBalconyRailing = {
    materials: railingMaterial,
    width: Math.abs(roofLateraWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.1,
    hasExits: true
};

const topBackRailing: IBalconyRailing = {
    materials: railingMaterial,
    width: Math.abs(roofFrontWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.1,
    hasExits: false
};

const topRightRailing: IBalconyRailing = {
    materials: railingMaterial,
    width: Math.abs(roofLateraWallSettings.width - roofLateraWallSettings.depth),
    height: railingHeight,
    space: railingSpace,
    railwidth: 0.1,
    hasExits: true
};

const topRailings: ITopRailings = {
    front: topFrontRailing,
    left: topLeftRailing,
    back: topBackRailing,
    right: topRightRailing
}


export const RoofBoxNoRailings: IHouseRoofSettings = {
    FrontWallSettings: roofFrontWallSettings,
    LeftWallSettings: roofLateraWallSettings,
    BackWallSettings: roofFrontWallSettings,
    RightWallSettings: roofLateraWallSettings,
    RoofBoxSettings: roofBoxSettings,
    Railings: undefined,
    IsAShaped: false,
}

