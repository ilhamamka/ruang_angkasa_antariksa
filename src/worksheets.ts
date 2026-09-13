// Printable Cosmic Worksheets & Official Astronaut Certificate
// Supports print formatting (@media print) for home and classroom learning

import { badgesManager } from './badges-album.ts';
import { spaceAudio } from './audio.ts';

export class WorksheetsManager {
  private container: HTMLElement | null = null;
  private studentName: string = 'Astronot Cilik Indonesia';

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="worksheets-view">
        <!-- Header -->
        <div class="worksheets-header">
          <div>
            <h2>🖨️ Lembar Kerja Cetak & Sertifikat Resmi Astronot</h2>
            <p>Unduh atau cetak langsung materi belajar aktivitas fisik anak di rumah atau di sekolah!</p>
          </div>
          <button class="btn-print-trigger" id="btn-print-page">
            🖨️ Cetak / Simpan PDF
          </button>
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
              <span class="sheet-tag">LEMBAR AKTIVITAS 1</span>
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
              <span class="sheet-tag">LEMBAR AKTIVITAS 2</span>
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
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    if (!this.container) return;

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
  }
}

export const worksheetsManager = new WorksheetsManager();
