// Parent & Educator Guide + Home Science Experiments & Learner Report Card
// Helps parents guide children through space science concepts, screen time control, and home experiments

import { badgesManager } from './badges-album.ts';
import { spaceAudio } from './audio.ts';
import { commercial } from './commercial.ts';

export class ParentGuideManager {
  private container: HTMLElement | null = null;
  private screenTimeLimitMinutes: number = 30;
  private timerActive: boolean = true;
  private remainingSeconds: number = 30 * 60;
  private timerInterval: any = null;

  constructor() {
    // Load screen time preferences
    try {
      const saved = localStorage.getItem('space_screentime_limit');
      if (saved) {
        this.screenTimeLimitMinutes = parseInt(saved, 10);
        this.remainingSeconds = this.screenTimeLimitMinutes * 60;
      }
    } catch {}

    this.startGlobalScreenTimer();
  }

  private startGlobalScreenTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.screenTimeLimitMinutes <= 0) return; // 0 = unlimited

    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.timerInterval);
        this.showScreenTimeBreakModal();
      }
    }, 1000);
  }

  private updateTimerDisplay() {
    const el = document.getElementById('screentime-countdown');
    if (el) {
      const m = Math.floor(this.remainingSeconds / 60);
      const s = this.remainingSeconds % 60;
      el.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }
  }

  private showScreenTimeBreakModal() {
    spaceAudio.playPop(350);
    spaceAudio.speakKids('Hebat sekali belajarmu hari ini astronot cilik! Ayo istirahatkan matamu sejenak dan minum air putih ya!');

    // Show Break Modal
    let modal = document.getElementById('modal-screentime-break');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-screentime-break';
      modal.className = 'cosmic-modal-overlay active';
      modal.innerHTML = `
        <div class="cosmic-modal-card parent-gate-card">
          <div class="modal-header">
            <div>
              <span class="modal-kicker">KONTROL KESEHATAN ORANG TUA</span>
              <h2 class="modal-title">⏰ Waktunya Istirahat, Astronot Cilik! 🥛</h2>
            </div>
          </div>
          <p class="gate-desc">
            Batas waktu layar sehat untuk hari ini telah selesai. Menatap layar terlalu lama dapat membuat mata cepat lelah.
            <br><br>
            Ayo istirahatkan mata sejenak, regangkan badan, jalan-jalan di rumah, dan minum segelas air putih!
          </p>
          <div class="vip-payment-buttons" style="margin-top:20px;">
            <button id="btn-parent-extend-time" class="btn-activate-code" type="button">
              👨‍👩‍👧 Tambah 10 Menit (Khusus Orang Tua)
            </button>
            <button id="btn-close-break-modal" class="btn-demo-vip" type="button">
              Selesai Belajar Hari Ini
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const extendBtn = modal.querySelector('#btn-parent-extend-time');
      const closeBtn = modal.querySelector('#btn-close-break-modal');

      extendBtn?.addEventListener('click', () => {
        const q = commercial.generateParentGateQuestion();
        const ans = prompt(`Pertanyaan Keamanan Orang Tua:\n${q.question}`);
        if (ans && parseInt(ans, 10) === q.answer) {
          modal?.classList.remove('active');
          this.remainingSeconds = 10 * 60;
          this.startGlobalScreenTimer();
          alert('Waktu bermain ditambah 10 menit!');
        } else {
          alert('Jawaban salah! Istirahat tetap disarankan.');
        }
      });

      closeBtn?.addEventListener('click', () => {
        modal?.classList.remove('active');
      });
    } else {
      modal.classList.add('active');
    }
  }

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render() {
    if (!this.container) return;
    const stats = badgesManager.getStats();

    this.container.innerHTML = `
      <div class="parent-guide-view">
        <!-- Header -->
        <div class="guide-header">
          <div class="guide-badge">👨‍👩‍👧 ZONA PENDAMPING ORANG TUA & GURU</div>
          <h2>Panduan Kurikulum & Rapor Belajar Antariksa</h2>
          <p>Sesuai dengan Kurikulum Merdeka (PAUD Fase Fondasi s.d. SD Fase A/B/C) dengan pendekatan STEAM holistik, kontrol screen-time sehat, dan eksperimen seru di rumah!</p>
        </div>

        <!-- Section 1: Child Learner Report Card -->
        <div class="report-card-wrap">
          <div class="report-header">
            <h3>📈 Rapor Capaian Astronot Cilik</h3>
            <span class="report-date">Pembaruan Real-Time</span>
          </div>
          <div class="report-metrics-grid">
            <div class="report-metric-box">
              <span class="metric-val">⭐ ${stats.stars}</span>
              <span class="metric-label">Bintang Kosmik Diperoleh</span>
            </div>
            <div class="report-metric-box">
              <span class="metric-val">🏆 ${stats.xp}</span>
              <span class="metric-label">Total XP Penjelajah</span>
            </div>
            <div class="report-metric-box">
              <span class="metric-val">🪐 ${stats.planetsVisited.length}/9</span>
              <span class="metric-label">Planet & Benda Langit Diteliti</span>
            </div>
            <div class="report-metric-box">
              <span class="metric-val">🚀 ${stats.rocketsLaunched}</span>
              <span class="metric-label">Misi Roket Diluncurkan</span>
            </div>
            <div class="report-metric-box">
              <span class="metric-val">🎖️ ${stats.badges.filter(b => b.unlocked).length}/${stats.badges.length}</span>
              <span class="metric-label">Lencana Resmi Terbuka</span>
            </div>
          </div>
          
          <div class="report-share-row" style="margin-top: 18px; display: flex; gap: 12px; flex-wrap: wrap;">
            <button id="btn-share-report-wa" class="btn-pay-wa" style="text-decoration:none; padding: 10px 18px; font-size:14px;">
              📲 Bagikan Rapor Capaian ke WhatsApp Keluarga
            </button>
          </div>
        </div>

        <!-- Section 2: Health Screen Time Limiter -->
        <div class="report-card-wrap screentime-settings-box">
          <div class="report-header">
            <h3>⏰ Pengatur Batas Waktu Layar Sehat (Screen-Time)</h3>
            <span class="report-date">Sisa Waktu: <strong id="screentime-countdown">${Math.floor(this.remainingSeconds / 60)}m</strong></span>
          </div>
          <p style="font-size:14px; color:var(--space-text-dim); margin-bottom: 12px;">
            Mencegah kelelahan mata anak dengan alarm pengingat istirahat otomatis yang ramah anak.
          </p>
          <div class="screentime-options" style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn-time-opt ${this.screenTimeLimitMinutes === 15 ? 'active' : ''}" data-mins="15">15 Menit (PAUD/TK)</button>
            <button class="btn-time-opt ${this.screenTimeLimitMinutes === 30 ? 'active' : ''}" data-mins="30">30 Menit (SD 1-3)</button>
            <button class="btn-time-opt ${this.screenTimeLimitMinutes === 45 ? 'active' : ''}" data-mins="45">45 Menit (SD 4-6)</button>
            <button class="btn-time-opt ${this.screenTimeLimitMinutes === 0 ? 'active' : ''}" data-mins="0">Tanpa Batas</button>
          </div>
        </div>

        <!-- Section 3: Kurikulum Merdeka Mapping Table -->
        <div class="report-card-wrap">
          <div class="report-header">
            <h3>🇮🇩 Peta Integrasi Kurikulum Merdeka (PAUD s.d. SD)</h3>
            <span class="report-date">Standar Kemendikbudristek RI</span>
          </div>
          <div class="curriculum-table-responsive" style="overflow-x:auto;">
            <table class="curriculum-table" style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--space-card-border); color: var(--space-cyan);">
                  <th style="padding:10px;">Fase / Tingkat</th>
                  <th style="padding:10px;">Muatan Pembelajaran</th>
                  <th style="padding:10px;">Capaian Pembelajaran (CP)</th>
                  <th style="padding:10px;">Modul Terintegrasi di Game</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <td style="padding:10px;"><b>Fase Fondasi (PAUD/TK, Usia 4-6 thn)</b></td>
                  <td style="padding:10px;">Literasi Dini, Numerasi & STEAM</td>
                  <td style="padding:10px;">Mengenal ciptaan langit, membandingkan ukuran (analogi buah), mengurutkan planet 1-8.</td>
                  <td style="padding:10px;">🌟 Jalur Astronot Cilik (Tahap 1 & 2)</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <td style="padding:10px;"><b>Fase A (SD Kelas 1-2, Usia 7-8 thn)</b></td>
                  <td style="padding:10px;">IPAS & Pendidikan Karakter</td>
                  <td style="padding:10px;">Mengenal siang-malam, peran Matahari, dan menjaga Bumi sebagai rumah kehidupan.</td>
                  <td style="padding:10px;">🌍 Tata Surya 3D & Kuis Pemula</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <td style="padding:10px;"><b>Fase B (SD Kelas 3-4, Usia 9-10 thn)</b></td>
                  <td style="padding:10px;">IPAS (Bumi & Antariksa)</td>
                  <td style="padding:10px;">Karakteristik 8 planet, planet batuan vs gas raksasa, gravitasi, dan fase Bulan.</td>
                  <td style="padding:10px;">🪐 Oreri Tata Surya & Eksiklopedi</td>
                </tr>
                <tr>
                  <td style="padding:10px;"><b>Fase C & SMP (SD Kelas 5-6 / SMP)</b></td>
                  <td style="padding:10px;">Fisika, Teknologi & Rekayasa</td>
                  <td style="padding:10px;">Hukum III Newton peluncuran roket, rasio TWR, siklus hidup bintang & lubang hitam.</td>
                  <td style="padding:10px;">🚀 Bengkel Roket Modular & Kosmos Dalam</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 4: Rubrik Penilaian Guru / Orang Tua -->
        <div class="report-card-wrap">
          <div class="report-header">
            <h3>📋 Rubrik Asesmen Capaian Anak (Format Standar Guru)</h3>
          </div>
          <div class="rubric-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px;">
            <div class="rubric-card" style="background:rgba(255,255,255,0.04); padding:14px; border-radius:8px;">
              <h4 style="color:#ffd700; margin-bottom:6px;">🌟 BSB (Berkembang Sangat Baik)</h4>
              <p style="font-size:13px; color:var(--space-text-dim);">Anak mampu mengidentifikasi 8 planet mandiri, menjelaskan prinsip aksi-reaksi roket balon, dan aktif mengajukan pertanyaan kritis.</p>
            </div>
            <div class="rubric-card" style="background:rgba(255,255,255,0.04); padding:14px; border-radius:8px;">
              <h4 style="color:#00e5ff; margin-bottom:6px;">👍 BSH (Berkembang Sesuai Harapan)</h4>
              <p style="font-size:13px; color:var(--space-text-dim);">Anak mampu menyusun urutan planet dengan sedikit petunjuk suara, dan menyelesaikan kuis antariksa dengan skor di atas 70%.</p>
            </div>
            <div class="rubric-card" style="background:rgba(255,255,255,0.04); padding:14px; border-radius:8px;">
              <h4 style="color:#ff9800; margin-bottom:6px;">🌱 MB (Mulai Berkembang)</h4>
              <p style="font-size:13px; color:var(--space-text-dim);">Anak mulai tertarik menyimak narasi suara planet, merakit baju astronot, dan memerlukan pendampingan visual interaktif.</p>
            </div>
          </div>
        </div>

        <!-- Section 5: 3 DIY Hands-on Home Experiments -->
        <div class="experiments-section">
          <h3>🧪 3 Eksperimen Sains Seru di Rumah (Tanpa Alat Rumit!)</h3>
          
          <div class="experiments-grid">
            <!-- Experiment 1 -->
            <div class="experiment-card">
              <div class="exp-badge">EKSPERIMEN 1 · FISIKA ROKET</div>
              <h4>🎈 Roket Balon Meluncur (Hukum III Newton)</h4>
              <p class="exp-aim"><strong>Tujuan:</strong> Membuktikan aksi semburan udara menghasilkan reaksi gerak maju.</p>
              <div class="exp-items">
                <strong>Alat & Bahan:</strong>
                <ul>
                  <li>1 buah balon karet panjang/bulat</li>
                  <li>Benang kasur atau tali nilon (3-4 meter)</li>
                  <li>1 batang sedotan plastik</li>
                  <li>Selotip & jepitan jemuran</li>
                </ul>
              </div>
              <div class="exp-steps">
                <strong>Cara Kerja:</strong>
                <ol>
                  <li>Masukkan tali ke dalam sedotan, lalu bentangkan tali secara horizontal di ruangan dan ikat kedua ujungnya di kursi atau gagang pintu.</li>
                  <li>Tiup balon hingga besar, jepit leher balon (jangan diikat). Tempelkan badan balon ke sedotan menggunakan selotip.</li>
                  <li>Tarik balon ke salah satu ujung tali, lalu lepaskan jepitannya! Udara menyembur ke belakang dan roket balon melesat kencang ke depan!</li>
                </ol>
              </div>
            </div>

            <!-- Experiment 2 -->
            <div class="experiment-card">
              <div class="exp-badge">EKSPERIMEN 2 · GEOLOGI PLANET</div>
              <h4>☄️ Kawah Meteorit Tepung & Cokelat</h4>
              <p class="exp-aim"><strong>Tujuan:</strong> Melihat bagaimana kawah di Bulan dan Merkurius terbentuk akibat tumbukan meteorit.</p>
              <div class="exp-items">
                <strong>Alat & Bahan:</strong>
                <ul>
                  <li>1 buah nampan atau baskom datar</li>
                  <li>Tepung terigu (setebal 3 cm)</li>
                  <li>Bubuk cokelat atau kopi instan (taburan tipis di atas tepung)</li>
                  <li>Kelereng atau batu kecil dengan variasi ukuran</li>
                </ul>
              </div>
              <div class="exp-steps">
                <strong>Cara Kerja:</strong>
                <ol>
                  <li>Ratakan tepung terigu di dalam nampan, lalu ayak bubuk cokelat di atasnya hingga membentuk lapisan warna gelap yang kontras.</li>
                  <li>Minta anak menjatuhkan kelereng dari ketinggian 30 cm, lalu dari ketinggian 1 meter.</li>
                  <li>Amati bersama: Tumbukan kelereng menciptakan cekungan kawah dengan pola semburan putih (ejecta rays) yang mirip kawah Tycho di Bulan!</li>
                </ol>
              </div>
            </div>

            <!-- Experiment 3 -->
            <div class="experiment-card">
              <div class="exp-badge">EKSPERIMEN 3 · ASTRONOMI BULAN</div>
              <h4>🍪 Fase Bulan Lezat dengan Biskuit Krim</h4>
              <p class="exp-aim"><strong>Tujuan:</strong> Mengenal perubahan penampakan Bulan (Sabit, Separuh, Purnama).</p>
              <div class="exp-items">
                <strong>Alat & Bahan:</strong>
                <ul>
                  <li>4-8 keping biskuit sandwich cokelat dengan krim vanila putih</li>
                  <li>1 buah sendok teh atau stik es krim</li>
                  <li>Piring saji datar</li>
                </ul>
              </div>
              <div class="exp-steps">
                <strong>Cara Kerja:</strong>
                <ol>
                  <li>Buka keping biskuit dengan hati-hati agar krim putih menempel di salah satu sisi.</li>
                  <li>Gunakan sendok untuk mengikis sebagian krim: biarkan 1 keping utuh (Bulan Purnama), kikis setengah (Bulan Separuh / Kuartal), kikis membentuk lekukan sabit (Bulan Sabit), dan bersihkan krim seluruhnya (Bulan Baru / Mati).</li>
                  <li>Susun melingkar di atas piring dan diskusikan bagaimana posisi Matahari memantulkan cahaya ke permukaan Bulan!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 6: Critical Thinking Discussion Starters -->
        <div class="discussion-prompts-box">
          <h3>💬 4 Pertanyaan Pemantik Diskusi Kritis Bersama Anak</h3>
          <ul>
            <li>"Kira-kira apa yang akan terjadi ya kalau planet Bumi kita tidak memiliki atmosfer pelindung seperti Merkurius?"</li>
            <li>"Mengapa para astronot di stasiun ISS harus berolahraga di atas treadmill khusus setiap hari?"</li>
            <li>"Jika kamu menjadi penemu roket, bahan bakar apa yang ingin kamu ciptakan agar roket bisa terbang sampai ke planet terjauh?"</li>
            <li>"Menurutmu, mengapa para ilmuwan sangat penasaran meneliti apakah ada air di planet Mars?"</li>
          </ul>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    if (!this.container) return;

    // WhatsApp Share Report Button
    const shareWaBtn = this.container.querySelector('#btn-share-report-wa');
    if (shareWaBtn) {
      shareWaBtn.addEventListener('click', () => {
        const stats = badgesManager.getStats();
        const text = `Halo Keluarga! 👋🚀\n\n` +
          `Lihat Rapor Capaian Belajar Kosmos Cilik ananda:\n` +
          `⭐ Bintang Kosmik: ${stats.stars}\n` +
          `🏆 Total Skor XP: ${stats.xp}\n` +
          `🪐 Planet Diteliti: ${stats.planetsVisited.length}/9 Benda Langit\n` +
          `🚀 Misi Roket: ${stats.rocketsLaunched} Peluncuran Berhasil\n` +
          `🎖️ Lencana Resmi: ${stats.badges.filter(b => b.unlocked).length} Lencana Terbuka\n\n` +
          `Belajar sains antariksa jadi seru, interaktif, dan sesuai Kurikulum Merdeka! 🇮🇩✨`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      });
    }

    // Screen-time options
    const timeOptBtns = this.container.querySelectorAll('.btn-time-opt');
    timeOptBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const mins = parseInt(target.getAttribute('data-mins') || '30', 10);
        this.screenTimeLimitMinutes = mins;
        this.remainingSeconds = mins * 60;
        try {
          localStorage.setItem('space_screentime_limit', String(mins));
        } catch {}

        timeOptBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        this.startGlobalScreenTimer();
        alert(`Batas waktu layar diatur ke: ${mins > 0 ? `${mins} Menit` : 'Tanpa Batas'}`);
      });
    });
  }
}

export const parentGuideManager = new ParentGuideManager();

