import * as React from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  HeartPulse,
  Info,
  MapPin,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  filterFloatingInfoPointsByCategory,
  getFloatingInfoPointDetails,
  type FloatingInfoPointCategory,
} from './booking-logic';

export interface InfoPointModalProps {
  infoPointId: string | null;
  onSelectInfoPoint: (infoPointId: string | null) => void;
  onFocusStepIn3D: (stepIndex: number) => void;
  onOpenBooking: (specialtyId?: string) => void;
}

export function InfoPointModal({
  infoPointId,
  onSelectInfoPoint,
  onFocusStepIn3D,
  onOpenBooking,
}: InfoPointModalProps) {
  const [activeCategory, setActiveCategory] = React.useState<
    'all' | FloatingInfoPointCategory
  >('all');

  const currentPoint = getFloatingInfoPointDetails(infoPointId);

  React.useEffect(() => {
    if (!currentPoint) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectInfoPoint(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPoint, onSelectInfoPoint]);

  if (!currentPoint) return null;

  const filteredPoints = filterFloatingInfoPointsByCategory(activeCategory);
  const isHealthTip = currentPoint.category === 'health-tip';

  return (
    <div
      data-testid="info-point-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectInfoPoint(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181B]/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-point-modal-title"
        data-testid="info-point-modal"
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#E5DFD3] bg-[#FAF8F4] text-[#18181B] shadow-[0_24px_64px_rgb(24,24,27,0.28)]"
      >
        {/* Top Header Bar with Category Filter & Close Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DFD3] bg-white px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                isHealthTip
                  ? 'bg-[#ECFDF5] text-[#10B981]'
                  : 'bg-[#FDF6F2] text-[#E8612C]'
              }`}
            >
              {isHealthTip ? (
                <HeartPulse className="h-4 w-4" />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  data-testid="info-point-category-badge"
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    isHealthTip
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : 'bg-[#FDF6F2] text-[#E8612C]'
                  }`}
                >
                  {currentPoint.categoryBadge}
                </span>
                <span className="text-[11px] font-semibold text-[#78716C]">
                  · {currentPoint.zoneLabel}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Tutup modal info 3D"
            data-testid="close-info-point-modal"
            onClick={() => onSelectInfoPoint(null)}
            className="rounded-xl border border-[#E5DFD3] bg-[#FAF8F4] p-2 text-[#57534E] hover:bg-[#18181B] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Interactive 3D Info Point Switcher & Category Filter Bar */}
        <div className="border-b border-[#E5DFD3] bg-[#F6F2EA] px-5 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#57534E]">
              Titik Info 3D di Gedung RS Nadi:
            </span>
            <div
              role="tablist"
              aria-label="Filter kategori titik info 3D"
              className="flex items-center gap-1 rounded-full border border-[#E5DFD3] bg-white p-0.5"
            >
              {(
                [
                  { id: 'all', label: 'Semua (6)' },
                  { id: 'health-tip', label: 'Tips Kesehatan' },
                  { id: 'directory', label: 'Direktori RS' },
                ] as const
              ).map((tab) => {
                const active = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-testid={`info-filter-${tab.id}`}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      const list = filterFloatingInfoPointsByCategory(tab.id);
                      if (
                        list.length > 0 &&
                        !list.some((item) => item.id === currentPoint.id)
                      ) {
                        onSelectInfoPoint(list[0].id);
                      }
                    }}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#18181B] text-white'
                        : 'text-[#57534E] hover:text-[#18181B]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {filteredPoints.map((pt) => {
              const selected = pt.id === currentPoint.id;
              const isTip = pt.category === 'health-tip';
              return (
                <button
                  key={pt.id}
                  type="button"
                  data-testid={`select-info-point-${pt.id}`}
                  onClick={() => onSelectInfoPoint(pt.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                    selected
                      ? isTip
                        ? 'border-[#10B981] bg-[#10B981] text-white shadow-xs'
                        : 'border-[#E8612C] bg-[#E8612C] text-white shadow-xs'
                      : 'border-[#E5DFD3] bg-white text-[#57534E] hover:border-[#18181B]/30 hover:text-[#18181B]'
                  }`}
                >
                  {isTip ? (
                    <Sparkles className="h-3 w-3 shrink-0" />
                  ) : (
                    <Info className="h-3 w-3 shrink-0" />
                  )}
                  <span>{pt.shortBadgeLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <div>
            <h2
              id="info-point-modal-title"
              data-testid="info-point-modal-title"
              className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#18181B]"
            >
              {currentPoint.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#57534E]">
              {currentPoint.summary}
            </p>
          </div>

          {/* Location & Operating Hours Metadata Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-start gap-2.5 rounded-2xl border border-[#E5DFD3] bg-white p-3.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E8612C]" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  Lokasi Direktori RS
                </div>
                <div className="mt-0.5 text-xs font-bold text-[#18181B]">
                  {currentPoint.floorLocation}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl border border-[#E5DFD3] bg-white p-3.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  Jam Operasional Layanan
                </div>
                <div className="mt-0.5 text-xs font-bold text-[#18181B]">
                  {currentPoint.operatingHours}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Bullet Points */}
          <div className="rounded-2xl border border-[#E5DFD3] bg-white p-4">
            <div className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#18181B]">
              {isHealthTip
                ? 'Panduan Medis & Langkah Persiapan Pasien'
                : 'Informasi Fasilitas & Alur Layanan'}
            </div>
            <ul className="space-y-2.5">
              {currentPoint.bulletPoints.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-[#44403C]"
                >
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      isHealthTip ? 'text-[#10B981]' : 'text-[#E8612C]'
                    }`}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical / Advisory Callout Box */}
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 text-xs leading-relaxed ${
              isHealthTip
                ? 'border-[#10B981]/30 bg-[#ECFDF5]/70 text-[#065F46]'
                : 'border-[#E8612C]/30 bg-[#FDF6F2] text-[#7C2D12]'
            }`}
          >
            <ShieldAlert
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                isHealthTip ? 'text-[#10B981]' : 'text-[#E8612C]'
              }`}
            />
            <div>
              <span className="font-extrabold">Catatan Klinis RS Nadi: </span>
              <span>{currentPoint.clinicalNote}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-[#E5DFD3] bg-white px-5 py-3.5 sm:px-6">
          <Button
            type="button"
            variant="outline"
            data-testid="info-point-focus-3d-btn"
            onClick={() => {
              onFocusStepIn3D(currentPoint.stepIndex);
              onSelectInfoPoint(null);
            }}
            className="text-xs"
          >
            <Compass className="h-3.5 w-3.5 text-[#E8612C]" />
            <span>Fokus Kamera 3D ke Zona Ini</span>
          </Button>

          <Button
            type="button"
            variant="orange"
            data-testid="info-point-book-cta"
            onClick={() => {
              const specId = currentPoint.relatedSpecialtyId;
              onSelectInfoPoint(null);
              onOpenBooking(specId);
            }}
            className="text-xs"
          >
            <span>{currentPoint.ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
