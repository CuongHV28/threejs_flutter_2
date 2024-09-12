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
exports.balconyRailingGrid = exports.balconyRaling = void 0;
exports.addHoleOnWallCSG = addHoleOnWallCSG;
exports.addWallWithHoles = addWallWithHoles;
exports.addFloorCustom = addFloorCustom;
exports.createStairs = createStairs;
exports.addRoofTop = addRoofTop;
//function to add a floor
var THREE = __importStar(require("three"));
var materials_1 = require("./materials");
var three_csg_ts_1 = require("three-csg-ts");
var three_bvh_csg_1 = require("three-bvh-csg");
var BufferGeometryUtils_js_1 = require("three/examples/jsm/utils/BufferGeometryUtils.js");
function addHoleOnWallCSG(wallMesh, holes, wallSettings, material) {
    var wallCSG = three_csg_ts_1.CSG.fromMesh(wallMesh);
    holes.forEach(function (hole) {
        var holeWidth = hole.width * wallSettings.width;
        var holeHeight = hole.height * wallSettings.height;
        var holeDepth = wallSettings.depth * 1.1;
        var holeX = wallMesh.position.x - wallSettings.width / 2 + hole.offsetLeft * wallSettings.width;
        var holeY = wallMesh.position.y - wallSettings.height / 2 + holeHeight / 2 + hole.offsetGround * wallSettings.height;
        var holeZ = wallMesh.position.z;
        var holeMesh = new THREE.Mesh(new THREE.BoxGeometry(holeWidth, holeHeight, holeDepth), material);
        var holeMatrix = new THREE.Matrix4();
        holeMatrix.makeTranslation(holeX, holeY, holeZ);
        holeMesh.applyMatrix4(holeMatrix);
        var holeCSG = three_csg_ts_1.CSG.fromMesh(holeMesh);
        wallCSG = wallCSG.subtract(holeCSG);
    });
    return wallCSG.toMesh(new THREE.Matrix4());
}
// CSG
var csgEvaluator;
csgEvaluator = new three_bvh_csg_1.Evaluator();
csgEvaluator.attributes = ["position", "normal"];
csgEvaluator.useGroups = false;
var frame = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 2 : _b, _c = _a.height, height = _c === void 0 ? 2 : _c, _d = _a.framewidth, framewidth = _d === void 0 ? [0.05, 0.05, 0.05, 0.05] : _d, _e = _a.depth, depth = _e === void 0 ? 5 : _e;
    var frame = new three_bvh_csg_1.Operation(new THREE.BoxGeometry(width, height, depth));
    var hole = new three_bvh_csg_1.Operation(new THREE.BoxGeometry(width - framewidth[1] - framewidth[3], height - framewidth[0] - framewidth[2], depth * 2));
    hole.operation = three_bvh_csg_1.SUBTRACTION;
    hole.position.y = (framewidth[2] - framewidth[0]) / 2;
    hole.position.x = (framewidth[3] - framewidth[1]) / 2;
    frame.add(hole);
    var result = csgEvaluator.evaluateHierarchy(frame);
    result.castShadow = true;
    result.receiveShadow = true;
    return result;
};
// balcony railing
var balconyRaling = function (_a) {
    var _b = _a.height, height = _b === void 0 ? 1 : _b, _c = _a.width, width = _c === void 0 ? 2 : _c, _d = _a.space, space = _d === void 0 ? 0.1 : _d, _e = _a.railwidth, railwidth = _e === void 0 ? 0.06 : _e, _f = _a.hasExits, hasExits = _f === void 0 ? false : _f, materials = _a.materials;
    var g = new THREE.Group();
    var count = Math.round(width / space);
    space = width / count;
    var doorStart, doorEnd;
    if (hasExits) {
        doorStart = Math.floor(0.25 * count);
        doorEnd = Math.floor(0.5 * count);
    }
    var toprail = new THREE.Mesh(new THREE.BoxGeometry(width + railwidth, railwidth, railwidth), materials.alu || materials.default);
    toprail.position.x = width / 2;
    toprail.position.y = height;
    toprail.position.z = 0;
    toprail.receiveShadow = true;
    toprail.castShadow = true;
    g.add(toprail);
    toprail.matrixAutoUpdate = false;
    toprail.updateMatrix();
    for (var i = 0; i <= count; i++) {
        var rail = new THREE.Mesh(new THREE.BoxGeometry(0.02, height, 0.02), materials.alu || materials.default);
        if (hasExits && i >= doorStart && i <= doorEnd) {
            var doorSettings = {
                width: 0.3,
                height: 0.6,
                depth: railwidth,
                offsetLeft: 0.6,
                offsetGround: 0,
                balcony: undefined,
            };
            var holeWidth = doorSettings.width * width;
            var holeHeight = doorSettings.height * height;
            var holeDepth = railwidth * 1.1;
            var holeX = rail.position.x - width / 2 + doorSettings.offsetLeft * width;
            var holeY = rail.position.y - height / 2 + holeHeight / 2 + doorSettings.offsetGround * height;
            var holeZ = rail.position.z;
            var holeMesh = new THREE.Mesh(new THREE.BoxGeometry(holeWidth, holeHeight, holeDepth), materials.default);
            var holeMatrix = new THREE.Matrix4();
            holeMatrix.makeTranslation(holeX, holeY, holeZ);
            holeMesh.applyMatrix4(holeMatrix);
            var holeCSG = three_csg_ts_1.CSG.fromMesh(holeMesh);
            var railingCSG = three_csg_ts_1.CSG.fromMesh(rail);
            var resultCSG = railingCSG.subtract(holeCSG);
            var resultMesh = three_csg_ts_1.CSG.toMesh(resultCSG, new THREE.Matrix4(), materials.alu || materials.default);
            resultMesh.geometry.computeVertexNormals();
            resultMesh.receiveShadow = true;
            resultMesh.castShadow = true;
            rail.geometry.dispose();
            rail.geometry = resultMesh.geometry;
            rail.material = resultMesh.material;
            var topDoorRail = new THREE.Mesh(new THREE.BoxGeometry(width / 4, railwidth, railwidth), materials.alu || materials.default);
            topDoorRail.position.x = holeX - 2 * space;
            topDoorRail.position.y = holeY + holeHeight / 2;
            topDoorRail.position.z = holeZ;
            topDoorRail.receiveShadow = true;
            topDoorRail.castShadow = true;
            rail.add(topDoorRail);
            topDoorRail.matrixAutoUpdate = false;
            topDoorRail.updateMatrix();
        }
        rail.position.x = i * space;
        rail.position.y = height / 2;
        rail.position.z = 0;
        rail.receiveShadow = true;
        rail.castShadow = true;
        g.add(rail);
        rail.matrixAutoUpdate = false;
        rail.updateMatrix();
    }
    return g;
};
exports.balconyRaling = balconyRaling;
var balconyRailingGrid = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 2 : _b, _c = _a.height, height = _c === void 0 ? 1 : _c, _d = _a.depth, depth = _d === void 0 ? 0.1 : _d, _e = _a.space, space = _e === void 0 ? 0.1 : _e, _f = _a.railwidth, railwidth = _f === void 0 ? 0.06 : _f, _g = _a.hasExits, hasExits = _g === void 0 ? false : _g, materials = _a.materials;
    // Create an array to hold the geometries
    var geometries = [];
    var verticalCount = Math.round(width / space);
    var horizontalCount = Math.round(height / space);
    var verticalSpace = width / verticalCount;
    var horizontalSpace = height / horizontalCount;
    // Add vertical rails to the geometries array
    for (var i = 0; i <= verticalCount; i++) {
        var railGeometry = new THREE.BoxGeometry(railwidth, height, railwidth);
        var railMesh = new THREE.Mesh(railGeometry);
        railMesh.position.x = i * verticalSpace;
        railMesh.position.y = height / 2;
        railMesh.updateMatrix();
        railGeometry.applyMatrix4(railMesh.matrix);
        geometries.push(railGeometry);
    }
    // Add horizontal rails to the geometries array
    for (var j = 0; j <= horizontalCount; j++) {
        var railGeometry = new THREE.BoxGeometry(width, railwidth, railwidth);
        var railMesh = new THREE.Mesh(railGeometry);
        railMesh.position.x = width / 2;
        railMesh.position.y = j * horizontalSpace;
        railMesh.updateMatrix();
        railGeometry.applyMatrix4(railMesh.matrix);
        geometries.push(railGeometry);
    }
    // Merge all geometries into one
    var compositeGeometry = (0, BufferGeometryUtils_js_1.mergeGeometries)(geometries);
    // Create a mesh from the composite geometry
    // Apply CSG operations if exits are required
    if (hasExits) {
        var doorSettings = {
            width: 0.25,
            height: 0.5,
            depth: railwidth,
            offsetLeft: 0.25,
            offsetGround: 0,
            balcony: undefined,
        };
        var doorGeometry = new THREE.BoxGeometry(doorSettings.width * width, doorSettings.height * height, doorSettings.depth * 1.1);
        var doorMesh = new THREE.Mesh(doorGeometry);
        doorMesh.position.set(width * doorSettings.offsetLeft, doorSettings.height * height / 2, 0);
        doorMesh.updateMatrix();
        var compositeCSG = three_csg_ts_1.CSG.fromMesh(new THREE.Mesh(compositeGeometry));
        var doorCSG = three_csg_ts_1.CSG.fromMesh(doorMesh);
        var resultCSG = compositeCSG.subtract(doorCSG);
        compositeGeometry = three_csg_ts_1.CSG.toGeometry(resultCSG, new THREE.Matrix4());
        var railingMesh_1 = new THREE.Mesh(compositeGeometry, materials.alu || materials.default);
        railingMesh_1.receiveShadow = true;
        railingMesh_1.castShadow = true;
        var doorFrame = frame({
            width: doorSettings.width * width,
            height: doorSettings.height * height,
            depth: doorSettings.depth
        });
        doorFrame.material = materials.alu || materials.default;
        doorFrame.position.set(width * doorSettings.offsetLeft, doorSettings.height * height / 2, 0);
        doorFrame.updateMatrix();
        railingMesh_1.add(doorFrame);
        return railingMesh_1;
    }
    var railingMesh = new THREE.Mesh(compositeGeometry, materials.alu || materials.default);
    railingMesh.receiveShadow = true;
    railingMesh.castShadow = true;
    return railingMesh;
};
exports.balconyRailingGrid = balconyRailingGrid;
var shutter = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 2 : _b, _c = _a.height, height = _c === void 0 ? 2 : _c, materials = _a.materials;
    var framemesh = frame({
        width: width,
        height: height,
        framewidth: [0.05, 0.05, 0.05, 0.05],
        depth: 0.04,
    });
    var shutterframe = new three_bvh_csg_1.Operation(framemesh.geometry);
    var innerheight = height - 0.05 - 0.05;
    var innerwidth = width - 0.05 - 0.05;
    var shutterPartHeight = 0.1;
    var shutterparts = Math.ceil(innerheight / (shutterPartHeight + 0.005));
    var spacingBetweenParts = 0.005;
    var originalshutterpart = new three_bvh_csg_1.Operation(new THREE.BoxGeometry(innerwidth, shutterPartHeight, 0.02));
    originalshutterpart.operation = three_bvh_csg_1.ADDITION;
    originalshutterpart.position.x = 0.01;
    originalshutterpart.rotation.x = 2.5;
    var shutterY = innerheight / 2 - shutterPartHeight / 2; // Initial Y position for the first shutter part
    for (var i = 0; i < shutterparts; i++) {
        var shutterpart = originalshutterpart.clone();
        shutterpart.position.y = shutterY;
        shutterframe.add(shutterpart);
        shutterframe.matrixAutoUpdate = false;
        shutterframe.updateMatrix();
        shutterY -= (shutterPartHeight + spacingBetweenParts); // Move down for the next part
    }
    var result = csgEvaluator.evaluateHierarchy(shutterframe);
    result.castShadow = true;
    result.receiveShadow = true;
    //result.material = materials.default;
    return result;
};
function addWallWithHoles(wallSettings) {
    var wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallSettings.width, wallSettings.height, wallSettings.depth), wallSettings.material);
    // baseYPosition is the base of the wall
    var baseYPosition = wallMesh.position.y - wallMesh.geometry.parameters.height / 2;
    // Subtract door holes
    if (wallSettings.doors) {
        wallMesh = addHoleOnWallCSG(wallMesh, wallSettings.doors, wallSettings, materials_1.windowMaterial);
    }
    // Subtract window holes
    if (wallSettings.windows) {
        wallMesh = addHoleOnWallCSG(wallMesh, wallSettings.windows, wallSettings, materials_1.windowMaterial);
    }
    var resultMesh = wallMesh;
    resultMesh.material = wallSettings.material;
    // add door parts
    if (wallSettings.doors) {
        wallSettings.doors.forEach(function (door) {
            var doorWidth = door.width * wallSettings.width;
            var doorHeight = door.height * wallSettings.height;
            var doorDepth = wallSettings.depth * 1.1;
            var holeX = wallMesh.position.x - wallSettings.width / 2 + door.offsetLeft * wallSettings.width;
            var holeY = wallMesh.position.y - wallSettings.height / 2 + doorHeight / 2 + door.offsetGround * wallSettings.height;
            var holeZ = wallMesh.position.z;
            // add door frame
            var doorMatrix = new THREE.Matrix4();
            doorMatrix.makeTranslation(holeX, holeY, holeZ);
            var doorFrame = frame({ width: doorWidth, height: doorHeight, depth: wallSettings.depth });
            doorFrame.applyMatrix4(doorMatrix);
            resultMesh.add(doorFrame);
            // add door shutters
            var frameThickness = 0.05;
            var doorSettings = {
                shutters: 1,
                materials: {
                    default: materials_1.woodMaterial,
                    alu: materials_1.windowMaterial,
                },
                open: [0],
            };
            var innerWidth = doorWidth - frameThickness * 2;
            var shutterwidth = innerWidth / doorSettings.shutters;
            var shutterheight = doorHeight - frameThickness * 2;
            var doorX = frameThickness;
            var doorGroupRight = new THREE.Group();
            var doorShutter = shutter({
                width: shutterwidth,
                height: shutterheight,
                materials: doorSettings.materials,
            });
            doorShutter.receiveShadow = true;
            // door.position.z = 0;
            doorShutter.castShadow = true;
            var previousGroup;
            var counter = 0;
            for (var i = doorSettings.shutters; i > 0; i--) {
                counter++;
                var isEven = counter % 2 === 1;
                var doorGroup = new THREE.Group();
                var posX = 0;
                if (i !== 1 && previousGroup) {
                    var rotatedShutterWidth = shutterwidth * Math.abs(Math.cos(previousGroup.rotation.y));
                    posX = doorX + innerWidth - rotatedShutterWidth * 2;
                }
                if (i === 1) {
                    doorGroup.position.x = doorX;
                }
                else if (isEven) {
                    doorGroup.position.x = doorX + innerWidth;
                }
                else {
                    doorGroup.position.x = doorX + innerWidth - i * shutterwidth;
                }
                var doorclone = doorShutter.clone();
                doorGroup.add(doorclone);
                if (i === 1) {
                    doorclone.position.x = holeX - frameThickness;
                }
                else if (isEven) {
                    doorclone.position.x = holeX - wallSettings.width / 2 + doorWidth / 2;
                }
                else {
                    doorclone.position.x = holeX - wallSettings.width / 2 + doorWidth / 2;
                }
                doorclone.position.y = holeY;
                doorclone.position.z = holeZ;
                doorclone.matrixAutoUpdate = false;
                doorclone.updateMatrix();
                if (doorSettings.open && doorSettings.open[i] !== null) {
                    if (i === 1) {
                        doorGroup.rotation.y = THREE.MathUtils.degToRad(doorSettings.open[0]);
                    }
                    else if (isEven) {
                        doorGroup.rotation.y = THREE.MathUtils.degToRad(-doorSettings.open[1]);
                    }
                    else {
                        doorGroup.rotation.y = THREE.MathUtils.degToRad(doorSettings.open[1]);
                        doorGroup.position.x = posX;
                    }
                    resultMesh.add(doorGroup);
                }
                previousGroup = doorGroup;
            }
            resultMesh.add(doorGroupRight);
            // add balcony
            if (door.balcony) {
                var balconySettings = door.balcony;
                var balconyWidth = balconySettings.width;
                var balconyHeight = balconySettings.height;
                var balconyDepth = balconySettings.depth;
                var balconyX = holeX; // Adjust based on your balcony positioning logic
                var balconyY = wallMesh.position.y - wallSettings.height / 2 + balconyHeight / 2; // Adjust based on your balcony positioning logic
                var balconyZ = wallMesh.position.z + wallSettings.depth / 2 + balconyDepth / 2; // Adjust for balcony to protrude
                // Adjust the balcony width if it is full length
                if (balconySettings.isFullLength) {
                    balconyWidth = wallSettings.width + wallSettings.depth;
                    balconyX = wallMesh.position.x + wallSettings.depth / 2;
                }
                var balconyMesh = new THREE.Mesh(new THREE.BoxGeometry(balconyWidth, balconyHeight, balconyDepth), balconySettings.material);
                balconyMesh.position.set(balconyX, balconyY, balconyZ);
                // Add railing to the balcony
                var railingSpace = 0.2;
                var railingMaterial = {
                    default: new THREE.MeshLambertMaterial({ color: 0x00ff00 }), // Green railing
                    alu: new THREE.MeshLambertMaterial({ color: 0x111111 }) // Dark grey railing
                };
                var railingLeft = (0, exports.balconyRaling)({
                    width: balconyDepth * 0.9,
                    space: railingSpace,
                    materials: railingMaterial
                });
                railingLeft.rotation.y = Math.PI / -2;
                railingLeft.position.x = balconyX - balconyWidth / 2;
                railingLeft.position.z = balconyZ - balconyDepth;
                var railingRight = railingLeft.clone();
                railingRight.position.x = balconyX + balconyWidth / 2 - wallSettings.depth;
                var railingFront = (0, exports.balconyRaling)({
                    width: balconyWidth - railingSpace,
                    space: railingSpace,
                    materials: railingMaterial
                });
                railingFront.position.x = balconyX - balconyWidth / 2;
                railingFront.position.z = balconyZ - railingSpace;
                //Add the balcony mesh to the group
                balconyMesh.add(railingLeft);
                balconyMesh.add(railingRight);
                balconyMesh.add(railingFront);
                resultMesh.add(balconyMesh);
            }
        });
    }
    // add window parts
    if (wallSettings.windows) {
        wallSettings.windows.forEach(function (window) {
            var windowWidth = window.width * wallSettings.width;
            var windowHeight = window.height * wallSettings.height;
            var windowDepth = wallSettings.depth * 1.1;
            var holeX = wallMesh.position.x - wallSettings.width / 2 + window.offsetLeft * wallSettings.width;
            var holeY = wallMesh.position.y - wallSettings.height / 2 + windowHeight / 2 + window.offsetGround * wallSettings.height;
            var holeZ = wallMesh.position.z;
            // add window frame
            var windowMatrix = new THREE.Matrix4();
            windowMatrix.makeTranslation(holeX, holeY, holeZ);
            var windowFrame = frame({ width: windowWidth, height: windowHeight, depth: wallSettings.depth });
            windowFrame.applyMatrix4(windowMatrix);
            resultMesh.add(windowFrame);
        });
    }
    var wallGroup = new THREE.Group();
    wallGroup.add(resultMesh); // Add the wall mesh to the group
    // Add stairs
    if (wallSettings.stairs) {
        var stairDepth = wallSettings.width / 2;
        var stairHeight = wallSettings.height;
        var stepWidth = wallSettings.stairs.stepWidth * (wallSettings.width);
        var stepHeight = wallSettings.stairs.stepHeight * stairHeight;
        var stepDepth = wallSettings.stairs.stepDepth * stairDepth;
        var steps = stairHeight / stepHeight;
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
        var outStair = createStairs(wallSettings.stairs); // Assuming stairSettings is defined
        outStair.rotateY(-Math.PI / 2); // Rotate the staircase to face the desired direction
        // Position the staircase outside the wall
        outStair.position.x = wallMesh.position.x - (wallSettings.stairs.stepDepth * wallSettings.stairs.steps) + 1.5 * wallSettings.depth + 4;
        outStair.position.y = wallMesh.position.y - wallSettings.height / 2 + 0.05; // Slightly above the floor to avoid z-fighting
        outStair.position.z = wallMesh.position.z + wallSettings.depth / 2 + wallSettings.stairs.stepWidth / 2;
        // Create a group and add both the wall and the staircase
        wallGroup.add(outStair); // Add the staircase to the group
    }
    // Return the group instead of individual meshes
    return wallGroup;
}
function createStairs(settings) {
    var stairs = new THREE.Group(); // Create a group to hold all the steps
    // const stepMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Green steps
    for (var i = 0; i < settings.steps; i++) {
        var stepGeometry = new THREE.BoxGeometry(settings.stepWidth, settings.stepHeight, settings.stepDepth);
        var stepMesh = new THREE.Mesh(stepGeometry, settings.material);
        // Position each step
        stepMesh.position.x = 0; // Centered on X
        stepMesh.position.y = settings.stepHeight / 2 + i * settings.stepHeight; // Stacked on Y
        stepMesh.position.z = -i * settings.stepDepth; // Staggered on Z
        stairs.add(stepMesh); // Add step to the group
    }
    return stairs; // Return the group containing all steps
}
function addFloorCustom(frontWallSettings, leftWallSettings, rightWallSettings, backWallSettings, insideStairs, wallMaterial, floorThickness) {
    if (floorThickness === void 0) { floorThickness = 0.1; }
    if (wallMaterial) {
        // If a wall material is provided, use it for all walls
        frontWallSettings.material = wallMaterial;
        leftWallSettings.material = wallMaterial;
        rightWallSettings.material = wallMaterial;
        backWallSettings.material = wallMaterial;
    }
    // create 4 walls with settings
    var leftWall = addWallWithHoles(leftWallSettings);
    var frontWall = addWallWithHoles(frontWallSettings);
    // create the right wall object with same settings as left wall but no door or window
    var rightWall = addWallWithHoles(rightWallSettings);
    // create the back wall object with same settings as front wall but no door or window
    var backWall = addWallWithHoles(backWallSettings);
    frontWall.name = 'frontWall';
    leftWall.name = 'leftWall';
    rightWall.name = 'rightWall';
    backWall.name = 'backWall';
    // Position the walls
    // left wall
    leftWall.position.x = frontWall.position.x - (frontWallSettings.width / 2) + (leftWallSettings.depth / 2);
    leftWall.position.y = frontWall.position.y; // Align with frontWall on the y-axis
    leftWall.position.z = frontWall.position.z + (frontWallSettings.depth / 2) - (leftWallSettings.width / 2); // Align with frontWall on the z-axis
    leftWall.rotation.y = -Math.PI / 2; // Rotate 90 degrees to make the angle
    // right wall opposite of left wall
    rightWall.position.x = leftWall.position.x + frontWallSettings.width;
    rightWall.position.y = frontWall.position.y; // Align with frontWall on the y-axis
    rightWall.position.z = leftWall.position.z; // Align with leftWall on the z-axis
    rightWall.rotation.y = Math.PI / 2; // Rotate to face the opposite direction
    // back wall opposite of front wall
    backWall.position.x = frontWall.position.x;
    backWall.position.y = frontWall.position.y; // Align with frontWall on the y-axis
    backWall.position.z = frontWall.position.z - leftWallSettings.width + frontWallSettings.depth; // Align with frontwall on the z-axis
    // add a floor ground plane if needed
    var floorWidth = frontWallSettings.width + leftWallSettings.depth + 0.01;
    var floorDepth = leftWallSettings.width + 0.01;
    var floorGeometry = new THREE.BoxGeometry(floorWidth, floorThickness, floorDepth); // depth is wallSettings1.width, width is wallSettings2.width, height is very thin (0.1)
    var floorMesh = new THREE.Mesh(floorGeometry, materials_1.floorMaterial);
    // Position the floor
    // Assuming wallMesh1.position.y is the base of the walls, adjust if necessary
    floorMesh.position.x = frontWall.position.x + (leftWallSettings.depth / 2); // Centered between wall2 and wall4
    floorMesh.position.y = frontWall.position.y - (frontWallSettings.height / 2) - floorThickness / 2; // Just below the walls, adjust if your wallMesh1.position.y is not the base
    floorMesh.position.z = leftWall.position.z; // Centered between wall1 and wall3
    // Group and return all elements
    var floorGroup = new THREE.Group();
    floorGroup.add(frontWall);
    floorGroup.add(leftWall);
    floorGroup.add(rightWall);
    floorGroup.add(backWall);
    // Add the floorMesh to the group after creating it as before
    floorGroup.add(floorMesh);
    // inside stair
    if (insideStairs) {
        // Add a staircase starting at the top of the floor mesh inside the floor
        // assume the staircase is at the center of the floor
        var stairDepth = (leftWallSettings.width - frontWallSettings.depth) / 2;
        var stairHeight = frontWallSettings.height - floorThickness;
        var stepWidth = insideStairs.stepWidth * (frontWallSettings.width - 2 * leftWallSettings.depth);
        var stepHeight = insideStairs.stepHeight * stairHeight;
        var stepDepth = insideStairs.stepDepth * stairDepth;
        var steps = stairHeight / stepHeight;
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
        var inStair = createStairs(stairSettings); // Example: 10 steps, each 1 unit wide, 0.5 units high, 0.5 units deep
        // Position the staircase at the top of the floor mesh
        // Assuming the staircase starts at the start of the backwall of the floor
        // inStair.rotateY(-Math.PI / 2); // Rotate the staircase to face the opposite direction
        inStair.position.x = floorMesh.position.x; // Adjust based on the total width of the staircase
        inStair.position.y = floorMesh.position.y + 0.05; // Slightly above the floor to avoid z-fighting
        // Correct calculation for the staircase's Z position to be centered and flush against the back wall
        inStair.position.z = floorMesh.position.z; // Adjust based on the total depth of the staircase
        // Add the staircase to the group
        floorGroup.add(inStair);
    }
    return floorGroup;
}
// function to add roof top
function addRoofTop(roofSettings, material) {
    var floorThickness = 0.1; // Thickness of the floor
    if (material && !roofSettings.IsAShaped) {
        // If a roof material is provided, use it for all walls
        roofSettings.FrontWallSettings.material = material;
        roofSettings.LeftWallSettings.material = material;
        roofSettings.RightWallSettings.material = material;
        roofSettings.BackWallSettings.material = material;
        roofSettings.RoofBoxSettings.FrontWallSettings.material = material;
        roofSettings.RoofBoxSettings.LeftWallSettings.material = material;
        roofSettings.RoofBoxSettings.RightWallSettings.material = material;
        roofSettings.RoofBoxSettings.BackWallSettings.material = material;
    }
    // Create walls with adjusted settings
    var roofLeftWall = addWallWithHoles(roofSettings.LeftWallSettings);
    var roofFrontWall = addWallWithHoles(roofSettings.FrontWallSettings);
    var roofRightWall = addWallWithHoles(roofSettings.RightWallSettings);
    var roofBackWall = addWallWithHoles(roofSettings.BackWallSettings);
    var floorGroup = new THREE.Group();
    // Position the walls
    // left wall
    roofLeftWall.position.x = roofFrontWall.position.x - (roofSettings.FrontWallSettings.width / 2) + (roofSettings.LeftWallSettings.depth / 2);
    roofLeftWall.position.y = roofFrontWall.position.y; // Align with frontWall on the y-axis
    roofLeftWall.position.z = roofFrontWall.position.z + (roofSettings.FrontWallSettings.depth / 2) - (roofSettings.LeftWallSettings.width / 2); // Align with frontWall on the z-axis
    roofLeftWall.rotation.y = -Math.PI / 2; // Rotate 90 degrees to make the angle
    // right wall opposite of left wall
    roofRightWall.position.x = roofLeftWall.position.x + roofSettings.FrontWallSettings.width;
    roofRightWall.position.y = roofFrontWall.position.y; // Align with frontWall on the y-axis
    roofRightWall.position.z = roofLeftWall.position.z; // Align with leftWall on the z-axis
    roofRightWall.rotation.y = Math.PI / 2; // Rotate to face the opposite direction
    // back wall opposite of front wall
    roofBackWall.position.x = roofFrontWall.position.x;
    roofBackWall.position.y = roofFrontWall.position.y; // Align with frontWall on the y-axis
    roofBackWall.position.z = roofFrontWall.position.z - roofSettings.LeftWallSettings.width + roofSettings.FrontWallSettings.depth; // Align with frontwall on the z-axis
    // Add a floor ground plane
    var floorWidth = roofSettings.FrontWallSettings.width + roofSettings.LeftWallSettings.depth + 0.01;
    var floorDepth = roofSettings.LeftWallSettings.width + 0.01;
    var floorGeometry = new THREE.BoxGeometry(floorWidth, floorThickness, floorDepth);
    var floorMesh = new THREE.Mesh(floorGeometry, materials_1.floorMaterial); // Use the provided material for the floor
    // Position the floor
    // Assuming wallMesh1.position.y is the base of the walls, adjust if necessary
    floorMesh.position.x = roofFrontWall.position.x + (roofSettings.LeftWallSettings.depth / 2); // Centered between wall2 and wall4
    floorMesh.position.y = roofFrontWall.position.y - (roofSettings.LeftWallSettings.height / 2) - floorThickness / 2; // Just below the walls, adjust if your wallMesh1.position.y is not the base
    floorMesh.position.z = roofLeftWall.position.z; // Centered between wall1 and wall3
    // Example positioning logic (adjust as necessary)
    floorMesh.position.set(roofFrontWall.position.x + (roofSettings.LeftWallSettings.depth / 2), roofFrontWall.position.y - (roofSettings.FrontWallSettings.height / 2) - floorThickness / 2, roofLeftWall.position.z);
    // Add the A-shaped roof if IsAShaped is true
    if (roofSettings.IsAShaped) {
        var roofHeight = roofSettings.FrontWallSettings.height; // Adjust as necessary
        var roofWidth = roofSettings.FrontWallSettings.width + roofSettings.RightWallSettings.depth;
        var roofDepth = roofSettings.LeftWallSettings.width;
        var vertices = new Float32Array([
            // Front face
            0, 2.5 * roofHeight, 0,
            -roofWidth / 2, 0, roofDepth / 2,
            roofWidth / 2, 0, roofDepth / 2,
            // Back face
            0, 2.5 * roofHeight, 0,
            -roofWidth / 2, 0, -roofDepth / 2,
            roofWidth / 2, 0, -roofDepth / 2,
            // Connecting edges
            -roofWidth / 2, 0, roofDepth / 2,
            -roofWidth / 2, 0, -roofDepth / 2,
            roofWidth / 2, 0, roofDepth / 2,
            roofWidth / 2, 0, -roofDepth / 2,
        ]);
        var indices = new Uint16Array([
            // Front face
            0, 1, 2,
            // Back face
            3, 4, 5,
            // Left face
            0, 1, 4,
            0, 4, 3,
            // Right face
            0, 2, 5,
            0, 5, 3,
            // Bottom face
            1, 2, 8,
            1, 8, 6,
            4, 5, 9,
            4, 9, 7,
        ]);
        var roofGeometry = new THREE.BufferGeometry();
        roofGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
        roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        roofGeometry.computeVertexNormals();
        var roof = new THREE.Mesh(roofGeometry, materials_1.roofMaterial);
        roof.position.set(roofFrontWall.position.x + (roofSettings.LeftWallSettings.depth / 2), roofFrontWall.position.y + (roofSettings.FrontWallSettings.height / 2), roofLeftWall.position.z);
        var edgeGeometry = new THREE.EdgesGeometry(roofGeometry);
        var edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        var edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edges.position.copy(roof.position);
        floorGroup.add(roofFrontWall, roofLeftWall, roofRightWall, roofBackWall, roof, edges, floorMesh);
        return floorGroup;
    }
    // Add railing to the roof
    if (roofSettings.Railings) {
        // Adjust the railing height so the railing is above the roofbox
        roofSettings.Railings.front.height += 3 * floorThickness;
        roofSettings.Railings.left.height += 3 * floorThickness;
        roofSettings.Railings.back.height += 3 * floorThickness;
        roofSettings.Railings.right.height += 3 * floorThickness;
        var railingFront = (0, exports.balconyRailingGrid)(roofSettings.Railings.front);
        railingFront.rotation.y = Math.PI;
        railingFront.position.x = roofFrontWall.position.x + roofSettings.FrontWallSettings.width / 2 - roofSettings.LeftWallSettings.depth / 2;
        railingFront.position.y = roofFrontWall.position.y + roofSettings.FrontWallSettings.height;
        railingFront.position.z = roofFrontWall.position.z + roofSettings.LeftWallSettings.width / 2 - roofSettings.LeftWallSettings.depth / 2;
        floorMesh.add(railingFront);
        var railingBack = (0, exports.balconyRailingGrid)(roofSettings.Railings.back);
        railingBack.position.x = roofBackWall.position.x - roofSettings.BackWallSettings.width / 2 + roofSettings.LeftWallSettings.depth / 2;
        railingBack.position.y = roofBackWall.position.y + roofSettings.BackWallSettings.height;
        railingBack.position.z = roofBackWall.position.z + roofSettings.LeftWallSettings.width / 2 - roofSettings.LeftWallSettings.depth / 2;
        floorMesh.add(railingBack);
        var railingLeft = (0, exports.balconyRailingGrid)(roofSettings.Railings.left);
        railingLeft.rotation.y = Math.PI / -2;
        railingLeft.position.x = roofLeftWall.position.x - roofSettings.LeftWallSettings.depth / 2;
        railingLeft.position.y = roofLeftWall.position.y + roofSettings.LeftWallSettings.height;
        railingLeft.position.z = roofLeftWall.position.z;
        floorMesh.add(railingLeft);
        var railingRight = (0, exports.balconyRailingGrid)(roofSettings.Railings.right);
        railingRight.position.x = roofRightWall.position.x - roofSettings.LeftWallSettings.depth / 2;
        railingRight.position.y = roofRightWall.position.y + roofSettings.RightWallSettings.height;
        railingRight.position.z = roofRightWall.position.z;
        railingRight.rotation.y = Math.PI / -2;
        floorMesh.add(railingRight);
        if (roofSettings.Railings.flat) {
            roofSettings.Railings.flat.width = roofSettings.FrontWallSettings.width; // chieu dai tinh theo mat truoc
            roofSettings.Railings.flat.height = roofSettings.LeftWallSettings.width - roofSettings.LeftWallSettings.depth; // chieu rong tinh theo mat ben
            var flatRailing = (0, exports.balconyRailingGrid)(roofSettings.Railings.flat);
            flatRailing.rotateX(Math.PI / 2);
            flatRailing.position.x = roofFrontWall.position.x - roofSettings.Railings.flat.width / 2;
            flatRailing.position.y = roofFrontWall.position.y + roofSettings.FrontWallSettings.height + roofSettings.Railings.right.height;
            flatRailing.position.z = roofFrontWall.position.z - roofSettings.Railings.flat.height / 2;
            floorMesh.add(flatRailing);
        }
    }
    // Additional structure on top (adjust as necessary)
    if (roofSettings.RoofBoxSettings) {
        var roofDepth = roofSettings.RoofBoxSettings.FrontWallSettings.width;
        var roofBox = addFloorCustom(roofSettings.RoofBoxSettings.FrontWallSettings, roofSettings.RoofBoxSettings.LeftWallSettings, roofSettings.RoofBoxSettings.RightWallSettings, roofSettings.RoofBoxSettings.BackWallSettings, undefined, undefined, 0);
        roofBox.position.y = floorMesh.position.y + floorThickness + roofSettings.RoofBoxSettings.LeftWallSettings.height / 2 + 0.01;
        var flatRoofGeometry = new THREE.BoxGeometry(roofSettings.RoofBoxSettings.FrontWallSettings.width + roofSettings.RoofBoxSettings.FrontWallSettings.depth, 0.1, roofDepth);
        // Create the flatRoof mesh with the corrected geometry
        var flatRoof = new THREE.Mesh(flatRoofGeometry, materials_1.woodMaterial);
        flatRoof.position.x = roofBox.position.x + roofSettings.RoofBoxSettings.LeftWallSettings.depth / 2;
        flatRoof.position.y = roofBox.position.y + roofSettings.RoofBoxSettings.LeftWallSettings.height / 2 + 0.05;
        flatRoof.position.z = roofBox.position.z - roofSettings.RoofBoxSettings.LeftWallSettings.width / 2 + roofSettings.RoofBoxSettings.LeftWallSettings.depth / 2;
        // Add all elements to the group
        floorGroup.add(roofFrontWall, roofLeftWall, roofRightWall, roofBackWall, floorMesh, roofBox, flatRoof);
    }
    return floorGroup;
}
//# sourceMappingURL=house.js.map