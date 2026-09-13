// Commercial-Grade Photorealistic 3D WebGL Solar System Simulator (Three.js)
// Featuring Realistic PBR Lighting, Procedural Textures, Dual-layer Atmosphere, 3D Rings & Cinematic Camera

import * as THREE from 'three';
import { CELESTIAL_BODIES, type CelestialBody } from './planets-data.ts';
import { KID_FRUIT_ANALOGIES } from './kids-curriculum.ts';
import { PlanetTextureGenerator } from './textures-generator.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';

interface Planet3DObject {
  id: string;
  data: CelestialBody;
  mesh: THREE.Mesh;
  orbitGroup: THREE.Group;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  cloudMesh?: THREE.Mesh;
  ringMesh?: THREE.Mesh;
}

export class SolarSystemExplorer {
  private container: HTMLElement | null = null;
  private canvasContainer: HTMLElement | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animId: number | null = null;

  private planets: Planet3DObject[] = [];
  private sunMesh: THREE.Mesh | null = null;
  private sunLight: THREE.PointLight | null = null;

  private activePlanetId: string = 'earth';
  private targetCameraPos = new THREE.Vector3(0, 180, 420);
  private targetLookAt = new THREE.Vector3(0, 0, 0);
  private currentLookAt = new THREE.Vector3(0, 0, 0);

  private simSpeed: number = 1.0;
  private isPaused: boolean = false;

  // Mouse drag & touch orbit controls
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private spherical = { radius: 450, theta: 0.3, phi: 1.1 };

  public mount(container: HTMLElement) {
    this.container = container;
    this.renderUI();
    this.initWebGL();
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
    this.planets = [];
    this.scene = null;
    this.camera = null;
  }

  private renderUI() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="solar-system-3d-wrapper">
        <!-- 3D WebGL Canvas Mount -->
        <div id="webgl-canvas-mount" class="webgl-canvas-mount"></div>

        <!-- Top Sci-Fi Telemetry HUD Overlay -->
        <div class="hud-telemetry-panel">
          <div class="hud-target-info">
            <span class="hud-pulse-indicator"></span>
            <div class="hud-target-text">
              <span class="hud-kicker">TARGET SAAT INI</span>
              <h2 id="hud-target-name">Bumi (Earth)</h2>
            </div>
          </div>

          <div class="hud-metrics-row">
            <div class="hud-metric">
              <span class="hud-lbl">JARAK KE MATAHARI</span>
              <span class="hud-val" id="hud-metric-dist">1.0 AU (149.6 Juta km)</span>
            </div>
            <div class="hud-metric">
              <span class="hud-lbl">GRAVITASI RELATIF</span>
              <span class="hud-val" id="hud-metric-grav">1.0x Gravitasi Bumi</span>
            </div>
            <div class="hud-metric">
              <span class="hud-lbl">PERIODE ORBIT (1 TAHUN)</span>
              <span class="hud-val" id="hud-metric-orbit">365.25 Hari</span>
            </div>
          </div>

          <div class="hud-actions-right">
            <button class="btn-hud-kids-fruit" id="btn-fruit-analogy">
              🍎 Cerita Buah Cilik
            </button>
            <button class="btn-hud-inspect" id="btn-inspect-planet">
              🔍 Buka Data Detail
            </button>
          </div>
        </div>

        <!-- Bottom Cinematic Control Strip -->
        <div class="cinematic-control-bar">
          <div class="camera-mode-group">
            <button class="btn-camera-view active" id="btn-view-focus">🎥 Fokus Planet</button>
            <button class="btn-camera-view" id="btn-view-overview">🌌 Pandangan Orbit Luas</button>
          </div>

          <!-- Speed Controls -->
          <div class="sim-speed-pills">
            <button class="speed-pill-btn" data-spd="0">⏸ Jeda</button>
            <button class="speed-pill-btn active" data-spd="1">1x Nyata</button>
            <button class="speed-pill-btn" data-spd="5">5x Cepat</button>
            <button class="speed-pill-btn" data-spd="20">20x Kilat</button>
          </div>

