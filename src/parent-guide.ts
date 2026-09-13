// Parent & Educator Guide + Home Science Experiments & Learner Report Card
// Helps parents guide children through space science concepts and home experiments

import { badgesManager } from './badges-album.ts';

export class ParentGuideManager {
  private container: HTMLElement | null = null;

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
          <h2>Panduan Pendampingan & Rapor Belajar Antariksa</h2>
          <p>Membantu Ayah & Bunda menjelaskan konsep fisika, astronomi, dan teknologi luar angkasa dengan bahasa sederhana dan eksperimen seru di rumah!</p>
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
        </div>

        <!-- Section 2: 3 DIY Hands-on Home Experiments -->
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

        <!-- Section 3: Critical Thinking Discussion Starters -->
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
  }
}

export const parentGuideManager = new ParentGuideManager();
