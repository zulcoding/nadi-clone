import * as THREE from 'three';
import {
  createEmergencyCanopyTexture,
  createNadiLogoTexture,
  createOrangeBannerTexture,
  createQueueScreenTexture,
  createRoomSignTexture,
  createVitalsTagTexture,
  type HospitalMaterialSet,
} from './three-materials';

export interface CharacterRig {
  group: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
}

export function createCharacterMesh(
  mats: HospitalMaterialSet,
  options: {
    shirtColor: number;
    pantsColor?: number;
    skinColor?: number;
    hairColor?: number;
    seated?: boolean;
  }
): CharacterRig {
  const group = new THREE.Group();
  const shirtMat = new THREE.MeshStandardMaterial({
    color: options.shirtColor,
    roughness: 0.65,
    metalness: 0.05,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: options.pantsColor ?? 0x222226,
    roughness: 0.75,
    metalness: 0.05,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: options.skinColor ?? 0xf2c5a0,
    roughness: 0.6,
    metalness: 0.04,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: options.hairColor ?? 0x1e1b18,
    roughness: 0.8,
    metalness: 0.02,
  });

  // Contact shadow disc
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 20),
    mats.contactShadowMat
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // Legs
  const legGeo = new THREE.BoxGeometry(0.16, 0.5, 0.18);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  const rightLeg = new THREE.Mesh(legGeo, pantsMat);

  if (options.seated) {
    leftLeg.position.set(-0.11, 0.28, 0.16);
    leftLeg.rotation.x = Math.PI / 2.2;
    rightLeg.position.set(0.11, 0.28, 0.16);
    rightLeg.rotation.x = Math.PI / 2.2;
  } else {
    leftLeg.position.set(-0.11, 0.25, 0);
    rightLeg.position.set(0.11, 0.25, 0);
  }
  group.add(leftLeg, rightLeg);

  // Torso
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.58, 0.24),
    shirtMat
  );
  torso.position.set(0, options.seated ? 0.62 : 0.76, 0);
  torso.castShadow = true;
  group.add(torso);

  // Arms
  const armGeo = new THREE.BoxGeometry(0.13, 0.48, 0.14);
  const leftArm = new THREE.Mesh(armGeo, shirtMat);
  const rightArm = new THREE.Mesh(armGeo, shirtMat);
  leftArm.position.set(-0.29, options.seated ? 0.62 : 0.75, 0);
  rightArm.position.set(0.29, options.seated ? 0.62 : 0.75, 0);
  group.add(leftArm, rightArm);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), skinMat);
  head.position.set(0, options.seated ? 1.08 : 1.24, 0);
  head.castShadow = true;
  group.add(head);

  // Hair cap
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hairMat
  );
  hair.position.copy(head.position);
  hair.position.y += 0.02;
  hair.rotation.x = -0.15;
  group.add(hair);

  return { group, leftLeg, rightLeg, leftArm, rightArm };
}

export function createTreeMesh(
  mats: HospitalMaterialSet,
  scale = 1
): THREE.Group {
  const tree = new THREE.Group();

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.85 * scale, 20),
    mats.contactShadowMat
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  tree.add(shadow);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14 * scale, 0.22 * scale, 1.1 * scale, 10),
    mats.treeBark
  );
  trunk.position.y = 0.55 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  const puff1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.75 * scale, 16, 14),
    mats.foliageGreen
  );
  puff1.position.set(0, 1.45 * scale, 0);
  puff1.castShadow = true;
  tree.add(puff1);

  const puff2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.55 * scale, 14, 12),
    mats.foliageLight
  );
  puff2.position.set(0.38 * scale, 1.72 * scale, 0.2 * scale);
  tree.add(puff2);

  const puff3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5 * scale, 14, 12),
    mats.foliageLight
  );
  puff3.position.set(-0.35 * scale, 1.65 * scale, -0.22 * scale);
  tree.add(puff3);

  return tree;
}

export function createAmbulanceMesh(mats: HospitalMaterialSet): {
  amb: THREE.Group;
  sirenBarMat: THREE.MeshStandardMaterial;
} {
  const amb = new THREE.Group();

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.7),
    mats.contactShadowMat
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  amb.add(shadow);

  // Main rear box body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 1.15, 1.15),
    mats.whiteCoat
  );
  body.position.set(-0.25, 0.72, 0);
  body.castShadow = true;
  amb.add(body);

  // Orange emergency stripe
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.94, 0.22, 1.17),
    mats.terracotta
  );
  stripe.position.set(-0.25, 0.56, 0);
  amb.add(stripe);

  // Front cab
  const cab = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.9, 1.1),
    mats.whiteCoat
  );
  cab.position.set(1.02, 0.6, 0);
  cab.castShadow = true;
  amb.add(cab);

  // Windshield
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.42, 1.02),
    mats.windowGlass
  );
  windshield.position.set(1.24, 0.76, 0);
  amb.add(windshield);

  // Emergency siren light bar on roof with emissive capability for Night Mode
  const sirenBarMat = new THREE.MeshStandardMaterial({
    color: 0xe8612c,
    emissive: 0xe8612c,
    emissiveIntensity: 0.25,
    roughness: 0.3,
  });
  const lightBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.14, 0.64),
    sirenBarMat
  );
  lightBar.position.set(0.35, 1.36, 0);
  amb.add(lightBar);

  // 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.18, 16);
  wheelGeo.rotateX(Math.PI / 2);
  const wheelPositions: [number, number, number][] = [
    [-0.75, 0.26, 0.56],
    [-0.75, 0.26, -0.56],
    [0.95, 0.26, 0.56],
    [0.95, 0.26, -0.56],
  ];
  for (const [wx, wy, wz] of wheelPositions) {
    const wheel = new THREE.Mesh(wheelGeo, mats.darkCharcoal);
    wheel.position.set(wx, wy, wz);
    amb.add(wheel);
  }

  return { amb, sirenBarMat };
}

