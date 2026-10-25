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

export interface HospitalAmbientMix {
  masterGain: number;
  chatterGain: number;
  equipmentHumGain: number;
  footstepGain: number;
  lowpassCutoffHz: number;
}

/**
 * Computes the subtle, low-volume procedural audio mix for the 3D hospital environment.
 * As the user enters the building (`interiorFactor` 0 -> 1), the interior ambient layers
 * (distant lobby chatter, quiet medical equipment hum, soft footsteps) fade in smoothly
 * and the acoustic low-pass filter opens up from muffled exterior (320 Hz) to indoor (1450 Hz).
 */
export function computeHospitalAmbientMix(params: {
  interiorFactor: number;
  walkStrength: number;
  activeStationStage: number | null;
  enabled: boolean;
}): HospitalAmbientMix {
  if (!params.enabled) {
    return {
      masterGain: 0,
      chatterGain: 0,
      equipmentHumGain: 0,
      footstepGain: 0,
      lowpassCutoffHz: 320,
    };
  }

  const interior = Math.max(0, Math.min(1, params.interiorFactor));
  const walk = Math.max(0, Math.min(1, params.walkStrength));
  const envCurve = smoothstep01(interior);

  // Subtle master gain fades in from whisper-quiet exterior (0.008) to low-volume indoor (0.085)
  const masterGain = Number((0.008 + envCurve * 0.077).toFixed(4));

  // Distant lobby/corridor murmur (warmest near Pendaftaran, Farmasi, and Kasir)
  const stageChatterBoost =
    params.activeStationStage === 1
      ? 1.25
      : params.activeStationStage === 4 || params.activeStationStage === 5
        ? 1.15
        : 0.9;
  const chatterGain = Number(
    (envCurve * 0.034 * stageChatterBoost).toFixed(4)
  );

  // Quiet medical equipment hum (strongest in Poliklinik Stage 2 & Lab/Radiologi Stage 3)
  const stageHumBoost =
    params.activeStationStage === 3
      ? 1.45
      : params.activeStationStage === 2
        ? 1.25
        : 0.85;
  const equipmentHumGain = Number(
    (envCurve * 0.026 * stageHumBoost).toFixed(4)
  );

  // Soft footsteps when character is walking (active during entrance walk-in and indoor corridor travel)
  const footstepPresence = Math.max(0.28, envCurve);
  const footstepGain = Number(
    (walk * footstepPresence * 0.052).toFixed(4)
  );

  // Acoustic filter opens up as camera moves inside the building
  const lowpassCutoffHz = Math.round(320 + envCurve * 1130);

  return {
    masterGain,
    chatterGain,
    equipmentHumGain,
    footstepGain,
    lowpassCutoffHz,
  };
}

export type FloatingInfoPointCategory = 'health-tip' | 'directory';

export interface FloatingInfoPointDetail {
  id: string;
  category: FloatingInfoPointCategory;
  categoryBadge: string;
  stepIndex: number;
  shortBadgeLabel: string;
  zoneLabel: string;
  floorLocation: string;
  operatingHours: string;
  title: string;
  summary: string;
  bulletPoints: string[];
  clinicalNote: string;
  relatedSpecialtyId: string;
  ctaLabel: string;
  position3D: [number, number, number];
}

