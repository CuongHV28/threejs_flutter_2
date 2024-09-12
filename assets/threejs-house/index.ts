import * as THREE from 'three';

import {
    colors,
    groundMaterial,
    floorMaterial,
    roofMaterial,
    windowMaterial,
    wallMaterial,
    woodMaterial,
    normalMaterial,
    standartMaterial,
    lambert,
    phongMaterial,
    materialsMap
} from './materials';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IHoleSettings, IWallSettings, IBalconySettings, IStairsSettings, IDoorSettings, IBalconyRailing, IBalconyMaterials, ITopRailings } from './shapes/baseShapes';



import { LargeSideD1W2S1 } from "./shapes/largeSide.d1.w2.s1";
import { LargeSidePlain } from "./shapes/largeSide.plain";
import { LargeSideW1 } from "./shapes/largeSide.w1";
import { SmallSidePlain } from "./shapes/smallSide.plain";
import { SmallSideD1 } from "./shapes/smallSide.d1";
import { SmallSideD1W1 } from "./shapes/smallSide.d1.w1";
import { RoofBoxWallPlain } from "./shapes/roofBoxWall.plain";
import { RoofBoxWallD1 } from "./shapes/roofBoxWall.d1";

import {
    Evaluator,
    EdgesHelper,
    Operation,
    OperationGroup,
    ADDITION,
    SUBTRACTION,
    Brush,
} from "three-bvh-csg";

import {
    addHoleOnWallCSG,
    addWallWithHoles,
    addFloorCustom,
    createStairs,
    addRoofTop
} from './house';
import IHouseSettings, { IHouseFloorSettings, IHouseRoofSettings } from './houses/base';
import { settingsMap } from './shapes/settingsMap';
import { resolve } from 'path/win32';


// init scene
let scene = new THREE.Scene();

scene.background = new THREE.Color(colors.background);

// init camera
const isocamera = false;

let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;

let cameraSettings = {
    position: new THREE.Vector3(),
    lookAt: new THREE.Vector3(),
    fov: 45,
    far: 250,
};


let cameraPositionFront = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(0, 7, 60),
    lookAt: new THREE.Vector3(0, 5, 0),
};
let cameraPositionAngled = {
    fov: 45,
    far: 250,
    position: new THREE.Vector3(15, 15, 20),
    lookAt: new THREE.Vector3(0, 5, 0),
};
let cameraPositionISO = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(50, 20, 50),
    lookAt: new THREE.Vector3(0, 5, 0),
};

if (isocamera) {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 20;
    camera = new THREE.OrthographicCamera(
        -d * aspect,
        d * aspect,
        d,
        -d,
        1,
        4000
    );

    camera.position.set(20, 20, 20);
    camera.rotation.order = "YXZ";
    camera.rotation.y = -Math.PI / 4;
    camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
} else {
    //cameraSettings = cameraPositionFront;
    cameraSettings = cameraPositionAngled;
    camera = new THREE.PerspectiveCamera(
        cameraSettings.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        cameraSettings.far
    );
    camera.position.copy(cameraSettings.position);
}

// init renderer
const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

// Function to set the renderer size to match the container size
function setRendererSize() {
    const container = document.querySelector('.three-container') as HTMLElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.width = `${width}px`;
    renderer.domElement.style.height = `${height}px`;
}

// Initial size setting
setRendererSize();

// Update the renderer size on window resize
window.addEventListener("resize", (event) => {
    setRendererSize();
});

// init controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.target = cameraSettings.lookAt;

// add light 
// Add ambient and directional lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);



// add a ground plane

// mat dat hinh tron
//const groundPlane = new THREE.Mesh(
//    new THREE.CylinderGeometry(30, 30, 0.1, 32),
//    groundMaterial
//);
//// The ground plane is at y = -0.5, and its height is 1
//const groundPlaneHeight = 1;
//const groundPlaneYPosition = 0;
//groundPlane.position.y = groundPlaneYPosition;
//groundPlane.castShadow = true;
//groundPlane.receiveShadow = true;
//scene.add(groundPlane);

