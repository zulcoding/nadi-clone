import * as React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { MCU_PACKAGES, type McuPackageItem } from './data';

export interface McuPackagesSectionProps {
  onSelectMcuPackage: (pkg: McuPackageItem) => void;
}

export function McuPackagesSection({
  onSelectMcuPackage,
}: McuPackagesSectionProps) {
  const [showComparison, setShowComparison] = React.useState(false);

  return (
    <section id="paket-mcu" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="flex flex-col justify-between lg:col-span-3 space-y-4">
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#78716C]">
              PAKET MEDICAL CHECK-UP
            </p>
            <h2
              className="text-3xl font-extrabold tracking-tight leading-[1.12] text-[#18181B]"
              style={{ textWrap: 'balance' }}
            >
              Investasi Sehat, Harga Jelas.
            </h2>
            <p className="text-xs leading-relaxed text-[#57534E]">
              Harga transparan tanpa biaya tersembunyi. Hasil pemeriksaan
              langsung tersedia di aplikasi.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowComparison((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-[#DED8CC] bg-white px-4 py-2 text-xs font-semibold text-[#18181B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
            >
              <span>
                {showComparison ? 'Tutup Perbandingan' : 'Bandingkan Paket'}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Middle 3 Pricing Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
          {MCU_PACKAGES.map((pkg) => {
            const isPopular = Boolean(pkg.popular);
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-5 transition-all ${
                  isPopular
                    ? 'border-2 border-[#E8612C] bg-white shadow-[0_12px_36px_rgb(232,97,44,0.12)]'
                    : 'border border-[#E5DFD3] bg-white shadow-[0_6px_24px_rgb(24,24,27,0.04)]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-5 rounded-full bg-[#E8612C] px-3 py-0.5 text-[10px] font-bold text-white">
                    Terpopuler
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-[#18181B]">
                    {pkg.name}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-[#78716C]">
                      Rp
                    </span>
                    <span className="font-mono-tabular text-3xl font-extrabold text-[#18181B]">
                      {pkg.priceDisplay}
                    </span>
                    <span className="text-[11px] text-[#78716C]">
                      {pkg.id === 'basic' ? 'rb / orang' : 'jt / orang'}
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2.5 border-t border-[#F0ECE1] pt-4 text-xs text-[#57534E]">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-[#E8612C] mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectMcuPackage(pkg)}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    isPopular
                      ? 'bg-[#E8612C] text-white hover:bg-[#D45220]'
                      : 'border border-[#DED8CC] bg-[#FAF8F4] text-[#18181B] hover:bg-[#EFECE4]'
                  }`}
                >
                  <span>Pilih Paket</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right 3D MCU Kit Illustration */}
        <div className="hidden lg:flex lg:col-span-2 items-center justify-center rounded-3xl border border-[#E5DFD3] bg-[#F2ECE1] p-3">
          <svg
            viewBox="0 0 180 240"
            className="h-full w-full"
            role="img"
            aria-label="Ilustrasi Paket Kit Medical Check-Up Nadi"
          >
            {/* Tall Kraft Box */}
            <polygon
              points="95,40 155,62 155,165 95,188"
              fill="#D49B6A"
            />
            <polygon
              points="95,40 45,60 45,162 95,188"
              fill="#E5B284"
            />
            <polygon
              points="95,22 155,42 95,62 45,42"
              fill="#F0C49B"
            />
            {/* Red/Orange Pill Tray Foreground */}
            <rect
              x="22"
              y="145"
              width="75"
              height="48"
              rx="10"
              fill="#E8612C"
            />
            <rect
              x="28"
              y="138"
              width="63"
              height="16"
              rx="6"
              fill="#FAF6EE"
            />
          </svg>
        </div>
      </div>

      {/* Expandable Comparison Table */}
      {showComparison && (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-[#E5DFD3] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-extrabold text-[#18181B]">
            Perbandingan Rincian Paket Medical Check-Up
          </h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFECE4] text-[#78716C]">
                <th className="py-2.5 pr-4 font-semibold">Komponen</th>
                <th className="py-2.5 px-4 font-bold text-[#18181B]">Basic</th>
                <th className="py-2.5 px-4 font-bold text-[#E8612C]">
                  Executive
                </th>
                <th className="py-2.5 pl-4 font-bold text-[#18181B]">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB] text-[#57534E]">
              <tr>
                <td className="py-2.5 pr-4 font-medium text-[#18181B]">
                  Durasi Pemeriksaan
                </td>
                <td className="py-2.5 px-4 font-mono-tabular">2 Jam</td>
                <td className="py-2.5 px-4 font-mono-tabular font-semibold text-[#18181B]">
                  3 Jam
                </td>
                <td className="py-2.5 pl-4 font-mono-tabular">4 Jam</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-[#18181B]">
                  Jumlah Parameter Lab & Fisik
                </td>
                <td className="py-2.5 px-4 font-mono-tabular">12 Parameter</td>
                <td className="py-2.5 px-4 font-mono-tabular font-semibold text-[#18181B]">
                  28 Parameter
                </td>
                <td className="py-2.5 pl-4 font-mono-tabular">45 Parameter</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-[#18181B]">
                  Rekam Jantung (EKG) & Rontgen Thorax
                </td>
                <td className="py-2.5 px-4">—</td>
                <td className="py-2.5 px-4 text-[#10B981] font-bold">
                  ✓ Termasuk
                </td>
                <td className="py-2.5 pl-4 text-[#10B981] font-bold">
                  ✓ Termasuk + Treadmill
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-[#18181B]">
                  Laporan Hasil Digital di Aplikasi
                </td>
                <td className="py-2.5 px-4">H+1 Hari Kerja</td>
                <td className="py-2.5 px-4 font-semibold text-[#18181B]">
                  Hari yang Sama
                </td>
                <td className="py-2.5 pl-4">
                  Hari yang Sama + Konsultasi 2 Spesialis
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
