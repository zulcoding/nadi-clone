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
} from './booking-logic';
import { SAMPLE_PATIENT_DATA, TOUR_STEPS } from './data';

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
