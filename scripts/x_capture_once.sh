#!/usr/bin/env zsh
set -u

ROOT="/Users/grrb/ai-sandbox/rereresearch"
LOG_DIR="$ROOT/logs"
LOCK_DIR="$ROOT/.cache/x-capture.lock"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
MAX_LOCK_AGE_SECONDS="${X_CAPTURE_MAX_LOCK_AGE_SECONDS:-70}"
MAX_RUN_SECONDS="${X_CAPTURE_MAX_RUN_SECONDS:-240}"

MODE="${1:-${X_CAPTURE_MODE:-for_you}}"
case "$MODE" in
  for-you|for_you|foryou)
    MODE="for_you"
    BASE_PROMPT="$ROOT/scripts/x_capture_once_prompt.md"
    ;;
  search)
    MODE="search"
    BASE_PROMPT="$ROOT/scripts/x_capture_search_prompt.md"
    ;;
  *)
    echo "unsupported X capture mode: $MODE" >&2
    echo "usage: $0 [for_you|search] [search query] [limit]" >&2
    exit 2
    ;;
esac

SEARCH_QUERY="${2:-${X_SEARCH_QUERY:-}}"
SEARCH_LIMIT="${3:-${X_SEARCH_LIMIT:-10}}"

if [ "$MODE" = "search" ] && [ -z "$SEARCH_QUERY" ]; then
  echo "search mode requires a query: $0 search 'query' [limit]" >&2
  exit 2
fi

if ! [[ "$SEARCH_LIMIT" =~ '^[0-9]+$' ]]; then
  echo "search limit must be a positive integer: $SEARCH_LIMIT" >&2
  exit 2
fi

PROMPT="$ROOT/.cache/x-capture-prompt-$$.md"

mkdir -p "$LOG_DIR" "$ROOT/.cache"
cd "$ROOT" || exit 1

if [ -d "$LOCK_DIR" ]; then
  now=$(date +%s)
  lock_mtime=$(stat -f %m "$LOCK_DIR" 2>/dev/null || echo "$now")
  lock_age=$((now - lock_mtime))
  if [ "$lock_age" -gt "$MAX_LOCK_AGE_SECONDS" ]; then
    rmdir "$LOCK_DIR" 2>/dev/null || true
    echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] removed stale lock age=${lock_age}s" >> "$LOG_DIR/x_capture_once.log"
  fi
fi

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] previous capture still running; skipped" >> "$LOG_DIR/x_capture_once.log"
  exit 0
fi

cleanup() {
  rmdir "$LOCK_DIR" 2>/dev/null || true
  rm -f "$PROMPT" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

{
  sed -n '1,260p' "$BASE_PROMPT"
  printf '\n\nRuntime mode context:\n'
  printf -- '- mode: %s\n' "$MODE"
  if [ "$MODE" = "search" ]; then
    printf -- '- search_query: %s\n' "$SEARCH_QUERY"
    printf -- '- search_limit: %s\n' "$SEARCH_LIMIT"
  fi
} > "$PROMPT"

{
  echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] capture cycle start"
  echo "mode=${MODE} search_query=${SEARCH_QUERY:-} search_limit=${SEARCH_LIMIT}"
  /opt/homebrew/bin/codex exec \
    -C "$ROOT" \
    -m gpt-5.4-mini \
    --sandbox workspace-write \
    - < "$PROMPT" &
  codex_pid=$!
  elapsed=0
  timed_out=0

  while kill -0 "$codex_pid" 2>/dev/null; do
    if [ "$elapsed" -ge "$MAX_RUN_SECONDS" ]; then
      timed_out=1
      echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] capture cycle timeout after ${MAX_RUN_SECONDS}s; stopping pid=${codex_pid}"
      child_pids=$(pgrep -P "$codex_pid" 2>/dev/null || true)
      if [ -n "$child_pids" ]; then
        kill $child_pids 2>/dev/null || true
      fi
      kill "$codex_pid" 2>/dev/null || true
      /bin/sleep 5
      child_pids=$(pgrep -P "$codex_pid" 2>/dev/null || true)
      if [ -n "$child_pids" ]; then
        kill -9 $child_pids 2>/dev/null || true
      fi
      kill -9 "$codex_pid" 2>/dev/null || true
      break
    fi
    /bin/sleep 1
    elapsed=$((elapsed + 1))
  done

  if [ "$timed_out" -eq 1 ]; then
    wait "$codex_pid" 2>/dev/null || true
    code=124
  else
    wait "$codex_pid"
    code=$?
  fi
  echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] capture cycle exit=${code}"
} >> "$LOG_DIR/x_capture_once.log" 2>&1

exit "$code"
