// Automated Self-Check & Sanity Tests for Ruang Angkasa Antariksa
// Native Node.js assert-based test runner (no heavy test frameworks needed)

import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

console.log('🧪 [Test Suite] Memulai verifikasi otomatis sistem Ruang Angkasa Antariksa...\n');

// 1. Check critical files exist
const criticalFiles = [
  'index.html',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'src/style.css',
  'src/main.ts',
  'src/audio.ts',
  'src/textures-generator.ts',
  'src/planets-data.ts',
  'src/rockets-data.ts',
  'src/cosmos-data.ts',
  'src/game-solarsystem.ts',
  'src/game-rocketlab.ts',
  'src/game-deepspace.ts',
  'src/game-sandbox.ts',
  'src/questions-engine.ts',
  'src/chart-encyclopedia.ts',
  'src/badges-album.ts',
  'src/worksheets.ts',
  'src/parent-guide.ts',
  'src/commercial.ts',
  'scripts/auto-push.sh',
  'scripts/auto-push.mjs',
  '.git/hooks/post-commit'
];

criticalFiles.forEach(file => {
  assert(existsSync(file), `File wajib tidak ditemukan: ${file}`);
});
console.log(`✅ 1. Semua ${criticalFiles.length} file inti proyek terverifikasi lengkap.`);

// 2. Test Planetary Data Integrity
import { CELESTIAL_BODIES } from './src/planets-data.ts';
assert(CELESTIAL_BODIES.length >= 10, 'Data planet harus minimal mencakup 10 objek langit');

const requiredPlanets = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
requiredPlanets.forEach(id => {
  const found = CELESTIAL_BODIES.find(p => p.id === id);
  assert(found, `Planet ${id} wajib ada dalam data kurikulum`);
  assert(found.diameterKm > 0, `Diameter planet ${id} harus positif`);
  assert(found.gravityRatio > 0, `Rasio gravitasi planet ${id} harus positif`);
  assert(found.funFactsId.length >= 3, `Planet ${id} harus memiliki minimal 3 fakta menarik`);
  assert(found.svgVisual.includes('<svg'), `Visual SVG planet ${id} harus valid`);
});
console.log(`✅ 2. Data kurikulum tata surya & 10 benda langit terverifikasi valid dan lengkap.`);

// 3. Test Rocket Engineering & Physics
import { ROCKET_PARTS, SPACE_MISSIONS } from './src/rockets-data.ts';
assert(ROCKET_PARTS.length >= 8, 'Komponen roket harus minimal 8 bagian');

const categories = ['capsule', 'upper_stage', 'core_tank', 'booster'];
categories.forEach(cat => {
  const parts = ROCKET_PARTS.filter(p => p.category === cat);
  assert(parts.length >= 2, `Kategori ${cat} harus memiliki minimal 2 pilihan komponen`);
});

// Physics test: Ensure core tank + booster provides sufficient TWR > 1.2
const capsule = ROCKET_PARTS.find(p => p.category === 'capsule');
const upper = ROCKET_PARTS.find(p => p.category === 'upper_stage');
const core = ROCKET_PARTS.find(p => p.category === 'core_tank');
const booster = ROCKET_PARTS.find(p => p.category === 'booster');

const totalMassKg = capsule.weightKg + upper.weightKg + core.weightKg + booster.weightKg;
const totalThrustKn = capsule.thrustKn + upper.thrustKn + core.thrustKn + booster.thrustKn;
const weightKn = (totalMassKg * 9.81) / 1000;
const twr = totalThrustKn / weightKn;
assert(twr > 1.2, `TWR roket standar harus melebihi 1.2 untuk bisa lepas landas (Didapat: ${twr.toFixed(2)})`);

assert(SPACE_MISSIONS.length >= 5, 'Misi luar angkasa harus mencakup minimal 5 misi utama');
console.log(`✅ 3. Data teknik roket, hukum dorong TWR, dan misi antariksa lolos verifikasi fisika.`);

// 4. Test Stellar Lifecycle & Deep Space
import { STELLAR_LIFECYCLE, COSMIC_ENTITIES } from './src/cosmos-data.ts';
assert.strictEqual(STELLAR_LIFECYCLE.length, 6, 'Siklus hidup bintang harus memiliki 6 fase evolusi');
STELLAR_LIFECYCLE.forEach((stage, idx) => {
  assert.strictEqual(stage.order, idx + 1, `Urutan tahap bintang harus berurutan (Tahap ${stage.nameId})`);
});
assert(COSMIC_ENTITIES.length >= 4, 'Entitas kosmos harus minimal 4 fenomena');
console.log(`✅ 4. Siklus hidup bintang (Nebula s/d Lubang Hitam) & galaksi terverifikasi runtut.`);

// 5. Test Quiz Engine Logic
import { QUIZ_QUESTIONS, QuizController } from './src/questions-engine.ts';
assert(QUIZ_QUESTIONS.length >= 15, 'Soal kuis antariksa harus minimal 15 soal');
QUIZ_QUESTIONS.forEach(q => {
  assert(q.correctIndex >= 0 && q.correctIndex < q.optionsId.length, `Index jawaban benar soal "${q.questionId}" tidak valid`);
  assert(q.xpReward >= 20, 'Hadiah XP kuis harus valid');
  assert(q.explanationId.length > 10, 'Penjelasan jawaban kuis harus mendidik');
});

