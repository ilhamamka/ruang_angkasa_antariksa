// Freeplay Cosmic Sandbox & Planetary Gravity Laboratory
// Calculates child body weights on different planets & interactive freeform experiments

import { CELESTIAL_BODIES } from './planets-data.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';

export class SpaceSandboxLab {
  private container: HTMLElement | null = null;
  private earthWeightKg: number = 30;

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public unmount() {
    // cleanup
  }

  private render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="sandbox-lab-view">
        <!-- Section 1: Cosmic Gravity Laboratory -->
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
              <button class="btn-weight-step" id="btn-weight-minus">- 5</button>
              <input type="number" id="input-earth-weight" value="${this.earthWeightKg}" min="10" max="150" />
              <span class="weight-unit">kg</span>
              <button class="btn-weight-step" id="btn-weight-plus">+ 5</button>
            </div>
          </div>

          <!-- Planetary Gravity Comparison Cards Grid -->
          <div class="gravity-cards-grid" id="gravity-cards-grid">
            ${this.renderGravityCards()}
          </div>
        </div>

        <!-- Section 2: Zero-Gravity Astronaut Training Tips -->
        <div class="astronaut-life-card">
          <h3>👨‍🚀 Fakta Kehidupan di Gravitasi Nol (Mikrogravitasi)</h3>
          <div class="training-tips-grid">
            <div class="tip-card">
              <span class="tip-emoji">🛏️</span>
              <h4>Tidur di Dalam Kantung Dinding</h4>
              <p>Astronot tidur di kantung tidur khusus yang diikat ke dinding stasiun agar tidak melayang menabrak tombol instrumen!</p>
            </div>
            <div class="tip-card">
              <span class="tip-emoji">💧</span>
              <h4>Air Membentuk Bola Sempurna</h4>
              <p>Di luar angkasa, tetesan air tidak mengalir ke bawah melainkan melayang membentuk bola-bola jernih yang bisa disedot melayang!</p>
            </div>
            <div class="tip-card">
              <span class="tip-emoji">🏋️‍♂️</span>
              <h4>Wajib Olahraga 2 Jam Tiap Hari</h4>
              <p>Karena tidak melawan gravitasi Bumi, otot dan tulang astronot bisa melemah jika tidak berolahraga dengan treadmill dan sepeda khusus setiap hari!</p>
            </div>
            <div class="tip-card">
              <span class="tip-emoji">🥪</span>
              <h4>Makanan Tanpa Remah (Tortilla)</h4>
              <p>Astronot menggunakan roti tortilla lembut alih-alih roti tawar biasa, agar remah-remah roti tidak melayang masuk ke mata atau menyumbat ventilasi!</p>
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
      return `
        <div class="planet-weight-card">
          <div class="pw-header">
            <h4>${t.name}</h4>
            <span class="pw-ratio">${t.ratio}g</span>
          </div>
          <div class="pw-value-box">
            <span class="pw-number">${calculatedWeight}</span>
            <span class="pw-kg">kg</span>
          </div>
          <p class="pw-fun">${t.fun}</p>
        </div>
      `;
    }).join('');
  }

  private attachEvents() {
    if (!this.container) return;

    const input = this.container.querySelector('#input-earth-weight') as HTMLInputElement;
    const minusBtn = this.container.querySelector('#btn-weight-minus');
    const plusBtn = this.container.querySelector('#btn-weight-plus');

    const updateWeight = (newVal: number) => {
      this.earthWeightKg = Math.max(10, Math.min(150, newVal));
      if (input) input.value = this.earthWeightKg.toString();
      const grid = this.container?.querySelector('#gravity-cards-grid');
      if (grid) {
        grid.innerHTML = this.renderGravityCards();
      }
      spaceAudio.playPop(480);
      badgesManager.unlockBadge('gravity_master');
    };

    if (input) {
      input.addEventListener('change', () => {
        updateWeight(parseInt(input.value || '30', 10));
      });
    }

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        updateWeight(this.earthWeightKg - 5);
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        updateWeight(this.earthWeightKg + 5);
      });
    }
  }
}

export const spaceSandbox = new SpaceSandboxLab();
