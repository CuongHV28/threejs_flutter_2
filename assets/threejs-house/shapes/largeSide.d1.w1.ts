import * as THREE from "three";
import { floorMaterial, normalMaterial, wallMaterial } from "../materials";
import { IBalconySettings, IDoorSettings, IStairsSettings, IWallSettings } from "./baseShapes";

const wallWidth = 10;
const wallHeight = 2;
const wallDepth = 0.25;

const windowSettings1 : IDoorSettings = {
    width: 0.2,
    height: 0.3,
    depth: 1,
    offsetLeft: 0.3,
    offsetGround: 0.6,
};

const doorSettings1 : IDoorSettings = {
    width: 0.15,
    height: 0.6,
    depth: 1,
    offsetLeft: 0.7,
    offsetGround: 0,
    balcony: undefined,
};


export const LargeSideD1W1: IWallSettings = {
    width: wallWidth,
    height: wallHeight,
    depth: wallDepth,
    material: wallMaterial,
    doors: [doorSettings1],
    windows: [windowSettings1],
    stairs: undefined,
    position: {
        x: 0,
        y: 0,
        z: 0
    }
};