// mat dat hinh chu nhat
const groundPlane = new THREE.Mesh(
    new THREE.BoxGeometry(100, 0.1, 40), // Width, height (thickness), and depth of the rectangle
    groundMaterial
);

const groundPlaneHeight = 1;
// The ground plane is at y = 0
const groundPlaneYPosition = 0;
groundPlane.position.y = groundPlaneYPosition;
groundPlane.castShadow = true;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

// Function to add floors based on user input
let floorObjects: { name: string; walls: { front: THREE.Group<THREE.Object3DEventMap>; left: THREE.Group<THREE.Object3DEventMap>; back: THREE.Group<THREE.Object3DEventMap>; right: THREE.Group<THREE.Object3DEventMap>; }; }[] = [];

function resolveSettings(setting: string | IWallSettings | IStairsSettings | IHouseFloorSettings): IWallSettings | IStairsSettings | IHouseFloorSettings {
    if (typeof setting === 'string') {
        return settingsMap[setting];
    }
    return setting;
}


function addHouseString(
    houseSettings: any
) {

    // Clear existing floors before adding new ones
    removeAllFloors();

    const floorThickness = 0.1;
    let groundBase = groundPlane.position.y + groundPlaneHeight / 2;
    const house = new THREE.Group();
    house.name = 'house';

    let wallMaterial = undefined;
    if (houseSettings.wallMaterial) {
        wallMaterial = materialsMap[houseSettings.wallMaterial];
    }
    
    // Create and position the semi-basement
    if (houseSettings.semiBasement) {
        const semiBasement = addFloorCustom(
            resolveSettings(houseSettings.semiBasement.FrontWallSettings) as IWallSettings,
            resolveSettings(houseSettings.semiBasement.LeftWallSettings) as IWallSettings,
            resolveSettings(houseSettings.semiBasement.RightWallSettings) as IWallSettings,
            resolveSettings(houseSettings.semiBasement.BackWallSettings) as IWallSettings,
            resolveSettings(houseSettings.semiBasement.StairSettings) as IStairsSettings,
            wallMaterial
        );
        semiBasement.position.set(0, groundPlane.position.y, 0);
        groundBase = groundPlane.position.y + (resolveSettings(houseSettings.semiBasement.FrontWallSettings) as IWallSettings).height / 2;
        house.add(semiBasement);
    }

    // Create and position the basements
    if (houseSettings.basements && houseSettings.basements.length > 0) {
        for (let i = 0; i < houseSettings.basements.length; i++) {
            const basement = addFloorCustom(
                resolveSettings(houseSettings.basements[i].FrontWallSettings) as IWallSettings,
                resolveSettings(houseSettings.basements[i].LeftWallSettings) as IWallSettings,
                resolveSettings(houseSettings.basements[i].RightWallSettings) as IWallSettings,
                resolveSettings(houseSettings.basements[i].BackWallSettings) as IWallSettings,
                resolveSettings(houseSettings.basements[i].StairSettings) as IStairsSettings,
                wallMaterial
            );
            const basementHeight = (resolveSettings(houseSettings.basements[i].FrontWallSettings) as IWallSettings).height;
            let basementY = -groundBase - (i + 0.5) * basementHeight;
            if (!houseSettings.semiBasement) {
                basementY = -groundPlane.position.y - (i + 0.5) * basementHeight;
            }
            basement.position.set(0, basementY, 0);
            house.add(basement);
        }
    }

    const firstFloorSettings: IHouseFloorSettings = {
        FrontWallSettings: resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings,
        LeftWallSettings: resolveSettings(houseSettings.firstFloor.LeftWallSettings) as IWallSettings,
        RightWallSettings: resolveSettings(houseSettings.firstFloor.RightWallSettings) as IWallSettings,
        BackWallSettings: resolveSettings(houseSettings.firstFloor.BackWallSettings) as IWallSettings,
        StairSettings: resolveSettings(houseSettings.firstFloor.StairSettings) as IStairsSettings,
    }

    const firstFloor = addFloorCustom(
        firstFloorSettings.FrontWallSettings,
        firstFloorSettings.LeftWallSettings,
        firstFloorSettings.RightWallSettings,
        firstFloorSettings.BackWallSettings,
        firstFloorSettings.StairSettings,
        wallMaterial
    );
    if (houseSettings.semiBasement) {
        firstFloor.position.set(0,
            groundBase + ((resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings).height + floorThickness) / 2,
            0);
    } else {
        firstFloor.position.set(0,
            groundPlane.position.y + ((resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings).height + floorThickness) / 2,
            0);
    }
    house.add(firstFloor);

    // Create and position the high floors
    if (houseSettings.highFloors && houseSettings.highFloors.length > 0) {
        for (let i = 0; i < houseSettings.highFloors.length; i++) {
            let yPosition = groundPlane.position.y + ((resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings).height + floorThickness);
            if (houseSettings.semiBasement) yPosition = groundBase + ((resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings).height + floorThickness);
            const newFloor = addFloorCustom(
                resolveSettings(houseSettings.highFloors[i].FrontWallSettings) as IWallSettings,
                resolveSettings(houseSettings.highFloors[i].LeftWallSettings) as IWallSettings,
                resolveSettings(houseSettings.highFloors[i].RightWallSettings) as IWallSettings,
                resolveSettings(houseSettings.highFloors[i].BackWallSettings) as IWallSettings,
                resolveSettings(houseSettings.highFloors[i].StairSettings) as IStairsSettings, wallMaterial);
            newFloor.position.set(0, yPosition + (i + 0.5) * ((resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings).height + floorThickness), 0);
            house.add(newFloor);
        }
    }

    // Create and position the roof
    const roofSettings = resolveSettings(houseSettings.roof) as IHouseRoofSettings;
    const defaultRoofHeight = roofSettings.FrontWallSettings.height;
    let topFloorSettings = houseSettings.firstFloor;
    if (houseSettings.highFloors && houseSettings.highFloors.length > 0) {
        topFloorSettings = houseSettings.highFloors[houseSettings.highFloors.length - 1];
    }
    const topFrontWallSettings = resolveSettings(topFloorSettings.FrontWallSettings) as IWallSettings;
    const topLeftWallSettings = resolveSettings(topFloorSettings.LeftWallSettings) as IWallSettings;
    const topRightWallSettings = resolveSettings(topFloorSettings.RightWallSettings) as IWallSettings;
    const topBackWallSettings = resolveSettings(topFloorSettings.BackWallSettings) as IWallSettings;

    const roofWallHeight = defaultRoofHeight * topFrontWallSettings.height;

    let realRailings: ITopRailings = undefined;
    if (roofSettings.Railings) {
        const topFrontRailing = roofSettings.Railings.front;
        const topLeftRailing = roofSettings.Railings.left;
        const topBackRailing = roofSettings.Railings.back;
        const topRightRailing = roofSettings.Railings.right;

        topFrontRailing.width = Math.abs(topFrontWallSettings.width - topLeftWallSettings.depth);
        topLeftRailing.width = Math.abs(topLeftWallSettings.width - topLeftWallSettings.depth);
        topBackRailing.width = Math.abs(topFrontWallSettings.width - topLeftWallSettings.depth);
        topRightRailing.width = Math.abs(topLeftWallSettings.width - topLeftWallSettings.depth);

        topFrontRailing.height = Math.abs(roofSettings.RoofBoxSettings.FrontWallSettings.height - roofWallHeight);
        topLeftRailing.height = Math.abs(roofSettings.RoofBoxSettings.LeftWallSettings.height - roofWallHeight);
        topBackRailing.height = Math.abs(roofSettings.RoofBoxSettings.BackWallSettings.height - roofWallHeight);
        topRightRailing.height = Math.abs(roofSettings.RoofBoxSettings.RightWallSettings.height - roofWallHeight);

        realRailings = {
            front: topFrontRailing,
            left: topLeftRailing,
            back: topBackRailing,
            right: topRightRailing
        };

        if (roofSettings.Railings.flat) {
            const topFlatRailing = roofSettings.Railings.flat;
            topFlatRailing.width = Math.abs(topFrontWallSettings.width + topLeftWallSettings.depth);
            topFlatRailing.depth = Math.abs(roofSettings.RoofBoxSettings.FrontWallSettings.width + roofSettings.RoofBoxSettings.LeftWallSettings.depth);
            realRailings.flat = topFlatRailing;
        }
    }

    let roofWallMaterial = roofSettings.FrontWallSettings.material;
    if (wallMaterial) {
        roofWallMaterial = wallMaterial
    }

    const roofToCreate: IHouseRoofSettings = {
        FrontWallSettings: {
            width: topFrontWallSettings.width,
            height: roofWallHeight,
            depth: roofSettings.FrontWallSettings.depth * topFrontWallSettings.depth,
            material: roofWallMaterial,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
        },
        LeftWallSettings: {
            width: topLeftWallSettings.width,
            height: roofWallHeight,
            depth: roofSettings.LeftWallSettings.depth * topLeftWallSettings.depth,
            material: roofWallMaterial,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
        },
        BackWallSettings: {
            width: topBackWallSettings.width,
            height: roofWallHeight,
            depth: roofSettings.BackWallSettings.depth * topBackWallSettings.depth,
            material: roofWallMaterial,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
        },
        RightWallSettings: {
            width: topRightWallSettings.width,
            height: roofWallHeight,
            depth: roofSettings.RightWallSettings.depth * topRightWallSettings.depth,
            material: roofWallMaterial,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
        },
        RoofBoxSettings: roofSettings.RoofBoxSettings,
        Railings: realRailings,
        IsAShaped: roofSettings.IsAShaped
    };

    const houseRoof = addRoofTop(roofToCreate, wallMaterial);
    let roofPositionY = groundPlane.position.y + (resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings).height + floorThickness + roofWallHeight / 2;
    if (houseSettings.semiBasement) {
        roofPositionY = groundBase + (resolveSettings(houseSettings.firstFloor.FrontWallSettings) as IWallSettings).height + floorThickness + roofWallHeight / 2;
    }
    if (houseSettings.highFloors && houseSettings.highFloors.length > 0) {
        // If there are high floors, position the roof on top of the last high floor
        const lastHighFloor = houseSettings.highFloors[houseSettings.highFloors.length - 1];
        const lastHighFloorSettings: IHouseFloorSettings = {
            FrontWallSettings: resolveSettings(lastHighFloor.FrontWallSettings) as IWallSettings,
            LeftWallSettings: resolveSettings(lastHighFloor.LeftWallSettings) as IWallSettings,
            RightWallSettings: resolveSettings(lastHighFloor.RightWallSettings) as IWallSettings,
            BackWallSettings: resolveSettings(lastHighFloor.BackWallSettings) as IWallSettings,
            StairSettings: resolveSettings(lastHighFloor.StairSettings) as IStairsSettings,
        }
        roofPositionY += houseSettings.highFloors.length * (lastHighFloorSettings.FrontWallSettings.height + floorThickness);
    }
    houseRoof.position.set(0, roofPositionY, 0); 
    house.add(houseRoof);

    scene.add(house);
    adjustCameraToFitHouse(house);
}
(window as any).addHouseString = addHouseString;

