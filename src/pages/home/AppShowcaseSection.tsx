import * as React from 'react';
import {
  Bell,
  Calendar,
  Check,
  FileText,
  Home,
  PackageCheck,
  Smartphone,
  User,
} from 'lucide-react';

export interface AppShowcaseSectionProps {
  onOpenBooking: () => void;
}

export function AppShowcaseSection({ onOpenBooking }: AppShowcaseSectionProps) {
  const [activePhoneTab, setActivePhoneTab] = React.useState<
    'beranda' | 'janji' | 'lab' | 'profil'
  >('beranda');
  const [downloadPlatform, setDownloadPlatform] = React.useState<string | null>(
    null
  );

  return (
    <section id="aplikasi" className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Left Copy */}
        <div className="lg:col-span-4 space-y-4">
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#78716C]">
            APLIKASI NADI
          </p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] text-[#18181B]"
            style={{ textWrap: 'balance' }}
          >
            Antrean di Genggaman.
          </h2>
          <p className="text-sm leading-relaxed text-[#57534E]">
            Daftar online, pantau nomor antrean, lihat hasil lab, dan tebus
            resep — obat diantar sampai ke rumah.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDownloadPlatform('App Store (iOS)')}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#18181B] px-4 py-2.5 text-left text-white hover:bg-[#27272A] transition-colors cursor-pointer"
            >
              <Smartphone className="h-4 w-4 text-[#E8612C]" />
              <div>
                <div className="text-[9px] text-[#A1A1AA] leading-none">
                  Unduh di
                </div>
                <div className="text-xs font-bold leading-tight">App Store</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDownloadPlatform('Google Play (Android)')}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#18181B] px-4 py-2.5 text-left text-white hover:bg-[#27272A] transition-colors cursor-pointer"
            >
              <Smartphone className="h-4 w-4 text-[#10B981]" />
              <div>
                <div className="text-[9px] text-[#A1A1AA] leading-none">
                  Temukan di
                </div>
                <div className="text-xs font-bold leading-tight">
                  Google Play
                </div>
              </div>
            </button>
          </div>

          {downloadPlatform && (
            <div className="rounded-xl border border-[#E5DFD3] bg-white px-3.5 py-2.5 text-xs text-[#18181B]">
              Tautan unduh <strong>Nadi Mobile</strong> untuk{' '}
              <strong>{downloadPlatform}</strong> siap digunakan — atau coba
              simulasi langsung pada layar ponsel di samping.
            </div>
          )}
        </div>

        {/* Center Interactive Phone Mockup */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-[295px] rounded-[42px] border-[7px] border-[#18181B] bg-[#FAF8F4] p-4 shadow-[0_24px_60px_rgb(24,24,27,0.14)]">
            {/* Dynamic Island */}
            <div className="mx-auto mb-3 h-4 w-20 rounded-full bg-[#18181B]" />

            {/* Top Bar inside Phone */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] text-[#78716C]">
                  Selamat pagi, Rina
                </div>
                <div className="text-base font-extrabold text-[#18181B]">
                  nadi<span className="text-[#E8612C]">.</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Notifikasi aplikasi"
                onClick={() => setActivePhoneTab('lab')}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#18181B] cursor-pointer"
              >
                <Bell className="h-3.5 w-3.5 text-[#E8612C]" />
              </button>
            </div>

            {activePhoneTab === 'beranda' && (
              <>
                {/* Dark Queue Card */}
                <div className="rounded-2xl bg-[#18181B] p-3.5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[9px] tracking-wider text-[#A1A1AA]">
                        NOMOR ANTREAN ANDA
                      </div>
                      <div className="font-mono-tabular text-2xl font-extrabold">
                        A-012
                      </div>
                    </div>
                    <span className="rounded-full bg-[#10B981]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#34D399]">
                      Aktif
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-[#D4D4D8]">
                    dr. Raka Pradipta, Sp.JP
                    <br />
                    <span className="text-[#A1A1AA]">
                      Poli Jantung · Lt. 2
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px]">
                    <span className="text-[#A1A1AA]">Giliran Anda</span>
                    <span className="font-bold text-[#E8612C]">
                      2 antrean lagi
                    </span>
                  </div>
                </div>

                {/* Live Step Progress inside Phone */}
                <div className="mt-3.5 space-y-2.5 rounded-2xl border border-[#E5DFD3] bg-white p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                      <span className="text-[#57534E]">Check-in</span>
                    </div>
                    <span className="font-mono-tabular text-[10px] text-[#78716C]">
                      08:42
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                      <span className="text-[#57534E]">
                        Pemeriksaan perawat
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] text-[#78716C]">
                      08:50
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#E8612C]" />
                      <span className="font-bold text-[#18181B]">
                        Menunggu dokter
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] font-bold text-[#E8612C]">
                      ~09:10
                    </span>
                  </div>
                </div>
              </>
            )}

            {activePhoneTab === 'janji' && (
              <div className="rounded-2xl border border-[#E5DFD3] bg-white p-3.5 space-y-3 text-xs">
                <div className="font-bold text-[#18181B]">
                  Jadwal Kunjungan Anda
                </div>
                <div className="rounded-xl bg-[#FAF8F4] p-2.5">
                  <div className="font-bold text-[#18181B]">
                    dr. Raka Pradipta, Sp.JP
                  </div>
                  <div className="text-[11px] text-[#65625D]">
                    Rabu, 28 Okt · 10:00 WIB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="w-full rounded-xl bg-[#E8612C] py-2 text-xs font-bold text-white cursor-pointer"
                >
                  + Buat Janji Baru
                </button>
              </div>
            )}

            {activePhoneTab === 'lab' && (
              <div className="rounded-2xl border border-[#E5DFD3] bg-white p-3.5 space-y-2.5 text-xs">
                <div className="font-bold text-[#18181B]">
                  Hasil Lab Terbaru
                </div>
                <div className="flex justify-between border-b border-[#EFECE4] pb-1.5">
                  <span>Hemoglobin</span>
                  <span className="font-mono-tabular font-bold text-[#10B981]">
                    14,2 g/dL
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#EFECE4] pb-1.5">
                  <span>Kolesterol Total</span>
                  <span className="font-mono-tabular font-bold text-[#10B981]">
                    178 mg/dL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gula Darah Puasa</span>
                  <span className="font-mono-tabular font-bold text-[#10B981]">
                    92 mg/dL
                  </span>
                </div>
              </div>
            )}

            {activePhoneTab === 'profil' && (
              <div className="rounded-2xl border border-[#E5DFD3] bg-white p-3.5 space-y-2 text-xs">
                <div className="font-bold text-[#18181B]">Rina Maharani</div>
                <div className="font-mono-tabular text-[11px] text-[#65625D]">
                  No. RM: NADI-004921
                </div>
                <div className="text-[11px] text-[#10B981] font-semibold">
                  Penjamin: Umum & Asuransi Aktif
                </div>
              </div>
            )}

            {/* Bottom Phone Tab Bar */}
            <div className="mt-4 grid grid-cols-4 gap-1 border-t border-[#E5DFD3] pt-2.5 text-[10px]">
              <button
                type="button"
                onClick={() => setActivePhoneTab('beranda')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                  activePhoneTab === 'beranda'
                    ? 'font-bold text-[#E8612C]'
                    : 'text-[#78716C]'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Beranda</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePhoneTab('janji')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                  activePhoneTab === 'janji'
                    ? 'font-bold text-[#E8612C]'
                    : 'text-[#78716C]'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Janji</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePhoneTab('lab')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                  activePhoneTab === 'lab'
                    ? 'font-bold text-[#E8612C]'
                    : 'text-[#78716C]'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Hasil Lab</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePhoneTab('profil')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                  activePhoneTab === 'profil'
                    ? 'font-bold text-[#E8612C]'
                    : 'text-[#78716C]'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Profil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Medicine Doorstep Delivery Card */}
        <div className="lg:col-span-4 relative flex flex-col items-center lg:items-start">
          <div className="mb-4 hidden lg:block">
            <p className="font-handwriting text-2xl text-[#44403C] -rotate-6">
              Tanpa antre,
              <br />
              tanpa cemas
            </p>
          </div>

          <div className="w-full max-w-xs rounded-3xl border border-[#E5DFD3] bg-white p-4 shadow-[0_8px_30px_rgb(24,24,27,0.05)]">
            <div className="mb-3 h-40 w-full overflow-hidden rounded-2xl bg-[#F3ECE0]">
              {/* Doorstep Package Delivery SVG Illustration */}
              <svg
                viewBox="0 0 260 160"
                className="h-full w-full"
                aria-hidden="true"
              >
                <rect width="260" height="160" fill="#F2EAE0" />
                {/* Door frame */}
                <rect
                  x="70"
                  y="10"
                  width="120"
                  height="115"
                  fill="#D69E6B"
                />
                <rect
                  x="80"
                  y="18"
                  width="100"
                  height="107"
                  fill="#DFAC7C"
                />
                {/* Floor step */}
                <rect
                  x="40"
                  y="125"
                  width="180"
                  height="25"
                  rx="4"
                  fill="#E4DDD0"
                />
                {/* Nadi Medicine Delivery Bag on doorstep */}
                <rect
                  x="108"
                  y="84"
                  width="44"
                  height="44"
                  rx="6"
                  fill="#FAF6EE"
                  stroke="#DED8CC"
                  strokeWidth="2"
                />
                <path
                  d="M 120 84 C 120 74, 140 74, 140 84"
                  fill="none"
                  stroke="#E8612C"
                  strokeWidth="3"
                />
                <rect x="127" y="98" width="6" height="16" fill="#E8612C" />
                <rect x="122" y="103" width="16" height="6" fill="#E8612C" />
              </svg>
            </div>

            <div className="flex items-center gap-2 text-xs font-extrabold text-[#18181B]">
              <PackageCheck className="h-4 w-4 text-[#E8612C]" />
              <span>Obat sudah tiba!</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#65625D]">
              Resep #RX-2041 tiba di depan pintu rumah dalam 47 menit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
