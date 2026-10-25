import {
  ArrowRight,
  Calendar,
  Check,
  MapPin,
  QrCode,
  Tv,
  UserCheck,
} from 'lucide-react';
import { Dialog, DialogCloseButton } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { formatRupiah } from '@/src/lib/utils';

export interface ConfirmedAppointmentData {
  queueCode: string;
  doctorName: string;
  specialtyName: string;
  location: string;
  scheduleText: string;
  patientName: string;
  totalFee: number;
  paymentTypeLabel: string;
}

export interface AppointmentSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: ConfirmedAppointmentData | null;
  onSimulate3DCheckIn?: (queueCode: string) => void;
}

export function AppointmentSuccessModal({
  open,
  onOpenChange,
  appointment,
  onSimulate3DCheckIn,
}: AppointmentSuccessModalProps) {
  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      maxWidthClass="max-w-lg"
      ariaLabel="Konfirmasi Janji Temu Berhasil RS Nadi"
    >
      <div
        data-testid="appointment-success-modal"
        className="bg-[#FAF8F4] p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981] shrink-0">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.16em] text-[#10B981]">
                KONFIRMASI BERHASIL
              </div>
              <h3 className="text-xl font-extrabold text-[#18181B]">
                Janji Temu Terjadwal!
              </h3>
            </div>
          </div>
          <DialogCloseButton onClick={() => onOpenChange(false)} />
        </div>

        <p className="text-xs leading-relaxed text-[#57534E]">
          E-Tiket antrean telah diterbitkan untuk{' '}
          <strong className="text-[#18181B]">{appointment.patientName}</strong>.
          Anda juga dapat menyimulasikan pemanggilan nomor antrean ini langsung
          pada layar TV 3D di lobi Pendaftaran.
        </p>

        {/* Official Nadi E-Ticket Card */}
        <div className="overflow-hidden rounded-3xl border border-[#E5DFD3] bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#18181B] px-5 py-3 text-white">
            <span className="text-base font-extrabold">
              nadi<span className="text-[#E8612C]">.</span>
            </span>
            <span className="font-mono-tabular text-[10px] tracking-widest text-[#A1A1AA]">
              E-TIKET RESMI
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold tracking-wider text-[#8E8980]">
                  NOMOR ANTREAN
                </div>
                <div
                  data-testid="success-modal-queue-code"
                  className="font-mono-tabular text-4xl font-extrabold text-[#18181B]"
                >
                  {appointment.queueCode}
                </div>
                <div className="mt-1 text-sm font-extrabold text-[#18181B]">
                  {appointment.doctorName}
                </div>
                <div className="text-xs text-[#65625D]">
                  {appointment.specialtyName}
                </div>
              </div>

              <div className="flex flex-col items-center rounded-2xl border border-[#E5DFD3] bg-[#FAF8F4] p-3 shrink-0">
                <QrCode className="h-16 w-16 text-[#18181B]" />
                <span className="mt-1 font-mono-tabular text-[10px] font-bold text-[#57534E]">
                  NADI-{appointment.queueCode.replace('-', '')}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-dashed border-[#DFD9CE] pt-3 text-xs text-[#57534E]">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#E8612C]" />
                <span className="font-semibold text-[#18181B]">
                  {appointment.scheduleText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#E8612C]" />
                <span>{appointment.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5 text-[#10B981]" />
                <span>
                  Penjaminan: <strong>{appointment.paymentTypeLabel}</strong> ·{' '}
                  <strong className="font-mono-tabular text-[#18181B]">
                    {formatRupiah(appointment.totalFee)}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {onSimulate3DCheckIn && (
            <Button
              variant="orange"
              data-testid="success-modal-3d-tv-btn"
              onClick={() => {
                onSimulate3DCheckIn(appointment.queueCode);
                onOpenChange(false);
              }}
              className="flex-1 text-xs"
            >
              <Tv className="h-3.5 w-3.5" />
              <span>Tampilkan {appointment.queueCode} di TV 3D</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="default"
            onClick={() => onOpenChange(false)}
            className="sm:w-28 text-xs"
          >
            Selesai
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
