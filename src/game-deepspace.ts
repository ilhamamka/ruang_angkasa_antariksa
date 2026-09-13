// Interactive Deep Space Cosmos & Stellar Evolution Explorer
// Interactive Star Lifecycle Evolution & Black Hole Gravity Simulator

import { STELLAR_LIFECYCLE, COSMIC_ENTITIES, type StellarStage } from './cosmos-data.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';

export class DeepSpaceExplorer {
  private container: HTMLElement | null = null;
  private currentStageIndex: number = 0;
  private bhCanvas: HTMLCanvasElement | null = null;
  private bhCtx: CanvasRenderingContext2D | null = null;
  private bhAnimId: number | null = null;
  private particles: Array<{ x: number; y: number; vx: number; vy: number; color: string }> = [];

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
    this.initBlackHoleSimulation();
  }

  public unmount() {
    if (this.bhAnimId) {
      cancelAnimationFrame(this.bhAnimId);
      this.bhAnimId = null;
    }
  }

  private render() {
    if (!this.container) return;

    const currentStage = STELLAR_LIFECYCLE[this.currentStageIndex];

    this.container.innerHTML = `
      <div class="deepspace-view">
        <!-- Section 1: Stellar Lifecycle Explorer -->
        <div class="stellar-evolution-card">
          <div class="section-title-wrap">
            <span class="sparkle-icon">✨</span>
            <div>
              <h3>Siklus Hidup Bintang: Dari Debu Kosmik hingga Lubang Hitam</h3>
              <p>Bagaimana bintang lahir, bersinar selama miliaran tahun, dan meledak menjadi supernova?</p>
            </div>
          </div>

          <!-- Step Progression Bar -->
          <div class="stellar-stepper">
            ${STELLAR_LIFECYCLE.map((s, idx) => `
              <button class="step-node-btn ${idx === this.currentStageIndex ? 'active' : ''}" data-index="${idx}">
                <span class="step-num">${s.order}</span>
                <span class="step-name">${s.nameId.split(' ')[0]}</span>
              </button>
            `).join('')}
          </div>

          <!-- Current Stage Spotlight Display -->
          <div class="stellar-spotlight" style="background:${currentStage.colorScheme};">
            <div class="spotlight-visual">
              <div class="spotlight-svg-wrap">
                ${currentStage.svgIcon}
              </div>
            </div>
            <div class="spotlight-info">
              <span class="spotlight-duration">⏳ Durasi Fase: ${currentStage.duration}</span>
              <h2 class="spotlight-title">${currentStage.nameId}</h2>
              <span class="spotlight-temp">🌡️ Suhu: ${currentStage.temperatureKelvin}</span>
              <p class="spotlight-desc">${currentStage.descriptionId}</p>
              <div class="spotlight-phenomenon">
                <strong>🌟 Fenomena Kunci:</strong> ${currentStage.keyPhenomenonId}
              </div>
              <div class="spotlight-nav-actions">
                <button class="btn-step-nav" id="btn-prev-stage" ${this.currentStageIndex === 0 ? 'disabled' : ''}>◀ Tahap Sebelumnya</button>
                <button class="btn-step-nav" id="btn-next-stage" ${this.currentStageIndex === STELLAR_LIFECYCLE.length - 1 ? 'disabled' : ''}>Tahap Berikutnya ▶</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Interactive Black Hole Gravity Simulator -->
        <div class="blackhole-sim-card">
          <div class="bh-header">
            <div>
              <h3>🕳️ Laboratorium Gravitasi Lubang Hitam (Black Hole Simulator)</h3>
              <p>Klik atau sentuh kanvas untuk menembakkan partikel materi/cahaya ke arah Horison Peristiwa!</p>
            </div>
            <button class="btn-reset-particles" id="btn-reset-particles">Bidikan Ulang Partikel</button>
          </div>
          <div class="bh-canvas-wrapper">
            <canvas id="bh-canvas" width="800" height="340"></canvas>
            <div class="bh-overlay-legend">
              <span>🔵 Cakram Akresi</span>
              <span>🟣 Horison Peristiwa (Point of No Return)</span>
              <span>🟡 Partikel Terbelokkan Gravitasi</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Cosmic Entities & Galaxies Grid -->
        <div class="cosmic-entities-section">
          <h3>🌌 Galaksi & Keajaiban Langit Malam</h3>
          <div class="entities-grid">
            ${COSMIC_ENTITIES.map(e => `
              <div class="entity-card">
                <div class="entity-header">
                  <h4>${e.nameId}</h4>
                  <span class="entity-distance">${e.distanceFromEarth}</span>
                </div>
                <p class="entity-summary">${e.summaryId}</p>
                <div class="entity-funfact">
                  💡 <strong>Tahukah Kamu?</strong> ${e.funFactId}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.initBlackHoleSimulation();
  }

  private attachEvents() {
    if (!this.container) return;

    // Stepper buttons
    const steps = this.container.querySelectorAll('.step-node-btn');
    steps.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const idx = parseInt(target.getAttribute('data-index') || '0', 10);
        this.setStage(idx);
      });
    });

    const prevBtn = this.container.querySelector('#btn-prev-stage');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStageIndex > 0) {
          this.setStage(this.currentStageIndex - 1);
        }
      });
    }

    const nextBtn = this.container.querySelector('#btn-next-stage');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentStageIndex < STELLAR_LIFECYCLE.length - 1) {
          this.setStage(this.currentStageIndex + 1);
        }
      });
    }

    // Reset particles button
    const resetBtn = this.container.querySelector('#btn-reset-particles');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.spawnParticleStream();
        spaceAudio.playWarpWhoosh();
      });
    }
  }

  private setStage(index: number) {
    this.currentStageIndex = index;
    spaceAudio.playCelestialChime();
    if (index === STELLAR_LIFECYCLE.length - 1) {
      badgesManager.unlockBadge('star_watcher');
    }
    this.render();
  }

  private initBlackHoleSimulation() {
    if (!this.container) return;
    this.bhCanvas = this.container.querySelector('#bh-canvas') as HTMLCanvasElement;
    if (!this.bhCanvas) return;

    this.bhCtx = this.bhCanvas.getContext('2d');
    if (!this.bhCtx) return;

    this.spawnParticleStream();

    // Click on canvas to spawn more particles
    this.bhCanvas.addEventListener('click', (e) => {
      const rect = this.bhCanvas!.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (let i = 0; i < 15; i++) {
        this.particles.push({
          x: clickX + (Math.random() * 20 - 10),
          y: clickY + (Math.random() * 20 - 10),
          vx: (Math.random() * 4 - 2),
          vy: (Math.random() * 4 - 2),
          color: ['#00e5ff', '#ffea00', '#ff007f'][Math.floor(Math.random() * 3)]
        });
      }
      spaceAudio.playLaserPing();
    });

    const loop = () => {
      this.drawBlackHoleSimulation();
      this.bhAnimId = requestAnimationFrame(loop);
    };

    if (this.bhAnimId) cancelAnimationFrame(this.bhAnimId);
    this.bhAnimId = requestAnimationFrame(loop);
  }

  private spawnParticleStream() {
    this.particles = [];
    const width = 800;
    const height = 340;

    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * 150,
        y: Math.random() * height,
        vx: 2.2 + Math.random() * 2.0,
        vy: (Math.random() - 0.5) * 1.5,
        color: ['#00e5ff', '#ffd54f', '#ff4081', '#ffffff'][Math.floor(Math.random() * 4)]
      });
    }
  }

  private drawBlackHoleSimulation() {
    if (!this.bhCtx || !this.bhCanvas) return;
    const ctx = this.bhCtx;
    const width = this.bhCanvas.width;
    const height = this.bhCanvas.height;
    const bhX = width / 2;
    const bhY = height / 2;
    const eventHorizonRadius = 26;

    // Dark backdrop with motion blur fade
    ctx.fillStyle = 'rgba(6, 8, 20, 0.28)';
    ctx.fillRect(0, 0, width, height);

    // Accretion disk swirling aura
    const time = Date.now() * 0.002;
    const grad = ctx.createRadialGradient(bhX, bhY, eventHorizonRadius, bhX, bhY, 95);
    grad.addColorStop(0, '#ff9100');
    grad.addColorStop(0.35, '#d500f9');
    grad.addColorStop(0.8, '#00e5ff');
    grad.addColorStop(1, 'transparent');

    ctx.save();
    ctx.translate(bhX, bhY);
    ctx.rotate(time * 0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 95, 34, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // The Event Horizon (Pure Absolute Black Sphere)
    ctx.beginPath();
    ctx.arc(bhX, bhY, eventHorizonRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gravitational Photon Ring Glow
    ctx.beginPath();
    ctx.arc(bhX, bhY, eventHorizonRadius + 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 235, 59, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Update and draw test particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Gravity math: F = G * M / r^2
      const dx = bhX - p.x;
      const dy = bhY - p.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist < eventHorizonRadius) {
        // Swallowed by black hole!
        this.particles.splice(i, 1);
        // Respawn from left
        this.particles.push({
          x: Math.random() * 80,
          y: Math.random() * height,
          vx: 2.0 + Math.random() * 2.0,
          vy: (Math.random() - 0.5) * 1.5,
          color: ['#00e5ff', '#ffd54f', '#ff4081', '#ffffff'][Math.floor(Math.random() * 4)]
        });
        continue;
      }

      // Gravitational acceleration towards center
      const force = 900 / Math.max(distSq, 400);
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;

      p.x += p.vx;
      p.y += p.vy;

      // Draw particle trail
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wrap edges if escaped far
      if (p.x > width + 40 || p.y < -40 || p.y > height + 40) {
        p.x = 0;
        p.y = Math.random() * height;
        p.vx = 2.5;
        p.vy = (Math.random() - 0.5) * 1.2;
      }
    }
  }
}

export const deepSpaceExplorer = new DeepSpaceExplorer();
