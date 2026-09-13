// Interactive Rocket Engineering Lab & Launchpad Simulator
// Physics-based Modular Rocket Builder, Countdown, Atmospheric Ascension & Orbital Insertion

import { ROCKET_PARTS, type RocketPart, SPACE_MISSIONS } from './rockets-data.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';

export class RocketLabSimulator {
  private container: HTMLElement | null = null;
  private selectedCapsule: RocketPart = ROCKET_PARTS[0];
  private selectedUpper: RocketPart = ROCKET_PARTS[3];
  private selectedCore: RocketPart = ROCKET_PARTS[5];
  private selectedBooster: RocketPart = ROCKET_PARTS[7];
  private isLaunching: boolean = false;
  private launchInterval: number | null = null;

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public unmount() {
    if (this.launchInterval) {
      clearInterval(this.launchInterval);
      this.launchInterval = null;
    }
  }

  private calculatePhysics() {
    const totalMassKg = 
      this.selectedCapsule.weightKg + 
      this.selectedUpper.weightKg + 
      this.selectedCore.weightKg + 
      this.selectedBooster.weightKg;

    const totalThrustKn = 
      this.selectedCapsule.thrustKn + 
      this.selectedUpper.thrustKn + 
      this.selectedCore.thrustKn + 
      this.selectedBooster.thrustKn;

    // Weight force = mass * g (in kN) -> mass * 9.81 / 1000
    const weightKn = (totalMassKg * 9.81) / 1000;
    const twr = weightKn > 0 ? parseFloat((totalThrustKn / weightKn).toFixed(2)) : 0;
    const isReady = twr > 1.2;

    return { totalMassKg, totalThrustKn, twr, isReady };
  }

