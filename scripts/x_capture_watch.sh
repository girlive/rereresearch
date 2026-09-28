#!/usr/bin/env zsh
set -u

ROOT="/Users/grrb/ai-sandbox/rereresearch"
PROMPT="$ROOT/scripts/x_capture_once_prompt.md"
LOG_DIR="$ROOT/logs"
LOCK_DIR="$ROOT/.cache/x-capture.lock"
INTERVAL_SECONDS="${X_CAPTURE_INTERVAL_SECONDS:-300}"

mkdir -p "$LOG_DIR" "$ROOT/.cache"
cd "$ROOT" || exit 1

echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] x capture watch started; interval=${INTERVAL_SECONDS}s"

while true; do
  if mkdir "$LOCK_DIR" 2>/dev/null; then
    {
      echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] capture cycle start"
      /opt/homebrew/bin/codex exec \
        --cd "$ROOT" \
        --sandbox workspace-write \
        - < "$PROMPT"
      code=$?
      echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] capture cycle exit=${code}"
    } >> "$LOG_DIR/x_capture_watch.log" 2>&1
    rmdir "$LOCK_DIR" 2>/dev/null || true
  else
    echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] previous capture still running; skipped" >> "$LOG_DIR/x_capture_watch.log"
  fi

  sleep "$INTERVAL_SECONDS"
done
