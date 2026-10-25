import * as React from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TOUR_STEPS } from './data';
import {
  computeDayNightCycleState,
  getFloorConfig,
  interpolateTourCameraState,
  type FloorId,
} from './booking-logic';
import {
  createHospitalMaterials,
  createQueueScreenTexture,
  detectSoftwareGl,
} from './three-materials';
import {
  createExteriorHospitalGroup,
  createInteriorHospitalGroup,
} from './three-builders';
import { HospitalAmbientAudioEngine } from './hospital-ambient-audio';

export interface HospitalSceneCanvasProps {
  activeStep: number;
  continuousStepRef: React.MutableRefObject<number>;
  followCamTight?: boolean;
  activeFloor?: FloorId;
  isNightMode?: boolean;
  timeOfDayHour?: number;
  ambientAudioEnabled?: boolean;
  activeQueueCode?: string;
  selectedHotspotId?: boolean | string | null;
  onSelectHotspot?: (hotspotId: string | null) => void;
  selectedInfoPointId?: string | null;
  onSelectInfoPoint?: (infoPointId: string | null) => void;
}

// Pre-allocated math objects outside render loop (zero GC in tick)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(
  TOUR_STEPS[0].cameraTarget[0],
  TOUR_STEPS[0].cameraTarget[1],
  TOUR_STEPS[0].cameraTarget[2]
);
const _patientPoint = new THREE.Vector3();
const _patientTangent = new THREE.Vector3();
const _extPatientPoint = new THREE.Vector3();
const _extPatientTangent = new THREE.Vector3();
const _ambPoint = new THREE.Vector3();
const _ambTangent = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _projVec = new THREE.Vector3();
const _daySkyColor = new THREE.Color(0xf6f2ea);
const _nightSkyColor = new THREE.Color(0x131926);
const _dayGroundColor = new THREE.Color(0xf4efe4);
const _nightGroundColor = new THREE.Color(0x182030);
const _dayRimColor = new THREE.Color(0xfde6d2);
const _nightRimColor = new THREE.Color(0x60a5fa);

// Exact facing angles for the patient at each of the 5 interior stations
const STATION_FACING_ANGLES: Record<number, number> = {
  1: Math.PI, // Pendaftaran: faces Reception Desk (-Z)
  2: -Math.PI * 0.72, // Poliklinik: faces Nurse Triage & Doctor (-X / -Z)
  3: Math.PI, // Lab & Radiologi: faces Chest X-Ray & Lab (-Z)
  4: Math.PI, // Farmasi: faces Farmasi Counter (-Z)
  5: Math.PI, // Kasir: faces Kasir Counter (-Z)
};