  private render() {
    if (!this.container) return;

    const { totalMassKg, totalThrustKn, twr, isReady } = this.calculatePhysics();

    this.container.innerHTML = `
      <div class="rocket-lab-grid">
        <!-- Left Panel: Assembly Stage Customizer -->
        <div class="assembly-panel">
          <div class="panel-header">
            <h3>🛠️ Bengkel Perakitan Roket</h3>
            <p>Pilih komponen untuk merakit roket antariksamu sendiri!</p>
          </div>

          <!-- Component Tabs -->
          <div class="part-selector-group">
            <div class="selector-category">
              <label>1. Kapsul / Muatan Puncak (Capsule):</label>
              <div class="part-options">
                ${ROCKET_PARTS.filter(p => p.category === 'capsule').map(p => `
                  <button class="part-select-btn ${p.id === this.selectedCapsule.id ? 'active' : ''}" data-category="capsule" data-id="${p.id}">
                    <span class="part-btn-name">${p.nameId}</span>
                    <span class="part-btn-weight">${(p.weightKg/1000).toFixed(1)} Ton</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="selector-category">
              <label>2. Tahap Kedua / Modul Layanan (Upper Stage):</label>
              <div class="part-options">
                ${ROCKET_PARTS.filter(p => p.category === 'upper_stage').map(p => `
                  <button class="part-select-btn ${p.id === this.selectedUpper.id ? 'active' : ''}" data-category="upper_stage" data-id="${p.id}">
                    <span class="part-btn-name">${p.nameId}</span>
                    <span class="part-btn-weight">${(p.weightKg/1000).toFixed(1)} Ton</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="selector-category">
              <label>3. Tangki Bahan Bakar Utama (Core Tank):</label>
              <div class="part-options">
                ${ROCKET_PARTS.filter(p => p.category === 'core_tank').map(p => `
                  <button class="part-select-btn ${p.id === this.selectedCore.id ? 'active' : ''}" data-category="core_tank" data-id="${p.id}">
                    <span class="part-btn-name">${p.nameId}</span>
                    <span class="part-btn-weight">${(p.weightKg/1000).toFixed(1)} Ton</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="selector-category">
              <label>4. Pendorong & Mesin Peluncur (Boosters):</label>
              <div class="part-options">
                ${ROCKET_PARTS.filter(p => p.category === 'booster').map(p => `
                  <button class="part-select-btn ${p.id === this.selectedBooster.id ? 'active' : ''}" data-category="booster" data-id="${p.id}">
                    <span class="part-btn-name">${p.nameId}</span>
                    <span class="part-btn-weight">${(p.weightKg/1000).toFixed(1)} Ton</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Rocket Diagnostics Telemetry -->
          <div class="telemetry-box">
            <h4>📊 Telemetri Fisika Roket:</h4>
            <div class="telemetry-grid">
              <div class="telemetry-item">
                <span class="label">Massa Total:</span>
                <span class="val">${(totalMassKg / 1000).toFixed(1)} Ton</span>
              </div>
              <div class="telemetry-item">
                <span class="label">Daya Dorong (Thrust):</span>
                <span class="val">${totalThrustKn} kN</span>
              </div>
              <div class="telemetry-item">
                <span class="label">Rasio Dorong/Beban (TWR):</span>
                <span class="val ${isReady ? 'text-green' : 'text-red'}">${twr} (Min: 1.2)</span>
              </div>
              <div class="telemetry-item">
                <span class="label">Status Siap Luncur:</span>
                <span class="val ${isReady ? 'text-green' : 'text-red'}">
                  ${isReady ? '✅ SIAP DILUNCURKAN' : '⚠️ DORONGAN KURANG'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Interactive Rocket Visual & Launchpad Viewport -->
        <div class="launchpad-panel">
          <div class="launchpad-viewport" id="launchpad-viewport">
            <div class="sky-background" id="sky-background">
              <div class="clouds-layer"></div>
              <div class="stars-layer"></div>
            </div>

            <!-- Altitude Marker Gauge -->
            <div class="altitude-gauge" id="altitude-gauge">
              <div class="altitude-marker" id="alt-marker-leo">🌌 400 km (Orbit Rendah)</div>
              <div class="altitude-marker" id="alt-marker-meso">☄️ 80 km (Mesosfer)</div>
              <div class="altitude-marker" id="alt-marker-strato">☁️ 25 km (Stratosfer)</div>
              <div class="altitude-marker" id="alt-marker-ground">🚀 0 km (Pangkalan Luncur)</div>
              <div class="altitude-indicator" id="altitude-indicator" style="bottom: 0%;"></div>
            </div>

            <!-- Assembled Rocket Graphic -->
            <div class="assembled-rocket-wrap" id="assembled-rocket">
              <svg viewBox="0 0 100 240" class="rocket-composite-svg" id="rocket-composite-svg">
                <!-- 1. Capsule at top (y: 10 to 60) -->
                <g transform="translate(0, 10)">
                  ${this.selectedCapsule.svgSnippet}
                </g>

                <!-- 2. Upper stage (y: 55 to 100) -->
                <g transform="translate(0, 55)">
                  ${this.selectedUpper.svgSnippet}
                </g>

                <!-- 3. Main core tank (y: 95 to 165) -->
                <g transform="translate(0, 95)">
                  ${this.selectedCore.svgSnippet}
                </g>

                <!-- 4. Boosters & Nozzles (y: 160 to 220) -->
                <g id="rocket-booster-stage" transform="translate(0, 160)">
                  ${this.selectedBooster.svgSnippet}
                </g>

                <!-- Engine Exhaust Fire Flames (Visible during launch) -->
                <g id="exhaust-flames" class="exhaust-flames" style="display:none;" transform="translate(0, 220)">
                  <polygon points="50,0 35,45 50,65 65,45" fill="#ff3d00" opacity="0.9">
                    <animate attributeName="points" dur="0.1s" repeatCount="indefinite"
                      values="50,0 35,45 50,65 65,45; 50,0 32,52 50,75 68,52; 50,0 37,42 50,60 63,42"/>
                  </polygon>
                  <polygon points="50,5 42,35 50,50 58,35" fill="#ffea00">
                    <animate attributeName="points" dur="0.08s" repeatCount="indefinite"
                      values="50,5 42,35 50,50 58,35; 50,5 40,40 50,56 60,40; 50,5 44,30 50,45 56,30"/>
                  </polygon>
                  <polygon points="50,8 46,25 50,35 54,25" fill="#ffffff"/>
                </g>
              </svg>
            </div>

            <!-- Launch Tower Structure -->
            <div class="launch-tower" id="launch-tower"></div>
          </div>

          <!-- Launch Control Center -->
          <div class="launch-control-bar">
            <div class="countdown-display" id="countdown-display">T-MINUS 10</div>
            <button class="btn-launch-rocket ${!isReady ? 'disabled' : ''}" id="btn-start-launch" ${!isReady ? 'disabled' : ''}>
              🚀 MULAI HITUNG MUNDUR & LUNCURKAN!
            </button>
          </div>
        </div>
      </div>

      <!-- Missions Showcase Strip at Bottom -->
      <div class="missions-strip">
        <h3>🏛️ Misi Penjelajahan Antariksa Bersejarah</h3>
        <div class="missions-carousel">
          ${SPACE_MISSIONS.map(m => `
            <div class="mission-mini-card">
              <div class="mission-card-top">
                <span class="mission-icon">${m.heroIcon}</span>
                <span class="mission-year">${m.year}</span>
              </div>
              <h4>${m.name}</h4>
              <p class="mission-agency">Lembaga: ${m.agency}</p>
              <p class="mission-sig">${m.significanceId}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    if (!this.container) return;

    // Component buttons
    const btns = this.container.querySelectorAll('.part-select-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isLaunching) return;
        const target = e.currentTarget as HTMLElement;
        const category = target.getAttribute('data-category');
        const id = target.getAttribute('data-id');

        const found = ROCKET_PARTS.find(p => p.id === id);
        if (!found) return;

        if (category === 'capsule') this.selectedCapsule = found;
        else if (category === 'upper_stage') this.selectedUpper = found;
        else if (category === 'core_tank') this.selectedCore = found;
        else if (category === 'booster') this.selectedBooster = found;

        spaceAudio.playSnap();
        this.render();
      });
    });

    // Launch button
    const launchBtn = this.container.querySelector('#btn-start-launch');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        if (this.isLaunching) return;
        this.startCountdownSequence();
      });
    }
  }

  private startCountdownSequence() {
    this.isLaunching = true;
    const countdownEl = this.container?.querySelector('#countdown-display') as HTMLElement;
    const launchBtn = this.container?.querySelector('#btn-start-launch') as HTMLButtonElement;
    if (launchBtn) launchBtn.disabled = true;

    let count = 10;

    const tick = () => {
      if (!countdownEl) return;
      if (count > 0) {
        countdownEl.textContent = `T-MINUS ${count}`;
        countdownEl.classList.add('pulse');
        spaceAudio.playCountdownBeep(false);
        count--;
        setTimeout(tick, 950);
      } else {
        countdownEl.textContent = `🚀 LIFTOFF! MELUNCUR!`;
        spaceAudio.playCountdownBeep(true);
        spaceAudio.playRocketRumble(6.0);
        this.executeLaunchFlight();
      }
    };

    tick();
  }

  private executeLaunchFlight() {
    const rocketEl = this.container?.querySelector('#assembled-rocket') as HTMLElement;
    const flamesEl = this.container?.querySelector('#exhaust-flames') as HTMLElement;
    const indicatorEl = this.container?.querySelector('#altitude-indicator') as HTMLElement;
    const skyEl = this.container?.querySelector('#sky-background') as HTMLElement;

    if (flamesEl) flamesEl.style.display = 'block';

    let altitudePercent = 0;
    let separated = false;

    this.launchInterval = window.setInterval(() => {
      altitudePercent += 1.5;

      if (rocketEl) {
        // Rocket rises smoothly
        rocketEl.style.transform = `translateY(-${altitudePercent * 3.5}px)`;
      }

      if (indicatorEl) {
        indicatorEl.style.bottom = `${Math.min(altitudePercent, 100)}%`;
      }

      // Sky changes from blue to dark cosmic navy as altitude climbs!
      if (skyEl) {
        if (altitudePercent > 30 && altitudePercent <= 60) {
          skyEl.style.background = 'linear-gradient(to top, #1e3c72, #0a1128)';
        } else if (altitudePercent > 60) {
          skyEl.style.background = 'linear-gradient(to top, #060814, #000000)';
        }
      }

      // Stage Separation at 45%
      if (altitudePercent >= 45 && !separated) {
        separated = true;
        spaceAudio.playSnap();
        const boosterStage = this.container?.querySelector('#rocket-booster-stage') as HTMLElement;
        if (boosterStage) {
          boosterStage.classList.add('booster-separated');
        }
      }

      // Reached Orbit (100%)
      if (altitudePercent >= 100) {
        if (this.launchInterval) {
          clearInterval(this.launchInterval);
          this.launchInterval = null;
        }

        if (flamesEl) flamesEl.style.display = 'none';
        spaceAudio.playFanfare();
        badgesManager.recordRocketLaunch();

        this.showOrbitCelebration();
      }
    }, 80);
  }

  private showOrbitCelebration() {
    const countdownEl = this.container?.querySelector('#countdown-display') as HTMLElement;
    if (countdownEl) {
      countdownEl.textContent = `🛰️ SUKSES MENCAPAI ORBIT BUMI!`;
      countdownEl.style.color = '#00e5ff';
    }

    // Modal celebration
    let modal = document.getElementById('launch-success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'launch-success-modal';
      modal.className = 'cosmic-modal-overlay active';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="cosmic-modal-card celebration-card">
        <div class="celebration-header">
          <span class="celebration-star">🌟</span>
          <h2>MISI PELUNCURAN BERHASIL!</h2>
          <p>Roket rancanganmu berhasil menembus atmosfer dan mengorbit di ketinggian 400 km!</p>
        </div>
        <div class="celebration-badge-showcase">
          <div class="unlocked-badge-preview">
            <span class="badge-emoji-big">🛠️</span>
            <h4>Lencana Terbuka: Insinyur Roket Handal!</h4>
            <p>+200 XP Kosmik & ⭐ 2 Bintang diperoleh!</p>
          </div>
        </div>
        <div class="celebration-actions">
          <button class="btn-primary-glow" id="btn-close-celebration">Kembali ke Bengkel</button>
        </div>
      </div>
    `;

    const closeBtn = modal.querySelector('#btn-close-celebration');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal!.classList.remove('active');
        this.isLaunching = false;
        this.render();
      });
    }
  }
}

export const rocketLab = new RocketLabSimulator();
