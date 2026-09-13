// Freeplay Cosmic Sandbox, Lunar Lander Flight Simulator & Nusantara Constellations
// Features:
// 1. Planetary Gravity Weight Lab
// 2. Apollo Lunar Lander Physics Simulator (Moon landing with thrust & fuel)
// 3. Stargazing Constellation Lab (Nusantara Maritime & Agricultural Navigation: Crux, Orion, Ursa Major)

import { CELESTIAL_BODIES } from './planets-data.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';
import { confetti } from './confetti.ts';

interface ConstellationData {
  id: string;
  name: string;
  localName: string;
  cultureSignificance: string;
  voiceText: string;
  stars: Array<{ x: number; y: number; label: string; order: number }>;
  connections: Array<[number, number]>;
}

const NUSANTARA_CONSTELLATIONS: ConstellationData[] = [
  {
    id: 'crux',
    name: 'Rasi Bintang Pari (Salib Selatan / Crux)',
    localName: 'Gubug Penceng / Bintang Pari',
    cultureSignificance: 'Digunakan oleh para pelaut tangguh Bugis, Jawa, dan Maluku sejak ratusan tahun lalu sebagai kompas alami penunjuk arah Selatan sejati saat mengarungi Samudra Nusantara!',
    voiceText: 'Luar biasa! Inilah Rasi Bintang Pari. Sejak ratusan tahun lalu, para pelaut Nusantara menggunakannya sebagai penunjuk arah Selatan di lautan luas!',
    stars: [
      { x: 300, y: 70, label: 'Gacrux', order: 1 },
      { x: 300, y: 250, label: 'Acrux', order: 2 },
      { x: 210, y: 160, label: 'Mimosa', order: 3 },
      { x: 370, y: 150, label: 'Imai', order: 4 }
    ],
    connections: [[1, 2], [3, 4]]
  },
  {
    id: 'orion',
    name: 'Rasi Bintang Waluku (Orion)',
    localName: 'Bintang Waluku / Bajak Sawah',
    cultureSignificance: 'Masyarakat agraris tradisional Jawa dan Sunda memantau kemunculan rasi ini di ufuk timur sebagai tanda musim membajak sawah (labuh) dan menanam padi telah tiba!',
    voiceText: 'Hebat sekali! Ini Rasi Bintang Waluku. Petani tradisional Indonesia memandang rasi ini sebagai tanda mulainya musim membajak sawah dan menanam padi!',
    stars: [
      { x: 230, y: 70, label: 'Betelgeuse', order: 1 },
      { x: 370, y: 90, label: 'Bellatrix', order: 2 },
      { x: 270, y: 160, label: 'Alnitak', order: 3 },
      { x: 300, y: 160, label: 'Alnilam', order: 4 },
      { x: 330, y: 160, label: 'Mintaka', order: 5 },
      { x: 240, y: 260, label: 'Saiph', order: 6 },
      { x: 370, y: 240, label: 'Rigel', order: 7 }
    ],
    connections: [[1, 2], [1, 3], [2, 5], [3, 4], [4, 5], [3, 6], [5, 7], [6, 7]]
  },
  {
    id: 'ursa_major',
    name: 'Rasi Bintang Biduk (Ursa Major)',
    localName: 'Bintang Jong / Gayung Air',
    cultureSignificance: 'Bentuknya menyerupai perahu (jong) atau gayung besar. Dua bintang terluar di mangkuknya selalu menunjuk lurus ke arah Bintang Kutub (Polaris), penunjuk arah Utara!',
    voiceText: 'Bagus sekali! Ini Rasi Bintang Biduk. Dua bintang di ujung mangkuknya selalu menunjuk lurus ke arah Bintang Utara!',
    stars: [
      { x: 180, y: 100, label: 'Dubhe', order: 1 },
      { x: 260, y: 110, label: 'Merak', order: 2 },
      { x: 250, y: 180, label: 'Phecda', order: 3 },
      { x: 170, y: 170, label: 'Megrez', order: 4 },
      { x: 320, y: 180, label: 'Alioth', order: 5 },
      { x: 380, y: 210, label: 'Mizar', order: 6 },
      { x: 440, y: 250, label: 'Alkaid', order: 7 }
    ],
    connections: [[1, 2], [2, 3], [3, 4], [4, 1], [3, 5], [5, 6], [6, 7]]
  }
];

