import * as React from 'react';
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
  validateAppointmentBooking,
  type PatientFormData,
} from './booking-logic';
import { AppointmentDoctorSlotPicker } from './AppointmentDoctorSlotPicker';
import { AppointmentPatientForm } from './AppointmentPatientForm';
import {
  AppointmentSuccessModal,
  type ConfirmedAppointmentData,
} from './AppointmentSuccessModal';

export interface AppointmentBookingProps {
  preselectedDoctor?: DoctorItem | null;
  onBookingConfirmed?: (ticket: {
    queueCode: string;
    doctorName: string;
    scheduleText: string;
    patientName: string;
  }) => void;
  onSimulate3DCheckIn?: (queueCode: string) => void;
}

export function AppointmentBooking({
  preselectedDoctor,
  onBookingConfirmed,
  onSimulate3DCheckIn,
}: AppointmentBookingProps) {
  const [selectedSpecialtyId, setSelectedSpecialtyId] =
    React.useState<string>('semua');
  const [selectedDoctor, setSelectedDoctor] = React.useState<DoctorItem>(
    preselectedDoctor || DOCTORS[0]
  );
  const [selectedDateNum, setSelectedDateNum] = React.useState<string>('28');
  const [selectedTimeSlot, setSelectedTimeSlot] =
    React.useState<string>('10:00');

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

  const [doctorError, setDoctorError] = React.useState<string | undefined>(
    undefined
  );
  const [slotError, setSlotError] = React.useState<string | undefined>(
    undefined
  );
  const [patientErrors, setPatientErrors] = React.useState<
    Partial<Record<keyof PatientFormData, string>>
  >({});

  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [confirmedData, setConfirmedData] =
    React.useState<ConfirmedAppointmentData | null>(null);

  // Sync if user selects a doctor from DoctorsSection
  React.useEffect(() => {
    if (!preselectedDoctor) return;
    setSelectedDoctor(preselectedDoctor);
    setSelectedSpecialtyId(preselectedDoctor.specialtyId);
    const firstAvailable = preselectedDoctor.timeSlots.find((s) => s.available);
    setSelectedTimeSlot(firstAvailable ? firstAvailable.time : '');
    setDoctorError(undefined);
    setSlotError(undefined);
  }, [preselectedDoctor]);

  const handleSelectSpecialty = (specId: string) => {
    setSelectedSpecialtyId(specId);
    const matching = filterDoctorsBySpecialty(specId, DOCTORS);
    if (matching.length > 0) {
      handleSelectDoctor(matching[0]);
    }
  };

  const handleSelectDoctor = (doc: DoctorItem) => {
    setSelectedDoctor(doc);
    setDoctorError(undefined);
    // Keep existing time slot if valid for new doctor, otherwise pick first available
    const stillAvailable = doc.timeSlots.find(
      (s) => s.time === selectedTimeSlot && s.available
    );
    if (!stillAvailable) {
      const firstAvail = doc.timeSlots.find((s) => s.available);
      setSelectedTimeSlot(firstAvail ? firstAvail.time : '');
    }
    setSlotError(undefined);
  };

  const handleSelectTimeSlot = (slot: string) => {
    setSelectedTimeSlot(slot);
    setSlotError(undefined);
  };

  const handleFillSampleData = () => {
    setPatientForm({ ...SAMPLE_PATIENT_DATA });
    setPatientErrors({});
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAppointmentBooking({
      doctorId: selectedDoctor.id,
      dateNum: selectedDateNum,
      timeSlot: selectedTimeSlot,
      patient: patientForm,
    });

    if (!validation.valid) {
      setDoctorError(validation.doctorError);
      setSlotError(validation.slotError);
      setPatientErrors(validation.patientErrors);
      return;
    }

    setDoctorError(undefined);
    setSlotError(undefined);
    setPatientErrors({});

    const currentSpecialty =
      SPECIALTIES.find((s) => s.id === selectedDoctor.specialtyId) ||
      SPECIALTIES[0];
    const currentDateObj =
      SCHEDULE_DATES.find((d) => d.dateNum === selectedDateNum) ||
      SCHEDULE_DATES[4];
    const pricing = calculateAppointmentTotal(
      selectedDoctor.price,
      patientForm.paymentMethodType
    );

    const paymentLabels: Record<PatientFormData['paymentMethodType'], string> = {
      umum: 'Umum / Pribadi',
      asuransi: 'Asuransi Rekanan',
      bpjs: 'BPJS Kesehatan',
    };

    const queueCode = 'A-030';
    const scheduleText = `${currentDateObj.fullLabel} · ${selectedTimeSlot} WIB`;

    const summary: ConfirmedAppointmentData = {
      queueCode,
      doctorName: selectedDoctor.name,
      specialtyName: currentSpecialty.name,
      location: currentSpecialty.location,
      scheduleText,
      patientName: patientForm.fullName.trim(),
      totalFee: pricing.total,
      paymentTypeLabel: paymentLabels[patientForm.paymentMethodType],
    };

    setConfirmedData(summary);
    setSuccessModalOpen(true);

    onBookingConfirmed?.({
      queueCode,
      doctorName: selectedDoctor.name,
      scheduleText,
      patientName: summary.patientName,
    });
  };

  const currentDateObj =
    SCHEDULE_DATES.find((d) => d.dateNum === selectedDateNum) ||
    SCHEDULE_DATES[4];

  return (
    <section
      id="jadwal-cepat"
      data-testid="appointment-booking-section"
      className="py-20 px-4 sm:px-10 lg:px-16 border-t border-[#E6E0D4]"
    >
      <div className="mx-auto max-w-6xl">
        {/* Editorial Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#E8612C]">
              RESERVASI JADWAL LANGSUNG
            </p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18181B] leading-[1.08]">
              Pilih dokter & jam praktik,
              <br />
              langsung dapat nomor antrean.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[#57534E]">
            Pilih dokter spesialis, tentukan slot waktu yang tersedia, dan
            lengkapi identitas pasien untuk menerbitkan E-Tiket instan yang
            tersinkronisasi dengan layar 3D RS Nadi.
          </p>
        </div>

        {/* 12-Column Asymmetric Booking Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AppointmentDoctorSlotPicker
              selectedSpecialtyId={selectedSpecialtyId}
              onSelectSpecialty={handleSelectSpecialty}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={handleSelectDoctor}
              selectedDateNum={selectedDateNum}
              onSelectDateNum={setSelectedDateNum}
              selectedTimeSlot={selectedTimeSlot}
              onSelectTimeSlot={handleSelectTimeSlot}
              doctorError={doctorError}
              slotError={slotError}
            />
          </div>

          <div className="lg:col-span-5">
            <AppointmentPatientForm
              patientForm={patientForm}
              onChangePatientForm={setPatientForm}
              patientErrors={patientErrors}
              selectedDoctor={selectedDoctor}
              selectedDateLabel={currentDateObj.fullLabel}
              selectedTimeSlot={selectedTimeSlot}
              onFillSampleData={handleFillSampleData}
              onSubmitBooking={handleSubmitBooking}
            />
          </div>
        </div>
      </div>

      {/* Confirmed Appointment Success Modal */}
      <AppointmentSuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        appointment={confirmedData}
        onSimulate3DCheckIn={onSimulate3DCheckIn}
      />
    </section>
  );
}