// Function to reset the scene
function resetHouse() {
    removeAllFloors();
}

(window as any).resetHouse = resetHouse;


let currentlyDisplayedWall: THREE.Mesh = null;

function handleWallClick(wall: THREE.Mesh) {
    // If there's already a wall displayed, remove it from the scene
    if (currentlyDisplayedWall) {
        scene.remove(currentlyDisplayedWall);
        currentlyDisplayedWall = null; // Reset the reference
    }

    // Clone the selected wall and adjust its position
    const wallCopy = wall.clone();
    wallCopy.position.y = 4; // Adjust the position as needed
    wallCopy.position.z += 10; // Adjust the position as needed

    // Add the cloned wall to the scene
    scene.add(wallCopy);

    // Update the global variable to reference the newly added cloned wall
    currentlyDisplayedWall = wallCopy;
}

// Function to remove all floors from the scene
function removeAllFloors() {
    // Remove all floors from the scene
    const floors = scene.children.filter(child => child instanceof THREE.Group && child.name !== 'GroundPlane');
    floors.forEach(floor => scene.remove(floor));
    floorObjects = []; // Clear the global list of floor objects
}


// screenshot
function captureScreenshot() {
    renderer.render(scene, camera);
    const dataURL = renderer.domElement.toDataURL('image/png');
    return dataURL;
}