export class SpaceSandboxLab {
  private container: HTMLElement | null = null;
  private activeTab: 'gravity' | 'lander' | 'constellation' = 'gravity';
  private earthWeightKg: number = 30;

  // Lunar Lander Game state
  private landerAnimFrame: number | null = null;
  private landerState = {
    x: 300,
    y: 40,
    vx: 0,
    vy: 0,
    fuel: 100,
    isThrusting: false,
    isLeft: false,
    isRight: false,
    landed: false,
    crashed: false,
    padX1: 240,
    padX2: 360,
    padY: 280
  };

  // Constellation Game state
  private currentConstellationIdx: number = 0;
  private connectedStars: number[] = [];

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public unmount() {
    if (this.landerAnimFrame) {
      cancelAnimationFrame(this.landerAnimFrame);
      this.landerAnimFrame = null;
    }
  }

  private render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="sandbox-lab-view">
        <!-- Top Tab Switcher -->
        <div class="sandbox-nav-tabs">
          <button class="sandbox-tab-btn ${this.activeTab === 'gravity' ? 'active' : ''}" data-tab="gravity" type="button">
            ⚖️ Lab Berat Gravitasi
          </button>
          <button class="sandbox-tab-btn ${this.activeTab === 'lander' ? 'active' : ''}" data-tab="lander" type="button">
            🌕 Game 1: Pendaratan Bulan Apollo 11
          </button>
          <button class="sandbox-tab-btn ${this.activeTab === 'constellation' ? 'active' : ''}" data-tab="constellation" type="button">
            🔭 Game 2: Teleskop Rasi Bintang Nusantara
          </button>
        </div>

        <!-- Tab 1: Gravity Weight Lab -->
        <div class="sandbox-tab-content ${this.activeTab === 'gravity' ? 'active' : ''}" id="tab-gravity-content">
          <div class="gravity-lab-card">
            <div class="lab-title-strip">
              <span class="lab-icon">⚖️</span>
              <div>
                <h3>Laboratorium Gravitasi Antariksa: Berapa Beratmu di Planet Lain?</h3>
                <p>Massa tubuhmu tetap sama, tetapi beratmu berubah drastis karena kekuatan gravitasi setiap planet berbeda-beda!</p>
              </div>
            </div>

            <!-- Weight Input Bar -->
            <div class="weight-input-container">
              <label for="input-earth-weight">Masukkan Berat Badanmu di Bumi (kg):</label>
              <div class="input-stepper">
                <button class="btn-weight-step" id="btn-weight-minus" type="button">- 5</button>
                <input type="number" id="input-earth-weight" value="${this.earthWeightKg}" min="10" max="150" />
                <span class="weight-unit">kg</span>
                <button class="btn-weight-step" id="btn-weight-plus" type="button">+ 5</button>
              </div>
            </div>

            <!-- Planetary Gravity Comparison Cards Grid -->
            <div class="gravity-cards-grid" id="gravity-cards-grid">
              ${this.renderGravityCards()}
            </div>
          </div>

