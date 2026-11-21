# cmux vs Ghostty — AIエージェント時代のターミナル選定

> リサーチ日: 2026-04-14
> ステータス: **完成**
> 対象: macOS 開発環境、Claude Code / AIエージェント活用

---

## Executive Summary

| 項目 | cmux | Ghostty |
|------|------|---------|
| **カテゴリ** | AIエージェント専用ターミナル | 汎用高性能ターミナルエミュレータ |
| **実装言語** | Swift + AppKit | Zig |
| **レンダリング** | libghostty（Ghosttyエンジン）経由 | ネイティブ（libghostty本体） |
| **最新バージョン** | — | **1.3.0**（2026-03-09） |
| **GitHub Stars** | 数千（急成長中） | **45,000+** |
| **ライセンス** | **GPL-3.0**（2026-03-30変更） | **MIT** |
| **macOS専用** | ✅ Yes | ❌ macOS + Linux |
| **AIエージェント管理** | ✅ 専用設計 | ❌ 汎用（v1.3.0で通知追加） |
| **Claude Code評価** | 専用設計 | **"The team loves Ghostty"**（公式） |

### 最重要の知見（Ghostty作者の公式見解）

> **Mitchell Hashimoto（Ghostty作者）**:
> "cmux uses libghostty and is a perfect example of what Ghostty is trying to achieve. Everyone going to cmux or another libghostty terminal instead of Ghostty would be great." [^3]

**cmuxとGhosttyは競合ではない。** cmuxは「Ghosttyのターミナルコアを使い、AIエージェント管理UIを上乗せしたアプリ」。移行コストはほぼゼロ（設定ファイルを共有）。

---

## 目次

