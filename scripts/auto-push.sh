#!/usr/bin/env bash
# Auto-push script for Ruang Angkasa Antariksa repository
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

if [ "$1" = "--watch" ]; then
  echo "🛸 Menjalankan mode pemantauan file (Watcher)..."
  node scripts/auto-push.mjs
  exit 0
fi

MESSAGE="${1:-"Update: $(date '+%Y-%m-%d %H:%M:%S')"}"

git add -A
if git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "ℹ️ Tidak ada perubahan baru untuk di-commit."
else
  git commit -m "$MESSAGE"
  echo "✅ Commit berhasil: $MESSAGE"
fi

echo "🚀 Memastikan sinkronisasi ke origin main..."
git push origin main || true
echo "🎉 Push ke GitHub selesai!"
