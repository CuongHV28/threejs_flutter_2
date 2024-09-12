//function to add a floor
import * as THREE from 'three';

import { colors, 
    groundMaterial, 
    floorMaterial, 
    roofMaterial, 
    windowMaterial, 
    wallMaterial, 
    woodMaterial, 
    normalMaterial, 
    standartMaterial, 
    lambert, 
    phongMaterial 
} from './materials';

import { IHoleSettings, IWallSettings, IStairsSettings, IDoorSettings, IBalconyRailing, IBalconyMaterials, ITopRailings } from './shapes/baseShapes';
import { CSG } from 'three-csg-ts';
import { ADDITION, Evaluator, Operation, SUBTRACTION } from 'three-bvh-csg';
import { IHouseRoofSettings } from './houses/base';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function addHoleOnWallCSG(
    wallMesh: any, 
    holes: any[], 
    wallSettings: IWallSettings, 
    material: THREE.Material
): any {
    let wallCSG = CSG.fromMesh(wallMesh);
    holes.forEach(hole => {
        let holeWidth = hole.width * wallSettings.width;
        let holeHeight = hole.height * wallSettings.height;
        let holeDepth = wallSettings.depth * 1.1;

        let holeX = wallMesh.position.x - wallSettings.width / 2 + hole.offsetLeft * wallSettings.width;
        let holeY = wallMesh.position.y - wallSettings.height / 2 + holeHeight / 2 + hole.offsetGround * wallSettings.height;
        let holeZ = wallMesh.position.z;


        let holeMesh = new THREE.Mesh(new THREE.BoxGeometry(holeWidth, holeHeight, holeDepth), material);
        let holeMatrix = new THREE.Matrix4();
        holeMatrix.makeTranslation(holeX, holeY, holeZ);
        holeMesh.applyMatrix4(holeMatrix);
        let holeCSG = CSG.fromMesh(holeMesh);
        
        wallCSG = wallCSG.subtract(holeCSG);
    });
    return wallCSG.toMesh(new THREE.Matrix4());
}

// CSG
let csgEvaluator: any;
csgEvaluator = new Evaluator();
csgEvaluator.attributes = ["position", "normal"];
csgEvaluator.useGroups = false;

// door and window frame
interface IFrame {
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
    depth?: number;
    framewidth?: number[];
}
const frame = ({
    width = 2,
    height = 2,
    framewidth = [0.05, 0.05, 0.05, 0.05],
    depth = 5,
  }: IFrame) => {
    const frame = new Operation(new THREE.BoxGeometry(width, height, depth));
  
    const hole = new Operation(
      new THREE.BoxGeometry(
        width - framewidth[1] - framewidth[3],
        height - framewidth[0] - framewidth[2],
        depth * 2
      )
    );
    hole.operation = SUBTRACTION;
    hole.position.y = (framewidth[2] - framewidth[0]) / 2;
    hole.position.x = (framewidth[3] - framewidth[1]) / 2;
  
    frame.add(hole);
  
    const result = csgEvaluator.evaluateHierarchy(frame);
    result.castShadow = true;
    result.receiveShadow = true;
  
    return result;
};

// balcony railing

