import * as THREE from "three";
import { floorMaterial, normalMaterial, wallMaterial } from "../materials";
import { IBalconySettings, IDoorSettings, IStairsSettings, IWallSettings } from "./baseShapes";

const wallWidth = 10;
const wallHeight = 2;
const wallDepth = 0.25;

const balconySettings1 : IBalconySettings = {
    width: 3,
    height: 0.1,
    depth: 2,
    isFullLength: true,
    material: normalMaterial,
};


const doorSettings1 : IDoorSettings = {
    width: 0.15,
    height: 0.5,
    depth: 1,
    offsetLeft: 0.3,
    offsetGround: 0,
    balcony: balconySettings1,
};

const doorSettings2 : IDoorSettings = {
    width: 0.1,
    height: 0.5,
    depth: 1,
    offsetLeft: 0.8,
    offsetGround: 0,
    balcony: undefined,
};


const floorThickness = 0.1; // Thickness of the floor
//stairs settings
const steps = 10;
const stepWidth = 1;
const stepHeight = (wallHeight - floorThickness) / steps;
const stairSettings: IStairsSettings = {
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

export const LargeSideD2B: IWallSettings = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: wallMaterial,
    doors: [doorSettings1, doorSettings2],
    windows: undefined,
    stairs: stairSettings,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};