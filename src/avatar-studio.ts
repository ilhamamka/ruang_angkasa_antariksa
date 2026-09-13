// Cadet Astronaut Avatar Customizer Studio
// Lets children personalize their spacesuit color, helmet visor, and patch insignia

import { spaceAudio } from './audio.ts';
import { confetti } from './confetti.ts';

export interface CadetAvatarConfig {
  suitColor: 'white' | 'orange' | 'navy' | 'gold';
  visorColor: 'gold' | 'cyan' | 'rainbow' | 'purple';
  badgePatch: 'id_flag' | 'garuda' | 'star' | 'rocket';
  cadetName: string;
}

const STORAGE_KEY = 'ruang_angkasa_avatar_v1';

export class AvatarStudioManager {
  private currentConfig: CadetAvatarConfig;

  constructor() {
    this.currentConfig = this.loadConfig();
  }

  public getConfig(): CadetAvatarConfig {
    return { ...this.currentConfig };
  }

  public saveConfig(newConfig: CadetAvatarConfig) {
    this.currentConfig = { ...newConfig };
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentConfig));
      } catch (e) {
        console.warn('Gagal menyimpan avatar config:', e);
      }
    }
  }

  private loadConfig(): CadetAvatarConfig {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn('Gagal membaca avatar config:', e);
      }
    }
    return {
      suitColor: 'white',
      visorColor: 'gold',
      badgePatch: 'id_flag',
      cadetName: 'Kadet Bintang'
    };
  }

  public generateAvatarSvg(config = this.currentConfig, size = 64): string {
    const suitFill = {
      white: '#f1f5f9',
      orange: '#ea580c',
      navy: '#1d4ed8',
      gold: '#f59e0b'
    }[config.suitColor];

    const suitStroke = {
      white: '#94a3b8',
      orange: '#9a3412',
      navy: '#1e3a8a',
      gold: '#b45309'
    }[config.suitColor];

    const visorGradientId = `visor-grad-${config.visorColor}-${Math.round(Math.random() * 1000)}`;

    let visorDef = '';
    let visorFill = `url(#${visorGradientId})`;

    if (config.visorColor === 'gold') {
      visorDef = `<linearGradient id="${visorGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="60%" stop-color="#eab308" />
        <stop offset="100%" stop-color="#854d0e" />
      </linearGradient>`;
    } else if (config.visorColor === 'cyan') {
      visorDef = `<linearGradient id="${visorGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a5f3fc" />
        <stop offset="70%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#0e7490" />
      </linearGradient>`;
    } else if (config.visorColor === 'rainbow') {
      visorDef = `<linearGradient id="${visorGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e" />
        <stop offset="35%" stop-color="#eab308" />
        <stop offset="70%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>`;
    } else {
      visorDef = `<linearGradient id="${visorGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e879f9" />
        <stop offset="70%" stop-color="#a855f7" />
        <stop offset="100%" stop-color="#581c87" />
      </linearGradient>`;
    }

    // Badge Patch SVG
    let patchSvg = '';
    if (config.badgePatch === 'id_flag') {
      patchSvg = `
        <rect x="42" y="58" width="16" height="5" fill="#ef4444" rx="1"/>
        <rect x="42" y="63" width="16" height="5" fill="#ffffff" rx="1"/>
      `;
    } else if (config.badgePatch === 'garuda') {
      patchSvg = `<circle cx="50" cy="63" r="5" fill="#ffd700"/><polygon points="50,60 52,65 48,65" fill="#ef4444"/>`;
    } else if (config.badgePatch === 'star') {
      patchSvg = `<polygon points="50,58 52,62 56,63 53,66 54,70 50,67 46,70 47,66 44,63 48,62" fill="#ffd700"/>`;
    } else {
      patchSvg = `<polygon points="50,58 53,67 47,67" fill="#ef4444"/><circle cx="50" cy="63" r="1.5" fill="#ffffff"/>`;
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" class="cadet-avatar-svg">
        <defs>${visorDef}</defs>
        
        <!-- Backpack oxygen tubes -->
        <rect x="18" y="32" width="12" height="36" rx="4" fill="#64748b"/>
        <rect x="70" y="32" width="12" height="36" rx="4" fill="#64748b"/>

        <!-- Spacesuit Torso & Shoulders -->
        <path d="M 28,52 C 28,45 72,45 72,52 L 78,85 C 78,92 22,92 22,85 Z" fill="${suitFill}" stroke="${suitStroke}" stroke-width="2"/>

        <!-- Badge Insignia on Chest -->
        ${patchSvg}

        <!-- Spacesuit Helmet Sphere -->
        <circle cx="50" cy="35" r="26" fill="${suitFill}" stroke="${suitStroke}" stroke-width="2.5"/>
        
        <!-- Helmet Visor Glass -->
        <ellipse cx="50" cy="35" rx="19" ry="14" fill="${visorFill}" stroke="#ffffff" stroke-width="1.5"/>
        <ellipse cx="44" cy="30" rx="6" ry="3" fill="#ffffff" opacity="0.45" transform="rotate(-15 44 30)"/>

        <!-- Audio Comm Antenna -->
        <line x1="28" y1="20" x2="22" y2="10" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="21" cy="9" r="3" fill="#ef4444"/>
      </svg>
    `;
  }

  public openAvatarModal(onSave?: (cfg: CadetAvatarConfig) => void) {
    let draft = { ...this.currentConfig };
    const modal = document.createElement('div');
    modal.className = 'avatar-studio-backdrop';
    modal.id = 'modal-avatar-studio';

    const updatePreview = () => {
      const previewBox = modal.querySelector('.avatar-preview-render');
      if (previewBox) {
        previewBox.innerHTML = this.generateAvatarSvg(draft, 130);
      }
    };

    modal.innerHTML = `
      <div class="avatar-studio-dialog">
        <div class="avatar-dialog-header">
          <h3>🧑‍🚀 Studio Kustomisasi Astronot Cilik</h3>
          <button class="btn-close-avatar-studio" type="button">&times;</button>
        </div>

        <div class="avatar-studio-grid">
          <!-- Left Visual Preview -->
          <div class="avatar-preview-col">
            <div class="avatar-preview-render">
              ${this.generateAvatarSvg(draft, 130)}
            </div>
            <span class="avatar-preview-badge">🇮🇩 Kadet Antariksa Indonesia</span>
          </div>

          <!-- Right Options Column -->
          <div class="avatar-controls-col">
            <!-- 1. Suit Color -->
            <div class="control-group">
              <label>1. Warna Baju Antariksa:</label>
              <div class="pill-options-row">
                <button class="btn-opt ${draft.suitColor === 'white' ? 'active' : ''}" data-suit="white" type="button">⚪ Putih</button>
                <button class="btn-opt ${draft.suitColor === 'orange' ? 'active' : ''}" data-suit="orange" type="button">🟠 Oranye</button>
                <button class="btn-opt ${draft.suitColor === 'navy' ? 'active' : ''}" data-suit="navy" type="button">🔵 Biru</button>
                <button class="btn-opt ${draft.suitColor === 'gold' ? 'active' : ''}" data-suit="gold" type="button">🟡 Emas</button>
              </div>
            </div>

            <!-- 2. Visor Color -->
            <div class="control-group">
              <label>2. Kaca Visor Helm:</label>
              <div class="pill-options-row">
                <button class="btn-opt ${draft.visorColor === 'gold' ? 'active' : ''}" data-visor="gold" type="button">✨ Emas Anti-Silau</button>
                <button class="btn-opt ${draft.visorColor === 'cyan' ? 'active' : ''}" data-visor="cyan" type="button">💎 Sian Neon</button>
                <button class="btn-opt ${draft.visorColor === 'rainbow' ? 'active' : ''}" data-visor="rainbow" type="button">🌈 Pelangi</button>
                <button class="btn-opt ${draft.visorColor === 'purple' ? 'active' : ''}" data-visor="purple" type="button">🔮 Nebula Ungu</button>
              </div>
            </div>

            <!-- 3. Badge Patch -->
            <div class="control-group">
              <label>3. Lencana Dada:</label>
              <div class="pill-options-row">
                <button class="btn-opt ${draft.badgePatch === 'id_flag' ? 'active' : ''}" data-patch="id_flag" type="button">🇮🇩 Merah Putih</button>
                <button class="btn-opt ${draft.badgePatch === 'garuda' ? 'active' : ''}" data-patch="garuda" type="button">🦅 Garuda</button>
                <button class="btn-opt ${draft.badgePatch === 'star' ? 'active' : ''}" data-patch="star" type="button">⭐ Bintang</button>
                <button class="btn-opt ${draft.badgePatch === 'rocket' ? 'active' : ''}" data-patch="rocket" type="button">🚀 Roket</button>
              </div>
            </div>
          </div>
        </div>

        <div class="avatar-dialog-actions">
          <button class="btn-cancel-avatar" type="button">Batal</button>
          <button class="btn-save-avatar" type="button">💾 Simpan Kostum Astronot</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event handlers
    modal.querySelectorAll('[data-suit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = (e.currentTarget as HTMLElement).getAttribute('data-suit') as CadetAvatarConfig['suitColor'];
        draft.suitColor = val;
        modal.querySelectorAll('[data-suit]').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        spaceAudio.playPop(520);
        updatePreview();
      });
    });

    modal.querySelectorAll('[data-visor]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = (e.currentTarget as HTMLElement).getAttribute('data-visor') as CadetAvatarConfig['visorColor'];
        draft.visorColor = val;
        modal.querySelectorAll('[data-visor]').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        spaceAudio.playPop(620);
        updatePreview();
      });
    });

    modal.querySelectorAll('[data-patch]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = (e.currentTarget as HTMLElement).getAttribute('data-patch') as CadetAvatarConfig['badgePatch'];
        draft.badgePatch = val;
        modal.querySelectorAll('[data-patch]').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        spaceAudio.playPop(720);
        updatePreview();
      });
    });

    const close = () => {
      modal.remove();
    };

    modal.querySelector('.btn-close-avatar-studio')?.addEventListener('click', close);
    modal.querySelector('.btn-cancel-avatar')?.addEventListener('click', close);

    modal.querySelector('.btn-save-avatar')?.addEventListener('click', () => {
      this.saveConfig(draft);
      spaceAudio.playCelestialChime();
      confetti.fire(0.5, 0.4, 45);
      if (onSave) onSave(this.currentConfig);
      close();
    });
  }
}

export const avatarStudio = new AvatarStudioManager();
