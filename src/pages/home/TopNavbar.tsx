import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export interface TopNavbarProps {
  onOpenBooking: (specialtyId?: string) => void;
  onOpenLogin: () => void;
  loggedInUser: string | null;
}

export function TopNavbar({
  onOpenBooking,
  onOpenLogin,
  loggedInUser,
}: TopNavbarProps) {
  return (
    <header className="fixed top-3 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 rounded-full border border-[#E5DFD3] bg-[#FAF8F4]/95 px-5 py-2.5 shadow-[0_6px_24px_rgb(24,24,27,0.06)] pointer-events-auto">
        {/* Zone 1: Brand wordmark (1 line, single text element) */}
        <a
          href="#top"
          className="text-xl font-extrabold tracking-tight text-[#18181B] whitespace-nowrap shrink-0"
        >
          nadi<span className="text-[#E8612C]">.</span>
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-7 text-xs font-medium text-[#52504C]"
        >
          <a
            href="#ambulans"
            className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Ambulans
          </a>
          <a
            href="#layanan"
            className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Layanan
          </a>
          <a
            href="#dokter"
            className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Dokter
          </a>
          <a
            href="#aplikasi"
            className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Aplikasi
          </a>
          <a
            href="#paket-mcu"
            className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Paket MCU
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-3 py-1.5 text-xs font-semibold text-[#52504C] hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loggedInUser ? `Halo, ${loggedInUser.split(' ')[0]}` : 'Masuk'}
          </button>
          <Button
            size="sm"
            onClick={() => onOpenBooking()}
            className="h-9 px-4 text-xs font-semibold"
          >
            <span>Buat Janji</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
