export interface TourStep {
  id: number;
  shortLabel: string;
  stepTag: string;
  titleBlack: string;
  titleOrange: string;
  description: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  patientPathProgress: number;
}

export interface SpecialtyItem {
  id: string;
  shortName: string;
  name: string;
  description: string;
  location: string;
  iconName: 'heart' | 'baby' | 'sparkles' | 'activity' | 'brain' | 'bone' | 'smile';
}

export interface DoctorItem {
  id: string;
  name: string;
  specialtyId: string;
  specialtyLabel: string;
  experienceYears: number;
  reviewCount: number;
  rating: number;
  price: number;
  nextSchedule: string;
  availableDays: string[];
  timeSlots: { time: string; available: boolean }[];
  coatColor: string;
  scrubColor: string;
  hairColor: string;
  skinTone: string;
  gender: 'male' | 'female';
}

export interface McuPackageItem {
  id: string;
  name: string;
  priceDisplay: string;
  priceNumeric: number;
  popular?: boolean;
  features: string[];
  details: {
    duration: string;
    totalChecks: number;
    fastingRequired: string;
    reportDelivery: string;
  };
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  relation: string;
  avatarBg: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 0,
    shortLabel: 'Gedung',
    stepTag: 'MERAWAT HARI ESOK YANG LEBIH CERAH',
    titleBlack: 'Dokter Terbaik.',
    titleOrange: 'Tanpa Antre.',
    description:
      'Ikuti perjalanan pasien di RS Nadi—dari pendaftaran sampai pulang, semuanya tertata dan bisa dipantau dari ponsel.',
    cameraPos: [-16.0, 13.5, 22.0],
    cameraTarget: [-2.2, 4.4, 0.0],
    patientPathProgress: 0.0,
  },
  {
    id: 1,
    shortLabel: 'Pendaftaran',
    stepTag: 'LANGKAH 1 · PENDAFTARAN',
    titleBlack: 'Ambil Antrean,',
    titleOrange: 'Pantau dari Ponsel.',
    description:
      'Nomor antrean bisa diambil online. Layar di lobi dan aplikasi menampilkan giliran yang sama, jadi Anda cukup datang saat dipanggil.',
    cameraPos: [-8.5, 10.8, 11.2],
    cameraTarget: [-5.8, 1.0, -2.2],
    patientPathProgress: 0.14,
  },
  {
    id: 2,
    shortLabel: 'Poliklinik',
    stepTag: 'LANGKAH 2 · POLIKLINIK',
    titleBlack: 'Dicek Perawat,',
    titleOrange: 'Ditangani Dokter.',
    description:
      'Perawat mencatat tanda-tanda vital—tensi, nadi, suhu, berat badan—lalu dokter spesialis memeriksa dengan data yang sudah lengkap.',
    cameraPos: [-4.2, 11.2, 11.0],
    cameraTarget: [0.2, 1.2, -2.5],
    patientPathProgress: 0.38,
  },
  {
    id: 3,
    shortLabel: 'Lab & Radiologi',
    stepTag: 'LANGKAH 3 · LABORATORIUM & RADIOLOGI',
    titleBlack: 'Lab & Rontgen,',
    titleOrange: 'Hasil Langsung Masuk.',
    description:
      'Pengambilan sampel dan rontgen dalam satu gedung. Hasilnya otomatis terkirim ke dokter dan aplikasi Anda.',
    cameraPos: [2.4, 11.4, 10.8],
    cameraTarget: [6.8, 1.2, -2.8],
    patientPathProgress: 0.64,
  },
  {
    id: 4,
    shortLabel: 'Farmasi',
    stepTag: 'LANGKAH 4 · FARMASI',
    titleBlack: 'Resep Digital,',
    titleOrange: 'Obat Siap Diambil.',
    description:
      'Resep dikirim langsung dari ruang dokter ke farmasi. Notifikasi masuk begitu obat siap, tanpa perlu menunggu di depan loket.',
    cameraPos: [6.5, 10.5, 13.8],
    cameraTarget: [10.6, 1.2, 2.2],
    patientPathProgress: 0.85,
  },
  {
    id: 5,
    shortLabel: 'Kasir',
    stepTag: 'LANGKAH 5 · KASIR',
    titleBlack: 'Satu Tagihan,',
    titleOrange: 'Langsung Pulang.',
    description:
      'Konsultasi, lab, dan obat dirangkum dalam satu tagihan. Bayar dengan QRIS, kartu, e-wallet, atau BPJS, lalu bukti masuk ke WhatsApp.',
    cameraPos: [8.8, 10.2, 14.5],
    cameraTarget: [12.8, 1.1, 3.2],
    patientPathProgress: 1.0,
  },
];