function dampAngle(
  current: number,
  target: number,
  lambda: number,
  dt: number
): number {
  let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function HospitalSceneCanvas({
  activeStep,
  continuousStepRef,
  followCamTight = false,
  activeFloor = 1,
  isNightMode = false,
  timeOfDayHour,
  ambientAudioEnabled = true,
  activeQueueCode = 'A-012',
  selectedHotspotId = null,
  onSelectHotspot,
  selectedInfoPointId = null,
  onSelectInfoPoint,
}: HospitalSceneCanvasProps) {
  const mountRef = React.useRef<HTMLDivElement | null>(null);
  const ambientAudioRef = React.useRef<HospitalAmbientAudioEngine | null>(null);
  const queueTvRef = React.useRef<{
    mesh: THREE.Mesh;
    maxAnisotropy: number;
  } | null>(null);

  const effectiveHour =
    timeOfDayHour !== undefined ? timeOfDayHour : isNightMode ? 21.5 : 12.0;

  const stateRef = React.useRef({
    activeStep,
    followCamTight,
    activeFloor,
    isNightMode,
    effectiveHour,
    ambientAudioEnabled,
    selectedHotspotId,
    onSelectHotspot,
    selectedInfoPointId,
    onSelectInfoPoint,
  });

  React.useEffect(() => {
    stateRef.current.activeStep = activeStep;
    stateRef.current.followCamTight = followCamTight;
    stateRef.current.activeFloor = activeFloor;
    stateRef.current.isNightMode = isNightMode;
    stateRef.current.effectiveHour = effectiveHour;
    stateRef.current.ambientAudioEnabled = ambientAudioEnabled;
    stateRef.current.selectedHotspotId = selectedHotspotId;
    stateRef.current.onSelectHotspot = onSelectHotspot;
    stateRef.current.selectedInfoPointId = selectedInfoPointId;
    stateRef.current.onSelectInfoPoint = onSelectInfoPoint;
    if (ambientAudioEnabled && ambientAudioRef.current) {
      ambientAudioRef.current.ensureInitialized();
    }
  }, [
    activeStep,
    followCamTight,
    activeFloor,
    isNightMode,
    effectiveHour,
    ambientAudioEnabled,
    selectedHotspotId,
    onSelectHotspot,
    selectedInfoPointId,
    onSelectInfoPoint,
  ]);

  // Dynamically update 3D Pendaftaran Queue TV texture when activeQueueCode changes!
  React.useEffect(() => {
    const tvEntry = queueTvRef.current;
    if (!tvEntry) return;
    const mat = tvEntry.mesh.material as THREE.MeshBasicMaterial;
    const oldMap = mat.map;
    const nextTex = createQueueScreenTexture(
      activeQueueCode,
      '2',
      tvEntry.maxAnisotropy
    );
    mat.map = nextTex;
    mat.needsUpdate = true;
    if (oldMap) {
      oldMap.dispose();
    }
  }, [activeQueueCode]);

  React.useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const ambientEngine = new HospitalAmbientAudioEngine();
    ambientAudioRef.current = ambientEngine;

    const handleUnlockAudio = () => {
      if (stateRef.current.ambientAudioEnabled) {
        ambientEngine.ensureInitialized();
      }
    };
    window.addEventListener('pointerdown', handleUnlockAudio, { passive: true });
    window.addEventListener('wheel', handleUnlockAudio, { passive: true });
    window.addEventListener('keydown', handleUnlockAudio, { passive: true });

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0xf6f2ea);
    scene.background = bgColor;
    const sceneFog = new THREE.FogExp2(0xf6f2ea, 0.011);
    scene.fog = sceneFog;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.5, 140);
    camera.position.set(
      TOUR_STEPS[0].cameraPos[0],
      TOUR_STEPS[0].cameraPos[1],
      TOUR_STEPS[0].cameraPos[2]
    );
    camera.lookAt(_currentLookAt);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio environment reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    // Warm/Cool Studio & Dynamic Day-Night Cycle Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff8eb, 0xe5dec9, 0.8);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 1.55);
    keyLight.position.set(16, 28, 20);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    const d = 22;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 65;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfde6d2, 0.65);
    rimLight.position.set(-18, 15, -14);
    scene.add(rimLight);

    // Infinite ground plane matching warm ivory background
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf4efe4,
      roughness: 0.92,
      metalness: 0.0,
    });
    const groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 180),
      groundMat
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.32;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const mats = createHospitalMaterials(isSoftwareGl);

    // Build Exterior & Interior Cutaway Groups
    const {
      exteriorGroup,
      ambulance,
      sirenBarMat,
      roadCurve,
      exteriorPatient,
      entranceWalkCurve,
      exteriorInteractables,
      exteriorInfoPoints,
    } = createExteriorHospitalGroup(mats, maxAnisotropy);
    exteriorGroup.position.set(2.0, 0, 0);
    scene.add(exteriorGroup);

    const {
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
      infoPointGroups,
      staffRigs,
      floor2Group,
      floor3Group,
    } = createInteriorHospitalGroup(mats, maxAnisotropy);
    interiorGroup.position.set(0, -18, 0);
    interiorGroup.visible = false;
    scene.add(interiorGroup);

    const followRingMat = followRing.material as THREE.MeshBasicMaterial;
    const heldItemMat = patientHeldItem.material as THREE.MeshStandardMaterial;

    queueTvRef.current = { mesh: queueTvMesh, maxAnisotropy };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Subtle pointer parallax + throttled 3D raycasting for both hotspots & 3D floating info points
    let pointerNormX = 0;
    let pointerNormY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let lastRaycastTime = 0;
    let hoveredHotspotId: string | null = null;
    let hoveredInfoPointId: string | null = null;
    let smoothInterior = 0;

    const getActiveInteractables = () => {
      if (smoothInterior < 0.35) return exteriorInteractables;
      if (smoothInterior < 0.85) {
        return [...exteriorInteractables, ...interactables];
      }
      return interactables;
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerNormX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerNormY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;

      const now = performance.now();
      if (now - lastRaycastTime < 65) return;
      lastRaycastTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      _pointerNdc.y =
        -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;

      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(getActiveInteractables(), false);
      const hitObj = hits.length > 0 ? hits[0].object : null;
      const nextInfoHover =
        (hitObj?.userData.infoPointId as string | undefined) ?? null;
      const nextHotspotHover =
        (hitObj?.userData.hotspotId as string | undefined) ?? null;

      if (
        nextInfoHover !== hoveredInfoPointId ||
        nextHotspotHover !== hoveredHotspotId
      ) {
        hoveredInfoPointId = nextInfoHover;
        hoveredHotspotId = nextHotspotHover;
        container.style.cursor =
          hoveredInfoPointId || hoveredHotspotId ? 'pointer' : 'default';
      }
    };

    let downX = 0;
    let downY = 0;
    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      _pointerNdc.y =
        -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;

      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(getActiveInteractables(), false);
      if (hits.length > 0) {
        const hitInfoId = hits[0].object.userData.infoPointId as
          | string
          | undefined;
        if (hitInfoId) {
          stateRef.current.onSelectInfoPoint?.(hitInfoId);
          return;
        }
        const hitId = hits[0].object.userData.hotspotId as string | undefined;
        if (hitId && smoothInterior >= 0.35) {
          stateRef.current.onSelectHotspot?.(hitId);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointerup', handlePointerUp);

    let smoothedStep = continuousStepRef.current;
    let currentPatientT = stationU[0];
    let currentExtPatientT = 0;
    let currentBankZ = 0;
    let currentFov = 34;
    let smoothHour = stateRef.current.effectiveHour;
    let smoothFloorElevation = getFloorConfig(
      stateRef.current.activeFloor
    ).cameraElevationOffset;

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (disposed) return;
      const rawDt = clock.getDelta();
      const dt = isSoftwareGl
        ? Math.min(Math.max(rawDt, 0.09), 0.18)
        : Math.min(rawDt, 0.06);
      const elapsed = clock.getElapsedTime();

      // 0. Dynamic 24-Hour Day-Night Cycle Atmosphere, Sun/Moon Trajectory & Lighting Interpolation
      const targetHour = stateRef.current.effectiveHour;
      let hourDiff = ((targetHour - smoothHour + 12) % 24) - 12;
      if (hourDiff < -12) hourDiff += 24;
      smoothHour =
        (smoothHour +
          hourDiff * (1 - Math.exp(-(isSoftwareGl ? 8.5 : 5.0) * dt)) +
          24) %
        24;

      const cycle = computeDayNightCycleState(smoothHour);
      bgColor.setHex(cycle.skyBgColorHex);
      sceneFog.color.copy(bgColor);
      groundMat.color.setHex(cycle.groundColorHex);

      ambientLight.color.setHex(cycle.ambientColorHex);
      ambientLight.intensity = cycle.ambientIntensity * 0.38;

      hemiLight.color.setHex(cycle.hemiSkyColorHex);
      hemiLight.groundColor.setHex(cycle.hemiGroundColorHex);
      hemiLight.intensity = cycle.hemiIntensity * 0.82;

      keyLight.color.setHex(cycle.directionalColorHex);
      keyLight.intensity = cycle.directionalIntensity;
      keyLight.position.set(
        cycle.sunPosition[0],
        cycle.sunPosition[1],
        cycle.sunPosition[2]
      );

      rimLight.color.setHex(cycle.rimColorHex);
      rimLight.intensity = cycle.rimIntensity;

      mats.warmWindowGlow.emissiveIntensity = cycle.windowGlowIntensity;

      // Pulse ambulance siren dynamically during Dusk & Night
      sirenBarMat.emissiveIntensity =
        0.25 + cycle.nightFactor * (0.9 + Math.sin(elapsed * 12.0) * 0.65);

      if (container) {
        container.dataset.timePhase = cycle.phaseId;
        container.dataset.timeFormatted = cycle.formattedTime;
        container.dataset.ambientLightIntensity = String(cycle.ambientIntensity);
        container.dataset.directionalLightIntensity = String(
          cycle.directionalIntensity
        );
        container.dataset.sunPosX = String(cycle.sunPosition[0]);
        container.dataset.sunPosY = String(cycle.sunPosition[1]);
      }

      // 1. Smoothly damp continuous scroll/tour progress
      const targetContinuous = continuousStepRef.current;
      const prevSmoothedStep = smoothedStep;
      smoothedStep = THREE.MathUtils.damp(
        smoothedStep,
        targetContinuous,
        isSoftwareGl ? 8.5 : 5.5,
        dt
      );
      const stepVelocity =
        (smoothedStep - prevSmoothedStep) / Math.max(dt, 0.001);

      // 2. Compute continuous interpolated camera & stage state
      const interp = interpolateTourCameraState(smoothedStep);

      smoothInterior = THREE.MathUtils.damp(
        smoothInterior,
        interp.interiorFactor,
        isSoftwareGl ? 9.5 : 6.0,
        dt
      );

      // Smooth Multi-Floor Switcher (Lantai 1 / 2 / 3)
      const activeFloorNum = stateRef.current.activeFloor;
      const targetFloorOffset =
        getFloorConfig(activeFloorNum).cameraElevationOffset;
      smoothFloorElevation = THREE.MathUtils.damp(
        smoothFloorElevation,
        targetFloorOffset,
        isSoftwareGl ? 8.5 : 5.5,
        dt
      );
      floor2Group.visible = smoothInterior > 0.25 && activeFloorNum === 2;
      floor3Group.visible = smoothInterior > 0.25 && activeFloorNum === 3;

      // Smooth exterior cutaway lift & interior rise
      exteriorGroup.visible = smoothInterior < 0.97;
      exteriorGroup.position.y = smoothInterior * 16.5;

      interiorGroup.visible = smoothInterior > 0.03;
      interiorGroup.position.y = (1 - smoothInterior) * -10.5;

      // 3. Exterior Ambulance & Exterior Patient Walking into the Hospital Entrance!
      if (exteriorGroup.visible) {
        const ambT = 0.25 + ((elapsed * 0.055) % 0.65);
        roadCurve.getPointAt(ambT, _ambPoint);
        roadCurve.getTangentAt(ambT, _ambTangent);
        ambulance.position.set(
          _ambPoint.x,
          0.08 + Math.sin(elapsed * 5.0) * 0.012,
          _ambPoint.z
        );
        ambulance.rotation.y = -Math.atan2(_ambTangent.z, _ambTangent.x);

        // Exterior Patient walks from front walkway into the main doors when moving from Gedung -> Pendaftaran
        // Also has a gentle continuous walk-in cycle when viewing Step 0 so the user sees them walking!
        const targetExtT =
          smoothedStep > 0.02
            ? interp.exteriorWalkProgress
            : (elapsed * 0.22) % 0.88;
        const prevExtT = currentExtPatientT;
        currentExtPatientT =
          smoothedStep > 0.02
            ? THREE.MathUtils.damp(
                currentExtPatientT,
                targetExtT,
                isSoftwareGl ? 9.0 : 6.0,
                dt
              )
            : targetExtT;

        const extClamped = Math.max(0.01, Math.min(0.99, currentExtPatientT));
        entranceWalkCurve.getPointAt(extClamped, _extPatientPoint);
        entranceWalkCurve.getTangentAt(extClamped, _extPatientTangent);

        const extSpeed =
          smoothedStep > 0.02
            ? Math.min(
                1,
                (Math.abs(currentExtPatientT - prevExtT) /
                  Math.max(dt, 0.001)) *
                  4.5
              )
            : 0.85;
        const extBob = Math.abs(Math.sin(elapsed * 9.5)) * 0.045 * extSpeed;
        exteriorPatient.group.position.set(
          _extPatientPoint.x,
          0.04 + extBob,
          _extPatientPoint.z
        );
        exteriorPatient.group.rotation.y = Math.atan2(
          _extPatientTangent.x,
          _extPatientTangent.z
        );
        const extSwing = Math.sin(elapsed * 9.5) * 0.55 * extSpeed;
        exteriorPatient.leftLeg.rotation.x = extSwing;
        exteriorPatient.rightLeg.rotation.x = -extSwing;
        exteriorPatient.leftArm.rotation.x = -extSwing * 0.75;
        exteriorPatient.rightArm.rotation.x = extSwing * 0.75;
      }

      // 4. Advance Interior Hero Patient along the collision-free corridor path using exact stationU!
      const clampedStep = Math.max(
        0,
        Math.min(TOUR_STEPS.length - 1, smoothedStep)
      );
      const sIdx0 = Math.floor(clampedStep);
      const sIdx1 = Math.min(TOUR_STEPS.length - 1, sIdx0 + 1);
      const rawFrac = clampedStep - sIdx0;
      const walkAlpha =
        sIdx0 === 0
          ? smoothstep01(rawFrac / 0.84)
          : smoothstep01((rawFrac - 0.18) / 0.64);
      const exactTargetU =
        stationU[sIdx0] + (stationU[sIdx1] - stationU[sIdx0]) * walkAlpha;

      const prevPatientT = currentPatientT;
      currentPatientT = THREE.MathUtils.damp(
        currentPatientT,
        exactTargetU,
        isSoftwareGl ? 9.0 : 5.8,
        dt
      );
      const patientSpeed =
        Math.abs(currentPatientT - prevPatientT) / Math.max(dt, 0.001);

      const clampedT = Math.max(0.005, Math.min(0.995, currentPatientT));
      patientPathCurve.getPointAt(clampedT, _patientPoint);
      patientPathCurve.getTangentAt(clampedT, _patientTangent);

      const walkStrength = Math.min(1, patientSpeed * 6.5);
      const isPerformingStationAction =
        interp.activeStationStage !== null && walkStrength < 0.28;
      const activeStage = interp.activeStationStage;

      // Update procedural hospital ambient soundscape (fades in as smoothInterior 0 -> 1)
      const extWalkActive =
        smoothInterior < 0.85 && smoothedStep > 0.02 && smoothedStep < 0.85
          ? 0.65
          : 0;
      const currentMix = ambientEngine.updateFrame({
        interiorFactor: smoothInterior,
        walkStrength: Math.max(walkStrength, extWalkActive),
        activeStationStage: activeStage,
        enabled: Boolean(stateRef.current.ambientAudioEnabled),
        elapsedSeconds: elapsed,
      });
      if (container) {
        container.dataset.ambientMasterGain = String(currentMix.masterGain);
        container.dataset.ambientChatterGain = String(currentMix.chatterGain);
        container.dataset.ambientHumGain = String(currentMix.equipmentHumGain);
        container.dataset.ambientFootstepGain = String(currentMix.footstepGain);
      }

      // Vertical walk bobbing while walking
      const walkBob = Math.abs(Math.sin(elapsed * 10.0)) * 0.045 * walkStrength;
      heroPatient.group.position.set(
        _patientPoint.x,
        walkBob,
        _patientPoint.z
      );

      // Facing direction: while walking, face along the corridor path tangent;
      // when stopped at a station (Stage 1..5), smoothly turn to face the station counter/staff!
      const pathHeading = Math.atan2(_patientTangent.x, _patientTangent.z);
      const stationHeading =
        activeStage && STATION_FACING_ANGLES[activeStage] !== undefined
          ? STATION_FACING_ANGLES[activeStage]
          : pathHeading;
      const desiredHeading = isPerformingStationAction
        ? stationHeading
        : pathHeading;

      heroPatient.group.rotation.y = dampAngle(
        heroPatient.group.rotation.y,
        desiredHeading,
        isSoftwareGl ? 11.0 : 8.5,
        dt
      );

      // Reset default staff rotations before applying stage-specific interactions
      staffRigs.receptionist.rightArm.rotation.x =
        -0.2 + Math.sin(elapsed * 2.2) * 0.08;
      staffRigs.nurse.rightArm.rotation.x =
        -0.3 + Math.sin(elapsed * 2.5) * 0.1;
      staffRigs.doctor.rightArm.rotation.x =
        -0.25 + Math.cos(elapsed * 2.4) * 0.1;
      staffRigs.labTech.rightArm.rotation.x =
        -0.28 + Math.cos(elapsed * 3.1) * 0.12;
      staffRigs.pharmacist.rightArm.rotation.x =
        -0.25 + Math.sin(elapsed * 2.8) * 0.1;
      staffRigs.cashier.rightArm.rotation.x =
        -0.2 + Math.cos(elapsed * 2.6) * 0.08;

      if (isPerformingStationAction && activeStage !== null) {
        // Patient is stopped at Stage 1..5 -> perform distinct stage interaction!
        heroPatient.leftLeg.rotation.x = 0;
        heroPatient.rightLeg.rotation.x = 0;
        followRingMat.color.setHex(0x10b981); // Emerald green ring indicates active stage interaction

        if (activeStage === 1) {
          // Stage 1 (Pendaftaran): Patient raises smartphone/QR E-Ticket to scan at reception desk;
          // Receptionist reaches out to welcome & check them in
          patientHeldItem.visible = true;
          heldItemMat.color.setHex(0x10b981);
          heroPatient.rightArm.rotation.x =
            -1.15 + Math.sin(elapsed * 4.5) * 0.22;
          heroPatient.leftArm.rotation.x = -0.25;
          staffRigs.receptionist.rightArm.rotation.x =
            -0.95 + Math.sin(elapsed * 4.5) * 0.2;
        } else if (activeStage === 2) {
          // Stage 2 (Poliklinik): Patient extends left arm toward Nurse for blood pressure / vitals check;
          // Nurse reaches out with vitals cuff & Doctor waves/reviews chart
          patientHeldItem.visible = false;
          heroPatient.leftArm.rotation.x =
            -1.05 + Math.sin(elapsed * 3.6) * 0.14;
          heroPatient.rightArm.rotation.x =
            -0.35 + Math.cos(elapsed * 3.6) * 0.12;
          staffRigs.nurse.rightArm.rotation.x =
            -1.0 + Math.sin(elapsed * 3.8) * 0.22;
          staffRigs.doctor.rightArm.rotation.x =
            -0.85 + Math.sin(elapsed * 3.2) * 0.2;
        } else if (activeStage === 3) {
          // Stage 3 (Lab & Radiologi): Patient holds chest X-ray posture while laser beam scans;
          // Lab tech operates scanner console
          patientHeldItem.visible = false;
          heroPatient.leftArm.rotation.x =
            -0.82 + Math.sin(elapsed * 3.0) * 0.12;
          heroPatient.rightArm.rotation.x =
            -0.82 + Math.sin(elapsed * 3.0) * 0.12;
          staffRigs.labTech.rightArm.rotation.x =
            -0.95 + Math.sin(elapsed * 4.2) * 0.22;
        } else if (activeStage === 4) {
          // Stage 4 (Farmasi): Pharmacist hands over prescription bag (#RX-2041) & patient receives it
          patientHeldItem.visible = true;
          heldItemMat.color.setHex(0xe8612c);
          heroPatient.rightArm.rotation.x =
            -1.05 + Math.sin(elapsed * 3.8) * 0.18;
          heroPatient.leftArm.rotation.x =
            -0.85 + Math.sin(elapsed * 3.8) * 0.18;
          staffRigs.pharmacist.rightArm.rotation.x =
            -1.05 - Math.sin(elapsed * 3.8) * 0.2;
          staffRigs.pharmacist.leftArm.rotation.x = -0.75;
        } else if (activeStage === 5) {
          // Stage 5 (Kasir): Patient taps QRIS phone at cashier counter & waves goodbye
          patientHeldItem.visible = true;
          heldItemMat.color.setHex(0x10b981);
          heroPatient.rightArm.rotation.x =
            -1.1 + Math.sin(elapsed * 5.0) * 0.25;
          heroPatient.leftArm.rotation.x =
            -0.45 + Math.cos(elapsed * 4.0) * 0.18;
          staffRigs.cashier.rightArm.rotation.x =
            -0.95 + Math.sin(elapsed * 4.5) * 0.22;
        }
      } else {
        // Patient is walking between stages along the open corridor
        patientHeldItem.visible = false;
        followRingMat.color.setHex(0xe8612c);
        const swing =
          Math.sin(elapsed * 10.0) * 0.55 * walkStrength +
          Math.sin(elapsed * 2.2) * 0.04 * (1 - walkStrength);
        heroPatient.leftLeg.rotation.x = swing;
        heroPatient.rightLeg.rotation.x = -swing;
        heroPatient.leftArm.rotation.x = -swing * 0.78;
        heroPatient.rightArm.rotation.x = swing * 0.78;
      }

      // Update floor follow-ring around patient
      followRing.position.set(_patientPoint.x, 0.035, _patientPoint.z);
      const ringScale =
        1 +
        Math.sin(elapsed * 4.5) * 0.1 +
        (isPerformingStationAction ? 0.18 : walkStrength * 0.12);
      followRing.scale.set(ringScale, ringScale, 1);

      // 4B. Room Micro-Animations (X-Ray Laser Sweep, Hotspot Beacons & 3D Floating Info Points)
      if (exteriorGroup.visible) {
        for (let i = 0; i < exteriorInfoPoints.length; i++) {
          const infoGrp = exteriorInfoPoints[i];
          const baseY = (infoGrp.userData.baseY as number) || 3.85;
          const infoId = infoGrp.userData.infoPointId as string;
          const isHighlighted =
            infoId === stateRef.current.selectedInfoPointId ||
            infoId === hoveredInfoPointId;
          infoGrp.position.y = baseY + Math.sin(elapsed * 2.6 + i) * 0.11;
          infoGrp.lookAt(
            camera.position.x,
            infoGrp.position.y + exteriorGroup.position.y,
            camera.position.z
          );
          const s = isHighlighted ? 1.24 : 1.0;
          infoGrp.scale.set(s, s, s);
        }
      }

      if (interiorGroup.visible) {
        xrayScanBeam.position.y = 1.35 + Math.sin(elapsed * 2.8) * 0.52;

        for (let i = 0; i < hotspotPins.length; i++) {
          const pin = hotspotPins[i];
          const baseY = (pin.userData.baseY as number) || 2.5;
          const isSelected =
            pin.userData.hotspotId === stateRef.current.selectedHotspotId ||
            pin.userData.hotspotId === hoveredHotspotId;
          pin.position.y = baseY + Math.sin(elapsed * 3.2 + i) * 0.09;
          pin.rotation.y = elapsed * 1.8 + i;
          const s = isSelected ? 1.38 : 1.0;
          pin.scale.set(s, s, s);
        }

        for (let i = 0; i < infoPointGroups.length; i++) {
          const infoGrp = infoPointGroups[i];
          const baseY = (infoGrp.userData.baseY as number) || 3.9;
          const infoId = infoGrp.userData.infoPointId as string;
          const isHighlighted =
            infoId === stateRef.current.selectedInfoPointId ||
            infoId === hoveredInfoPointId ||
            infoGrp.userData.stepIndex === stateRef.current.activeStep;
          infoGrp.position.y =
            baseY + Math.sin(elapsed * 2.7 + i * 1.1) * 0.11;
          infoGrp.lookAt(
            camera.position.x,
            infoGrp.position.y + interiorGroup.position.y,
            camera.position.z
          );
          const s =
            infoId === stateRef.current.selectedInfoPointId ||
            infoId === hoveredInfoPointId
              ? 1.26
              : isHighlighted
                ? 1.08
                : 0.94;
          infoGrp.scale.set(s, s, s);
        }
      }

      // 5. 3D Follow-Camera Computation (Far-to-Near Zoom & Live Patient Tracking)
      smoothPointerX = THREE.MathUtils.damp(
        smoothPointerX,
        pointerNormX,
        4.5,
        dt
      );
      smoothPointerY = THREE.MathUtils.damp(
        smoothPointerY,
        pointerNormY,
        4.5,
        dt
      );

      const followWeight =
        smoothInterior *
        (stateRef.current.followCamTight
          ? 0.65
          : Math.min(0.48, 0.22 + walkStrength * 0.26));

      // Offset patient X slightly left (-1.8) so the patient & room stay framed on the right 60% of the viewport
      const patientLookX = _patientPoint.x - 1.8;
      const patientLookY = 1.0 + smoothFloorElevation * 0.45;
      const patientLookZ = _patientPoint.z - 0.6;

      const blendedTargetX = THREE.MathUtils.lerp(
        interp.cameraTarget[0],
        patientLookX,
        followWeight
      );
      const blendedTargetY =
        THREE.MathUtils.lerp(
          interp.cameraTarget[1],
          patientLookY,
          followWeight
        ) +
        smoothFloorElevation * 0.35;
      const blendedTargetZ = THREE.MathUtils.lerp(
        interp.cameraTarget[2],
        patientLookZ,
        followWeight
      );

      // Near close-up camera offset when at a station, pulling slightly higher during corridor walks
      const patientChasePosX = _patientPoint.x - 3.4;
      const patientChasePosY =
        (stateRef.current.followCamTight ? 6.2 : 7.2) +
        walkStrength * 1.4 +
        smoothFloorElevation;
      const patientChasePosZ =
        _patientPoint.z +
        (stateRef.current.followCamTight ? 6.8 : 7.8) +
        walkStrength * 1.8;

      const blendedCamX =
        THREE.MathUtils.lerp(
          interp.cameraPos[0],
          patientChasePosX,
          followWeight * 0.8
        ) +
        smoothPointerX * 0.55;
      const blendedCamY =
        THREE.MathUtils.lerp(
          interp.cameraPos[1] + smoothFloorElevation,
          patientChasePosY,
          followWeight * 0.8
        ) -
        smoothPointerY * 0.3 +
        Math.sin(elapsed * 1.4) * 0.05;
      const blendedCamZ = THREE.MathUtils.lerp(
        interp.cameraPos[2],
        patientChasePosZ,
        followWeight * 0.8
      );

      _targetCamPos.set(blendedCamX, blendedCamY, blendedCamZ);
      _targetLookAt.set(blendedTargetX, blendedTargetY, blendedTargetZ);

      const camLambda = isSoftwareGl ? 9.5 : 5.8;
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        _targetCamPos.x,
        camLambda,
        dt
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        _targetCamPos.y,
        camLambda,
        dt
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        _targetCamPos.z,
        camLambda,
        dt
      );

      _currentLookAt.x = THREE.MathUtils.damp(
        _currentLookAt.x,
        _targetLookAt.x,
        camLambda + 1.2,
        dt
      );
      _currentLookAt.y = THREE.MathUtils.damp(
        _currentLookAt.y,
        _targetLookAt.y,
        camLambda + 1.2,
        dt
      );
      _currentLookAt.z = THREE.MathUtils.damp(
        _currentLookAt.z,
        _targetLookAt.z,
        camLambda + 1.2,
        dt
      );

      camera.lookAt(_currentLookAt);

      // Subtle 3D flight bank roll and dynamic FOV kick during flight
      const targetBankZ = THREE.MathUtils.clamp(
        -stepVelocity * 0.018 - smoothPointerX * 0.012,
        -0.045,
        0.045
      );
      currentBankZ = THREE.MathUtils.damp(currentBankZ, targetBankZ, 5.0, dt);
      camera.rotation.z += currentBankZ;

      const targetFov = 34 + Math.min(2.2, Math.abs(stepVelocity) * 0.65);
      currentFov = THREE.MathUtils.damp(currentFov, targetFov, 4.5, dt);
      if (Math.abs(camera.fov - currentFov) > 0.02) {
        camera.fov = currentFov;
        camera.updateProjectionMatrix();
      }

      // Project the current step's 3D floating info point to screen space for telemetry/accessibility
      const activeInfoGrp =
        stateRef.current.activeStep === 0
          ? exteriorInfoPoints[0]
          : infoPointGroups.find(
              (g) => g.userData.stepIndex === stateRef.current.activeStep
            );
      if (activeInfoGrp && container) {
        activeInfoGrp.getWorldPosition(_projVec);
        _projVec.y += 0.25; // aim right at the badge/orb center
        _projVec.project(camera);
        const rect = renderer.domElement.getBoundingClientRect();
        const sx = Math.round((_projVec.x * 0.5 + 0.5) * rect.width + rect.left);
        const sy = Math.round(
          (-_projVec.y * 0.5 + 0.5) * rect.height + rect.top
        );
        container.dataset.activeInfoId = String(
          activeInfoGrp.userData.infoPointId || ''
        );
        container.dataset.activeInfoScreenX = String(sx);
        container.dataset.activeInfoScreenY = String(sy);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handleUnlockAudio);
      window.removeEventListener('wheel', handleUnlockAudio);
      window.removeEventListener('keydown', handleUnlockAudio);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ambientEngine.dispose();
      ambientAudioRef.current = null;
      renderer.dispose();
    };
  }, [continuousStepRef]);

  return (
    <div
      ref={mountRef}
      data-testid="hospital-3d-canvas"
      data-ambient-enabled={ambientAudioEnabled ? 'true' : 'false'}
      className="h-full w-full select-none"
      aria-label="Visualisasi 3D Interaktif Rumah Sakit Nadi"
    />
  );
}
