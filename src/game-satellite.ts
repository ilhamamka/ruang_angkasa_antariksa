// Junior Space Technician: Indonesian Satellite Savior & Orbital Debris Cleaner
// Pedagogical Focus: Space Sustainability, Satellite Technology, and Indonesian Archipelago Communications

import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';
import { confetti } from './confetti.ts';

interface Debris {
  id: number;
  name: string;
  icon: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  cleaned: boolean;
}

interface WirePin {
  id: string;
  name: string;
  color: string;
  connected: boolean;
}

export class SatelliteMissionManager {
  private container: HTMLElement | null = null;
  private currentPhase: 1 | 2 | 3 | 4 = 1;
  private isMounted = false;

  // Phase 1: Debris
  private debrisList: Debris[] = [];
  private animFrameId: number | null = null;

  // Phase 2: Wiring
  private wires: WirePin[] = [
    { id: 'red', name: 'Kabel Daya Panel Surya (+12V)', color: '#ff3366', connected: false },
    { id: 'blue', name: 'Kabel Kendali Orbit Stabiliser (GND)', color: '#00d2ff', connected: false },
    { id: 'yellow', name: 'Kabel Baterai Cadangan Seluler (BAT)', color: '#ffd700', connected: false }
  ];

  // Phase 3: Antenna Alignment
  private currentAngle = 45;
  private targetAngle = 180;
  private isAligned = false;

  public mount(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.isMounted = true;
    this.initDebris();
    this.render();
    this.speakIntro();
  }

