// Printable Cosmic Worksheets & Official Astronaut Certificate
// Supports print formatting (@media print) for home and classroom learning

import { badgesManager } from './badges-album.ts';
import { spaceAudio } from './audio.ts';
import { digitalColoringStudio } from './coloring-studio.ts';

export class WorksheetsManager {
  private container: HTMLElement | null = null;
  private studentName: string = 'Astronot Cilik Indonesia';
  private activeTab: 'digital' | 'print' = 'digital';

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="worksheets-view">
        <!-- Dual Mode Navigation Bar -->
        <div class="worksheets-mode-tabs no-print">
          <button class="btn-ws-mode ${this.activeTab === 'digital' ? 'active' : ''}" id="tab-btn-digital" type="button">
            <span>🎨 Studio Mewarnai Digital (Langsung di Layar)</span>
          </button>
          <button class="btn-ws-mode ${this.activeTab === 'print' ? 'active' : ''}" id="tab-btn-print" type="button">
            <span>🖨️ Lembar Cetak Kertas & Sertifikat Resmi</span>
          </button>
        </div>

        <!-- Mode 1: Digital Coloring Studio Container -->
        <div id="ws-content-digital" class="ws-tab-pane ${this.activeTab === 'digital' ? 'active' : ''}">
          <div id="digital-coloring-mount"></div>
        </div>

        <!-- Mode 2: Printable Worksheets & Official Certificate Container -->
        <div id="ws-content-print" class="ws-tab-pane ${this.activeTab === 'print' ? 'active' : ''}">
          <!-- Header -->
          <div class="worksheets-header">
            <div>
              <h2>🖨️ Lembar Kerja Cetak & Sertifikat Resmi Astronot</h2>
              <p>Unduh atau cetak langsung materi belajar aktivitas fisik anak di rumah atau di sekolah!</p>
            </div>
            <div class="worksheets-actions no-print">
              <button class="btn-print-trigger" id="btn-print-page">
                🖨️ Cetak / Simpan PDF
              </button>
              <button class="btn-download-png" id="btn-download-cert-png">
                📥 Unduh Piagam (PNG HD)
              </button>
            </div>
          </div>

          <!-- Section 1: Official Astronaut Certificate -->
          <div class="certificate-section-wrap">
          <div class="cert-input-row no-print">
            <label for="input-student-name">Masukkan Nama Anak / Siswa:</label>
            <input type="text" id="input-student-name" value="${this.studentName}" placeholder="Ketik nama lengkap..." />
          </div>

          <div class="official-certificate-sheet" id="printable-certificate">
            <div class="cert-inner-border">
              <div class="cert-watermark">🚀</div>
              <div class="cert-header">
                <span class="cert-badge">🇮🇩 BADAN ANTARIKSA CILIK INDONESIA</span>
                <h1>SERTIFIKAT KELULUSAN MISI</h1>
                <p class="cert-subtitle">Diberikan secara resmi kepada Astronot Hebat:</p>
              </div>

              <div class="cert-recipient-box">
                <h2 id="cert-display-name">${this.studentName}</h2>
              </div>

              <div class="cert-body-copy">
                <p>Telah berhasil menyelesaikan seluruh rangkaian ekspedisi edukasi antariksa: Menjelajahi 8 Planet Tata Surya, Menguasai Prinsip Fisika & Perakitan Roket, serta Menelusuri Misteri Kelahiran Bintang dan Lubang Hitam.</p>
              </div>

              <div class="cert-footer">
                <div class="cert-signature-block">
                  <div class="cert-sig-line"></div>
                  <span>Komandan Misi Kosmik</span>
                </div>
                <div class="cert-seal">
                  <div class="seal-circle">
                    <span>★ RESMI ★</span>
                    <span>KOSMOS</span>
                    <span>2026</span>
                  </div>
                </div>
                <div class="cert-signature-block">
                  <div class="cert-sig-line"></div>
                  <span>Guru / Pendamping Rumah</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Printable Worksheets Grid -->
        <div class="printable-sheets-grid">
          <!-- Sheet 1: Planet Matching Line Worksheet -->
          <div class="printable-sheet-card">
            <div class="sheet-top">
              <span class="sheet-tag">LEMBAR AKTIVITAS 1 · LITERASI SAINS</span>
              <h3>Tarik Garis: Hubungkan Planet & Fakta Menariknya</h3>
            </div>
            <div class="matching-preview-box">
              <div class="match-col">
                <div class="match-item">🔴 1. Planet Mars</div>
                <div class="match-item">🪐 2. Planet Saturnus</div>
                <div class="match-item">☀️ 3. Sang Matahari</div>
                <div class="match-item">🌀 4. Planet Jupiter</div>
              </div>
              <div class="match-dots">
                <span>○ ......... ○</span>
                <span>○ ......... ○</span>
                <span>○ ......... ○</span>
                <span>○ ......... ○</span>
              </div>
              <div class="match-col">
                <div class="match-item">A. Badai Bintik Merah Raksasa</div>
                <div class="match-item">B. Cincin es paling megah di tata surya</div>
                <div class="match-item">C. Memiliki gunung tertinggi Olympus Mons</div>
                <div class="match-item">D. Bintang induk pusat gravitasi tata surya</div>
              </div>
            </div>
          </div>

