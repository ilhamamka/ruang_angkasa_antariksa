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

const postCommitHook = readFileSync('.git/hooks/post-commit', 'utf-8');
assert(postCommitHook.includes('git push origin main'), 'Hook post-commit harus melakukan push ke origin main');
console.log(`✅ 6. Integrasi DOM index.html dan Git post-commit hook terverifikasi.\n`);

console.log('🎉 SEMUA PENGUJIAN OTOMATIS BERHASIL DENGAN 100% SUKSES!');
