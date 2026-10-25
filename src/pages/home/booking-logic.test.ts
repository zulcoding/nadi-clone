import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterDoctorsBySpecialty,
  validatePatientForm,
  calculateAppointmentTotal,
  scrollProgressToTourStep,
  interpolateTourCameraState,
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

test('interpolateTourCameraState smoothly interpolates camera and patient path between steps', () => {
  const mid12 = interpolateTourCameraState(1.5);
  // Between step 1 (Pendaftaran) and step 2 (Poliklinik)
  assert.ok(mid12.cameraPos[0] > TOUR_STEPS[1].cameraPos[0]);
  assert.ok(mid12.cameraPos[0] < TOUR_STEPS[2].cameraPos[0]);
  assert.ok(mid12.patientPathProgress > TOUR_STEPS[1].patientPathProgress);
  assert.ok(mid12.patientPathProgress < TOUR_STEPS[2].patientPathProgress);
  assert.equal(mid12.interiorFactor, 1);
});