          <!-- Sheet 2: Rocket Maze Challenge -->
          <div class="printable-sheet-card">
            <div class="sheet-top">
              <span class="sheet-tag">LEMBAR AKTIVITAS 2 · MOTORIK HALUS</span>
              <h3>Labirin Kosmik: Pandu Roket Apollo Menuju Bulan!</h3>
            </div>
            <div class="maze-preview-art">
              <svg viewBox="0 0 300 160" class="maze-svg">
                <rect x="10" y="10" width="280" height="140" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
                <path d="M 40 10 L 40 80 L 90 80 L 90 40 L 140 40 L 140 120 L 70 120" stroke="#334155" stroke-width="2" fill="none"/>
                <path d="M 180 10 L 180 90 L 230 90 L 230 50 L 270 50" stroke="#334155" stroke-width="2" fill="none"/>
                <path d="M 120 150 L 120 110 L 200 110 L 200 140" stroke="#334155" stroke-width="2" fill="none"/>
                <text x="15" y="30" font-size="14">🚀 Mulai</text>
                <text x="240" y="140" font-size="14">🌕 Bulan</text>
              </svg>
            </div>
          </div>

          <!-- Sheet 3: Coloring Astronaut & Rocket -->
          <div class="printable-sheet-card">
            <div class="sheet-top">
              <span class="sheet-tag">LEMBAR AKTIVITAS 3 · KREATIVITAS & SENI</span>
              <h3>Mewarnai: Baju Astronot & Roket Jelajah Antariksa</h3>
            </div>
            <div class="coloring-preview-art">
              <svg viewBox="0 0 300 160" class="coloring-svg">
                <rect x="5" y="5" width="290" height="150" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="8"/>
                <!-- Outline Helmet -->
                <circle cx="80" cy="65" r="32" fill="none" stroke="#1e293b" stroke-width="2.5"/>
                <ellipse cx="80" cy="65" rx="20" ry="14" fill="#f1f5f9" stroke="#1e293b" stroke-width="2"/>
                <!-- Outline Body Suit -->
                <path d="M 55 98 C 55 90, 105 90, 105 98 L 110 145 L 50 145 Z" fill="none" stroke="#1e293b" stroke-width="2.5"/>
                <!-- Outline Rocket -->
                <path d="M 210 25 C 225 45, 235 75, 235 115 L 185 115 C 185 75, 195 45, 210 25 Z" fill="none" stroke="#1e293b" stroke-width="2.5"/>
                <circle cx="210" cy="70" r="12" fill="none" stroke="#1e293b" stroke-width="2"/>
                <polygon points="185,100 165,125 185,120" fill="none" stroke="#1e293b" stroke-width="2"/>
                <polygon points="235,100 255,125 235,120" fill="none" stroke="#1e293b" stroke-width="2"/>
                <text x="25" y="24" font-size="11" fill="#64748b">🎨 Beri warna kesukaanmu!</text>
              </svg>
            </div>
          </div>