export const balconyRaling = ({
    height = 1,
    width = 2,
    space = 0.1,
    railwidth = 0.06,
    hasExits = false,
    materials
}: IBalconyRailing) => {
    const g = new THREE.Group();
    
    const count = Math.round(width / space);
    space = width / count;
    let doorStart, doorEnd;
    if (hasExits) {
        doorStart = Math.floor(0.25 * count);
        doorEnd = Math.floor(0.5 * count);
    }
    
    const toprail = new THREE.Mesh(
        new THREE.BoxGeometry(width + railwidth, railwidth, railwidth),
        materials.alu || materials.default
    );
    toprail.position.x = width / 2;
    toprail.position.y = height;
    toprail.position.z = 0;
    toprail.receiveShadow = true;
    toprail.castShadow = true;
    g.add(toprail);
    toprail.matrixAutoUpdate = false;
    toprail.updateMatrix();
    
    for (var i = 0; i <= count; i++) {
        let rail = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, height, 0.02),
            materials.alu || materials.default
        );
        if (hasExits && i >= doorStart && i <= doorEnd) {
            const doorSettings: IDoorSettings = {
                width: 0.3,
                height: 0.6,
                depth: railwidth,
                offsetLeft: 0.6,
                offsetGround: 0,
                balcony: undefined,
            };

            let holeWidth = doorSettings.width * width;
            let holeHeight = doorSettings.height * height;
            let holeDepth = railwidth * 1.1;

            let holeX = rail.position.x - width / 2 + doorSettings.offsetLeft * width;
            let holeY = rail.position.y - height / 2 + holeHeight / 2 + doorSettings.offsetGround * height;
            let holeZ = rail.position.z;


            let holeMesh = new THREE.Mesh(new THREE.BoxGeometry(holeWidth, holeHeight, holeDepth), materials.default);
            let holeMatrix = new THREE.Matrix4();
            holeMatrix.makeTranslation(holeX, holeY, holeZ);
            holeMesh.applyMatrix4(holeMatrix);
            let holeCSG = CSG.fromMesh(holeMesh);


            const railingCSG = CSG.fromMesh(rail);
            const resultCSG = railingCSG.subtract(holeCSG);
            
            const resultMesh = CSG.toMesh(resultCSG, new THREE.Matrix4(), materials.alu || materials.default);
            resultMesh.geometry.computeVertexNormals();
            resultMesh.receiveShadow = true;
            resultMesh.castShadow = true;
            
            rail.geometry.dispose();
            rail.geometry = resultMesh.geometry as THREE.BoxGeometry;
            rail.material = resultMesh.material;

            const topDoorRail = new THREE.Mesh(
                new THREE.BoxGeometry(width / 4, railwidth, railwidth),
                materials.alu || materials.default
            );

            topDoorRail.position.x = holeX - 2 * space;
            topDoorRail.position.y = holeY + holeHeight /2;
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


export const balconyRailingGrid = ({
    width = 2,
    height = 1,
    depth = 0.1,
    space = 0.1,
    railwidth = 0.06,
    hasExits = false,
    materials
}) => {
    // Create an array to hold the geometries
    let geometries = [];

    const verticalCount = Math.round(width / space);
    const horizontalCount = Math.round(height / space);
    const verticalSpace = width / verticalCount;
    const horizontalSpace = height / horizontalCount;

    // Add vertical rails to the geometries array
    for (let i = 0; i <= verticalCount; i++) {
        let railGeometry = new THREE.BoxGeometry(railwidth, height, railwidth);
        let railMesh = new THREE.Mesh(railGeometry);
        railMesh.position.x = i * verticalSpace;
        railMesh.position.y = height / 2;
        railMesh.updateMatrix();
        railGeometry.applyMatrix4(railMesh.matrix);
        geometries.push(railGeometry);
    }

    // Add horizontal rails to the geometries array
    for (let j = 0; j <= horizontalCount; j++) {
        let railGeometry = new THREE.BoxGeometry(width, railwidth, railwidth);
        let railMesh = new THREE.Mesh(railGeometry);
        railMesh.position.x = width / 2;
        railMesh.position.y = j * horizontalSpace;
        railMesh.updateMatrix();
        railGeometry.applyMatrix4(railMesh.matrix);
        geometries.push(railGeometry);
    }

    // Merge all geometries into one

    let compositeGeometry = mergeGeometries(geometries);

    // Create a mesh from the composite geometry
    
    // Apply CSG operations if exits are required
    if (hasExits) {
        const doorSettings: IDoorSettings = {
            width: 0.25,
            height: 0.5,
            depth: railwidth,
            offsetLeft: 0.25,
            offsetGround: 0,
            balcony: undefined,
        };
        const doorGeometry = new THREE.BoxGeometry(doorSettings.width * width, doorSettings.height * height, doorSettings.depth * 1.1);
        const doorMesh = new THREE.Mesh(doorGeometry);
        doorMesh.position.set(width * doorSettings.offsetLeft, doorSettings.height * height / 2, 0);
        doorMesh.updateMatrix();

        const compositeCSG = CSG.fromMesh(new THREE.Mesh(compositeGeometry));
        const doorCSG = CSG.fromMesh(doorMesh);
        const resultCSG = compositeCSG.subtract(doorCSG);

        compositeGeometry = CSG.toGeometry(resultCSG, new THREE.Matrix4());

        const railingMesh = new THREE.Mesh(compositeGeometry, materials.alu || materials.default);
        railingMesh.receiveShadow = true;
        railingMesh.castShadow = true;

        const doorFrame = frame({
            width: doorSettings.width * width,
            height: doorSettings.height * height,
            depth: doorSettings.depth
        });
        doorFrame.material = materials.alu || materials.default;
        doorFrame.position.set(width * doorSettings.offsetLeft, doorSettings.height * height / 2, 0);
        doorFrame.updateMatrix();
        railingMesh.add(doorFrame);

        return railingMesh;
    }

    const railingMesh = new THREE.Mesh(compositeGeometry, materials.alu || materials.default);
    railingMesh.receiveShadow = true;
    railingMesh.castShadow = true;

    return railingMesh;
};

//export const balconyRailingGrid = ({
//    width = 2,
//    height = 1,
//    depth = 0.1,
//    space = 0.1,
//    railwidth = 0.06,
//    hasExits = false,
//    materials
//}) => {
//    //const g = new THREE.Group();
//    let railing = new THREE.Object3D();

//    const verticalCount = Math.round(width / space);
//    const horizontalCount = Math.round(height / space);
//    const verticalSpace = width / verticalCount;
//    const horizontalSpace = height / horizontalCount;

//    // Add vertical rails
//    for (let i = 0; i <= verticalCount; i++) {
//        let rail = new THREE.Mesh(
//            new THREE.BoxGeometry(railwidth, height, railwidth),
//            materials.alu || materials.default
//        );

//        rail.position.x = i * verticalSpace;
//        rail.position.y = height / 2;
//        rail.position.z = 0;
//        rail.receiveShadow = true;
//        rail.castShadow = true;

//        railing.add(rail);
//        rail.matrixAutoUpdate = false;
//        rail.updateMatrix();
//    }

//    // Add horizontal rails
//    for (let j = 0; j <= horizontalCount; j++) {
//        let rail = new THREE.Mesh(
//            new THREE.BoxGeometry(width, railwidth, railwidth),
//            materials.alu || materials.default
//        );

//        rail.position.x = width / 2;
//        rail.position.y = j * horizontalSpace;
//        rail.position.z = 0;
//        rail.receiveShadow = true;
//        rail.castShadow = true;

//        railing.add(rail);
//        rail.matrixAutoUpdate = false;
//        rail.updateMatrix();
//    }

//    if (hasExits) {
//        const doorWidth = 0.3 * width;
//        const doorHeight = 0.5 * height;

//        const door = new THREE.Mesh(
//            new THREE.BoxGeometry(doorWidth, doorHeight, depth),
//            materials.default
//        );
        
//    }

//    return railing;
//};


// shutters
interface IAweningMaterials {
    // Define the properties of IAweningMaterials here
}

interface IShutter {
    materials: IAweningMaterials;
    x?: number;
    y?: number;
    z?: number;
    width?: number;
    height?: number;
}
const shutter = ({ width = 2, height = 2, materials }: IShutter) => {
    const framemesh = frame({
        width: width,
        height: height,
        framewidth: [0.05, 0.05, 0.05, 0.05],
        depth: 0.04,
    });
    const shutterframe = new Operation(framemesh.geometry);
  
    const innerheight = height - 0.05 - 0.05;
    const innerwidth = width - 0.05 - 0.05;
    const shutterPartHeight = 0.1;
    const shutterparts = Math.ceil(innerheight / (shutterPartHeight + 0.005));
    const spacingBetweenParts = 0.005;
  
    const originalshutterpart = new Operation(
        new THREE.BoxGeometry(innerwidth, shutterPartHeight, 0.02)
    );
    originalshutterpart.operation = ADDITION;
    originalshutterpart.position.x = 0.01;
    originalshutterpart.rotation.x = 2.5;
  
    let shutterY = innerheight / 2 - shutterPartHeight / 2; // Initial Y position for the first shutter part
    for (var i = 0; i < shutterparts; i++) {
        const shutterpart = originalshutterpart.clone();
        shutterpart.position.y = shutterY;
        shutterframe.add(shutterpart);

        shutterframe.matrixAutoUpdate = false;
        shutterframe.updateMatrix();
        shutterY -= (shutterPartHeight + spacingBetweenParts); // Move down for the next part
    }
  
    const result = csgEvaluator.evaluateHierarchy(shutterframe);
    result.castShadow = true;
    result.receiveShadow = true;
    //result.material = materials.default;

  
    return result;
};


function addWallWithHoles(wallSettings: IWallSettings) {
    let wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallSettings.width, wallSettings.height, wallSettings.depth), wallSettings.material);

    // baseYPosition is the base of the wall
    const baseYPosition = wallMesh.position.y - wallMesh.geometry.parameters.height / 2;

    // Subtract door holes
    if (wallSettings.doors) {
        wallMesh = addHoleOnWallCSG(wallMesh, wallSettings.doors, wallSettings, windowMaterial); 
    }

    // Subtract window holes
    if (wallSettings.windows) {
        wallMesh = addHoleOnWallCSG(wallMesh, wallSettings.windows, wallSettings, windowMaterial);
    }

    let resultMesh = wallMesh;
    resultMesh.material = wallSettings.material;

    // add door parts
    if (wallSettings.doors) {
        wallSettings.doors.forEach(door => {
            const doorWidth = door.width * wallSettings.width;
            const doorHeight = door.height * wallSettings.height;
            const doorDepth = wallSettings.depth * 1.1;

            const holeX = wallMesh.position.x - wallSettings.width / 2 + door.offsetLeft * wallSettings.width;
            const holeY = wallMesh.position.y - wallSettings.height / 2 + doorHeight / 2 + door.offsetGround * wallSettings.height;
            const holeZ = wallMesh.position.z;

            // add door frame
            const doorMatrix = new THREE.Matrix4();
            doorMatrix.makeTranslation(holeX, holeY, holeZ);
            const doorFrame = frame({ width: doorWidth, height: doorHeight, depth: wallSettings.depth });
            doorFrame.applyMatrix4(doorMatrix);
            resultMesh.add(doorFrame);

            // add door shutters
            const frameThickness = 0.05;
            const doorSettings = {
                shutters: 1,
                materials: {
                    default: woodMaterial,
                    alu: windowMaterial,
                },
                open: [0],
            };
            const innerWidth = doorWidth - frameThickness * 2;
            const shutterwidth = innerWidth / doorSettings.shutters;
            const shutterheight = doorHeight - frameThickness * 2;
            let doorX = frameThickness;
            const doorGroupRight = new THREE.Group();

            const doorShutter = shutter({
                width: shutterwidth,
                height: shutterheight,
                materials: doorSettings.materials,
            });
            doorShutter.receiveShadow = true;
            // door.position.z = 0;
            doorShutter.castShadow = true;

            let previousGroup;
            let counter = 0;
            for (var i = doorSettings.shutters; i > 0; i--) {
                counter++;
                const isEven = counter % 2 === 1;

                const doorGroup = new THREE.Group();
                let posX = 0;
                if (i !== 1 && previousGroup) {
                const rotatedShutterWidth =
                    shutterwidth * Math.abs(Math.cos(previousGroup.rotation.y));
                    posX = doorX + innerWidth - rotatedShutterWidth * 2;
                }
                if (i === 1) {
                    doorGroup.position.x = doorX;
                } else if (isEven) {
                    doorGroup.position.x = doorX + innerWidth;
                } else {
                    doorGroup.position.x = doorX + innerWidth - i * shutterwidth;
                }

                const doorclone = doorShutter.clone();
                doorGroup.add(doorclone);
                if (i === 1) {
                    doorclone.position.x = holeX - frameThickness;
                } else if (isEven) {
                    doorclone.position.x = holeX - wallSettings.width / 2 + doorWidth / 2;
                } else {
                    doorclone.position.x = holeX - wallSettings.width / 2 + doorWidth / 2;
                }
                doorclone.position.y = holeY;
                doorclone.position.z = holeZ;
                doorclone.matrixAutoUpdate = false;
                doorclone.updateMatrix();

                if (doorSettings.open && doorSettings.open[i] !== null) {
                    if (i === 1) {
                        doorGroup.rotation.y = THREE.MathUtils.degToRad(doorSettings.open[0]);
                    } else if (isEven) {
                        doorGroup.rotation.y = THREE.MathUtils.degToRad(-doorSettings.open[1]);
                    } else {
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
                const balconySettings = door.balcony;
                let balconyWidth = balconySettings.width;
                let balconyHeight = balconySettings.height;
                let balconyDepth = balconySettings.depth;
                let balconyX = holeX; // Adjust based on your balcony positioning logic
                let balconyY = wallMesh.position.y - wallSettings.height / 2 + balconyHeight / 2; // Adjust based on your balcony positioning logic
                let balconyZ = wallMesh.position.z + wallSettings.depth / 2 + balconyDepth / 2; // Adjust for balcony to protrude

                // Adjust the balcony width if it is full length
                if(balconySettings.isFullLength) {
                    balconyWidth = wallSettings.width + wallSettings.depth;
                    balconyX = wallMesh.position.x + wallSettings.depth / 2;
                }
                
                const balconyMesh = new THREE.Mesh(new THREE.BoxGeometry(balconyWidth, balconyHeight, balconyDepth), balconySettings.material);
                balconyMesh.position.set(balconyX, balconyY, balconyZ);

                // Add railing to the balcony
                const railingSpace = 0.2;
                const railingMaterial : IBalconyMaterials = {
                    default: new THREE.MeshLambertMaterial({ color: 0x00ff00 }), // Green railing
                    alu: new THREE.MeshLambertMaterial({ color: 0x111111 }) // Dark grey railing
                }
                const railingLeft = balconyRaling({
                    width: balconyDepth * 0.9,
                    space: railingSpace,
                    materials: railingMaterial
                });
                railingLeft.rotation.y = Math.PI / -2;
                railingLeft.position.x = balconyX - balconyWidth / 2;
                railingLeft.position.z = balconyZ - balconyDepth;

                const railingRight = railingLeft.clone();
                railingRight.position.x = balconyX + balconyWidth / 2 - wallSettings.depth;


                const railingFront = balconyRaling({
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
        wallSettings.windows.forEach(window => {
            let windowWidth = window.width * wallSettings.width;
            let windowHeight = window.height * wallSettings.height;
            let windowDepth = wallSettings.depth * 1.1;
            let holeX = wallMesh.position.x - wallSettings.width / 2 + window.offsetLeft * wallSettings.width;
            let holeY = wallMesh.position.y - wallSettings.height / 2 + windowHeight / 2 + window.offsetGround * wallSettings.height;
            let holeZ = wallMesh.position.z;

            // add window frame
            let windowMatrix = new THREE.Matrix4();
            windowMatrix.makeTranslation(holeX, holeY, holeZ);
            let windowFrame = frame({ width: windowWidth, height: windowHeight, depth: wallSettings.depth });
            windowFrame.applyMatrix4(windowMatrix);
            resultMesh.add(windowFrame);
        });
    }


    let wallGroup = new THREE.Group();
    wallGroup.add(resultMesh); // Add the wall mesh to the group



    // Add stairs
    if (wallSettings.stairs) {
        const stairDepth = wallSettings.width / 2;
        const stairHeight = wallSettings.height;
        const stepWidth = wallSettings.stairs.stepWidth * (wallSettings.width);
        const stepHeight = wallSettings.stairs.stepHeight * stairHeight;
        const stepDepth = wallSettings.stairs.stepDepth * stairDepth;
        const steps = stairHeight / stepHeight;

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
        const outStair = createStairs(wallSettings.stairs); // Assuming stairSettings is defined
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

function createStairs(settings : IStairsSettings) {
    const stairs = new THREE.Group(); // Create a group to hold all the steps
    // const stepMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Green steps
  
    for (let i = 0; i < settings.steps; i++) {
        const stepGeometry = new THREE.BoxGeometry(settings.stepWidth, settings.stepHeight, settings.stepDepth);
        const stepMesh = new THREE.Mesh(stepGeometry, settings.material);
  
        // Position each step
        stepMesh.position.x = 0; // Centered on X
        stepMesh.position.y = settings.stepHeight / 2 + i * settings.stepHeight; // Stacked on Y
        stepMesh.position.z = -i * settings.stepDepth; // Staggered on Z
  
        stairs.add(stepMesh); // Add step to the group
    }
  
    return stairs; // Return the group containing all steps
}



function addFloorCustom(
    frontWallSettings: IWallSettings, 
    leftWallSettings: IWallSettings, 
    rightWallSettings: IWallSettings, 
    backWallSettings: IWallSettings, 
    insideStairs?: IStairsSettings,
    wallMaterial?: THREE.Material,
    floorThickness: number = 0.1
): THREE.Group {

    if (wallMaterial) {
        // If a wall material is provided, use it for all walls
        frontWallSettings.material = wallMaterial;
        leftWallSettings.material = wallMaterial;
        rightWallSettings.material = wallMaterial;
        backWallSettings.material = wallMaterial;
    }

    // create 4 walls with settings
    const leftWall = addWallWithHoles(leftWallSettings);
    const frontWall = addWallWithHoles(frontWallSettings);
    // create the right wall object with same settings as left wall but no door or window
    const rightWall = addWallWithHoles(rightWallSettings);
    // create the back wall object with same settings as front wall but no door or window
    const backWall = addWallWithHoles(backWallSettings);

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
    const floorWidth = frontWallSettings.width + leftWallSettings.depth + 0.01;
    const floorDepth = leftWallSettings.width + 0.01;
    const floorGeometry = new THREE.BoxGeometry(floorWidth, floorThickness, floorDepth); // depth is wallSettings1.width, width is wallSettings2.width, height is very thin (0.1)
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    // Position the floor
    // Assuming wallMesh1.position.y is the base of the walls, adjust if necessary
    floorMesh.position.x = frontWall.position.x + (leftWallSettings.depth / 2); // Centered between wall2 and wall4
    floorMesh.position.y = frontWall.position.y - (frontWallSettings.height / 2) - floorThickness / 2; // Just below the walls, adjust if your wallMesh1.position.y is not the base
    floorMesh.position.z = leftWall.position.z; // Centered between wall1 and wall3

    
    // Group and return all elements
    const floorGroup = new THREE.Group();
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
        const stairDepth = (leftWallSettings.width - frontWallSettings.depth) / 2;
        const stairHeight = frontWallSettings.height - floorThickness;
        const stepWidth = insideStairs.stepWidth * (frontWallSettings.width - 2 * leftWallSettings.depth);
        const stepHeight = insideStairs.stepHeight * stairHeight;
        const stepDepth = insideStairs.stepDepth * stairDepth;
        const steps = stairHeight / stepHeight;

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
        const inStair = createStairs(stairSettings); // Example: 10 steps, each 1 unit wide, 0.5 units high, 0.5 units deep
        // Position the staircase at the top of the floor mesh
        // Assuming the staircase starts at the start of the backwall of the floor
        // inStair.rotateY(-Math.PI / 2); // Rotate the staircase to face the opposite direction
        inStair.position.x = floorMesh.position.x; // Adjust based on the total width of the staircase
        inStair.position.y = floorMesh.position.y + 0.05; // Slightly above the floor to avoid z-fighting
        // Correct calculation for the staircase's Z position to be centered and flush against the back wall
        inStair.position.z = floorMesh.position.z ; // Adjust based on the total depth of the staircase

        // Add the staircase to the group
        floorGroup.add(inStair);
    }


    return floorGroup;
}

// function to add roof top
function addRoofTop(
    roofSettings: IHouseRoofSettings,
    material?: THREE.Material,
): THREE.Group {
    const floorThickness = 0.1; // Thickness of the floor

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
    const roofLeftWall = addWallWithHoles(roofSettings.LeftWallSettings);
    const roofFrontWall = addWallWithHoles(roofSettings.FrontWallSettings);
    const roofRightWall = addWallWithHoles(roofSettings.RightWallSettings);
    const roofBackWall = addWallWithHoles(roofSettings.BackWallSettings);

    const floorGroup = new THREE.Group();
    
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
    const floorWidth = roofSettings.FrontWallSettings.width + roofSettings.LeftWallSettings.depth + 0.01;
    const floorDepth = roofSettings.LeftWallSettings.width + 0.01;

    const floorGeometry = new THREE.BoxGeometry(floorWidth, floorThickness, floorDepth);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial); // Use the provided material for the floor

    // Position the floor
    // Assuming wallMesh1.position.y is the base of the walls, adjust if necessary
    floorMesh.position.x = roofFrontWall.position.x + (roofSettings.LeftWallSettings.depth / 2); // Centered between wall2 and wall4
    floorMesh.position.y = roofFrontWall.position.y - (roofSettings.LeftWallSettings.height / 2) - floorThickness / 2; // Just below the walls, adjust if your wallMesh1.position.y is not the base
    floorMesh.position.z = roofLeftWall.position.z; // Centered between wall1 and wall3

    // Example positioning logic (adjust as necessary)
    floorMesh.position.set(roofFrontWall.position.x + (roofSettings.LeftWallSettings.depth / 2), roofFrontWall.position.y - (roofSettings.FrontWallSettings.height / 2) - floorThickness / 2, roofLeftWall.position.z);
    
    // Add the A-shaped roof if IsAShaped is true
    if (roofSettings.IsAShaped) {
        const roofHeight = roofSettings.FrontWallSettings.height; // Adjust as necessary
        const roofWidth = roofSettings.FrontWallSettings.width + roofSettings.RightWallSettings.depth;
        const roofDepth = roofSettings.LeftWallSettings.width;

        const vertices = new Float32Array([
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

        const indices = new Uint16Array([
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

        const roofGeometry = new THREE.BufferGeometry();
        roofGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
        roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        roofGeometry.computeVertexNormals();
        

        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(
            roofFrontWall.position.x + (roofSettings.LeftWallSettings.depth / 2),
            roofFrontWall.position.y + (roofSettings.FrontWallSettings.height / 2),
            roofLeftWall.position.z
        );

        const edgeGeometry = new THREE.EdgesGeometry(roofGeometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
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

        const railingFront = balconyRailingGrid(roofSettings.Railings.front);
        railingFront.rotation.y = Math.PI;
        railingFront.position.x = roofFrontWall.position.x + roofSettings.FrontWallSettings.width / 2 - roofSettings.LeftWallSettings.depth / 2;
        railingFront.position.y = roofFrontWall.position.y + roofSettings.FrontWallSettings.height;
        railingFront.position.z = roofFrontWall.position.z + roofSettings.LeftWallSettings.width / 2 - roofSettings.LeftWallSettings.depth / 2;
        floorMesh.add(railingFront);

        const railingBack = balconyRailingGrid(roofSettings.Railings.back);
        railingBack.position.x = roofBackWall.position.x - roofSettings.BackWallSettings.width / 2 + roofSettings.LeftWallSettings.depth / 2;
        railingBack.position.y = roofBackWall.position.y + roofSettings.BackWallSettings.height;
        railingBack.position.z = roofBackWall.position.z + roofSettings.LeftWallSettings.width / 2 - roofSettings.LeftWallSettings.depth / 2;
        floorMesh.add(railingBack);

        const railingLeft = balconyRailingGrid(roofSettings.Railings.left);
        railingLeft.rotation.y = Math.PI / -2;
        railingLeft.position.x = roofLeftWall.position.x - roofSettings.LeftWallSettings.depth / 2;
        railingLeft.position.y = roofLeftWall.position.y + roofSettings.LeftWallSettings.height;
        railingLeft.position.z = roofLeftWall.position.z ;
        floorMesh.add(railingLeft);

        const railingRight = balconyRailingGrid(roofSettings.Railings.right);
        railingRight.position.x = roofRightWall.position.x - roofSettings.LeftWallSettings.depth / 2;
        railingRight.position.y = roofRightWall.position.y + roofSettings.RightWallSettings.height;
        railingRight.position.z = roofRightWall.position.z;
        railingRight.rotation.y = Math.PI / -2;
        floorMesh.add(railingRight);

        if (roofSettings.Railings.flat) {
            roofSettings.Railings.flat.width = roofSettings.FrontWallSettings.width;  // chieu dai tinh theo mat truoc
            roofSettings.Railings.flat.height = roofSettings.LeftWallSettings.width - roofSettings.LeftWallSettings.depth;    // chieu rong tinh theo mat ben

            const flatRailing = balconyRailingGrid(roofSettings.Railings.flat);
            flatRailing.rotateX(Math.PI / 2);
            flatRailing.position.x = roofFrontWall.position.x - roofSettings.Railings.flat.width / 2;
            flatRailing.position.y = roofFrontWall.position.y + roofSettings.FrontWallSettings.height + roofSettings.Railings.right.height;
            flatRailing.position.z = roofFrontWall.position.z - roofSettings.Railings.flat.height / 2;
            floorMesh.add(flatRailing);
        }
    }
    // Additional structure on top (adjust as necessary)
    if (roofSettings.RoofBoxSettings) {
        const roofDepth = roofSettings.RoofBoxSettings.FrontWallSettings.width;

        const roofBox = addFloorCustom(
            roofSettings.RoofBoxSettings.FrontWallSettings,
            roofSettings.RoofBoxSettings.LeftWallSettings,
            roofSettings.RoofBoxSettings.RightWallSettings,
            roofSettings.RoofBoxSettings.BackWallSettings,
            undefined,
            undefined,
            0
        );
        roofBox.position.y = floorMesh.position.y + floorThickness + roofSettings.RoofBoxSettings.LeftWallSettings.height / 2 + 0.01;

        const flatRoofGeometry = new THREE.BoxGeometry(roofSettings.RoofBoxSettings.FrontWallSettings.width + roofSettings.RoofBoxSettings.FrontWallSettings.depth, 0.1, roofDepth);
        // Create the flatRoof mesh with the corrected geometry
        const flatRoof = new THREE.Mesh(flatRoofGeometry, woodMaterial);

        flatRoof.position.x = roofBox.position.x + roofSettings.RoofBoxSettings.LeftWallSettings.depth / 2;
        flatRoof.position.y = roofBox.position.y + roofSettings.RoofBoxSettings.LeftWallSettings.height / 2 + 0.05;
        flatRoof.position.z = roofBox.position.z - roofSettings.RoofBoxSettings.LeftWallSettings.width / 2 + roofSettings.RoofBoxSettings.LeftWallSettings.depth / 2;

        // Add all elements to the group
        floorGroup.add(roofFrontWall, roofLeftWall, roofRightWall, roofBackWall, floorMesh, roofBox, flatRoof);
    } 

    return floorGroup;
}

export {
    addHoleOnWallCSG,
    addWallWithHoles,
    addFloorCustom,
    createStairs,
    addRoofTop
};