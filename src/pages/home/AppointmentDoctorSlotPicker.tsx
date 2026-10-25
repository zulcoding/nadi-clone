import { Calendar, Check, Clock, MapPin, Star } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { formatRupiah } from '@/src/lib/utils';
import {
  DOCTORS,
  SCHEDULE_DATES,
  SPECIALTIES,
  type DoctorItem,
} from './data';
import { filterDoctorsBySpecialty } from './booking-logic';

export interface AppointmentDoctorSlotPickerProps {
  selectedSpecialtyId: string;
  onSelectSpecialty: (specialtyId: string) => void;
  selectedDoctor: DoctorItem;
  onSelectDoctor: (doctor: DoctorItem) => void;
  selectedDateNum: string;
  onSelectDateNum: (dateNum: string) => void;
  selectedTimeSlot: string;
  onSelectTimeSlot: (timeSlot: string) => void;
  doctorError?: string;
  slotError?: string;
}

export function AppointmentDoctorSlotPicker({
  selectedSpecialtyId,
  onSelectSpecialty,
  selectedDoctor,
  onSelectDoctor,
  selectedDateNum,
  onSelectDateNum,
  selectedTimeSlot,
  onSelectTimeSlot,
  doctorError,
  slotError,
}: AppointmentDoctorSlotPickerProps) {
  const filteredDoctors = filterDoctorsBySpecialty(
    selectedSpecialtyId,
    DOCTORS
  );
  const currentSpecialty =
    SPECIALTIES.find((s) => s.id === selectedDoctor.specialtyId) ||
    SPECIALTIES[0];
  const currentDateObj =
    SCHEDULE_DATES.find((d) => d.dateNum === selectedDateNum) ||
    SCHEDULE_DATES[4];

  return (
    <Card className="p-6 sm:p-7 space-y-6">
      {/* Section 1: Specialty Filter & Doctor Selection */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#E8612C]">
              LANGKAH 1 · DOKTER SPESIALIS
            </span>
            <h3 className="mt-1 text-xl font-extrabold text-[#18181B]">
              Pilih Dokter Pemeriksa
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#65625D]">
            <MapPin className="h-3.5 w-3.5 text-[#E8612C]" />
            <span>{currentSpecialty.location}</span>
          </span>
        </div>

        {/* Specialty Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter spesialis untuk jadwal cepat"
          className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedSpecialtyId === 'semua'}
            onClick={() => onSelectSpecialty('semua')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedSpecialtyId === 'semua'
                ? 'bg-[#18181B] text-white'
                : 'border border-[#DED8CC] bg-[#FAF8F4] text-[#57534E] hover:text-[#18181B]'
            }`}
          >
            Semua
          </button>
          {SPECIALTIES.map((spec) => {
            const active = selectedSpecialtyId === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectSpecialty(spec.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#18181B] text-white'
                    : 'border border-[#DED8CC] bg-[#FAF8F4] text-[#57534E] hover:text-[#18181B]'
                }`}
              >
                {spec.shortName}
              </button>
            );
          })}
        </div>

        {/* Selectable Doctor Cards */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredDoctors.map((doc) => {
            const isSelected = selectedDoctor.id === doc.id;
            const initials = doc.name
              .replace('dr. ', '')
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('');

            return (
              <button
                key={doc.id}
                type="button"
                data-testid={`booking-doctor-option-${doc.id}`}
                onClick={() => onSelectDoctor(doc)}
                className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#E8612C] bg-[#FDF6F2] shadow-sm'
                    : 'border-[#E5DFD3] bg-[#FAF8F4]/70 hover:border-[#CBC3B4] hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-extrabold text-white shrink-0"
                    style={{ backgroundColor: doc.scrubColor }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-[#18181B] truncate">
                      {doc.name}
                    </div>
                    <div className="text-xs text-[#65625D] truncate">
                      {doc.specialtyLabel}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#78716C]">
                      <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="font-bold text-[#18181B]">
                        {doc.rating}
                      </span>
                      <span>·</span>
                      <span>{doc.experienceYears} thn</span>
                      <span>·</span>
                      <span className="font-mono-tabular font-bold text-[#18181B]">
                        {formatRupiah(doc.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8612C] text-white shrink-0">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {doctorError && (
          <p className="mt-2 text-xs font-semibold text-red-600">
            {doctorError}
          </p>
        )}
      </div>

      {/* Section 2: Date & Time Slot Picker */}
      <div className="border-t border-[#EFECE4] pt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#E8612C]">
              LANGKAH 2 · TANGGAL & JAM PRAKTIK
            </span>
            <h3 className="mt-1 text-lg font-extrabold text-[#18181B]">
              Pilih Slot Waktu Kunjungan
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
            <Calendar className="h-3.5 w-3.5" />
            <span>{currentDateObj.fullLabel}</span>
          </span>
        </div>

        {/* Date Strip */}
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {SCHEDULE_DATES.map((d) => {
            const active = selectedDateNum === d.dateNum;
            return (
              <button
                key={d.dateNum}
                type="button"
                disabled={d.disabled}
                onClick={() => onSelectDateNum(d.dateNum)}
                className={`flex flex-col items-center rounded-2xl border py-2 text-center transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                  active
                    ? 'border-[#18181B] bg-[#18181B] text-white shadow-sm'
                    : 'border-[#E5DFD3] bg-[#FAF8F4] text-[#18181B] hover:border-[#CBC3B4]'
                }`}
              >
                <span className="text-[10px] font-semibold opacity-75">
                  {d.dayLabel}
                </span>
                <span className="font-mono-tabular text-sm font-extrabold">
                  {d.dateNum}
                </span>
                <span className="text-[10px] opacity-75">Okt</span>
              </button>
            );
          })}
        </div>

        {/* Time Slots Grid */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-[#18181B]">
              <Clock className="h-3.5 w-3.5 text-[#E8612C]" />
              <span>Jam Praktik Tersedia ({selectedDoctor.name})</span>
            </span>
            {selectedTimeSlot && (
              <span className="font-mono-tabular font-bold text-[#E8612C]">
                Terpilih: {selectedTimeSlot} WIB
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {selectedDoctor.timeSlots.map((slot) => {
              const active = selectedTimeSlot === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  data-testid={`booking-slot-${slot.time}`}
                  onClick={() => onSelectTimeSlot(slot.time)}
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

          {slotError && (
            <p
              data-testid="booking-slot-error"
              className="mt-2 text-xs font-semibold text-red-600"
            >
              {slotError}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
