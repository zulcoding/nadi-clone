import * as React from 'react';
import { ArrowRight, Phone, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { INSURANCE_PARTNERS, TESTIMONIALS } from './data';

export interface TestimonialsSectionProps {
  onOpenBooking: () => void;
}

export function TestimonialsSection({
  onOpenBooking,
}: TestimonialsSectionProps) {
  const [showAllPartners, setShowAllPartners] = React.useState(false);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-8">
      {/* Testimonials & Quantitative Proof Row */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Left Header */}
        <div className="flex flex-col justify-between lg:col-span-3 space-y-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#78716C]">
              DIPERCAYA RIBUAN KELUARGA
            </p>
            <h2
              className="mt-2 text-3xl font-extrabold tracking-tight leading-[1.12] text-[#18181B]"
              style={{ textWrap: 'balance' }}
            >
              Pasien Bahagia.
              <br />
              Keluarga Tenang.
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#65625D]">
            <ShieldCheck className="h-4 w-4 text-[#E8612C] shrink-0" />
            <span>Bekerja sama dengan 40+ asuransi</span>
          </div>
        </div>

        {/* 3 Attributable Testimonial Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border border-[#E5DFD3] bg-white p-5 shadow-[0_6px_24px_rgb(24,24,27,0.04)]"
            >
              <p className="text-xs leading-relaxed text-[#44403C]">
                “{item.quote}”
              </p>

              <div className="mt-5">
                <div className="mb-2.5 flex items-center gap-0.5 text-[#E8612C]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-3 w-3 fill-[#E8612C] text-[#E8612C]"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: item.avatarBg }}
                  >
                    {item.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#18181B]">
                      {item.author}
                    </div>
                    <div className="text-[11px] text-[#78716C]">
                      {item.relation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quantitative Summary Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#E5DFD3] bg-white p-5 lg:col-span-3">
          <div className="border-b border-[#F0ECE1] pb-3">
            <div className="font-mono-tabular text-2xl font-extrabold text-[#18181B]">
              250rb<span className="text-[#E8612C]">+</span>
            </div>
            <div className="text-xs text-[#65625D]">
              Pasien dilayani per tahun
            </div>
          </div>

          <div className="border-b border-[#F0ECE1] py-3">
            <div className="font-mono-tabular text-2xl font-extrabold text-[#18181B]">
              98<span className="text-[#10B981]">%</span>
            </div>
            <div className="text-xs text-[#65625D]">
              Tingkat kepuasan pasien
            </div>
          </div>

          <div className="pt-3">
            <div className="font-mono-tabular text-2xl font-extrabold text-[#18181B]">
              4,9<span className="text-base font-normal text-[#78716C]">/5</span>
            </div>
            <div className="text-xs text-[#65625D]">Rating aplikasi Nadi</div>
          </div>
        </div>
      </div>

      {/* Insurance Partners Strip */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-[#E5DFD3] py-5 text-sm font-bold text-[#78716C]">
        <div className="flex flex-wrap items-center gap-8">
          {INSURANCE_PARTNERS.map((partner) => (
            <span
              key={partner}
              className="hover:text-[#18181B] transition-colors"
            >
              {partner}
            </span>
          ))}
          {showAllPartners && (
            <>
              <span>BPJS Kesehatan</span>
              <span>Prudential</span>
              <span>Allianz</span>
              <span>Manulife</span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAllPartners((prev) => !prev)}
          className="text-xs font-semibold text-[#57534E] hover:text-[#18181B] cursor-pointer"
        >
          {showAllPartners ? 'Sembunyikan' : '+ lainnya'}
        </button>
      </div>

      {/* Dark 3D Road CTA Banner ("Mulai Langkah Sehat Hari Ini.") */}
      <div className="relative mt-16 overflow-hidden rounded-[32px] bg-[#18181B] p-8 sm:p-12 text-white">
        <div className="relative z-10 max-w-md space-y-4">
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#A1A1AA]">
            SIAP HIDUP LEBIH SEHAT
          </p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]"
            style={{ textWrap: 'balance' }}
          >
            Mulai Langkah Sehat Hari Ini.
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D8]">
            Bergabung dengan 250.000+ pasien yang mempercayakan kesehatannya
            kepada Nadi.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="orange" onClick={onOpenBooking}>
              <span>Buat Janji</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <a
              href="#ambulans"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="h-3.5 w-3.5 text-[#E8612C]" />
              <span className="font-mono-tabular">IGD 24 Jam · 1500-911</span>
            </a>
          </div>
        </div>

        {/* Decorative 3D Curved Road & Hospital Miniature SVG on Right */}
        <svg
          viewBox="0 0 520 260"
          className="pointer-events-none absolute right-0 bottom-0 h-full w-auto opacity-95 hidden md:block"
          aria-hidden="true"
        >
          <path
            d="M 40 260 C 120 150, 260 120, 520 210"
            fill="none"
            stroke="#2D2A26"
            strokeWidth="56"
          />
          <path
            d="M 40 260 C 120 150, 260 120, 520 210"
            fill="none"
            stroke="#E8612C"
            strokeWidth="4"
            strokeDasharray="10 10"
          />
          {/* Mini Hospital Building on hill */}
          <rect
            x="385"
            y="24"
            width="95"
            height="110"
            rx="10"
            fill="#E8612C"
          />
          <rect
            x="340"
            y="48"
            width="72"
            height="86"
            rx="8"
            fill="#FAF6EE"
          />
          {/* Mini ambulance on road */}
          <g transform="translate(265, 136) rotate(8)">
            <rect x="0" y="0" width="38" height="20" rx="4" fill="#FAF6EE" />
            <rect x="0" y="10" width="38" height="5" fill="#E8612C" />
          </g>
        </svg>

        <div className="hidden lg:block absolute right-10 top-8 z-10 pointer-events-none">
          <p className="font-handwriting text-2xl text-white/85 -rotate-6">
            Lebih dari sekadar
            <br />
            rumah sakit
          </p>
        </div>
      </div>

      {/* Quiet Editorial Footer */}
      <footer className="mt-16 border-t border-[#E5DFD3] pt-10 pb-6 text-xs text-[#65625D]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xl font-extrabold tracking-tight text-[#18181B]">
              nadi<span className="text-[#E8612C]">.</span>
            </div>
            <p>Perawatan untuk setiap detik.</p>
            <p className="text-[11px] text-[#78716C]">
              Jl. Kesehatan Raya No. 12, Jakarta Selatan · 1500-911
            </p>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <div className="font-bold text-[#18181B]">Rumah Sakit</div>
            <ul className="space-y-1.5">
              <li>
                <a href="#top" className="hover:text-[#18181B]">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#dokter" className="hover:text-[#18181B]">
                  Tim Dokter
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-[#18181B]">
                  Fasilitas 3D
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <div className="font-bold text-[#18181B]">Layanan</div>
            <ul className="space-y-1.5">
              <li>
                <a href="#ambulans" className="hover:text-[#18181B]">
                  IGD 24 Jam
                </a>
              </li>
              <li>
                <a href="#dokter" className="hover:text-[#18181B]">
                  Poliklinik Spesialis
                </a>
              </li>
              <li>
                <a href="#paket-mcu" className="hover:text-[#18181B]">
                  Medical Check-Up
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <div className="font-bold text-[#18181B]">Bantuan</div>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="hover:text-[#18181B] cursor-pointer"
                >
                  Panduan Pendaftaran
                </button>
              </li>
              <li>
                <a href="#aplikasi" className="hover:text-[#18181B]">
                  Rekam Medis Digital
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 text-[11px] text-[#8E8980] space-y-1.5">
            <p>© 2026 RS Nadi. Seluruh hak dilindungi.</p>
            <p>Pengalaman visualisasi rumah sakit 3D interaktif.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
