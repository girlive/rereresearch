# AGENTS.md

rereresearch のエージェント構成。リサーチワークフローに特化したエージェント群を定義する。

## エージェント一覧

| エージェント | 役割 | モデル | 起動条件 |
|------------|------|--------|---------|
| research-planner | リサーチ計画の策定 | sonnet | テーマ受領時 |
| web-researcher | Web 検索・情報収集 | sonnet | 計画に基づく情報収集時 |
| source-analyst | ソース分析・信頼性評価 | sonnet | ソース収集後 |
| report-writer | レポート構成・執筆 | sonnet | 分析完了後 |
| fact-checker | 事実確認・矛盾検出 | sonnet | レポートドラフト完成後 |

## ワークフロー

```
テーマ入力
  → research-planner (計画策定)
  → web-researcher x N (並列で情報収集)
  → source-analyst (ソース評価・整理)
  → report-writer (レポート執筆)
  → fact-checker (事実確認)
  → レポート出力
```

### 並列実行

web-researcher は計画内のサブトピックごとに並列起動する。
独立した情報収集タスクを同時実行し、収集速度を最大化する。

## エージェント詳細

### research-planner

リサーチテーマを受け取り、以下を策定:
- リサーチクエスチョンの分解
- 情報収集の優先順位
- 検索戦略（キーワード、ソース種別）
- サブトピックの並列分割

### web-researcher

割り当てられたサブトピックについて情報収集:
- WebSearch で関連情報を検索
- WebFetch でページ内容を取得
- ソース URL・取得日・要約を構造化して記録
- `sources/` に収集結果を保存

### source-analyst

収集されたソースを評価:
- 信頼性の判定（一次/二次/三次ソース）
- 情報の鮮度チェック
- 矛盾する情報の検出
- ファクトとオピニオンの分離

### report-writer

分析結果からレポートを構成:
- エグゼクティブサマリー
- 本文（セクション構成）
- ソース一覧（全引用にリンク付与）
- 確信度の明記

### fact-checker

レポートドラフトを検証:
- 主張とソースの整合性確認
- 数値・日付の正確性チェック
- 未検証の主張にフラグ付与
- 改善提案の提示

## 共通ルール

- VCS は `jj` を優先、git も可
- `.env` や認証情報はコミットしない
- 全エージェントの出力は Markdown 形式
- ソース URL は必ず記録する

## X 取得ルール

Firefox で `@maypdgj` の X タイムラインまたは検索結果を取得するときは、以下を必ず守る。

### モード

- `for_you`: `https://x.com/home` の For You / おすすめタイムラインを取得する既定モード。
- `search`: 検索ワードで X 検索の Top / 話題 / 上位結果から上位 N 件を取得するモード。
- `for_you` raw は `raw/x_maypdgj_for_you_*.json` に保存する。
- `search` raw は `raw/x_maypdgj_search_<query_slug>_*.json` に保存する。
- `search` は `scripts/x_capture_once.sh search "検索ワード" 20` または `X_CAPTURE_MODE=search X_SEARCH_QUERY="検索ワード" X_SEARCH_LIMIT=20 scripts/x_capture_once.sh` で起動する。
- `search` の既定 N は 10 件。

### 定期実行

- X 取得の定期実行はハイライト生成とは別プロセスとして扱う。
- 定期取得する場合の既定間隔は 5 分とする。
- 同時に複数の Codex / Computer Use セッションで X 取得を走らせない。
- 実行前に古い Codex.app / 古い CLI Codex / 古い `SkyComputerUseClient mcp` が残っていないか確認する。
- トップへ戻す操作は取得サイクル開始時だけ行い、スクロール取得中に別セッションがトップへ戻す状態を許容しない。

### Search モード

- 検索ワードは Firefox の URL バーではなく、X 画面内の検索欄に入力する。
- `https://x.com/search?q=...` のような検索 URL を URL バーへ直接入力しない。
- Latest / 最新ではなく Top / 話題 / 上位の結果を対象にする。
- 検索結果の status URL を正規化して重複排除する。
- 各投稿について、見える範囲で `status_url`, `author`, `handle`, `timestamp`, `text`, `metrics`, `promoted` を raw JSON に記録する。
- 上位 N 件に達するまで PageDown で下へ進む。上限は 8 PageDown、または 2 回連続で新規 status URL が増えない場合。
- N 件以上取得できた場合は `status: "ok"`, `complete: true` とする。
- 1 件以上 N 件未満なら `status: "partial_capture"`, `complete: false` とする。
- 0 件または検索遷移失敗なら `status: "error"`, `complete: false` とする。

### 取得対象フィルタ

- raw JSON の `posts` に保存するのは、IT / 投資 / AI / ビジネスに関係する投稿だけにする。
- 関連対象の例: software engineering、developer tools、infra、security、AI、machine learning、LLM、local AI hardware、research workflow、startup、business、product strategy、creator/business revenue、markets、finance、investing。
- 非関連の政治、芸能、恋愛、雑談、スポーツ、事故、炎上、一般ニュース、広告は、人気が高くても `posts` に入れない。
- 広告/promoted は、IT、AI、developer tools、business、finance、investing に直接関係する場合だけ保存してよい。
- 除外した投稿は本文を保存せず、必要なら `filtered_out_count` と `filtered_out_examples` に短い理由だけ残す。
- raw JSON には `relevance_filter: "it_investing_ai_business"` と `relevant_posts_after_filter` を記録する。

