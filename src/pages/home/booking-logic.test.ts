import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterDoctorsBySpecialty,
  validatePatientForm,
  calculateAppointmentTotal,
  scrollProgressToTourStep,
  interpolateTourCameraState,
  getFloorConfig,
  getHotspotDetails,
  computeHospitalAmbientMix,
  FLOATING_INFO_POINTS,
  getFloatingInfoPointDetails,
  filterFloatingInfoPointsByCategory,
  getFloatingInfoPointForStep,
  computeDayNightCycleState,
  getCurrentLocalHour,
  DAY_NIGHT_PRESETS,
} from './booking-logic';
import { SAMPLE_PATIENT_DATA, TOUR_STEPS } from './data';
import {
  COMPILED_NAVMESH_TRACK,
  findNavMeshPath,
  isPointInsideAnyObstacle,
  isPointOnNavMesh,
  sampleNavMeshTrack,
} from './navmesh-system';

test('filterDoctorsBySpecialty returns all doctors for semua and filters by specialty id', () => {
  const all = filterDoctorsBySpecialty('semua');
  assert.ok(all.length >= 7);

  const jantung = filterDoctorsBySpecialty('jantung');
  assert.equal(jantung.length, 1);
  assert.equal(jantung[0].id, 'dr-raka');
});

test('validatePatientForm accepts SAMPLE_PATIENT_DATA and rejects empty fields', () => {
  const validRes = validatePatientForm(SAMPLE_PATIENT_DATA);
  assert.equal(validRes.valid, true);
  assert.deepEqual(validRes.errors, {});

  const invalidRes = validatePatientForm({
    fullName: 'A',
    nik: '123',
    birthDate: '',
    gender: '',
    phone: '123',
    email: '',
    paymentMethodType: 'umum',
    complaint: '',
  });
  assert.equal(invalidRes.valid, false);
  assert.ok(invalidRes.errors.fullName);
  assert.ok(invalidRes.errors.nik);
  assert.ok(invalidRes.errors.birthDate);
  assert.ok(invalidRes.errors.gender);
  assert.ok(invalidRes.errors.phone);
});

test('calculateAppointmentTotal adds Rp 5.000 service fee for umum and 0 for bpjs', () => {
  const umum = calculateAppointmentTotal(350000, 'umum');
  assert.equal(umum.consultationFee, 350000);
  assert.equal(umum.serviceFee, 5000);
  assert.equal(umum.total, 355000);

  const bpjs = calculateAppointmentTotal(350000, 'bpjs');
  assert.equal(bpjs.total, 0);
});

test('scrollProgressToTourStep maps 0..1 progress to 6 hospital tour waypoints and interiorFactor', () => {
  const start = scrollProgressToTourStep(0);
  assert.equal(start.activeStepIndex, 0);
  assert.equal(start.interiorFactor, 0);

  const mid = scrollProgressToTourStep(0.4);
  assert.equal(mid.activeStepIndex, 2);
  assert.equal(mid.interiorFactor, 1);

  const end = scrollProgressToTourStep(1);
  assert.equal(end.activeStepIndex, 5);
  assert.equal(end.interiorFactor, 1);
});

test('interpolateTourCameraState smoothly interpolates camera, exterior walk, and station dwell actions', () => {
  // At Step 0.25 (transitioning Gedung -> Pendaftaran), exterior patient is walking into building
  const entering = interpolateTourCameraState(0.25);
  assert.ok(entering.exteriorWalkProgress > 0.2);
  assert.ok(entering.exteriorWalkProgress < 0.9);
  assert.ok(entering.cameraPos[2] < TOUR_STEPS[0].cameraPos[2]);

  // At exact Step 1.0 (Pendaftaran), patient is dwelling at Stage 1 performing check-in action
  const atPendaftaran = interpolateTourCameraState(1.0);
  assert.equal(atPendaftaran.activeStationStage, 1);
  assert.equal(atPendaftaran.stationActionFactor, 1);

  // At Step 1.5 (mid-corridor walk between Pendaftaran and Poliklinik)
  const mid12 = interpolateTourCameraState(1.5);
  assert.ok(mid12.cameraPos[0] > TOUR_STEPS[1].cameraPos[0]);
  assert.ok(mid12.cameraPos[0] < TOUR_STEPS[2].cameraPos[0]);
  assert.ok(mid12.patientPathProgress > TOUR_STEPS[1].patientPathProgress);
  assert.ok(mid12.patientPathProgress < TOUR_STEPS[2].patientPathProgress);
  assert.equal(mid12.activeStationStage, null);
  assert.equal(mid12.interiorFactor, 1);
});

test('getFloorConfig returns metadata and camera elevation offsets for Lantai 1, 2, and 3', () => {
  const f1 = getFloorConfig(1);
  const f2 = getFloorConfig(2);
  const f3 = getFloorConfig(3);

  assert.equal(f1.shortLabel, 'Lantai 1');
  assert.equal(f1.cameraElevationOffset, 0);
  assert.ok(f2.cameraElevationOffset > f1.cameraElevationOffset);
  assert.ok(f3.cameraElevationOffset > f2.cameraElevationOffset);
  assert.ok(f2.highlights.length >= 3);
});

