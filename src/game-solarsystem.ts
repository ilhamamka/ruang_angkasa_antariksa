// Interactive Solar System Explorer
// Dynamic 2D/3D-feel Orbital Simulation & Planet Inspection Cards

import { CELESTIAL_BODIES, type CelestialBody } from './planets-data.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';

export class SolarSystemExplorer {
  private container: HTMLElement | null = null;
  private currentPlanet: CelestialBody = CELESTIAL_BODIES[3]; // Earth default
  private orbitSpeed: number = 1.0;
  private isPaused: boolean = false;
  private animFrameId: number | null = null;
  private angles: { [key: string]: number } = {};

  constructor() {
    CELESTIAL_BODIES.forEach((body, idx) => {
      this.angles[body.id] = (idx * 360) / CELESTIAL_BODIES.length;
    });
  }

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
    this.startAnimation();
  }

  public unmount() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public setSpeed(multiplier: number) {
    this.orbitSpeed = multiplier;
    this.isPaused = multiplier === 0;
  }

  private startAnimation() {
    const orbitalRates: { [key: string]: number } = {
      mercury: 2.2,
      venus: 1.5,
      earth: 1.0,
      mars: 0.75,
      asteroids: 0.5,
      jupiter: 0.35,
      saturn: 0.25,
      uranus: 0.18,
      neptune: 0.12,
      pluto: 0.08
    };

    const loop = () => {
      if (!this.isPaused) {
        for (const id in this.angles) {
          const rate = (orbitalRates[id] || 0.5) * this.orbitSpeed * 0.4;
          this.angles[id] = (this.angles[id] + rate) % 360;
          const node = document.getElementById(`orbit-node-${id}`);
          if (node) {
            const rad = (this.angles[id] * Math.PI) / 180;
            const rx = parseFloat(node.getAttribute('data-rx') || '100');
            const ry = parseFloat(node.getAttribute('data-ry') || '60');
            const cx = 450 + rx * Math.cos(rad);
            const cy = 300 + ry * Math.sin(rad);
            node.setAttribute('transform', `translate(${cx}, ${cy})`);
          }
        }
      }
      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public selectPlanet(planetId: string) {
    const found = CELESTIAL_BODIES.find(p => p.id === planetId);
    if (found) {
      this.currentPlanet = found;
      spaceAudio.playCelestialChime();
      badgesManager.recordPlanetVisit(found.id);
      this.renderDetailModal(found);
    }
  }

  private render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="solar-system-view">
        <!-- Control Bar -->
        <div class="space-toolbar">
          <div class="toolbar-title">
            <span class="pulse-dot"></span>
            <h3>Peta Orbit Tata Surya</h3>
          </div>
          <div class="toolbar-actions">
            <button class="orbit-speed-btn" data-speed="0">⏸ Jeda</button>
            <button class="orbit-speed-btn active" data-speed="1">1x Normal</button>
            <button class="orbit-speed-btn" data-speed="2.5">2.5x Cepat</button>
            <button class="orbit-speed-btn" data-speed="6">6x Kilat</button>
          </div>
        </div>

        <!-- Interactive SVG Orrery Canvas -->
        <div class="orrery-wrapper">
          <svg id="orrery-svg" viewBox="0 0 900 600" class="orrery-svg">
            <defs>
              <radialGradient id="spaceSunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fff9c4" />
                <stop offset="35%" stop-color="#ffb300" />
                <stop offset="85%" stop-color="#ff6f00" />
                <stop offset="100%" stop-color="#ff3d00" opacity="0" />
              </radialGradient>
              <filter id="glowEffect">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Background starry grid lines -->
            <ellipse cx="450" cy="300" rx="420" ry="250" stroke="#2a3b5c" stroke-width="0.8" fill="none" opacity="0.2"/>
            <ellipse cx="450" cy="300" rx="360" ry="215" stroke="#2a3b5c" stroke-width="0.8" fill="none" opacity="0.2"/>

            <!-- Planet Orbit Tracks -->
            ${this.renderOrbitTracks()}

            <!-- Center Sun -->
            <g class="sun-center" id="sun-clickable" style="cursor: pointer;">
              <circle cx="450" cy="300" r="42" fill="url(#spaceSunGlow)" filter="url(#glowEffect)"/>
              <circle cx="450" cy="300" r="24" fill="#ffd54f"/>
              <text x="450" y="305" font-size="11" font-weight="900" fill="#bf360c" text-anchor="middle">MATAHARI</text>
            </g>

            <!-- Moving Planet Nodes -->
            ${this.renderPlanetNodes()}
          </svg>
        </div>

        <!-- Quick Planet Carousel Selector Bar at Bottom -->
        <div class="planet-carousel-pills" id="planet-quick-pills">
          ${CELESTIAL_BODIES.map(p => `
            <button class="planet-pill-btn ${p.id === this.currentPlanet.id ? 'active' : ''}" data-planet-id="${p.id}">
              <span class="pill-dot" style="background:${p.primaryColor};"></span>
              <span class="pill-name">${p.nameId}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderOrbitTracks(): string {
    const radii: { [key: string]: [number, number] } = {
      mercury: [70, 42],
      venus: [110, 66],
      earth: [155, 93],
      mars: [200, 120],
      asteroids: [240, 144],
      jupiter: [290, 174],
      saturn: [340, 204],
      uranus: [385, 231],
      neptune: [425, 255],
      pluto: [455, 273]
    };

    let markup = '';
    for (const id in radii) {
      const [rx, ry] = radii[id];
      const isAsteroid = id === 'asteroids';
      markup += `
        <ellipse cx="450" cy="300" rx="${rx}" ry="${ry}" 
          class="orbit-line ${isAsteroid ? 'orbit-asteroid-track' : ''}" 
          stroke="${isAsteroid ? '#8d6e63' : '#3949ab'}" 
          stroke-width="${isAsteroid ? '2.5' : '1.2'}" 
          stroke-dasharray="${isAsteroid ? '4,6' : '3,3'}" 
          fill="none" opacity="${isAsteroid ? '0.6' : '0.4'}"/>
      `;
    }
    return markup;
  }

  private renderPlanetNodes(): string {
    const radii: { [key: string]: [number, number, number, string] } = {
      mercury: [70, 42, 6, '#b0bec5'],
      venus: [110, 66, 9, '#ffb74d'],
      earth: [155, 93, 10, '#00e5ff'],
      mars: [200, 120, 7.5, '#ff5722'],
      asteroids: [240, 144, 5, '#8d6e63'],
      jupiter: [290, 174, 18, '#ff9800'],
      saturn: [340, 204, 15, '#ffd54f'],
      uranus: [385, 231, 12, '#4dd0e1'],
      neptune: [425, 255, 11, '#3f51b5'],
      pluto: [455, 273, 5, '#bcaaa4']
    };

    let markup = '';
    for (const id in radii) {
      const [rx, ry, r, col] = radii[id];
      const planet = CELESTIAL_BODIES.find(p => p.id === id);
      markup += `
        <g id="orbit-node-${id}" class="planet-orbit-node" data-rx="${rx}" data-ry="${ry}" data-planet-id="${id}" style="cursor:pointer;">
          <circle cx="0" cy="0" r="${r + 4}" fill="${col}" opacity="0.2"/>
          <circle cx="0" cy="0" r="${r}" fill="${col}" stroke="#ffffff" stroke-width="1.2"/>
          <text x="0" y="${r + 14}" font-size="9.5" font-weight="700" fill="#e0e0e0" text-anchor="middle">${planet?.nameId || id}</text>
        </g>
      `;
    }
    return markup;
  }

  private attachEventListeners() {
    if (!this.container) return;

    // Speed buttons
    const speedBtns = this.container.querySelectorAll('.orbit-speed-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const spd = parseFloat(target.getAttribute('data-speed') || '1');
        speedBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        this.setSpeed(spd);
        spaceAudio.playPop(520);
      });
    });

    // Planet nodes click in SVG
    const nodes = this.container.querySelectorAll('.planet-orbit-node');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const pId = node.getAttribute('data-planet-id');
        if (pId) this.selectPlanet(pId);
      });
    });

    // Sun center click
    const sunEl = this.container.querySelector('#sun-clickable');
    if (sunEl) {
      sunEl.addEventListener('click', () => {
        this.selectPlanet('sun');
      });
    }

    // Quick carousel pills
    const pills = this.container.querySelectorAll('.planet-pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const pId = pill.getAttribute('data-planet-id');
        if (pId) this.selectPlanet(pId);
      });
    });
  }

  public renderDetailModal(planet: CelestialBody) {
    let modal = document.getElementById('planet-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'planet-modal';
      modal.className = 'cosmic-modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="cosmic-modal-card">
        <div class="modal-header">
          <div class="header-left">
            <span class="category-badge" style="background:${planet.primaryColor}22; color:${planet.primaryColor}; border:1px solid ${planet.primaryColor};">
              ${planet.categoryLabelId}
            </span>
            <h2>${planet.nameId} <small>(${planet.nameEn})</small></h2>
          </div>
          <button class="modal-close-btn" id="btn-close-planet-modal">✕</button>
        </div>

        <div class="modal-body">
          <div class="planet-showcase">
            <div class="planet-svg-container">
              ${planet.svgVisual}
            </div>
            <button class="btn-voice-speech" id="btn-planet-speech" type="button">
              🔊 Dengarkan Suara Fakta
            </button>
          </div>

          <div class="planet-info-column">
            <p class="planet-summary">${planet.summaryId}</p>

            <!-- Stats Grid -->
            <div class="planet-stats-grid">
              <div class="stat-box">
                <span class="stat-label">Diameter</span>
                <span class="stat-value">${planet.diameterKm.toLocaleString('id-ID')} km</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Jarak dr Matahari</span>
                <span class="stat-value">${planet.distanceFromSunAu} AU (${planet.distanceFromSunKmMillion} Juta km)</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">1 Hari (Rotasi)</span>
                <span class="stat-value">${planet.rotationPeriod}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">1 Tahun (Revolusi)</span>
                <span class="stat-value">${planet.orbitalPeriod}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Gravitasi</span>
                <span class="stat-value">${planet.gravityRatio}x Gravitasi Bumi</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Suhu Rata-rata</span>
                <span class="stat-value">${planet.avgTempCelsius}°C</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Satelit Alami</span>
                <span class="stat-value">${planet.moonsCount} Bulan</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Atmosfer</span>
                <span class="stat-value text-xs">${planet.atmosphere}</span>
              </div>
            </div>

            <!-- Fun Facts Section -->
            <div class="fun-facts-section">
              <h4>✨ Fakta Menakjubkan:</h4>
              <ul>
                ${planet.funFactsId.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            <!-- Missions section -->
            <div class="missions-section">
              <h4>🛰️ Misi & Wahana Terkenal:</h4>
              <div class="mission-tags">
                ${planet.missions.map(m => `<span class="mission-tag">${m}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    // Speech audio button
    const speechBtn = modal.querySelector('#btn-planet-speech');
    if (speechBtn) {
      speechBtn.addEventListener('click', () => {
        spaceAudio.speak(planet.audioSpeechId);
      });
    }

    // Close button
    const closeBtn = modal.querySelector('#btn-close-planet-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal!.classList.remove('active');
        spaceAudio.playPop(350);
      });
    }

    // Backdrop click close
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal!.classList.remove('active');
      }
    };
  }
}

export const solarExplorer = new SolarSystemExplorer();
