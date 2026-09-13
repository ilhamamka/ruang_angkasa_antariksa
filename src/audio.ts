// Web Audio API Procedural Sound Synthesizer & Web Speech Engine for Space Game
// Zero external audio files required, zero latency, runs 100% offline on mobile, tablet, and desktop!

export class SpaceSoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private bgmTimer: number | null = null;
  private bgmGain: GainNode | null = null;
  private lang: 'id' | 'en' = 'id';

  constructor() {
    // Initialized on first user gesture
  }

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setLanguage(lang: 'id' | 'en') {
    this.lang = lang;
  }

  public getLanguage(): 'id' | 'en' {
    return this.lang;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleBgm(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (!this.bgmEnabled) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.bgmEnabled;
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  // Tactical sci-fi button click / pop
  public playPop(freq = 440) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Magnetic stage snap / docking sound
  public playSnap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Countdown bleep (800Hz standard, 1400Hz on Liftoff)
  public playCountdownBeep(isLiftoff = false) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isLiftoff ? 'triangle' : 'sine';
    const freq = isLiftoff ? 1200 : 700;
    osc.frequency.setValueAtTime(freq, now);
    if (isLiftoff) {
      osc.frequency.exponentialRampToValueAtTime(2000, now + 0.35);
    }

    gain.gain.setValueAtTime(isLiftoff ? 0.35 : 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isLiftoff ? 0.4 : 0.15));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + (isLiftoff ? 0.42 : 0.16));
  }

  // Roaring rocket thruster ignition using filtered procedural noise
  public playRocketRumble(durationSeconds = 3.5) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * Math.min(durationSeconds, 6);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate brown-tinted noise for powerful deep rocket roar
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // boost rumble
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Resonant low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 1.0);
    filter.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + durationSeconds);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationSeconds);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + durationSeconds);
  }

  // Celestial discovery chime chord (Pentatonic space arpeggio)
  public playCelestialChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const delay = idx * 0.09;
      const now = this.ctx!.currentTime + delay;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    });
  }

  // Sci-fi telemetry scanner sweep
  public playScanner() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.linearRampToValueAtTime(1600, now + 0.12);
    osc.frequency.linearRampToValueAtTime(800, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Laser / telemetry ping sound
  public playLaserPing() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Warp speed whoosh
  public playWarpWhoosh() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.6);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  // Success Fanfare for badge or quiz win
  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      { f: 523.25, t: 0 },    // C5
      { f: 659.25, t: 0.12 }, // E5
      { f: 783.99, t: 0.24 }, // G5
      { f: 1046.5, t: 0.40 }  // C6 (held)
    ];

    chords.forEach(({ f, t }) => {
      const now = this.ctx!.currentTime + t;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    });
  }

  // Ambient Cosmic Space Music Generator (Dreamy Arpeggios & Pad)
  public startBgm() {
    if (!this.bgmEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.bgmTimer) return; // already playing

    const scale = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25]; // C, E, G, B, C, E
    let step = 0;

    const playNextNote = () => {
      if (!this.bgmEnabled || !this.ctx) return;
      const noteFreq = scale[step % scale.length];
      step++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    };

    playNextNote();
    this.bgmTimer = (typeof window !== 'undefined' ? window.setInterval : setInterval)(playNextNote, 1600) as unknown as number;
  }

  public stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Web Speech API for voice narration in Indonesian / English
  public speak(text: string, overrideLang?: 'id' | 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // cancel any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = overrideLang || this.lang;
      utterance.lang = targetLang === 'id' ? 'id-ID' : 'en-US';
      utterance.rate = 0.95; // child-friendly pacing
      utterance.pitch = 1.05; // slightly friendly high pitch

      // Try picking standard native voice
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = targetLang === 'id' ? 'id' : 'en';
      const bestVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback if speech synthesis is disabled on device
    }
  }
}

export const spaceAudio = new SpaceSoundEngine();