test('getHotspotDetails returns 3D station metadata for valid hotspot IDs and null for unknown', () => {
  const tv = getHotspotDetails('pendaftaran-tv');
  assert.ok(tv);
  assert.equal(tv.stepIndex, 1);

  const xray = getHotspotDetails('radiologi-xray');
  assert.ok(xray);
  assert.equal(xray.stepIndex, 3);

  assert.equal(getHotspotDetails('unknown-id'), null);
  assert.equal(getHotspotDetails(null), null);
});

test('validateAppointmentBooking validates doctor selection, available time slot, and patient fields', async () => {
  const { validateAppointmentBooking } = await import('./booking-logic');

  const validBooking = validateAppointmentBooking({
    doctorId: 'dr-raka',
    dateNum: '28',
    timeSlot: '10:00',
    patient: SAMPLE_PATIENT_DATA,
  });
  assert.equal(validBooking.valid, true);
  assert.equal(validBooking.doctorError, undefined);
  assert.equal(validBooking.slotError, undefined);

  // Unavailable slot for dr-raka (08:30 is unavailable)
  const unavailableSlotBooking = validateAppointmentBooking({
    doctorId: 'dr-raka',
    dateNum: '28',
    timeSlot: '08:30',
    patient: SAMPLE_PATIENT_DATA,
  });
  assert.equal(unavailableSlotBooking.valid, false);
  assert.ok(unavailableSlotBooking.slotError);

  // Empty timeSlot & invalid patient
  const missingSlotAndPatient = validateAppointmentBooking({
    doctorId: 'dr-raka',
    dateNum: '28',
    timeSlot: '',
    patient: {
      ...SAMPLE_PATIENT_DATA,
      fullName: '',
      nik: '123',
    },
  });
  assert.equal(missingSlotAndPatient.valid, false);
  assert.ok(missingSlotAndPatient.slotError);
  assert.ok(missingSlotAndPatient.patientErrors.fullName);
  assert.ok(missingSlotAndPatient.patientErrors.nik);
});

test('findNavMeshPath routes between room bays via corridor portals without crossing walls', () => {
  const path1to2 = findNavMeshPath('wp-station-1', 'wp-station-2').map(
    (w) => w.id
  );
  assert.deepEqual(path1to2, [
    'wp-station-1',
    'wp-corridor-1',
    'wp-portal-1-2',
    'wp-corridor-2',
    'wp-station-2',
  ]);

  const path2to3 = findNavMeshPath('wp-station-2', 'wp-station-3').map(
    (w) => w.id
  );
  assert.deepEqual(path2to3, [
    'wp-station-2',
    'wp-corridor-2',
    'wp-portal-2-3',
    'wp-corridor-3',
    'wp-station-3',
  ]);
});

test('COMPILED_NAVMESH_TRACK and sampleNavMeshTrack have zero wall/counter collisions across 500 samples', () => {
  const stageU = COMPILED_NAVMESH_TRACK.stageNormProgress;
  assert.equal(stageU.length, 6);
  for (let i = 0; i < stageU.length - 1; i++) {
    assert.ok(
      stageU[i] < stageU[i + 1],
      `Stage ${i} progress (${stageU[i]}) must be strictly less than Stage ${i + 1} (${stageU[i + 1]})`
    );
  }

  // Verify 500 dense samples across the entire tour [0..1] never intersect any wall or counter obstacle
  for (let k = 0; k <= 500; k++) {
    const u = k / 500;
    const sample = sampleNavMeshTrack(u);
    const hitObstacle = isPointInsideAnyObstacle(sample.x, sample.z);
    assert.equal(
      hitObstacle,
      null,
      `Sample at u=${u.toFixed(3)} (${sample.x.toFixed(2)}, ${sample.z.toFixed(2)}) collided with obstacle ${hitObstacle?.id}`
    );
    assert.equal(
      isPointOnNavMesh(sample.x, sample.z),
      true,
      `Sample at u=${u.toFixed(3)} (${sample.x.toFixed(2)}, ${sample.z.toFixed(2)}) left the walkable NavMesh cells`
    );
  }
});