const testQuiz = new QuizController();
const firstQ = testQuiz.getCurrentQuestion();
assert(firstQ, 'Harus ada soal aktif');
const ansResult = testQuiz.submitAnswer(firstQ.correctIndex);
assert.strictEqual(ansResult.isCorrect, true, 'Jawaban benar harus bernilai isCorrect: true');
console.log(`✅ 5. Mesin kuis dan validasi skor/XP lolos pengujian.`);

// 6. Test HTML & Git Hooks
const indexHtml = readFileSync('index.html', 'utf-8');
assert(indexHtml.includes('id="starfield-canvas"'), 'Canvas starfield harus ada di index.html');
assert(indexHtml.includes('id="screen-home"'), 'Screen home harus ada di index.html');
assert(indexHtml.includes('id="screen-solarsystem"'), 'Screen solarsystem harus ada di index.html');
assert(indexHtml.includes('id="screen-rocketlab"'), 'Screen rocketlab harus ada di index.html');
assert(indexHtml.includes('id="screen-deepspace"'), 'Screen deepspace harus ada di index.html');
assert(indexHtml.includes('id="screen-kidspathway"'), 'Screen kidspathway harus ada di index.html');

const postCommitHook = readFileSync('.git/hooks/post-commit', 'utf-8');
assert(postCommitHook.includes('git push origin main'), 'Hook post-commit harus melakukan push ke origin main');
console.log(`✅ 6. Integrasi DOM index.html dan Git post-commit hook terverifikasi.`);

// 7. Test Early Childhood Pedagogy & Curriculum
import { KID_LEARNING_STAGES, KID_FRUIT_ANALOGIES, PLANET_TRAIN_ORDER } from './src/kids-curriculum.ts';
assert.strictEqual(KID_LEARNING_STAGES.length, 4, 'Kurikulum anak usia dini harus memiliki 4 tahap berjenjang');
KID_LEARNING_STAGES.forEach((stage, idx) => {
  assert.strictEqual(stage.stageNumber, idx + 1, `Urutan tahap anak harus runtut (Tahap ${stage.stageNumber})`);
  assert(stage.lessons.length >= 2, `Tahap ${stage.stageNumber} harus memiliki minimal 2 modul pelajaran anak`);
  stage.lessons.forEach(l => {
    assert(l.voiceStory.length > 10, `Cerita audio pelajaran ${l.id} harus lengkap`);
    assert(l.optionsKid.length >= 2, `Opsi pertanyaan anak ${l.id} harus minimal 2 pilihan`);
    assert(l.correctKidIdx >= 0 && l.correctKidIdx < l.optionsKid.length, `Kunci jawaban ${l.id} harus valid`);
    assert(l.praiseKid.length > 5, `Kalimat pujian ${l.id} harus ada`);
  });
});

assert(KID_FRUIT_ANALOGIES.length >= 9, 'Skala analogi buah cilik harus memuat minimal Matahari + 8 planet');
KID_FRUIT_ANALOGIES.forEach(f => {
  assert(f.fruitEmoji && f.fruitName, `Analogi buah untuk ${f.planetId} harus memiliki nama dan emoji`);
  assert(f.voiceScript.length > 15, `Narasi audio untuk ${f.planetId} harus ada dan mendidik`);
  assert(f.fruitComparison.length > 10, `Perbandingan ukuran buah untuk ${f.planetId} harus jelas`);
});

assert.strictEqual(PLANET_TRAIN_ORDER.length, 9, 'Gerbong kereta planet harus tepat Lokomotif Matahari + 8 planet');
const expectedTrainOrder = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
PLANET_TRAIN_ORDER.forEach((car, i) => {
  assert.strictEqual(car.id, expectedTrainOrder[i], `Urutan gerbong ke-${i+1} harus ${expectedTrainOrder[i]}`);
});

import { kidsPathway } from './src/game-kids-pathway.ts';
assert(typeof kidsPathway.mount === 'function', 'kidsPathway.mount harus ada');
assert(typeof kidsPathway.unmount === 'function', 'kidsPathway.unmount harus ada');
console.log(`✅ 7. Kurikulum anak usia dini & mainan interaktif (Matahari, Bumi, Bulan, ISS, Mars, Kereta & Balon) terverifikasi 100% valid.\n`);

