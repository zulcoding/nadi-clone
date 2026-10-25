import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Baby,
  Clock,
  HeartPulse,
} from 'lucide-react';

export interface ServicesSectionProps {
  onOpenBooking: (specialtyId?: string) => void;
}

const FEATURED_SERVICES = [
  {
    id: 'igd',
    specialtyId: 'jantung',
    title: 'IGD 24 Jam',
    description: 'Tim gawat darurat & ambulans siap kapan pun.',
    icon: Clock,
    illustrationType: 'igd' as const,
  },
  {
    id: 'jantung',
    specialtyId: 'jantung',
    title: 'Pusat Jantung',
    description: 'EKG, ekokardiografi, hingga rehabilitasi jantung.',
    icon: HeartPulse,
    illustrationType: 'heart' as const,
  },
  {
    id: 'ibu-anak',
    specialtyId: 'anak',
    title: 'Ibu & Anak',
    description: 'Kehamilan, persalinan, dan tumbuh kembang si kecil.',
    icon: Baby,
    illustrationType: 'mom' as const,
  },
  {
    id: 'mcu',
    specialtyId: 'penyakit-dalam',
    title: 'Medical Check-Up',
    description: 'Paket pemeriksaan lengkap, hasil di aplikasi.',
    icon: Activity,
    illustrationType: 'mcu' as const,
  },
];

export function ServicesSection({ onOpenBooking }: ServicesSectionProps) {
  return (
    <section
      id="layanan"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-8"
    >
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Left Intro Column */}
        <div className="flex flex-col justify-between lg:col-span-3 space-y-4">
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#78716C]">
              LAYANAN UNGGULAN
            </p>
            <h2
              className="text-3xl font-extrabold tracking-tight leading-[1.12] text-[#18181B]"
              style={{ textWrap: 'balance' }}
            >
              Perawatan untuk Setiap Kebutuhan.
            </h2>
            <p className="text-xs leading-relaxed text-[#57534E]">
              Dari gawat darurat hingga klinik spesialis — layanan lengkap untuk
              Anda dan keluarga, dalam satu atap.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 rounded-full border border-[#DED8CC] bg-white px-4 py-2 text-xs font-semibold text-[#18181B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
            >
              <span>Semua layanan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right 4 Service Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
          {FEATURED_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => onOpenBooking(srv.specialtyId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenBooking(srv.specialtyId);
                  }
                }}
                className="group flex flex-col justify-between rounded-3xl border border-[#E5DFD3] bg-white p-3.5 shadow-[0_6px_24px_rgb(24,24,27,0.04)] hover:border-[#E8612C]/50 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div>
                  {/* 3D-Styled Procedural Architectural Miniature */}
                  <div className="relative mb-4 h-36 w-full overflow-hidden rounded-2xl bg-[#F3ECE0]">
                    {srv.illustrationType === 'igd' && (
                      <svg
                        viewBox="0 0 200 140"
                        className="h-full w-full"
                        aria-hidden="true"
                      >
                        <rect width="200" height="140" fill="#F2EAE0" />
                        <rect
                          x="36"
                          y="24"
                          width="128"
                          height="96"
                          rx="10"
                          fill="#FAF6EE"
                        />
                        <rect
                          x="58"
                          y="56"
                          width="84"
                          height="64"
                          rx="6"
                          fill="#E6DEC8"
                        />
                        <circle cx="100" cy="40" r="10" fill="#E8612C" />
                        <rect
                          x="98"
                          y="35"
                          width="4"
                          height="10"
                          fill="#FFFFFF"
                        />
                        <rect
                          x="95"
                          y="38"
                          width="10"
                          height="4"
                          fill="#FFFFFF"
                        />
                      </svg>
                    )}

                    {srv.illustrationType === 'heart' && (
                      <svg
                        viewBox="0 0 200 140"
                        className="h-full w-full"
                        aria-hidden="true"
                      >
                        <rect width="200" height="140" fill="#F5E6DE" />
                        <circle
                          cx="100"
                          cy="70"
                          r="44"
                          fill="#F2C6B2"
                          opacity="0.6"
                        />
                        <path
                          d="M100 102 C100 102 64 78 64 54 C64 40 75 32 87 32 C94 32 100 37 100 42 C100 37 106 32 113 32 C125 32 136 40 136 54 C136 78 100 102 100 102 Z"
                          fill="#E8612C"
                        />
                      </svg>
                    )}

                    {srv.illustrationType === 'mom' && (
                      <svg
                        viewBox="0 0 200 140"
                        className="h-full w-full"
                        aria-hidden="true"
                      >
                        <rect width="200" height="140" fill="#F4EDE2" />
                        <rect
                          x="45"
                          y="45"
                          width="110"
                          height="65"
                          rx="12"
                          fill="#FAF6EE"
                        />
                        <rect
                          x="55"
                          y="65"
                          width="90"
                          height="35"
                          rx="8"
                          fill="#F3A683"
                        />
                        <circle cx="85" cy="55" r="11" fill="#E8612C" />
                        <circle cx="115" cy="60" r="8" fill="#10B981" />
                      </svg>
                    )}

                    {srv.illustrationType === 'mcu' && (
                      <svg
                        viewBox="0 0 200 140"
                        className="h-full w-full"
                        aria-hidden="true"
                      >
                        <rect width="200" height="140" fill="#EFECE6" />
                        <rect
                          x="62"
                          y="20"
                          width="76"
                          height="100"
                          rx="10"
                          fill="#FFFFFF"
                        />
                        <rect
                          x="76"
                          y="38"
                          width="48"
                          height="6"
                          rx="3"
                          fill="#E8612C"
                        />
                        <rect
                          x="76"
                          y="54"
                          width="36"
                          height="6"
                          rx="3"
                          fill="#D6D0C4"
                        />
                        <polyline
                          points="74,88 88,88 94,74 102,98 110,82 126,82"
                          fill="none"
                          stroke="#E8612C"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Icon Badge */}
                  <div className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-white">
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <h3 className="text-sm font-bold text-[#18181B]">
                    {srv.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#65625D]">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5DFD3] text-[#57534E] group-hover:bg-[#18181B] group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
