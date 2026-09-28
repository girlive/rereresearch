#!/usr/bin/env zsh
set -u

ROOT="/Users/grrb/ai-sandbox/rereresearch"
ONCE_SCRIPT="$ROOT/scripts/x_capture_once.sh"
LOG_DIR="$ROOT/logs"
LIMIT="${X_SEARCH_LIMIT:-10}"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

mkdir -p "$LOG_DIR"
cd "$ROOT" || exit 1

if [ "$#" -gt 0 ]; then
  queries=("$@")
else
  queries=(claude gpt codex nanobanana seedance)
fi

for query in "${queries[@]}"; do
  echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] search batch begin query=${query} limit=${LIMIT}" >> "$LOG_DIR/x_capture_search_batch.log"
  "$ONCE_SCRIPT" search "$query" "$LIMIT"
  code=$?
  echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] search batch exit=${code} query=${query}" >> "$LOG_DIR/x_capture_search_batch.log"
  if [ "$code" -ne 0 ]; then
    exit "$code"
  fi
done