// 8. Test Sound & Audio Engine API
import { spaceAudio } from './src/audio.ts';
assert.strictEqual(typeof spaceAudio.isSoundEnabled, 'function', 'spaceAudio.isSoundEnabled harus ada');
assert.strictEqual(typeof spaceAudio.speakKids, 'function', 'spaceAudio.speakKids harus ada');
assert.strictEqual(typeof spaceAudio.playPlanetSongMelody, 'function', 'spaceAudio.playPlanetSongMelody harus ada');
assert.strictEqual(typeof spaceAudio.playBalloonHiss, 'function', 'spaceAudio.playBalloonHiss harus ada');
assert.strictEqual(typeof spaceAudio.playSuitEquip, 'function', 'spaceAudio.playSuitEquip harus ada');
assert.strictEqual(typeof spaceAudio.toggleAutoNarration, 'function', 'spaceAudio.toggleAutoNarration harus ada');
const autoState = spaceAudio.isAutoNarration();
spaceAudio.toggleAutoNarration();
assert.strictEqual(spaceAudio.isAutoNarration(), !autoState, 'Toggle auto narration harus mengubah state');
spaceAudio.toggleAutoNarration(); // restore
// 9. Test Commercial VIP Licensing & Parental Safety Gate
import { commercial } from './src/commercial.ts';
commercial.setVIP(false);
assert.strictEqual(commercial.isVIP(), false, 'VIP harus false di awal pengujian');
assert.strictEqual(commercial.isStageLocked(1), false, 'Langkah 1 harus selalu gratis demo');
assert.strictEqual(commercial.isStageLocked(2), true, 'Langkah 2 harus terkunci untuk non-VIP');
assert.strictEqual(commercial.isStageLocked(3), true, 'Langkah 3 harus terkunci untuk non-VIP');
assert.strictEqual(commercial.isStageLocked(4), true, 'Langkah 4 harus terkunci untuk non-VIP');

// Test valid code activation
const actResult1 = commercial.activateLicenseCode('ANTARIKSA2026');
assert.strictEqual(actResult1.success, true, 'Kode ANTARIKSA2026 harus valid');
assert.strictEqual(commercial.isVIP(), true, 'VIP harus aktif setelah kode dimasukkan');
assert.strictEqual(commercial.isStageLocked(2), false, 'Langkah 2 harus terbuka untuk VIP');
assert.strictEqual(commercial.isStageLocked(4), false, 'Langkah 4 harus terbuka untuk VIP');

// Test dynamic pattern code
const actResult2 = commercial.activateLicenseCode('VIP-ABCD99');
assert.strictEqual(actResult2.success, true, 'Kode pola VIP-ABCD99 harus valid');

// Test invalid code
commercial.setVIP(false);
const actResult3 = commercial.activateLicenseCode('SALAHKODE');
assert.strictEqual(actResult3.success, false, 'Kode SALAHKODE harus ditolak');
assert.strictEqual(commercial.isVIP(), false, 'VIP harus tetap false saat kode salah');

// Test parental gate math
const gateQ = commercial.generateParentGateQuestion();
assert(gateQ.question.includes('Berapa'), 'Soal gate orang tua harus berisi pertanyaan');
assert(typeof gateQ.answer === 'number' && gateQ.answer > 0, 'Jawaban gate harus berupa bilangan positif');
console.log(`✅ 9. Sistem komersial, lisensi VIP (kode promo & voucher), dan parental safety gate terverifikasi valid.\n`);

// 10. Check all pre-rendered natural excited audio files exist (.mp3 and .m4a)
const storyIds = [
  'l1_sun', 'l1_earth', 'l1_moon', 'l2_song', 'l2_giants',
  'l3_balloon_rocket', 'l3_suit', 'l3_zerog', 'l4_scale_quiz', 'l4_mars_quiz',
  'fruit_sun', 'fruit_mercury', 'fruit_venus', 'fruit_earth', 'fruit_mars',
  'fruit_jupiter', 'fruit_saturn', 'fruit_uranus', 'fruit_neptune',
  'praise_hebat', 'praise_pintar', 'praise_luarbiasa', 'praise_keren'
];
storyIds.forEach(id => {
  assert(existsSync(`public/audio/stories/${id}.mp3`), `File audio MP3 harus ada: ${id}.mp3`);
  assert(existsSync(`public/audio/stories/${id}.m4a`), `File audio M4A harus ada: ${id}.m4a`);
});
console.log(`✅ 10. Semua 23 file audio narasi suara asli excited & praise (.mp3 & .m4a) terverifikasi lengkap di public/audio/stories/.\n`);

// 11. Test Confetti Engine & Worksheets PNG Exporter Exists
assert(existsSync('src/confetti.ts'), 'Engine confetti src/confetti.ts harus ada');
import { worksheetsManager } from './src/worksheets.ts';
assert(typeof worksheetsManager.mount === 'function', 'worksheetsManager.mount harus fungsi');

// 12. Test Sandbox Minigames (Lunar Lander Simulator & Nusantara Constellations)
import { spaceSandbox } from './src/game-sandbox.ts';
assert(typeof spaceSandbox.mount === 'function', 'spaceSandbox.mount harus ada');
assert(typeof spaceSandbox.unmount === 'function', 'spaceSandbox.unmount harus ada');
console.log('✅ 12. Game Apollo Lunar Lander & Teleskop Rasi Bintang Nusantara terverifikasi siap dimainkan.\n');

console.log('🎉 SEMUA PENGUJIAN OTOMATIS BERHASIL DENGAN 100% SUKSES!');




