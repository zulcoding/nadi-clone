import * as React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { formatRupiah } from '@/src/lib/utils';
import { type DoctorItem } from './data';
import {
  calculateAppointmentTotal,
  type PatientFormData,
} from './booking-logic';

export interface AppointmentPatientFormProps {
  patientForm: PatientFormData;
  onChangePatientForm: React.Dispatch<React.SetStateAction<PatientFormData>>;
  patientErrors: Partial<Record<keyof PatientFormData, string>>;
  selectedDoctor: DoctorItem;
  selectedDateLabel: string;
  selectedTimeSlot: string;
  onFillSampleData: () => void;
  onSubmitBooking: (e: React.FormEvent) => void;
}

export function AppointmentPatientForm({
  patientForm,
  onChangePatientForm,
  patientErrors,
  selectedDoctor,
  selectedDateLabel,
  selectedTimeSlot,
  onFillSampleData,
  onSubmitBooking,
}: AppointmentPatientFormProps) {
  const pricing = calculateAppointmentTotal(
    selectedDoctor.price,
    patientForm.paymentMethodType
  );

  return (
    <Card className="p-6 sm:p-7 flex flex-col justify-between">
      <form onSubmit={onSubmitBooking} noValidate className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#E8612C]">
              LANGKAH 3 · DATA PASIEN & KONFIRMASI
            </span>
            <h3 className="mt-1 text-xl font-extrabold text-[#18181B]">
              Identitas Pasien
            </h3>
          </div>
          <button
            type="button"
            data-testid="inline-booking-fill-sample"
            onClick={onFillSampleData}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8612C]/40 bg-[#FDF6F2] px-3 py-1 text-xs font-bold text-[#E8612C] hover:bg-[#E8612C] hover:text-white transition-colors cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            <span>Isi Data Contoh</span>
          </button>
        </div>

        {/* Full Name */}
        <div className="text-xs">
          <label
            htmlFor="inline-patient-fullname"
            className="mb-1 block font-bold text-[#18181B]"
          >
            Nama lengkap (sesuai KTP)
          </label>
          <Input
            id="inline-patient-fullname"
            placeholder="Contoh: Rina Maharani"
            value={patientForm.fullName}
            onChange={(e) =>
              onChangePatientForm((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
          />
          {patientErrors.fullName && (
            <p
              data-testid="inline-error-fullname"
              className="mt-1 text-[11px] font-semibold text-red-600"
            >
              {patientErrors.fullName}
            </p>
          )}
        </div>

        {/* NIK & Birth Date */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div>
            <label
              htmlFor="inline-patient-nik"
              className="mb-1 block font-bold text-[#18181B]"
            >
              NIK (16 digit)
            </label>
            <Input
              id="inline-patient-nik"
              placeholder="3174xxxxxxxxxxxx"
              value={patientForm.nik}
              onChange={(e) =>
                onChangePatientForm((prev) => ({
                  ...prev,
                  nik: e.target.value,
                }))
              }
            />
            {patientErrors.nik && (
              <p
                data-testid="inline-error-nik"
                className="mt-1 text-[11px] font-semibold text-red-600"
              >
                {patientErrors.nik}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="inline-patient-birthdate"
              className="mb-1 block font-bold text-[#18181B]"
            >
              Tanggal lahir
            </label>
            <Input
              id="inline-patient-birthdate"
              placeholder="dd/mm/yyyy"
              value={patientForm.birthDate}
              onChange={(e) =>
                onChangePatientForm((prev) => ({
                  ...prev,
                  birthDate: e.target.value,
                }))
              }
            />
            {patientErrors.birthDate && (
              <p
                data-testid="inline-error-birthdate"
                className="mt-1 text-[11px] font-semibold text-red-600"
              >
                {patientErrors.birthDate}
              </p>
            )}
          </div>
        </div>

        {/* Gender & Phone */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div>
            <span className="mb-1 block font-bold text-[#18181B]">
              Jenis kelamin
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Laki-laki', 'Perempuan'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    onChangePatientForm((prev) => ({ ...prev, gender: g }))
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
            {patientErrors.gender && (
              <p
                data-testid="inline-error-gender"
                className="mt-1 text-[11px] font-semibold text-red-600"
              >
                {patientErrors.gender}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="inline-patient-phone"
              className="mb-1 block font-bold text-[#18181B]"
            >
              Nomor WhatsApp
            </label>
            <Input
              id="inline-patient-phone"
              placeholder="0812-3456-7890"
              value={patientForm.phone}
              onChange={(e) =>
                onChangePatientForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
            {patientErrors.phone && (
              <p
                data-testid="inline-error-phone"
                className="mt-1 text-[11px] font-semibold text-red-600"
              >
                {patientErrors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method Type */}
        <div className="text-xs">
          <span className="mb-1 block font-bold text-[#18181B]">
            Metode penjaminan
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'umum' as const, label: 'Umum' },
              { id: 'asuransi' as const, label: 'Asuransi' },
              { id: 'bpjs' as const, label: 'BPJS' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onChangePatientForm((prev) => ({
                    ...prev,
                    paymentMethodType: item.id,
                  }))
                }
                className={`rounded-xl border py-2 text-xs font-bold transition-all cursor-pointer ${
                  patientForm.paymentMethodType === item.id
                    ? 'border-2 border-[#E8612C] bg-[#FDF6F2] text-[#18181B]'
                    : 'border-[#DFD9CE] bg-white text-[#57534E]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Complaint */}
        <div className="text-xs">
          <label
            htmlFor="inline-patient-complaint"
            className="mb-1 block font-bold text-[#18181B]"
          >
            Keluhan utama (opsional)
          </label>
          <Input
            id="inline-patient-complaint"
            placeholder="Ceritakan singkat keluhan yang dirasakan"
            value={patientForm.complaint}
            onChange={(e) =>
              onChangePatientForm((prev) => ({
                ...prev,
                complaint: e.target.value,
              }))
            }
          />
        </div>

        {/* Live Summary Box */}
        <div className="rounded-2xl border border-[#E5DFD3] bg-[#FAF8F4] p-4 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#65625D]">Dokter & Jadwal</span>
            <span className="font-bold text-[#18181B]">
              {selectedDoctor.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#65625D]">Waktu Kunjungan</span>
            <span className="font-mono-tabular font-semibold text-[#18181B]">
              {selectedDateLabel} · {selectedTimeSlot || 'Pilih jam'} WIB
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-[#E5DFD3] pt-2 text-sm font-extrabold text-[#18181B]">
            <span>Estimasi Total Biaya</span>
            <span className="font-mono-tabular text-[#E8612C]">
              {formatRupiah(pricing.total)}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="orange"
          data-testid="inline-booking-submit"
          className="w-full h-11 text-sm"
        >
          <span>Konfirmasi Janji Temu</span>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#78716C]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
          <span>Data pasien terenkripsi & langsung mendapat E-Tiket antrean</span>
        </div>
      </form>
    </Card>
  );
}
