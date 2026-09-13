#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { watch } from 'node:fs';
import { resolve, relative } from 'node:path';

const ROOT_DIR = process.cwd();
const isOnce = process.argv.includes('--once');

function execute(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' }).trim();
  } catch (err) {
    return null;
  }
}

function syncAndPush(triggerReason = 'perubahan kode') {
  const status = execute('git status --porcelain');
  if (!status) {
    console.log(`[Auto-Push] 🚀 Tidak ada perubahan baru untuk di-push.`);
    return;
  }

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  console.log(`[Auto-Push] 🔄 Mendeteksi perubahan (${triggerReason}). Menyiapkan commit & push...`);

  try {
    execute('git add -A');
    const commitMsg = `feat(space): auto sync perubahan [${timestamp}] - ${triggerReason}`;
    execute(`git commit -m "${commitMsg}"`);
    console.log(`[Auto-Push] 📦 Commit tersimpan: "${commitMsg}"`);
    
    console.log(`[Auto-Push] ⬆️ Mengunggah ke GitHub origin main...`);
    execute('git push origin main');
    console.log(`[Auto-Push] ✅ Berhasil di-push ke GitHub pada ${timestamp}!`);
  } catch (error) {
    console.error(`[Auto-Push] ⚠️ Gagal saat push:`, error.message);
  }
}

if (isOnce) {
  syncAndPush('manual / one-shot sync');
  process.exit(0);
}

console.log('🛸 [Auto-Push Watcher] Memulai pemantauan perubahan file di ruang_angkasa_antariksa...');
console.log('Tekan Ctrl+C untuk berhenti.\n');

// Push initial state if any
syncAndPush('inisialisasi watcher');

let debounceTimer = null;
const ignoredPaths = ['.git', 'node_modules', 'dist', '.DS_Store'];

try {
  watch(ROOT_DIR, { recursive: true }, (_eventType, filename) => {
    if (!filename) return;
    const rel = filename.replace(/\\/g, '/');
    if (ignoredPaths.some(p => rel.startsWith(p) || rel.includes('/' + p + '/'))) {
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      syncAndPush(`edit pada ${rel}`);
    }, 3500);
  });
} catch (e) {
  console.error('[Auto-Push] Watcher error:', e.message);
}
