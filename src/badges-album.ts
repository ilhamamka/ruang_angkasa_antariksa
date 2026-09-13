// Cosmic Badges & Achievements Album
// Tracks learner milestones, persistence in localStorage, and celebratory triggers

import { spaceAudio } from './audio.ts';

export interface CosmicBadge {
  id: string;
  icon: string;
  titleId: string;
  titleEn: string;
  requirementId: string;
  requirementEn: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

const DEFAULT_BADGES: CosmicBadge[] = [
  {
    id: 'cadet_welcome',
    icon: '🚀',
    titleId: 'Kadet Antariksa',
    titleEn: 'Space Cadet',
    requirementId: 'Memulai perjalanan edukasi ruang angkasa untuk pertama kalinya.',
    requirementEn: 'Commenced the space exploration voyage for the first time.',
    unlocked: true,
    unlockedAt: 'Hari ini',
    xpReward: 50
  },
  {
    id: 'solar_explorer',
    icon: '🪐',
    titleId: 'Nakhoda Tata Surya',
    titleEn: 'Solar Navigator',
    requirementId: 'Menjelajahi semua 9 objek langit di Tata Surya.',
    requirementEn: 'Inspected all planetary bodies across the solar system.',
    unlocked: false,
    xpReward: 150
  },
  {
    id: 'rocket_engineer',
    icon: '🛠️',
    titleId: 'Insinyur Roket Handal',
    titleEn: 'Rocket Engineer',
    requirementId: 'Berhasil merakit dan meluncurkan roket ke orbit bumi.',
    requirementEn: 'Assembled and launched a multi-stage rocket into Earth orbit.',
    unlocked: false,
    xpReward: 200
  },
  {
    id: 'moon_walker',
    icon: '🌕',
    titleId: 'Penjelajah Bulan Apollo',
    titleEn: 'Lunar Pioneer',
    requirementId: 'Mempelajari misi pendaratan manusia di Bulan (Apollo 11).',
    requirementEn: 'Explored the Apollo 11 human lunar landing mission.',
    unlocked: false,
    xpReward: 100
  },
  {
    id: 'gravity_master',
    icon: '⚖️',
    titleId: 'Ahli Gravitasi Kosmik',
    titleEn: 'Gravity Physicist',
    requirementId: 'Menguji timbangan berat badan di lab gravitasi antariksa.',
    requirementEn: 'Tested planetary body weights on the cosmic gravity scale.',
    unlocked: false,
    xpReward: 100
  },
  {
    id: 'star_watcher',
    icon: '⭐',
    titleId: 'Pengamat Bintang & Supernova',
    titleEn: 'Stellar Astronomer',
    requirementId: 'Menelusuri siklus hidup bintang dari nebula hingga lubang hitam.',
    requirementEn: 'Traced the stellar life cycle from stellar nursery to black hole.',
    unlocked: false,
    xpReward: 150
  },
  {
    id: 'quiz_ace',
    icon: '🧠',
    titleId: 'Jenius Kuis Antariksa',
    titleEn: 'Cosmic Quiz Ace',
    requirementId: 'Menjawab 5 pertanyaan kuis misi antariksa dengan benar.',
    requirementEn: 'Answered 5 space mission questions accurately.',
    unlocked: false,
    xpReward: 200
  },
  {
    id: 'grand_commander',
    icon: '🎖️',
    titleId: 'Komandan Kosmik Indonesia',
    titleEn: 'Grand Cosmic Commander',
    requirementId: 'Membuka seluruh materi dan mencetak Sertifikat Astronot Cilik.',
    requirementEn: 'Completed all space modules and printed the official astronaut certificate.',
    unlocked: false,
    xpReward: 500
  }
];

const STORAGE_KEY = 'ruang_angkasa_user_data_v1';

export interface UserStats {
  xp: number;
  stars: number;
  planetsVisited: string[];
  rocketsLaunched: number;
  quizzesCorrect: number;
  badges: CosmicBadge[];
}

export class BadgesManager {
  private stats: UserStats;

  constructor() {
    this.stats = this.loadStats();
  }

  private loadStats(): UserStats {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          xp: parsed.xp || 50,
          stars: parsed.stars || 1,
          planetsVisited: parsed.planetsVisited || [],
          rocketsLaunched: parsed.rocketsLaunched || 0,
          quizzesCorrect: parsed.quizzesCorrect || 0,
          badges: DEFAULT_BADGES.map(defBadge => {
            const found = parsed.badges?.find((b: CosmicBadge) => b.id === defBadge.id);
            return found ? { ...defBadge, ...found } : defBadge;
          })
        };
      }
    } catch {
      // fallback
    }

    return {
      xp: 50,
      stars: 1,
      planetsVisited: [],
      rocketsLaunched: 0,
      quizzesCorrect: 0,
      badges: [...DEFAULT_BADGES]
    };
  }

  public saveStats() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
    } catch {
      // ignore
    }
  }

  public getStats(): UserStats {
    return this.stats;
  }

  public addXp(amount: number) {
    this.stats.xp += amount;
    this.saveStats();
  }

  public addStar(count: number = 1) {
    this.stats.stars += count;
    this.saveStats();
  }

  public recordPlanetVisit(planetId: string): boolean {
    if (!this.stats.planetsVisited.includes(planetId)) {
      this.stats.planetsVisited.push(planetId);
      this.addXp(20);
      if (this.stats.planetsVisited.length >= 8) {
        this.unlockBadge('solar_explorer');
      }
      this.saveStats();
      return true;
    }
    return false;
  }

  public recordRocketLaunch() {
    this.stats.rocketsLaunched++;
    this.addXp(50);
    this.addStar(2);
    this.unlockBadge('rocket_engineer');
    this.saveStats();
  }

  public recordQuizCorrect() {
    this.stats.quizzesCorrect++;
    if (this.stats.quizzesCorrect >= 5) {
      this.unlockBadge('quiz_ace');
    }
    this.saveStats();
  }

  public unlockBadge(badgeId: string): boolean {
    const badge = this.stats.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlockedAt = new Date().toLocaleDateString('id-ID');
      this.stats.xp += badge.xpReward;
      this.stats.stars += 3;
      spaceAudio.playFanfare();
      this.saveStats();
      return true;
    }
    return false;
  }

  public renderBadgesGrid(containerEl: HTMLElement, lang: 'id' | 'en' = 'id') {
    containerEl.innerHTML = '';
    this.stats.badges.forEach(badge => {
      const card = document.createElement('div');
      card.className = `badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon-wrap">
          <span class="badge-emoji">${badge.icon}</span>
          ${badge.unlocked ? '<span class="badge-check">✓</span>' : '<span class="badge-lock">🔒</span>'}
        </div>
        <h4 class="badge-title">${lang === 'id' ? badge.titleId : badge.titleEn}</h4>
        <p class="badge-desc">${lang === 'id' ? badge.requirementId : badge.requirementEn}</p>
        <div class="badge-footer">
          <span class="badge-xp">+${badge.xpReward} XP</span>
          ${badge.unlocked ? `<span class="badge-date">${badge.unlockedAt || 'Aktif'}</span>` : '<span class="badge-locked-text">Terkunci</span>'}
        </div>
      `;
      containerEl.appendChild(card);
    });
  }
}

export const badgesManager = new BadgesManager();
