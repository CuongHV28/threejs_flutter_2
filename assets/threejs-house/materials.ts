import { DoubleSide, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshStandardMaterial } from "three";

const colors = {
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

const normalMaterial = new MeshNormalMaterial();
const standartMaterial = new MeshStandardMaterial({ color: 0x666666 });
const lambert = new MeshLambertMaterial({ color: "#fff" });
const phongMaterial = new MeshPhongMaterial({ color: 0x0908ef });

let groundMaterial = new MeshStandardMaterial({
    color: colors.ground,
    transparent: true,
    opacity: 0.5,
});

let floorMaterial = new MeshLambertMaterial({
    color: colors.floor,
    side: DoubleSide
});
const roofMaterial = new MeshStandardMaterial({
    color: colors.roof,
    side: DoubleSide,
    metalness: 0.2,
    roughness: 0.5
});
let windowMaterial = new MeshStandardMaterial({ color: colors.window });

let wallMaterial = new MeshLambertMaterial({
    color: colors.wall1,
    side: DoubleSide
});

let wallMaterial2 = new MeshLambertMaterial({
    color: colors.wall2,
    side: DoubleSide
});

let wallMaterial3 = new MeshLambertMaterial({
    color: colors.wall3,
    side: DoubleSide
});

let woodMaterial = new MeshStandardMaterial({
    color: colors.wood,
    metalness: 0,
    roughness: 0.5
});


const materialsMap = {
    groundMaterial,
    floorMaterial,
    roofMaterial,
    windowMaterial,
    wallMaterial,
    wallMaterial2,
    wallMaterial3,
    woodMaterial,
    normalMaterial,
    standartMaterial,
    lambert,
    phongMaterial
};

export {
    colors,
    materialsMap,
    normalMaterial,
    standartMaterial,
    lambert,
    phongMaterial,
    groundMaterial,
    floorMaterial,
    roofMaterial,
    windowMaterial,
    wallMaterial,
    wallMaterial2,
    wallMaterial3,
    woodMaterial
};