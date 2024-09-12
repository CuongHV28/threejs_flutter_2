import * as THREE from "three";
import { floorMaterial, normalMaterial, wallMaterial } from "../materials";
import { IBalconySettings, IDoorSettings, IStairsSettings, IWallSettings } from "./baseShapes";

const wallWidth = 10;
const wallHeight = 2;
const wallDepth = 0.25;

const doorSettings1 : IDoorSettings = {
    width: 0.15,
    height: 0.5,
    depth: 1,
    offsetLeft: 0.3,
    offsetGround: 0,
    balcony: undefined,
};

const doorSettings2 : IDoorSettings = {
    width: 0.1,
    height: 0.5,
    depth: 1,
    offsetLeft: 0.8,
    offsetGround: 0,
    balcony: undefined,
};


export const LargeSideD2: IWallSettings = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: wallMaterial,
    doors: [doorSettings1, doorSettings2],
    windows: undefined,
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};