function createRoundedBoxShape(w: number, d: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const hd = d / 2;
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
  return shape;
}

export function createExteriorHospitalGroup(
  mats: HospitalMaterialSet,
  maxAnisotropy: number
): {
  exteriorGroup: THREE.Group;
  ambulance: THREE.Group;
  sirenBarMat: THREE.MeshStandardMaterial;
  roadCurve: THREE.CatmullRomCurve3;
  exteriorPatient: CharacterRig;
  entranceWalkCurve: THREE.CatmullRomCurve3;
} {
  const exteriorGroup = new THREE.Group();

  // Base ground plaza around building
  const plazaGeo = new THREE.ExtrudeGeometry(
    createRoundedBoxShape(28, 22, 3.0),
    { depth: 0.25, bevelEnabled: false }
  );
  plazaGeo.rotateX(-Math.PI / 2);
  const plaza = new THREE.Mesh(plazaGeo, mats.warmFloor);
  plaza.position.set(1, -0.22, 1);
  plaza.receiveShadow = true;
  exteriorGroup.add(plaza);

  // Main White/Cream Rounded Hospital Tower (Left/Center)
  const mainTowerShape = createRoundedBoxShape(9.2, 8.2, 1.4);
  const mainTowerGeo = new THREE.ExtrudeGeometry(mainTowerShape, {
    depth: 9.8,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.15,
    bevelThickness: 0.15,
  });
  mainTowerGeo.rotateX(-Math.PI / 2);
  const mainTower = new THREE.Mesh(mainTowerGeo, mats.creamWall);
  mainTower.position.set(-1.5, 0, -1.0);
  mainTower.castShadow = true;
  mainTower.receiveShadow = true;
  exteriorGroup.add(mainTower);

  // Rooftop coping & Nadi billboard sign
  const roofCapGeo = new THREE.ExtrudeGeometry(
    createRoundedBoxShape(8.4, 7.4, 1.2),
    { depth: 0.4, bevelEnabled: false }
  );
  roofCapGeo.rotateX(-Math.PI / 2);
  const roofCap = new THREE.Mesh(roofCapGeo, mats.peachBorder);
  roofCap.position.set(-1.5, 9.85, -1.0);
  exteriorGroup.add(roofCap);

  // "nadi." facade sign board
  const nadiSignTex = createNadiLogoTexture(maxAnisotropy);
  const nadiSignMat = new THREE.MeshStandardMaterial({
    map: nadiSignTex,
    roughness: 0.4,
  });
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 1.65, 0.22),
    nadiSignMat
  );
  signBoard.position.set(-1.8, 8.45, 3.15);
  exteriorGroup.add(signBoard);

  // Side nadi sign facing left-front camera
  const signBoardLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 1.65, 4.4),
    nadiSignMat
  );
  signBoardLeft.position.set(-6.15, 8.45, -0.8);
  exteriorGroup.add(signBoardLeft);

  // Architectural Windows Grid (Front & Left Facade)
  const windowFrameGeo = new THREE.BoxGeometry(1.15, 1.05, 0.22);
  const windowPaneGeo = new THREE.BoxGeometry(0.95, 0.85, 0.25);

  for (let floor = 0; floor < 4; floor++) {
    const wy = 2.4 + floor * 1.48;
    // Front Z facade windows
    for (let col = 0; col < 4; col++) {
      const wx = -4.1 + col * 1.72;
      const frame = new THREE.Mesh(windowFrameGeo, mats.darkCharcoal);
      frame.position.set(wx, wy, 3.22);
      const pane = new THREE.Mesh(
        windowPaneGeo,
        (floor + col) % 2 === 0 ? mats.warmWindowGlow : mats.windowGlass
      );
      pane.position.set(wx, wy, 3.24);
      exteriorGroup.add(frame, pane);
    }

    // Left X facade windows
    for (let col = 0; col < 4; col++) {
      const wz = -3.5 + col * 1.72;
      const frame = new THREE.Mesh(windowFrameGeo, mats.darkCharcoal);
      frame.rotation.y = Math.PI / 2;
      frame.position.set(-6.22, wy, wz);
      const pane = new THREE.Mesh(
        windowPaneGeo,
        (floor + col) % 3 === 0 ? mats.warmWindowGlow : mats.windowGlass
      );
      pane.rotation.y = Math.PI / 2;
      pane.position.set(-6.24, wy, wz);
      exteriorGroup.add(frame, pane);
    }
  }

  // Right Terracotta Orange Wing ("Rawat Pulih Bahagia")
  const orangeWingShape = createRoundedBoxShape(6.2, 7.6, 1.0);
  const orangeWingGeo = new THREE.ExtrudeGeometry(orangeWingShape, {
    depth: 12.2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.12,
    bevelThickness: 0.12,
  });
  orangeWingGeo.rotateX(-Math.PI / 2);
  const orangeWing = new THREE.Mesh(orangeWingGeo, mats.terracotta);
  orangeWing.position.set(4.8, 0, -2.2);
  orangeWing.castShadow = true;
  orangeWing.receiveShadow = true;
  exteriorGroup.add(orangeWing);

  // Vertical louvers on orange wing
  const louverGeo = new THREE.BoxGeometry(0.12, 11.4, 0.28);
  for (let i = 0; i < 6; i++) {
    const louver = new THREE.Mesh(louverGeo, mats.peachBorder);
    louver.position.set(4.4 + i * 0.58, 5.8, 1.68);
    exteriorGroup.add(louver);
  }

  // "Rawat Pulih Bahagia" banner plate on front-left of the orange tower
  const bannerTex = createOrangeBannerTexture(maxAnisotropy);
  const bannerPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 4.6),
    new THREE.MeshBasicMaterial({ map: bannerTex })
  );
  bannerPlane.position.set(3.05, 9.4, 1.76);
  exteriorGroup.add(bannerPlane);

  // Ground Entrance Canopy ("Gawat Darurat 24 Jam")
  const canopyTex = createEmergencyCanopyTexture(maxAnisotropy);
  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.72, 1.8),
    new THREE.MeshStandardMaterial({ map: canopyTex, roughness: 0.4 })
  );
  canopy.position.set(-1.6, 1.65, 3.6);
  canopy.castShadow = true;
  exteriorGroup.add(canopy);

  // Entrance glass doors
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 1.35, 0.25),
    mats.windowGlass
  );
  doorFrame.position.set(-1.6, 0.68, 3.15);
  exteriorGroup.add(doorFrame);

  // Lower right annex entrance block
  const annexGeo = new THREE.BoxGeometry(4.6, 3.4, 4.8);
  const annex = new THREE.Mesh(annexGeo, mats.creamWall);
  annex.position.set(2.6, 1.7, 2.4);
  annex.castShadow = true;
  annex.receiveShadow = true;
  exteriorGroup.add(annex);

  // Curved Asphalt Road in front of hospital
  const roadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8.5, 0.03, 5.5),
    new THREE.Vector3(-2.5, 0.03, 5.8),
    new THREE.Vector3(1.5, 0.03, 7.8),
    new THREE.Vector3(7.5, 0.03, 11.2),
    new THREE.Vector3(14.5, 0.03, 13.5),
  ]);
  const roadGeo = new THREE.TubeGeometry(roadCurve, 48, 1.45, 8, false);
  roadGeo.scale(1, 0.04, 1);
  const roadMesh = new THREE.Mesh(roadGeo, mats.asphaltRoad);
  roadMesh.receiveShadow = true;
  exteriorGroup.add(roadMesh);

  // Dashed white road markings
  for (let i = 1; i < 14; i++) {
    const t = i / 14;
    const pt = roadCurve.getPointAt(t);
    const tangent = roadCurve.getTangentAt(t);
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.02, 0.14),
      mats.roadStripe
    );
    dash.position.set(pt.x, 0.09, pt.z);
    dash.rotation.y = -Math.atan2(tangent.z, tangent.x);
    exteriorGroup.add(dash);
  }

  // Ambulance on road
  const { amb: ambulance, sirenBarMat } = createAmbulanceMesh(mats);
  const ambPt = roadCurve.getPointAt(0.56);
  const ambTan = roadCurve.getTangentAt(0.56);
  ambulance.position.set(ambPt.x, 0.08, ambPt.z);
  ambulance.rotation.y = -Math.atan2(ambTan.z, ambTan.x);
  exteriorGroup.add(ambulance);

  // Trees around exterior
  const treeCoords: [number, number, number][] = [
    [-7.4, 0, 2.8],
    [-8.6, 0, -1.2],
    [5.8, 0, 5.4],
    [7.8, 0, 3.8],
    [-4.8, 0, 8.2],
  ];
  treeCoords.forEach(([tx, ty, tz], idx) => {
    const t = createTreeMesh(mats, 0.85 + (idx % 3) * 0.15);
    t.position.set(tx, ty, tz);
    exteriorGroup.add(t);
  });

  // Entrance Walkway Path from sidewalk into the Hospital Main Doors
  const entranceWalkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.2, 0.04, 6.4),
    new THREE.Vector3(-2.3, 0.04, 4.9),
    new THREE.Vector3(-1.6, 0.04, 3.6),
    new THREE.Vector3(-1.6, 0.04, 2.2),
  ]);
  const entranceWalkGeo = new THREE.TubeGeometry(
    entranceWalkCurve,
    24,
    0.09,
    8,
    false
  );
  entranceWalkGeo.scale(1, 0.25, 1);
  const entranceWalkRibbon = new THREE.Mesh(entranceWalkGeo, mats.pathOrange);
  exteriorGroup.add(entranceWalkRibbon);

  // Exterior Hero Patient who walks into the hospital entrance when transitioning Gedung -> Pendaftaran
  const exteriorPatient = createCharacterMesh(mats, {
    shirtColor: 0xe8612c,
    pantsColor: 0x18181b,
  });
  const extStart = entranceWalkCurve.getPointAt(0);
  exteriorPatient.group.position.set(extStart.x, 0.04, extStart.z);
  exteriorPatient.group.rotation.y = Math.PI;
  exteriorGroup.add(exteriorPatient.group);

  const ped2 = createCharacterMesh(mats, { shirtColor: 0x10b981 });
  ped2.group.position.set(1.2, 0.04, 5.1);
  ped2.group.rotation.y = -0.8;
  exteriorGroup.add(ped2.group);

  return {
    exteriorGroup,
    ambulance,
    sirenBarMat,
    roadCurve,
    exteriorPatient,
    entranceWalkCurve,
  };
}