function adjustCameraToFitHouse(house: THREE.Object3D, angleInDegrees: number = 0, axis: 'x' | 'y' = 'y') {
    const angleInRadians = degreesToRadians(angleInDegrees);
    const boundingBox = new THREE.Box3().setFromObject(house);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    if (camera instanceof THREE.PerspectiveCamera) {
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

        cameraZ *= 1.5; // Add some padding to the camera distance

        let cameraX, cameraY, cameraZPosition;
        if (axis === 'y') {
            cameraX = center.x + cameraZ * Math.sin(angleInRadians);
            cameraY = center.y;
            cameraZPosition = center.z + cameraZ * Math.cos(angleInRadians);
        } else {
            cameraX = center.x;
            cameraY = center.y + cameraZ * Math.sin(angleInRadians);
            cameraZPosition = center.z + cameraZ * Math.cos(angleInRadians);
        }

        camera.position.set(cameraX, cameraY, cameraZPosition);
        camera.lookAt(center);
    } else if (camera instanceof THREE.OrthographicCamera) {
        const aspect = window.innerWidth / window.innerHeight;
        const d = Math.max(size.x, size.y) / 2;

        camera.left = -d * aspect;
        camera.right = d * aspect;
        camera.top = d;
        camera.bottom = -d;

        let cameraX, cameraY, cameraZPosition;
        if (axis === 'y') {
            cameraX = center.x + d * 2 * Math.sin(angleInRadians);
            cameraY = center.y;
            cameraZPosition = center.z + d * 2 * Math.cos(angleInRadians);
        } else {
            cameraX = center.x;
            cameraY = center.y + d * 2 * Math.sin(angleInRadians);
            cameraZPosition = center.z + d * 2 * Math.cos(angleInRadians);
        }

        camera.position.set(cameraX, cameraY, cameraZPosition);
        camera.lookAt(center);
    }

    // Update the camera's projection matrix
    camera.updateProjectionMatrix();

    // Update the angle display
    updateCameraAngleDisplay();
}

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Update the angle display
function updateCameraAngleDisplay() {
    const angleDisplay = document.getElementById('camera-angle-display');
    if (angleDisplay) {
        const cameraPosition = camera.position.clone().normalize();
        const angle = Math.atan2(cameraPosition.x, cameraPosition.z);
        angleDisplay.innerText = `Angle: ${(angle * 180 / Math.PI).toFixed(2)}°`;
    }
}

