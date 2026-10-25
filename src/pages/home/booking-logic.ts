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

export type FloorId = 1 | 2 | 3;

export interface FloorConfig {
  floor: FloorId;
  shortLabel: string;
  title: string;
  subtitle: string;
  highlights: string[];
  cameraElevationOffset: number;
}

export interface HotspotDetails {
  id: string;
  title: string;
  roomLabel: string;
  metricLabel: string;
  metricValue: string;
  description: string;
  stepIndex: number;
  specialtyId?: string;
  ctaLabel: string;
}

const FLOOR_CONFIGS: Record<FloorId, FloorConfig> = {
  1: {
    floor: 1,
    shortLabel: 'Lantai 1',
    title: 'Lantai 1 · Alur Utama Rawat Jalan',
    subtitle: 'Pendaftaran, Poliklinik Umum/Penyakit Dalam, Lab, Radiologi, Farmasi & Kasir',
    highlights: ['Loket Antrean Pintar', 'Triase Perawat', 'Rontgen & Lab Terpadu', 'Farmasi & Kasir Nirsentuh'],
    cameraElevationOffset: 0,
  },
  2: {
    floor: 2,
    shortLabel: 'Lantai 2',
    title: 'Lantai 2 · Pusat Jantung & Ibu-Anak',
    subtitle: 'Cath-Lab, Treadmill EKG Terpadu, USG 4D Fetomaternal & Klinik Anak Ramah Bermain',
    highlights: ['Treadmill EKG & Echo', 'USG 4D Kehamilan', 'Klinik Tumbuh Kembang', 'Ruang Laktasi Privat'],
    cameraElevationOffset: 0.65,
  },
  3: {
    floor: 3,
    shortLabel: 'Lantai 3',
    title: 'Lantai 3 · Ortopedi, Saraf & Rehab Medis',
    subtitle: 'Fisioterapi Pasca-Operasi, Klinik Bedah Tulang, EEG Saraf & Suite Pemulihan',
    highlights: ['Gait Track Rehab Medis', 'Klinik Bedah Ortopedi', 'Diagnostik EEG & EMG', 'Layanan Home-Care'],
    cameraElevationOffset: 1.15,
  },
};

const HOTSPOT_CATALOG: Record<string, HotspotDetails> = {
  'pendaftaran-tv': {
    id: 'pendaftaran-tv',
    title: 'Layar Antrean Pintar Pendaftaran',
    roomLabel: 'Zona 1 · Pendaftaran (Lantai 1)',
    metricLabel: 'STATUS LOKET 2',
    metricValue: 'Waktu tunggu ~4 mnt',
    description:
      'Pasien dengan E-Tiket aplikasi Nadi cukup memindai kode QR di kios mandiri tanpa antre dokumen fisik.',
    stepIndex: 1,
    ctaLabel: 'Ambil Antrean Online',
  },
  'poliklinik-vitals': {
    id: 'poliklinik-vitals',
    title: 'Stasiun Triase & Monitor Vital Digital',
    roomLabel: 'Zona 2 · Poliklinik Spesialis',
    metricLabel: 'TEKANAN DARAH & NADI',
    metricValue: '118/76 mmHg · 70 bpm',
    description:
      'Tensi, suhu, saturasi oksigen, dan berat badan otomatis masuk ke layar komputer dokter sebelum Anda masuk ruang periksa.',
    stepIndex: 2,
    specialtyId: 'penyakit-dalam',
    ctaLabel: 'Jadwalkan Konsultasi',
  },
  'radiologi-xray': {
    id: 'radiologi-xray',
    title: 'Rontgen Thorax Digital & Laboratorium',
    roomLabel: 'Zona 3 · Lab & Radiologi',
    metricLabel: 'WAKTU HASIL PENCITRAAN',
    metricValue: '< 35 Menit Terintegrasi',
    description:
      'Pemindaian sinar-X dosis rendah dengan pengiriman citra PACS instan langsung ke dokter pemeriksa dan aplikasi pasien.',
    stepIndex: 3,
    specialtyId: 'jantung',
    ctaLabel: 'Pesan Medical Check-Up',
  },
  'farmasi-shelf': {
    id: 'farmasi-shelf',
    title: 'Instalasi Farmasi E-Resep Otomatis',
    roomLabel: 'Zona 4 · Farmasi Terpadu',
    metricLabel: 'RESEP #RX-2041',
    metricValue: 'Siap Diambil / Diantar',
    description:
      'Begitu dokter menyimpan resep digital, apoteker langsung meracik obat. Tersedia opsi kurir instan 47 menit ke rumah.',
    stepIndex: 4,
    ctaLabel: 'Buat Janji & E-Resep',
  },
  'kasir-pos': {
    id: 'kasir-pos',
    title: 'Kasir Satu Pintu & Klaim Asuransi Otomatis',
    roomLabel: 'Zona 5 · Kasir & Administrasi',
    metricLabel: 'METODE PEMBAYARAN',
    metricValue: 'QRIS · Kartu · BPJS · Asuransi',
    description:
      'Seluruh rincian biaya konsultasi, tindakan lab, dan obat tergabung dalam satu tagihan transparan tanpa biaya tersembunyi.',
    stepIndex: 5,
    ctaLabel: 'Mulai Buat Janji',
  },
};

