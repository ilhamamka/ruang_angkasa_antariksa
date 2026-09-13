// Real-time Night Sky & Moon Phase Observatory for Indonesia
// Calculates today's actual live moon phase & visible bright sky objects

import { spaceAudio } from './audio.ts';

export interface MoonPhaseInfo {
  phaseNameId: string;
  phaseNameEn: string;
  phaseType: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  illuminationPct: number;
  ageDays: number;
  culturalNote: string;
  stargazingTip: string;
  svgIcon: string;
}

export class SkyTonightObservatory {
  private knownNewMoonEpoch = new Date('2024-01-11T11:57:00Z').getTime();
  private synodicMonthDays = 29.53058867;

  public getTodayMoonPhase(targetDate = new Date()): MoonPhaseInfo {
    const diffMs = targetDate.getTime() - this.knownNewMoonEpoch;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const ageDays = ((diffDays % this.synodicMonthDays) + this.synodicMonthDays) % this.synodicMonthDays;

    // Illumination 0% at new moon, 100% at full moon (approx day 14.76)
    const normalizedPhase = ageDays / this.synodicMonthDays; // 0 to 1
    const illuminationPct = Math.round((1 - Math.cos(normalizedPhase * 2 * Math.PI)) / 2 * 100);

    let phaseType: MoonPhaseInfo['phaseType'] = 'new';
    let phaseNameId = 'Bulan Baru (Mati)';
    let phaseNameEn = 'New Moon';
    let culturalNote = 'Langit sangat gelap tanpa cahaya bulan, saat terbaik untuk melihat jutaan bintang di langit malam!';
    let stargazingTip = 'Tengok ke langit malam ini: Taburan bintang Bima Sakti akan tampak paling terang berkilau!';

    if (ageDays < 1.8) {
      phaseType = 'new';
      phaseNameId = 'Bulan Baru / Hilal Awal';
      phaseNameEn = 'New Moon / Crescent';
      culturalNote = 'Hilal tipis penanda pergantian bulan baru dalam kalender penanggalan tradisional Nusantara.';
    } else if (ageDays < 7.0) {
      phaseType = 'waxing_crescent';
      phaseNameId = 'Bulan Sabit Awal';
      phaseNameEn = 'Waxing Crescent';
      culturalNote = 'Berbentuk seperti senyum melengkung di ufuk barat setelah matahari terbenam.';
      stargazingTip = 'Ajak ayah atau bunda ke jendela barat setelah Magrib untuk melihat lengkungan bulan sabit yang indah!';
    } else if (ageDays < 8.8) {
      phaseType = 'first_quarter';
      phaseNameId = 'Bulan Separuh (Kuartir Awal)';
      phaseNameEn = 'First Quarter';
      culturalNote = 'Bulan tampak seperti kue yang dipotong dua persis di tengah langit.';
      stargazingTip = 'Gunakan teropong kecil untuk melihat deretan kawah di garis pemisah bayangan bulan!';
    } else if (ageDays < 13.5) {
      phaseType = 'waxing_gibbous';
      phaseNameId = 'Bulan Cembung Awal';
      phaseNameEn = 'Waxing Gibbous';
      culturalNote = 'Bulan semakin membesar dan terang benderang menerangi lautan Indonesia.';
      stargazingTip = 'Cahaya bulan mulai terang, menyinari awan malam menjadi perak berkilau!';
    } else if (ageDays < 16.5) {
      phaseType = 'full';
      phaseNameId = 'Bulan Purnama (Penuh)';
      phaseNameEn = 'Full Moon';
      culturalNote = 'Bulan bulat sempurna seperti piring emas! Menandai waktu pasang air laut tertinggi bagi nelayan pesisir.';
      stargazingTip = 'Malam ini bulan sangat terang! Kamu bahkan bisa melihat bayangan dirimu sendiri di bawah sinar rembulan!';
    } else if (ageDays < 21.5) {
      phaseType = 'waning_gibbous';
      phaseNameId = 'Bulan Cembung Akhir';
      phaseNameEn = 'Waning Gibbous';
      culturalNote = 'Bulan mulai terbit lebih malam dan bentuknya perlahan menyusut kembali.';
      stargazingTip = 'Bulan terbit larut malam dengan warna kuning jingga temaram di ufuk timur.';
    } else if (ageDays < 23.5) {
      phaseType = 'last_quarter';
      phaseNameId = 'Bulan Separuh Akhir';
      phaseNameEn = 'Last Quarter';
      culturalNote = 'Separuh bulan terlihat di langit dini hari sebelum fajar menyingsing.';
      stargazingTip = 'Jika kamu bangun subuh, tengoklah ke langit atas: ada setengah bulan yang anggun!';
    } else {
      phaseType = 'waning_crescent';
      phaseNameId = 'Bulan Sabit Tua';
      phaseNameEn = 'Waning Crescent';
      culturalNote = 'Lengkungan sabit tipis yang terbit menemani bintang fajar menjelang matahari terbit.';
      stargazingTip = 'Lihat ke arah timur sebelum terbit fajar, kamu akan melihat bulan sabit berdampingan dengan Bintang Kejora!';
    }

    const svgIcon = this.generateMoonSvg(phaseType, illuminationPct);

    return {
      phaseNameId,
      phaseNameEn,
      phaseType,
      illuminationPct,
      ageDays: Math.round(ageDays * 10) / 10,
      culturalNote,
      stargazingTip,
      svgIcon
    };
  }