  public unmount() {
    this.isMounted = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private speakIntro() {
    spaceAudio.playRadioChirp();
    setTimeout(() => {
      spaceAudio.speakKids(
        'Panggilan darurat Stasiun Bumi! Satelit komunikasi Nusantara kita terkena serpihan sampah antariksa. Ayo bantu bersihkan dan nyalakan kembali sinyalnya!'
      );
    }, 400);
  }

  private initDebris() {
    this.debrisList = [
      { id: 1, name: 'Baut Roket Tua', icon: '🔩', x: 80, y: 110, vx: 0.4, vy: 0.2, cleaned: false },
      { id: 2, name: 'Pecahan Panel Surya Mati', icon: '🪨', x: 380, y: 90, vx: -0.3, vy: 0.3, cleaned: false },
      { id: 3, name: 'Serpihan Logam Bekas', icon: '⚙️', x: 120, y: 260, vx: 0.3, vy: -0.2, cleaned: false },
      { id: 4, name: 'Baut Titan Pendorong', icon: '🔩', x: 420, y: 250, vx: -0.25, vy: -0.35, cleaned: false },
      { id: 5, name: 'Pecahan Pelindung Termal', icon: '🛰️', x: 260, y: 60, vx: 0.2, vy: 0.3, cleaned: false }
    ];
  }

  public render() {
    if (!this.container || !this.isMounted) return;

    this.container.innerHTML = `
      <div class="satellite-mission-card">
        <!-- Mission Header HUD -->
        <div class="mission-header-hud">
          <div class="mission-title-col">
            <span class="mission-badge-pill">🛰️ MISI TEKNISI ANTARIKSA CILIK INDONESIA</span>
            <h2 class="mission-title">Penyelamat Satelit Komunikasi Nusantara (SATRIA-1)</h2>
            <p class="mission-desc">
              Satelit ini memancarkan sinyal internet & pendidikan ke ribuan sekolah di pulau-pulau terluar Indonesia dari Sabang sampai Merauke!
            </p>
          </div>

          <!-- Step Progress Indicator -->
          <div class="mission-stepper">
            <div class="mission-step-dot ${this.currentPhase >= 1 ? 'active' : ''} ${this.currentPhase > 1 ? 'done' : ''}">
              <span>1</span>
              <label>Bersih Sampah</label>
            </div>
            <div class="mission-step-line ${this.currentPhase > 1 ? 'done' : ''}"></div>
            <div class="mission-step-dot ${this.currentPhase >= 2 ? 'active' : ''} ${this.currentPhase > 2 ? 'done' : ''}">
              <span>2</span>
              <label>Kabel Surya</label>
            </div>
            <div class="mission-step-line ${this.currentPhase > 2 ? 'done' : ''}"></div>
            <div class="mission-step-dot ${this.currentPhase >= 3 ? 'active' : ''} ${this.currentPhase > 3 ? 'done' : ''}">
              <span>3</span>
              <label>Arahkan Sinyal</label>
            </div>
          </div>
        </div>

        <!-- Interactive Phase Screen Container -->
        <div class="mission-stage-view" id="mission-stage-container">
          ${this.renderPhaseContent()}
        </div>

        <!-- Mission Walkie-Talkie Radio Comms Box -->
        <div class="mission-radio-box">
          <div class="radio-avatar-bubble">
            <span class="radio-icon">📻</span>
            <div class="radio-waves">
              <span class="r-wave"></span>
              <span class="r-wave"></span>
              <span class="r-wave"></span>
            </div>
          </div>
          <div class="radio-message-col">
            <span class="radio-sender-tag">TRANSMISI RADIO WALKIE-TALKIE KOSMIK</span>
            <p class="radio-dialog-text" id="satellite-radio-dialog">${this.getPhaseDialogText()}</p>
          </div>
          <button id="btn-replay-satellite-audio" class="btn-radio-listen" type="button" title="Dengarkan Ulang">
            <span>🔊 Dengarkan</span>
          </button>
        </div>
      </div>
    `;

    this.attachEvents();
    if (this.currentPhase === 1) {
      this.startDebrisLoop();
    }
  }

  private getPhaseDialogText(): string {
    switch (this.currentPhase) {
      case 1:
        return 'Kak Bintang: "Ada serpihan sampah roket tua yang mengapung mendekati panel surya satelit! Ketuk atau sentuh sampah antariksa untuk menyedotnya dengan pendorong magnetik!"';
      case 2:
        return 'Kak Bintang: "Hebat, orbit sudah bersih! Tapi baterai satelit lemah (30%). Ayo sambungkan 3 kabel daya surya ke terminal baterai agar terisi penuh 100%!"';
      case 3:
        return 'Kak Bintang: "Daya sudah 100%! Sekarang geser pemutar antena hingga menghadap tepat ke Kepulauan Indonesia agar sinyal sekolah di pulau-pulau kembali menyala!"';
      case 4:
        return 'Panggilan Radio SD Pulau Rote: "Horeee! Sinyal internet sekolah kami di NTT sudah menyala kembali! Terima kasih banyak Kakak Teknisi Cilik Hebat!"';
    }
  }

  private renderPhaseContent(): string {
    if (this.currentPhase === 1) {
      const cleanedCount = this.debrisList.filter(d => d.cleaned).length;
      const pct = Math.round((cleanedCount / this.debrisList.length) * 100);

      return `
        <div class="phase-debris-board">
          <div class="phase-instruction-bar">
            <span>🧹 Tahap 1: Tangkap 5 Sampah Antariksa di Sekitar Satelit</span>
            <span class="clean-pct-tag">Kebersihan Orbit: <strong>${pct}%</strong></span>
          </div>

          <div class="debris-space-arena" id="debris-arena">
            <!-- Earth Orbit Glow Background with Indonesia silhouette -->
            <div class="arena-earth-curvature">
              <div class="earth-archipelago-glow">🇮🇩 Kepulauan Indonesia di Bawah Orbit</div>
            </div>

            <!-- Central Satellite SATRIA-1 SVG -->
            <div class="orbiting-satellite-hub">
              <svg width="220" height="150" viewBox="0 0 220 150" class="sat-main-svg">
                <!-- Left Solar Panel -->
                <rect x="10" y="55" width="65" height="40" rx="3" fill="#1e3a8a" stroke="#00d2ff" stroke-width="2"/>
                <line x1="25" y1="55" x2="25" y2="95" stroke="#00d2ff" stroke-width="1"/>
                <line x1="45" y1="55" x2="45" y2="95" stroke="#00d2ff" stroke-width="1"/>
                <line x1="60" y1="55" x2="60" y2="95" stroke="#00d2ff" stroke-width="1"/>
                <!-- Connecting Truss -->
                <line x1="75" y1="75" x2="90" y2="75" stroke="#cbd5e1" stroke-width="4"/>
                
                <!-- Satellite Main Gold Foil Body -->
                <polygon points="90,50 130,50 140,75 130,100 90,100 80,75" fill="#f59e0b" stroke="#ffd700" stroke-width="2"/>
                <rect x="95" y="60" width="30" height="30" rx="3" fill="#b45309"/>
                <!-- Indonesian Flag on Body -->
                <rect x="103" y="66" width="14" height="4" fill="#ef4444"/>
                <rect x="103" y="70" width="14" height="4" fill="#ffffff"/>

                <!-- Connecting Truss Right -->
                <line x1="130" y1="75" x2="145" y2="75" stroke="#cbd5e1" stroke-width="4"/>
                <!-- Right Solar Panel -->
                <rect x="145" y="55" width="65" height="40" rx="3" fill="#1e3a8a" stroke="#00d2ff" stroke-width="2"/>
                <line x1="160" y1="55" x2="160" y2="95" stroke="#00d2ff" stroke-width="1"/>
                <line x1="180" y1="55" x2="180" y2="95" stroke="#00d2ff" stroke-width="1"/>
                <line x1="195" y1="55" x2="195" y2="95" stroke="#00d2ff" stroke-width="1"/>

                <!-- Parabolic Antenna Dish on Top -->
                <path d="M 85,42 Q 110,25 135,42" stroke="#ffffff" stroke-width="3" fill="none"/>
                <line x1="110" y1="33" x2="110" y2="50" stroke="#94a3b8" stroke-width="2"/>
                <circle cx="110" cy="22" r="4" fill="#00e5ff"/>
              </svg>
            </div>

            <!-- Floating Debris Elements -->
            ${this.debrisList.map(d => `
              <div 
                class="debris-item ${d.cleaned ? 'cleaned' : ''}" 
                id="debris-${d.id}"
                data-id="${d.id}"
                style="transform: translate(${d.x}px, ${d.y}px);"
                title="${d.name}"
              >
                <span class="debris-symbol">${d.icon}</span>
                <span class="debris-label">${d.name}</span>
                <span class="debris-sweep-hint">Sentuh Aku!</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.currentPhase === 2) {
      const connectedCount = this.wires.filter(w => w.connected).length;
      const batteryPct = 30 + (connectedCount * 23) + (connectedCount === 3 ? 1 : 0);

      return `
        <div class="phase-wiring-board">
          <div class="phase-instruction-bar">
            <span>⚡ Tahap 2: Sambungkan 3 Kabel Sirkuit Surya ke Terminal Baterai</span>
            <span class="clean-pct-tag">Baterai Satelit: <strong>${batteryPct}%</strong></span>
          </div>

          <div class="wiring-workbench">
            <!-- Solar Battery Terminal Box -->
            <div class="battery-terminal-col">
              <div class="battery-visual-gauge">
                <div class="battery-fill-level" style="height: ${batteryPct}%; background: ${batteryPct === 100 ? '#22c55e' : '#f59e0b'};"></div>
                <span class="battery-val-text">${batteryPct}%</span>
                <span class="battery-sub">Daya Baterai</span>
              </div>

              <div class="terminal-sockets">
                <div class="socket-item ${this.wires[0].connected ? 'connected' : ''}">
                  <span class="socket-indicator" style="background: ${this.wires[0].color};"></span>
                  <span class="socket-name">Terminal +12V Surya</span>
                </div>
                <div class="socket-item ${this.wires[1].connected ? 'connected' : ''}">
                  <span class="socket-indicator" style="background: ${this.wires[1].color};"></span>
                  <span class="socket-name">Terminal GND Stabiliser</span>
                </div>
                <div class="socket-item ${this.wires[2].connected ? 'connected' : ''}">
                  <span class="socket-indicator" style="background: ${this.wires[2].color};"></span>
                  <span class="socket-name">Terminal BAT Cadangan</span>
                </div>
              </div>
            </div>

            <!-- Wire Connection Cards -->
            <div class="wiring-switches-col">
              <p class="wiring-tip">Sentuh tombol kabel di bawah ini untuk menancapkan kabel ke soketnya:</p>
              ${this.wires.map(w => `
                <button 
                  class="btn-connect-wire ${w.connected ? 'connected' : ''}" 
                  type="button" 
                  data-wire-id="${w.id}"
                  style="border-left: 6px solid ${w.color};"
                >
                  <span class="wire-bullet" style="background: ${w.color};"></span>
                  <div class="wire-info">
                    <strong>${w.name}</strong>
                    <span class="wire-status-text">${w.connected ? '✅ Terpasang Rapi' : '⚠️ Terputus — Klik untuk Sambung'}</span>
                  </div>
                  <span class="wire-action-tag">${w.connected ? 'OK' : 'SAMBUNG'}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    if (this.currentPhase === 3) {
      return `
        <div class="phase-align-board">
          <div class="phase-instruction-bar">
            <span>📡 Tahap 3: Sejajarkan Piringan Antena ke Wilayah Indonesia</span>
            <span class="clean-pct-tag">Status: <strong>${this.isAligned ? '✅ Sinyal Terkunci!' : '⚠️ Mencari Sinyal'}</strong></span>
          </div>

          <div class="alignment-cockpit">
            <!-- Satellite Antenna Interactive Visual -->
            <div class="antenna-rotator-box">
              <div class="antenna-dish-pivot" style="transform: rotate(${this.currentAngle}deg);">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <path d="M 30,80 Q 80,20 130,80" stroke="#00e5ff" stroke-width="6" fill="none"/>
                  <line x1="80" y1="45" x2="80" y2="120" stroke="#ffffff" stroke-width="4"/>
                  <circle cx="80" cy="35" r="8" fill="#ffd700"/>
                  <!-- Radiation Beam Waves -->
                  <circle cx="80" cy="20" r="14" stroke="#22c55e" stroke-width="2" fill="none" opacity="0.6"/>
                  <circle cx="80" cy="10" r="22" stroke="#22c55e" stroke-width="2" fill="none" opacity="0.4"/>
                </svg>
              </div>
              <span class="dish-angle-label">Sudut Piringan: ${this.currentAngle}°</span>
            </div>

            <!-- Map Target of Indonesia with Islands -->
            <div class="indonesia-map-target">
              <div class="radar-scan-line"></div>
              <div class="map-island-pins ${this.isAligned ? 'signal-active' : ''}">
                <span class="island-pin p-sabang" title="Sabang, Aceh">📍 Sabang</span>
                <span class="island-pin p-jakarta" title="Jakarta, Jawa">📍 Jakarta</span>
                <span class="island-pin p-bali" title="Denpasar, Bali">📍 Bali</span>
                <span class="island-pin p-makassar" title="Makassar, Sulawesi">📍 Makassar</span>
                <span class="island-pin p-natuna" title="Kepulauan Natuna">📍 Natuna</span>
                <span class="island-pin p-rote" title="Pulau Rote, NTT">📍 P. Rote</span>
                <span class="island-pin p-merauke" title="Merauke, Papua">📍 Merauke</span>
              </div>
              <div class="beam-lock-reticle ${this.isAligned ? 'locked' : ''}">
                <span class="lock-indicator-text">${this.isAligned ? '🔒 KUNCI SINYAL: 100% KUAT' : '🎯 TARGET NUSANTARA (180°)'}</span>
              </div>
            </div>
          </div>

          <!-- Slider Controls -->
          <div class="antenna-controls-row">
            <label for="antenna-slider">Putar Antena ke Arah 180°:</label>
            <input 
              type="range" 
              id="antenna-slider" 
              min="0" 
              max="360" 
              value="${this.currentAngle}"
              class="range-antenna-slider"
            />
            <button id="btn-quick-align" class="btn-quick-lock" type="button">
              <span>🎯 Kunci Otomatis (180°)</span>
            </button>
          </div>
        </div>
      `;
    }

    // Phase 4: Mission Completed!
    return `
      <div class="phase-success-card">
        <div class="success-halo-icon">🛰️🇮🇩</div>
        <h3 class="success-headline">MISI SUKSES: Sinyal Nusantara Pulih 100%!</h3>
        <p class="success-desc">
          Kamu adalah <strong>Pahlawan Sinyal Nusantara</strong>! Berkat bantuanmu membersihkan sampah orbit, memperbaiki kabel surya, dan mengarahkan antena, ribuan sekolah di pulau terluar Indonesia kini terhubung internet kembali!
        </p>

        <div class="reward-box-row">
          <div class="reward-item">
            <span class="reward-icon">🎖️</span>
            <div>
              <strong>Lencana Baru Terbuka</strong>
              <small>Pahlawan Sinyal Nusantara</small>
            </div>
          </div>
          <div class="reward-item">
            <span class="reward-icon">⭐</span>
            <div>
              <strong>+250 XP Kadet</strong>
              <small>Bonus Misi Teknisi</small>
            </div>
          </div>
        </div>

        <div class="success-action-btns">
          <button id="btn-replay-mission" class="btn-action-replay" type="button">
            <span>🔄 Mainkan Ulang Misi</span>
          </button>
          <button id="btn-goto-badges" class="btn-action-badges" type="button">
            <span>🎖️ Lihat Lencana Saya</span>
          </button>
        </div>
      </div>
    `;
  }

  private startDebrisLoop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const step = () => {
      if (!this.isMounted || this.currentPhase !== 1) return;

      const arena = document.getElementById('debris-arena');
      const boundsWidth = arena ? arena.clientWidth : 500;
      const boundsHeight = arena ? arena.clientHeight : 320;

      this.debrisList.forEach(d => {
        if (d.cleaned) return;

        d.x += d.vx;
        d.y += d.vy;

        // Bounce within arena bounds
        if (d.x <= 20 || d.x >= boundsWidth - 80) d.vx *= -1;
        if (d.y <= 20 || d.y >= boundsHeight - 60) d.vy *= -1;

        const el = document.getElementById(`debris-${d.id}`);
        if (el) {
          el.style.transform = `translate(${d.x}px, ${d.y}px)`;
        }
      });

      this.animFrameId = requestAnimationFrame(step);
    };

    this.animFrameId = requestAnimationFrame(step);
  }

  private attachEvents() {
    // Phase 1 Debris Click Events
    if (this.currentPhase === 1) {
      const arena = document.getElementById('debris-arena');
      if (arena) {
        arena.querySelectorAll('.debris-item').forEach(el => {
          el.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const id = Number(target.getAttribute('data-id'));
            this.cleanDebrisItem(id);
          });
        });
      }
    }