          <!-- Microgravity Astronaut Life Tips -->
          <div class="astronaut-life-card">
            <h3>👨‍🚀 Fakta Kehidupan di Gravitasi Nol (Mikrogravitasi)</h3>
            <div class="training-tips-grid">
              <div class="tip-card">
                <span class="tip-emoji">🛏️</span>
                <h4>Tidur di Dalam Kantung Dinding</h4>
                <p>Astronot tidur di kantung tidur khusus yang diikat ke dinding stasiun agar tidak melayang menabrak instrumen!</p>
              </div>
              <div class="tip-card">
                <span class="tip-emoji">💧</span>
                <h4>Air Membentuk Bola Sempurna</h4>
                <p>Di luar angkasa, air tidak tumpah ke bawah melainkan melayang membentuk bola jernih yang bisa ditangkap melayang!</p>
              </div>
              <div class="tip-card">
                <span class="tip-emoji">🏋️‍♂️</span>
                <h4>Wajib Olahraga 2 Jam Tiap Hari</h4>
                <p>Karena tidak melawan beban gravitasi, astronot berolahraga dengan treadmill bertali penahan agar tulang dan otot tetap kuat!</p>
              </div>
              <div class="tip-card">
                <span class="tip-emoji">🥪</span>
                <h4>Makanan Tanpa Remah (Tortilla)</h4>
                <p>Menggunakan tortilla lembut agar remah makanan tidak berterbangan masuk ke mata atau menyumbat filter udara stasiun!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Apollo Lunar Lander Simulator -->
        <div class="sandbox-tab-content ${this.activeTab === 'lander' ? 'active' : ''}" id="tab-lander-content">
          <div class="lunar-lander-card">
            <div class="lander-header-strip">
              <span class="lander-badge">🌕 MISI PENDARATAN BULAN APOLLO 11</span>
              <h3>Kendali Modul Pendarat Lunar "Eagle"</h3>
              <p>Atur dorongan mesin pendorong roket agar mendarat mulus di atas kawah Bulan berbendera Indonesia! Jangan mendarat terlalu kencang!</p>
            </div>

            <div class="lander-telemetry-hud">
              <div class="hud-item">
                <span class="hud-label">Sisa Bahan Bakar:</span>
                <span class="hud-val" id="lander-fuel-val">100%</span>
              </div>
              <div class="hud-item">
                <span class="hud-label">Kecepatan Turun (V-Speed):</span>
                <span class="hud-val" id="lander-vspeed-val">0.0 m/s</span>
              </div>
              <div class="hud-item">
                <span class="hud-label">Status Pendaratan:</span>
                <span class="hud-val highlight" id="lander-status-val">Melayang di Orbit...</span>
              </div>
            </div>

            <div class="lander-canvas-container">
              <canvas id="lunar-lander-canvas" width="600" height="320"></canvas>
            </div>

            <div class="lander-controls-bar">
              <button class="btn-lander-thrust" id="btn-thrust-left" type="button">◀️ Dorong Kiri</button>
              <button class="btn-lander-thrust main-thrust" id="btn-thrust-main" type="button">🚀 GAS DORONG UTAMA</button>
              <button class="btn-lander-thrust" id="btn-thrust-right" type="button">Dorong Kanan ▶️</button>
              <button class="btn-lander-reset" id="btn-lander-reset" type="button">🔄 Reset Misi</button>
            </div>

            <p class="lander-hint-note">
              💡 <b>Tips Masinis Antariksa:</b> Gunakan tombol panah keyboard (Atas / Kiri / Kanan) atau tombol sentuh di atas. Tekan gas utama secara perlahan ketika mendekati permukaan agar kecepatan di bawah 2.0 m/s!
            </p>
          </div>
        </div>

        <!-- Tab 3: Stargazing Nusantara Constellations -->
        <div class="sandbox-tab-content ${this.activeTab === 'constellation' ? 'active' : ''}" id="tab-constellation-content">
          <div class="constellation-card">
            <div class="constellation-header-strip">
              <span class="constellation-badge">🔭 TELESKOP RASI BINTANG NUSANTARA</span>
              <h3>Peta Bintang Navigasi Pelaut & Petani Indonesia</h3>
              <p>Sentuh bintang bernomor secara berurutan untuk menyambungkan garis rasi bintang dan membuka sejarah penggunaannya oleh nenek moyang kita!</p>
            </div>

            <div class="constellation-selector-row">
              ${NUSANTARA_CONSTELLATIONS.map((c, idx) => `
                <button class="btn-constel-select ${idx === this.currentConstellationIdx ? 'active' : ''}" data-cidx="${idx}" type="button">
                  ⭐ ${c.name.split('(')[0]}
                </button>
              `).join('')}
            </div>

            <div class="constellation-canvas-container">
              <canvas id="constellation-canvas" width="600" height="340"></canvas>
            </div>

