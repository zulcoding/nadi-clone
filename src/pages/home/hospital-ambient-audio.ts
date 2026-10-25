import {
  computeHospitalAmbientMix,
  type HospitalAmbientMix,
} from './booking-logic';

/**
 * Procedural Web Audio API soundscape engine for the Nadi 3D Hospital scene.
 * Generates 3 subtle, low-volume layers:
 *  1. Distant Lobby Chatter & Room Tone (formant-filtered pink noise with slow LFO murmur)
 *  2. Quiet Medical Equipment Hum (soft 110Hz/165Hz harmonic drone through a warm low-pass filter)
 *  3. Soft Footsteps (cushioned low-frequency step transients synced to character walking speed)
 *
 * Automatically fades in as `interiorFactor` rises from 0 (Exterior Gedung) to 1 (Interior Cutaway).
 */
export class HospitalAmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private masterFilterNode: BiquadFilterNode | null = null;
  private chatterGainNode: GainNode | null = null;
  private humGainNode: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private isInitialized = false;
  private isDisposed = false;
  private lastFootstepTime = 0;
  private stepAlternate = false;

  private currentMix: HospitalAmbientMix = {
    masterGain: 0,
    chatterGain: 0,
    equipmentHumGain: 0,
    footstepGain: 0,
    lowpassCutoffHz: 320,
  };

  /**
   * Initializes the Web Audio graph lazily on first user interaction or when enabled.
   */
  public ensureInitialized(): boolean {
    if (this.isDisposed || typeof window === 'undefined') return false;
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {});
      }
      return true;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return false;

    try {
      const ctx = new AudioCtx();
      this.ctx = ctx;

      // Master acoustic low-pass filter (opens up from 320Hz outside to 1450Hz inside)
      const masterFilter = ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.value = 320;
      masterFilter.Q.value = 0.7;
      this.masterFilterNode = masterFilter;

      // Master volume gain node (kept strictly subtle & low-volume)
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.0001;
      this.masterGainNode = masterGain;

      masterFilter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Create a 4-second seamless pink-ish noise buffer for distant murmur & footsteps
      const sampleRate = ctx.sampleRate;
      const bufferLength = sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferLength, sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let b3 = 0;
      let b4 = 0;
      let b5 = 0;
      let b6 = 0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        // Apply slow conversational envelope modulation so looping noise feels like distant lobby murmur
        const env =
          0.65 +
          0.22 * Math.sin((i / sampleRate) * Math.PI * 1.5) +
          0.13 * Math.cos((i / sampleRate) * Math.PI * 3.5);
        data[i] = pink * 0.04 * env;
      }
      this.noiseBuffer = buffer;

      // 1. Distant Lobby Chatter Layer (bandpass around warm speech formants 420Hz)
      const chatterSource = ctx.createBufferSource();
      chatterSource.buffer = buffer;
      chatterSource.loop = true;

      const chatterBandpass = ctx.createBiquadFilter();
      chatterBandpass.type = 'bandpass';
      chatterBandpass.frequency.value = 440;
      chatterBandpass.Q.value = 0.85;

      const chatterGain = ctx.createGain();
      chatterGain.gain.value = 0.0001;
      this.chatterGainNode = chatterGain;

      chatterSource.connect(chatterBandpass);
      chatterBandpass.connect(chatterGain);
      chatterGain.connect(masterFilter);
      chatterSource.start(0);

      // 2. Quiet Medical Equipment Hum Layer (soft 108Hz + 162Hz warm clinical hum)
      const humOsc1 = ctx.createOscillator();
      humOsc1.type = 'sine';
      humOsc1.frequency.value = 108;

      const humOsc2 = ctx.createOscillator();
      humOsc2.type = 'triangle';
      humOsc2.frequency.value = 162;

      const humSubFilter = ctx.createBiquadFilter();
      humSubFilter.type = 'lowpass';
      humSubFilter.frequency.value = 210;

      const humGain = ctx.createGain();
      humGain.gain.value = 0.0001;
      this.humGainNode = humGain;

      const osc2Atten = ctx.createGain();
      osc2Atten.gain.value = 0.25;

      humOsc1.connect(humSubFilter);
      humOsc2.connect(osc2Atten);
      osc2Atten.connect(humSubFilter);
      humSubFilter.connect(humGain);
      humGain.connect(masterFilter);

      humOsc1.start(0);
      humOsc2.start(0);

      this.isInitialized = true;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Updates the continuous ambient soundscape parameters every frame based on
   * how far the user has entered the 3D building (`interiorFactor`), character walking speed,
   * and active station stage.
   */
  public updateFrame(params: {
    interiorFactor: number;
    walkStrength: number;
    activeStationStage: number | null;
    enabled: boolean;
    elapsedSeconds: number;
  }): HospitalAmbientMix {
    const mix = computeHospitalAmbientMix({
      interiorFactor: params.interiorFactor,
      walkStrength: params.walkStrength,
      activeStationStage: params.activeStationStage,
      enabled: params.enabled,
    });
    this.currentMix = mix;

    if (!this.isInitialized || !this.ctx) {
      return mix;
    }

    if (params.enabled && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;
    const timeConstant = 0.16;

    if (this.masterGainNode) {
      this.masterGainNode.gain.setTargetAtTime(
        mix.masterGain,
        now,
        timeConstant
      );
    }
    if (this.masterFilterNode) {
      this.masterFilterNode.frequency.setTargetAtTime(
        mix.lowpassCutoffHz,
        now,
        timeConstant
      );
    }
    if (this.chatterGainNode) {
      this.chatterGainNode.gain.setTargetAtTime(
        mix.chatterGain,
        now,
        timeConstant
      );
    }
    if (this.humGainNode) {
      this.humGainNode.gain.setTargetAtTime(
        mix.equipmentHumGain,
        now,
        timeConstant
      );
    }

    // Trigger soft, cushioned footsteps when the patient is walking
    if (
      params.enabled &&
      this.ctx.state === 'running' &&
      mix.footstepGain > 0.004
    ) {
      const stepInterval = 0.34; // ~2.9 steps per second matching character stride
      if (params.elapsedSeconds - this.lastFootstepTime >= stepInterval) {
        this.lastFootstepTime = params.elapsedSeconds;
        this.triggerSoftFootstep(mix.footstepGain);
      }
    }

    return mix;
  }

  private triggerSoftFootstep(stepGainValue: number): void {
    if (
      !this.ctx ||
      !this.noiseBuffer ||
      !this.masterFilterNode ||
      this.ctx.state !== 'running'
    ) {
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.stepAlternate = !this.stepAlternate;

      const stepSource = this.ctx.createBufferSource();
      stepSource.buffer = this.noiseBuffer;

      // Soft low-pass thud + slight heel/toe pitch alternation
      const stepFilter = this.ctx.createBiquadFilter();
      stepFilter.type = 'bandpass';
      stepFilter.frequency.value = this.stepAlternate ? 215 : 255;
      stepFilter.Q.value = 1.6;

      const stepGain = this.ctx.createGain();
      const peak = Math.min(0.065, stepGainValue * 1.15);
      stepGain.gain.setValueAtTime(0.0001, now);
      stepGain.gain.linearRampToValueAtTime(peak, now + 0.018);
      stepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      stepSource.connect(stepFilter);
      stepFilter.connect(stepGain);
      stepGain.connect(this.masterFilterNode);

      const randomOffset = Math.random() * 2.5;
      stepSource.start(now, randomOffset, 0.13);
    } catch {
      // Ignore transient scheduling errors if context is closing
    }
  }

  public getCurrentMix(): HospitalAmbientMix {
    return this.currentMix;
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