function createHotspotPin(
  x: number,
  y: number,
  z: number,
  hotspotId: string
): THREE.Mesh {
  const pinMat = new THREE.MeshBasicMaterial({
    color: 0xe8612c,
    transparent: true,
    opacity: 0.9,
  });
  const pin = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), pinMat);
  pin.position.set(x, y, z);
  pin.userData.hotspotId = hotspotId;
  pin.userData.baseY = y;
  return pin;
}

export function createInteriorHospitalGroup(
  mats: HospitalMaterialSet,
  maxAnisotropy: number
): {
  interiorGroup: THREE.Group;
  patientPathCurve: THREE.CatmullRomCurve3;
  stationU: [number, number, number, number, number, number];
  heroPatient: CharacterRig;
  patientHeldItem: THREE.Mesh;
  followRing: THREE.Mesh;
  queueTvMesh: THREE.Mesh;
  xrayScanBeam: THREE.Mesh;
  interactables: THREE.Object3D[];
  hotspotPins: THREE.Mesh[];
  staffRigs: {
    receptionist: CharacterRig;
    nurse: CharacterRig;
    doctor: CharacterRig;
    pharmacist: CharacterRig;
    labTech: CharacterRig;
    cashier: CharacterRig;
  };
  floor2Group: THREE.Group;
  floor3Group: THREE.Group;
} {
  const interiorGroup = new THREE.Group();
  const interactables: THREE.Object3D[] = [];
  const hotspotPins: THREE.Mesh[] = [];

  // Large Cutaway Floor Plan Slab with warm peach perimeter wall
  const floorShape = createRoundedBoxShape(28, 17, 2.4);
  const floorGeo = new THREE.ExtrudeGeometry(floorShape, {
    depth: 0.35,
    bevelEnabled: false,
  });
  floorGeo.rotateX(-Math.PI / 2);
  const floorSlab = new THREE.Mesh(floorGeo, mats.warmFloor);
  floorSlab.position.set(4.5, -0.32, 0.5);
  floorSlab.receiveShadow = true;
  interiorGroup.add(floorSlab);

  // Back & Right Perimeter Cutaway Walls
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(27.6, 3.6, 0.45),
    mats.creamWall
  );
  backWall.position.set(4.5, 1.8, -7.8);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  interiorGroup.add(backWall);

  const backWallTopTrim = new THREE.Mesh(
    new THREE.BoxGeometry(27.7, 0.18, 0.52),
    mats.peachBorder
  );
  backWallTopTrim.position.set(4.5, 3.65, -7.8);
  interiorGroup.add(backWallTopTrim);

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.45, 16.6),
    mats.peachBorder
  );
  leftWall.position.set(-9.2, 0.22, 0.5);
  leftWall.receiveShadow = true;
  interiorGroup.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 3.6, 16.6),
    mats.creamWall
  );
  rightWall.position.set(18.2, 1.8, 0.5);
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  interiorGroup.add(rightWall);

  const rightWallTopTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.18, 16.7),
    mats.peachBorder
  );
  rightWallTopTrim.position.set(18.2, 3.65, 0.5);
  interiorGroup.add(rightWallTopTrim);

  // Shortened Room Divider Walls (z = -7.8 to z = -2.2, leaving z > -2.2 as an open front corridor!)
  const divWall1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 3.5, 5.6),
    mats.creamWall
  );
  divWall1.position.set(-0.8, 1.75, -5.0);
  divWall1.castShadow = true;
  divWall1.receiveShadow = true;
  interiorGroup.add(divWall1);

  const divWall2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 3.5, 5.6),
    mats.creamWall
  );
  divWall2.position.set(5.6, 1.75, -5.0);
  divWall2.castShadow = true;
  divWall2.receiveShadow = true;
  interiorGroup.add(divWall2);

  const divWall3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 3.5, 5.2),
    mats.creamWall
  );
  divWall3.position.set(11.6, 1.75, -5.2);
  divWall3.castShadow = true;
  divWall3.receiveShadow = true;
  interiorGroup.add(divWall3);

  // =========================================================
  // COLLISION-FREE ORANGE FLOOR GUIDE LINE (Pendaftaran -> Kasir)
  // =========================================================
  const patientPathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6.5, 0.04, 4.8), // Step 0: Entrance threshold
    new THREE.Vector3(-5.2, 0.04, -2.6), // Step 1: Pendaftaran Desk
    new THREE.Vector3(-3.4, 0.04, 2.3), // Corridor exit from Pendaftaran
    new THREE.Vector3(-0.2, 0.04, 2.3), // Open corridor crossing divWall1 (z = +2.3 vs wall z = -2.2)
    new THREE.Vector3(1.6, 0.04, -1.6), // Step 2: Poliklinik Triage & Doctor
    new THREE.Vector3(3.6, 0.04, 2.3), // Corridor exit from Poliklinik
    new THREE.Vector3(6.4, 0.04, 2.3), // Open corridor crossing divWall2 (z = +2.3 vs wall z = -2.2)
    new THREE.Vector3(9.2, 0.04, -4.2), // Step 3: Lab & Radiologi X-Ray
    new THREE.Vector3(10.0, 0.04, 3.5), // Open corridor exit to Farmasi
    new THREE.Vector3(12.4, 0.04, 3.6), // Step 4: Farmasi Counter
    new THREE.Vector3(15.8, 0.04, 4.1), // Step 5: Kasir Counter
  ]);

  // Precompute exact arc-length parameter u (0..1) for each of the 6 stages so the patient stops
  // on the exact millimeter of every station!
  const stationCoords: [number, number][] = [
    [-6.5, 4.8],
    [-5.2, -2.6],
    [1.6, -1.6],
    [9.2, -4.2],
    [12.4, 3.6],
    [15.8, 4.1],
  ];
  const samplePt = new THREE.Vector3();
  const stationU: [number, number, number, number, number, number] = [
    0, 0.15, 0.42, 0.7, 0.88, 1,
  ];
  for (let sIdx = 1; sIdx <= 4; sIdx++) {
    const [tx, tz] = stationCoords[sIdx];
    let bestU = stationU[sIdx];
    let bestDistSq = Infinity;
    for (let k = 0; k <= 400; k++) {
      const u = k / 400;
      patientPathCurve.getPointAt(u, samplePt);
      const dSq = (samplePt.x - tx) ** 2 + (samplePt.z - tz) ** 2;
      if (dSq < bestDistSq) {
        bestDistSq = dSq;
        bestU = u;
      }
    }
    stationU[sIdx] = bestU;
  }

  const pathTubeGeo = new THREE.TubeGeometry(
    patientPathCurve,
    120,
    0.11,
    8,
    false
  );
  pathTubeGeo.scale(1, 0.25, 1);
  const pathRibbon = new THREE.Mesh(pathTubeGeo, mats.pathOrange);
  interiorGroup.add(pathRibbon);

  // Station Floor Marker Discs at each of the 5 stations
  for (let sIdx = 1; sIdx <= 5; sIdx++) {
    const [sx, sz] = stationCoords[sIdx];
    const pad = new THREE.Mesh(
      new THREE.CircleGeometry(0.46, 24),
      new THREE.MeshBasicMaterial({
        color: 0xe8612c,
        transparent: true,
        opacity: 0.22,
      })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(sx, 0.025, sz);
    interiorGroup.add(pad);
  }

  // =========================================================
  // ZONE 1: PENDAFTARAN (x: -8.5 to -1.0, z: -7.5 to 3.5)
  // =========================================================
  const signPendaftaran = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.78, 0.15),
    new THREE.MeshStandardMaterial({
      map: createRoomSignTexture(
        'PENDAFTARAN',
        '#E8612C',
        '#FFFFFF',
        true,
        maxAnisotropy
      ),
      roughness: 0.4,
    })
  );
  signPendaftaran.position.set(-5.2, 3.05, -7.45);
  interiorGroup.add(signPendaftaran);

  // Reception Desk Counter
  const receptionDesk = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 1.05, 1.15),
    mats.woodDesk
  );
  receptionDesk.position.set(-5.2, 0.52, -4.4);
  receptionDesk.castShadow = true;
  receptionDesk.receiveShadow = true;
  receptionDesk.userData.hotspotId = 'pendaftaran-tv';
  interiorGroup.add(receptionDesk);
  interactables.push(receptionDesk);

  const receptionFrontPanel = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.65, 0.08),
    mats.creamWall
  );
  receptionFrontPanel.position.set(-5.2, 0.48, -3.8);
  interiorGroup.add(receptionFrontPanel);

  // 2 Staff & Monitors behind Reception
  const receptionStaffList: CharacterRig[] = [];
  [-6.2, -4.2].forEach((sx) => {
    const staff = createCharacterMesh(mats, {
      shirtColor: 0x2563eb,
      seated: true,
    });
    staff.group.position.set(sx, 0, -5.4);
    interiorGroup.add(staff.group);
    receptionStaffList.push(staff);

    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.42, 0.08),
      mats.darkCharcoal
    );
    monitor.position.set(sx, 1.28, -4.3);
    interiorGroup.add(monitor);
  });

  // Wall Queue TV Screen ("NOMOR ANTREAN A-012 | LOKET 2")
  const queueTvMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 1.05, 0.14),
    new THREE.MeshBasicMaterial({
      map: createQueueScreenTexture('A-012', '2', maxAnisotropy),
    })
  );
  queueTvMesh.position.set(-1.1, 2.25, -4.4);
  queueTvMesh.rotation.y = -Math.PI / 2;
  queueTvMesh.userData.hotspotId = 'pendaftaran-tv';
  interiorGroup.add(queueTvMesh);
  interactables.push(queueTvMesh);

  const pinPendaftaran = createHotspotPin(-1.1, 3.1, -4.4, 'pendaftaran-tv');
  interiorGroup.add(pinPendaftaran);
  interactables.push(pinPendaftaran);
  hotspotPins.push(pinPendaftaran);

  // Waiting Chairs in Pendaftaran (placed neatly to the left so the corridor is clear)
  [-7.6, -6.4].forEach((cx, idx) => {
    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.48, 0.72),
      idx === 1 ? mats.terracotta : mats.peachBorder
    );
    chair.position.set(cx, 0.24, 1.2);
    chair.castShadow = true;
    interiorGroup.add(chair);

    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.55, 0.15),
      idx === 1 ? mats.terracotta : mats.peachBorder
    );
    backrest.position.set(cx, 0.62, 1.48);
    interiorGroup.add(backrest);

    if (idx === 0) {
      const waitingPerson = createCharacterMesh(mats, {
        shirtColor: 0x0f766e,
        seated: true,
      });
      waitingPerson.group.position.set(cx, 0.15, 1.15);
      waitingPerson.group.rotation.y = Math.PI;
      interiorGroup.add(waitingPerson.group);
    }
  });

  // =========================================================
  // ZONE 2: POLIKLINIK (x: -0.5 to 5.4, z: -7.5 to 2.5)
  // =========================================================
  const signPoliklinik = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.78, 0.15),
    new THREE.MeshStandardMaterial({
      map: createRoomSignTexture(
        'POLIKLINIK',
        '#E8612C',
        '#FFFFFF',
        true,
        maxAnisotropy
      ),
      roughness: 0.4,
    })
  );
  signPoliklinik.position.set(2.4, 3.05, -7.45);
  interiorGroup.add(signPoliklinik);

  // Nurse Triage Scale & Vitals Monitor ("118/76")
  const scaleBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.08, 0.65),
    mats.darkCharcoal
  );
  scaleBase.position.set(0.2, 0.04, -1.8);
  interiorGroup.add(scaleBase);

  const scalePillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.65, 10),
    mats.metalChrome
  );
  scalePillar.position.set(0.2, 0.85, -2.05);
  interiorGroup.add(scalePillar);

  const vitalsScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.52, 0.12),
    new THREE.MeshBasicMaterial({
      map: createVitalsTagTexture(maxAnisotropy),
    })
  );
  vitalsScreen.position.set(0.2, 1.82, -2.05);
  vitalsScreen.userData.hotspotId = 'poliklinik-vitals';
  interiorGroup.add(vitalsScreen);
  interactables.push(vitalsScreen);

  const pinPoliklinik = createHotspotPin(0.2, 2.45, -2.05, 'poliklinik-vitals');
  interiorGroup.add(pinPoliklinik);
  interactables.push(pinPoliklinik);
  hotspotPins.push(pinPoliklinik);

  // Nurse in teal scrubs facing the patient at (1.6, -1.6)
  const nurse = createCharacterMesh(mats, { shirtColor: 0x0d9488 });
  nurse.group.position.set(0.65, 0, -2.35);
  nurse.group.rotation.y = Math.PI * 0.25;
  interiorGroup.add(nurse.group);

  // Doctor Consultation Desk & Exam Bed
  const docDesk = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.82, 1.0),
    mats.woodDesk
  );
  docDesk.position.set(3.2, 0.41, -4.8);
  docDesk.castShadow = true;
  docDesk.userData.hotspotId = 'poliklinik-vitals';
  interiorGroup.add(docDesk);
  interactables.push(docDesk);

  const doctorChar = createCharacterMesh(mats, {
    shirtColor: 0xfaf8f5,
    seated: true,
  });
  doctorChar.group.position.set(3.2, 0, -5.6);
  interiorGroup.add(doctorChar.group);

  // Medical Exam Bed
  const examBed = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.65, 2.2),
    mats.whiteCoat
  );
  examBed.position.set(4.5, 0.33, -2.8);
  examBed.castShadow = true;
  interiorGroup.add(examBed);

  const bedBlanket = new THREE.Mesh(
    new THREE.BoxGeometry(1.12, 0.14, 1.1),
    mats.terracotta
  );
  bedBlanket.position.set(4.5, 0.68, -2.35);
  interiorGroup.add(bedBlanket);

  // =========================================================
  // ZONE 3: LABORATORIUM & RADIOLOGI (x: 5.8 to 11.5)
  // =========================================================
  const signLab = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 0.72, 0.15),
    new THREE.MeshStandardMaterial({
      map: createRoomSignTexture(
        'LABORATORIUM',
        '#E8612C',
        '#FFFFFF',
        true,
        maxAnisotropy
      ),
      roughness: 0.4,
    })
  );
  signLab.position.set(7.6, 3.05, -7.45);
  interiorGroup.add(signLab);

  const signRadiologi = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.72, 0.15),
    new THREE.MeshStandardMaterial({
      map: createRoomSignTexture(
        'RADIOLOGI',
        '#F3A683',
        '#FFFFFF',
        false,
        maxAnisotropy
      ),
      roughness: 0.4,
    })
  );
  signRadiologi.position.set(10.6, 3.05, -7.45);
  interiorGroup.add(signRadiologi);

  // Lab Counter & Equipment
  const labBench = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.9, 0.95),
    mats.whiteCoat
  );
  labBench.position.set(7.3, 0.45, -5.4);
  labBench.castShadow = true;
  labBench.userData.hotspotId = 'radiologi-xray';
  interiorGroup.add(labBench);
  interactables.push(labBench);

  const labTech = createCharacterMesh(mats, { shirtColor: 0xfaf8f5 });
  labTech.group.position.set(7.3, 0, -6.2);
  interiorGroup.add(labTech.group);

  // Radiology Chest X-Ray Stand positioned at (9.6, -5.6) right in front of Stage 3 waypoint (9.2, -4.2)
  const xrayBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 1.45, 0.16),
    mats.darkCharcoal
  );
  xrayBoard.position.set(9.6, 1.35, -5.6);
  xrayBoard.userData.hotspotId = 'radiologi-xray';
  interiorGroup.add(xrayBoard);
  interactables.push(xrayBoard);

  // Animated Glowing X-Ray Scan Laser Bar
  const xrayScanBeam = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.07, 0.2),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
    })
  );
  xrayScanBeam.position.set(9.6, 1.35, -5.54);
  interiorGroup.add(xrayScanBeam);

  const pinRadiologi = createHotspotPin(9.6, 2.55, -5.6, 'radiologi-xray');
  interiorGroup.add(pinRadiologi);
  interactables.push(pinRadiologi);
  hotspotPins.push(pinRadiologi);

  const xrayPillar = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 2.4, 0.22),
    mats.metalChrome
  );
  xrayPillar.position.set(9.6, 1.2, -5.8);
  interiorGroup.add(xrayPillar);

  // =========================================================
  // ZONE 4 & 5: FARMASI & KASIR (x: 11.8 to 17.5, z: -2.0 to 7.0)
  // =========================================================
  // Medicine Shelving Back Wall (placed at z = -1.6 so the corridor is 100% unobstructed)
  const shelfCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 2.8, 0.55),
    mats.whiteCoat
  );
  shelfCabinet.position.set(13.2, 1.4, -1.6);
  shelfCabinet.castShadow = true;
  shelfCabinet.userData.hotspotId = 'farmasi-shelf';
  interiorGroup.add(shelfCabinet);
  interactables.push(shelfCabinet);

  const pinFarmasi = createHotspotPin(13.2, 3.15, -1.6, 'farmasi-shelf');
  interiorGroup.add(pinFarmasi);
  interactables.push(pinFarmasi);
  hotspotPins.push(pinFarmasi);

  const medColors = [0xe8612c, 0x10b981, 0x3b82f6, 0xf59e0b, 0xec4899, 0x8b5cf6];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const boxMat = new THREE.MeshStandardMaterial({
        color: medColors[(row * 7 + col) % medColors.length],
        roughness: 0.4,
      });
      const medBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.34, 0.26),
        boxMat
      );
      medBox.position.set(11.7 + col * 0.48, 0.65 + row * 0.55, -1.32);
      interiorGroup.add(medBox);
    }
  }

  // Farmasi Counter at (12.4, 2.0) facing patient at (12.4, 3.6)
  const farmasiCounter = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.0, 1.0),
    mats.creamWall
  );
  farmasiCounter.position.set(12.4, 0.5, 2.0);
  farmasiCounter.castShadow = true;
  farmasiCounter.userData.hotspotId = 'farmasi-shelf';
  interiorGroup.add(farmasiCounter);
  interactables.push(farmasiCounter);

  const farmasiTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 0.12, 1.1),
    mats.woodDesk
  );
  farmasiTop.position.set(12.4, 1.04, 2.0);
  interiorGroup.add(farmasiTop);

  const farmasiSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.45),
    new THREE.MeshBasicMaterial({
      map: createRoomSignTexture(
        'FARMASI',
        '#FAF6EE',
        '#78716C',
        false,
        maxAnisotropy
      ),
    })
  );
  farmasiSign.position.set(12.4, 0.52, 2.52);
  interiorGroup.add(farmasiSign);

  const pharmacist = createCharacterMesh(mats, { shirtColor: 0xfaf8f5 });
  pharmacist.group.position.set(12.4, 0, 1.05);
  interiorGroup.add(pharmacist.group);

  // Kasir Counter at (15.8, 2.5) facing patient at (15.8, 4.1)
  const kasirCounter = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.0, 1.0),
    mats.creamWall
  );
  kasirCounter.position.set(15.8, 0.5, 2.5);
  kasirCounter.castShadow = true;
  kasirCounter.userData.hotspotId = 'kasir-pos';
  interiorGroup.add(kasirCounter);
  interactables.push(kasirCounter);

  const pinKasir = createHotspotPin(15.8, 2.15, 2.5, 'kasir-pos');
  interiorGroup.add(pinKasir);
  interactables.push(pinKasir);
  hotspotPins.push(pinKasir);

  const kasirTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.7, 0.12, 1.1),
    mats.woodDesk
  );
  kasirTop.position.set(15.8, 1.04, 2.5);
  interiorGroup.add(kasirTop);

  const kasirSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.45),
    new THREE.MeshBasicMaterial({
      map: createRoomSignTexture(
        'KASIR',
        '#18181B',
        '#FFFFFF',
        false,
        maxAnisotropy
      ),
    })
  );
  kasirSign.position.set(15.8, 0.52, 3.02);
  interiorGroup.add(kasirSign);

  const cashier = createCharacterMesh(mats, { shirtColor: 0x18181b });
  cashier.group.position.set(15.8, 0, 1.55);
  interiorGroup.add(cashier.group);

  // Indoor plant near Farmasi/Kasir
  const indoorPlant = createTreeMesh(mats, 0.65);
  indoorPlant.position.set(8.6, 0, 5.6);
  interiorGroup.add(indoorPlant);

  // =========================================================
  // MULTI-FLOOR SPECIALIST STATIONS (LANTAI 2 & LANTAI 3)
  // =========================================================
  const floor2Group = new THREE.Group();
  floor2Group.visible = false;

  // Lantai 2 Sign: PUSAT JANTUNG & USG 4D
  const signJantung = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.82, 0.18),
    new THREE.MeshStandardMaterial({
      map: createRoomSignTexture(
        'L2 · JANTUNG & IBU-ANAK',
        '#18181B',
        '#FFFFFF',
        true,
        maxAnisotropy
      ),
      roughness: 0.35,
    })
  );
  signJantung.position.set(2.4, 3.92, -7.35);
  floor2Group.add(signJantung);

  // Cardiac Treadmill EKG Station in Zone 2
  const treadmillDeck = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.16, 2.1),
    mats.darkCharcoal
  );
  treadmillDeck.position.set(1.8, 0.1, 0.8);
  floor2Group.add(treadmillDeck);

  const treadmillConsole = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.15, 0.25),
    mats.metalChrome
  );
  treadmillConsole.position.set(1.8, 0.65, -0.15);
  floor2Group.add(treadmillConsole);

  // 4D Ultrasound (USG) Pod in Zone 3
  const usgPod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.65, 1.35, 16),
    mats.whiteCoat
  );
  usgPod.position.set(6.8, 0.68, 0.9);
  floor2Group.add(usgPod);

  const usgScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.58, 0.1),
    new THREE.MeshBasicMaterial({ color: 0x10b981 })
  );
  usgScreen.position.set(6.8, 1.62, 0.9);
  floor2Group.add(usgScreen);

  interiorGroup.add(floor2Group);

  // Lantai 3 Group: ORTOPEDI, SARAF & REHAB MEDIS
  const floor3Group = new THREE.Group();
  floor3Group.visible = false;

  const signOrtopedi = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 0.82, 0.18),
    new THREE.MeshStandardMaterial({
      map: createRoomSignTexture(
        'L3 · ORTOPEDI & REHAB',
        '#0F766E',
        '#FFFFFF',
        true,
        maxAnisotropy
      ),
      roughness: 0.35,
    })
  );
  signOrtopedi.position.set(2.4, 3.92, -7.35);
  floor3Group.add(signOrtopedi);

  // Parallel Bar Gait Rehabilitation Track
  const rehabMat = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.08, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.6 })
  );
  rehabMat.position.set(3.2, 0.05, 1.1);
  floor3Group.add(rehabMat);

  [-0.55, 0.55].forEach((rz) => {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.08, 0.08),
      mats.metalChrome
    );
    rail.position.set(3.2, 0.88, 1.1 + rz);
    floor3Group.add(rail);
  });

  interiorGroup.add(floor3Group);

  // Hero Patient Character (walks along the orange path!)
  const heroPatient = createCharacterMesh(mats, {
    shirtColor: 0xe8612c,
    pantsColor: 0x18181b,
  });
  const startPt = patientPathCurve.getPointAt(stationU[1]);
  heroPatient.group.position.set(startPt.x, 0, startPt.z);
  interiorGroup.add(heroPatient.group);

  // Held interactive item attached to heroPatient's right hand (E-Ticket Phone / Medicine Box)
  const patientHeldItem = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.24, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    })
  );
  patientHeldItem.position.set(0, -0.22, 0.14);
  patientHeldItem.visible = false;
  heroPatient.rightArm.add(patientHeldItem);

  // Subtle floor follow-ring around the walking patient
  const followRing = new THREE.Mesh(
    new THREE.RingGeometry(0.44, 0.6, 28),
    new THREE.MeshBasicMaterial({
      color: 0xe8612c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    })
  );
  followRing.rotation.x = -Math.PI / 2;
  followRing.position.set(startPt.x, 0.03, startPt.z);
  interiorGroup.add(followRing);

  return {
    interiorGroup,
    patientPathCurve,
    stationU,
    heroPatient,
    patientHeldItem,
    followRing,
    queueTvMesh,
    xrayScanBeam,
    interactables,
    hotspotPins,
    staffRigs: {
      receptionist: receptionStaffList[1] || receptionStaffList[0],
      nurse,
      doctor: doctorChar,
      pharmacist,
      labTech,
      cashier,
    },
    floor2Group,
    floor3Group,
  };
}