          <!-- Quick Planet Selector Pills -->
          <div class="planet-quick-strip" id="planet-quick-strip">
            <button class="quick-planet-btn" data-id="sun">☀️ Matahari</button>
            ${CELESTIAL_BODIES.filter(p => p.id !== 'sun').map(p => `
              <button class="quick-planet-btn ${p.id === this.activePlanetId ? 'active' : ''}" data-id="${p.id}">
                ${p.nameId.split(' ')[0]}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachUIEvents();
  }

  private initWebGL() {
    this.canvasContainer = document.getElementById('webgl-canvas-mount');
    if (!this.canvasContainer) return;

    const width = this.canvasContainer.clientWidth || window.innerWidth;
    const height = 620;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x04060f);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 8000);
    this.camera.position.set(0, 180, 420);

    // 3. Renderer with antialiasing and PBR tone mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.canvasContainer.appendChild(this.renderer.domElement);

    // 4. Background Starfield Skybox Particles
    this.createDeepSpaceStars();

    // 5. Build Sun with physical PointLight
    this.buildSun();

    // 6. Build All 3D Planets with Procedural Textures & Orbital Groups
    this.buildPlanets();

    // 7. Attach User Interaction (Mouse & Touch Drag/Zoom)
    this.setupInteractions();

    // 8. Focus initially on Earth
    this.focusOnPlanet('earth', false);

    // 9. Render Loop
    const animate = () => {
      this.animId = requestAnimationFrame(animate);
      this.updatePhysicsAndAnimation();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    this.animId = requestAnimationFrame(animate);

    // Responsive resize
    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (!this.canvasContainer || !this.camera || !this.renderer) return;
    const width = this.canvasContainer.clientWidth;
    const height = 620;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private createDeepSpaceStars() {
    if (!this.scene) return;
    const starsGeo = new THREE.BufferGeometry();
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2500 + Math.random() * 800;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Star tints: white, icy blue, warm yellow
      const tint = Math.random();
      if (tint < 0.6) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
      } else if (tint < 0.85) {
        colors[i * 3] = 0.65; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 0.65;
      }
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });

    const starPoints = new THREE.Points(starsGeo, starsMat);
    this.scene.add(starPoints);
  }

  private buildSun() {
    if (!this.scene) return;

    // Glowing Sun sphere
    const sunTexture = PlanetTextureGenerator.createSunTexture(1024, 512);
    const sunGeo = new THREE.SphereGeometry(32, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture
    });

    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(this.sunMesh);

    // Glowing Atmospheric Corona Shell
    const coronaGeo = new THREE.SphereGeometry(36, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffa000,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    this.sunMesh.add(corona);

    // Physical Omni-directional Sun Light
    this.sunLight = new THREE.PointLight(0xfffaed, 3.8, 6000, 0.4);
    this.scene.add(this.sunLight);

    // Ambient space light for viewing dark side
    const ambientLight = new THREE.AmbientLight(0x222a44, 0.45);
    this.scene.add(ambientLight);
  }

  private buildPlanets() {
    if (!this.scene) return;

    // Relative visual scale for clear 3D exploration
    const planetSpecs: Array<{
      id: string;
      radius: number;
      orbitRadius: number;
      orbitSpeed: number;
      rotSpeed: number;
      tiltDeg: number;
      texture: THREE.CanvasTexture;
      hasRings?: boolean;
      hasClouds?: boolean;
    }> = [
      { id: 'mercury', radius: 4.0, orbitRadius: 65, orbitSpeed: 0.038, rotSpeed: 0.005, tiltDeg: 0.03, texture: PlanetTextureGenerator.createMercuryTexture() },
      { id: 'venus', radius: 7.2, orbitRadius: 95, orbitSpeed: 0.026, rotSpeed: -0.003, tiltDeg: 177, texture: PlanetTextureGenerator.createVenusTexture() },
      { id: 'earth', radius: 7.8, orbitRadius: 135, orbitSpeed: 0.018, rotSpeed: 0.012, tiltDeg: 23.5, texture: PlanetTextureGenerator.createEarthTexture(), hasClouds: true },
      { id: 'mars', radius: 5.2, orbitRadius: 175, orbitSpeed: 0.014, rotSpeed: 0.011, tiltDeg: 25.2, texture: PlanetTextureGenerator.createMarsTexture() },
      { id: 'jupiter', radius: 18.5, orbitRadius: 245, orbitSpeed: 0.008, rotSpeed: 0.028, tiltDeg: 3.1, texture: PlanetTextureGenerator.createJupiterTexture() },
      { id: 'saturn', radius: 14.5, orbitRadius: 320, orbitSpeed: 0.0055, rotSpeed: 0.024, tiltDeg: 26.7, texture: PlanetTextureGenerator.createSaturnTexture(), hasRings: true },
      { id: 'uranus', radius: 10.5, orbitRadius: 390, orbitSpeed: 0.0038, rotSpeed: -0.016, tiltDeg: 97.8, texture: PlanetTextureGenerator.createUranusTexture() },
      { id: 'neptune', radius: 9.8, orbitRadius: 460, orbitSpeed: 0.0028, rotSpeed: 0.018, tiltDeg: 28.3, texture: PlanetTextureGenerator.createNeptuneTexture() },
      { id: 'pluto', radius: 3.2, orbitRadius: 520, orbitSpeed: 0.0018, rotSpeed: 0.004, tiltDeg: 122.5, texture: PlanetTextureGenerator.createPlutoTexture() }
    ];

    planetSpecs.forEach(spec => {
      const data = CELESTIAL_BODIES.find(p => p.id === spec.id)!;

      // 1. Orbit Group Pivot
      const orbitGroup = new THREE.Group();
      this.scene!.add(orbitGroup);

      // 2. Translucent Circular Orbit Track Line
      const orbitPoints: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(theta) * spec.orbitRadius, 0, Math.sin(theta) * spec.orbitRadius));
      }
      const orbitLineGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitLineMat = new THREE.LineBasicMaterial({
        color: 0x3d5afe,
        transparent: true,
        opacity: 0.22
      });
      const orbitLine = new THREE.LineLoop(orbitLineGeo, orbitLineMat);
      this.scene!.add(orbitLine);

      // 3. Planet Mesh with PBR Material
      const planetGeo = new THREE.SphereGeometry(spec.radius, 40, 40);
      const planetMat = new THREE.MeshStandardMaterial({
        map: spec.texture,
        roughness: 0.85,
        metalness: 0.15
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.position.set(spec.orbitRadius, 0, 0);
      planetMesh.rotation.z = (spec.tiltDeg * Math.PI) / 180; // axial tilt!
      orbitGroup.add(planetMesh);

      let cloudMesh: THREE.Mesh | undefined;
      let ringMesh: THREE.Mesh | undefined;

      // 4. Special Earth Clouds Layer
      if (spec.hasClouds) {
        const cloudGeo = new THREE.SphereGeometry(spec.radius * 1.02, 40, 40);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: PlanetTextureGenerator.createEarthCloudsTexture(),
          transparent: true,
          opacity: 0.85,
          blending: THREE.NormalBlending
        });
        cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        planetMesh.add(cloudMesh);
      }

      // 5. Special Saturn 3D Rings
      if (spec.hasRings) {
        const ringGeo = new THREE.RingGeometry(spec.radius * 1.35, spec.radius * 2.5, 64);
        // Rotate geometry to horizontal plane
        ringGeo.rotateX(Math.PI / 2);

        const ringTexture = PlanetTextureGenerator.createSaturnRingsTexture();
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          roughness: 0.6
        });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetMesh.add(ringMesh);
      }

      this.planets.push({
        id: spec.id,
        data,
        mesh: planetMesh,
        orbitGroup,
        orbitRadius: spec.orbitRadius,
        orbitSpeed: spec.orbitSpeed,
        rotationSpeed: spec.rotSpeed,
        cloudMesh,
        ringMesh
      });
    });
  }

  private setupInteractions() {
    if (!this.renderer) return;
    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    dom.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.spherical.theta -= deltaX * 0.005;
      this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi - deltaY * 0.005));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Zoom wheel
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.spherical.radius = Math.max(25, Math.min(1800, this.spherical.radius + e.deltaY * 0.8));
    }, { passive: false });

    // Touch support
    let touchStartDist = 0;
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    });

    dom.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        this.spherical.theta -= deltaX * 0.005;
        this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi - deltaY * 0.005));
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const diff = touchStartDist - dist;
        this.spherical.radius = Math.max(25, Math.min(1800, this.spherical.radius + diff * 1.5));
        touchStartDist = dist;
      }
    });

    dom.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  public focusOnPlanet(planetId: string, playSound = true) {
    this.activePlanetId = planetId;
    if (playSound) spaceAudio.playCelestialChime();
    badgesManager.recordPlanetVisit(planetId);

    // Update Telemetry HUD
    const target = CELESTIAL_BODIES.find(p => p.id === planetId);
    if (target) {
      const nameEl = document.getElementById('hud-target-name');
      const distEl = document.getElementById('hud-metric-dist');
      const gravEl = document.getElementById('hud-metric-grav');
      const orbitEl = document.getElementById('hud-metric-orbit');

      if (nameEl) nameEl.textContent = `${target.nameId} (${target.nameEn})`;
      if (distEl) distEl.textContent = `${target.distanceFromSunAu} AU (${target.distanceFromSunKmMillion} Juta km)`;
      if (gravEl) gravEl.textContent = `${target.gravityRatio}x Gravitasi Bumi`;
      if (orbitEl) orbitEl.textContent = `${target.orbitalPeriod}`;
    }

    // Update selector pills
    const pills = document.querySelectorAll('.quick-planet-btn');
    pills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-id') === planetId);
    });

    // Set close-up distance based on target size
    if (planetId === 'sun') {
      this.spherical.radius = 95;
    } else {
      const pObj = this.planets.find(p => p.id === planetId);
      if (pObj) {
        const r = (pObj.mesh.geometry as THREE.SphereGeometry).parameters.radius;
        this.spherical.radius = Math.max(28, r * 3.6);
      }
    }
  }

  private updatePhysicsAndAnimation() {
    if (!this.isPaused) {
      // 1. Rotate Sun on axis
      if (this.sunMesh) {
        this.sunMesh.rotation.y += 0.002 * this.simSpeed;
      }

      // 2. Orbits & Self-rotations of all planets
      this.planets.forEach(p => {
        p.orbitGroup.rotation.y += p.orbitSpeed * 0.15 * this.simSpeed;
        p.mesh.rotation.y += p.rotationSpeed * this.simSpeed;

        // Rotate clouds at independent speed
        if (p.cloudMesh) {
          p.cloudMesh.rotation.y += 0.004 * this.simSpeed;
        }
      });
    }

    // 3. Smooth Camera Fly-To Lerp
    if (this.camera) {
      let targetCenter = new THREE.Vector3(0, 0, 0);

      if (this.activePlanetId !== 'sun') {
        const activeObj = this.planets.find(p => p.id === this.activePlanetId);
        if (activeObj) {
          activeObj.mesh.getWorldPosition(targetCenter);
        }
      }

      this.targetLookAt.copy(targetCenter);

      // Spherical camera orbit math
      const sinPhi = Math.sin(this.spherical.phi);
      const cosPhi = Math.cos(this.spherical.phi);
      const sinTheta = Math.sin(this.spherical.theta);
      const cosTheta = Math.cos(this.spherical.theta);

      this.targetCameraPos.set(
        targetCenter.x + this.spherical.radius * sinPhi * sinTheta,
        targetCenter.y + this.spherical.radius * cosPhi,
        targetCenter.z + this.spherical.radius * sinPhi * cosTheta
      );

      // Smooth interpolation
      this.camera.position.lerp(this.targetCameraPos, 0.08);
      this.currentLookAt.lerp(this.targetLookAt, 0.08);
      this.camera.lookAt(this.currentLookAt);
    }
  }

  private attachUIEvents() {
    if (!this.container) return;

    // Quick planet buttons
    const pills = this.container.querySelectorAll('.quick-planet-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) this.focusOnPlanet(id);
      });
    });

    // Speed pills
    const spdButtons = this.container.querySelectorAll('.speed-pill-btn');
    spdButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const spd = parseFloat(target.getAttribute('data-spd') || '1');
        spdButtons.forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        this.simSpeed = spd;
        this.isPaused = spd === 0;
        spaceAudio.playPop(520);
      });
    });

    // Overview button
    const overviewBtn = this.container.querySelector('#btn-view-overview');
    if (overviewBtn) {
      overviewBtn.addEventListener('click', () => {
        this.activePlanetId = 'sun';
        this.spherical.radius = 820;
        this.spherical.phi = 0.85;
        spaceAudio.playPop(440);
      });
    }

    // Fruit Analogy modal button for kids
    const fruitBtn = this.container.querySelector('#btn-fruit-analogy');
    if (fruitBtn) {
      fruitBtn.addEventListener('click', () => {
        const found = KID_FRUIT_ANALOGIES.find(f => f.planetId === this.activePlanetId) || KID_FRUIT_ANALOGIES[0];
        spaceAudio.speakKids(found.voiceScript);
        this.renderKidFruitModal(found);
      });
    }

    // Inspect planet modal button
    const inspectBtn = this.container.querySelector('#btn-inspect-planet');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        const target = CELESTIAL_BODIES.find(p => p.id === this.activePlanetId);
        if (target) {
          this.renderDetailModal(target);
        }
      });
    }
  }

  public renderKidFruitModal(analogy: typeof KID_FRUIT_ANALOGIES[0]) {
    let modal = document.getElementById('fruit-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'fruit-modal';
      modal.className = 'cosmic-modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="cosmic-modal-card celebration-card">
        <span class="fruit-emoji-huge" style="font-size:64px;">${analogy.fruitEmoji}</span>
        <h2 style="color:var(--space-gold); font-size:24px; margin:10px 0;">${analogy.planetName} = ${analogy.fruitName}!</h2>
        <p style="font-size:15px; line-height:1.6; margin-bottom:16px;">${analogy.fruitComparison}</p>
        <div style="background:rgba(255,255,255,0.06); padding:14px; border-radius:12px; margin-bottom:20px; font-size:13.5px;">
          💡 <strong>Tahukah Kamu?</strong> ${analogy.funFactKid}
        </div>
        <div style="display:flex; justify-content:center; gap:12px;">
          <button class="btn-voice-speech" id="btn-repeat-fruit-voice">🔊 Dengarkan Lagi</button>
          <button class="btn-primary-glow" id="btn-close-fruit-modal">Tutup & Mainkan</button>
        </div>
      </div>
    `;

    modal.classList.add('active');

    modal.querySelector('#btn-repeat-fruit-voice')?.addEventListener('click', () => {
      spaceAudio.speakKids(analogy.voiceScript);
    });

    modal.querySelector('#btn-close-fruit-modal')?.addEventListener('click', () => {
      modal!.classList.remove('active');
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
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    const speechBtn = modal.querySelector('#btn-planet-speech');
    if (speechBtn) {
      speechBtn.addEventListener('click', () => {
        spaceAudio.speak(planet.audioSpeechId);
      });
    }

    const closeBtn = modal.querySelector('#btn-close-planet-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal!.classList.remove('active');
        spaceAudio.playPop(350);
      });
    }
  }
}

export const solarExplorer = new SolarSystemExplorer();
