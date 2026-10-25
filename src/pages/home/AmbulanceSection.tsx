import * as React from 'react';
import {
  Ambulance,
  ArrowRight,
  Check,
  Navigation,
  PhoneCall,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export function AmbulanceSection() {
  const [etaMinutes, setEtaMinutes] = React.useState(6);
  const [simulating, setSimulating] = React.useState(false);
  const [showHowItWorks, setShowHowItWorks] = React.useState(false);
  const [paramedicCalled, setParamedicCalled] = React.useState(false);

  React.useEffect(() => {
    if (!simulating) return;
    const timer = window.setInterval(() => {
      setEtaMinutes((prev) => {
        if (prev <= 1) {
          setSimulating(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [simulating]);

  const progressRatio = (6 - etaMinutes) / 6;

  return (
    <section
      id="ambulans"
      className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Left Copy */}
        <div className="lg:col-span-4 space-y-4">
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#78716C]">
            AMBULANS SIAGA 24 JAM
          </p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] text-[#18181B]"
            style={{ textWrap: 'balance' }}
          >
            Setiap Detik Berharga.
          </h2>
          <p className="text-sm leading-relaxed text-[#57534E]">
            Panggil ambulans dalam satu ketukan dan pantau posisinya secara
            real-time hingga tiba di depan pintu Anda.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="orange"
              onClick={() => {
                setEtaMinutes(6);
                setSimulating(true);
              }}
            >
              <span>
                {simulating
                  ? 'Melacak Ambulans...'
                  : etaMinutes === 0
                    ? 'Tiba di Lokasi · Reset'
                    : 'Panggil 1500-911'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <button
              type="button"
              onClick={() => setShowHowItWorks((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#18181B] hover:text-[#E8612C] transition-colors cursor-pointer"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D6D0C4] bg-white">
                <Play className="h-3 w-3 fill-current" />
              </span>
              <span>Cara kerja</span>
            </button>
          </div>

          {showHowItWorks && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-4 text-xs text-[#57534E] space-y-2">
              <div className="font-bold text-[#18181B]">
                Protokol Tanggap Darurat Nadi:
              </div>
              <p>
                1. Koordinat GPS ponsel Anda langsung terkirim ke meja komando
                IGD RS Nadi.
              </p>
              <p>
                2. Unit ambulans terdekat berangkat dalam &lt; 60 detik lengkap
                dengan tim medis & defibrilator.
              </p>
              <p>
                3. Dokter jaga IGD menyiapkan ruang tindakan sebelum Anda tiba.
              </p>
            </div>
          )}
        </div>

        {/* Right 3D Isometric Route Map & Live Status Card */}
        <div className="lg:col-span-8 relative">
          <div className="relative overflow-hidden rounded-3xl border border-[#E5DFD3] bg-[#F2ECE1] p-6 sm:p-8 min-h-[360px]">
            {/* Isometric Map SVG Illustration */}
            <svg
              viewBox="0 0 680 340"
              className="w-full h-auto select-none"
              role="img"
              aria-label="Peta pelacakan ambulans real-time dari Rumah Sakit Nadi ke lokasi pasien"
            >
              {/* Subtle city blocks */}
              <rect
                x="30"
                y="30"
                width="170"
                height="110"
                rx="18"
                fill="#EAE3D5"
              />
              <rect
                x="240"
                y="20"
                width="180"
                height="95"
                rx="18"
                fill="#EAE3D5"
              />
              <rect
                x="60"
                y="195"
                width="190"
                height="115"
                rx="18"
                fill="#EAE3D5"
              />
              <rect
                x="300"
                y="190"
                width="200"
                height="120"
                rx="18"
                fill="#EAE3D5"
              />

              {/* Road network */}
              <path
                d="M 80 155 C 180 155, 195 255, 290 245 C 385 235, 395 140, 505 145"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="32"
                strokeLinecap="round"
              />

              {/* Dashed orange active route */}
              <path
                d="M 80 155 C 180 155, 195 255, 290 245 C 385 235, 395 140, 505 145"
                fill="none"
                stroke="#E8612C"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />

              {/* Trees */}
              <circle cx="155" cy="70" r="14" fill="#6D9764" />
              <circle cx="170" cy="78" r="11" fill="#527B4B" />
              <circle cx="265" cy="60" r="15" fill="#6D9764" />
              <circle cx="385" cy="65" r="12" fill="#527B4B" />
              <circle cx="135" cy="265" r="16" fill="#6D9764" />
              <circle cx="325" cy="275" r="14" fill="#527B4B" />

              {/* Hospital Origin Node */}
              <g transform="translate(52, 95)">
                <rect
                  x="0"
                  y="0"
                  width="54"
                  height="52"
                  rx="10"
                  fill="#FFFFFF"
                  stroke="#E5DFD3"
                  strokeWidth="2"
                />
                <rect x="23" y="12" width="8" height="24" fill="#E8612C" />
                <rect x="15" y="20" width="24" height="8" fill="#E8612C" />
                <text
                  x="27"
                  y="-8"
                  textAnchor="middle"
                  fill="#57534E"
                  fontSize="11"
                  fontWeight="700"
                >
                  Rumah Sakit
                </text>
              </g>

              {/* Moving Ambulance Marker along path */}
              <g
                transform={`translate(${
                  275 + progressRatio * 185
                }, ${210 - progressRatio * 68})`}
              >
                <rect
                  x="-42"
                  y="-38"
                  width="84"
                  height="26"
                  rx="13"
                  fill="#18181B"
                />
                <circle cx="-28" cy="-25" r="4" fill="#E8612C" />
                <text
                  x="4"
                  y="-21"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="700"
                >
                  {etaMinutes === 0 ? 'Tiba!' : `${etaMinutes} mnt lagi`}
                </text>
                {/* 3D-style Ambulance Box */}
                <rect
                  x="-22"
                  y="-6"
                  width="44"
                  height="24"
                  rx="6"
                  fill="#FFFFFF"
                  stroke="#18181B"
                  strokeWidth="2"
                />
                <rect x="-22" y="4" width="44" height="6" fill="#E8612C" />
                <circle cx="-12" cy="18" r="5" fill="#18181B" />
                <circle cx="12" cy="18" r="5" fill="#18181B" />
              </g>

              {/* Destination Pin ("Lokasi Anda") */}
              <g transform="translate(505, 145)">
                <circle cx="0" cy="0" r="18" fill="#E8612C" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="8" fill="#E8612C" />
                <text
                  x="0"
                  y="32"
                  textAnchor="middle"
                  fill="#E8612C"
                  fontSize="11"
                  fontWeight="700"
                >
                  Lokasi Anda
                </text>
              </g>
            </svg>

            {/* Floating Live Dispatch Card */}
            <div className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6 w-full sm:w-64 rounded-2xl border border-[#E5DFD3] bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#EFECE4] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8612C] text-white">
                    <Ambulance className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#18181B]">
                      {etaMinutes === 0
                        ? 'Ambulans Tiba'
                        : 'Dalam Perjalanan'}
                    </div>
                    <div className="font-mono-tabular text-[11px] text-[#65625D]">
                      Unit AMB-04 · {etaMinutes === 0 ? '0,0 km' : '2,1 km'}
                    </div>
                  </div>
                </div>
                {etaMinutes < 6 && (
                  <button
                    type="button"
                    aria-label="Reset simulasi ambulans"
                    onClick={() => {
                      setSimulating(false);
                      setEtaMinutes(6);
                    }}
                    className="text-[#78716C] hover:text-[#18181B] cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="my-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span className="text-[#57534E]">Panggilan diterima</span>
                  </div>
                  <span className="font-mono-tabular text-[11px] text-[#78716C]">
                    20:02
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span className="text-[#57534E]">Ambulans berangkat</span>
                  </div>
                  <span className="font-mono-tabular text-[11px] text-[#78716C]">
                    20:03
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-3.5 w-3.5 text-[#E8612C]" />
                    <span className="font-bold text-[#18181B]">
                      Dalam perjalanan
                    </span>
                  </div>
                  <span className="font-mono-tabular text-[11px] font-bold text-[#E8612C]">
                    {etaMinutes === 0 ? 'Selesai' : `${etaMinutes} mnt lagi`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#8E8980]">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 inline-block text-center">
                      ·
                    </span>
                    <span>Tiba di lokasi</span>
                  </div>
                  <span className="font-mono-tabular text-[11px]">~20:12</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setParamedicCalled(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5DFD3] bg-[#FAF8F4] py-2 text-xs font-semibold text-[#18181B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-[#E8612C]" />
                <span>
                  {paramedicCalled
                    ? 'Terhubung ke Tim Medis (AMB-04)'
                    : 'Hubungi paramedis'}
                </span>
              </button>
            </div>
          </div>

          {/* Handwritten Note */}
          <div className="hidden xl:block absolute -right-14 top-16 pointer-events-none">
            <p className="font-handwriting text-2xl text-[#57534E] rotate-6">
              Siap
              <br />
              24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
