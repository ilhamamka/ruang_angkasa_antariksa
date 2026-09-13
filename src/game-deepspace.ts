// Commercial-Grade 3D Deep Space & Black Hole Accretion Simulator (Three.js)
// Featuring 3D Relativistic Particle Accretion Disk, Event Horizon & Stellar Evolution Journey

import * as THREE from 'three';
import { STELLAR_LIFECYCLE, COSMIC_ENTITIES, type StellarStage } from './cosmos-data.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';

export class DeepSpaceExplorer {
  private container: HTMLElement | null = null;
  private canvasMount: HTMLElement | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animId: number | null = null;

  // Black hole objects
  private eventHorizonMesh: THREE.Mesh | null = null;
  private accretionParticles: THREE.Points | null = null;
  private particlePositions: Float32Array | null = null;
  private particleVelocities: Float32Array | null = null;
  private jetBeams: THREE.LineSegments | null = null;

  private currentStageIndex: number = 0;

  public mount(container: HTMLElement) {
    this.container = container;
    this.renderUI();
    this.init3DBlackHole();
  }

  public unmount() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
  }

  private renderUI() {
    if (!this.container) return;
    const currentStage = STELLAR_LIFECYCLE[this.currentStageIndex];

    this.container.innerHTML = `
      <div class="deepspace-3d-view">
        <!-- Section 1: Stellar Lifecycle Stepper -->
        <div class="stellar-evolution-card">
          <div class="section-title-wrap">
            <span class="sparkle-icon">✨</span>
            <div>
              <h3>Siklus Hidup Bintang: Dari Debu Kosmik hingga Lubang Hitam</h3>
              <p>Pelajari 6 tahapan evolusi bintang dari nebula pembibitan hingga keruntuhan gravitasi terdahsyat.</p>
            </div>
          </div>

          <!-- Stepper Buttons -->
          <div class="stellar-stepper">
            ${STELLAR_LIFECYCLE.map((s, idx) => `
              <button class="step-node-btn ${idx === this.currentStageIndex ? 'active' : ''}" data-idx="${idx}">
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
              <span class="spotlight-temp">🌡️ Suhu Inti: ${currentStage.temperatureKelvin}</span>
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

        <!-- Section 2: 3D Black Hole Accretion Disk Simulation -->
        <div class="blackhole-3d-card">
          <div class="bh-3d-header">
            <div>
              <h3>🕳️ Simulator Gravitasi 3D Lubang Hitam (Sagittarius A*)</h3>
              <p>10.000 partikel materi berputar pada kecepatan mendekati cahaya. Klik di kanvas 3D untuk menyuntikkan aliran materi baru!</p>
            </div>
            <button class="btn-inject-matter" id="btn-inject-matter">
              ⚡ Suntikkan Badai Partikel Baru
            </button>
          </div>

          <!-- 3D Canvas Mount -->
          <div class="bh-canvas-3d-mount" id="bh-3d-mount"></div>

          <div class="bh-telemetry-strip">
            <span>⚫ Horison Peristiwa (Point of No Return): <strong>R = 25.000 km</strong></span>
            <span>⚡ Kecepatan Orbit Partikel: <strong>0.82c (82% Kecepatan Cahaya)</strong></span>
            <span>🌌 Efek: <strong>Pelengkungan Gravitasi (Lensing)</strong></span>
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

    this.attachUIEvents();
  }

  private init3DBlackHole() {
    this.canvasMount = document.getElementById('bh-3d-mount');
    if (!this.canvasMount) return;

    const width = this.canvasMount.clientWidth || 800;
    const height = 440;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020308);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 3000);
    this.camera.position.set(0, 35, 95);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvasMount.appendChild(this.renderer.domElement);

    // 4. Absolute Black Event Horizon Sphere
    const horizonGeo = new THREE.SphereGeometry(8, 48, 48);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.eventHorizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    this.scene.add(this.eventHorizonMesh);

    // Gravitational Photon Sphere Ring Glow
    const photonRingGeo = new THREE.RingGeometry(8.2, 9.8, 64);
    photonRingGeo.rotateX(Math.PI / 2);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    this.scene.add(photonRing);

    // 5. Build 3D Relativistic Accretion Disk Particles
    this.buildAccretionDisk();

    // 6. Polar Relativistic Jets
    this.buildPolarJets();

    // 7. Click to inject matter
    this.renderer.domElement.addEventListener('click', () => {
      this.injectMatterParticles();
      spaceAudio.playLaserPing();
    });

    // 8. Animation Loop
    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      this.updateAccretionPhysics();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  private buildAccretionDisk() {
    if (!this.scene) return;

    const count = 10000;
    const geo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.pow(Math.random(), 1.5) * 55;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * (radius * 0.12);

      this.particlePositions[i * 3] = Math.cos(angle) * radius;
      this.particlePositions[i * 3 + 1] = height;
      this.particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      // Tangential orbital velocity (faster closer to the event horizon)
      const v = Math.sqrt(280 / radius);
      this.particleVelocities[i * 3] = -Math.sin(angle) * v;
      this.particleVelocities[i * 3 + 1] = 0;
      this.particleVelocities[i * 3 + 2] = Math.cos(angle) * v;

      // Color shift: inner hot cyan/white -> middle gold -> outer magenta/red
      const t = (radius - 10) / 55;
      if (t < 0.25) {
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0;
      } else if (t < 0.65) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 0.2;
      } else {
        colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.15; colors[i * 3 + 2] = 0.65;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.accretionParticles = new THREE.Points(geo, mat);
    this.scene.add(this.accretionParticles);
  }

  private buildPolarJets() {
    if (!this.scene) return;

    const jetPoints: THREE.Vector3[] = [];
    for (let j = 0; j < 40; j++) {
      const angle = (j / 40) * Math.PI * 2;
      const spread = 2.5;

      // North Jet
      jetPoints.push(new THREE.Vector3(0, 8, 0));
      jetPoints.push(new THREE.Vector3(Math.cos(angle) * spread, 65, Math.sin(angle) * spread));

      // South Jet
      jetPoints.push(new THREE.Vector3(0, -8, 0));
      jetPoints.push(new THREE.Vector3(Math.cos(angle) * spread, -65, Math.sin(angle) * spread));
    }

    const jetGeo = new THREE.BufferGeometry().setFromPoints(jetPoints);
    const jetMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.65
    });

    this.jetBeams = new THREE.LineSegments(jetGeo, jetMat);
    this.scene.add(this.jetBeams);
  }

  private injectMatterParticles() {
    if (!this.particlePositions || !this.particleVelocities) return;
    const count = this.particlePositions.length / 3;

    // Respawn 800 particles from the outer boundary
    for (let i = 0; i < 800; i++) {
      const idx = Math.floor(Math.random() * count);
      const radius = 55 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;

      this.particlePositions[idx * 3] = Math.cos(angle) * radius;
      this.particlePositions[idx * 3 + 1] = (Math.random() - 0.5) * 6;
      this.particlePositions[idx * 3 + 2] = Math.sin(angle) * radius;

      const v = Math.sqrt(280 / radius);
      this.particleVelocities[idx * 3] = -Math.sin(angle) * v;
      this.particleVelocities[idx * 3 + 1] = 0;
      this.particleVelocities[idx * 3 + 2] = Math.cos(angle) * v;
    }
  }

  private updateAccretionPhysics() {
    if (!this.particlePositions || !this.particleVelocities || !this.accretionParticles) return;

    const count = this.particlePositions.length / 3;
    const G = 240;

    for (let i = 0; i < count; i++) {
      const px = this.particlePositions[i * 3];
      const py = this.particlePositions[i * 3 + 1];
      const pz = this.particlePositions[i * 3 + 2];

      const distSq = px * px + py * py + pz * pz;
      const dist = Math.sqrt(distSq);

      // Swallowed by event horizon
      if (dist < 8.0) {
        // Respawn on outer rim
        const newR = 55 + Math.random() * 15;
        const newA = Math.random() * Math.PI * 2;
        this.particlePositions[i * 3] = Math.cos(newA) * newR;
        this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        this.particlePositions[i * 3 + 2] = Math.sin(newA) * newR;

        const v = Math.sqrt(G / newR);
        this.particleVelocities[i * 3] = -Math.sin(newA) * v;
        this.particleVelocities[i * 3 + 1] = 0;
        this.particleVelocities[i * 3 + 2] = Math.cos(newA) * v;
        continue;
      }

      // Gravitational pull toward singularity (0, 0, 0)
      const force = G / Math.max(distSq, 100);
      this.particleVelocities[i * 3] -= (px / dist) * force * 0.04;
      this.particleVelocities[i * 3 + 1] -= (py / dist) * force * 0.08; // flatten into disk
      this.particleVelocities[i * 3 + 2] -= (pz / dist) * force * 0.04;

      // Update position
      this.particlePositions[i * 3] += this.particleVelocities[i * 3] * 0.28;
      this.particlePositions[i * 3 + 1] += this.particleVelocities[i * 3 + 1] * 0.28;
      this.particlePositions[i * 3 + 2] += this.particleVelocities[i * 3 + 2] * 0.28;
    }

    this.accretionParticles.geometry.attributes.position.needsUpdate = true;

    // Rotate camera smoothly around black hole
    if (this.camera) {
      const time = Date.now() * 0.0003;
      this.camera.position.x = Math.sin(time) * 95;
      this.camera.position.z = Math.cos(time) * 95;
      this.camera.lookAt(0, 0, 0);
    }
  }

  private attachUIEvents() {
    if (!this.container) return;

    // Stepper buttons
    const steps = this.container.querySelectorAll('.step-node-btn');
    steps.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-idx') || '0', 10);
        this.setStage(idx);
      });
    });

    const prevBtn = this.container.querySelector('#btn-prev-stage');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStageIndex > 0) this.setStage(this.currentStageIndex - 1);
      });
    }

    const nextBtn = this.container.querySelector('#btn-next-stage');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentStageIndex < STELLAR_LIFECYCLE.length - 1) this.setStage(this.currentStageIndex + 1);
      });
    }

    const injectBtn = this.container.querySelector('#btn-inject-matter');
    if (injectBtn) {
      injectBtn.addEventListener('click', () => {
        this.injectMatterParticles();
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
    this.renderUI();
    this.init3DBlackHole();
  }
}

export const deepSpaceExplorer = new DeepSpaceExplorer();