  private generateMoonSvg(type: MoonPhaseInfo['phaseType'], pct: number): string {
    const isDark = pct < 5;
    const isFull = pct > 95;

    if (isFull) {
      return `
        <svg width="80" height="80" viewBox="0 0 80 80" class="live-moon-svg">
          <circle cx="40" cy="40" r="34" fill="#fffbeb" stroke="#fef08a" stroke-width="3" filter="drop-shadow(0 0 16px rgba(254, 240, 138, 0.9))"/>
          <circle cx="28" cy="30" r="5" fill="#fde047" opacity="0.4"/>
          <circle cx="50" cy="48" r="7" fill="#fde047" opacity="0.3"/>
          <circle cx="44" cy="24" r="4" fill="#fde047" opacity="0.35"/>
        </svg>
      `;
    }

    if (isDark) {
      return `
        <svg width="80" height="80" viewBox="0 0 80 80" class="live-moon-svg">
          <circle cx="40" cy="40" r="34" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <circle cx="40" cy="40" r="32" stroke="#475569" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
        </svg>
      `;
    }

    return `
      <svg width="80" height="80" viewBox="0 0 80 80" class="live-moon-svg">
        <circle cx="40" cy="40" r="34" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <path d="M 40,6 A 34,34 0 0 1 40,74 A ${Math.max(2, (pct / 50 - 1) * 34)},34 0 0 ${pct > 50 ? '1' : '0'} 40,6" fill="#fef08a" filter="drop-shadow(0 0 10px rgba(254, 240, 138, 0.7))"/>
      </svg>
    `;
  }

  public renderWidget(container: HTMLElement) {
    const today = new Date();
    const info = this.getTodayMoonPhase(today);
    const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    container.innerHTML = `
      <div class="sky-tonight-card">
        <div class="sky-card-header">
          <div class="sky-title-badge">
            <span>🔭 OBSERVATORIUM LANGIT MALAM INI</span>
            <span class="live-date-pill">${dateStr}</span>
          </div>
          <button id="btn-listen-sky-tonight" class="btn-audio-sky" type="button" title="Dengarkan Panduan Langit">
            <span>🔊 Dengarkan Cerita Langit</span>
          </button>
        </div>

        <div class="sky-card-body">
          <div class="sky-moon-visual-col">
            ${info.svgIcon}
            <span class="moon-illum-badge">${info.illuminationPct}% Terang</span>
          </div>

          <div class="sky-moon-info-col">
            <h4 class="moon-phase-name">${info.phaseNameId}</h4>
            <p class="moon-cultural-note">${info.culturalNote}</p>
            <div class="sky-tonight-challenge">
              <strong>✨ Misi Mengintip Jendela Malam Ini:</strong>
              <p>${info.stargazingTip}</p>
            </div>
          </div>
        </div>

        <!-- Planet Visibility Guide Tonight -->
        <div class="sky-planets-ticker">
          <div class="sky-planet-item">
            <span class="p-icon">✨</span>
            <div>
              <strong>Bintang Kejora (Planet Venus)</strong>
              <small>Tampak paling terang berkilau di ufuk Barat saat senja!</small>
            </div>
          </div>
          <div class="sky-planet-item">
            <span class="p-icon">🪐</span>
            <div>
              <strong>Planet Saturnus</strong>
              <small>Tampak kuning keemasan di rasi bintang selatan.</small>
            </div>
          </div>
        </div>
      </div>
    `;

    const audioBtn = container.querySelector('#btn-listen-sky-tonight');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        spaceAudio.playCelestialChime();
        setTimeout(() => {
          spaceAudio.speakKids(
            `Halo anak pintar! Hari ini tanggal ${dateStr}. Di langit malam ini, bulan kita sedang berbentuk ${info.phaseNameId} dengan tingkat terang ${info.illuminationPct} persen. ${info.stargazingTip}`
          );
        }, 300);
      });
    }
  }
}

export const skyTonight = new SkyTonightObservatory();