export const SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'jantung',
    shortName: 'Jantung',
    name: 'Jantung & Pembuluh Darah',
    description: 'EKG, ekokardiografi, treadmill test, dan konsultasi kardiologi.',
    location: 'Gedung A · Lantai 2',
    iconName: 'heart',
  },
  {
    id: 'anak',
    shortName: 'Anak',
    name: 'Kesehatan Anak',
    description: 'Imunisasi lengkap, pemantauan tumbuh kembang, dan klinik laktasi.',
    location: 'Gedung B · Lantai 1',
    iconName: 'baby',
  },
  {
    id: 'kandungan',
    shortName: 'Kandungan',
    name: 'Kebidanan & Kandungan',
    description: 'Kontrol kehamilan, USG 4D, persalinan, dan kesehatan reproduksi.',
    location: 'Gedung B · Lantai 2',
    iconName: 'sparkles',
  },
  {
    id: 'penyakit-dalam',
    shortName: 'Penyakit Dalam',
    name: 'Penyakit Dalam',
    description: 'Diabetes, hipertensi, gangguan pencernaan, dan metabolik.',
    location: 'Gedung A · Lantai 1',
    iconName: 'activity',
  },
  {
    id: 'saraf',
    shortName: 'Saraf',
    name: 'Saraf (Neurologi)',
    description: 'Sakit kepala kronis, stroke, gangguan tidur, dan saraf kejepit.',
    location: 'Gedung A · Lantai 3',
    iconName: 'brain',
  },
  {
    id: 'ortopedi',
    shortName: 'Ortopedi',
    name: 'Ortopedi & Traumatologi',
    description: 'Cedera olahraga, nyeri sendi, tulang belakang, dan rehabilitasi.',
    location: 'Gedung A · Lantai 3',
    iconName: 'bone',
  },
  {
    id: 'gigi',
    shortName: 'Gigi',
    name: 'Gigi & Mulut',
    description: 'Scaling, tambal estetik, ortodonti, dan bedah mulut.',
    location: 'Gedung B · Lantai 1',
    iconName: 'smile',
  },
];

