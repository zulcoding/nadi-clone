import * as React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { DOCTORS, SPECIALTIES, type DoctorItem } from './data';
import { filterDoctorsBySpecialty } from './booking-logic';

export interface DoctorsSectionProps {
  onSelectDoctorForBooking: (doctor: DoctorItem) => void;
  onOpenBooking: (specialtyId?: string) => void;
}

function DoctorPortraitIllustration({ doctor }: { doctor: DoctorItem }) {
  return (
    <svg
      viewBox="0 0 320 260"
      className="h-full w-full object-cover"
      role="img"
      aria-label={`Potret ${doctor.name}`}
    >
      {/* Warm hospital corridor background */}
      <defs>
        <linearGradient id={`bg-${doctor.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E6E2D8" />
          <stop offset="50%" stopColor="#D7D2C6" />
          <stop offset="100%" stopColor="#C4BEB0" />
        </linearGradient>
      </defs>
      <rect width="320" height="260" fill={`url(#bg-${doctor.id})`} />

      {/* Subtle architectural clinic background panes */}
      <rect
        x="24"
        y="20"
        width="85"
        height="180"
        rx="8"
        fill="#F5F2EB"
        opacity="0.55"
      />
      <rect
        x="215"
        y="30"
        width="80"
        height="170"
        rx="8"
        fill="#82967C"
        opacity="0.35"
      />

      {/* Shoulders / White Medical Coat */}
      <path
        d="M 68 260 C 68 188, 108 172, 160 172 C 212 172, 252 188, 252 260 Z"
        fill={doctor.coatColor}
      />

      {/* Inner Scrub V-Neck */}
      <polygon
        points="134,174 186,174 160,232"
        fill={doctor.scrubColor}
      />

      {/* Coat lapels */}
      <polygon
        points="124,174 148,255 160,232 134,174"
        fill="#ECE8DF"
      />
      <polygon
        points="196,174 172,255 160,232 186,174"
        fill="#ECE8DF"
      />

      {/* Stethoscope around neck */}
      <path
        d="M 122 182 C 118 220, 136 238, 148 242"
        fill="none"
        stroke="#27272A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 198 182 C 202 215, 192 232, 182 236"
        fill="none"
        stroke="#27272A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="182"
        cy="238"
        r="8"
        fill="#D4D4D8"
        stroke="#27272A"
        strokeWidth="3"
      />

      {/* Neck */}
      <rect
        x="144"
        y="142"
        width="32"
        height="38"
        rx="12"
        fill={doctor.skinTone}
      />

      {/* Back Hair for female doctors */}
      {doctor.gender === 'female' && (
        <path
          d="M 112 105 C 105 145, 112 178, 126 184 L 194 184 C 208 178, 215 145, 208 105 Z"
          fill={doctor.hairColor}
        />
      )}

      {/* Head */}
      <ellipse
        cx="160"
        cy="112"
        rx="38"
        ry="45"
        fill={doctor.skinTone}
      />

      {/* Smile & Eyes */}
      <circle cx="145" cy="108" r="3.5" fill="#18181B" />
      <circle cx="175" cy="108" r="3.5" fill="#18181B" />
      <path
        d="M 138 98 Q 145 94 152 98"
        fill="none"
        stroke={doctor.hairColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 168 98 Q 175 94 182 98"
        fill="none"
        stroke={doctor.hairColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 148 128 Q 160 137 172 128"
        fill="none"
        stroke="#B4533A"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Top Hair */}
      {doctor.gender === 'male' ? (
        <path
          d="M 120 104 C 118 72, 138 58, 162 58 C 186 58, 202 74, 199 104 C 190 86, 174 80, 156 82 C 138 84, 126 92, 120 104 Z"
          fill={doctor.hairColor}
        />
      ) : (
        <path
          d="M 118 112 C 116 70, 136 56, 160 56 C 184 56, 204 70, 202 112 C 194 86, 178 78, 160 78 C 142 78, 126 86, 118 112 Z"
          fill={doctor.hairColor}
        />
      )}
    </svg>
  );
}

export function DoctorsSection({
  onSelectDoctorForBooking,
  onOpenBooking,
}: DoctorsSectionProps) {
  const [selectedSpecialty, setSelectedSpecialty] =
    React.useState<string>('semua');

  const filteredDoctors = filterDoctorsBySpecialty(selectedSpecialty, DOCTORS);
  const visibleDoctors = filteredDoctors.slice(0, 3);

  return (
    <section id="dokter" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      {/* Top Interactive Filter Bar */}
      <div className="mb-8 flex justify-start lg:justify-end overflow-x-auto pb-2">
        <div
          role="tablist"
          aria-label="Filter spesialis dokter"
          className="inline-flex items-center gap-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedSpecialty === 'semua'}
            onClick={() => setSelectedSpecialty('semua')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedSpecialty === 'semua'
                ? 'bg-[#18181B] text-white'
                : 'border border-[#DED8CC] bg-white text-[#57534E] hover:bg-[#EFECE4]'
            }`}
          >
            Semua
          </button>
          {SPECIALTIES.map((spec) => {
            const active = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#18181B] text-white'
                    : 'border border-[#DED8CC] bg-white text-[#57534E] hover:bg-[#EFECE4]'
                }`}
              >
                {spec.shortName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Left Column */}
        <div className="flex flex-col justify-between lg:col-span-3 space-y-4">
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#78716C]">
              TIM DOKTER
            </p>
            <h2
              className="text-3xl font-extrabold tracking-tight leading-[1.12] text-[#18181B]"
              style={{ textWrap: 'balance' }}
            >
              Ditangani Para Ahli.
            </h2>
            <p className="text-xs leading-relaxed text-[#57534E]">
              Dokter spesialis berpengalaman yang mendampingi Anda dari
              konsultasi pertama hingga pemulihan.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                onOpenBooking(
                  selectedSpecialty === 'semua' ? undefined : selectedSpecialty
                )
              }
              className="inline-flex items-center gap-2 rounded-full border border-[#DED8CC] bg-white px-4 py-2 text-xs font-semibold text-[#18181B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
            >
              <span>Lihat Semua Jadwal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right 3 Doctor Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
          {visibleDoctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoctorForBooking(doc)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDoctorForBooking(doc);
                }
              }}
              className="group flex flex-col justify-between rounded-3xl border border-[#E5DFD3] bg-white p-3.5 shadow-[0_6px_24px_rgb(24,24,27,0.04)] hover:border-[#E8612C]/50 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div>
                {/* Portrait Box */}
                <div className="relative mb-3.5 h-52 w-full overflow-hidden rounded-2xl bg-[#E5E0D5]">
                  <DoctorPortraitIllustration doctor={doc} />
                  <div className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#15803D] shadow-sm">
                    Jadwal tersedia
                  </div>
                </div>

                {/* Metadata line (unboxed text with separator) */}
                <div className="flex items-center justify-between text-xs text-[#65625D]">
                  <span className="font-semibold text-[#E8612C]">
                    {doc.specialtyLabel.split(' ')[0]}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono-tabular font-bold text-[#18181B]">
                    <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    {doc.rating}
                  </span>
                </div>

                <h3 className="mt-1.5 text-sm font-extrabold text-[#18181B]">
                  {doc.name}
                </h3>

                <p className="mt-1 text-xs text-[#65625D]">
                  {doc.experienceYears} thn pengalaman · {doc.reviewCount}{' '}
                  ulasan
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F0ECE1] pt-3">
                <div>
                  <div className="text-[10px] font-semibold tracking-wider text-[#8E8980]">
                    JADWAL TERDEKAT
                  </div>
                  <div className="font-mono-tabular text-xs font-bold text-[#18181B]">
                    {doc.nextSchedule}
                  </div>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5DFD3] text-[#18181B] group-hover:bg-[#18181B] group-hover:text-white transition-colors">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
