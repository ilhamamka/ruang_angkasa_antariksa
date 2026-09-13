// Early Childhood Step-by-Step Space Learning Pathway ("Petualangan Astronot Cilik")
// Scaffolded, intuitive, vocal-assisted space education for young learners (Pre-K to Grade 4)

import { KID_LEARNING_STAGES, KID_FRUIT_ANALOGIES, PLANET_TRAIN_ORDER, type KidLearningStage } from './kids-curriculum.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';

export class KidsPathwayManager {
  private container: HTMLElement | null = null;
  private currentStageIdx: number = 0;
  private activeLessonIdx: number = 0;
  private trainCurrentStep: number = 0;

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public unmount() {
    // cleanup
  }

  private render() {
    if (!this.container) return;

    const currentStage = KID_LEARNING_STAGES[this.currentStageIdx];
    const currentLesson = currentStage.lessons[this.activeLessonIdx] || currentStage.lessons[0];

    this.container.innerHTML = `
      <div class="kids-pathway-view">
        <!-- Top Hero Header for Kids -->
        <div class="kids-hero-banner">
          <div class="kids-hero-copy">
            <span class="kids-kicker">🌟 KELAS PETUALANGAN ASTRONOT CILIK · LANGKAH DEMI LANGKAH</span>
            <h2 class="kids-title">Belajar Luar Angkasa Jadi Mudah & Menyenangkan!</h2>
            <p class="kids-subtitle">Sentuh tombol suara 🔊 di setiap gambar untuk mendengarkan cerita ceria!</p>
          </div>
          <div class="kids-mascot-badge">
            <span class="mascot-emoji">🧑‍🚀</span>
          </div>
        </div>

        <!-- 4 Step Island Journey Map -->
        <div class="kids-stages-map">
          ${KID_LEARNING_STAGES.map((s, idx) => `
            <button class="stage-island-btn ${idx === this.currentStageIdx ? 'active' : ''}" data-stage="${idx}">
              <span class="island-num">Langkah ${s.stageNumber}</span>
              <span class="island-icon">${s.icon}</span>
              <span class="island-name">${s.titleId.split(':')[1] || s.titleId}</span>
            </button>
          `).join('')}
        </div>

        <!-- Main Lesson Playground Area -->
        <div class="kids-lesson-playground">
          <!-- Lesson Tabs within Stage -->
          <div class="lesson-pills-row">
            ${currentStage.lessons.map((les, lIdx) => `
              <button class="lesson-pill ${lIdx === this.activeLessonIdx ? 'active' : ''}" data-lidx="${lIdx}">
                <span>${les.emoji}</span>
                <span>${les.title}</span>
              </button>
            `).join('')}
          </div>

          <!-- Active Lesson Interactive Card -->
          <div class="active-lesson-card">
            <div class="lesson-header-row">
              <div class="lesson-title-box">
                <span class="lesson-big-emoji">${currentLesson.emoji}</span>
                <div>
                  <span class="lesson-stage-tag">${currentStage.titleId}</span>
                  <h3>${currentLesson.title}</h3>
                </div>
              </div>

              <!-- Big Listen Voice Button -->
              <button class="btn-big-voice" id="btn-play-lesson-voice">
                🔊 Dengarkan Cerita Ceria
              </button>
            </div>

            <!-- Concrete Story & Analogy Box -->
            <div class="lesson-story-box">
              <div class="story-speech-bubble">
                <p class="story-text">"${currentLesson.voiceStory}"</p>
              </div>

              <div class="analogy-card-highlight">
                <span class="analogy-icon">💡</span>
                <div class="analogy-text">
                  <strong>Bayangkan Seperti Ini:</strong>
                  <p>${currentLesson.analogyKid}</p>
                </div>
              </div>
            </div>

            <!-- Mini Challenge for Kids -->
            <div class="kids-challenge-box">
              <h4>⭐ Tantangan Cerdas Cilik:</h4>
              <p class="challenge-question">${currentLesson.questionKid}</p>

              <div class="challenge-options-grid">
                ${currentLesson.optionsKid.map((opt, oIdx) => `
                  <button class="kid-opt-btn" data-oidx="${oIdx}">
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>

              <div class="kid-praise-feedback" id="kid-praise-box" style="display:none;">
                <span class="praise-star">🌟</span>
                <p id="kid-praise-text">${currentLesson.praiseKid}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Activity 1: Fruit Scale Comparator -->
        <div class="kids-interactive-feature-card">
          <div class="feature-card-header">
            <span class="feat-icon">🍎</span>
            <div>
              <h3>Taman Buah Tata Surya (Perbandingan Ukuran Nyata)</h3>
              <p>Sentuh buah apa saja untuk mengetahui planet mana yang sebesar buah itu!</p>
            </div>
          </div>

          <div class="fruits-carousel">
            ${KID_FRUIT_ANALOGIES.map(fa => `
              <div class="fruit-analogy-box" data-planet-id="${fa.planetId}">
                <span class="fruit-emoji-huge">${fa.fruitEmoji}</span>
                <h4>${fa.fruitName}</h4>
                <span class="fruit-planet-tag">${fa.planetName}</span>
                <p class="fruit-desc">${fa.fruitComparison}</p>
                <button class="btn-fruit-voice" data-voice="${fa.voiceScript}">
                  🔊 Dengar Suara
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Special Activity 2: Kereta 8 Planet Order Game -->
        <div class="kids-interactive-feature-card">
          <div class="feature-card-header">
            <span class="feat-icon">🚂</span>
            <div>
              <h3>Permainan Kereta 8 Planet: "Me-Ve-Bu-Ma-Ju-Sa-U-Ne"</h3>
              <p>Bantu masinis menyusun gerbong planet dari yang paling dekat dengan Matahari!</p>
            </div>
            <button class="btn-sing-song" id="btn-sing-song">
              🎵 Nyanyikan Lagu Me-Ve-Bu-Ma
            </button>
          </div>

          <div class="train-assembly-area">
            <div class="train-tracks" id="train-tracks">
              ${PLANET_TRAIN_ORDER.map((item, idx) => `
                <div class="train-car ${idx <= this.trainCurrentStep ? 'unlocked' : 'locked'}" style="border-color:${item.color};">
                  <span class="car-emoji">${item.emoji}</span>
                  <span class="car-name">${item.name}</span>
                </div>
              `).join('')}
            </div>

            <div class="train-actions-prompt">
              <button class="btn-advance-train" id="btn-advance-train">
                🚂 Tambah Gerbong Planet Berikutnya!
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    if (!this.container) return;

    // Stage Island Buttons
    const stageBtns = this.container.querySelectorAll('.stage-island-btn');
    stageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-stage') || '0', 10);
        this.currentStageIdx = sIdx;
        this.activeLessonIdx = 0;
        spaceAudio.playPop(520);
        this.render();
      });
    });

    // Lesson Pills
    const pillBtns = this.container.querySelectorAll('.lesson-pill');
    pillBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-lidx') || '0', 10);
        this.activeLessonIdx = lIdx;
        spaceAudio.playPop(480);
        this.render();
      });
    });

    // Big Voice Story Button
    const voiceBtn = this.container.querySelector('#btn-play-lesson-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const currentStage = KID_LEARNING_STAGES[this.currentStageIdx];
        const currentLesson = currentStage.lessons[this.activeLessonIdx];
        spaceAudio.speakKids(currentLesson.voiceStory);
      });
    }

    // Challenge Option Buttons
    const optBtns = this.container.querySelectorAll('.kid-opt-btn');
    const praiseBox = this.container.querySelector('#kid-praise-box') as HTMLElement;
    const currentStage = KID_LEARNING_STAGES[this.currentStageIdx];
    const currentLesson = currentStage.lessons[this.activeLessonIdx];

    optBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const oIdx = parseInt(target.getAttribute('data-oidx') || '0', 10);

        optBtns.forEach(b => (b as HTMLButtonElement).disabled = true);

        if (oIdx === currentLesson.correctKidIdx) {
          target.classList.add('correct');
          if (praiseBox) praiseBox.style.display = 'flex';
          spaceAudio.playCheer();
          spaceAudio.playRandomPraise();
          badgesManager.addStar(1);
          badgesManager.addXp(30);
        } else {
          target.classList.add('incorrect');
          optBtns[currentLesson.correctKidIdx].classList.add('correct');
          spaceAudio.playPop(250);
          spaceAudio.speakKids('Ayo coba lagi teman hebat!');
        }
      });
    });

    // Fruit voice buttons
    const fruitVoiceBtns = this.container.querySelectorAll('.btn-fruit-voice');
    fruitVoiceBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = (e.currentTarget as HTMLElement).getAttribute('data-voice');
        if (text) {
          spaceAudio.speakKids(text);
        }
      });
    });

    // Sing Song button
    const songBtn = this.container.querySelector('#btn-sing-song');
    if (songBtn) {
      songBtn.addEventListener('click', () => {
        spaceAudio.speakKids('Ayo nyanyikan bersama jembatan keledai 8 planet: Me, Ve, Bu, Ma, Ju, Sa, U, Ne! Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus!');
      });
    }

    // Advance Train button
    const advanceTrainBtn = this.container.querySelector('#btn-advance-train');
    if (advanceTrainBtn) {
      advanceTrainBtn.addEventListener('click', () => {
        if (this.trainCurrentStep < PLANET_TRAIN_ORDER.length - 1) {
          this.trainCurrentStep++;
          const currentPlanet = PLANET_TRAIN_ORDER[this.trainCurrentStep];
          spaceAudio.playPop(600);
          spaceAudio.speakKids(`Gerbong ${currentPlanet.name} berhasil disambung!`);
          this.render();
        } else {
          spaceAudio.playCheer();
          spaceAudio.speakKids('Horeee! Kereta 8 planet sudah lengkap dan siap meluncur keliling antariksa!');
          this.trainCurrentStep = 0;
          this.render();
        }
      });
    }
  }
}

export const kidsPathway = new KidsPathwayManager();