            <div class="constellation-info-box" id="constellation-info-box">
              ${this.renderConstellationInfo()}
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private renderGravityCards(): string {
    const targets = [
      { id: 'sun', name: 'Matahari', ratio: 28.0, fun: 'Seberat anak gajah! Kamu tidak akan bisa mengangkat kakimu!' },
      { id: 'mercury', name: 'Merkurius', ratio: 0.38, fun: 'Sangat ringan! Kamu bisa melompat setinggi tiang basket!' },
      { id: 'venus', name: 'Venus', ratio: 0.91, fun: 'Hampir sama persis dengan beratmu di Bumi!' },
      { id: 'moon', name: 'Bulan', ratio: 0.166, fun: 'Seringan kucing peliharaan! Satu langkahmu melayang tinggi!' },
      { id: 'mars', name: 'Mars', ratio: 0.38, fun: 'Seringan ransel sekolahmu saat kosong!' },
      { id: 'jupiter', name: 'Jupiter', ratio: 2.36, fun: 'Sangat berat! Seperti menggendong dua teman sekaligus!' },
      { id: 'saturn', name: 'Saturnus', ratio: 0.92, fun: 'Sedikit lebih ringan daripada di Bumi!' },
      { id: 'pluto', name: 'Pluto', ratio: 0.06, fun: 'Seringan bola bulu tangkis! Sentuhan jari bisa membuatmu terbang!' }
    ];

    return targets.map(t => {
      const calculatedWeight = (this.earthWeightKg * t.ratio).toFixed(1);
      const voiceSpeech = `Di ${t.name}, berat badanmu menjadi ${calculatedWeight} kilogram! ${t.fun}`;
      return `
        <div class="planet-weight-card" data-speak="${voiceSpeech}" style="cursor: pointer;" title="Sentuh untuk mendengarkan suara">
          <div class="pw-header">
            <h4>${t.name}</h4>
            <span class="pw-ratio">${t.ratio}g</span>
          </div>
          <div class="pw-value-box">
            <span class="pw-number">${calculatedWeight}</span>
            <span class="pw-kg">kg</span>
          </div>
          <p class="pw-fun">${t.fun}</p>
          <div style="font-size: 11px; color: #00e5ff; margin-top: 6px;">🔊 Dengar Suara</div>
        </div>
      `;
    }).join('');
  }

  private renderConstellationInfo(): string {
    const cur = NUSANTARA_CONSTELLATIONS[this.currentConstellationIdx];
    const isCompleted = this.connectedStars.length === cur.stars.length;

    return `
      <div class="constel-header">
        <h4>${cur.name} (${cur.localName})</h4>
        <span class="constel-status ${isCompleted ? 'done' : 'progress'}">
          ${isCompleted ? '✅ Rasi Terbuka Lengkap!' : `Terhubung: ${this.connectedStars.length}/${cur.stars.length} Bintang`}
        </span>
      </div>
      <p class="constel-story">${cur.cultureSignificance}</p>
      <button class="btn-voice-constel" id="btn-voice-constel" type="button">
        🔊 Dengarkan Kisah Bintang Ini
      </button>
    `;
  }

