# rereresearch

リサーチテーマ（`themes/`）とレポート（`reports/`）、および X タイムラインの定期キャプチャを置くリポジトリ。
作業ルールは `AGENTS.md` / `CLAUDE.md` を参照。

## このマシンで稼働中の処理

以下は grrb の Mac（`~/ai-sandbox/rereresearch`）の launchd で動いている。

| launchd label | 実行内容 | タイミング | ログ |
|---|---|---|---|
| `com.grrb.rereresearch.x-capture` | `scripts/x_capture_daemon.sh` → `scripts/x_capture_once.sh`（`codex exec` + Computer Use で Firefox の X「おすすめ」を取得し `raw/` に JSON 保存） | 常駐（1周ごとに 300 秒 sleep、1回あたり最大 240 秒） | `logs/x_capture_launchd.*.log` / `logs/x_capture_once.log` |

- 前提: `/opt/homebrew/bin/codex`、Firefox で X にログイン済み、Computer Use が利用可能なこと
- 間隔・タイムアウトは環境変数 `X_CAPTURE_INTERVAL_SECONDS` / `X_CAPTURE_MAX_RUN_SECONDS` で変更可
- 多重起動は `.cache/x-capture.lock` で防止

登録・確認・停止:

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
