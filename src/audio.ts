// Web Audio API Procedural Sound Synthesizer & Web Speech Engine for Space Game
// Zero external audio files required, zero latency, runs 100% offline on mobile, tablet, and desktop!

export class SpaceSoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private bgmTimer: number | null = null;
  private lang: 'id' | 'en' = 'id';
  private autoNarration: boolean = true;
  private isSpeakingState: boolean = false;
  private currentSpokenText: string = '';
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;
  private speakingListeners: Set<(isSpeaking: boolean, text: string) => void> = new Set();
  private keepAliveTimer: number | null = null;
  private hudElement: HTMLElement | null = null;

  constructor() {
    this.initVoices();
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
      this.ctx.resume().catch(() => {});
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;
        this.voicesLoaded = true;

        // In Chrome, Google Bahasa Indonesia works natively, whereas Damayanti (macOS voice) fails silently inside Chrome sandbox
        const googleIdVoice = voices.find(v => {
          const n = (v.name || '').toLowerCase();
          const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
          return (n.includes('google') || n.includes('natural') || !v.localService) && (l.startsWith('id') || n.includes('indonesia'));
        });

        const anyIdVoice = voices.find(v => {
          const n = (v.name || '').toLowerCase();
          const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
          return l === 'id-id' && !n.includes('damayanti');
        });

        const fallbackIdVoice = voices.find(v => {
          const l = (v.lang || '').toLowerCase();
          const n = (v.name || '').toLowerCase();
          return l.startsWith('id') || n.includes('indonesia') || n.includes('damayanti');
        });

        const idVoice = googleIdVoice || anyIdVoice || fallbackIdVoice;

        // If in English or fallback
        const enVoice = voices.find(v => {
          const l = (v.lang || '').toLowerCase();
          return l.startsWith('en') && (l.includes('us') || l.includes('gb'));
        });

        if (this.lang === 'id') {
          this.selectedVoice = idVoice || null;
        } else {
          this.selectedVoice = enVoice || null;
        }
      } catch {
        // Fallback safely
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public setLanguage(lang: 'id' | 'en') {
    this.lang = lang;
    this.initVoices();
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

  public toggleAutoNarration(): boolean {
    this.autoNarration = !this.autoNarration;
    return this.autoNarration;
  }

  public isAutoNarration(): boolean {
    return this.autoNarration;
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

  public onSpeakingChange(listener: (isSpeaking: boolean, text: string) => void): () => void {
    this.speakingListeners.add(listener);
    return () => this.speakingListeners.delete(listener);
  }

  private notifySpeaking(isSpeaking: boolean, text: string = '') {
    this.isSpeakingState = isSpeaking;
    this.currentSpokenText = text;
    this.updateHud(isSpeaking, text);
    this.speakingListeners.forEach(listener => {
      try { listener(isSpeaking, text); } catch {}
    });
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getSpokenText(): string {
    return this.currentSpokenText;
  }

  // --- Visual Mascot Subtitle HUD Bar ---
  private updateHud(isSpeaking: boolean, text: string) {
    if (typeof document === 'undefined') return;

    if (!this.hudElement) {
      this.hudElement = document.getElementById('voice-narration-hud');
      if (!this.hudElement) {
        this.hudElement = document.createElement('div');
        this.hudElement.id = 'voice-narration-hud';
        this.hudElement.className = 'voice-narration-hud';
        document.body.appendChild(this.hudElement);
      }
    }

    if (!isSpeaking || !text) {
      this.hudElement.classList.remove('active');
      return;
    }

    this.hudElement.innerHTML = `
      <div class="hud-mascot-avatar">
        <span class="hud-avatar-icon">🧑‍🚀</span>
        <div class="hud-soundwaves">
          <span class="hud-wave-bar"></span>
          <span class="hud-wave-bar"></span>
          <span class="hud-wave-bar"></span>
        </div>
      </div>
      <div class="hud-content">
        <span class="hud-speaker-label">Kak Bintang Sedang Bercerita:</span>
        <p class="hud-subtitle-text">"${text}"</p>
      </div>
      <div class="hud-actions">
        <button class="btn-hud-action" id="btn-hud-replay" title="Ulangi Suara">🔁</button>
        <button class="btn-hud-action" id="btn-hud-stop" title="Hentikan Suara">⏹️</button>
      </div>
    `;

    this.hudElement.classList.add('active');

    const replayBtn = this.hudElement.querySelector('#btn-hud-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.speakKids(text);
      });
    }

    const stopBtn = this.hudElement.querySelector('#btn-hud-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        this.stopSpeaking();
      });
    }
  }

  // Stop any active speech cleanly
  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    this.notifySpeaking(false, '');
  }

  // Procedural Xylophone / Kalimba syllable blip sequence
  // Guarantees audible character speech feedback on ANY machine even if TTS is uninstalled
  private playMascotTones(syllablesCount = 6) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Sweet child-friendly pentatonic frequencies: C5, D5, E5, G5, A5, C6
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const count = Math.min(Math.max(syllablesCount, 3), 12);
    const now = this.ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const noteFreq = notes[i % notes.length];
      const t = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // warm wooden marimba tone
      osc.frequency.setValueAtTime(noteFreq, t);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.14);
    }
  }

  // Tactical button pop
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

  // Magnetic stage snap
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

  // Balloon hiss sound for Balloon Rocket experiment
  public playBalloonHiss(duration = 1.8) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + duration);
    filter.Q.value = 4.0;

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // Spacesuit equipment click sound
  public playSuitEquip() {
    this.playSnap();
    setTimeout(() => this.playPop(880), 80);
  }

  // Countdown bleep
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

  // Rocket thruster ignition
  public playRocketRumble(durationSeconds = 3.5) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * Math.min(durationSeconds, 6);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

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

  // Celestial discovery chime chord
  public playCelestialChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
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

  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.12 },
      { f: 783.99, t: 0.24 },
      { f: 1046.5, t: 0.40 }
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

  // Play musical melody for the "Me-Ve-Bu-Ma-Ju-Sa-U-Ne" mnemonic song!
  public playPlanetSongMelody() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Cheerful nursery rhyme melody (8 distinct steps)
    const notes = [
      { f: 261.63, d: 0.25, t: 0.00 }, // Me (Merkurius)
      { f: 293.66, d: 0.25, t: 0.28 }, // Ve (Venus)
      { f: 329.63, d: 0.25, t: 0.56 }, // Bu (Bumi)
      { f: 349.23, d: 0.25, t: 0.84 }, // Ma (Mars)
      { f: 392.00, d: 0.35, t: 1.15 }, // Ju (Jupiter)
      { f: 440.00, d: 0.35, t: 1.55 }, // Sa (Saturnus)
      { f: 493.88, d: 0.35, t: 1.95 }, // U  (Uranus)
      { f: 523.25, d: 0.60, t: 2.35 }  // Ne (Neptunus!)
    ];

    notes.forEach(n => {
      const now = this.ctx!.currentTime + n.t;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + n.d + 0.05);
    });
  }

  public startBgm() {
    if (!this.bgmEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.bgmTimer) return;

    const scale = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
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

  public updateSoundToggleUi() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('btn-toggle-sound');
    if (btn) {
      btn.textContent = this.soundEnabled ? '🔊' : '🔇';
    }
  }

  // --- Triple-Layer Voice Narration Engine ---
  // Works with native SpeechSynthesis + Fallback Mascot Tones + Live Subtitles
  public speak(text: string, overrideLang?: 'id' | 'en') {
    if (!text) return;
    this.soundEnabled = true;
    this.updateSoundToggleUi();
    this.speakInternal(text, 0.98, 1.05, overrideLang);
  }

  public speakKids(text: string, onEnd?: () => void) {
    if (!text) return;
    // Auto-unmute when explicit speech is requested
    this.soundEnabled = true;
    this.updateSoundToggleUi();
    this.speakInternal(text, 0.95, 1.05, undefined, onEnd);
  }

  private speakInternal(text: string, rate = 0.95, pitch = 1.05, overrideLang?: 'id' | 'en', onEnd?: () => void) {
    if (typeof window === 'undefined') return;

    // Ensure audio context is ready
    this.initCtx();

    // Show live subtitle banner immediately so user gets instant visual confirmation
    this.notifySpeaking(true, text);

    // Play tactile confirmation pop sound
    this.playPop(520);

    if (!('speechSynthesis' in window)) {
      setTimeout(() => {
        this.notifySpeaking(false, '');
        if (onEnd) onEnd();
      }, Math.max(text.length * 75, 1500));
      return;
    }

    try {
      // Force unfreeze Chrome's speech engine state machine
      try {
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch {}

      if (this.keepAliveTimer) {
        clearInterval(this.keepAliveTimer);
        this.keepAliveTimer = null;
      }

      // Asynchronous dispatch prevents race condition in Chromium/WebKit engines
      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const targetLang = overrideLang || this.lang;
          const utterance = new SpeechSynthesisUtterance(text);

          // Retain global reference to prevent garbage collection mid-speech
          (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = utterance;

          // Re-check voices if not loaded yet
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const googleIdVoice = voices.find(v => {
              const n = (v.name || '').toLowerCase();
              const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
              return (n.includes('google') || n.includes('natural') || !v.localService) && (l.startsWith('id') || n.includes('indonesia'));
            });

            const anyIdVoice = voices.find(v => {
              const n = (v.name || '').toLowerCase();
              const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
              return l === 'id-id' && !n.includes('damayanti');
            });

            const fallbackIdVoice = voices.find(v => {
              const l = (v.lang || '').toLowerCase();
              const n = (v.name || '').toLowerCase();
              return l.startsWith('id') || n.includes('indonesia') || n.includes('damayanti');
            });

            const chosenVoice = googleIdVoice || anyIdVoice || fallbackIdVoice;
            if (chosenVoice) {
              utterance.voice = chosenVoice;
            }
          }

          // Strict BCP 47 language tag (NEVER use underscores)
          utterance.lang = targetLang === 'id' ? 'id-ID' : 'en-US';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;

          utterance.onstart = () => {
            this.notifySpeaking(true, text);
          };

          utterance.onend = () => {
            if (this.keepAliveTimer) {
              clearInterval(this.keepAliveTimer);
              this.keepAliveTimer = null;
            }
            this.notifySpeaking(false, '');
            if (onEnd) onEnd();
          };

          utterance.onerror = (err) => {
            console.warn('SpeechSynthesis error, trying fallback:', err);
            // If custom voice failed, retry with default system voice
            if (utterance.voice) {
              try {
                const fallbackUtterance = new SpeechSynthesisUtterance(text);
                (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = fallbackUtterance;
                fallbackUtterance.lang = targetLang === 'id' ? 'id-ID' : 'en-US';
                fallbackUtterance.rate = rate;
                fallbackUtterance.pitch = pitch;
                fallbackUtterance.onstart = () => this.notifySpeaking(true, text);
                fallbackUtterance.onend = () => {
                  this.notifySpeaking(false, '');
                  if (onEnd) onEnd();
                };
                fallbackUtterance.onerror = () => {
                  this.notifySpeaking(false, '');
                  if (onEnd) onEnd();
                };
                window.speechSynthesis.speak(fallbackUtterance);
                window.speechSynthesis.resume();
                return;
              } catch {}
            }

            if (this.keepAliveTimer) {
              clearInterval(this.keepAliveTimer);
              this.keepAliveTimer = null;
            }
            this.notifySpeaking(false, '');
            if (onEnd) onEnd();
          };

          // Chromium 15-second speech keep-alive
          this.keepAliveTimer = window.setInterval(() => {
            if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          }, 2000);

          window.speechSynthesis.speak(utterance);
          // Resume unfreezes Chrome audio pipeline on Mac
          window.speechSynthesis.resume();
        } catch (e) {
          console.warn('Speech dispatch failed:', e);
          this.notifySpeaking(false, '');
          if (onEnd) onEnd();
        }
      }, 40);
    } catch {
      this.notifySpeaking(false, '');
      if (onEnd) onEnd();
    }
  }

  public playCheer() {
    this.playFanfare();
    this.playPop(880);
  }

  public playRandomPraise() {
    const praises = [
      'Wah hebat sekali kamu!',
      'Pintar sekali calon astronot hebat!',
      'Luar biasa, jawabanmu tepat sekali!',
      'Keren banget, kamu makin pintar!'
    ];
    const picked = praises[Math.floor(Math.random() * praises.length)];
    this.speakKids(picked);
  }
}

export const spaceAudio = new SpaceSoundEngine();
