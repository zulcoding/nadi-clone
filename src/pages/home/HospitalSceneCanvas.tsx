import * as React from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TOUR_STEPS } from './data';
import { interpolateTourCameraState } from './booking-logic';
import {
  createHospitalMaterials,
  detectSoftwareGl,
} from './three-materials';
import {
  createExteriorHospitalGroup,
  createInteriorHospitalGroup,
} from './three-builders';

export interface HospitalSceneCanvasProps {
  activeStep: number;
  continuousStepRef: React.MutableRefObject<number>;
  followCamTight?: boolean;
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
const _ambPoint = new THREE.Vector3();
const _ambTangent = new THREE.Vector3();

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

export function HospitalSceneCanvas({
  activeStep,
  continuousStepRef,
  followCamTight = false,
}: HospitalSceneCanvasProps) {
  const mountRef = React.useRef<HTMLDivElement | null>(null);
  const stateRef = React.useRef({
    activeStep,
    followCamTight,
  });

  React.useEffect(() => {
    stateRef.current.activeStep = activeStep;
    stateRef.current.followCamTight = followCamTight;
  }, [activeStep, followCamTight]);

  React.useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f2ea);
    scene.fog = new THREE.FogExp2(0xf6f2ea, 0.011);

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

    // Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfff8eb, 0xe5dec9, 0.95);
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
    const groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 180),
      new THREE.MeshStandardMaterial({
        color: 0xf4efe4,
        roughness: 0.92,
        metalness: 0.0,
      })
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.32;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const mats = createHospitalMaterials(isSoftwareGl);

    // Build Exterior & Interior Cutaway Groups
    const { exteriorGroup, ambulance, roadCurve } = createExteriorHospitalGroup(
      mats,
      maxAnisotropy
    );
    exteriorGroup.position.set(2.0, 0, 0);
    scene.add(exteriorGroup);

    const { interiorGroup, patientPathCurve, heroPatient, followRing } =
      createInteriorHospitalGroup(mats, maxAnisotropy);
    interiorGroup.position.set(0, -18, 0);
    interiorGroup.visible = false;
    scene.add(interiorGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Subtle pointer parallax state
    let pointerNormX = 0;
    let pointerNormY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      pointerNormX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerNormY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    let smoothedStep = continuousStepRef.current;
    let currentPatientT = 0.14;
    let smoothInterior = 0;
    let currentBankZ = 0;
    let currentFov = 34;

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

      // 1. Smoothly damp continuous scroll/tour progress
      const targetContinuous = continuousStepRef.current;
      const prevSmoothedStep = smoothedStep;
      smoothedStep = THREE.MathUtils.damp(
        smoothedStep,
        targetContinuous,
        isSoftwareGl ? 9.5 : 6.2,
        dt
      );
      const stepVelocity =
        (smoothedStep - prevSmoothedStep) / Math.max(dt, 0.001);

      // 2. Compute continuous interpolated camera & path state
      const interp = interpolateTourCameraState(smoothedStep);

      smoothInterior = THREE.MathUtils.damp(
        smoothInterior,
        interp.interiorFactor,
        isSoftwareGl ? 10.0 : 6.5,
        dt
      );

      // Smooth exterior cutaway lift & interior rise
      exteriorGroup.visible = smoothInterior < 0.97;
      exteriorGroup.position.y = smoothInterior * 16.5;

      interiorGroup.visible = smoothInterior > 0.03;
      interiorGroup.position.y = (1 - smoothInterior) * -10.5;

      // 3. Exterior Ambulance continuous driving along road curve
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
      }

      // 4. Advance Hero Patient smoothly along the orange floor path
      const prevPatientT = currentPatientT;
      currentPatientT = THREE.MathUtils.damp(
        currentPatientT,
        interp.patientPathProgress,
        isSoftwareGl ? 8.5 : 5.2,
        dt
      );
      const patientSpeed =
        Math.abs(currentPatientT - prevPatientT) / Math.max(dt, 0.001);

      const clampedT = Math.max(0.02, Math.min(0.99, currentPatientT));
      patientPathCurve.getPointAt(clampedT, _patientPoint);
      patientPathCurve.getTangentAt(clampedT, _patientTangent);

      // Subtle vertical walk bobbing
      const walkStrength = Math.min(1, patientSpeed * 7.5);
      const walkBob = Math.abs(Math.sin(elapsed * 10.0)) * 0.045 * walkStrength;
      heroPatient.group.position.set(
        _patientPoint.x,
        walkBob,
        _patientPoint.z
      );

      const desiredHeading = Math.atan2(_patientTangent.x, _patientTangent.z);
      heroPatient.group.rotation.y = dampAngle(
        heroPatient.group.rotation.y,
        desiredHeading,
        10.0,
        dt
      );

      // Limb walk cycle + subtle idle breathing
      const swing =
        Math.sin(elapsed * 10.0) * 0.52 * walkStrength +
        Math.sin(elapsed * 2.2) * 0.03 * (1 - walkStrength);
      heroPatient.leftLeg.rotation.x = swing;
      heroPatient.rightLeg.rotation.x = -swing;
      heroPatient.leftArm.rotation.x = -swing * 0.75;
      heroPatient.rightArm.rotation.x = swing * 0.75;

      // Update floor follow-ring around patient
      followRing.position.set(_patientPoint.x, 0.035, _patientPoint.z);
      const ringScale = 1 + Math.sin(elapsed * 4.0) * 0.08 + walkStrength * 0.15;
      followRing.scale.set(ringScale, ringScale, 1);

      // 5. 3D Follow-Camera Computation (blends spline framing with live 3D patient tracking)
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

      // When followCamTight is enabled or during movement between interior rooms,
      // blend camera target toward the walking heroPatient's live 3D position!
      const followWeight =
        smoothInterior *
        (stateRef.current.followCamTight
          ? 0.58
          : Math.min(0.42, 0.16 + walkStrength * 0.28));

      // Offset patient X slightly left (-2.0) so the patient & room stay framed on the right 60% of the screen
      const patientLookX = _patientPoint.x - 2.0;
      const patientLookY = 1.05;
      const patientLookZ = _patientPoint.z;

      const blendedTargetX = THREE.MathUtils.lerp(
        interp.cameraTarget[0],
        patientLookX,
        followWeight
      );
      const blendedTargetY = THREE.MathUtils.lerp(
        interp.cameraTarget[1],
        patientLookY,
        followWeight
      );
      const blendedTargetZ = THREE.MathUtils.lerp(
        interp.cameraTarget[2],
        patientLookZ,
        followWeight
      );

      // Follow camera position also tracks the patient's 3D offset smoothly
      const patientChasePosX = _patientPoint.x - 4.2;
      const patientChasePosY = stateRef.current.followCamTight ? 8.6 : 10.4;
      const patientChasePosZ = _patientPoint.z + (stateRef.current.followCamTight ? 9.8 : 11.8);

      const blendedCamX =
        THREE.MathUtils.lerp(
          interp.cameraPos[0],
          patientChasePosX,
          followWeight * 0.75
        ) +
        smoothPointerX * 0.65;
      const blendedCamY =
        THREE.MathUtils.lerp(
          interp.cameraPos[1],
          patientChasePosY,
          followWeight * 0.75
        ) -
        smoothPointerY * 0.35 +
        Math.sin(elapsed * 1.4) * 0.06;
      const blendedCamZ = THREE.MathUtils.lerp(
        interp.cameraPos[2],
        patientChasePosZ,
        followWeight * 0.75
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

      // Subtle 3D flight bank roll (camera.rotation.z) and dynamic FOV kick during flight
      const targetBankZ = THREE.MathUtils.clamp(
        -stepVelocity * 0.018 - smoothPointerX * 0.012,
        -0.045,
        0.045
      );
      currentBankZ = THREE.MathUtils.damp(currentBankZ, targetBankZ, 5.0, dt);
      camera.rotation.z += currentBankZ;

      const targetFov =
        34 + Math.min(2.2, Math.abs(stepVelocity) * 0.65);
      currentFov = THREE.MathUtils.damp(currentFov, targetFov, 4.5, dt);
      if (Math.abs(camera.fov - currentFov) > 0.02) {
        camera.fov = currentFov;
        camera.updateProjectionMatrix();
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
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
    };
  }, [continuousStepRef]);

  return (
    <div
      ref={mountRef}
      data-testid="hospital-3d-canvas"
      className="h-full w-full select-none"
      aria-label="Visualisasi 3D Interaktif Rumah Sakit Nadi"
    />
  );
}
