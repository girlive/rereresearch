# Raw 技術ハイライト

`raw/` に保存されたタイムライン JSON から、新しい技術・実装知見として拾う価値が高い投稿を Markdown にまとめる。

## 使い方

```sh
npm run highlights
```

- 未処理の `raw/*.json` だけを対象に `highlights/latest.md` と時刻付き Markdown を生成する。
- 初回は直近 1 時間相当を対象にする。
- `npm run highlights:all` で全 raw ファイルを再集計する。

## Slack 通知

```sh
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..." npm run highlights:slack
```

## LAN 公開

```sh
npm run highlights:serve
```

同一 LAN の端末から `http://<このMacのIP>:8787/` にアクセスする。

## 1時間ごとの実行例

開きっぱなしのターミナルで動かす場合:

```sh
npm run highlights:hourly
```

macOS の `launchd` または cron で `npm run highlights` を 1 時間ごとに実行する。

cron 例:

```cron
0 * * * * cd /Users/grrb/ai-sandbox/rereresearch && /usr/bin/env npm run highlights
```
