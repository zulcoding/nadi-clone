import * as React from 'react';
import { Dialog, DialogCloseButton } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

export interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (name: string) => void;
}

export function LoginModal({
  open,
  onOpenChange,
  onLoginSuccess,
}: LoginModalProps) {
  const [phoneOrRm, setPhoneOrRm] = React.useState('0812-3456-7890');
  const [patientName, setPatientName] = React.useState('Rina Maharani');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phoneOrRm.trim()) {
      setError('Mohon isi nama dan nomor WhatsApp / Rekam Medis.');
      return;
    }
    setError('');
    onLoginSuccess(patientName.trim());
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      maxWidthClass="max-w-md"
      ariaLabel="Masuk ke Portal Pasien RS Nadi"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[0.16em] text-[#E8612C]">
              PORTAL PASIEN NADI
            </div>
            <h2 className="mt-1 text-xl font-extrabold text-[#18181B]">
              Masuk Akun Pasien
            </h2>
            <p className="mt-1 text-xs text-[#65625D]">
              Pantau nomor antrean, hasil lab, dan riwayat resep digital Anda.
            </p>
          </div>
          <DialogCloseButton onClick={() => onOpenChange(false)} />
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label
              htmlFor="login-name"
              className="mb-1 block font-bold text-[#18181B]"
            >
              Nama Pasien
            </label>
            <Input
              id="login-name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="login-phone"
              className="mb-1 block font-bold text-[#18181B]"
            >
              No. WhatsApp / No. Rekam Medis
            </label>
            <Input
              id="login-phone"
              value={phoneOrRm}
              onChange={(e) => setPhoneOrRm(e.target.value)}
            />
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        </div>

        <Button type="submit" variant="orange" className="w-full h-11">
          Masuk Sekarang
        </Button>
      </form>
    </Dialog>
  );
}