export const FLOATING_INFO_POINTS: FloatingInfoPointDetail[] = [
  {
    id: 'info-gedung-direktori',
    category: 'directory',
    categoryBadge: 'Direktori & Panduan RS',
    stepIndex: 0,
    shortBadgeLabel: 'DIREKTORI GEDUNG',
    zoneLabel: 'Eksterior & Lobi Utama',
    floorLocation: 'Gedung A · Lantai 1–3 & Kanopi Barat IGD',
    operatingHours: 'IGD 24 Jam · Poliklinik 07:00 – 21:00 WIB',
    title: 'Direktori Gedung Utama & Akses IGD 24 Jam',
    summary:
      'Panduan navigasi cepat seluruh fasilitas medis, jalur drop-off ramah kursi roda, dan pembagian lantai spesialis RS Nadi.',
    bulletPoints: [
      'Lantai 1: Lobi Utama, Pendaftaran Digital, Poliklinik Spesialis, Lab & Radiologi, Farmasi, dan Kasir Terpadu.',
      'Lantai 2: Pusat Jantung Terpadu (Echo 4D & Treadmill) serta Klinik Tumbuh Kembang Anak.',
      'Lantai 3: Pusat Bedah Minimal Invasif, Klinik Mata & Saraf, serta Ruang Pemulihan Eksekutif.',
    ],
    clinicalNote:
      'Pasien darurat medis atau nyeri dada akut disarankan langsung menuju Kanopi IGD 24 Jam di sisi barat gedung tanpa perlu antrean lobi.',
    relatedSpecialtyId: 'jantung',
    ctaLabel: 'Jadwalkan Kunjungan Poliklinik',
    position3D: [1.8, 3.85, 3.3],
  },
  {
    id: 'info-pendaftaran-direktori',
    category: 'directory',
    categoryBadge: 'Direktori & Panduan RS',
    stepIndex: 1,
    shortBadgeLabel: 'PANDUAN CHECK-IN',
    zoneLabel: 'Zona 1 · Pendaftaran',
    floorLocation: 'Gedung A · Lantai 1 · Sayap Barat (Loket 1–3)',
    operatingHours: 'Senin – Minggu · 06:30 – 20:30 WIB',
    title: 'Panduan Check-In Mandiri, BPJS & Asuransi Rekanan',
    summary:
      'Proses verifikasi identitas dan aktivasi E-Tiket berlangsung kurang dari 2 menit tanpa pengisian formulir kertas berulang.',
    bulletPoints: [
      'Siapkan QR E-Tiket dari aplikasi Nadi atau KTP/KIA untuk pemindaian cepat di Loket 2.',
      'Pasien BPJS Kesehatan cukup memindai rujukan aktif Faskes 1 melalui fitur Mobile JKN.',
      'Tersedia jalur prioritas khusus lansia (>65 tahun), ibu hamil, dan pasien disabilitas di Loket 1.',
    ],
    clinicalNote:
      'Hadir 15 menit sebelum jadwal konsultasi memastikan pemeriksaan tanda vital oleh perawat berjalan tenang dan tepat waktu.',
    relatedSpecialtyId: 'penyakit-dalam',
    ctaLabel: 'Ambil Antrean Online Sekarang',
    position3D: [-5.2, 3.9, -3.2],
  },
  {
    id: 'info-poliklinik-tips',
    category: 'health-tip',
    categoryBadge: 'Tips Kesehatan',
    stepIndex: 2,
    shortBadgeLabel: 'TIPS TENSI & JANTUNG',
    zoneLabel: 'Zona 2 · Poliklinik',
    floorLocation: 'Gedung A · Lantai 1 · Ruang Konsultasi 101–108',
    operatingHours: 'Senin – Sabtu · 08:00 – 20:00 WIB',
    title: 'Tips Kesehatan: Persiapan Cek Tensi & Konsultasi Dokter',
    summary:
      'Cara menjaga akurasi pengukuran tekanan darah dan memaksimalkan waktu konsultasi bersama dokter spesialis.',
    bulletPoints: [
      'Duduk rileks selama 5 menit sebelum tensi diukur; hindari konsumsi kafein atau merokok 30 menit sebelumnya.',
      'Tekanan darah optimal dewasa berada di kisaran <120/80 mmHg dengan detak nadi istirahat 60–100 bpm.',
      'Catat riwayat gejala, durasi keluhan, serta daftar obat rutin yang sedang dikonsumsi untuk ditunjukkan ke dokter.',
    ],
    clinicalNote:
      'Deteksi dini hipertensi mengurangi risiko komplikasi kardiovaskular hingga 45%. Lakukan skrining berkala setiap 6 bulan.',
    relatedSpecialtyId: 'jantung',
    ctaLabel: 'Konsultasi Spesialis Jantung / Dalam',
    position3D: [1.8, 3.9, -2.5],
  },
  {
    id: 'info-radiologi-tips',
    category: 'health-tip',
    categoryBadge: 'Tips Kesehatan',
    stepIndex: 3,
    shortBadgeLabel: 'TIPS PUASA LAB',
    zoneLabel: 'Zona 3 · Lab & Radiologi',
    floorLocation: 'Gedung A · Lantai 1 · Sayap Diagnostik Terpadu',
    operatingHours: 'Layanan Lab & Radiologi 24 Jam',
    title: 'Tips Kesehatan: Panduan Puasa Lab & Keamanan Sinar-X',
    summary:
      'Persiapan pra-analitik yang tepat menjamin hasil pemeriksaan darah lengkap, profil lipid, dan rontgen thorax yang akurat.',
    bulletPoints: [
      'Puasa makan selama 8–10 jam untuk cek Gula Darah Puasa & Kolesterol (minum air putih tawar tetap diperbolehkan).',
      'Lepaskan perhiasan logam, kalung, atau kancing besi di area dada sebelum pemeriksaan Rontgen Thorax Digital.',
      'Informasikan kepada petugas radiografer apabila Anda sedang hamil atau menduga adanya kehamilan.',
    ],
    clinicalNote:
      'Sistem Digital Radiography (DR) RS Nadi menggunakan dosis radiasi ultra-rendah (hingga 70% lebih rendah dibanding rontgen konvensional).',
    relatedSpecialtyId: 'penyakit-dalam',
    ctaLabel: 'Daftar Medical Check-Up & Lab',
    position3D: [8.6, 3.9, -3.4],
  },
  {
    id: 'info-farmasi-tips',
    category: 'health-tip',
    categoryBadge: 'Tips Kesehatan',
    stepIndex: 4,
    shortBadgeLabel: 'TIPS OBAT AMAN',
    zoneLabel: 'Zona 4 · Farmasi Klinik',
    floorLocation: 'Gedung A · Lantai 1 · Sayap Timur',
    operatingHours: 'Farmasi Rawat Jalan & IGD 24 Jam',
    title: 'Tips Kesehatan: Prinsip 5 Benar Konsumsi Obat & Antibiotik',
    summary:
      'Edukasi apoteker klinis agar terapi obat bekerja efektif, aman bagi lambung, dan bebas interaksi obat yang merugikan.',
    bulletPoints: [
      'Patuhi aturan waktu minum obat: sebelum makan (30 menit sebelum) atau sesudah makan sesuai label etiket digital.',
      'Habiskan seluruh dosis antibiotik yang diresepkan dokter meskipun gejala demam atau nyeri sudah membaik.',
      'Simpan obat di tempat sejuk dan kering (suhu ruang 15–25°C), jauh dari paparan sinar matahari langsung.',
    ],
    clinicalNote:
      'Gunakan air putih suhu ruang saat menelan obat; hindari minum obat bersamaan dengan susu, teh pekat, atau kopi karena dapat menghambat penyerapan.',
    relatedSpecialtyId: 'penyakit-dalam',
    ctaLabel: 'Jadwalkan Konsultasi & Resep',
    position3D: [12.5, 3.9, 1.8],
  },
  {
    id: 'info-kasir-direktori',
    category: 'directory',
    categoryBadge: 'Direktori & Panduan RS',
    stepIndex: 5,
    shortBadgeLabel: 'PANDUAN ASURANSI',
    zoneLabel: 'Zona 5 · Kasir & Asuransi',
    floorLocation: 'Gedung A · Lantai 1 · Pintu Keluar Timur',
    operatingHours: 'Kasir Utama & Konter Asuransi 24 Jam',
    title: 'Panduan Pembayaran Cashless, Asuransi & Pengantaran Obat',
    summary:
      'Penyelesaian administrasi transparan dalam satu loket terintegrasi beserta opsi pengiriman obat langsung ke rumah.',
    bulletPoints: [
      'Mendukung pembayaran instan via QRIS, kartu debit/kredit semua bank, dompet digital, dan penjaminan asuransi korporat.',
      'E-Kuitansi resmi dan resume medis digital otomatis terkirim ke aplikasi Nadi untuk kemudahan klaim reimbursement.',
      'Aktifkan layanan Kurir Farmasi Nadi di kasir bila Anda ingin langsung pulang tanpa menunggu racikan obat.',
    ],
    clinicalNote:
      'Seluruh rincian biaya konsultasi, tindakan lab, dan obat ditampilkan secara transparan sebelum Anda melakukan konfirmasi bayar.',
    relatedSpecialtyId: 'penyakit-dalam',
    ctaLabel: 'Buat Janji Temu Cashless',
    position3D: [15.8, 3.9, 2.2],
  },
];

export function getFloatingInfoPointDetails(
  infoPointId: string | null
): FloatingInfoPointDetail | null {
  if (!infoPointId) return null;
  return FLOATING_INFO_POINTS.find((item) => item.id === infoPointId) ?? null;
}

export function filterFloatingInfoPointsByCategory(
  category: 'all' | FloatingInfoPointCategory
): FloatingInfoPointDetail[] {
  if (category === 'all') return FLOATING_INFO_POINTS;
  return FLOATING_INFO_POINTS.filter((item) => item.category === category);
}

export function getFloatingInfoPointForStep(
  stepIndex: number
): FloatingInfoPointDetail {
  const clamped = Math.max(
    0,
    Math.min(FLOATING_INFO_POINTS.length - 1, Math.round(stepIndex))
  );
  return (
    FLOATING_INFO_POINTS.find((item) => item.stepIndex === clamped) ??
    FLOATING_INFO_POINTS[0]
  );
}


