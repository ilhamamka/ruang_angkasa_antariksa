#!/usr/bin/env bash
# Quick helper to run auto-push watcher
cd "$(dirname "$0")/.."
node scripts/auto-push.mjs "$@"