export const DOCTORS: DoctorItem[] = [
  {
    id: 'dr-raka',
    name: 'dr. Raka Pradipta, Sp.JP, FIHA',
    specialtyId: 'jantung',
    specialtyLabel: 'Jantung & Pembuluh Darah',
    experienceYears: 14,
    reviewCount: 380,
    rating: 4.9,
    price: 350000,
    nextSchedule: 'Sen, 26 Okt · 09:00',
    availableDays: ['26', '28', '30'],
    timeSlots: [
      { time: '08:00', available: true },
      { time: '08:30', available: false },
      { time: '09:00', available: true },
      { time: '09:30', available: false },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: true },
    ],
    coatColor: '#FAF8F5',
    scrubColor: '#E8612C',
    hairColor: '#1E1B18',
    skinTone: '#F1C6A7',
    gender: 'male',
  },
  {
    id: 'dr-nadia',
    name: 'dr. Nadia Kusuma, Sp.A',
    specialtyId: 'anak',
    specialtyLabel: 'Kesehatan Anak',
    experienceYears: 9,
    reviewCount: 420,
    rating: 4.9,
    price: 300000,
    nextSchedule: 'Sen, 26 Okt · 10:00',
    availableDays: ['26', '27', '29', '31'],
    timeSlots: [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: true },
      { time: '10:30', available: false },
      { time: '11:00', available: true },
      { time: '13:30', available: true },
    ],
    coatColor: '#FAF8F5',
    scrubColor: '#10B981',
    hairColor: '#27201C',
    skinTone: '#F5CFB4',
    gender: 'female',
  },
  {
    id: 'dr-sekar',
    name: 'dr. Sekar Ayuningtyas, Sp.OG',
    specialtyId: 'kandungan',
    specialtyLabel: 'Kebidanan & Kandungan',
    experienceYears: 11,
    reviewCount: 295,
    rating: 4.8,
    price: 340000,
    nextSchedule: 'Sel, 27 Okt · 09:00',
    availableDays: ['27', '28', '30'],
    timeSlots: [
      { time: '08:30', available: true },
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '14:00', available: true },
    ],
    coatColor: '#FAF8F5',
    scrubColor: '#15803D',
    hairColor: '#1C1917',
    skinTone: '#F3C9AC',
    gender: 'female',
  },
  {
    id: 'dr-hendra',
    name: 'dr. Hendra Wijaya, Sp.PD',
    specialtyId: 'penyakit-dalam',
    specialtyLabel: 'Penyakit Dalam',
    experienceYears: 12,
    reviewCount: 340,
    rating: 4.9,
    price: 320000,
    nextSchedule: 'Sen, 26 Okt · 08:30',
    availableDays: ['26', '28', '29', '31'],
    timeSlots: [
      { time: '08:00', available: true },
      { time: '08:30', available: true },
      { time: '09:30', available: true },
      { time: '10:30', available: true },
    ],
    coatColor: '#FAF8F5',
    scrubColor: '#0284C7',
    hairColor: '#262626',
    skinTone: '#E8B998',
    gender: 'male',
  },
  {
    id: 'dr-bima',
    name: 'dr. Bima Santoso, Sp.N',
    specialtyId: 'saraf',
    specialtyLabel: 'Saraf (Neurologi)',
    experienceYears: 10,
    reviewCount: 215,
    rating: 4.8,
    price: 350000,
    nextSchedule: 'Rab, 28 Okt · 10:00',
    availableDays: ['26', '28', '30'],
    timeSlots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
    ],
    coatColor: '#FAF8F5',
    scrubColor: '#6366F1',
    hairColor: '#1F1D1B',
    skinTone: '#ECC1A1',
    gender: 'male',
  },
  {
    id: 'dr-kevin',
    name: 'dr. Kevin Halim, Sp.OT',
    specialtyId: 'ortopedi',
    specialtyLabel: 'Ortopedi & Traumatologi',
    experienceYears: 8,
    reviewCount: 190,
    rating: 4.9,
    price: 360000,
    nextSchedule: 'Kam, 29 Okt · 09:30',
    availableDays: ['27', '29', '31'],
    timeSlots: [
      { time: '09:30', available: true },
      { time: '10:30', available: true },
      { time: '13:00', available: true },
    ],
    coatColor: '#FAF8F5',
    scrubColor: '#D97706',
    hairColor: '#1C1917',
    skinTone: '#F1C6A7',
    gender: 'male',
  },
  {
    id: 'drg-clara',
    name: 'drg. Clara Prameswari, Sp.KG',
    specialtyId: 'gigi',
    specialtyLabel: 'Gigi & Mulut',
    experienceYears: 7,
    reviewCount: 260,
    rating: 4.9,
    price: 280000,
    nextSchedule: 'Sen, 26 Okt · 11:00',
    availableDays: ['26', '27', '28', '30'],
    timeSlots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
    ],
    coatColor: '#FAF8F5',
    scrubColor: '#EC4899',
    hairColor: '#29231E',
    skinTone: '#F6D2B8',
    gender: 'female',
  },
];

