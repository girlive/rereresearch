# Zed vs cmux — AIエージェント時代の開発ターミナル徹底比較

> リサーチ日: 2026-04-14
> ステータス: **完成**
> 対象: macOS 開発環境、AIコーディングエージェント活用

---

## Executive Summary

| 項目 | cmux | Zed |
|------|------|-----|
| **カテゴリ** | AIエージェント専用ターミナル（macOS） | コードエディタ + ターミナル統合 |
| **言語** | Swift + AppKit | Rust + GPUI |
| **リリース** | 2026年2月 | 2021年〜（継続開発） |
| **主目的** | 複数AIエージェントの並列管理 | コード編集とAI統合の一元化 |
| **GPU描画** | libghostty（Ghosttyエンジン）経由 | GPUI（独自フレームワーク）120fps |
| **macOS専用** | ✅ Yes | ❌ クロスプラットフォーム |
| **MCP対応** | ❌ 未確認 | ✅ Tools + Prompts対応済み |
| **ライセンス** | AGPL-3.0、無料 | 無料 |
| **DAU** | — | **170,000**（2025年末） |

### 最重要の前提認識

> **cmux ≠ tmux**。cmuxはターミナルマルチプレクサではなく、Claude Code / Codex / Gemini CLI などの **AIエージェントを並列管理するmacOSネイティブターミナル**（2026年2月リリース）。(confirmed — [^1])

> **Zed と cmux は競合ではなく補完**。「AIエージェント管理の中心をどこに置くか」という設計思想の違いが比較の本質。現実には両方を組み合わせて使う開発者が多い。

---

## 目次

