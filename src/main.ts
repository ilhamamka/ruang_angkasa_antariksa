// Main Application Orchestrator for Ruang Angkasa Antariksa
// Manages Starfield Canvas, Dynamic Navigation, Screen Mounting & Topbar Controls

import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';
import { solarExplorer } from './game-solarsystem.ts';
import { rocketLab } from './game-rocketlab.ts';
import { deepSpaceExplorer } from './game-deepspace.ts';
import { spaceSandbox } from './game-sandbox.ts';
import { spaceEncyclopedia } from './chart-encyclopedia.ts';
import { worksheetsManager } from './worksheets.ts';
import { parentGuideManager } from './parent-guide.ts';
import { quizController } from './questions-engine.ts';

class SpaceApp {
  private currentScreenId: string = 'screen-home';
  private starfieldCanvas: HTMLCanvasElement | null = null;
  private starfieldCtx: CanvasRenderingContext2D | null = null;
  private stars: Array<{ x: number; y: number; r: number; alpha: number; speed: number }> = [];
  private shootingStars: Array<{ x: number; y: number; len: number; speed: number; alpha: number }> = [];

  constructor() {
    // Initial setup
  }

  public init() {
    this.initStarfield();
    this.initNavigation();
    this.initAudioAndControls();
    this.updateHeroStats();
    this.mountCurrentScreen();
  }

  // --- Dynamic Starfield Background Canvas ---
  private initStarfield() {
    this.starfieldCanvas = document.getElementById('starfield-canvas') as HTMLCanvasElement;
    if (!this.starfieldCanvas) return;

    this.starfieldCtx = this.starfieldCanvas.getContext('2d');
    if (!this.starfieldCtx) return;

    const resize = () => {
      this.starfieldCanvas!.width = window.innerWidth;
      this.starfieldCanvas!.height = window.innerHeight;
      this.generateStars();
    };

    window.addEventListener('resize', resize);
    resize();
    this.animateStarfield();
  }