          <!-- Sheet 4: Counting & Number Writing 1-8 -->
          <div class="printable-sheet-card">
            <div class="sheet-top">
              <span class="sheet-tag">LEMBAR AKTIVITAS 4 · NUMERASI DINI</span>
              <h3>Hitung Bintang & Tuliskan Urutan 8 Planet</h3>
            </div>
            <div class="math-preview-art">
              <div class="math-grid-box">
                <div class="math-cell">1. ☀️ Merkurius [ ___ ]</div>
                <div class="math-cell">2. 🟡 Venus [ ___ ]</div>
                <div class="math-cell">3. 🌍 Bumi [ ___ ]</div>
                <div class="math-cell">4. 🔴 Mars [ ___ ]</div>
                <div class="math-cell">5. 🌀 Jupiter [ ___ ]</div>
                <div class="math-cell">6. 🪐 Saturnus [ ___ ]</div>
                <div class="math-cell">7. ❄️ Uranus [ ___ ]</div>
                <div class="math-cell">8. 🌊 Neptunus [ ___ ]</div>
              </div>
              <p class="math-hint-note">⭐ Hitung berapa jumlah planet batuan dan planet gas raksasa!</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    if (this.activeTab === 'digital') {
      const digitalMount = this.container.querySelector('#digital-coloring-mount') as HTMLElement | null;
      if (digitalMount) digitalColoringStudio.mount(digitalMount);
    }
  }

  private attachEvents() {
    if (!this.container) return;

    // Tab Switching
    const tabDigital = this.container.querySelector('#tab-btn-digital');
    const tabPrint = this.container.querySelector('#tab-btn-print');
    const paneDigital = this.container.querySelector('#ws-content-digital');
    const panePrint = this.container.querySelector('#ws-content-print');

    tabDigital?.addEventListener('click', () => {
      this.activeTab = 'digital';
      tabDigital.classList.add('active');
      tabPrint?.classList.remove('active');
      paneDigital?.classList.add('active');
      panePrint?.classList.remove('active');
      spaceAudio.playPop(520);
      const digitalMount = this.container?.querySelector('#digital-coloring-mount') as HTMLElement | null;
      if (digitalMount) digitalColoringStudio.mount(digitalMount);
    });

    tabPrint?.addEventListener('click', () => {
      this.activeTab = 'print';
      tabPrint.classList.add('active');
      tabDigital?.classList.remove('active');
      panePrint?.classList.add('active');
      paneDigital?.classList.remove('active');
      spaceAudio.playPop(480);
    });

    const nameInput = this.container.querySelector('#input-student-name') as HTMLInputElement;
    const nameDisplay = this.container.querySelector('#cert-display-name');

    if (nameInput && nameDisplay) {
      nameInput.addEventListener('input', () => {
        this.studentName = nameInput.value || 'Astronot Cilik Indonesia';
        nameDisplay.textContent = this.studentName;
      });
    }

    const printBtn = this.container.querySelector('#btn-print-page');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        spaceAudio.playFanfare();
        badgesManager.unlockBadge('grand_commander');
        window.print();
      });
    }

    const downloadBtn = this.container.querySelector('#btn-download-cert-png');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadCertificateImage();
      });
    }
  }

  // Generate crisp 1200x850 HD Certificate PNG using native HTML Canvas
  private downloadCertificateImage() {
    spaceAudio.playFanfare();
    badgesManager.unlockBadge('grand_commander');

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Cosmic Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGrad.addColorStop(0, '#0a0f24');
    bgGrad.addColorStop(0.5, '#15193c');
    bgGrad.addColorStop(1, '#060919');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // 2. Stars pattern in background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 90; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * 1200;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * 850;
      const sr = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Ornate Double Gold Border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 8;
    ctx.strokeRect(35, 35, 1130, 780);

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 1104, 754);

    // Corner decorative circles
    const corners = [[35, 35], [1165, 35], [35, 815], [1165, 815]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
    });

    // 4. Agency Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('🇮🇩 BADAN ANTARIKSA CILIK INDONESIA', 600, 120);

    // 5. Title
    ctx.fillStyle = '#ffd700';
    ctx.font = '900 46px system-ui, -apple-system, sans-serif';
    ctx.fillText('SERTIFIKAT KELULUSAN MISI', 600, 185);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Diberikan secara resmi kepada Astronot Hebat:', 600, 235);

    // 6. Name Box
    ctx.fillStyle = 'rgba(255, 215, 0, 0.12)';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(250, 270, 700, 95, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
    ctx.fillText(this.studentName, 600, 335);

    // 7. Body Statement
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px system-ui, -apple-system, sans-serif';
    ctx.fillText('Telah berhasil menyelesaikan seluruh rangkaian ekspedisi edukasi antariksa:', 600, 420);
    ctx.fillText('Menjelajahi 8 Planet Tata Surya, Menguasai Prinsip Fisika & Perakitan Roket,', 600, 455);
    ctx.fillText('serta Menelusuri Misteri Kelahiran Bintang dan Lubang Hitam.', 600, 490);

    // 8. Seal / Badge
    ctx.beginPath();
    ctx.arc(600, 620, 65, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(600, 620, 58, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('★ RESMI ★', 600, 600);
    ctx.font = '900 20px system-ui, sans-serif';
    ctx.fillText('KOSMOS', 600, 625);
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('2026', 600, 645);

    // 9. Signatures
    // Left: Commander
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 680);
    ctx.lineTo(380, 680);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Komandan Misi Kosmik', 280, 710);

    // Right: Teacher/Parent
    ctx.beginPath();
    ctx.moveTo(820, 680);
    ctx.lineTo(1020, 680);
    ctx.stroke();

    ctx.fillText('Guru / Pendamping Rumah', 920, 710);

    // 10. Trigger Download
    const cleanName = this.studentName.replace(/[^a-zA-Z0-9]/g, '_');
    const link = document.createElement('a');
    link.download = `Sertifikat-Astronot-${cleanName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

export const worksheetsManager = new WorksheetsManager();