  private attachEvents() {
    if (!this.container) return;

    // Tab Navigation
    const tabBtns = this.container.querySelectorAll('.sandbox-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as 'gravity' | 'lander' | 'constellation';
        if (tab) {
          this.activeTab = tab;
          spaceAudio.playPop(520);
          this.render();
          if (tab === 'lander') {
            this.initLunarLander();
          } else if (tab === 'constellation') {
            this.initConstellationCanvas();
          }
        }
      });
    });

    if (this.activeTab === 'gravity') {
      this.attachGravityEvents();
    } else if (this.activeTab === 'lander') {
      this.initLunarLander();
    } else if (this.activeTab === 'constellation') {
      this.initConstellationCanvas();
    }
  }

  // --- TAB 1: GRAVITY LAB EVENTS ---
  private attachGravityEvents() {
    if (!this.container) return;
    const input = this.container.querySelector('#input-earth-weight') as HTMLInputElement;
    const minusBtn = this.container.querySelector('#btn-weight-minus');
    const plusBtn = this.container.querySelector('#btn-weight-plus');

    const bindCardClicks = () => {
      const cards = this.container?.querySelectorAll('.planet-weight-card');
      cards?.forEach(card => {
        card.addEventListener('click', () => {
          const text = card.getAttribute('data-speak');
          if (text) {
            spaceAudio.speakKids(text);
          }
        });
      });
    };

    bindCardClicks();

    const updateWeight = (newVal: number) => {
      this.earthWeightKg = Math.max(10, Math.min(150, newVal));
      if (input) input.value = this.earthWeightKg.toString();
      const grid = this.container?.querySelector('#gravity-cards-grid');
      if (grid) {
        grid.innerHTML = this.renderGravityCards();
        bindCardClicks();
      }
      spaceAudio.playPop(480);
      badgesManager.unlockBadge('gravity_master');
    };

    input?.addEventListener('change', () => {
      updateWeight(parseInt(input.value || '30', 10));
    });
    minusBtn?.addEventListener('click', () => updateWeight(this.earthWeightKg - 5));
    plusBtn?.addEventListener('click', () => updateWeight(this.earthWeightKg + 5));
  }

  // --- TAB 2: LUNAR LANDER SIMULATOR ---
  private initLunarLander() {
    if (!this.container) return;
    const canvas = this.container.querySelector('#lunar-lander-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.resetLander();

    const fuelEl = this.container.querySelector('#lander-fuel-val');
    const vspeedEl = this.container.querySelector('#lander-vspeed-val');
    const statusEl = this.container.querySelector('#lander-status-val') as HTMLElement | null;

    // Controls
    const mainBtn = this.container.querySelector('#btn-thrust-main');
    const leftBtn = this.container.querySelector('#btn-thrust-left');
    const rightBtn = this.container.querySelector('#btn-thrust-right');
    const resetBtn = this.container.querySelector('#btn-lander-reset');

    const startMain = () => { if (this.landerState.fuel > 0) { this.landerState.isThrusting = true; spaceAudio.playPop(300); } };
    const stopMain = () => { this.landerState.isThrusting = false; };
    const startLeft = () => { if (this.landerState.fuel > 0) this.landerState.isLeft = true; };
    const stopLeft = () => { this.landerState.isLeft = false; };
    const startRight = () => { if (this.landerState.fuel > 0) this.landerState.isRight = true; };
    const stopRight = () => { this.landerState.isRight = false; };

    mainBtn?.addEventListener('mousedown', startMain);
    mainBtn?.addEventListener('mouseup', stopMain);
    mainBtn?.addEventListener('touchstart', (e) => { e.preventDefault(); startMain(); });
    mainBtn?.addEventListener('touchend', stopMain);

    leftBtn?.addEventListener('mousedown', startLeft);
    leftBtn?.addEventListener('mouseup', stopLeft);
    leftBtn?.addEventListener('touchstart', (e) => { e.preventDefault(); startLeft(); });
    leftBtn?.addEventListener('touchend', stopLeft);

    rightBtn?.addEventListener('mousedown', startRight);
    rightBtn?.addEventListener('mouseup', stopRight);
    rightBtn?.addEventListener('touchstart', (e) => { e.preventDefault(); startRight(); });
    rightBtn?.addEventListener('touchend', stopRight);

    resetBtn?.addEventListener('click', () => {
      this.resetLander();
      spaceAudio.playPop(500);
    });

    // Keyboard support
    const onKeyDown = (e: KeyboardEvent) => {
      if (this.activeTab !== 'lander') return;
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') startMain();
      if (e.key === 'ArrowLeft' || e.key === 'a') startLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') startRight();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (this.activeTab !== 'lander') return;
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') stopMain();
      if (e.key === 'ArrowLeft' || e.key === 'a') stopLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') stopRight();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Animation loop
    if (this.landerAnimFrame) cancelAnimationFrame(this.landerAnimFrame);

    const loop = () => {
      if (this.activeTab !== 'lander') return;

      // Physics update
      const st = this.landerState;
      if (!st.landed && !st.crashed) {
        // Gravity on Moon
        st.vy += 0.04;

        if (st.isThrusting && st.fuel > 0) {
          st.vy -= 0.11;
          st.fuel = Math.max(0, st.fuel - 0.25);
        }
        if (st.isLeft && st.fuel > 0) {
          st.vx += 0.06;
          st.fuel = Math.max(0, st.fuel - 0.1);
        }
        if (st.isRight && st.fuel > 0) {
          st.vx -= 0.06;
          st.fuel = Math.max(0, st.fuel - 0.1);
        }

        st.x += st.vx;
        st.y += st.vy;

        // Boundaries
        st.x = Math.max(30, Math.min(570, st.x));

        // Touch ground check
        if (st.y >= st.padY - 20) {
          st.y = st.padY - 20;
          const isOnPad = st.x >= st.padX1 && st.x <= st.padX2;
          const isSafeSpeed = Math.abs(st.vy) < 1.4 && Math.abs(st.vx) < 0.9;

          if (isOnPad && isSafeSpeed) {
            st.landed = true;
            spaceAudio.playCheer();
            spaceAudio.playRandomPraise();
            confetti.fire(0.5, 0.4, 70);
            badgesManager.addXp(50);
            badgesManager.addStar(2);
            if (statusEl) {
              statusEl.textContent = '🎉 Pendaratan Sempurna! Bintang Emas untukmu!';
              statusEl.style.color = '#ffd700';
            }
          } else {
            st.crashed = true;
            spaceAudio.playPop(200);
            if (statusEl) {
              statusEl.textContent = '⚠️ Sentuhan Keras! Tekan Reset & kendalikan gas lebih lembut.';
              statusEl.style.color = '#ff5252';
            }
          }
        }
      }

      // Render Moon and Lander
      ctx.clearRect(0, 0, 600, 320);

      // Starry sky
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, 600, 320);

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97) % 600;
        const sy = (i * 47) % 240;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Moon Surface terrain
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(0, 295);
      ctx.quadraticCurveTo(120, 285, st.padX1, st.padY);
      ctx.lineTo(st.padX2, st.padY);
      ctx.quadraticCurveTo(480, 285, 600, 295);
      ctx.lineTo(600, 320);
      ctx.lineTo(0, 320);
      ctx.closePath();
      ctx.fill();

      // Flat Landing Pad
      ctx.fillStyle = '#10b981';
      ctx.fillRect(st.padX1, st.padY, st.padX2 - st.padX1, 6);

      // Indonesian Flag on Pad
      ctx.font = '18px sans-serif';
      ctx.fillText('🇮🇩', st.padX1 + 10, st.padY - 4);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ZONA PENDARATAN RESMI', st.padX1 + 36, st.padY + 18);

      // Lander Module
      ctx.save();
      ctx.translate(st.x, st.y);

      // Thruster Flame
      if (st.isThrusting && st.fuel > 0 && !st.landed && !st.crashed) {
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.moveTo(-7, 12);
        ctx.lineTo(0, 26 + Math.random() * 8);
        ctx.lineTo(7, 12);
        ctx.closePath();
        ctx.fill();
      }

      // Module Body
      ctx.fillStyle = '#ffd700'; // Gold foil body
      ctx.fillRect(-12, -10, 24, 20);

      // Cockpit Window
      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.arc(0, -5, 5, 0, Math.PI * 2);
      ctx.fill();

      // Landing legs
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(-18, 18);
      ctx.moveTo(10, 8);
      ctx.lineTo(18, 18);
      ctx.stroke();

      ctx.restore();

      // HUD Update
      if (fuelEl) fuelEl.textContent = `${Math.round(st.fuel)}%`;
      if (vspeedEl) {
        const spd = Math.abs(st.vy * 10).toFixed(1);
        vspeedEl.textContent = `${spd} m/s ${parseFloat(spd) > 14 ? '⚠️' : '✅'}`;
      }

      this.landerAnimFrame = requestAnimationFrame(loop);
    };

    this.landerAnimFrame = requestAnimationFrame(loop);
  }

  private resetLander() {
    this.landerState = {
      x: 220 + Math.random() * 160,
      y: 40,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0,
      fuel: 100,
      isThrusting: false,
      isLeft: false,
      isRight: false,
      landed: false,
      crashed: false,
      padX1: 240,
      padX2: 360,
      padY: 280
    };
    const statusEl = this.container?.querySelector('#lander-status-val') as HTMLElement | null;
    if (statusEl) {
      statusEl.textContent = 'Melayang di Orbit Bulan...';
      statusEl.style.color = '#00e5ff';
    }
  }

  // --- TAB 3: CONSTELLATION STARGAZER ---
  private initConstellationCanvas() {
    if (!this.container) return;
    const canvas = this.container.querySelector('#constellation-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.connectedStars = [];

    // Constellation selector buttons
    const cBtns = this.container.querySelectorAll('.btn-constel-select');
    cBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cidx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-cidx') || '0', 10);
        this.currentConstellationIdx = cidx;
        this.connectedStars = [];
        spaceAudio.playPop(480);
        this.render();
        this.initConstellationCanvas();
      });
    });

    const voiceBtn = this.container.querySelector('#btn-voice-constel');
    voiceBtn?.addEventListener('click', () => {
      const cur = NUSANTARA_CONSTELLATIONS[this.currentConstellationIdx];
      spaceAudio.speakKids(cur.voiceText);
    });

    // Canvas click to connect stars
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (600 / rect.width);
      const clickY = (e.clientY - rect.top) * (340 / rect.height);

      const cur = NUSANTARA_CONSTELLATIONS[this.currentConstellationIdx];
      cur.stars.forEach(star => {
        const dist = Math.hypot(star.x - clickX, star.y - clickY);
        if (dist < 26) {
          if (!this.connectedStars.includes(star.order)) {
            this.connectedStars.push(star.order);
            spaceAudio.playPop(600 + star.order * 60);

            if (this.connectedStars.length === cur.stars.length) {
              spaceAudio.playCheer();
              confetti.fire(0.5, 0.45, 60);
              spaceAudio.speakKids(cur.voiceText);
              badgesManager.addXp(30);
            }

            this.drawConstellation(ctx);
            const infoBox = this.container?.querySelector('#constellation-info-box');
            if (infoBox) {
              infoBox.innerHTML = this.renderConstellationInfo();
              const vBtn = infoBox.querySelector('#btn-voice-constel');
              vBtn?.addEventListener('click', () => spaceAudio.speakKids(cur.voiceText));
            }
          }
        }
      });
    });

    this.drawConstellation(ctx);
  }

  private drawConstellation(ctx: CanvasRenderingContext2D) {
    const cur = NUSANTARA_CONSTELLATIONS[this.currentConstellationIdx];

    ctx.clearRect(0, 0, 600, 340);

    // Deep Indigo Night Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 340);
    skyGrad.addColorStop(0, '#040612');
    skyGrad.addColorStop(1, '#0c1232');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 600, 340);

    // Background faint stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 60; i++) {
      const bx = (i * 137) % 600;
      const by = (i * 79) % 340;
      ctx.fillRect(bx, by, 1.2, 1.2);
    }

    // Connected Lines
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    cur.connections.forEach(([o1, o2]) => {
      if (this.connectedStars.includes(o1) && this.connectedStars.includes(o2)) {
        const s1 = cur.stars.find(s => s.order === o1);
        const s2 = cur.stars.find(s => s.order === o2);
        if (s1 && s2) {
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
        }
      }
    });
    ctx.stroke();

    // Stars
    cur.stars.forEach(star => {
      const isLinked = this.connectedStars.includes(star.order);

      ctx.beginPath();
      ctx.arc(star.x, star.y, isLinked ? 12 : 8, 0, Math.PI * 2);
      ctx.fillStyle = isLinked ? '#ffd700' : 'rgba(255,255,255,0.6)';
      ctx.fill();

      if (isLinked) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Star Order & Name Label
      ctx.fillStyle = isLinked ? '#ffd700' : '#94a3b8';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${star.order}. ${star.label}`, star.x, star.y - 15);
    });

    if (this.connectedStars.length < cur.stars.length) {
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Sentuh bintang 1, 2, 3... untuk menggambar rasi bintang!', 300, 320);
    }
  }
}

export const spaceSandbox = new SpaceSandboxLab();
