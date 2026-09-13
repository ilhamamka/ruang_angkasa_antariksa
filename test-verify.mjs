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
console.log(`✅ 7. Kurikulum anak usia dini (4 tahap scaffolded, analogi buah, kereta planet & narasi suara) terverifikasi 100% valid.\n`);

console.log('🎉 SEMUA PENGUJIAN OTOMATIS BERHASIL DENGAN 100% SUKSES!');


