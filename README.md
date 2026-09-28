# rereresearch

リサーチテーマ（`themes/`）とレポート（`reports/`）、および X タイムラインのキャプチャ用スクリプト（定期実行は現在停止中）を置くリポジトリ。
作業ルールは `AGENTS.md` / `CLAUDE.md` を参照。

## 実行環境と依存関係

> 影響範囲の調査用。実行場所や外部リソースを変えたら、ここも更新する。

**現状: 定期実行は停止中（2026-04-28 以降未実行、launchd 未ロード）。** plist は `~/Library/LaunchAgents/` に置かれているが `launchctl list` に登録なし。`logs/x_capture_once.log` の最終実行は 2026-04-28 14:41 JST。以下はすべて手動実行のみ。

### 実行環境
| 処理 | 実行場所 | 起動 (JST) | デプロイ |
|---|---|---|---|
| X「おすすめ」定期キャプチャ（`scripts/x_capture_daemon.sh` → `scripts/x_capture_once.sh`） | grrb の Mac（`/Users/grrb/ai-sandbox/rereresearch`）、launchd `com.grrb.rereresearch.x-capture` | **停止中（2026-04-28 以降未実行、launchd 未ロード）**。稼働時は常駐ループ（1周ごとに 300 秒 sleep、1回最大 240 秒） | `launchd/com.grrb.rereresearch.x-capture.plist` を `~/Library/LaunchAgents/` にコピーして bootstrap（下記） |
| X 1回キャプチャ（`npm run x:capture` / `x:capture:for-you` / `x:capture:search`） | 同 Mac | 手動 | なし（ローカル実行） |
| X 検索バッチ（`scripts/x_capture_search_batch.sh`、既定クエリ claude / gpt / codex / nanobanana / seedance） | 同 Mac | 手動（最終実行 2026-04-27 22:04） | なし |
| 旧常駐ループ（`scripts/x_capture_watch.sh`） | 同 Mac | 未使用（`x_capture_daemon.sh` の前身。最終ログ 2026-04-27） | なし |
| ハイライト生成（`scripts/highlight_raw.mjs`、`npm run highlights` / `highlights:all` / `highlights:slack`） | 同 Mac | 手動 | なし |
| ハイライト定期生成（`scripts/highlight_hourly.mjs`、`npm run highlights:hourly`） | 同 Mac（フォアグラウンドプロセス） | 未稼働。起動すると `HIGHLIGHTS_INTERVAL_MINUTES`（既定 60 分）ごと | なし |
| ハイライト LAN 配信（`scripts/serve_highlights.mjs`、`npm run highlights:serve`） | 同 Mac、`HOST`（既定 `0.0.0.0`）:`PORT`（既定 8787） | 未稼働（手動起動） | なし |
| raw 監査（`scripts/audit_x_raw.mjs`、`npm run x:audit`） | 同 Mac | 手動 | なし |
| eBay スクレイプ（ルート直下 `scrape_ebay*.mjs`、未コミット） | 同 Mac | 手動 | なし |

### 依存リソース
| 種別 | 名前 | ID・場所 | 読/書 | 用途・参照箇所 |
|---|---|---|---|---|
| CLI | Codex CLI | `/opt/homebrew/bin/codex`（`codex exec -m gpt-5.4-mini --sandbox workspace-write`） | 実行 | `x_capture_once.sh`（`x_capture_watch.sh` はモデル指定なし） |
| 外部サービス | OpenAI（Codex 経由の LLM） | モデル `gpt-5.4-mini` | 読 | 認証は Codex CLI 側の設定に依存（リポジトリ内に鍵なし） |
| ローカルアプリ | Computer Use + Firefox | Mac 上の既存 Firefox、X にログイン済みであること | 読（画面操作） | `scripts/x_capture_*_prompt.md` が Computer Use 経由の Firefox 操作のみを指示 |
| 外部アカウント | X（Twitter） | `@maypdgj`（`https://x.com/home` の「おすすめ」／検索） | 読 | キャプチャ対象。ファイル名 `x_maypdgj_*` の由来 |
| 外部サービス | Slack Incoming Webhook | 環境変数 `SLACK_WEBHOOK_URL`（未設定なら通知スキップ） | 書 | `highlight_raw.mjs --slack`（`postSlack`） |
| npm | playwright（Chromium headless） | `package.json` `dependencies` | 実行 | ルート直下 `scrape_ebay*.mjs` のみ。`scripts/` 配下は未使用 |
| 外部サイト | eBay | `https://www.ebay.com/sch/i.html` | 読 | `scrape_ebay*.mjs` |
| ローカルディレクトリ | `raw/` | `raw/x_maypdgj_for_you_*.json` / `raw/x_maypdgj_search_*.json` | 書（codex）/ 読（highlight・audit） | キャプチャ結果 |
| ローカルディレクトリ | `highlights/` | `highlights/<timestamp>.md`, `highlights/latest.md` | 書（highlight）/ 読（serve） | ハイライト出力と LAN 配信 |
| ローカルディレクトリ | `.cache/` | `.cache/x-capture.lock`, `.cache/x-capture-prompt-*.md`, `.cache/raw-highlights-state.json` | 読/書 | 多重起動防止、一時プロンプト、ハイライト処理済み状態 |
| ローカルディレクトリ | `logs/` | `x_capture_once.log`, `x_capture_launchd.{out,err}.log`, `x_capture_search_batch.log`, `x_capture_watch.log` | 書 | 各スクリプトのログ |
| 環境変数 | キャプチャ設定 | `X_CAPTURE_INTERVAL_SECONDS`(300), `X_CAPTURE_MAX_RUN_SECONDS`(240), `X_CAPTURE_MAX_LOCK_AGE_SECONDS`(70), `X_CAPTURE_MODE`, `X_SEARCH_QUERY`, `X_SEARCH_LIMIT`(10) | 読 | `x_capture_*.sh` |
| 環境変数 | ハイライト設定 | `HIGHLIGHTS_INTERVAL_MINUTES`(60), `HOST`, `PORT` | 読 | `highlight_hourly.mjs`, `serve_highlights.mjs` |

再開（登録）・確認・停止:

```bash
cp launchd/com.grrb.rereresearch.x-capture.plist ~/Library/LaunchAgents/
launchctl bootstrap "gui/$(id -u)" ~/Library/LaunchAgents/com.grrb.rereresearch.x-capture.plist
launchctl list | grep rereresearch
launchctl bootout "gui/$(id -u)/com.grrb.rereresearch.x-capture"   # 停止
```

## 手動実行

```bash
npm install
npm run x:capture                         # For You を1回取得
npm run x:capture:search -- 'query' 10    # 検索結果を取得
npm run highlights                        # raw/ からハイライト生成
```
