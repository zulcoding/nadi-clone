import * as React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CreditCard,
  MapPin,
  Phone,
  Printer,
  QrCode,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react';
import { Dialog, DialogCloseButton } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { formatRupiah } from '@/src/lib/utils';
import {
  DOCTORS,
  SAMPLE_PATIENT_DATA,
  SCHEDULE_DATES,
  SPECIALTIES,
  type DoctorItem,
} from './data';
import {
  calculateAppointmentTotal,
  filterDoctorsBySpecialty,
  validatePatientForm,
  type PatientFormData,
} from './booking-logic';

export interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSpecialtyId?: string;
  initialDoctor?: DoctorItem | null;
  onBookingConfirmed?: (ticket: {
    queueCode: string;
    doctorName: string;
    scheduleText: string;
    patientName: string;
  }) => void;
}

const STEP_LABELS = [
  { num: 1, label: 'Layanan' },
  { num: 2, label: 'Dokter' },
  { num: 3, label: 'Jadwal' },
  { num: 4, label: 'Data pasien' },
  { num: 5, label: 'Pembayaran' },
];

export function BookingModal({
  open,
  onOpenChange,
  initialSpecialtyId,
  initialDoctor,
  onBookingConfirmed,
}: BookingModalProps) {
  const [step, setStep] = React.useState<number>(1);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = React.useState<string>(
    initialSpecialtyId || 'jantung'
  );
  const [selectedDoctor, setSelectedDoctor] = React.useState<DoctorItem>(
    initialDoctor || DOCTORS[0]
  );
  const [selectedDateNum, setSelectedDateNum] = React.useState<string>('28');
  const [selectedTime, setSelectedTime] = React.useState<string>('10:00');
  const [patientForm, setPatientForm] = React.useState<PatientFormData>({
    fullName: '',
    nik: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
    paymentMethodType: 'umum',
    complaint: '',
  });
  const [formErrors, setFormErrors] = React.useState<
    Partial<Record<keyof PatientFormData, string>>
  >({});
  const [paymentChannel, setPaymentChannel] = React.useState<
    'qris' | 'va' | 'ewallet' | 'card'
  >('qris');
  const [showQrCode, setShowQrCode] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [calendarAdded, setCalendarAdded] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setIsConfirmed(false);
    setShowQrCode(false);
    setCalendarAdded(false);

    if (initialDoctor) {
      setSelectedSpecialtyId(initialDoctor.specialtyId);
      setSelectedDoctor(initialDoctor);
      setStep(3);
    } else if (initialSpecialtyId) {
      setSelectedSpecialtyId(initialSpecialtyId);
      const matchingDocs = filterDoctorsBySpecialty(initialSpecialtyId, DOCTORS);
      if (matchingDocs.length > 0) {
        setSelectedDoctor(matchingDocs[0]);
      }
      setStep(1);
    } else {
      setStep(1);
    }
  }, [open, initialSpecialtyId, initialDoctor]);

  const currentSpecialty =
    SPECIALTIES.find((s) => s.id === selectedSpecialtyId) || SPECIALTIES[0];
  const currentDateObj =
    SCHEDULE_DATES.find((d) => d.dateNum === selectedDateNum) ||
    SCHEDULE_DATES[4];

  const pricing = calculateAppointmentTotal(
    selectedDoctor.price,
    patientForm.paymentMethodType
  );

  const handleNextFromStep4 = () => {
    const result = validatePatientForm(patientForm);
    if (!result.valid) {
      setFormErrors(result.errors);
      return;
    }
    setFormErrors({});
    setStep(5);
  };

  const handleFillSampleData = () => {
    setPatientForm({
      ...SAMPLE_PATIENT_DATA,
    });
    setFormErrors({});
  };

  const handleConfirmPayment = () => {
    setIsConfirmed(true);
    onBookingConfirmed?.({
      queueCode: 'A-030',
      doctorName: selectedDoctor.name,
      scheduleText: `${currentDateObj.fullLabel} · ${selectedTime} WIB`,
      patientName: patientForm.fullName || 'Rina Maharani',
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      maxWidthClass="max-w-4xl"
      ariaLabel="Formulir Pembuatan Janji Dokter RS Nadi"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[540px] max-h-[90vh]">
        {/* Left Dark Sidebar */}
        <div className="hidden md:flex md:col-span-4 flex-col justify-between bg-[#18181B] p-6 text-white">
          <div>
            {/* Miniature 3D Clinic Header Illustration */}
            <div className="mb-5 h-28 w-full overflow-hidden rounded-2xl bg-[#F2ECE1]">
              <svg
                viewBox="0 0 240 110"
                className="h-full w-full"
                aria-hidden="true"
              >
                <rect width="240" height="110" fill="#F3ECE0" />
                <path
                  d="M 20 95 L 110 55 L 220 95"
                  fill="none"
                  stroke="#E8612C"
                  strokeWidth="4"
                />
                <rect
                  x="75"
                  y="24"
                  width="90"
                  height="45"
                  rx="6"
                  fill="#D9A16C"
                />
                <circle cx="105" cy="20" r="9" fill="#18181B" />
                <circle cx="145" cy="65" r="10" fill="#E8612C" />
              </svg>
            </div>

            <div className="text-[10px] font-bold tracking-[0.16em] text-[#A1A1AA]">
              JANJI DOKTER
            </div>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight">
              Buat Janji
            </h2>

            {/* 5 Step Navigation List */}
            <ol className="mt-6 space-y-3 text-xs">
              {STEP_LABELS.map((item) => {
                const isDone = isConfirmed || step > item.num;
                const isCurrent = !isConfirmed && step === item.num;
                return (
                  <li key={item.num} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                        isDone
                          ? 'bg-[#E8612C] text-white'
                          : isCurrent
                            ? 'bg-[#E8612C] text-white ring-4 ring-[#E8612C]/25'
                            : 'bg-white/10 text-[#A1A1AA]'
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : item.num}
                    </span>
                    <span
                      className={
                        isCurrent || isDone
                          ? 'font-bold text-white'
                          : 'text-[#A1A1AA]'
                      }
                    >
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Live Selection Summary */}
          <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs">
            <div>
              <div className="text-[10px] text-[#A1A1AA]">LAYANAN</div>
              <div className="font-bold text-white truncate">
                {currentSpecialty.name}
              </div>
            </div>

            {step >= 2 && (
              <div>
                <div className="text-[10px] text-[#A1A1AA]">DOKTER</div>
                <div className="font-bold text-white truncate">
                  {selectedDoctor.name}
                </div>
              </div>
            )}

            {step >= 3 && (
              <div>
                <div className="text-[10px] text-[#A1A1AA]">JADWAL</div>
                <div className="font-mono-tabular font-bold text-white">
                  {currentDateObj.dayLabel}, {selectedDateNum} Okt ·{' '}
                  {selectedTime}
                </div>
              </div>
            )}

            {step >= 2 && (
              <div>
                <div className="text-[10px] text-[#A1A1AA]">
                  BIAYA KONSULTASI
                </div>
                <div className="font-mono-tabular font-bold text-[#E8612C]">
                  {formatRupiah(selectedDoctor.price)}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#A1A1AA]">
              <Phone className="h-3.5 w-3.5 text-[#E8612C]" />
              <span>Darurat? Hubungi 1500-911</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Content Area */}
        <div className="md:col-span-8 flex flex-col justify-between bg-[#FAF8F4] p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
          {/* STEP 1: PILIH POLIKLINIK */}
          {!isConfirmed && step === 1 && (
            <>
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.16em] text-[#E8612C]">
                      LANGKAH 1 DARI 5
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold text-[#18181B]">
                      Pilih poliklinik
                    </h3>
                    <p className="mt-1 text-xs text-[#65625D]">
                      Pilih spesialis sesuai keluhan Anda.
                    </p>
                  </div>
                  <DialogCloseButton onClick={() => onOpenChange(false)} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SPECIALTIES.map((spec) => {
                    const active = selectedSpecialtyId === spec.id;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => {
                          setSelectedSpecialtyId(spec.id);
                          const docs = filterDoctorsBySpecialty(
                            spec.id,
                            DOCTORS
                          );
                          if (docs.length > 0) setSelectedDoctor(docs[0]);
                        }}
                        className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                          active
                            ? 'border-2 border-[#E8612C] bg-[#FDF6F2]'
                            : 'border-[#E5DFD3] bg-white hover:border-[#CBC3B4]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#18181B]">
                              {spec.name}
                            </span>
                            {active && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8612C] text-white">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-[#65625D]">
                            {spec.description}
                          </p>
                        </div>
                        <div className="mt-3 text-[11px] font-medium text-[#8E8980]">
                          Lokasi: {spec.location}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-[#E5DFD3] pt-4">
                <Button onClick={() => setStep(2)}>
                  <span>Lanjut</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* STEP 2: PILIH DOKTER */}
          {!isConfirmed && step === 2 && (
            <>
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.16em] text-[#E8612C]">
                      LANGKAH 2 DARI 5
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold text-[#18181B]">
                      Pilih dokter
                    </h3>
                    <p className="mt-1 text-xs text-[#65625D]">
                      Bandingkan jadwal terdekat, pengalaman, dan biaya
                      konsultasi.
                    </p>
                  </div>
                  <DialogCloseButton onClick={() => onOpenChange(false)} />
                </div>

                {/* Specialty filter pills */}
                <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSpecialtyId('semua')}
                    className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedSpecialtyId === 'semua'
                        ? 'bg-[#18181B] text-white'
                        : 'border border-[#DED8CC] bg-white text-[#57534E]'
                    }`}
                  >
                    Semua
                  </button>
                  {SPECIALTIES.map((spec) => (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => {
                        setSelectedSpecialtyId(spec.id);
                        const docs = filterDoctorsBySpecialty(spec.id, DOCTORS);
                        if (docs.length > 0) setSelectedDoctor(docs[0]);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedSpecialtyId === spec.id
                          ? 'bg-[#18181B] text-white'
                          : 'border border-[#DED8CC] bg-white text-[#57534E]'
                      }`}
                    >
                      {spec.shortName}
                    </button>
                  ))}
                </div>

                {/* Doctor List */}
                <div className="mt-4 space-y-3">
                  {filterDoctorsBySpecialty(selectedSpecialtyId, DOCTORS).map(
                    (doc) => {
                      const active = selectedDoctor.id === doc.id;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setSelectedSpecialtyId(doc.specialtyId);
                          }}
                          className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                            active
                              ? 'border-2 border-[#E8612C] bg-[#FDF6F2]'
                              : 'border-[#E5DFD3] bg-white hover:border-[#CBC3B4]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-extrabold text-white shrink-0"
                              style={{ backgroundColor: doc.scrubColor }}
                            >
                              {doc.name
                                .replace('dr. ', '')
                                .split(' ')
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <div className="text-sm font-extrabold text-[#18181B]">
                                {doc.name}
                              </div>
                              <div className="text-xs text-[#65625D]">
                                {doc.specialtyLabel}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#78716C]">
                                <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                                <span className="font-bold text-[#18181B]">
                                  {doc.rating}
                                </span>
                                <span>·</span>
                                <span>{doc.experienceYears} thn</span>
                                <span>·</span>
                                <span>{doc.reviewCount} ulasan</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-mono-tabular text-sm font-extrabold text-[#18181B]">
                              {formatRupiah(doc.price)}
                            </div>
                            <div className="mt-1 text-[11px] font-semibold text-[#15803D]">
                              {doc.nextSchedule}
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E5DFD3] pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </Button>
                <Button onClick={() => setStep(3)}>
                  <span>Lanjut</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* STEP 3: PILIH JADWAL */}
          {!isConfirmed && step === 3 && (
            <>
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.16em] text-[#E8612C]">
                      LANGKAH 3 DARI 5
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold text-[#18181B]">
                      Pilih jadwal
                    </h3>
                    <p className="mt-1 text-xs text-[#65625D]">
                      Slot yang ditampilkan sudah nyata dan pasti tersedia.
                    </p>
                  </div>
                  <DialogCloseButton onClick={() => onOpenChange(false)} />
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#E5DFD3] bg-white px-4 py-3 text-xs">
                  <div>
                    <span className="text-[#65625D]">Jadwal praktik </span>
                    <strong className="text-[#18181B]">
                      {selectedDoctor.name}
                    </strong>
                  </div>
                  <span className="text-[#78716C]">
                    {currentSpecialty.location}
                  </span>
                </div>

                {/* Date Picker Grid */}
                <div className="mt-5">
                  <div className="mb-2.5 text-xs font-bold text-[#18181B]">
                    Pilih tanggal
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {SCHEDULE_DATES.map((d) => {
                      const active = selectedDateNum === d.dateNum;
                      return (
                        <button
                          key={d.dateNum}
                          type="button"
                          disabled={d.disabled}
                          onClick={() => setSelectedDateNum(d.dateNum)}
                          className={`flex flex-col items-center rounded-2xl border py-2.5 text-center transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                            active
                              ? 'border-[#18181B] bg-[#18181B] text-white'
                              : 'border-[#E5DFD3] bg-white text-[#18181B] hover:border-[#CBC3B4]'
                          }`}
                        >
                          <span className="text-[10px] font-semibold opacity-75">
                            {d.dayLabel}
                          </span>
                          <span className="font-mono-tabular text-base font-extrabold">
                            {d.dateNum}
                          </span>
                          <span className="text-[10px] opacity-75">Okt</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div className="mt-5">
                  <div className="mb-2.5 text-xs font-bold text-[#18181B]">
                    Pilih jam · {currentDateObj.fullLabel}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                    {selectedDoctor.timeSlots.map((slot) => {
                      const active = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`rounded-xl border py-2.5 font-mono-tabular text-xs font-bold transition-all cursor-pointer disabled:opacity-35 disabled:line-through disabled:cursor-not-allowed ${
                            active
                              ? 'border-[#E8612C] bg-[#E8612C] text-white shadow-sm'
                              : 'border-[#E5DFD3] bg-white text-[#18181B] hover:border-[#CBC3B4]'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E5DFD3] pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </Button>
                <Button onClick={() => setStep(4)}>
                  <span>Lanjut</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* STEP 4: DATA PASIEN */}
          {!isConfirmed && step === 4 && (
            <>
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.16em] text-[#E8612C]">
                      LANGKAH 4 DARI 5
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold text-[#18181B]">
                      Data pasien
                    </h3>
                    <p className="mt-1 text-xs text-[#65625D]">
                      Isi sesuai KTP agar pendaftaran di loket lebih cepat.
                    </p>
                  </div>
                  <DialogCloseButton onClick={() => onOpenChange(false)} />
                </div>

                {/* Demo Auto-fill Helper Banner */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#F3C8B2] bg-[#FDF6F2] px-4 py-2.5 text-xs">
                  <span className="text-[#57534E]">
                    Data digunakan untuk pendaftaran rekam medis RS Nadi.
                  </span>
                  <button
                    type="button"
                    onClick={handleFillSampleData}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E8612C]/40 bg-white px-3 py-1 text-xs font-bold text-[#E8612C] hover:bg-[#E8612C] hover:text-white transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Isi data contoh</span>
                  </button>
                </div>

                {/* Patient Form Fields */}
                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label
                      htmlFor="patient-fullname"
                      className="mb-1 block font-bold text-[#18181B]"
                    >
                      Nama lengkap
                    </label>
                    <Input
                      id="patient-fullname"
                      placeholder="Sesuai KTP"
                      value={patientForm.fullName}
                      onChange={(e) =>
                        setPatientForm((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-[11px] font-semibold text-red-600">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="patient-nik"
                        className="mb-1 block font-bold text-[#18181B]"
                      >
                        NIK (16 digit)
                      </label>
                      <Input
                        id="patient-nik"
                        placeholder="3174xxxxxxxxxxxx"
                        value={patientForm.nik}
                        onChange={(e) =>
                          setPatientForm((prev) => ({
                            ...prev,
                            nik: e.target.value,
                          }))
                        }
                      />
                      {formErrors.nik && (
                        <p className="mt-1 text-[11px] font-semibold text-red-600">
                          {formErrors.nik}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="patient-birthdate"
                        className="mb-1 block font-bold text-[#18181B]"
                      >
                        Tanggal lahir
                      </label>
                      <Input
                        id="patient-birthdate"
                        placeholder="dd/mm/yyyy"
                        value={patientForm.birthDate}
                        onChange={(e) =>
                          setPatientForm((prev) => ({
                            ...prev,
                            birthDate: e.target.value,
                          }))
                        }
                      />
                      {formErrors.birthDate && (
                        <p className="mt-1 text-[11px] font-semibold text-red-600">
                          {formErrors.birthDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="mb-1 block font-bold text-[#18181B]">
                      Jenis kelamin
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {(['Laki-laki', 'Perempuan'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() =>
                            setPatientForm((prev) => ({ ...prev, gender: g }))
                          }
                          className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                            patientForm.gender === g
                              ? 'border-2 border-[#E8612C] bg-[#FDF6F2] text-[#18181B]'
                              : 'border-[#DFD9CE] bg-white text-[#57534E]'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    {formErrors.gender && (
                      <p className="mt-1 text-[11px] font-semibold text-red-600">
                        {formErrors.gender}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="patient-phone"
                        className="mb-1 block font-bold text-[#18181B]"
                      >
                        No. ponsel (WhatsApp)
                      </label>
                      <Input
                        id="patient-phone"
                        placeholder="0812-3456-7890"
                        value={patientForm.phone}
                        onChange={(e) =>
                          setPatientForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-[11px] font-semibold text-red-600">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="patient-email"
                        className="mb-1 block font-bold text-[#18181B]"
                      >
                        Email (opsional)
                      </label>
                      <Input
                        id="patient-email"
                        type="email"
                        placeholder="nama@email.id"
                        value={patientForm.email}
                        onChange={(e) =>
                          setPatientForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <span className="mb-1 block font-bold text-[#18181B]">
                      Metode penjaminan
                    </span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {
                          id: 'umum' as const,
                          title: 'Umum / Pribadi',
                          sub: 'Bayar mandiri',
                        },
                        {
                          id: 'asuransi' as const,
                          title: 'Asuransi',
                          sub: 'Cashless rekanan',
                        },
                        {
                          id: 'bpjs' as const,
                          title: 'BPJS Kesehatan',
                          sub: 'Wajib rujukan FKTP',
                        },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() =>
                            setPatientForm((prev) => ({
                              ...prev,
                              paymentMethodType: m.id,
                            }))
                          }
                          className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                            patientForm.paymentMethodType === m.id
                              ? 'border-2 border-[#E8612C] bg-[#FDF6F2]'
                              : 'border-[#DFD9CE] bg-white'
                          }`}
                        >
                          <div className="font-bold text-[#18181B]">
                            {m.title}
                          </div>
                          <div className="text-[10px] text-[#78716C]">
                            {m.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="patient-complaint"
                      className="mb-1 block font-bold text-[#18181B]"
                    >
                      Keluhan utama (opsional)
                    </label>
                    <Input
                      id="patient-complaint"
                      placeholder="Ceritakan singkat keluhan yang dirasakan"
                      value={patientForm.complaint}
                      onChange={(e) =>
                        setPatientForm((prev) => ({
                          ...prev,
                          complaint: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E5DFD3] pt-4">
                <Button variant="ghost" onClick={() => setStep(3)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </Button>
                <Button onClick={handleNextFromStep4}>
                  <span>Lanjut</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* STEP 5: PEMBAYARAN */}
          {!isConfirmed && step === 5 && (
            <>
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.16em] text-[#E8612C]">
                      LANGKAH 5 DARI 5
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold text-[#18181B]">
                      Pembayaran
                    </h3>
                    <p className="mt-1 text-xs text-[#65625D]">
                      Selesaikan pembayaran untuk mengunci jadwal Anda.
                    </p>
                  </div>
                  <DialogCloseButton onClick={() => onOpenChange(false)} />
                </div>

                {/* Bill Breakdown */}
                <div className="mt-4 rounded-2xl border border-[#E5DFD3] bg-white p-4 text-xs space-y-2">
                  <div className="text-[10px] font-bold tracking-wider text-[#8E8980]">
                    RINGKASAN
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57534E]">
                      Konsultasi · {selectedDoctor.name}
                    </span>
                    <span className="font-mono-tabular font-semibold text-[#18181B]">
                      {formatRupiah(pricing.consultationFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57534E]">Biaya layanan</span>
                    <span className="font-mono-tabular font-semibold text-[#18181B]">
                      {formatRupiah(pricing.serviceFee)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#EFECE4] pt-2.5 text-sm font-extrabold text-[#18181B]">
                    <span>Total bayar</span>
                    <span className="font-mono-tabular">
                      {formatRupiah(pricing.total)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mt-4">
                  <div className="mb-2 text-xs font-bold text-[#18181B]">
                    Metode pembayaran
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {[
                      {
                        id: 'qris' as const,
                        title: 'QRIS',
                        sub: 'Semua e-wallet & m-banking',
                        icon: QrCode,
                      },
                      {
                        id: 'va' as const,
                        title: 'Virtual Account',
                        sub: 'BCA, Mandiri, BNI, BRI',
                        icon: Wallet,
                      },
                      {
                        id: 'ewallet' as const,
                        title: 'E-Wallet',
                        sub: 'GoPay, OVO, Dana, ShopeePay',
                        icon: Wallet,
                      },
                      {
                        id: 'card' as const,
                        title: 'Kartu Kredit / Debit',
                        sub: 'Visa, Mastercard, JCB',
                        icon: CreditCard,
                      },
                    ].map((pm) => {
                      const Icon = pm.icon;
                      const active = paymentChannel === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentChannel(pm.id)}
                          className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                            active
                              ? 'border-2 border-[#E8612C] bg-[#FDF6F2]'
                              : 'border-[#E5DFD3] bg-white'
                          }`}
                        >
                          <Icon className="h-4 w-4 text-[#E8612C] shrink-0" />
                          <div>
                            <div className="font-bold text-[#18181B]">
                              {pm.title}
                            </div>
                            <div className="text-[10px] text-[#78716C]">
                              {pm.sub}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* QRIS Code Box or Pay Button */}
                {!showQrCode ? (
                  <div className="mt-5">
                    <Button
                      variant="orange"
                      onClick={() => setShowQrCode(true)}
                      className="w-full h-11 text-sm"
                    >
                      Bayar {formatRupiah(pricing.total)}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#E5DFD3] bg-white p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Crisp SVG QR Code */}
                      <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-[#E5DFD3] bg-white p-2 shrink-0">
                        <svg
                          viewBox="0 0 100 100"
                          className="h-full w-full"
                          aria-label="Kode QRIS Nadi"
                        >
                          <rect
                            x="8"
                            y="8"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="#18181B"
                            strokeWidth="6"
                          />
                          <rect
                            x="16"
                            y="16"
                            width="10"
                            height="10"
                            fill="#18181B"
                          />
                          <rect
                            x="66"
                            y="8"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="#18181B"
                            strokeWidth="6"
                          />
                          <rect
                            x="74"
                            y="16"
                            width="10"
                            height="10"
                            fill="#18181B"
                          />
                          <rect
                            x="8"
                            y="66"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="#18181B"
                            strokeWidth="6"
                          />
                          <rect
                            x="16"
                            y="74"
                            width="10"
                            height="10"
                            fill="#18181B"
                          />
                          <rect
                            x="44"
                            y="14"
                            width="12"
                            height="12"
                            fill="#18181B"
                          />
                          <rect
                            x="44"
                            y="44"
                            width="14"
                            height="14"
                            fill="#E8612C"
                          />
                          <rect
                            x="64"
                            y="48"
                            width="22"
                            height="10"
                            fill="#18181B"
                          />
                          <rect
                            x="44"
                            y="68"
                            width="18"
                            height="20"
                            fill="#18181B"
                          />
                          <rect
                            x="72"
                            y="68"
                            width="18"
                            height="18"
                            fill="#18181B"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-[#18181B]">
                          Pindai dengan aplikasi pembayaran
                        </div>
                        <p className="text-[#65625D]">
                          Berlaku 14:58. Setelah membayar, status akan
                          diperbarui otomatis.
                        </p>
                        <div className="font-mono-tabular text-[11px] text-[#8E8980]">
                          Ref: NADI-2810
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirmPayment}
                      className="mt-4 w-full h-11"
                    >
                      Saya sudah membayar
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E5DFD3] pt-3">
                <Button variant="ghost" onClick={() => setStep(4)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </Button>
              </div>
            </>
          )}

          {/* CONFIRMED E-TICKET VIEW */}
          {isConfirmed && (
            <div className="my-auto space-y-5">
              <div className="flex justify-end">
                <DialogCloseButton onClick={() => onOpenChange(false)} />
              </div>

              <div className="text-center space-y-1.5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981]">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#18181B]">
                  Janji temu terkonfirmasi!
                </h3>
                <p className="text-xs text-[#65625D]">
                  E-tiket dikirim ke WhatsApp Anda. Tunjukkan kode QR di loket
                  atau langsung check-in di aplikasi.
                </p>
              </div>

              {/* Official Nadi E-Ticket Card */}
              <div className="overflow-hidden rounded-3xl border border-[#E5DFD3] bg-white shadow-sm">
                <div className="flex items-center justify-between bg-[#18181B] px-5 py-3 text-white">
                  <span className="text-base font-extrabold">
                    nadi<span className="text-[#E8612C]">.</span>
                  </span>
                  <span className="font-mono-tabular text-[10px] tracking-widest text-[#A1A1AA]">
                    E-TIKET
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold tracking-wider text-[#8E8980]">
                        NOMOR ANTREAN
                      </div>
                      <div className="font-mono-tabular text-4xl font-extrabold text-[#18181B]">
                        A-030
                      </div>
                      <div className="text-xs font-bold text-[#18181B]">
                        {selectedDoctor.name}
                      </div>
                      <div className="text-xs text-[#65625D]">
                        {currentSpecialty.name}
                      </div>

                      <div className="pt-2 space-y-1 text-xs text-[#57534E]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-[#E8612C]" />
                          <span>
                            {currentDateObj.fullLabel} · {selectedTime} WIB
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-[#E8612C]" />
                          <span>{currentSpecialty.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket QR */}
                    <div className="flex flex-col items-center rounded-2xl border border-[#E5DFD3] p-3">
                      <QrCode className="h-20 w-20 text-[#18181B]" />
                      <span className="mt-1 font-mono-tabular text-[10px] font-bold text-[#57534E]">
                        NADI-A27BC1
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#DFD9CE] pt-3 text-xs">
                    <span>
                      Pasien:{' '}
                      <strong className="text-[#18181B]">
                        {patientForm.fullName || 'Rina Maharani'}
                      </strong>
                    </span>
                    <span className="font-mono-tabular font-bold text-[#18181B]">
                      QRIS · {formatRupiah(pricing.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Action Buttons */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <Button
                  variant="outline"
                  onClick={() => setCalendarAdded(true)}
                  className="text-xs"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {calendarAdded ? 'Tersimpan di Kalender' : 'Tambah ke kalender'}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="text-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Cetak / simpan PDF</span>
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="text-xs"
                >
                  Selesai
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