export function getFloorConfig(floor: FloorId): FloorConfig {
  return FLOOR_CONFIGS[floor] ?? FLOOR_CONFIGS[1];
}

export function getHotspotDetails(hotspotId: string | null | undefined): HotspotDetails | null {
  if (!hotspotId) return null;
  return HOTSPOT_CATALOG[hotspotId] ?? null;
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

export interface AppointmentBookingInput {
  doctorId: string;
  dateNum: string;
  timeSlot: string;
  patient: PatientFormData;
}

export interface AppointmentBookingValidationResult {
  valid: boolean;
  doctorError?: string;
  slotError?: string;
  patientErrors: Partial<Record<keyof PatientFormData, string>>;
}

export function validateAppointmentBooking(
  input: AppointmentBookingInput,
  doctors: DoctorItem[] = DOCTORS
): AppointmentBookingValidationResult {
  let doctorError: string | undefined;
  let slotError: string | undefined;

  const selectedDoc = doctors.find((d) => d.id === input.doctorId);
  if (!selectedDoc) {
    doctorError = 'Silakan pilih dokter spesialis terlebih dahulu.';
  } else {
    if (!input.dateNum) {
      slotError = 'Pilih tanggal kunjungan yang tersedia.';
    } else if (!input.timeSlot) {
      slotError = 'Pilih jam praktik dokter yang tersedia.';
    } else {
      const matchingSlot = selectedDoc.timeSlots.find(
        (s) => s.time === input.timeSlot
      );
      if (!matchingSlot || !matchingSlot.available) {
        slotError = 'Jam praktik yang dipilih tidak tersedia. Pilih jam lain.';
      }
    }
  }

  const patientValidation = validatePatientForm(input.patient);

  return {
    valid: !doctorError && !slotError && patientValidation.valid,
    doctorError,
    slotError,
    patientErrors: patientValidation.errors,
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
  exteriorWalkProgress: number;
  activeStationStage: number | null;
  stationActionFactor: number;
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

  // When transitioning between interior rooms (idx0 >= 1), pull camera slightly
  // higher/wider in the middle of the corridor walk, then zoom in NEAR at the station!
  const midWalkArc =
    idx0 >= 1 && idx1 > idx0 ? Math.sin(rawFrac * Math.PI) : 0;

  const cameraPos: [number, number, number] = [
    s0.cameraPos[0] + (s1.cameraPos[0] - s0.cameraPos[0]) * frac,
    s0.cameraPos[1] +
      (s1.cameraPos[1] - s0.cameraPos[1]) * frac +
      midWalkArc * 1.65,
    s0.cameraPos[2] +
      (s1.cameraPos[2] - s0.cameraPos[2]) * frac +
      midWalkArc * 2.1,
  ];

  const cameraTarget: [number, number, number] = [
    s0.cameraTarget[0] + (s1.cameraTarget[0] - s0.cameraTarget[0]) * frac,
    s0.cameraTarget[1] + (s1.cameraTarget[1] - s0.cameraTarget[1]) * frac,
    s0.cameraTarget[2] + (s1.cameraTarget[2] - s0.cameraTarget[2]) * frac,
  ];

  // Compute patient path progress with station dwell plateaus:
  // - From Step 0 (Gedung) to Step 1 (Pendaftaran): patient walks immediately from 0.0 to 0.84,
  //   then dwells at Pendaftaran (0.84..1.0) performing check-in.
  // - Between interior rooms (Step 1->2, 2->3, 3->4, 4->5): patient dwells at current station
  //   for 0.0..0.18, walks through the open corridor during 0.18..0.82, and arrives/dwells at
  //   the next station for 0.82..1.0!
  let walkAlpha: number;
  if (idx0 === 0) {
    walkAlpha = smoothstep01(rawFrac / 0.84);
  } else {
    walkAlpha = smoothstep01((rawFrac - 0.18) / 0.64);
  }

  const patientPathProgress =
    s0.patientPathProgress +
    (s1.patientPathProgress - s0.patientPathProgress) * walkAlpha;

  // Exterior patient walks from the front walkway right into the main hospital entrance doors
  // as continuousStep moves from 0.0 (Gedung) toward 0.55 (entering Pendaftaran)
  const exteriorWalkProgress = smoothstep01(clamped / 0.52);

  // Determine if the patient is currently at a station performing an interactive action
  const nearestStep = Math.round(clamped);
  const distToNearest = Math.abs(clamped - nearestStep);
  const stationActionFactor =
    nearestStep >= 1 ? 1 - smoothstep01(distToNearest / 0.24) : 0;
  const activeStationStage =
    nearestStep >= 1 && stationActionFactor > 0.15 ? nearestStep : null;

  // Delay cutaway lift slightly (starts at 0.26) so the user clearly sees the exterior patient
  // walking toward the hospital entrance doors while the camera zooms in from far to near!
  const interiorFactor = smoothstep01((clamped - 0.22) / 0.58);

  return {
    cameraPos,
    cameraTarget,
    patientPathProgress,
    exteriorWalkProgress,
    activeStationStage,
    stationActionFactor,
    interiorFactor,
  };
}
