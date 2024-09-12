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
var THREE = __importStar(require("three"));
var materials_1 = require("./materials");
var OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
var house_1 = require("./house");
var settingsMap_1 = require("./shapes/settingsMap");
// init scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(materials_1.colors.background);
// init camera
var isocamera = false;
var camera;
var cameraSettings = {
    position: new THREE.Vector3(),
    lookAt: new THREE.Vector3(),
    fov: 45,
    far: 250,
};
var cameraPositionFront = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(0, 7, 60),
    lookAt: new THREE.Vector3(0, 5, 0),
};
var cameraPositionAngled = {
    fov: 45,
    far: 250,
    position: new THREE.Vector3(15, 15, 20),
    lookAt: new THREE.Vector3(0, 5, 0),
};
var cameraPositionISO = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(50, 20, 50),
    lookAt: new THREE.Vector3(0, 5, 0),
};
if (isocamera) {
    var aspect = window.innerWidth / window.innerHeight;
    var d = 20;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 4000);
    camera.position.set(20, 20, 20);
    camera.rotation.order = "YXZ";
    camera.rotation.y = -Math.PI / 4;
    camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
}
else {
    //cameraSettings = cameraPositionFront;
    cameraSettings = cameraPositionAngled;
    camera = new THREE.PerspectiveCamera(cameraSettings.fov, window.innerWidth / window.innerHeight, 0.1, cameraSettings.far);
    camera.position.copy(cameraSettings.position);
}
// init renderer
var canvas = document.querySelector('.webgl');
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// Function to set the renderer size to match the container size
function setRendererSize() {
    var container = document.querySelector('.three-container');
    var width = container.clientWidth;
    var height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.width = "".concat(width, "px");
    renderer.domElement.style.height = "".concat(height, "px");
}
// Initial size setting
setRendererSize();
// Update the renderer size on window resize
window.addEventListener("resize", function (event) {
    setRendererSize();
});
// init controls
var controls = new OrbitControls_1.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.target = cameraSettings.lookAt;
// add light 
// Add ambient and directional lights to the scene
var ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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
var groundPlane = new THREE.Mesh(new THREE.BoxGeometry(100, 0.1, 40), // Width, height (thickness), and depth of the rectangle
materials_1.groundMaterial);
var groundPlaneHeight = 1;
// The ground plane is at y = 0
var groundPlaneYPosition = 0;
groundPlane.position.y = groundPlaneYPosition;
groundPlane.castShadow = true;
groundPlane.receiveShadow = true;
scene.add(groundPlane);
// Function to add floors based on user input
var floorObjects = [];
function resolveSettings(setting) {
    if (typeof setting === 'string') {
        return settingsMap_1.settingsMap[setting];
    }
    return setting;
}
function addHouseString(houseSettings) {
    // Clear existing floors before adding new ones
    removeAllFloors();
    var floorThickness = 0.1;
    var groundBase = groundPlane.position.y + groundPlaneHeight / 2;
    var house = new THREE.Group();
    house.name = 'house';
    var wallMaterial = undefined;
    if (houseSettings.wallMaterial) {
        wallMaterial = materials_1.materialsMap[houseSettings.wallMaterial];
    }
    // Create and position the semi-basement
    if (houseSettings.semiBasement) {
        var semiBasement = (0, house_1.addFloorCustom)(resolveSettings(houseSettings.semiBasement.FrontWallSettings), resolveSettings(houseSettings.semiBasement.LeftWallSettings), resolveSettings(houseSettings.semiBasement.RightWallSettings), resolveSettings(houseSettings.semiBasement.BackWallSettings), resolveSettings(houseSettings.semiBasement.StairSettings), wallMaterial);
        semiBasement.position.set(0, groundPlane.position.y, 0);
        groundBase = groundPlane.position.y + resolveSettings(houseSettings.semiBasement.FrontWallSettings).height / 2;
        house.add(semiBasement);
    }
    // Create and position the basements
    if (houseSettings.basements && houseSettings.basements.length > 0) {
        for (var i = 0; i < houseSettings.basements.length; i++) {
            var basement = (0, house_1.addFloorCustom)(resolveSettings(houseSettings.basements[i].FrontWallSettings), resolveSettings(houseSettings.basements[i].LeftWallSettings), resolveSettings(houseSettings.basements[i].RightWallSettings), resolveSettings(houseSettings.basements[i].BackWallSettings), resolveSettings(houseSettings.basements[i].StairSettings), wallMaterial);
            var basementHeight = resolveSettings(houseSettings.basements[i].FrontWallSettings).height;
            var basementY = -groundBase - (i + 0.5) * basementHeight;
            if (!houseSettings.semiBasement) {
                basementY = -groundPlane.position.y - (i + 0.5) * basementHeight;
            }
            basement.position.set(0, basementY, 0);
            house.add(basement);
        }
    }
    var firstFloorSettings = {
        FrontWallSettings: resolveSettings(houseSettings.firstFloor.FrontWallSettings),
        LeftWallSettings: resolveSettings(houseSettings.firstFloor.LeftWallSettings),
        RightWallSettings: resolveSettings(houseSettings.firstFloor.RightWallSettings),
        BackWallSettings: resolveSettings(houseSettings.firstFloor.BackWallSettings),
        StairSettings: resolveSettings(houseSettings.firstFloor.StairSettings),
    };
    var firstFloor = (0, house_1.addFloorCustom)(firstFloorSettings.FrontWallSettings, firstFloorSettings.LeftWallSettings, firstFloorSettings.RightWallSettings, firstFloorSettings.BackWallSettings, firstFloorSettings.StairSettings, wallMaterial);
    if (houseSettings.semiBasement) {
        firstFloor.position.set(0, groundBase + (resolveSettings(houseSettings.firstFloor.FrontWallSettings).height + floorThickness) / 2, 0);
    }
    else {
        firstFloor.position.set(0, groundPlane.position.y + (resolveSettings(houseSettings.firstFloor.FrontWallSettings).height + floorThickness) / 2, 0);
    }
    house.add(firstFloor);
    // Create and position the high floors
    if (houseSettings.highFloors && houseSettings.highFloors.length > 0) {
        for (var i = 0; i < houseSettings.highFloors.length; i++) {
            var yPosition = groundPlane.position.y + (resolveSettings(houseSettings.firstFloor.FrontWallSettings).height + floorThickness);
            if (houseSettings.semiBasement)
                yPosition = groundBase + (resolveSettings(houseSettings.firstFloor.FrontWallSettings).height + floorThickness);
            var newFloor = (0, house_1.addFloorCustom)(resolveSettings(houseSettings.highFloors[i].FrontWallSettings), resolveSettings(houseSettings.highFloors[i].LeftWallSettings), resolveSettings(houseSettings.highFloors[i].RightWallSettings), resolveSettings(houseSettings.highFloors[i].BackWallSettings), resolveSettings(houseSettings.highFloors[i].StairSettings), wallMaterial);
            newFloor.position.set(0, yPosition + (i + 0.5) * (resolveSettings(houseSettings.firstFloor.FrontWallSettings).height + floorThickness), 0);
            house.add(newFloor);
        }
    }
    // Create and position the roof
    var roofSettings = resolveSettings(houseSettings.roof);
    var defaultRoofHeight = roofSettings.FrontWallSettings.height;
    var topFloorSettings = houseSettings.firstFloor;
    if (houseSettings.highFloors && houseSettings.highFloors.length > 0) {
        topFloorSettings = houseSettings.highFloors[houseSettings.highFloors.length - 1];
    }
    var topFrontWallSettings = resolveSettings(topFloorSettings.FrontWallSettings);
    var topLeftWallSettings = resolveSettings(topFloorSettings.LeftWallSettings);
    var topRightWallSettings = resolveSettings(topFloorSettings.RightWallSettings);
    var topBackWallSettings = resolveSettings(topFloorSettings.BackWallSettings);
    var roofWallHeight = defaultRoofHeight * topFrontWallSettings.height;
    var realRailings = undefined;
    if (roofSettings.Railings) {
        var topFrontRailing = roofSettings.Railings.front;
        var topLeftRailing = roofSettings.Railings.left;
        var topBackRailing = roofSettings.Railings.back;
        var topRightRailing = roofSettings.Railings.right;
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
            var topFlatRailing = roofSettings.Railings.flat;
            topFlatRailing.width = Math.abs(topFrontWallSettings.width + topLeftWallSettings.depth);
            topFlatRailing.depth = Math.abs(roofSettings.RoofBoxSettings.FrontWallSettings.width + roofSettings.RoofBoxSettings.LeftWallSettings.depth);
            realRailings.flat = topFlatRailing;
        }
    }
    var roofWallMaterial = roofSettings.FrontWallSettings.material;
    if (wallMaterial) {
        roofWallMaterial = wallMaterial;
    }
    var roofToCreate = {
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
    var houseRoof = (0, house_1.addRoofTop)(roofToCreate, wallMaterial);
    var roofPositionY = groundPlane.position.y + resolveSettings(houseSettings.firstFloor.FrontWallSettings).height + floorThickness + roofWallHeight / 2;
    if (houseSettings.semiBasement) {
        roofPositionY = groundBase + resolveSettings(houseSettings.firstFloor.FrontWallSettings).height + floorThickness + roofWallHeight / 2;
    }
    if (houseSettings.highFloors && houseSettings.highFloors.length > 0) {
        // If there are high floors, position the roof on top of the last high floor
        var lastHighFloor = houseSettings.highFloors[houseSettings.highFloors.length - 1];
        var lastHighFloorSettings = {
            FrontWallSettings: resolveSettings(lastHighFloor.FrontWallSettings),
            LeftWallSettings: resolveSettings(lastHighFloor.LeftWallSettings),
            RightWallSettings: resolveSettings(lastHighFloor.RightWallSettings),
            BackWallSettings: resolveSettings(lastHighFloor.BackWallSettings),
            StairSettings: resolveSettings(lastHighFloor.StairSettings),
        };
        roofPositionY += houseSettings.highFloors.length * (lastHighFloorSettings.FrontWallSettings.height + floorThickness);
    }
    houseRoof.position.set(0, roofPositionY, 0);
    house.add(houseRoof);
    scene.add(house);
    adjustCameraToFitHouse(house);
}
window.addHouseString = addHouseString;
// Function to reset the scene
function resetHouse() {
    removeAllFloors();
}
window.resetHouse = resetHouse;
var currentlyDisplayedWall = null;
function handleWallClick(wall) {
    // If there's already a wall displayed, remove it from the scene
    if (currentlyDisplayedWall) {
        scene.remove(currentlyDisplayedWall);
        currentlyDisplayedWall = null; // Reset the reference
    }
    // Clone the selected wall and adjust its position
    var wallCopy = wall.clone();
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
    var floors = scene.children.filter(function (child) { return child instanceof THREE.Group && child.name !== 'GroundPlane'; });
    floors.forEach(function (floor) { return scene.remove(floor); });
    floorObjects = []; // Clear the global list of floor objects
}
// screenshot
function captureScreenshot() {
    renderer.render(scene, camera);
    var dataURL = renderer.domElement.toDataURL('image/png');
    return dataURL;
}
function adjustCameraToFitHouse(house, angleInDegrees, axis) {
    if (angleInDegrees === void 0) { angleInDegrees = 0; }
    if (axis === void 0) { axis = 'y'; }
    var angleInRadians = degreesToRadians(angleInDegrees);
    var boundingBox = new THREE.Box3().setFromObject(house);
    var center = boundingBox.getCenter(new THREE.Vector3());
    var size = boundingBox.getSize(new THREE.Vector3());
    if (camera instanceof THREE.PerspectiveCamera) {
        var maxDim = Math.max(size.x, size.y, size.z);
        var fov = camera.fov * (Math.PI / 180);
        var cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Add some padding to the camera distance
        var cameraX = void 0, cameraY = void 0, cameraZPosition = void 0;
        if (axis === 'y') {
            cameraX = center.x + cameraZ * Math.sin(angleInRadians);
            cameraY = center.y;
            cameraZPosition = center.z + cameraZ * Math.cos(angleInRadians);
        }
        else {
            cameraX = center.x;
            cameraY = center.y + cameraZ * Math.sin(angleInRadians);
            cameraZPosition = center.z + cameraZ * Math.cos(angleInRadians);
        }
        camera.position.set(cameraX, cameraY, cameraZPosition);
        camera.lookAt(center);
    }
    else if (camera instanceof THREE.OrthographicCamera) {
        var aspect = window.innerWidth / window.innerHeight;
        var d = Math.max(size.x, size.y) / 2;
        camera.left = -d * aspect;
        camera.right = d * aspect;
        camera.top = d;
        camera.bottom = -d;
        var cameraX = void 0, cameraY = void 0, cameraZPosition = void 0;
        if (axis === 'y') {
            cameraX = center.x + d * 2 * Math.sin(angleInRadians);
            cameraY = center.y;
            cameraZPosition = center.z + d * 2 * Math.cos(angleInRadians);
        }
        else {
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
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
// Update the angle display
function updateCameraAngleDisplay() {
    var angleDisplay = document.getElementById('camera-angle-display');
    if (angleDisplay) {
        var cameraPosition = camera.position.clone().normalize();
        var angle = Math.atan2(cameraPosition.x, cameraPosition.z);
        angleDisplay.innerText = "Angle: ".concat((angle * 180 / Math.PI).toFixed(2), "\u00B0");
    }
}
function handleScreenshot() {
    var house = scene.getObjectByName('house'); // Assuming the house object is named 'house'
    if (house) {
        var screenshots = [];
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
    }
    else {
        console.error('House object not found in the scene.');
    }
}
window.handleScreenshot = handleScreenshot;
function resetPOV() {
    var house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house);
}
window.resetPOV = resetPOV;
// View from the front
function viewFront() {
    var house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, 0);
}
window.viewFront = viewFront;
// View from the left side
function viewLeftSide() {
    var house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, -90, 'y');
}
window.viewLeftSide = viewLeftSide;
// View from the back
function viewBack() {
    var house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, 180);
}
window.viewBack = viewBack;
// View from the right side
function viewRightSide() {
    var house = scene.getObjectByName('house');
    adjustCameraToFitHouse(house, 90);
}
window.viewRightSide = viewRightSide;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // Update the camera angle display
    updateCameraAngleDisplay();
}
animate();
//# sourceMappingURL=index.js.map