function handleScreenshot() {
    const house = scene.getObjectByName('house'); // Assuming the house object is named 'house'
    if (house) {
        const screenshots = [];

        // Capture front view
        viewFront();
        screenshots.push({
            "MatNhaId": 1,
            "Side": 'Mặt trước',
            "Data": captureScreenshot()
        });

        // Capture left side view
        viewLeftSide();
        screenshots.push({
            "MatNhaId": 3,
            "Side": 'Mặt trái',
            "Data": captureScreenshot()
        });

        // Capture back view
        viewBack();
        screenshots.push({
            "MatNhaId": 4,
            "Side": 'Mặt sau',
            "Data": captureScreenshot()
        });

        // Capture right side view
        viewRightSide();
        screenshots.push({
            "MatNhaId": 2,
            "Side": 'Mặt bên phải',
            "Data": captureScreenshot()
        });
        resetPOV();
        return screenshots;
    } else {
        console.error('House object not found in the scene.');
    }
}
(window as any).handleScreenshot = handleScreenshot;

function resetPOV() {
    const house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house);
}
(window as any).resetPOV = resetPOV;

// View from the front
function viewFront() {
    const house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, 0);
}
(window as any).viewFront = viewFront;


// View from the left side
function viewLeftSide() {
    const house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, -90, 'y');
}
(window as any).viewLeftSide = viewLeftSide;


// View from the back
function viewBack() {
    const house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, 180);
}
(window as any).viewBack = viewBack;

// View from the right side
function viewRightSide() {
    const house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, 90);
}
(window as any).viewRightSide = viewRightSide;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // Update the camera angle display
    updateCameraAngleDisplay();
}
animate();