  private generateStars() {
    this.stars = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 2800);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  private animateStarfield() {
    if (!this.starfieldCtx || !this.starfieldCanvas) return;
    const ctx = this.starfieldCtx;
    const w = this.starfieldCanvas.width;
    const h = this.starfieldCanvas.height;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw subtle twinkling stars
      for (const s of this.stars) {
        s.alpha += s.speed;
        const currentAlpha = (Math.sin(s.alpha) + 1) / 2 * 0.8 + 0.2;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();
      }

      // Random chance for a cosmic shooting star
      if (Math.random() < 0.015 && this.shootingStars.length < 2) {
        this.shootingStars.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.4,
          len: Math.random() * 80 + 40,
          speed: Math.random() * 12 + 10,
          alpha: 1.0
        });
      }

      // Draw & update shooting stars
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const ss = this.shootingStars[i];
        ss.x += ss.speed;
        ss.y += ss.speed * 0.6;
        ss.alpha -= 0.025;

        if (ss.alpha <= 0) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y - ss.len * 0.6);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
        grad.addColorStop(0.3, `rgba(0, 242, 254, ${ss.alpha * 0.8})`);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.len, ss.y - ss.len * 0.6);
        ctx.stroke();
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  // --- Audio & Topbar Quick Controls ---
  private initAudioAndControls() {
    // Sound effects toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = spaceAudio.toggleSound();
        soundBtn.textContent = enabled ? '🔊' : '🔇';
        if (enabled) spaceAudio.playPop(550);
      });
    }

    // BGM Ambient Pad toggle
    const bgmBtn = document.getElementById('btn-toggle-bgm');
    if (bgmBtn) {
      bgmBtn.addEventListener('click', () => {
        const enabled = spaceAudio.toggleBgm();
        bgmBtn.textContent = enabled ? '🎵' : '🎼';
      });
    }

    // Language Toggle (ID / EN)
    const langBtn = document.getElementById('btn-toggle-lang');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const cur = spaceAudio.getLanguage();
        const next = cur === 'id' ? 'en' : 'id';
        spaceAudio.setLanguage(next);
        langBtn.textContent = next === 'id' ? '🇮🇩 ID' : '🇬🇧 EN';
        spaceAudio.playPop(440);
      });
    }

    // Fullscreen Toggle
    const fsBtn = document.getElementById('btn-toggle-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // First user gesture initializes audio context cleanly
    const startAudioOnFirstClick = () => {
      spaceAudio.playPop(300);
      window.removeEventListener('click', startAudioOnFirstClick);
      window.removeEventListener('keydown', startAudioOnFirstClick);
    };
    window.addEventListener('click', startAudioOnFirstClick, { once: true });
    window.addEventListener('keydown', startAudioOnFirstClick, { once: true });
  }

  // --- Dynamic Screen Routing ---
  private initNavigation() {
    // Brand home button
    const homeBtn = document.getElementById('btn-nav-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => this.switchScreen('screen-home'));
    }

    // Topbar Nav Buttons
    const navMapping: { [btnId: string]: string } = {
      'btn-nav-worlds': 'screen-home',
      'btn-nav-solarsystem': 'screen-solarsystem',
      'btn-nav-rocketlab': 'screen-rocketlab',
      'btn-nav-deepspace': 'screen-deepspace',
      'btn-nav-quiz': 'screen-quiz',
      'btn-nav-sandbox': 'screen-sandbox',
      'btn-nav-chart': 'screen-encyclopedia',
      'btn-nav-badges': 'screen-badges',
      'btn-nav-worksheets': 'screen-worksheets',
      'btn-nav-parent': 'screen-parent-guide'
    };

    for (const [btnId, targetScreen] of Object.entries(navMapping)) {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => this.switchScreen(targetScreen));
      }
    }

    // World Hub Cards on Home Screen
    const cardSolar = document.getElementById('card-open-solarsystem');
    if (cardSolar) {
      cardSolar.addEventListener('click', () => this.switchScreen('screen-solarsystem'));
    }

    const cardRocket = document.getElementById('card-open-rocketlab');
    if (cardRocket) {
      cardRocket.addEventListener('click', () => this.switchScreen('screen-rocketlab'));
    }

    const cardDeep = document.getElementById('card-open-deepspace');
    if (cardDeep) {
      cardDeep.addEventListener('click', () => this.switchScreen('screen-deepspace'));
    }
  }

  public switchScreen(targetScreenId: string) {
    spaceAudio.playPop(440);

    // Unmount previous
    if (this.currentScreenId === 'screen-solarsystem') solarExplorer.unmount();
    if (this.currentScreenId === 'screen-rocketlab') rocketLab.unmount();
    if (this.currentScreenId === 'screen-deepspace') deepSpaceExplorer.unmount();

    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    // Show target
    const targetEl = document.getElementById(targetScreenId);
    if (targetEl) {
      targetEl.classList.add('active');
      this.currentScreenId = targetScreenId;
    }

    // Update active nav button pill
    const navBtns = document.querySelectorAll('.nav-pill-btn');
    navBtns.forEach(btn => {
      btn.classList.remove('active');
    });

    this.mountCurrentScreen();
    this.updateHeroStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private mountCurrentScreen() {
    switch (this.currentScreenId) {
      case 'screen-solarsystem': {
        const mountPoint = document.getElementById('solarsystem-mount');
        if (mountPoint) solarExplorer.mount(mountPoint);
        break;
      }
      case 'screen-rocketlab': {
        const mountPoint = document.getElementById('rocketlab-mount');
        if (mountPoint) rocketLab.mount(mountPoint);
        break;
      }
      case 'screen-deepspace': {
        const mountPoint = document.getElementById('deepspace-mount');
        if (mountPoint) deepSpaceExplorer.mount(mountPoint);
        break;
      }
      case 'screen-quiz': {
        this.renderQuizScreen();
        break;
      }
      case 'screen-sandbox': {
        const mountPoint = document.getElementById('sandbox-mount');
        if (mountPoint) spaceSandbox.mount(mountPoint);
        break;
      }
      case 'screen-encyclopedia': {
        const mountPoint = document.getElementById('encyclopedia-mount');
        if (mountPoint) spaceEncyclopedia.mount(mountPoint);
        break;
      }
      case 'screen-badges': {
        const mountPoint = document.getElementById('badges-grid-mount');
        if (mountPoint) badgesManager.renderBadgesGrid(mountPoint, spaceAudio.getLanguage());
        break;
      }
      case 'screen-worksheets': {
        const mountPoint = document.getElementById('worksheets-mount');
        if (mountPoint) worksheetsManager.mount(mountPoint);
        break;
      }
      case 'screen-parent-guide': {
        const mountPoint = document.getElementById('parent-guide-mount');
        if (mountPoint) parentGuideManager.mount(mountPoint);
        break;
      }
    }
  }

  private updateHeroStats() {
    const stats = badgesManager.getStats();
    const starEl = document.getElementById('hero-stat-stars');
    const xpEl = document.getElementById('hero-stat-xp');
    const rankEl = document.getElementById('hero-stat-rank');

    if (starEl) starEl.textContent = `⭐ ${stats.stars} Bintang`;
    if (xpEl) xpEl.textContent = `🏆 ${stats.xp} XP`;
    if (rankEl) {
      let rankName = 'Kadet Antariksa';
      if (stats.xp >= 300) rankName = 'Perwira Kosmik';
      if (stats.xp >= 600) rankName = 'Komandan Antariksa';
      rankEl.textContent = `🎖️ ${rankName}`;
    }
  }

  // --- Quiz Screen Rendering & Interaction ---
  private renderQuizScreen() {
    const quizMount = document.getElementById('quiz-mount');
    if (!quizMount) return;

    const q = quizController.getCurrentQuestion();
    const progress = quizController.getProgress();

    if (!q) {
      // Quiz completed celebration
      const scoreData = quizController.getScoreStats();
      quizMount.innerHTML = `
        <div class="quiz-container celebration-card">
          <span class="celebration-star">🏆</span>
          <h2>KUIS MISI SELESAI!</h2>
          <p>Skor Kamu: <strong>${scoreData.score} / ${scoreData.total}</strong> Benar</p>
          <p>Total XP diperoleh: <strong>+${scoreData.xpEarned} XP Kosmik</strong></p>
          <button class="btn-primary-glow" id="btn-quiz-retry" style="margin-top:20px;">Ulangi Kuis</button>
        </div>
      `;

      const retryBtn = quizMount.querySelector('#btn-quiz-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          quizController.reset();
          this.renderQuizScreen();
        });
      }
      return;
    }

    quizMount.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <span class="quiz-tier-badge">${q.tierLabelId}</span>
          <span class="quiz-progress-text">Soal ${progress.current} dari ${progress.total}</span>
        </div>

        <div class="quiz-progress-bar-wrap">
          <div class="quiz-progress-bar-fill" style="width: ${progress.percent}%;"></div>
        </div>

        <div class="quiz-question-box">
          <span class="quiz-icon">${q.icon}</span>
          <h3 class="quiz-question-text">${q.questionId}</h3>
        </div>

        <div class="quiz-options-list">
          ${q.optionsId.map((opt, idx) => `
            <button class="quiz-option-btn" data-index="${idx}">
              <span>${String.fromCharCode(65 + idx)}. ${opt}</span>
              <span class="opt-status-icon"></span>
            </button>
          `).join('')}
        </div>

        <div class="quiz-feedback-box" id="quiz-feedback-box">
          <p id="quiz-feedback-text"></p>
        </div>

        <button class="btn-next-quiz" id="btn-next-quiz" style="display:none;">Lanjut ke Soal Berikutnya ▶</button>
      </div>
    `;

    const optBtns = quizMount.querySelectorAll('.quiz-option-btn');
    const feedbackBox = quizMount.querySelector('#quiz-feedback-box') as HTMLElement;
    const feedbackText = quizMount.querySelector('#quiz-feedback-text') as HTMLElement;
    const nextBtn = quizMount.querySelector('#btn-next-quiz') as HTMLElement;

    optBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const chosenIdx = parseInt(target.getAttribute('data-index') || '0', 10);
        const result = quizController.submitAnswer(chosenIdx);

        // Lock all buttons
        optBtns.forEach(b => (b as HTMLButtonElement).disabled = true);

        if (result.isCorrect) {
          target.classList.add('correct');
          badgesManager.addXp(result.question.xpReward);
          badgesManager.addStar(1);
          badgesManager.recordQuizCorrect();
          this.updateHeroStats();
        } else {
          target.classList.add('incorrect');
          // Highlight correct button
          optBtns[result.question.correctIndex].classList.add('correct');
        }

        // Show feedback
        feedbackBox.classList.add('active');
        feedbackText.innerHTML = `<strong>${result.isCorrect ? '✅ Tepat Sekali!' : '❌ Kurang Tepat.'}</strong> ${result.question.explanationId}`;
        nextBtn.style.display = 'block';
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        quizController.nextQuestion();
        this.renderQuizScreen();
      });
    }
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new SpaceApp();
  app.init();
});
