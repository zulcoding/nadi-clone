import * as React from 'react';
import { CalendarCheck, Tv } from 'lucide-react';
import { TOUR_STEPS, type DoctorItem, type McuPackageItem } from './data';
import {
  computeDayNightCycleState,
  getCurrentLocalHour,
  getFloatingInfoPointDetails,
  getHotspotDetails,
  scrollProgressToTourStep,
  type FloorId,
} from './booking-logic';
import { TopNavbar } from './TopNavbar';
import { HospitalSceneCanvas } from './HospitalSceneCanvas';
import { HeroTourOverlay } from './HeroTourOverlay';
import { AmbulanceSection } from './AmbulanceSection';
import { ServicesSection } from './ServicesSection';
import { DoctorsSection } from './DoctorsSection';
import { AppointmentBooking } from './AppointmentBooking';
import { AppShowcaseSection } from './AppShowcaseSection';
import { McuPackagesSection } from './McuPackagesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { BookingModal } from './BookingModal';
import { LoginModal } from './LoginModal';
import { InfoPointModal } from './InfoPointModal';

export function HomePage() {
  const tourTrackRef = React.useRef<HTMLDivElement | null>(null);
  const continuousStepRef = React.useRef<number>(0);
  const programmaticScrollUntilRef = React.useRef<number>(0);

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [autoTourActive, setAutoTourActive] = React.useState<boolean>(false);
  const [followCamTight, setFollowCamTight] = React.useState<boolean>(false);
  const [activeFloor, setActiveFloor] = React.useState<FloorId>(1);
  const [timeOfDayHour, setTimeOfDayHour] = React.useState<number>(() =>
    getCurrentLocalHour()
  );
  const [dayNightCycleActive, setDayNightCycleActive] =
    React.useState<boolean>(false);
  const [ambientAudioEnabled, setAmbientAudioEnabled] =
    React.useState<boolean>(true);
  const [activeQueueCode, setActiveQueueCode] = React.useState<string>('A-012');
  const [selectedHotspotId, setSelectedHotspotId] = React.useState<
    string | null
  >(null);
  const [selectedInfoPointId, setSelectedInfoPointId] = React.useState<
    string | null
  >(null);

  const dayNightState = computeDayNightCycleState(timeOfDayHour);
  const isNightMode = dayNightState.isDarkUI;

  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [bookingSpecialtyId, setBookingSpecialtyId] = React.useState<
    string | undefined
  >(undefined);
  const [bookingDoctor, setBookingDoctor] = React.useState<DoctorItem | null>(
    null
  );

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loggedInUser, setLoggedInUser] = React.useState<string | null>(null);
  const [confirmedTicket, setConfirmedTicket] = React.useState<{
    queueCode: string;
    doctorName: string;
    scheduleText: string;
    patientName: string;
  } | null>(null);

  // Sync manual user scroll inside the 3D tour track continuously to continuousStepRef
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        autoTourActive ||
        performance.now() < programmaticScrollUntilRef.current
      ) {
        return;
      }
      const track = tourTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const scrolled = -rect.top;
      if (scrolled < -80 || scrolled > scrollableDistance + 200) {
        return;
      }
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      const { activeStepIndex, continuousStep } =
        scrollProgressToTourStep(progress);
      continuousStepRef.current = continuousStep;
      setActiveStep((prev) =>
        prev === activeStepIndex ? prev : activeStepIndex
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [autoTourActive]);

  // Continuous Auto-Tour 3D Camera Flight Loop with Stage Dwell Pause
  React.useEffect(() => {
    if (!autoTourActive) return;
    let rafId = 0;
    let lastTime = performance.now();
    let dwellRemaining = 1.4; // Pause at each station so the patient performs the stage action

    const advanceAutoTour = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.12);
      lastTime = now;

      const maxStep = TOUR_STEPS.length - 1;
      const current = continuousStepRef.current;

      if (dwellRemaining > 0) {
        dwellRemaining -= dt;
      } else {
        const nextInteger = Math.floor(current) + 1;
        let nextStep = current + dt * 0.62;

        // If we crossed or reached the next station integer, snap to it and dwell for 1.8s!
        if (nextStep >= nextInteger && current < nextInteger) {
          nextStep = nextInteger > maxStep ? 0 : nextInteger;
          dwellRemaining = 1.8;
        } else if (nextStep > maxStep) {
          nextStep = 0;
          dwellRemaining = 1.6;
        }

        continuousStepRef.current = nextStep;
        const rounded = Math.round(nextStep);
        setActiveStep((prev) => (prev === rounded ? prev : rounded));

        const track = tourTrackRef.current;
        if (track) {
          const scrollableDistance = Math.max(
            1,
            track.offsetHeight - window.innerHeight
          );
          const targetScrollY =
            track.offsetTop + (nextStep / maxStep) * scrollableDistance;
          programmaticScrollUntilRef.current = performance.now() + 120;
          window.scrollTo({ top: targetScrollY, behavior: 'auto' });
        }
      }

      rafId = requestAnimationFrame(advanceAutoTour);
    };

    rafId = requestAnimationFrame(advanceAutoTour);
    return () => cancelAnimationFrame(rafId);
  }, [autoTourActive]);

  // Continuous 24-Hour Day-Night Cycle Time-Lapse when dayNightCycleActive is enabled
  React.useEffect(() => {
    if (!dayNightCycleActive) return;
    const intervalId = window.setInterval(() => {
      setTimeOfDayHour((prev) => Number(((prev + 0.25) % 24).toFixed(2)));
    }, 140);
    return () => window.clearInterval(intervalId);
  }, [dayNightCycleActive]);

  const handleToggleNightMode = () => {
    setDayNightCycleActive(false);
    setTimeOfDayHour((prev) => {
      const current = computeDayNightCycleState(prev);
      return current.isDarkUI ? 12.0 : 21.5;
    });
  };

  const handleSelectTimeOfDayHour = (hour: number) => {
    setDayNightCycleActive(false);
    setTimeOfDayHour(hour);
  };

  const handleSelectTourStep = (stepIndex: number) => {
    setAutoTourActive(false);
    const clamped = Math.max(0, Math.min(TOUR_STEPS.length - 1, stepIndex));
    continuousStepRef.current = clamped;
    setActiveStep(clamped);

    const track = tourTrackRef.current;
    if (track) {
      const scrollableDistance = Math.max(
        1,
        track.offsetHeight - window.innerHeight
      );
      const targetScrollY =
        track.offsetTop +
        (clamped / (TOUR_STEPS.length - 1)) * scrollableDistance;
      programmaticScrollUntilRef.current = performance.now() + 900;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  const handleSelectHotspot = (hotspotId: string | null) => {
    setSelectedHotspotId(hotspotId);
    const details = getHotspotDetails(hotspotId);
    if (details && activeStep !== details.stepIndex) {
      handleSelectTourStep(details.stepIndex);
    }
  };

  const handleSelectInfoPoint = (infoPointId: string | null) => {
    setAutoTourActive(false);
    setSelectedInfoPointId(infoPointId);
    const infoDetails = getFloatingInfoPointDetails(infoPointId);
    if (infoDetails && activeStep !== infoDetails.stepIndex) {
      handleSelectTourStep(infoDetails.stepIndex);
    }
  };

  const handleSimulate3DCheckIn = (queueCode: string) => {
    setActiveQueueCode(queueCode);
    setActiveFloor(1);
    setSelectedHotspotId('pendaftaran-tv');
    handleSelectTourStep(1);
  };

  const handleOpenBooking = (specialtyId?: string) => {
    setAutoTourActive(false);
    setBookingDoctor(null);
    setBookingSpecialtyId(specialtyId);
    setBookingOpen(true);
  };

  const handleSelectDoctorForBooking = (doctor: DoctorItem) => {
    setAutoTourActive(false);
    setBookingSpecialtyId(doctor.specialtyId);
    setBookingDoctor(doctor);
    setBookingOpen(true);
  };

  const handleSelectMcuPackage = (pkg: McuPackageItem) => {
    setAutoTourActive(false);
    setBookingDoctor(null);
    setBookingSpecialtyId('penyakit-dalam');
    setBookingOpen(true);
    void pkg;
  };

  return (
    <div id="top" className="min-h-screen bg-[#F6F2EA] text-[#18181B]">
      {/* Fixed 3-Zone Top Navigation Bar */}
      <TopNavbar
        onOpenBooking={handleOpenBooking}
        onOpenLogin={() => setLoginOpen(true)}
        loggedInUser={loggedInUser}
      />

      {/* Active E-Ticket Status Banner when user confirms an appointment */}
      {confirmedTicket && (
        <div className="fixed bottom-4 right-4 z-30 flex items-center gap-3 rounded-2xl border border-[#10B981]/40 bg-white px-4 py-3 text-xs shadow-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-[#18181B]">
              Antrean {confirmedTicket.queueCode} · {confirmedTicket.doctorName}
            </div>
            <div className="text-[11px] text-[#65625D]">
              {confirmedTicket.scheduleText}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleSimulate3DCheckIn(confirmedTicket.queueCode)}
            className="ml-2 inline-flex items-center gap-1 rounded-xl bg-[#18181B] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#E8612C] transition-colors cursor-pointer"
          >
            <Tv className="h-3 w-3" />
            <span>Lihat di TV 3D</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main>
        {/* 3D Scroll-Driven Hospital Tour Track (6 Waypoints) */}
        <section
          ref={tourTrackRef}
          aria-label="Tur 3D Perjalanan Pasien RS Nadi"
          className="relative h-[520vh] w-full"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Full-Viewport Three.js WebGL Scene */}
            <div className="absolute inset-0 z-0">
              <HospitalSceneCanvas
                activeStep={activeStep}
                continuousStepRef={continuousStepRef}
                followCamTight={followCamTight}
                activeFloor={activeFloor}
                isNightMode={isNightMode}
                timeOfDayHour={timeOfDayHour}
                ambientAudioEnabled={ambientAudioEnabled}
                activeQueueCode={activeQueueCode}
                selectedHotspotId={selectedHotspotId}
                onSelectHotspot={handleSelectHotspot}
                selectedInfoPointId={selectedInfoPointId}
                onSelectInfoPoint={handleSelectInfoPoint}
              />
            </div>

            {/* Semantic DOM Overlay Cards & Collapsible Step Dock */}
            <HeroTourOverlay
              activeStep={activeStep}
              onSelectStep={handleSelectTourStep}
              onOpenBooking={handleOpenBooking}
              autoTourActive={autoTourActive}
              onToggleAutoTour={() => setAutoTourActive((prev) => !prev)}
              followCamTight={followCamTight}
              onToggleFollowCam={() => setFollowCamTight((prev) => !prev)}
              activeFloor={activeFloor}
              onSelectFloor={setActiveFloor}
              isNightMode={isNightMode}
              onToggleNightMode={handleToggleNightMode}
              timeOfDayHour={timeOfDayHour}
              onSelectTimeOfDayHour={handleSelectTimeOfDayHour}
              dayNightCycleActive={dayNightCycleActive}
              onToggleDayNightCycle={() =>
                setDayNightCycleActive((prev) => !prev)
              }
              ambientAudioEnabled={ambientAudioEnabled}
              onToggleAmbientAudio={() =>
                setAmbientAudioEnabled((prev) => !prev)
              }
              activeQueueCode={activeQueueCode}
              onSimulateQueueCall={(code) => setActiveQueueCode(code)}
              selectedHotspotId={selectedHotspotId}
              onSelectHotspot={handleSelectHotspot}
              selectedInfoPointId={selectedInfoPointId}
              onSelectInfoPoint={handleSelectInfoPoint}
            />
          </div>
        </section>

        {/* Below-the-Fold Sections */}
        <div className="relative z-10 bg-[#F6F2EA]">
          <AmbulanceSection />
          <ServicesSection onOpenBooking={handleOpenBooking} />
          <DoctorsSection
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
            onOpenBooking={handleOpenBooking}
          />
          <AppointmentBooking
            preselectedDoctor={bookingDoctor}
            onBookingConfirmed={(ticket) => {
              setConfirmedTicket(ticket);
              setActiveQueueCode(ticket.queueCode);
            }}
            onSimulate3DCheckIn={handleSimulate3DCheckIn}
          />
          <AppShowcaseSection onOpenBooking={() => handleOpenBooking()} />
          <McuPackagesSection onSelectMcuPackage={handleSelectMcuPackage} />
          <TestimonialsSection onOpenBooking={() => handleOpenBooking()} />
        </div>
      </main>

      {/* 5-Step Doctor Appointment Modal */}
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialSpecialtyId={bookingSpecialtyId}
        initialDoctor={bookingDoctor}
        onBookingConfirmed={(ticket) => {
          setConfirmedTicket(ticket);
          setActiveQueueCode(ticket.queueCode);
        }}
        onSimulate3DCheckIn={handleSimulate3DCheckIn}
      />

      {/* Patient Portal Login Modal */}
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLoginSuccess={(name) => setLoggedInUser(name)}
      />

      {/* Interactive 3D Floating Info Point Modal Overlay (Health Tips & Hospital Directory) */}
      <InfoPointModal
        infoPointId={selectedInfoPointId}
        onSelectInfoPoint={setSelectedInfoPointId}
        onFocusStepIn3D={handleSelectTourStep}
        onOpenBooking={handleOpenBooking}
      />
    </div>
  );
}
