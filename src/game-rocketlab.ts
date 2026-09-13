// Commercial-Grade 3D Rocket Engineering Studio & Atmospheric Launch Simulator (Three.js)
// Featuring Modular PBR 3D Rocket Models, Volumetric Particle Thrusters, Camera Shake & Curvature Ascent

import * as THREE from 'three';
import { ROCKET_PARTS, type RocketPart, SPACE_MISSIONS } from './rockets-data.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';
import { PlanetTextureGenerator } from './textures-generator.ts';

export class RocketLabSimulator {
  private container: HTMLElement | null = null;
  private canvasMount: HTMLElement | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animId: number | null = null;

  private rocketGroup = new THREE.Group();
  private boostersGroup = new THREE.Group();
  private earthGlobe: THREE.Mesh | null = null;
  private launchTower: THREE.Group | null = null;

  // Particle systems
  private flameParticles: THREE.Points | null = null;
  private smokeParticles: THREE.Points | null = null;
  private exhaustLight: THREE.PointLight | null = null;

  private selectedCapsule: RocketPart = ROCKET_PARTS[0];
  private selectedUpper: RocketPart = ROCKET_PARTS[3];
  private selectedCore: RocketPart = ROCKET_PARTS[5];
  private selectedBooster: RocketPart = ROCKET_PARTS[7];

  private isLaunching = false;
  private altitudeKm = 0;
  private velocityKmh = 0;
  private stageSeparated = false;
  private cameraShakeIntensity = 0;

  public mount(container: HTMLElement) {
    this.container = container;
    this.renderUI();
    this.init3DScene();
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
    this.isLaunching = false;
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

    const weightKn = (totalMassKg * 9.81) / 1000;
    const twr = weightKn > 0 ? parseFloat((totalThrustKn / weightKn).toFixed(2)) : 0;
    const isReady = twr > 1.2;

    return { totalMassKg, totalThrustKn, twr, isReady };
  }