1. [なぜcmuxが作られたか（Ghosttyの限界）](#1-なぜcmuxが作られたか)
2. [技術的関係：libghosttyエコシステム](#2-技術的関係)
3. [機能比較マトリクス](#3-機能比較マトリクス)
4. [Ghosttyの実力（2026年現在）](#4-ghosttyの実力)
5. [cmuxの付加価値](#5-cmuxの付加価値)
6. [Claude Codeとの動作比較](#6-claude-codeとの動作比較)
7. [インストール・セットアップ](#7-インストールセットアップ)
8. [cmuxの既知の問題・バグ](#8-cmuxの既知の問題)
9. [ライセンスと実用上の注意](#9-ライセンスと実用上の注意)
10. [libghosttyエコシステム（Calyx等）](#10-libghosttyエコシステム)
11. [推奨と結論](#11-推奨と結論)

---

## 1. なぜcmuxが作られたか

cmux開発者はClaude CodeとCodexを大量に並列実行していた。**Ghosttyのスプリットペインで運用していたが、2つの問題に直面した。** [^1]

### 問題1：通知が全部同じ文字列

```
🔔 Claude is waiting for your input   ← タブA
🔔 Claude is waiting for your input   ← タブB  ← どれ？？
🔔 Claude is waiting for your input   ← タブC
```

Claude Codeの通知本文は常に固定文字列で、**どのセッションが何をしているか判別不能**。

### 問題2：タブが増えるとタイトルすら読めない

既存のGUIオーケストレーターも試したが、Electron/Tauriベースでパフォーマンスに問題があり、ワークフローを固定してしまう点も問題だった。

→ **Swift/AppKitでネイティブmacOSアプリとしてcmuxを構築**

---

## 2. 技術的関係

cmuxはGhosttyのフォークではなく、**libghosttyをレンダリングライブラリとして使用するアプリケーション**。[^2]

```
libghostty（Ghosttyのターミナルコア）
    ├── Ghostty GUI（汎用ターミナル本体）  ← MIT
    ├── cmux（AIエージェント管理ターミナル） ← GPL-3.0
    ├── Calyx（macOS 26 Liquid Glass対応） ← 新興
    ├── vscode-bootty（VS Code拡張）
    ├── jupyterlab-ghostty-terminal
    └── 他10+プロジェクト
```

> "By the middle of 2027, the number of people using Ghostty via libghostty is expected to dwarf the number of users that actually use the Ghostty GUI." [^14]

**Ghosttyの設定ファイルをそのまま読み込む**: フォント・カラースキーム・キーバインドはGhosttyと共有。移行コスト≒ゼロ。

---

## 3. 機能比較マトリクス

| 機能 | cmux | Ghostty |
|------|------|---------|
| **ターミナルレンダリング（GPU）** | ✅ libghostty経由 | ✅ ネイティブ |
| **縦型タブ（サイドバー）** | ✅ あり | ❌ 未実装（Discussion #2549で長期議論中） |
| **エージェント状態通知（色分け）** | ✅ 緑/黄/赤リング | ❌ なし |
| **タブごとのgitブランチ表示** | ✅ あり | ❌ なし |
| **PRステータス・ポート表示** | ✅ あり | ❌ なし |
| **組み込みブラウザペイン** | ✅ localhost対応 | ❌ なし |
| **Unix socket API（外部制御）** | ✅ JSON-RPC | ❌ なし（AppleScriptのみ） |
| **cmux notify CLI** | ✅ あり | ❌ なし |
| **コマンド完了通知** | ✅ あり | ✅ v1.3.0で追加 |
| **スクロールバック検索** | △（Ghostty依存） | ✅ v1.3.0で追加（Cmd+F） |
| **ネイティブスクロールバー** | △（Ghostty依存） | ✅ v1.3.0で追加 |
| **Kitty Keyboard Protocol** | ✅ 継承 | ✅ ネイティブ |
| **Kitty Graphics Protocol（画像）** | ✅ 継承 | ✅ ネイティブ |
| **Synchronized Output（DEC 2026）** | ✅ 継承 | ✅ ネイティブ |
| **AppleScript対応** | ❌ なし | ✅ v1.3.0で強化 |
| **Quick Terminal** | ❌ なし | ✅ メニューバー下スライド |
| **SSH統合（terminfo自動コピー）** | △ | ✅ v1.2.0で追加 |
| **Linux対応** | ❌ macOS専用 | ✅ |
| **安定性** | △ バグ報告あり | ✅ 高い |
| **ライセンス** | GPL-3.0 | **MIT** |

---

## 4. Ghosttyの実力

### パフォーマンス [^4]

| 指標 | 値 | 比較 |
|------|-----|------|
| レンダリング | ~407 FPS | — |
| キー入力レイテンシ | ~2ms | — |
| テキスト描画速度 | iTerm2比 **4倍速** | confirmed |
| v1.3.0の改善 | ターミナルロック時間 **2〜5倍削減** | confirmed |

### Claude Codeとの相性 [^5]

> "The Claude Code team loves Ghostty, with multiple people appreciating its synchronized rendering, 24-bit color, and proper unicode support."

- **Synchronized Output（DEC 2026）**: Ghosttyはネイティブ対応。Claude Codeのフリッカー問題が完全解消
- `CLAUDE_CODE_NO_FLICKER` 環境変数: フルスクリーンレンダリングモードを有効化
- **差分レンダラー**: Claude Code側が展開済み。フリッカー発生セッションを約1/3に削減

### v1.3.0の主要追加機能（2026-03-09）[^6]

- スクロールバック検索（Cmd+F）
- ネイティブスクロールバー
- クリックでカーソル移動（zsh/fish/nushell対応）
- コマンド完了通知
- AppleScript対応強化・スプリットのドラッグ&ドロップ
- Unicode 17対応

### シェル統合 [^7]

bash / fish / zsh / nushell / elvish を自動検出・注入。

- OSC 133プロンプトマーキング（コマンド境界検出）
- ディレクトリトラッキング（新タブが現在ディレクトリを継承）
- カーソル形状制御（挿入/ノーマルモード）
- SSHへのterminfo自動コピー（v1.2.0）
- コマンド完了通知（v1.3.0）

---

## 5. cmuxの付加価値

### エージェントUIの具体例 [^8]

```
┌─ cmux サイドバー ─────────────────────────┐
│  🟢 feat/auth    PR#42  :3000   完了       │
│  🟡 fix/api      main   :4000   入力待ち  │
│  🔴 refactor     main           エラー ⚠️ │
└──────────────────────────────────────────┘
```

各タブに表示：gitブランチ / PRステータス / リスニングポート / 通知テキスト（コンテキスト付き）

### Claude Code自動フック注入 [^9]

cmux内で `claude` を実行すると、以下の6フックが自動注入される:

```
SessionStart / Stop / SessionEnd / Notification / UserPromptSubmit / PreToolUse
```

環境変数も自動セット:
```
CMUX_WORKSPACE_ID  ← ワークスペースID
CMUX_SURFACE_ID    ← タブID
CMUX_SOCKET_PATH   ← Unix socketパス
```

### Unix Socket API [^9]

```python
import socket, json

client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
client.connect("/tmp/cmux.sock")

req = json.dumps({"id": "1", "method": "workspace.list", "params": {}}) + "\n"
client.sendall(req.encode())
result = json.loads(client.recv(65536))
```

スクリプトから全ワークスペースを制御可能。

---

## 6. Claude Codeとの動作比較

### フリッカー問題

| 環境 | 状況 |
|------|------|
| **Ghostty単体** | ✅ DEC 2026でフリッカーゼロ |
| **Ghostty + tmux（v3.6a）** | ❌ 毎秒4,000〜6,700スクロールイベントでチラつき |
| **Ghostty + tmux HEAD** | ✅ DECSET 2026パッチ適用後解消 |
| **cmux** | ✅ libghostty継承でGhostty同等（確認中） |

### マルチエージェント管理

| 観点 | Ghostty | cmux |
|------|---------|------|
| 複数エージェントの状態一覧 | ❌ 不可 | ✅ サイドバーで一覧 |
| 通知の文脈（どのエージェントか） | ❌ 全部同じ文字列 | ✅ コンテキスト付き |
| ブラウザでプレビュー確認 | ❌ 外部ブラウザが必要 | ✅ ペイン内蔵ブラウザ |
| スクリプト制御 | △ AppleScriptのみ（v1.3プレビュー） | ✅ Unix socket API |

### ⚠️ 重要：Claude Code `teammateMode`（Agent Teams）の対応状況

Claude Codeのオーケストレーター→サブエージェント自動分割（`--agent-teams` / split-pane mode）は、**現時点でtmuxとiTerm2のみをバックエンドとしてサポート**。[^15]

| バックエンド | teammateMode対応 |
|------------|----------------|
| tmux | ✅ 対応 |
| iTerm2 | ✅ 対応 |
| **Ghostty** | ❌ **未対応**（Issue #24189 で要望中） |
| **cmux** | ❌ **未対応**（独自通知UIは持つ） |
| Zellij | ❌ 未対応（Issue #31901 で要望中） |

ただし、Ghostty v1.3.0でAppleScriptサポートが追加されたことで、Claude Code側がGhosttyバックエンドを追加できる技術的条件は整った。Claude Codeのissue #24189で実装が議論されている。

---

## 7. インストール・セットアップ

### cmuxのインストール [^10]

```bash
brew tap manaflow-ai/cmux
brew install --cask cmux
```

動作要件: **macOS 13（Ventura）以降**

### 設定ファイル

| ファイル | 用途 |
|---------|------|
| `~/.config/ghostty/config` | ターミナル設定（フォント・カラー・キーバインド） |
| `~/.config/cmux/settings.json` | cmux固有設定（通知・ブラウザ・自動化） |

**Ghosttyからの移行**: Ghosttyの設定ファイルはそのまま流用される。追加設定不要。

### Claude Code連携設定

```json
// ~/.config/cmux/settings.json
{
  "automation": {
    "claudeCodeIntegration": true,
    "claudeBinaryPath": "/path/to/claude"  // 省略可
  }
}
```

### CLIシムのパス設定（オプション）

```bash
sudo ln -sf "/Applications/cmux.app/Contents/Resources/bin/cmux" /usr/local/bin/cmux
```

---

## 8. cmuxの既知の問題

2026年2月リリースの新しさゆえ、いくつかのバグが報告されている。[^11]

| 問題 | 深刻度 | 詳細 |
|------|--------|------|
| **fish shellのPATHバグ** | 中 | システムディレクトリがasdf/rbenvより前に挿入。`bundle exec`等が失敗する可能性 |
| **Altキー（ISOキーボード）** | 中 | `macos-option-as-alt = right` が無視される。Helix等でのAltバインディングが使えない |
| **非ASCII文字ペースト** | 中 | キリル文字等のCmd+Vが`?`に化ける（Ghosttyでは発生しない） |
| **ショートカットカスタマイズ不可** | 低 | cmux固有のショートカット（`Ctrl+Cmd+]`等）はリマップ不可 |
| **セッション非復元** | 低 | 再起動後にClaudeセッション等が復元されない |
| **通知の遅延・不安定** | 低〜中 | タスク完了から通知到達まで一貫性がない場合あり |
| **フック挙動未ドキュメント** | 低 | claude CLIラッパーの動作が一部不明確 |

> **fish shellユーザーは特に注意**: asdf/rbenv/mise等を使っている場合、PATHの優先順位バグが影響する可能性がある。

---

## 9. ライセンスと実用上の注意

**ライセンス変遷** [^12]:
- 2026-02-14リリース: **AGPL-3.0**
- 2026-03-30変更: **GPL-3.0**（デスクトップアプリにAGPLのネットワーク条項は不要、企業のAGPL禁止ポリシー対応）

| 利用形態 | ライセンス問題 |
|---------|-------------|
| 個人利用 | ✅ 問題なし |
| 社内ツールとして使う | ✅ 問題なし |
| cmux組み込み製品を**配布する** | ⚠️ GPLコピーレフト義務 |
| 商用製品への組み込み・配布 | → founders@manaflow.com |

Ghosttyは**MIT**ライセンスで制限なし。

---

## 10. libghosttyエコシステム

libghosttyを採用した主要プロジェクト [^13]:

| プロジェクト | 特徴 |
|------------|------|
| **cmux** | AIエージェント管理、通知リング、API |
| **Calyx** | macOS 26 Liquid Glass対応、MCP IPC、polish重視 |
| **vscode-bootty** | VS Codeのターミナルをlibghosttyで置き換えるWASM拡張 |
| **jupyterlab-ghostty-terminal** | JupyterLab向けターミナル拡張 |
| **libghostty-dart** | Flutter向けDart FFIバインディング |
| **Restty** | WebGPU + libghostty-vtのWebターミナル（xterm.js互換） |

---

## 11. 推奨と結論

### ユースケース別推奨

| 状況 | 推奨 | 理由 |
|-----|------|------|
| **Claude Codeを複数並列で回したい** | **cmux** | 通知リング・状態サイドバーが専用設計 |
| **単一Claude Code・安定性重視** | **Ghostty** | 成熟・MIT・Claude Code公式推薦 |
| **fish shellを使っている** | Ghosttyを先に試す | cmuxのPATHバグリスクあり |
| **Altキーをよく使う（Helix等）** | **Ghostty** | cmuxのAltキー問題を回避 |
| **Linux環境も使う** | **Ghostty** | cmuxはmacOS専用 |
| **tmux + セッション永続化が必要** | **Ghostty + tmux** | どちらもセッション永続化なし |
| **MCP Gateway連携** | **Ghostty** または cmux（未確認） | ZedのMCP統合と組み合わせる場合はZed側で対応 |

### 結論

```
複数AIエージェント並列管理  →  cmux が明確に優れる
単一エージェント・汎用用途  →  Ghostty で十分（かつ安定）
```

**移行コストはゼロ**:
- `~/.config/ghostty/config` はそのまま共有される
- 気に入らなければGhosttyに即戻れる
- 両者を同時インストールして使い分けも可能

**Ghosttyロードマップ（v1.4, 2026年9月予定）**: スクリプタビリティ強化（true Tmux control mode）・グラフィカル設定UIが計画されており、将来的にcmuxとの差が縮まる可能性がある。[^14]

---

## ソース

[^1]: [Introducing cmux — cmux blog](https://cmux.com/blog/introducing-cmux)
[^2]: [Libghostty Is Coming — Mitchell Hashimoto](https://mitchellh.com/writing/libghostty-is-coming)
[^3]: [Mitchell Hashimoto on X (cmux success story)](https://x.com/mitchellh/status/2034308902620430814)
[^4]: [Ghostty vs Warp 2.0 vs WezTerm: Best Terminal for AI CLI 2026 — Termdock](https://www.termdock.com/en/blog/best-terminal-emulator-ai-cli-2026)
[^5]: [Claude Code TUI rendering — Hacker News](https://news.ycombinator.com/item?id=46701013)
[^6]: [Ghostty 1.3.0 Release Notes — ghostty.org](https://ghostty.org/docs/install/release-notes/1-3-0)
[^7]: [Shell Integration — ghostty.org](https://ghostty.org/docs/features/shell-integration)
[^8]: [cmux: Native macOS Terminal for AI Coding Agents — Better Stack](https://betterstack.com/community/guides/ai/cmux-terminal/)
[^9]: [Notifications / API Reference — cmux docs](https://cmux.com/docs/notifications)
[^10]: [GitHub - manaflow-ai/homebrew-cmux](https://github.com/manaflow-ai/homebrew-cmux)
[^11]: [GitHub Issues — manaflow-ai/cmux](https://github.com/manaflow-ai/cmux/issues)
[^12]: [cmux is now GPL — cmux blog](https://cmux.com/blog/gpl)
[^13]: [awesome-libghostty — GitHub](https://github.com/Uzaaft/awesome-libghostty)
[^14]: [Ghostty Roadmap — Releasebot](https://releasebot.io/updates/ghostty)
[^15]: [Feature Request: Add Ghostty as split-pane backend — Claude Code Issue #24189](https://github.com/anthropics/claude-code/issues/24189)

---

> リサーチ日: 2026-04-14
> 情報収集: 5エージェント並列Webリサーチ（4/5完了）
> カバー範囲: cmux機能詳細 / Ghostty 1.3.0 / libghosttyエコシステム / Claude Code連携 / セットアップ手順 / 既知バグ

## Confidence Assessment

- cmuxの開発動機（Ghosttyの通知問題）: **confirmed** — cmux公式ブログ
- Ghostty作者のcmux肯定見解: **confirmed** — X（Twitter）投稿確認
- cmux GPL-3.0変更（2026-03-30）: **confirmed** — cmux公式ブログ
- Ghostty v1.3.0のClaude Code synchronized rendering: **confirmed** — HN議論・公式ドキュメント
- cmux fishシェルPATHバグ: **confirmed** — GitHub Issue #2719
- cmux Altキーバグ: **confirmed** — GitHub Issue #2369
- Ghostty v1.4ロードマップ（2026年9月）: **likely** — 公開ロードマップではなく発言から推測