1. [cmux とは何か](#1-cmuxとは何か)
2. [Zed とは何か（2026年現在）](#2-zedとは何か)
3. [機能比較マトリクス](#3-機能比較マトリクス)
4. [AIエージェント管理の比較](#4-aiエージェント管理の比較)
5. [Claude Code との連携比較](#5-claude-codeとの連携比較)
6. [パフォーマンス比較](#6-パフォーマンス比較)
7. [tmux / Zellij との関係](#7-tmux--zellijとの関係)
8. [コミュニティ・採用状況](#8-コミュニティ採用状況)
9. [ターミナルエコシステム全体像（2026年）](#9-ターミナルエコシステム全体像)
10. [ワークフロー別推奨](#10-ワークフロー別推奨)
11. [組み合わせ構成パターン](#11-組み合わせ構成パターン)

---

## 1. cmuxとは何か

**manaflow-ai/cmux** — 2026年2月リリースの macOS ネイティブターミナルアプリ。[^1]

> "Ghostty-based macOS terminal with vertical tabs and notifications for AI coding agents" [^1]

Swift + AppKit で実装。Ghosttyのレンダリングエンジン（libghostty）をライブラリとして利用しGPUアクセラレーション描画を実現。

### cmux の主要機能 [^2]

| 機能 | 詳細 |
|------|------|
| **垂直タブサイドバー** | gitブランチ名・PRステータス・リッスンポート・最新通知テキストをエージェントごとに表示 |
| **通知リング** | エージェントが注意を要する状態になるとペイン周囲にリング + macOS通知 |
| **組み込みブラウザペイン** | localhostにルーティングされるブラウザ内蔵 |
| **Unix ソケット API** | CLIから全操作をスクリプト制御可能 |
| **SSHワークスペース** | リモート環境への接続管理 |
| **ペイン分割・タブ** | 標準的なターミナル分割機能 |

> "cmux is a primitive, not a solution. It gives you a terminal, a browser, notifications, workspaces, splits, tabs, and a CLI to control all of it." [^2]

### リリース時の反響

- Hacker News で**#2**獲得
- 数千のGitHub スターを短期間で獲得 [^3]
- AGPL-3.0（商用利用時は注意）

### 名称の混同

| ツール | 正体 |
|--------|------|
| `manaflow-ai/cmux` | ← **今回の対象**（macOS AIターミナル） |
| `tmux` | POSIX セッション管理マルチプレクサ（無関係） |
| `github.com/soheilhy/cmux` | GoのTCP connection multiplexerライブラリ（無関係） |

---

## 2. Zedとは何か

Rust + 独自GPUフレームワーク GPUI で実装された高性能コードエディタ。[^4]

### ターミナル統合（2025-2026）[^5]

- 左・右・下の3ドックにターミナルパネルを配置可能
- `Ctrl+`` でターミナルパネルをトグル
- `workspace: new center terminal` でエディタ中央にターミナルタブとして展開
- `Cmd+D` でターミナルの水平分割
- v0.88.0以降: エージェントパネルのフレキシブル幅設定UI

### AI統合（2026年現在）[^6][^7]

**ACP（Agent Client Protocol）**経由で外部エージェントをネイティブサポート:

| エージェント | 対応状況 |
|------------|---------|
| Claude Code | ✅ ベータ統合済み（2025年9月） |
| Gemini CLI | ✅ ACP対応 |
| OpenAI Codex | ✅ ACP対応 |
| GitHub Copilot | ✅ ACP対応 |

ACPは**オープンスタンダード**。JetBrainsも2026年1月から採用開始。[^8]

### Edit Prediction（Zeta）

Zed独自のOSS補完モデル **Zeta**（Qwen2.5-Coder-7B ベースのfine-tune）。Zeta2が近日リリース予定（Zeta1比30%精度向上）。[^9]

---

## 3. 機能比較マトリクス

| 機能 | cmux | Zed |
|------|------|-----|
| **ターミナルエミュレータ** | ✅ コア機能 | ✅ 内蔵（補助的） |
| **コードエディタ** | ❌ なし | ✅ コア機能 |
| **AIエージェント並列管理** | ✅ 専用設計 | △ ACP経由で対応 |
| **エージェント状態通知** | ✅ 通知リング・macOS通知 | △ 限定的 |
| **ブラウザ内蔵** | ✅ localhost対応 | ❌ なし |
| **GitブランチUI** | ✅ タブに常時表示 | ✅ ステータスバー |
| **SSH接続** | ✅ ワークスペースとして管理 | ✅ Zed Remote（UIはローカル120fps） |
| **MCP対応** | ❌ 未確認 | ✅ Tools + Prompts対応 |
| **スクリプト外部制御** | ✅ Unix socket API | △ 限定的 |
| **インラインコード補完** | ❌ なし | ✅ Zeta（キーストロークごと） |
| **プラグイン/拡張** | △ 限定的 | ✅ 1,000+（WASM） |
| **Windows / Linux** | ❌ macOS専用 | ✅ クロスプラットフォーム |

---

## 4. AIエージェント管理の比較

### cmux のアプローチ：「ターミナルでエージェントを並列管理」

```
┌─ cmux ──────────────────────────────────────┐
│  [垂直タブサイドバー]                         │
│  🟢 feat/auth  (main)  ← Claude Code #1      │
│  🟡 fix/api    (PR#42) ← Codex (作業中)      │
│  🔴 refactor   ⚠️通知  ← Gemini CLI          │
│                                              │
│  [メインターミナルペイン]                     │
│  $ claude --dangerously-skip-permissions ... │
│                                              │
│  [ブラウザペイン]                             │
│  localhost:3000 → プレビュー表示             │
└──────────────────────────────────────────────┘
```

複数エージェントを**タブとして並列管理**し、状態を一覧で視認できる設計。通知リングがあるため、「どのエージェントが入力待ちか」を離れた場所からでも確認できる。

### Zed のアプローチ：「エディタ内にエージェントを統合」

```
┌─ Zed ───────────────────────────────────────┐
│  [エディタ]                 [エージェントパネル] │
│  src/auth.ts                Claude Agent:    │
│  ├ function login() {       「auth.tsの...   │
│  │   ← AIが編集中 →         を修正しました」 │
│  │                          [承認] [却下]    │
│  [ターミナルパネル]                           │
│  $ npm run dev                               │
└──────────────────────────────────────────────┘
```

コードとエージェントを**1画面で統合**。差分をhunk単位で承認/却下できる。複数エージェントの並列管理はcmuxより手動。

---

## 5. Claude Codeとの連携比較

### cmux + Claude Code

```bash
# 新しいエージェントセッションを開始
cmux new-workspace --name "feat/auth"
claude --dangerously-skip-permissions
```

- 各ワークスペース（タブ）でClaude Codeを独立して実行
- エージェントが注意を要する状態（エラー、入力待ち）で**通知リング**が点灯
- **Unix socket API** でスクリプトからワークスペース操作が可能

### Zed + Claude Code（ACP統合）[^10]

2025年9月にパブリックベータ開始。

- マルチファイルのリアルタイム編集
- LSP統合：変更後の診断（エラー・警告）をエージェントがリアルタイム参照
- 差分をhunk単位で承認/却下
- エージェントのタスクリストをサイドバーに固定表示

**SDK制限（ベータの弱点）** [^11]:
- `/compact` 等の多くのスラッシュコマンドが未対応
- Planモードは未実装（後続アップデートで追加予定）
- Claude Code SDKがインタラクティブなエディタセッション向けに設計されていないことに起因

---

## 6. パフォーマンス比較

### Zed のパフォーマンス [^12]

| 指標 | Zed | VS Code | 確信度 |
|------|-----|---------|-------|
| 起動時間 | **0.4秒** | 1.2秒 | likely |
| メモリ使用量 | VS Code比 ~1/16 | 基準 | likely |
| フレームレート | **120fps**（GPUI） | — | confirmed |
| 入力レイテンシ | **約2ms** | — | confirmed |

2026年3月: グラフィックスバックエンドを **Blade → wgpu** に切り替え。クロスプラットフォーム安定性が向上。[^13]

### cmux のパフォーマンス

- libghostty（Ghosttyエンジン）によるGPUアクセラレーション
- Ghosttyは45,247 GitHub Starsを獲得した高性能ターミナル [^14]
- cmux固有の実測ベンチマーク: **未公開**（自社計測値なし）

---

## 7. tmux / Zellijとの関係

### Zed と tmux の共存パターン（コミュニティの主流）[^15][^16]

**Zedのターミナルを閉じるとセッションが消える問題**があるため、公式エクステンションとして tmux連携が提供されている。

```json
// Zedターミナルのシェル設定
{
  "terminal": {
    "shell": {
      "program": "bash",
      "args": ["-c", "tmux new-session -A -s $(basename \"$PWD\")"]
    }
  }
}
```

これにより：
- Zedを閉じても tmux セッション（＝Claude Codeプロセス）が生存し続ける
- プロジェクト切り替え後も長時間タスクが継続

**RFC #50584**「Persistent terminal sessions across Zed restarts」がGitHubで議論中。2026年4月時点では未実装。[^17]

### Claude Code + tmux でのフリッカー問題 [^17]

Claude Codeが毎秒4,000〜6,700のスクロールイベントを発生させるが、tmux 3.6a はsynchronized outputプロトコルを無視するため部分再描画がチラつく。**tmux HEAD**（2025年12月17日のDECSET 2026パッチ適用後）でのみ解消。

### tmux vs Zellij（2026年現在）[^18]

| 指標 | tmux | Zellij |
|------|------|--------|
| アイドルメモリ | **12MB** | 22MB |
| アイドルCPU | **0.8%** | 1.5% |
| 100ペインCPU（アクティブ） | **12.3%** | 47.6%（約4倍） |
| プラグインシステム | スクリプト + TPM | **WebAssembly**（任意言語） |
| 実用限界ペイン数 | ~150ペイン | ~60ペイン（CPU 80%超） |
| SSH安定性 | ✅ 高い | △ 一部ツールで不安定報告あり |

確信度: likely（サードパーティベンチマーク）

---

## 8. コミュニティ採用状況

### Zed のユーザー数 [^19]

- **170,000 DAU**（2025年末、創業者Nathan Sobo発表）
- 2025年にWindowsサポートを追加
- Stack Overflow 2025 Developer Surveyには項目なし（別途把握）

### エディタ使用率（Stack Overflow 2025）[^20]

| エディタ | 使用率 |
|---------|-------|
| VS Code | 75.9%（圧倒的首位） |
| Cursor（AI IDE） | 18% |
| Claude Code | 10% |
| Neovim | 14% |
| Zed | 測定なし |

### コミュニティの声（HN・Reddit）[^21][^22]

- 「tmuxをZedのターミナル内で使う」統合アプローチが主流
- Neovim + tmuxヘビーユーザーのZed完全移行は少数派
- 「Zedで得ていたもので、Neovimに戻って失われたものは何もなかった」（Steve Simkins氏の往復体験）[^22]
- TerminalベースワークフローはZedでは再現困難という評価が多数

### 移行しやすいユーザー・困難なユーザー

| ユーザー属性 | Zedへの移行適性 |
|------------|--------------|
| VS Code / Sublime Text からの移行者 | 高い |
| Claude CodeメインのAIエージェント活用者 | 中〜高（tmux併用で補完可能） |
| Neovim + tmux ヘビーユーザー | 低い（エコシステム再現困難） |
| リモートSSH中心の開発者 | 中（セッション永続性問題が顕在化） |

---

## 9. ターミナルエコシステム全体像

### 2026年の主要ターミナルエミュレータ [^23]

| ターミナル | GitHub Stars | 特徴 | cmux/tmux との関係 |
|-----------|-------------|------|-----------------|
| **Ghostty** | **45,247** | Zig製、GPU描画、標準準拠、非営利化 | cmuxがlibghosttyを使用 |
| WezTerm | 22,900 | Lua設定、組み込みマルチプレクサ | tmux不要派に最適 |
| Alacritty | — | 極限の軽量、外部マルチプレクサ前提 | tmux前提 |
| iTerm2 | — | macOS専用成熟機能、tmux統合強い | tmux統合 |

**Ghostty**: 2026年4月にUbuntu公式リポジトリへ収録。「数百万ユーザー」と報告。cmuxがlibghosttyを採用していることでGhosttyとcmuxは密接な関係にある。[^23]

### Rust/Zig製ツールスタック（2026年主流パターン）[^24]

```
Pattern A（Full-Rust）: Alacritty + Zellij + Helix/Zed
Pattern B（Ghostty中心）: Ghostty + Zellij + Neovim/Zed + Fish
Pattern C（AI Agent特化）: Ghostty/cmux + tmux + Claude Code + Zed
```

---

## 10. ワークフロー別推奨

| ユースケース | 推奨 | 理由 |
|------------|------|------|
| **複数Claude Codeを並列で回したい** | **cmux** | 通知リング・タブ管理が専用設計 |
| **コード編集とAIを1画面で完結** | **Zed** | エディタとエージェントパネルが統合 |
| **SSH切断後もセッション維持** | **tmux** | セッション永続性は依然tmuxが最強 |
| **vs Codeからの移行** | **Zed** | エディタ体験が近い、AI機能充実 |
| **MCP Gateway連携** | **Zed** | MCP対応済み（cmuxは未確認） |
| **スクリプト・CI自動化** | **cmux / tmux** | Unix socket API / send-keys |
| **Windows/Linuxでも使う** | **Zed** | cmuxはmacOS専用 |
| **大量ペイン（60+）** | **tmux** | Zellijは60ペイン超でCPU限界 |
| **リモートSSH + リッチUI** | **Zed SSH Remote** | UIはローカル120fps、LSPはリモート |

---

## 11. 組み合わせ構成パターン

### パターン A：cmuxメイン（AIエージェント並列特化）

```
Ghostty / Terminal.app
    └─ cmux
        ├── workspace: feat/auth → Claude Code
        ├── workspace: fix/api  → Claude Code
        └── workspace: review   → Gemini CLI

+ Zed（コード編集・MCP連携）← 別ウィンドウ
```

**向いている人**: 複数エージェントを同時並列で走らせたい、エージェントの状態通知が重要

---

### パターン B：Zedメイン（統合エディタ）+ tmuxでセッション保護

```bash
# Zedのターミナルシェル設定
# → プロジェクトごとにtmuxセッション自動作成

Zed
├── [エディタペイン] コード編集
├── [エージェントパネル] Claude Code ACP
└── [ターミナルパネル]
    └── tmux session: "myproject"
        ├── pane: $ claude (長時間タスク)
        └── pane: $ npm run dev
```

**向いている人**: エディタ中心のワークフロー、差分review重視

---

### パターン C：三位一体（最強構成）

```
cmux
├── workspace: Agent #1 → Claude Code (機能開発)
├── workspace: Agent #2 → Claude Code (テスト生成)
└── workspace: Monitor  → ログ・リソース監視

Zed（別ウィンドウ）
├── エディタ: コードレビュー
└── MCP Gateway: Slack/Sheets連携

tmux（cmux内またはZed内）
└── 長時間バッチ処理の永続化
```

**向いている人**: 本格的なAIエージェント並列開発、役割を明確に分けたい

---

## ソース

[^1]: [GitHub - manaflow-ai/cmux](https://github.com/manaflow-ai/cmux)
[^2]: [cmux: Native macOS Terminal for AI Coding Agents | Better Stack](https://betterstack.com/community/guides/ai/cmux-terminal/)
[^3]: [The open-source terminal built for coding agents | Product Hunt](https://www.producthunt.com/products/cmux)
[^4]: [Zed Editor Switches Graphics Library from Blade to wgpu](https://ubos.tech/news/zed-editor-switches-graphics-library-from-blade-to-wgpu-for-better-performance/)
[^5]: [Terminal | Built-in Terminal - Zed](https://zed.dev/docs/terminal)
[^6]: [External Agents | Zed Docs](https://zed.dev/docs/ai/external-agents)
[^7]: [Zed Editor launches Agent Metrics | AlternativeTo](https://alternativeto.net/news/2026/4/zed-editor-launches-agent-metrics-offering-public-ai-agent-usage-data/)
[^8]: [ACP Agent Registry Is Live — JetBrains AI Blog](https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/)
[^9]: [Edit Prediction | Zed Docs](https://zed.dev/docs/ai/edit-prediction)
[^10]: [Claude Code: Now in Beta in Zed — Zed Blog](https://zed.dev/blog/claude-code-via-acp)
[^11]: [Claude Code Beta in Zed Editor Faces SDK Limitations — BigGo](https://biggo.com/news/202509031913_Claude_Code_Beta_Zed_SDK_Limitations)
[^12]: [Zed vs VS Code 2026: 2x Startup Speed and 16x Memory Gap](https://tech-insider.org/zed-vs-vscode-2026/)
[^13]: [Zed Editor Switches Graphics Library from Blade to wgpu](https://ubos.tech/news/zed-editor-switches-graphics-library-from-blade-to-wgpu-for-better-performance/)
[^14]: [Ghostty Terminal Emulator Goes Nonprofit](https://byteiota.com/ghostty-terminal-emulator-goes-nonprofit-mitchell-hashimotos-vc-alternative/)
[^15]: [Launch Terminal with tmux Sessions | Zed.tips](https://zed.tips/tips/tmux-terminal-sessions/)
[^16]: [tmux — Zed Extension](https://zed.dev/extensions/tmux)
[^17]: [RFC: Persistent terminal sessions #50584 — GitHub](https://github.com/zed-industries/zed/discussions/50584)
[^18]: [tmux vs zellij: 100-Pane Split Render Speed Benchmark — TildAlice](https://tildalice.io/tmux-vs-zellij-100-pane-benchmark/)
[^19]: [Zed 2025 Recap](https://zed.dev/2025)
[^20]: [Stack Overflow Developer Survey 2025 — Technology](https://survey.stackoverflow.co/2025/technology)
[^21]: [HN: Zed workflow with tmux discussion (id=42817787)](https://news.ycombinator.com/item?id=42817787)
[^22]: [Returning to Neovim — Steve Simkins](https://stevedylan.dev/posts/returning-to-neovim/)
[^23]: [Ghostty now available in Ubuntu repos](https://www.omgubuntu.co.uk/2026/04/ghostty-terminal-ubuntu-26-04-apt-install)
[^24]: [Completely Oxidizing My Terminal Setup — DEV Community](https://dev.to/yjdoc2/completely-oxidizing-my-terminal-setup-43d8)

---

> リサーチ日: 2026-04-14
> 情報収集: 5エージェント並列Webリサーチ（全完了）
> カバー範囲: cmux / Zed / tmux / Zellij / Ghostty / Claude Code連携 / コミュニティ動向

## Confidence Assessment

- cmux = manaflow-ai/cmux（AIエージェント専用ターミナル）: **confirmed** — GitHub公式確認
- Zed 170,000 DAU: **likely** — 創業者発言、第三者未検証
- Zed Claude Code ACP ベータ統合: **confirmed** — 公式ブログ確認
- tmux vs Zellij 100ペインベンチマーク数値: **likely** — サードパーティ測定
- Ghostty 45,247 GitHub Stars: **confirmed** — 2026年3月時点
- Zed セッション永続化（RFC #50584）未実装: **confirmed** — GitHub discussion確認