  private renderUI() {
    if (!this.container) return;

    const { totalMassKg, totalThrustKn, twr, isReady } = this.calculatePhysics();

    this.container.innerHTML = `
      <div class="rocket-lab-3d-layout">
        <!-- 3D Launchpad WebGL Viewport -->
        <div class="launchpad-3d-viewport">
          <div id="rocket-3d-mount" class="rocket-3d-mount"></div>

          <!-- Mission Control Telemetry Overlay -->
          <div class="mission-telemetry-hud">
            <div class="hud-box">
              <span class="hud-lbl">KETINGGIAN</span>
              <span class="hud-val" id="telemetry-alt">0.0 km (Pangkalan)</span>
            </div>
            <div class="hud-box">
              <span class="hud-lbl">KECEPATAN</span>
              <span class="hud-val" id="telemetry-vel">0 km/jam</span>
            </div>
            <div class="hud-box">
              <span class="hud-lbl">TAHAPAN MISI</span>
              <span class="hud-val text-green" id="telemetry-stage">STANDBY PELUNCURAN</span>
            </div>
            <div class="hud-box">
              <span class="hud-lbl">TWR DAYA DORONG</span>
              <span class="hud-val ${isReady ? 'text-green' : 'text-red'}">${twr}</span>
            </div>
          </div>

          <!-- Countdown and Launch Controller -->
          <div class="launch-countdown-banner">
            <span class="countdown-title" id="hud-countdown-text">T-MINUS 10 DETIK</span>
            <button class="btn-ignite-thruster ${!isReady ? 'disabled' : ''}" id="btn-ignite" ${!isReady ? 'disabled' : ''}>
              🚀 NYALAKAN MESIN & LUNCURKAN!
            </button>
          </div>
        </div>

        <!-- Right Side Assembly Configuration Panel -->
        <div class="rocket-config-panel">
          <div class="config-header">
            <h3>🛠️ Bengkel Perakitan 3D</h3>
            <p>Pilih komponen untuk melihat konfigurasi roket berubah secara langsung!</p>
          </div>

          <!-- Component Selectors -->
          <div class="config-group">
            <label>1. Kapsul Muatan Puncak</label>
            <div class="config-pill-options">
              ${ROCKET_PARTS.filter(p => p.category === 'capsule').map(p => `
                <button class="cfg-btn ${p.id === this.selectedCapsule.id ? 'active' : ''}" data-cat="capsule" data-id="${p.id}">
                  ${p.nameId.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="config-group">
            <label>2. Tahap Kedua (Upper Stage)</label>
            <div class="config-pill-options">
              ${ROCKET_PARTS.filter(p => p.category === 'upper_stage').map(p => `
                <button class="cfg-btn ${p.id === this.selectedUpper.id ? 'active' : ''}" data-cat="upper_stage" data-id="${p.id}">
                  ${p.nameId.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="config-group">
            <label>3. Tangki Bahan Bakar Inti</label>
            <div class="config-pill-options">
              ${ROCKET_PARTS.filter(p => p.category === 'core_tank').map(p => `
                <button class="cfg-btn ${p.id === this.selectedCore.id ? 'active' : ''}" data-cat="core_tank" data-id="${p.id}">
                  ${p.nameId.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="config-group">
            <label>4. Pendorong / Boosters</label>
            <div class="config-pill-options">
              ${ROCKET_PARTS.filter(p => p.category === 'booster').map(p => `
                <button class="cfg-btn ${p.id === this.selectedBooster.id ? 'active' : ''}" data-cat="booster" data-id="${p.id}">
                  ${p.nameId.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Diagnostic Telemetry Card -->
          <div class="specs-diagnostic-card">
            <h4>📊 Telemetri Spesifikasi</h4>
            <div class="specs-row">
              <span>Massa Bersih Total:</span>
              <strong>${(totalMassKg / 1000).toFixed(1)} Ton</strong>
            </div>
            <div class="specs-row">
              <span>Total Daya Dorong:</span>
              <strong>${totalThrustKn} kN</strong>
            </div>
            <div class="specs-row">
              <span>Status Lepas Landas:</span>
              <strong class="${isReady ? 'text-green' : 'text-red'}">
                ${isReady ? 'SIAP MELUNCUR' : 'TWR TIDAK CUKUP'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Missions History Carousel -->
      <div class="missions-history-strip">
        <h3>🏛️ Misi Sejarah Peluncuran Antariksa Dunia</h3>
        <div class="missions-history-grid">
          ${SPACE_MISSIONS.map(m => `
            <div class="m-card">
              <div class="m-top">
                <span class="m-icon">${m.heroIcon}</span>
                <span class="m-year">${m.year}</span>
              </div>
              <h4>${m.name}</h4>
              <p class="m-agency">${m.agency} · ${m.destinationId}</p>
              <p class="m-desc">${m.significanceId}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.attachUIEvents();
  }

  private init3DScene() {
    this.canvasMount = document.getElementById('rocket-3d-mount');
    if (!this.canvasMount) return;

    const width = this.canvasMount.clientWidth || 800;
    const height = 540;

    // 1. Scene with atmospheric fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x3a7bd5); // Launchpad blue morning sky
    this.scene.fog = new THREE.FogExp2(0x3a7bd5, 0.0015);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 6000);
    this.camera.position.set(0, 18, 55);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.canvasMount.appendChild(this.renderer.domElement);

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(30, 80, 50);
    this.scene.add(dirLight);

    // Exhaust glow pointlight
    this.exhaustLight = new THREE.PointLight(0xff7700, 0, 80);
    this.exhaustLight.position.set(0, 0, 0);
    this.scene.add(this.exhaustLight);

    // 5. Environment: Ground Pad, Umbilical Tower, Curved Earth Globe
    this.buildEnvironment();

    // 6. Assemble the 3D Rocket
    this.rebuild3DRocket();

    // 7. Create Particle Systems (Flame & Smoke)
    this.createThrusterParticles();

    // 8. Animation Loop
    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      this.updateLaunchPhysics();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  private buildEnvironment() {
    if (!this.scene) return;

    // Concrete Pad & Ground terrain
    const groundGeo = new THREE.CylinderGeometry(80, 85, 2, 48);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x2b303c, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0, -1, 0);
    this.scene.add(ground);

    // Launch Gantry Umbilical Tower
    this.launchTower = new THREE.Group();
    const towerGeo = new THREE.BoxGeometry(3.5, 42, 3.5);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, metalness: 0.5, roughness: 0.5 });
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.position.set(-14, 20, 0);
    this.launchTower.add(towerMesh);

    // Gantry Arms
    for (let i = 0; i < 3; i++) {
      const armGeo = new THREE.BoxGeometry(10, 1.2, 1.5);
      const armMesh = new THREE.Mesh(armGeo, towerMat);
      armMesh.position.set(-8, 12 + i * 10, 0);
      this.launchTower.add(armMesh);
    }
    this.scene.add(this.launchTower);

    // Curved Earth Globe for High Altitude Orbit
    const earthGeo = new THREE.SphereGeometry(600, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: PlanetTextureGenerator.createEarthTexture(),
      roughness: 0.8
    });
    this.earthGlobe = new THREE.Mesh(earthGeo, earthMat);
    this.earthGlobe.position.set(0, -620, 0); // Positioned so curvature is seen as altitude rises
    this.scene.add(this.earthGlobe);
  }

  private rebuild3DRocket() {
    if (!this.scene) return;

    // Clear previous rocket parts
    this.scene.remove(this.rocketGroup);
    this.rocketGroup = new THREE.Group();
    this.boostersGroup = new THREE.Group();

    // High tech PBR Materials
    const metalHullMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.7,
      roughness: 0.25
    });

    const darkAlloyMat = new THREE.MeshStandardMaterial({
      color: 0x212121,
      metalness: 0.85,
      roughness: 0.2
    });

    const engineNozzleMat = new THREE.MeshStandardMaterial({
      color: 0x37474f,
      metalness: 0.9,
      roughness: 0.3
    });

    // --- 1. Capsule / Payload (Top) ---
    const capsuleGeo = new THREE.ConeGeometry(2.4, 6.5, 32);
    const capsuleMesh = new THREE.Mesh(capsuleGeo, metalHullMat);
    capsuleMesh.position.set(0, 31, 0);
    this.rocketGroup.add(capsuleMesh);

    // Windows
    const windowGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const win = new THREE.Mesh(windowGeo, windowMat);
    win.position.set(0, 30.5, 1.8);
    this.rocketGroup.add(win);

    // --- 2. Upper Stage (Tahap 2) ---
    const upperGeo = new THREE.CylinderGeometry(2.4, 2.6, 7.5, 32);
    const upperMesh = new THREE.Mesh(upperGeo, darkAlloyMat);
    upperMesh.position.set(0, 24, 0);
    this.rocketGroup.add(upperMesh);

    // --- 3. Core Tank (Tahap Utama) ---
    const coreGeo = new THREE.CylinderGeometry(2.6, 2.6, 18, 32);
    const coreMesh = new THREE.Mesh(coreGeo, metalHullMat);
    coreMesh.position.set(0, 11, 0);
    this.rocketGroup.add(coreMesh);

    // --- 4. Main Engine Nozzles ---
    for (let n = 0; n < 4; n++) {
      const angle = (n / 4) * Math.PI * 2;
      const nozzleGeo = new THREE.ConeGeometry(0.8, 2.2, 16);
      const nozzle = new THREE.Mesh(nozzleGeo, engineNozzleMat);
      nozzle.rotation.x = Math.PI;
      nozzle.position.set(Math.cos(angle) * 1.1, 1.0, Math.sin(angle) * 1.1);
      this.rocketGroup.add(nozzle);
    }

    // --- 5. Side Boosters ---
    [-4.0, 4.0].forEach(xOffset => {
      const boosterBody = new THREE.CylinderGeometry(1.3, 1.3, 14, 24);
      const boosterNose = new THREE.ConeGeometry(1.3, 3.5, 24);
      const boosterNozzle = new THREE.ConeGeometry(0.9, 2.0, 16);
      boosterNozzle.rotateX(Math.PI);

      const bMesh = new THREE.Mesh(boosterBody, metalHullMat);
      const nMesh = new THREE.Mesh(boosterNose, darkAlloyMat);
      const nzMesh = new THREE.Mesh(boosterNozzle, engineNozzleMat);

      nMesh.position.set(0, 8.5, 0);
      nzMesh.position.set(0, -8.0, 0);

      const bGroup = new THREE.Group();
      bGroup.add(bMesh);
      bGroup.add(nMesh);
      bGroup.add(nzMesh);
      bGroup.position.set(xOffset, 9, 0);

      this.boostersGroup.add(bGroup);
    });

    this.rocketGroup.add(this.boostersGroup);
    this.rocketGroup.position.set(0, 0, 0);
    this.scene.add(this.rocketGroup);
  }