export const SCHEDULE_DATES = [
  { dayLabel: 'SAB', dateNum: '24', fullLabel: 'Sabtu, 24 Oktober 2026', disabled: true },
  { dayLabel: 'MIN', dateNum: '25', fullLabel: 'Minggu, 25 Oktober 2026', disabled: true },
  { dayLabel: 'SEN', dateNum: '26', fullLabel: 'Senin, 26 Oktober 2026', disabled: false },
  { dayLabel: 'SEL', dateNum: '27', fullLabel: 'Selasa, 27 Oktober 2026', disabled: false },
  { dayLabel: 'RAB', dateNum: '28', fullLabel: 'Rabu, 28 Oktober 2026', disabled: false },
  { dayLabel: 'KAM', dateNum: '29', fullLabel: 'Kamis, 29 Oktober 2026', disabled: false },
  { dayLabel: 'JUM', dateNum: '30', fullLabel: 'Jumat, 30 Oktober 2026', disabled: false },
  { dayLabel: 'SAB', dateNum: '31', fullLabel: 'Sabtu, 31 Oktober 2026', disabled: false },
];

export const MCU_PACKAGES: McuPackageItem[] = [
  {
    id: 'basic',
    name: 'Basic',
    priceDisplay: '650',
    priceNumeric: 650000,
    features: [
      '2 jam · 12 pemeriksaan',
      'Hasil dalam 1 hari kerja',
      'Cocok untuk cek rutin tahunan',
    ],
    details: {
      duration: '2 Jam',
      totalChecks: 12,
      fastingRequired: 'Puasa 8 jam sebelum ambil darah',
      reportDelivery: 'PDF di aplikasi & konsultasi dokter umum',
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    priceDisplay: '1,45',
    priceNumeric: 1450000,
    popular: true,
    features: [
      '3 jam · 28 pemeriksaan',
      'Prioritas di semua titik',
      'Termasuk EKG & rontgen',
    ],
    details: {
      duration: '3 Jam',
      totalChecks: 28,
      fastingRequired: 'Puasa 8–10 jam sebelum pemeriksaan',
      reportDelivery: 'Hasil hari yang sama + makan sehat gratis',
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    priceDisplay: '2,9',
    priceNumeric: 2900000,
    features: [
      '4 jam · 45 pemeriksaan',
      'Pendamping pribadi',
      'Ruang tunggu eksekutif',
    ],
    details: {
      duration: '4 Jam',
      totalChecks: 45,
      fastingRequired: 'Puasa 10 jam · dijemput layanan VIP opsional',
      reportDelivery: 'Konsultasi 2 dokter spesialis + suplemen 30 hari',
    },
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'putri',
    quote:
      'Daftar online-nya cepat. Datang pas giliran, langsung diperiksa — nggak perlu ambil cuti seharian lagi.',
    author: 'Putri A.',
    relation: 'Pasien Poliklinik Anak',
    avatarBg: '#E8612C',
  },
  {
    id: 'dimas',
    quote:
      'Ambulans tiba kurang dari 12 menit dan posisinya bisa dipantau dari ponsel. Sangat menenangkan.',
    author: 'Dimas K.',
    relation: 'Keluarga pasien IGD',
    avatarBg: '#10B981',
  },
  {
    id: 'ratna',
    quote:
      'Dokternya sabar menjelaskan, perawatnya ramah. Hasil lab langsung muncul di aplikasi.',
    author: 'Ibu Ratna S.',
    relation: 'Pasien Penyakit Dalam',
    avatarBg: '#0284C7',
  },
];

export const INSURANCE_PARTNERS = [
  'Proteksi+',
  'AsuransiKu',
  'Sentosa Life',
  'MediGuard',
  'Amanah Sehat',
  'Garda Prima',
];

export const SAMPLE_PATIENT_DATA = {
  fullName: 'Rina Maharani',
  nik: '3174051207920003',
  birthDate: '12/07/1992',
  gender: 'Perempuan' as const,
  phone: '0812-3456-7890',
  email: 'rina@contoh.id',
  paymentMethodType: 'umum' as const,
  complaint: 'Dada terasa berdebar saat beraktivitas sejak 2 minggu terakhir.',
};
