import * as React from 'react';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  FileText,
  HeartPulse,
  Pause,
  Pill,
  Play,
  Receipt,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { SPECIALTIES, TOUR_STEPS } from './data';

export interface HeroTourOverlayProps {
  activeStep: number;
  onSelectStep: (stepIndex: number) => void;
  onOpenBooking: (specialtyId?: string) => void;
  autoTourActive: boolean;
  onToggleAutoTour: () => void;
  followCamTight: boolean;
  onToggleFollowCam: () => void;
}

export function HeroTourOverlay({
  activeStep,
  onSelectStep,
  onOpenBooking,
  autoTourActive,
  onToggleAutoTour,
  followCamTight,
  onToggleFollowCam,
}: HeroTourOverlayProps) {
  const [selectedHeroSpecialty, setSelectedHeroSpecialty] =
    React.useState<string>('jantung');
  const [selectedHeroDate, setSelectedHeroDate] =
    React.useState<string>('Besok · 09:00');
  const [dockCollapsed, setDockCollapsed] = React.useState(false);

  const currentStep = TOUR_STEPS[activeStep] ?? TOUR_STEPS[0];

  return (
    <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between px-4 pt-20 pb-5 sm:px-10 lg:px-16">
      {/* Subtle left-side contrast scrim so 3D floor plan never collides with editorial text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full sm:w-[540px] bg-gradient-to-r from-[#F6F2EA] via-[#F6F2EA]/90 to-transparent"
      />

      {/* Main Left Editorial Column with smooth transition on step change */}
      <div
        key={currentStep.id}
        className="my-auto max-w-[430px] pointer-events-auto transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2"
      >
        {/* Kicker */}
        <p className="mb-2.5 text-[11px] font-bold tracking-[0.16em] text-[#78716C]">
          {currentStep.stepTag}
        </p>

        {/* Display Headline */}
        <h1
          className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.06] text-[#18181B]"
          style={{ textWrap: 'balance' }}
        >
          <span className="block">{currentStep.titleBlack}</span>
          <span className="block text-[#E8612C]">{currentStep.titleOrange}</span>
        </h1>

        {/* Lead paragraph */}
        <p className="mt-3.5 text-sm leading-relaxed text-[#57534E]">
          {currentStep.description}
        </p>

        {/* Step-specific Interactive Card */}
        <div className="mt-5">
          {activeStep === 0 && (
            <div className="space-y-5">
              {/* Quick Specialty & Schedule Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl border border-[#E5DFD3] bg-white p-2 shadow-[0_8px_30px_rgb(24,24,27,0.06)]">
                <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5">
                  <Stethoscope className="h-4 w-4 text-[#E8612C] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor="hero-poliklinik-select"
                      className="block text-[10px] font-semibold text-[#78716C]"
                    >
                      Poliklinik
                    </label>
                    <select
                      id="hero-poliklinik-select"
                      aria-label="Pilih Poliklinik Spesialis"
                      value={selectedHeroSpecialty}
                      onChange={(e) => setSelectedHeroSpecialty(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#18181B] focus:outline-none cursor-pointer truncate"
                    >
                      {SPECIALTIES.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hidden sm:block h-7 w-px bg-[#E5DFD3]" />

                <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5">
                  <Calendar className="h-4 w-4 text-[#E8612C] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor="hero-tanggal-select"
                      className="block text-[10px] font-semibold text-[#78716C]"
                    >
                      Jadwal Kunjungan
                    </label>
                    <select
                      id="hero-tanggal-select"
                      aria-label="Pilih Tanggal Kunjungan"
                      value={selectedHeroDate}
                      onChange={(e) => setSelectedHeroDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#18181B] focus:outline-none cursor-pointer truncate"
                    >
                      <option value="Kapan saja">Kapan saja</option>
                      <option value="Hari ini · 14:00">Hari ini · 14:00</option>
                      <option value="Besok · 09:00">Besok · 09:00</option>
                      <option value="Rab, 28 Okt · 10:00">
                        Rab, 28 Okt · 10:00
                      </option>
                    </select>
                  </div>
                </div>

                <Button
                  variant="orange"
                  size="icon"
                  aria-label="Cari jadwal dan buat janji"
                  onClick={() => onOpenBooking(selectedHeroSpecialty)}
                  className="h-10 w-10 rounded-xl shrink-0 self-end sm:self-center"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Quantitative Metrics Strip */}
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div>
                  <div className="font-mono-tabular text-2xl font-extrabold text-[#18181B]">
                    120<span className="text-[#E8612C]">+</span>
                  </div>
                  <div className="text-xs text-[#65625D]">Dokter spesialis</div>
                </div>
                <div>
                  <div className="font-mono-tabular text-2xl font-extrabold text-[#18181B]">
                    98<span className="text-[#10B981]">%</span>
                  </div>
                  <div className="text-xs text-[#65625D]">Pasien puas</div>
                </div>
                <div>
                  <div className="font-mono-tabular text-2xl font-extrabold text-[#18181B]">
                    24/7
                  </div>
                  <div className="text-xs text-[#65625D]">IGD & ambulans</div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-4 shadow-[0_8px_30px_rgb(24,24,27,0.06)]">
              <div className="mb-3 flex items-center justify-between text-xs text-[#65625D]">
                <span className="font-semibold text-[#18181B]">
                  Layar antrean · Pendaftaran
                </span>
                <span>Gedung A · Lantai 1</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#18181B] p-3.5 text-white">
                <div>
                  <div className="text-[10px] font-semibold tracking-wider text-[#A1A1AA]">
                    NOMOR ANTREAN
                  </div>
                  <div className="font-mono-tabular text-3xl font-extrabold tracking-tight">
                    A-012
                  </div>
                </div>
                <div className="rounded-xl bg-[#E8612C] px-3.5 py-2 text-center">
                  <div className="text-[10px] font-semibold text-white/85">
                    Loket
                  </div>
                  <div className="font-mono-tabular text-xl font-extrabold leading-none">
                    2
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-xs text-[#65625D]">
                Sedang dilayani · Estimasi giliran Anda 12 menit lagi
              </p>

              <Button
                onClick={() => onOpenBooking()}
                className="mt-3.5 w-full h-10 text-xs"
              >
                <span>Ambil antrean online</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-4 shadow-[0_8px_30px_rgb(24,24,27,0.06)]">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                <HeartPulse className="h-4 w-4 text-[#E8612C]" />
                <span>Tanda-tanda vital · dicatat perawat</span>
              </div>

              <div className="grid grid-cols-4 gap-2 border-y border-[#EFECE4] py-3">
                <div>
                  <div className="text-[10px] text-[#78716C]">TENSI</div>
                  <div className="font-mono-tabular text-sm font-bold text-[#18181B]">
                    118/76
                  </div>
                  <div className="text-[10px] text-[#78716C]">mmHg</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#78716C]">NADI</div>
                  <div className="font-mono-tabular text-sm font-bold text-[#18181B]">
                    70
                  </div>
                  <div className="text-[10px] text-[#78716C]">bpm</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#78716C]">SUHU</div>
                  <div className="font-mono-tabular text-sm font-bold text-[#18181B]">
                    36,6
                  </div>
                  <div className="text-[10px] text-[#78716C]">°C</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#78716C]">BERAT</div>
                  <div className="font-mono-tabular text-sm font-bold text-[#18181B]">
                    62
                  </div>
                  <div className="text-[10px] text-[#78716C]">kg</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8612C]/15 text-xs font-bold text-[#E8612C]">
                    HW
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#18181B]">
                      dr. Hendra Wijaya, Sp.PD
                    </div>
                    <div className="text-[11px] text-[#65625D]">
                      Penyakit Dalam · siap memeriksa
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBooking('penyakit-dalam')}
                  className="text-xs font-bold text-[#E8612C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Pilih dokter →
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-4 shadow-[0_8px_30px_rgb(24,24,27,0.06)]">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                <FileText className="h-4 w-4 text-[#10B981]" />
                <span>Hasil pemeriksaan penunjang</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-[#18181B]">
                        Darah lengkap
                      </div>
                      <div className="text-[11px] text-[#65625D]">
                        Hemoglobin, leukosit, trombosit — normal
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#78716C]">
                    Lab
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-[#18181B]">
                        Rontgen thorax
                      </div>
                      <div className="text-[11px] text-[#65625D]">
                        Jantung & paru dalam batas normal
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#78716C]">
                    Radiologi
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-[#10B981] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-[#18181B]">
                        Gula darah puasa
                      </div>
                      <div className="font-mono-tabular text-[11px] text-[#65625D]">
                        92 mg/dL — normal
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#78716C]">
                    Lab
                  </span>
                </div>
              </div>

              <div className="mt-2.5 border-t border-[#EFECE4] pt-2 text-[11px] text-[#65625D]">
                Otomatis masuk ke aplikasi Nadi & rekam medis dokter
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-4 shadow-[0_8px_30px_rgb(24,24,27,0.06)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
                  <Pill className="h-4 w-4 text-[#E8612C]" />
                  <span>Resep digital #RX-2041</span>
                </div>
                <span className="text-xs font-bold text-[#10B981]">
                  Siap diambil
                </span>
              </div>

              <div className="mb-3 flex items-center justify-between text-[11px] text-[#57534E] border-b border-[#EFECE4] pb-2.5">
                <span className="font-semibold text-[#10B981]">✓ Diterima</span>
                <span className="text-[#D6D0C4]">—</span>
                <span className="font-semibold text-[#10B981]">
                  ✓ Disiapkan
                </span>
                <span className="text-[#D6D0C4]">—</span>
                <span className="font-bold text-[#18181B]">✓ Siap diambil</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-[#18181B]">
                    Omeprazole 20 mg
                  </span>
                  <span className="font-mono-tabular text-[#65625D]">
                    14 kapsul
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#18181B]">
                    Domperidone 10 mg
                  </span>
                  <span className="font-mono-tabular text-[#65625D]">
                    10 tablet
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#18181B]">
                    Vitamin B kompleks
                  </span>
                  <span className="font-mono-tabular text-[#65625D]">
                    30 tablet
                  </span>
                </div>
              </div>

              <div className="mt-3 border-t border-[#EFECE4] pt-2.5 text-[11px] text-[#65625D]">
                Tidak sempat menunggu? Obat bisa diantar ke rumah dalam 47
                menit.
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-4 shadow-[0_8px_30px_rgb(24,24,27,0.06)]">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#18181B]">
                <Receipt className="h-4 w-4 text-[#E8612C]" />
                <span>Tagihan kunjungan</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#57534E]">Konsultasi dokter</span>
                  <span className="font-mono-tabular font-semibold text-[#18181B]">
                    Rp 250.000
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#57534E]">Lab & radiologi</span>
                  <span className="font-mono-tabular font-semibold text-[#18181B]">
                    Rp 180.000
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#57534E]">Obat</span>
                  <span className="font-mono-tabular font-semibold text-[#18181B]">
                    Rp 65.000
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#EFECE4] pt-2 text-sm font-extrabold text-[#18181B]">
                  <span>Total</span>
                  <span className="font-mono-tabular">Rp 495.000</span>
                </div>
              </div>

              <div className="mt-2.5 text-[11px] text-[#78716C]">
                QRIS · Kartu · E-wallet · BPJS
              </div>

              <Button
                onClick={() => onOpenBooking()}
                className="mt-3 w-full h-10 text-xs"
              >
                <span>Buat janji sekarang</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Handwritten Callout on Exterior Step */}
      {activeStep === 0 && (
        <div className="hidden lg:block absolute right-14 bottom-20 pointer-events-none text-right">
          <p className="font-handwriting text-3xl text-[#44403C] -rotate-6">
            Lebih dekat,
            <br />
            lebih tenang
          </p>
        </div>
      )}

      {/* Unified Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="mx-auto flex flex-col items-center pointer-events-auto">
        <div className="mb-1.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleAutoTour}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold shadow-sm transition-colors cursor-pointer ${
              autoTourActive
                ? 'border-[#E8612C] bg-[#E8612C] text-white'
                : 'border-[#E5DFD3] bg-[#FAF8F4]/95 text-[#18181B] hover:bg-[#EFECE4]'
            }`}
          >
            {autoTourActive ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Jeda Auto-Tur 3D</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Putar Auto-Tur 3D</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleFollowCam}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold shadow-sm transition-colors cursor-pointer ${
              followCamTight
                ? 'border-[#18181B] bg-[#18181B] text-white'
                : 'border-[#E5DFD3] bg-[#FAF8F4]/95 text-[#57534E] hover:text-[#18181B]'
            }`}
          >
            <Compass className="h-3 w-3" />
            <span>{followCamTight ? 'Kamera Ikut: Dekat' : 'Kamera Ikut: Sinematik'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            aria-label={
              dockCollapsed
                ? 'Tampilkan navigasi tahapan 3D'
                : 'Sembunyikan navigasi tahapan 3D'
            }
            className="inline-flex items-center gap-1 rounded-full border border-[#E5DFD3] bg-[#FAF8F4]/95 px-2.5 py-1 text-[11px] font-semibold text-[#57534E] hover:text-[#18181B] shadow-sm transition-colors cursor-pointer"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="h-3 w-3" />
                <span>Tampilkan</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                <span>Sembunyikan</span>
              </>
            )}
          </button>
        </div>

        {!dockCollapsed && (
          <div
            role="tablist"
            aria-label="Tahapan perjalanan pasien di RS Nadi"
            className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-[#E5DFD3] bg-[#FAF8F4]/95 p-1.5 shadow-[0_10px_30px_rgb(24,24,27,0.08)] max-w-[94vw]"
          >
            {TOUR_STEPS.map((step) => {
              const isSelected = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#18181B] text-white shadow-sm'
                      : 'text-[#57534E] hover:bg-[#EFECE4] hover:text-[#18181B]'
                  }`}
                >
                  {step.id > 0 && (
                    <span
                      className={`font-mono-tabular text-[11px] ${
                        isSelected ? 'text-[#E8612C]' : 'text-[#8E8980]'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                  <span>{step.shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