  private createThrusterParticles() {
    if (!this.scene) return;

    // 1. High Velocity Fire Flame Particles
    const flameCount = 1800;
    const flameGeo = new THREE.BufferGeometry();
    const flamePos = new Float32Array(flameCount * 3);

    for (let i = 0; i < flameCount; i++) {
      flamePos[i * 3] = (Math.random() - 0.5) * 3;
      flamePos[i * 3 + 1] = -Math.random() * 15;
      flamePos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePos, 3));

    const flameMat = new THREE.PointsMaterial({
      color: 0xffa000,
      size: 1.8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    this.flameParticles = new THREE.Points(flameGeo, flameMat);
    this.flameParticles.visible = false;
    this.rocketGroup.add(this.flameParticles);
  }

  private updateLaunchPhysics() {
    if (this.isLaunching) {
      // 1. Altitude & Velocity increments
      this.altitudeKm += 0.85;
      this.velocityKmh = Math.min(28000, this.velocityKmh + 95);

      // 2. Rocket climbs in 3D
      this.rocketGroup.position.y += 0.45;

      // 3. Flame particles update
      if (this.flameParticles) {
        const pos = this.flameParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pos.length / 3; i++) {
          pos[i * 3 + 1] -= 0.9 + Math.random() * 1.2; // stream down
          if (pos[i * 3 + 1] < -25) {
            pos[i * 3 + 1] = 0;
            pos[i * 3] = (Math.random() - 0.5) * 2.5;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
          }
        }
        this.flameParticles.geometry.attributes.position.needsUpdate = true;
      }

      // 4. Camera follows rocket smoothly with Shake effect
      if (this.camera) {
        const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
        const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;

        this.camera.position.y = this.rocketGroup.position.y + 12 + shakeY;
        this.camera.position.x = 0 + shakeX;
        this.camera.lookAt(0, this.rocketGroup.position.y + 16, 0);
      }

      // 5. Atmospheric Transition (Day Sky -> Stratosphere Indigo -> Space Pitch Black)
      if (this.scene) {
        if (this.altitudeKm < 30) {
          // Troposphere
          this.scene.background = new THREE.Color(0x3a7bd5);
          this.cameraShakeIntensity = 0.65;
        } else if (this.altitudeKm < 90) {
          // Stratosphere to Mesosphere
          this.scene.background = new THREE.Color(0x0f1d4a);
          this.cameraShakeIntensity = 0.35;
        } else {
          // Orbit / Deep Space
          this.scene.background = new THREE.Color(0x02040a);
          this.cameraShakeIntensity = 0.05;
        }
      }

      // 6. Stage Separation at ~75 km
      if (this.altitudeKm >= 75 && !this.stageSeparated) {
        this.stageSeparated = true;
        spaceAudio.playSnap();
      }

      if (this.stageSeparated) {
        // Boosters decouple and fall away
        this.boostersGroup.position.y -= 0.6;
        this.boostersGroup.scale.multiplyScalar(0.995);
      }

      // 7. Update HUD Readouts
      const altEl = document.getElementById('telemetry-alt');
      const velEl = document.getElementById('telemetry-vel');
      const stageEl = document.getElementById('telemetry-stage');

      if (altEl) altEl.textContent = `${this.altitudeKm.toFixed(1)} km`;
      if (velEl) velEl.textContent = `${Math.floor(this.velocityKmh).toLocaleString('id-ID')} km/jam`;
      if (stageEl) {
        if (this.altitudeKm < 75) stageEl.textContent = 'TAHAP 1: DAYA DORONG PENUH';
        else if (this.altitudeKm < 380) stageEl.textContent = 'TAHAP 2: INSERSI ORBIT VAKUM';
        else stageEl.textContent = 'SUKSES: ORBIT RENDAH BUMI (400 KM)';
      }

      // 8. Reached Orbit
      if (this.altitudeKm >= 400) {
        this.isLaunching = false;
        if (this.flameParticles) this.flameParticles.visible = false;
        if (this.exhaustLight) this.exhaustLight.intensity = 0;
        spaceAudio.playFanfare();
        badgesManager.recordRocketLaunch();
        this.showOrbitCelebration();
      }
    }
  }