### クリック前

- Computer Use のスクリーンショットとアクセシビリティツリーを両方確認する。
- クリック前の先頭ポスト URL を `top_post_before_click_url` として記録する。
- `35 件のポストを表示` などの新ポストボタンがある場合は、ボタン文言を `button_before_click` に記録する。
- `新しいポストがあります。新しいポストに移動するには、ピリオドキーを押してください。` は数値ボタンとは別扱いにし、`k: null` にする。

### クリック方法

- 新ポストボタンは `^[0-9,]+ 件のポストを表示$` に一致する Computer Use の `button` 要素が見えている場合、Computer Use の `click(element_index=...)` でその親 `button` 要素をクリックする。
- 新ポストボタンには `perform_secondary_action` を使わない。X ではクリックとして動かず失敗することがある。
- 該当 `button` にテキスト子要素がある場合は、子の text ではなく親の `button` 要素 index をクリックする。
- 座標クリックは、該当する `button` 要素がアクセシビリティツリーに出ていない場合だけ使う。
- 座標クリックを使う場合は、直前スクリーンショットで見えている数値ボタン中央だけを押す。最初の投稿本文や投稿カード上部を押してはいけない。
- Computer Use のクリックは並列実行しない。1 回クリックするたびに 1 秒以上待ち、スクリーンショットとアクセシビリティツリーを再確認してから次のクリックへ進む。
- クリック後は最低 5 秒待ってから再取得する。
- クリック後に URL が `x.com/home` から status URL に変わった場合は投稿詳細を開いた誤クリックとして扱い、ただちに `https://x.com/home` に戻す。そのサイクルで座標クリックを再試行しない。

### 成功判定

以下をすべて満たす場合だけ `click_effective: true` にする。

- `top_post_after_click_url` が `top_post_before_click_url` と異なる。
- 新ポストボタンが 2 回連続の Computer Use 再取得で消えている。
- 画面スクリーンショット上でもタイムライン本文が変化している。
- 成功時は `button_after_click_absent_rechecks: 2` 以上を raw JSON に記録する。

以下のどれかに該当する場合はクリック失敗として扱う。

- ボタンが一瞬消えて 5 秒後に再表示される。
- 先頭ポスト URL が変わらない。
- URL は変わったが、広告や既存の下方投稿にスクロールしただけに見える。

### リトライ

- 失敗時は 1 回だけ座標クリックでリトライする。
- リトライ後も成功判定を満たさない場合は、`status: "click_failed"` または `status: "partial_capture"` とし、`click_effective: false` を記録する。
- 失敗した場合でも、観測できた投稿は保存してよい。ただし `incomplete_reason` にクリック失敗理由を書く。

### スクロール取得

- クリック成功後、または新ポストボタンがない場合でも、可視範囲だけで終了しない。
- 既定の下移動は Computer Use の `scroll` API ではなく、Firefox へ `PageDown` キーを送る。
- `scroll` API はアクセシビリティツリー上の古い要素を拾ってトップ側へ戻ることがあるため、`PageDown` が効かない場合だけフォールバックとして使う。
- タイムライン本文を 1 ページずつ下へ進め、各 `PageDown` 後に 1 秒待って Computer Use の状態を再取得する。
- スクリーンショットで見えている投稿が前画面より下へ進んだことを確認する。アクセシビリティツリーだけに出る `xx 件のポストを表示` は、スクリーンショット上に見えなければスクロール失敗扱いにしない。
- 各画面で投稿 URL を抽出し、URL で重複排除する。
- 既定では最低 5 回スクロールする。数値ボタンで `k` が取れた場合は、ユニーク投稿数が `min(k, 25)` に達するか、5 回スクロールするまで続ける。
- 2 回連続で新しい投稿 URL が増えなければ停止してよい。
- raw JSON には `scroll_passes`, `unique_posts_after_scroll`, `stopped_reason` を記録する。
- `actual_count` が可視範囲相当の 10 件未満なら、`complete: false` とし、`status` は `partial_capture` にする。

### 本文展開

- 投稿本文に青文字の `さらに表示` がある場合、本文は未取得の可能性が高い。
- `さらに表示` は読み取り専用の展開操作として扱い、該当投稿の `さらに表示` だけをクリックする。
- 返信、リポスト、いいね、ブックマーク、共有、フォロー、動画読み込み、広告、外部リンク、status link はクリックしない。
- 複数の `さらに表示` クリックを並列実行しない。
- 複数見えている場合は、1 viewport あたり最大 3 件まで展開する。IT / 投資 / AI / ビジネスに関係する投稿だけを対象にし、AI、coding tool、model、developer tooling、research、infra、finance、investing、startup、business、product strategy 系の投稿を優先する。
- 展開後は約 1 秒待って Computer Use で同じ viewport を再取得し、展開後の本文を保存する。
- raw JSON には `expanded_more_count` を記録する。展開後も欠けている可能性がある投稿には `text_truncated: true` を付ける。

### スクリーンショット

- 取得中は Computer Use のスクリーンショットを確認しながら進める。
- ローカル `screencapture` は macOS 権限で失敗することがあるため、失敗しても Computer Use のスクリーンショットを優先する。
