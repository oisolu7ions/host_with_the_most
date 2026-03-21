#!/usr/bin/env bash
# Optional: shrink gal9.MOV for faster playback after load (needs ffmpeg).
# Run from project root: bash scripts/optimize-gallery-video.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/images/gal9.MOV"
OUT="$ROOT/images/gal9.mp4"
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Install ffmpeg first, e.g.: sudo apt install ffmpeg"
  exit 1
fi
ffmpeg -y -i "$SRC" \
  -c:v libx264 -crf 28 -preset fast \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$OUT"
echo "Wrote $OUT — update gallery.html data-src to images/gal9.mp4 if you replace the original."