test('computeHospitalAmbientMix fades in hospital ambient soundscape as user enters building (interiorFactor 0 -> 1)', () => {
  // Outside the building (Gedung, interiorFactor = 0)
  const exteriorMix = computeHospitalAmbientMix({
    interiorFactor: 0,
    walkStrength: 0,
    activeStationStage: null,
    enabled: true,
  });
  assert.equal(exteriorMix.masterGain, 0.008);
  assert.equal(exteriorMix.chatterGain, 0);
  assert.equal(exteriorMix.equipmentHumGain, 0);
  assert.equal(exteriorMix.lowpassCutoffHz, 320);

  // Mid-entry into building (interiorFactor = 0.5, walking into Pendaftaran)
  const midEntryMix = computeHospitalAmbientMix({
    interiorFactor: 0.5,
    walkStrength: 0.8,
    activeStationStage: null,
    enabled: true,
  });
  assert.ok(midEntryMix.masterGain > exteriorMix.masterGain);
  assert.ok(midEntryMix.chatterGain > 0);
  assert.ok(midEntryMix.equipmentHumGain > 0);
  assert.ok(midEntryMix.footstepGain > 0);
  assert.ok(midEntryMix.lowpassCutoffHz > 320);

  // Fully inside building at Pendaftaran (Stage 1) vs Lab & Radiologi (Stage 3)
  const pendaftaranMix = computeHospitalAmbientMix({
    interiorFactor: 1,
    walkStrength: 0,
    activeStationStage: 1,
    enabled: true,
  });
  const labMix = computeHospitalAmbientMix({
    interiorFactor: 1,
    walkStrength: 0,
    activeStationStage: 3,
    enabled: true,
  });
  assert.equal(pendaftaranMix.masterGain, 0.085);
  assert.equal(pendaftaranMix.lowpassCutoffHz, 1450);
  // Lobby chatter is warmer in Pendaftaran; medical equipment hum is stronger in Lab & Radiologi
  assert.ok(pendaftaranMix.chatterGain > labMix.chatterGain);
  assert.ok(labMix.equipmentHumGain > pendaftaranMix.equipmentHumGain);

  // Muted state zeroes all gains
  const mutedMix = computeHospitalAmbientMix({
    interiorFactor: 1,
    walkStrength: 1,
    activeStationStage: 2,
    enabled: false,
  });
  assert.equal(mutedMix.masterGain, 0);
  assert.equal(mutedMix.chatterGain, 0);
  assert.equal(mutedMix.equipmentHumGain, 0);
  assert.equal(mutedMix.footstepGain, 0);
});

test('3D floating info points provide health tips and hospital directory details across all 6 tour steps', () => {
  assert.equal(FLOATING_INFO_POINTS.length, 6);

  const tips = filterFloatingInfoPointsByCategory('health-tip');
  const directory = filterFloatingInfoPointsByCategory('directory');
  const all = filterFloatingInfoPointsByCategory('all');

  assert.equal(tips.length, 3);
  assert.equal(directory.length, 3);
  assert.equal(all.length, 6);

  // Verify lookup by ID
  const poliTip = getFloatingInfoPointDetails('info-poliklinik-tips');
  assert.ok(poliTip);
  assert.equal(poliTip.category, 'health-tip');
  assert.equal(poliTip.stepIndex, 2);
  assert.ok(poliTip.bulletPoints.length >= 3);

  const gedungDir = getFloatingInfoPointDetails('info-gedung-direktori');
  assert.ok(gedungDir);
  assert.equal(gedungDir.category, 'directory');
  assert.equal(gedungDir.stepIndex, 0);

  assert.equal(getFloatingInfoPointDetails(null), null);
  assert.equal(getFloatingInfoPointDetails('non-existent'), null);

  // Verify step-to-info-point mapping
  for (let s = 0; s <= 5; s++) {
    const pt = getFloatingInfoPointForStep(s);
    assert.equal(pt.stepIndex, s);
    assert.equal(pt.position3D.length, 3);
  }
});

test('computeDayNightCycleState adjusts ambient, hemisphere, and directional lights and sun trajectory across 24h cycle', () => {
  assert.equal(DAY_NIGHT_PRESETS.length, 4);

  const sampleDate = new Date('2026-10-25T08:45:00');
  assert.equal(getCurrentLocalHour(sampleDate), 8.75);

  const dawn = computeDayNightCycleState(6.5);
  const midday = computeDayNightCycleState(12.0);
  const dusk = computeDayNightCycleState(17.5);
  const night = computeDayNightCycleState(21.5);

  assert.equal(dawn.phaseId, 'dawn');
  assert.equal( dawn.formattedTime, '06:30');
  assert.equal(midday.phaseId, 'day');
  assert.equal(midday.formattedTime, '12:00');
  assert.equal(dusk.phaseId, 'dusk');
  assert.equal(dusk.formattedTime, '17:30');
  assert.equal(night.phaseId, 'night');
  assert.equal(night.formattedTime, '21:30');

  // Ambient & Directional intensities are highest at midday and lowest at night
  assert.ok(midday.ambientIntensity > dawn.ambientIntensity);
  assert.ok(dawn.ambientIntensity > night.ambientIntensity);
  assert.ok(midday.directionalIntensity > dusk.directionalIntensity);
  assert.ok(dusk.directionalIntensity > night.directionalIntensity);

  // Sun sweeps from East (+X) at Dawn, to high zenith (+Y) at Midday, to West (-X) at Dusk
  assert.ok(dawn.sunPosition[0] > 10);
  assert.ok(Math.abs(midday.sunPosition[0]) < 1);
  assert.ok(midday.sunPosition[1] >= 27);
  assert.ok(dusk.sunPosition[0] < -10);

  // Exterior window glow increases from daytime to dusk to night
  assert.ok(night.windowGlowIntensity > dusk.windowGlowIntensity);
  assert.ok(dusk.windowGlowIntensity > midday.windowGlowIntensity);
  assert.equal(midday.isDarkUI, false);
  assert.equal(night.isDarkUI, true);
});