  private attachUIEvents() {
    if (!this.container) return;

    // Configuration buttons
    const btns = this.container.querySelectorAll('.cfg-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isLaunching) return;
        const target = e.currentTarget as HTMLElement;
        const cat = target.getAttribute('data-cat');
        const id = target.getAttribute('data-id');

        const found = ROCKET_PARTS.find(p => p.id === id);
        if (!found) return;

        if (cat === 'capsule') this.selectedCapsule = found;
        else if (cat === 'upper_stage') this.selectedUpper = found;
        else if (cat === 'core_tank') this.selectedCore = found;
        else if (cat === 'booster') this.selectedBooster = found;

        spaceAudio.playSnap();
        this.rebuild3DRocket();
        this.renderUI();
        this.init3DScene();
      });
    });

    // Ignite Launch Button
    const igniteBtn = this.container.querySelector('#btn-ignite');
    if (igniteBtn) {
      igniteBtn.addEventListener('click', () => {
        if (this.isLaunching) return;
        this.startCountdownSequence();
      });
    }
  }

  private startCountdownSequence() {
    const banner = this.container?.querySelector('#hud-countdown-text');
    const igniteBtn = this.container?.querySelector('#btn-ignite') as HTMLButtonElement;
    if (igniteBtn) igniteBtn.disabled = true;

    let count = 10;

    const tick = () => {
      if (!banner) return;
      if (count > 0) {
        banner.textContent = `T-MINUS ${count} DETIK`;
        banner.classList.add('pulse');
        spaceAudio.playCountdownBeep(false);
        count--;
        setTimeout(tick, 950);
      } else {
        banner.textContent = `🚀 LIFTOFF! SEMBURAN MESIN PENUH!`;
        spaceAudio.playCountdownBeep(true);
        spaceAudio.playRocketRumble(7.0);

        // Turn on particle exhaust and dynamic light
        if (this.flameParticles) this.flameParticles.visible = true;
        if (this.exhaustLight) this.exhaustLight.intensity = 4.5;
        this.isLaunching = true;
        this.cameraShakeIntensity = 0.8;
      }
    };

    tick();
  }

  private showOrbitCelebration() {
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
          <span class="celebration-star">🛰️</span>
          <h2>MISI ORBIT BERHASIL GEMILANG!</h2>
          <p>Roket rancanganmu berhasil mencapai kecepatan orbital <strong>28.000 km/jam</strong> di ketinggian <strong>400 km</strong>!</p>
        </div>
        <div class="celebration-badge-showcase">
          <div class="unlocked-badge-preview">
            <span class="badge-emoji-big">🛠️</span>
            <h4>Lencana Terbuka: Insinyur Roket Handal!</h4>
            <p>+200 XP Kosmik & ⭐ 2 Bintang diperoleh!</p>
          </div>
        </div>
        <div class="celebration-actions">
          <button class="btn-primary-glow" id="btn-close-celebration">Kembali ke Pangkalan</button>
        </div>
      </div>
    `;

    const closeBtn = modal.querySelector('#btn-close-celebration');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal!.classList.remove('active');
        this.altitudeKm = 0;
        this.velocityKmh = 0;
        this.stageSeparated = false;
        this.renderUI();
        this.init3DScene();
      });
    }
  }
}

export const rocketLab = new RocketLabSimulator();