    // Phase 2 Wiring Click Events
    if (this.currentPhase === 2) {
      const container = document.getElementById('mission-stage-container');
      if (container) {
        container.querySelectorAll('.btn-connect-wire').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const wireId = target.getAttribute('data-wire-id');
            if (wireId) this.connectWire(wireId);
          });
        });
      }
    }

    // Phase 3 Alignment Slider Events
    if (this.currentPhase === 3) {
      const slider = document.getElementById('antenna-slider') as HTMLInputElement | null;
      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = Number((e.target as HTMLInputElement).value);
          this.setAntennaAngle(val);
        });
      }

      const quickBtn = document.getElementById('btn-quick-align');
      if (quickBtn) {
        quickBtn.addEventListener('click', () => {
          this.setAntennaAngle(180);
        });
      }
    }

    // Phase 4 Replay & Badges Buttons
    if (this.currentPhase === 4) {
      const replayBtn = document.getElementById('btn-replay-mission');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.currentPhase = 1;
          this.initDebris();
          this.wires.forEach(w => w.connected = false);
          this.currentAngle = 45;
          this.isAligned = false;
          this.render();
          this.speakIntro();
        });
      }

      const badgesBtn = document.getElementById('btn-goto-badges');
      if (badgesBtn) {
        badgesBtn.addEventListener('click', () => {
          const navBadges = document.getElementById('btn-nav-badges');
          if (navBadges) navBadges.click();
        });
      }
    }

    // Audio Replay Button
    const audioBtn = document.getElementById('btn-replay-satellite-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        spaceAudio.playRadioChirp();
        setTimeout(() => {
          spaceAudio.speakKids(this.getAudioSpeechText());
        }, 300);
      });
    }
  }

  private cleanDebrisItem(id: number) {
    const item = this.debrisList.find(d => d.id === id);
    if (!item || item.cleaned) return;

    item.cleaned = true;
    spaceAudio.playLaserPing();

    const el = document.getElementById(`debris-${id}`);
    if (el) {
      el.classList.add('cleaned');
    }

    const uncleaned = this.debrisList.filter(d => !d.cleaned);
    if (uncleaned.length === 0) {
      // All cleaned!
      spaceAudio.playCelestialChime();
      confetti.fire(0.5, 0.4, 40);
      setTimeout(() => {
        this.currentPhase = 2;
        this.render();
        spaceAudio.playRadioChirp();
        setTimeout(() => {
          spaceAudio.speakKids('Hebat sekali! Orbit satelit sudah bersih dari sampah. Sekarang sambungkan kabel daya surya!');
        }, 350);
      }, 700);
    } else {
      // Update clean pct tag
      const pct = Math.round(((this.debrisList.length - uncleaned.length) / this.debrisList.length) * 100);
      const pctEl = document.querySelector('.clean-pct-tag strong');
      if (pctEl) pctEl.textContent = `${pct}%`;
    }
  }

  private connectWire(wireId: string) {
    const wire = this.wires.find(w => w.id === wireId);
    if (!wire || wire.connected) return;

    wire.connected = true;
    spaceAudio.playPowerHum();

    // Check all wires
    const unconnected = this.wires.filter(w => !w.connected);
    this.render();

    if (unconnected.length === 0) {
      // All wired!
      spaceAudio.playCelestialChime();
      confetti.fire(0.5, 0.4, 50);
      setTimeout(() => {
        this.currentPhase = 3;
        this.render();
        spaceAudio.playRadioChirp();
        setTimeout(() => {
          spaceAudio.speakKids('Baterai satelit sudah 100% penuh! Sekarang putar antena ke arah 180 derajat menghadap Indonesia!');
        }, 350);
      }, 750);
    }
  }

  private setAntennaAngle(angle: number) {
    this.currentAngle = angle;
    const dish = document.querySelector('.antenna-dish-pivot') as HTMLElement | null;
    if (dish) {
      dish.style.transform = `rotate(${angle}deg)`;
    }
    const angleLabel = document.querySelector('.dish-angle-label');
    if (angleLabel) {
      angleLabel.textContent = `Sudut Piringan: ${angle}°`;
    }

    // Check alignment threshold (between 175° and 185°)
    if (Math.abs(angle - this.targetAngle) <= 5) {
      if (!this.isAligned) {
        this.isAligned = true;
        spaceAudio.playSatelliteBeep();
        confetti.fire(0.5, 0.4, 70);
        badgesManager.unlockBadge('satellite_savior');
        badgesManager.addXp(250);

        setTimeout(() => {
          this.currentPhase = 4;
          this.render();
          spaceAudio.playFanfare();
          setTimeout(() => {
            spaceAudio.speakKids(
              'Luar biasa! Seluruh sinyal satelit SATRIA-1 Indonesia sudah aktif kembali. Dengarkan pesan gembira dari teman-teman kita di pulau terluar!'
            );
          }, 600);
        }, 1200);
      }
    }
  }

  private getAudioSpeechText(): string {
    switch (this.currentPhase) {
      case 1:
        return 'Panggilan darurat Stasiun Bumi! Ada serpihan sampah roket tua di sekitar satelit. Ayo bersihkan dengan menyentuh sampah antariksa!';
      case 2:
        return 'Orbit sudah bersih! Tapi baterai satelit lemah. Sambungkan tiga kabel daya surya ke terminal baterai agar terisi penuh 100 persen!';
      case 3:
        return 'Daya sudah 100 persen! Putar antena ke arah 180 derajat agar sinyal internet sekolah di pulau-pulau Nusantara menyala kembali!';
      case 4:
        return 'Misi berhasil! Panggilan dari SD Pulau Rote: Hore! Internet sekolah kami sudah menyala kembali. Terima kasih banyak Kakak Teknisi Cilik!';
    }
  }
}

export const satelliteMission = new SatelliteMissionManager();
