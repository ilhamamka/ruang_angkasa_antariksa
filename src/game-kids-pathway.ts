// Early Childhood Step-by-Step Space Learning Pathway ("Petualangan Astronot Cilik")
// Scaffolded, intuitive, vocal-assisted space education for young learners (Pre-K to Grade 4)
// Enactive, Iconic, and Friendly Bruner/Piaget Scaffolding

import { KID_LEARNING_STAGES, KID_FRUIT_ANALOGIES, PLANET_TRAIN_ORDER } from './kids-curriculum.ts';
import { spaceAudio } from './audio.ts';
import { badgesManager } from './badges-album.ts';
import { commercial } from './commercial.ts';
import { confetti } from './confetti.ts';

export class KidsPathwayManager {
  private container: HTMLElement | null = null;
  private currentStageIdx: number = 0;
  private activeLessonIdx: number = 0;
  private trainCurrentStep: number = 0;
  private kidName: string = 'Kadet Cilik';

  // Spacesuit dress-up state
  private equippedParts: Set<string> = new Set();

  // Balloon experiment state
  private balloonState: 'empty' | 'inflated' | 'launched' = 'empty';

  // Tactile lesson toy states
  private sunPulseCount: number = 0;
  private earthTimeState: 'day' | 'night' = 'day';
  private moonPhaseState: 'sabit' | 'separuh' | 'purnama' = 'sabit';
  private marsRoverPhotos: number = 0;
  private marsRoverRocks: number = 0;

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
    // Auto narrate initial lesson
    if (spaceAudio.isAutoNarration()) {
      const currentStage = KID_LEARNING_STAGES[this.currentStageIdx];
      const currentLesson = currentStage.lessons[this.activeLessonIdx];
      setTimeout(() => {
        spaceAudio.speakKids(currentLesson.voiceStory);
      }, 300);
    }
  }

  public unmount() {
    spaceAudio.stopSpeaking();
  }

  private renderInteractiveLessonToy(lessonId: string): string {
    if (lessonId === 'l1_sun') {
      return `
        <div class="interactive-toy-card sun-toy-card">
          <div class="toy-header">
            <span class="toy-badge">☀️ MAINAN INTERAKTIF: MATAHARI RAMAH</span>
            <span class="toy-sub">Sentuh Matahari untuk memancarkan sinar hangat ke Bumi!</span>
          </div>
          <div class="sun-toy-stage">
            <div class="interactive-sun-sphere ${this.sunPulseCount > 0 ? 'pulse' : ''}" id="interactive-sun-sphere" role="button" tabindex="0">
              <span class="sun-face">😎</span>
              <div class="sun-flare-rings"></div>
            </div>
          </div>
          <div class="toy-controls">
            <button class="btn-toy-action" id="btn-sun-warm" type="button">
              🔥 Pancarkan Sinar Hangat! (${this.sunPulseCount}x Disinari)
            </button>
          </div>
          <div class="toy-status-bar" id="sun-status-text">
            ${this.sunPulseCount > 0 ? '✨ Wuuush! Hangat sekali sinar Matahari, tanaman dan bunga pun tumbuh subur!' : 'Sentuh tombol atau bola Matahari untuk menghangatkan bumi!'}
          </div>
        </div>
      `;
    }

    if (lessonId === 'l1_earth') {
      return `
        <div class="interactive-toy-card earth-toy-card">
          <div class="toy-header">
            <span class="toy-badge">🌍 MAINAN INTERAKTIF: SIANG & MALAM DI BUMI</span>
            <span class="toy-sub">Tekan tombol siang atau malam untuk melihat waktu di Indonesia!</span>
          </div>
          <div class="earth-toy-stage">
            <div class="interactive-earth-sphere ${this.earthTimeState}" id="interactive-earth-sphere">
              <span class="earth-emoji-display">${this.earthTimeState === 'day' ? '🌍' : '🌏'}</span>
              <span class="earth-flag-tag">🇮🇩 Indonesia</span>
            </div>
            <div class="earth-sky-companion">
              ${this.earthTimeState === 'day' ? '☀️ Siang Terang: Ayo sekolah & bermain ceria!' : '🌙 Malam Tenang: Bintang bertabur & selamat tidur nyenyak!'}
            </div>
          </div>
          <div class="toy-controls">
            <button class="btn-toy-toggle ${this.earthTimeState === 'day' ? 'active' : ''}" id="btn-earth-day" type="button">
              ☀️ 1. Waktu Siang (Matahari)
            </button>
            <button class="btn-toy-toggle ${this.earthTimeState === 'night' ? 'active' : ''}" id="btn-earth-night" type="button">
              🌙 2. Waktu Malam (Lampu Kota)
            </button>
          </div>
        </div>
      `;
    }

    if (lessonId === 'l1_moon') {
      return `
        <div class="interactive-toy-card moon-toy-card">
          <div class="toy-header">
            <span class="toy-badge">🌙 MAINAN INTERAKTIF: FASE BISKUIT BULAN</span>
            <span class="toy-sub">Pilih bentuk Bulan untuk melihat senyuman indahnya di langit!</span>
          </div>
          <div class="moon-toy-stage">
            <div class="interactive-moon-sphere" id="interactive-moon-sphere">
              <span class="moon-display-emoji">
                ${this.moonPhaseState === 'sabit' ? '🌙' : (this.moonPhaseState === 'separuh' ? '🌓' : '🌕')}
              </span>
            </div>
          </div>
          <div class="toy-controls">
            <button class="btn-toy-toggle ${this.moonPhaseState === 'sabit' ? 'active' : ''}" data-phase="sabit" type="button">
              🌙 Bulan Sabit
            </button>
            <button class="btn-toy-toggle ${this.moonPhaseState === 'separuh' ? 'active' : ''}" data-phase="separuh" type="button">
              🌓 Bulan Separuh
            </button>
            <button class="btn-toy-toggle ${this.moonPhaseState === 'purnama' ? 'active' : ''}" data-phase="purnama" type="button">
              🌕 Bulan Purnama
            </button>
          </div>
          <div class="toy-status-bar" id="moon-status-text">
            ${this.moonPhaseState === 'sabit' ? 'Bulan Sabit: Melengkung runcing tersenyum di langit malam!' : (this.moonPhaseState === 'separuh' ? 'Bulan Separuh: Separuh wajahnya tersinari cahaya matahari!' : 'Bulan Purnama: Bulat penuh terang benderang menerangi malam!')}
          </div>
        </div>
      `;
    }

    if (lessonId === 'l3_zerog') {
      return `
        <div class="interactive-toy-card iss-toy-card">
          <div class="toy-header">
            <span class="toy-badge">🤸‍♂️ MAINAN INTERAKTIF: MELAYANG DI STASIUN ISS</span>
            <span class="toy-sub">Sentuh astronot dan benda-benda ini untuk membuat mereka melayang salto!</span>
          </div>
          <div class="iss-cabin-stage">
            <button class="floating-prop prop-astro" id="prop-astro" type="button" title="Sentuh Astronot!">🧑‍🚀</button>
            <button class="floating-prop prop-water" id="prop-water" type="button" title="Sentuh Gelembung Air!">💧</button>
            <button class="floating-prop prop-apple" id="prop-apple" type="button" title="Sentuh Apel Melayang!">🍎</button>
          </div>
          <div class="toy-status-bar">
            Di luar angkasa tidak ada gravitasi, semua benda melayang santai seperti di dalam mimpi!
          </div>
        </div>
      `;
    }

    if (lessonId === 'l4_mars_quiz' || lessonId === 'l4_scale_quiz') {
      return `
        <div class="interactive-toy-card mars-toy-card">
          <div class="toy-header">
            <span class="toy-badge">🔴 MAINAN INTERAKTIF: ROBOT PENJELAJAH MARS</span>
            <span class="toy-sub">Kendalikan robot Curiosity mengumpulkan sampel pasir merah Mars!</span>
          </div>
          <div class="mars-rover-stage" id="mars-rover-stage">
            <div class="mars-rover-sprite" id="mars-rover-sprite">🚜🤖</div>
            <div class="mars-rock" id="mars-rock">🪨</div>
          </div>
          <div class="toy-controls">
            <button class="btn-toy-action" id="btn-rover-photo" type="button">
              📸 Jepret Foto Mars (${this.marsRoverPhotos} Foto)
            </button>
            <button class="btn-toy-action" id="btn-rover-sample" type="button">
              🪨 Ambil Sampel Batu (${this.marsRoverRocks} Sampel)
            </button>
          </div>
          <div class="toy-status-bar" id="mars-status-text">
            Robot penjelajah cilik beroda enam sedang menjelajah kawah merah Mars!
          </div>
        </div>
      `;
    }

    return '';
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
            <span class="kids-kicker">🌟 KELAS PETUALANGAN ASTRONOT CILIK · KURIKULUM STEP-BY-STEP</span>
            <h2 class="kids-title">Belajar Luar Angkasa Jadi Mudah & Menyenangkan!</h2>
            <p class="kids-subtitle">Sentuh tombol suara 🔊 di setiap gambar untuk mendengarkan Kak Bintang bercerita ceria!</p>
          </div>
          <div class="kids-banner-controls">
            <button class="btn-toggle-autovoice" id="btn-toggle-autovoice">
              ${spaceAudio.isAutoNarration() ? '🎙️ Suara Otomatis: Aktif' : '🔇 Suara Manual'}
            </button>
          </div>
        </div>

        <!-- 4 Step Island Journey Map -->
        <div class="kids-stages-map">
          ${KID_LEARNING_STAGES.map((s, idx) => {
            const isLocked = commercial.isStageLocked(s.stageNumber);
            return `
            <button class="stage-island-btn ${idx === this.currentStageIdx ? 'active' : ''} ${isLocked ? 'stage-locked' : ''}" data-stage="${idx}">
              <span class="island-num">Langkah ${s.stageNumber} ${isLocked ? '🔒 VIP' : '✅'}</span>
              <span class="island-icon">${isLocked ? '🔒' : s.icon}</span>
              <span class="island-name">${s.titleId.split(':')[1] || s.titleId}</span>
            </button>
            `;
          }).join('')}
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

            <!-- Tactile Interactive Toy for This Lesson -->
            ${this.renderInteractiveLessonToy(currentLesson.id)}

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
                <div class="praise-content-box">
                  <p id="kid-praise-text">${currentLesson.praiseKid}</p>
                  <button class="btn-next-kid-step" id="btn-next-kid-step" type="button">
                    🚀 Lanjut Petualangan Berikutnya! ▶️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Hands-on Interactive Activities Grid -->
        <div class="kids-activity-grid">
          <!-- Activity 1: Fruit Scale Comparator -->
          <div class="kids-interactive-panel">
            <h3>🍎 Taman Buah Tata Surya (Ukuran Nyata)</h3>
            <p style="font-size: 13px; color: var(--space-text-dim);">Sentuh buah apa saja untuk mendengar suara planet mana yang sebesar buah itu!</p>
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

          <!-- Activity 2: Kereta 8 Planet Order Game -->
          <div class="kids-interactive-panel">
            <h3>🚂 Kereta 8 Planet: "Me-Ve-Bu-Ma-Ju-Sa-U-Ne"</h3>
            <p style="font-size: 13px; color: var(--space-text-dim);">Bantu masinis menyambung gerbong dari yang paling dekat dengan Matahari!</p>
            
            <button class="btn-sing-song" id="btn-sing-song" style="margin-bottom: 12px;">
              🎵 Putar Nada & Nyanyian Me-Ve-Bu-Ma
            </button>

            <div class="train-assembly-area">
              <div class="train-tracks" id="train-tracks">
                ${PLANET_TRAIN_ORDER.map((item, idx) => `
                  <div class="train-car ${idx <= this.trainCurrentStep ? 'unlocked' : 'locked'}" style="border-color:${item.color};">
                    <span class="car-emoji">${item.emoji}</span>
                    <span class="car-name">${item.name}</span>
                  </div>
                `).join('')}
              </div>

              <div class="train-actions-prompt" style="margin-top: 12px;">
                <button class="btn-advance-train" id="btn-advance-train">
                  🚂 Sambung Gerbong Berikutnya!
                </button>
              </div>
            </div>
          </div>

          <!-- Activity 3: Astronaut Spacesuit Dressing Game -->
          <div class="kids-interactive-panel">
            <h3>🧑‍🚀 Stasiun Pasang Baju Astronot (Spacesuit)</h3>
            <p style="font-size: 13px; color: var(--space-text-dim);">Pakaikan perlengkapan astronot cilik sebelum terbang ke luar angkasa!</p>
            
            <div class="dress-station-area">
              <div class="astronaut-doll ${this.equippedParts.size === 4 ? 'ready' : ''}" id="astronaut-doll">
                ${this.equippedParts.size === 4 ? '👨‍🚀' : '🧑'}
                <div style="font-size: 12px; font-weight: 800; color: #00e5ff; margin-top: 4px;">
                  ${this.equippedParts.size === 4 ? 'Siap Meluncur!' : `Terpasang: ${this.equippedParts.size}/4 Bagian`}
                </div>
              </div>

              <div class="suit-parts-rack">
                <button class="suit-part-btn ${this.equippedParts.has('helmet') ? 'equipped' : ''}" data-part="helmet" data-desc="Helm Kaca Emas Pelindung Silau Matahari">
                  <span>🪖</span>
                  <span>Helm Kaca Emas</span>
                </button>
                <button class="suit-part-btn ${this.equippedParts.has('backpack') ? 'equipped' : ''}" data-part="backpack" data-desc="Tabung Oksigen Segar untuk Bernapas">
                  <span>🎒</span>
                  <span>Tabung Oksigen</span>
                </button>
                <button class="suit-part-btn ${this.equippedParts.has('suit') ? 'equipped' : ''}" data-part="suit" data-desc="Baju Pelindung Suhu Panas & Dingin">
                  <span>🦺</span>
                  <span>Baju Termal</span>
                </button>
                <button class="suit-part-btn ${this.equippedParts.has('boots') ? 'equipped' : ''}" data-part="boots" data-desc="Sepatu Magnetik Gravitasi Antariksa">
                  <span>🥾</span>
                  <span>Sepatu Magnet</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Activity 4: Balloon Rocket Newton Thruster Experiment -->
          <div class="kids-interactive-panel">
            <h3>🎈 Eksperimen Roket Balon (Rahasia Terbang)</h3>
            <p style="font-size: 13px; color: var(--space-text-dim);">Lihat bagaimana semburan angin ke bawah mendorong roket melompat ke atas!</p>
            
            <div class="balloon-experiment-box">
              <div class="balloon-stage">
                <div class="balloon-rocket-sprite ${this.balloonState}">
                  ${this.balloonState === 'empty' ? '🎈' : (this.balloonState === 'inflated' ? '🎈💨' : '🚀✨')}
                </div>
              </div>

              <div style="display: flex; gap: 10px; justify-content: center; width: 100%;">
                <button class="btn-sing-song" id="btn-inflate-balloon">
                  🌬️ 1. Tiup Balon Besar
                </button>
                <button class="btn-advance-train" id="btn-launch-balloon" ${this.balloonState !== 'inflated' ? 'disabled' : ''}>
                  🚀 2. Lepaskan Balon!
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity 5: Official Space Cadet Certificate of Completion -->
        <div class="kids-interactive-feature-card" style="margin-top: 24px;">
          <div class="feature-card-header">
            <span class="feat-icon">🏆</span>
            <div>
              <h3>Sertifikat Resmi Kelulusan Kadet Kosmik Cilik</h3>
              <p>Ketikkan nama anak untuk mencetak atau menyimpan Sertifikat Prestasi resmi!</p>
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.4); padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 16px; align-items: center;">
            <div style="display: flex; gap: 12px; max-width: 420px; width: 100%;">
              <input type="text" id="input-kid-name" value="${this.kidName}" placeholder="Masukkan Nama Lengkap Anak..." style="flex:1; padding: 12px 16px; border-radius: 12px; border: 1.5px solid rgba(0, 229, 255, 0.4); background: rgba(255,255,255,0.08); color:#fff; font-size:15px; font-weight:700;">
              <button class="btn-advance-train" id="btn-update-cert" style="white-space:nowrap;">
                ⭐ Tampilkan
              </button>
            </div>

            <!-- Visual Certificate Preview -->
            <div class="official-certificate-sheet" id="cert-preview" style="background: #ffffff; color: #0f172a; padding: 28px; border-radius: 16px; border: 8px double #ffd54f; max-width: 580px; width: 100%; text-align: center; box-shadow: 0 12px 32px rgba(0,0,0,0.5);">
              <span style="font-size: 32px;">🌟 🚀 🪐</span>
              <h2 style="font-family: serif; color: #1e3a8a; margin: 8px 0; font-size: 24px; font-weight: 800;">SERTIFIKAT KELULUSAN KOSMOS CILIK</h2>
              <p style="font-size: 13px; color: #475569; margin: 0;">Diberikan dengan penuh rasa bangga kepada Calon Penjelajah Angkasa Cilik:</p>
              <h1 id="cert-kid-name-display" style="font-size: 28px; color: #0284c7; margin: 12px 0; border-bottom: 2px dashed #0284c7; display: inline-block; padding: 0 20px;">
                ${this.kidName}
              </h1>
              <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 10px 0;">
                Telah berhasil menyelesaikan 4 Tahap Belajar Tata Surya, menghafal urutan planet dengan lagu ceria, merakit baju astronot, dan lulus Uji Misi Antariksa Cilik!
              </p>
              <div style="display: flex; justify-content: space-around; margin-top: 18px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                <div>🎖️ Direktur Misi: Kak Bintang</div>
                <div>📅 Tanggal Kelulusan: Resmi 2026</div>
                <div>⭐ Predikat: Kadet Bintang Emas</div>
              </div>
            </div>

            <button class="btn-sing-song" id="btn-print-cert" style="padding: 12px 24px; font-size: 15px;">
              🖨️ Cetak / Simpan Sertifikat
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    if (!this.container) return;

    // Toggle Auto-voice
    const autoVoiceBtn = this.container.querySelector('#btn-toggle-autovoice');
    if (autoVoiceBtn) {
      autoVoiceBtn.addEventListener('click', () => {
        const enabled = spaceAudio.toggleAutoNarration();
        spaceAudio.playPop(500);
        autoVoiceBtn.textContent = enabled ? '🎙️ Suara Otomatis: Aktif' : '🔇 Suara Manual';
        if (enabled) {
          spaceAudio.speakKids('Suara otomatis aktif! Kak Bintang siap bercerita untukmu!');
        }
      });
    }

    // Stage Island Buttons
    const stageBtns = this.container.querySelectorAll('.stage-island-btn');
    stageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-stage') || '0', 10);
        const targetStage = KID_LEARNING_STAGES[sIdx];
        if (commercial.isStageLocked(targetStage.stageNumber)) {
          spaceAudio.playPop(260);
          window.dispatchEvent(new CustomEvent('open-vip-gate'));
          return;
        }

        this.currentStageIdx = sIdx;
        this.activeLessonIdx = 0;
        spaceAudio.playPop(520);
        this.render();

        if (spaceAudio.isAutoNarration()) {
          const currentStage = KID_LEARNING_STAGES[this.currentStageIdx];
          const currentLesson = currentStage.lessons[this.activeLessonIdx];
          setTimeout(() => {
            spaceAudio.speakKids(currentLesson.voiceStory);
          }, 300);
        }
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

        if (spaceAudio.isAutoNarration()) {
          const currentStage = KID_LEARNING_STAGES[this.currentStageIdx];
          const currentLesson = currentStage.lessons[this.activeLessonIdx];
          setTimeout(() => {
            spaceAudio.speakKids(currentLesson.voiceStory);
          }, 300);
        }
      });
    });

    // Big Voice Story Button
    const voiceBtn = this.container.querySelector('#btn-play-lesson-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const currentStage = KID_LEARNING_STAGES[this.currentStageIdx];
        const currentLesson = currentStage.lessons[this.activeLessonIdx];
        voiceBtn.classList.add('pulse');
        setTimeout(() => voiceBtn.classList.remove('pulse'), 600);
        spaceAudio.speakKids(currentLesson.voiceStory);
      });
    }

    // Story bubble clickable
    const speechBubble = this.container.querySelector('.story-speech-bubble');
    if (speechBubble) {
      speechBubble.addEventListener('click', () => {
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
          confetti.fire(0.5, 0.45, 60);
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

    // Advance to next lesson or stage from praise box
    const nextStepBtn = this.container.querySelector('#btn-next-kid-step');
    if (nextStepBtn) {
      nextStepBtn.addEventListener('click', () => {
        const curStage = KID_LEARNING_STAGES[this.currentStageIdx];
        if (this.activeLessonIdx < curStage.lessons.length - 1) {
          this.activeLessonIdx++;
          spaceAudio.playPop(520);
          this.render();
          if (spaceAudio.isAutoNarration()) {
            const nextLesson = curStage.lessons[this.activeLessonIdx];
            setTimeout(() => spaceAudio.speakKids(nextLesson.voiceStory), 300);
          }
        } else if (this.currentStageIdx < KID_LEARNING_STAGES.length - 1) {
          const nextStageIdx = this.currentStageIdx + 1;
          const targetStage = KID_LEARNING_STAGES[nextStageIdx];
          if (commercial.isStageLocked(targetStage.stageNumber)) {
            spaceAudio.playPop(260);
            window.dispatchEvent(new CustomEvent('open-vip-gate'));
            return;
          }
          this.currentStageIdx = nextStageIdx;
          this.activeLessonIdx = 0;
          spaceAudio.playCheer();
          confetti.fire(0.5, 0.45, 70);
          this.render();
          if (spaceAudio.isAutoNarration()) {
            const nextLesson = targetStage.lessons[0];
            setTimeout(() => spaceAudio.speakKids(nextLesson.voiceStory), 300);
          }
        } else {
          // Last stage complete! Scroll down to certificate
          const certCard = this.container?.querySelector('.kids-interactive-feature-card');
          certCard?.scrollIntoView({ behavior: 'smooth' });
          spaceAudio.playCheer();
          confetti.fire(0.5, 0.4, 100);
          spaceAudio.speakKids('Horeee! Kamu telah menyelesaikan semua petualangan! Ambil sertifikat resmi kelulusanmu di bawah ini!');
        }
      });
    }

    // Big Emoji click to play voice and bounce
    const bigEmoji = this.container.querySelector('.lesson-big-emoji');
    if (bigEmoji) {
      bigEmoji.addEventListener('click', () => {
        const curStage = KID_LEARNING_STAGES[this.currentStageIdx];
        const curLesson = curStage.lessons[this.activeLessonIdx];
        bigEmoji.classList.add('pulse');
        setTimeout(() => bigEmoji.classList.remove('pulse'), 600);
        spaceAudio.playPop(660);
        spaceAudio.speakKids(curLesson.voiceStory);
      });
    }

    // Interactive Sun Warmth Emitter
    const sunBtn = this.container.querySelector('#btn-sun-warm');
    const sunSphere = this.container.querySelector('#interactive-sun-sphere');
    const triggerSunWarmth = () => {
      this.sunPulseCount++;
      spaceAudio.playPop(520 + Math.min(this.sunPulseCount * 30, 400));
      confetti.fire(0.5, 0.4, 40);
      const sphere = this.container?.querySelector('#interactive-sun-sphere');
      if (sphere) {
        sphere.classList.add('pulse');
        setTimeout(() => sphere.classList.remove('pulse'), 600);
      }
      const statusText = this.container?.querySelector('#sun-status-text');
      if (statusText) {
        statusText.textContent = `✨ Wuuush! Matahari menyinari Bumi ke-${this.sunPulseCount} kali. Seluruh tanaman & hewan pun hangat!`;
      }
      const warmBtn = this.container?.querySelector('#btn-sun-warm');
      if (warmBtn) {
        warmBtn.textContent = `🔥 Pancarkan Sinar Hangat! (${this.sunPulseCount}x Disinari)`;
      }
      spaceAudio.speakKids('Wuuush! Hangat sekali sinar Matahari kita!');
    };
    sunBtn?.addEventListener('click', triggerSunWarmth);
    sunSphere?.addEventListener('click', triggerSunWarmth);

    // Interactive Earth Day/Night
    const earthDayBtn = this.container.querySelector('#btn-earth-day');
    const earthNightBtn = this.container.querySelector('#btn-earth-night');
    earthDayBtn?.addEventListener('click', () => {
      this.earthTimeState = 'day';
      spaceAudio.playPop(600);
      this.render();
      spaceAudio.speakKids('Saat siang hari, Matahari menyinari Indonesia agar kita bisa bermain ceria!');
    });
    earthNightBtn?.addEventListener('click', () => {
      this.earthTimeState = 'night';
      spaceAudio.playPop(420);
      this.render();
      spaceAudio.speakKids('Saat malam hari, lampu kota menyala indah dan waktunya kita tidur nyenyak!');
    });

    // Interactive Moon Phase Buttons
    const moonPhaseBtns = this.container.querySelectorAll('[data-phase]');
    moonPhaseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const phase = (e.currentTarget as HTMLElement).getAttribute('data-phase') as 'sabit' | 'separuh' | 'purnama';
        if (phase) {
          this.moonPhaseState = phase;
          spaceAudio.playPop(550);
          this.render();
          if (phase === 'sabit') {
            spaceAudio.speakKids('Ini Bulan Sabit yang tersenyum manis seperti pisang di langit malam!');
          } else if (phase === 'separuh') {
            spaceAudio.speakKids('Ini Bulan Separuh, seperti biskuit yang dimakan setengah!');
          } else {
            spaceAudio.speakKids('Ini Bulan Purnama yang bulat penuh dan terang benderang!');
          }
        }
      });
    });

    // Interactive ISS Zero-G Floating Props
    const zeroGProps = this.container.querySelectorAll('.floating-prop');
    zeroGProps.forEach(prop => {
      prop.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.add('pulse');
        setTimeout(() => target.classList.remove('pulse'), 600);
        spaceAudio.playPop(650 + Math.random() * 250);
        spaceAudio.speakKids('Hop! Di dalam stasiun antariksa tanpa gravitasi, semua benda melayang-layang!');
      });
    });

    // Interactive Mars Rover Actions
    const roverPhotoBtn = this.container.querySelector('#btn-rover-photo');
    const roverSampleBtn = this.container.querySelector('#btn-rover-sample');
    roverPhotoBtn?.addEventListener('click', () => {
      this.marsRoverPhotos++;
      spaceAudio.playPop(850);
      confetti.fire(0.5, 0.45, 50);
      const flash = document.createElement('div');
      flash.className = 'camera-flash-overlay';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 250);
      this.render();
      spaceAudio.speakKids(`Cekrek! Foto kawah merah Mars ke-${this.marsRoverPhotos} berhasil dipotret!`);
    });
    roverSampleBtn?.addEventListener('click', () => {
      this.marsRoverRocks++;
      spaceAudio.playPop(480);
      badgesManager.addXp(15);
      this.render();
      spaceAudio.speakKids(`Batu Mars ke-${this.marsRoverRocks} berhasil diambil robot Curiosity!`);
    });

    // Fruit analogy cards clickable directly
    const fruitCards = this.container.querySelectorAll('.fruit-analogy-box');
    fruitCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('btn-fruit-voice')) return;
        const voiceBtn = card.querySelector('.btn-fruit-voice');
        const text = voiceBtn?.getAttribute('data-voice');
        if (text) {
          card.classList.add('pulse');
          setTimeout(() => card.classList.remove('pulse'), 500);
          spaceAudio.playPop(580);
          spaceAudio.speakKids(text);
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

    // Sing Song button with melodic audio accompaniment
    const songBtn = this.container.querySelector('#btn-sing-song');
    if (songBtn) {
      songBtn.addEventListener('click', () => {
        spaceAudio.playPlanetSongMelody();
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
          confetti.fire(0.5, 0.4, 80);
          spaceAudio.speakKids('Horeee! Kereta 8 planet sudah lengkap dan siap meluncur keliling antariksa!');
          this.trainCurrentStep = 0;
          this.render();
        }
      });
    }

    // Spacesuit parts buttons
    const suitBtns = this.container.querySelectorAll('.suit-part-btn');
    suitBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const part = target.getAttribute('data-part');
        const desc = target.getAttribute('data-desc') || '';
        if (!part) return;

        if (this.equippedParts.has(part)) {
          this.equippedParts.delete(part);
          spaceAudio.playPop(300);
        } else {
          this.equippedParts.add(part);
          spaceAudio.playSuitEquip();
          spaceAudio.speakKids(desc);
        }

        if (this.equippedParts.size === 4) {
          setTimeout(() => {
            spaceAudio.playCheer();
            confetti.fire(0.5, 0.4, 80);
            spaceAudio.speakKids('Luar biasa! Astronot cilik kita sudah memakai baju lengkap dan siap terbang ke luar angkasa!');
          }, 800);
        }

        this.render();
      });
    });

    // Balloon Experiment Buttons
    const inflateBtn = this.container.querySelector('#btn-inflate-balloon');
    if (inflateBtn) {
      inflateBtn.addEventListener('click', () => {
        this.balloonState = 'inflated';
        spaceAudio.playBalloonHiss(1.2);
        spaceAudio.speakKids('Fuuuuh! Balon ditiup mengembang besar penuh udara!');
        this.render();
      });
    }

    const launchBtn = this.container.querySelector('#btn-launch-balloon');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        this.balloonState = 'launched';
        spaceAudio.playBalloonHiss(2.0);
        spaceAudio.playWarpWhoosh();
        spaceAudio.speakKids('Wuuush! Angin menyembur deras ke bawah, mendorong roket balon melompat tinggi ke atas awan! Aksi dan reaksi!');
        this.render();

        setTimeout(() => {
          this.balloonState = 'empty';
          this.render();
        }, 3500);
      });
    }

    // Certificate Name Update
    const updateCertBtn = this.container.querySelector('#btn-update-cert');
    const inputName = this.container.querySelector('#input-kid-name') as HTMLInputElement;
    if (updateCertBtn && inputName) {
      updateCertBtn.addEventListener('click', () => {
        this.kidName = inputName.value.trim() || 'Kadet Cilik';
        spaceAudio.playCheer();
        confetti.fire(0.5, 0.35, 100);
        spaceAudio.speakKids(`Selamat untuk Kadet ${this.kidName}! Kamu resmi menjadi penjelajah antariksa bintang emas!`);
        this.render();
      });
    }

    // Print Certificate
    const printBtn = this.container.querySelector('#btn-print-cert');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        spaceAudio.playPop(600);
        window.print();
      });
    }
  }
}

export const kidsPathway = new KidsPathwayManager();
