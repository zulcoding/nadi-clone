import { DOCTORS, TOUR_STEPS, type DoctorItem } from './data';

export interface PatientFormData {
  fullName: string;
  nik: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan' | '';
  phone: string;
  email: string;
  paymentMethodType: 'umum' | 'asuransi' | 'bpjs';
  complaint: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof PatientFormData, string>>;
}

export function filterDoctorsBySpecialty(
  specialtyId: string,
  doctors: DoctorItem[] = DOCTORS
): DoctorItem[] {
  if (!specialtyId || specialtyId === 'semua') {
    return doctors;
  }
  return doctors.filter((doc) => doc.specialtyId === specialtyId);
}

export function validatePatientForm(form: PatientFormData): ValidationResult {
  const errors: Partial<Record<keyof PatientFormData, string>> = {};

  if (!form.fullName || form.fullName.trim().length < 3) {
    errors.fullName = 'Nama lengkap minimal 3 karakter.';
  }

  const digitsOnlyNik = (form.nik || '').replace(/\D/g, '');
  if (digitsOnlyNik.length !== 16) {
    errors.nik = 'NIK harus terdiri dari 16 digit angka.';
  }

  if (!form.birthDate || form.birthDate.trim().length < 6) {
    errors.birthDate = 'Tanggal lahir wajib diisi.';
  }

  if (!form.gender) {
    errors.gender = 'Pilih jenis kelamin.';
  }

  const digitsOnlyPhone = (form.phone || '').replace(/\D/g, '');
  if (digitsOnlyPhone.length < 9) {
    errors.phone = 'Nomor WhatsApp minimal 9 digit.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateAppointmentTotal(
  doctorPrice: number,
  paymentMethodType: 'umum' | 'asuransi' | 'bpjs'
): { consultationFee: number; serviceFee: number; total: number } {
  const serviceFee = 5000;
  if (paymentMethodType === 'bpjs') {
    return {
      consultationFee: doctorPrice,
      serviceFee: 0,
      total: 0,
    };
  }
  return {
    consultationFee: doctorPrice,
    serviceFee,
    total: doctorPrice + serviceFee,
  };
}

export function scrollProgressToTourStep(progress: number): {
  activeStepIndex: number;
  continuousStep: number;
  interiorFactor: number;
} {
  const clamped = Math.max(0, Math.min(1, progress));
  const maxStep = TOUR_STEPS.length - 1;
  const continuousStep = clamped * maxStep;
  const activeStepIndex = Math.round(continuousStep);
  // Smooth transition from exterior (0) to interior cutaway (1..5)
  const interiorFactor = Math.max(
    0,
    Math.min(1, (continuousStep - 0.08) / 0.72)
  );

  return {
    activeStepIndex,
    continuousStep,
    interiorFactor,
  };
}

function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function interpolateTourCameraState(continuousStep: number): {
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  patientPathProgress: number;
  interiorFactor: number;
} {
  const maxIdx = TOUR_STEPS.length - 1;
  const clamped = Math.max(0, Math.min(maxIdx, continuousStep));
  const idx0 = Math.floor(clamped);
  const idx1 = Math.min(maxIdx, idx0 + 1);
  const rawFrac = clamped - idx0;
  // Blend linear and smoothstep for a natural cinematic glide across waypoints
  const frac = 0.35 * rawFrac + 0.65 * smoothstep01(rawFrac);

  const s0 = TOUR_STEPS[idx0];
  const s1 = TOUR_STEPS[idx1];

  const cameraPos: [number, number, number] = [
    s0.cameraPos[0] + (s1.cameraPos[0] - s0.cameraPos[0]) * frac,
    s0.cameraPos[1] + (s1.cameraPos[1] - s0.cameraPos[1]) * frac,
    s0.cameraPos[2] + (s1.cameraPos[2] - s0.cameraPos[2]) * frac,
  ];

  const cameraTarget: [number, number, number] = [
    s0.cameraTarget[0] + (s1.cameraTarget[0] - s0.cameraTarget[0]) * frac,
    s0.cameraTarget[1] + (s1.cameraTarget[1] - s0.cameraTarget[1]) * frac,
    s0.cameraTarget[2] + (s1.cameraTarget[2] - s0.cameraTarget[2]) * frac,
  ];

  const patientPathProgress =
    s0.patientPathProgress +
    (s1.patientPathProgress - s0.patientPathProgress) * rawFrac;

  const interiorFactor = smoothstep01((clamped - 0.06) / 0.78);

  return {
    cameraPos,
    cameraTarget,
    patientPathProgress,
    interiorFactor,
  };
}

