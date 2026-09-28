#!/usr/bin/env zsh
set -u

ROOT="/Users/grrb/ai-sandbox/rereresearch"
LOG_DIR="$ROOT/logs"
ONCE_SCRIPT="$ROOT/scripts/x_capture_once.sh"
INTERVAL_SECONDS="${X_CAPTURE_INTERVAL_SECONDS:-300}"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

mkdir -p "$LOG_DIR"
cd "$ROOT" || exit 1

echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] x capture daemon start"

while true; do
  cycle_start=$(date '+%Y-%m-%d %H:%M:%S %z')
  echo "[$cycle_start] x capture cycle begin" >> "$LOG_DIR/x_capture_launchd.out.log"

  "$ONCE_SCRIPT"
  cycle_code=$?

  cycle_end=$(date '+%Y-%m-%d %H:%M:%S %z')
  echo "[$cycle_end] x capture cycle exit=${cycle_code}" >> "$LOG_DIR/x_capture_launchd.out.log"

  echo "[$cycle_end] x capture sleep=${INTERVAL_SECONDS}s" >> "$LOG_DIR/x_capture_launchd.out.log"
  /bin/sleep "$INTERVAL_SECONDS"
done
