# Ollama — ローカルLLM実行ツール 完全ガイド 2026

> リサーチ日: 2026-04-15
> ステータス: **完成**
> 対象: macOS（Apple Silicon）開発環境、ローカルAI活用

---

## Executive Summary

| 項目 | 内容 |
|------|------|
| **最新バージョン** | **v0.20.x**（v0.20.8-rc0、2026-04-13時点） |
| **ライセンス** | **MIT**（完全オープンソース） |
| **対応OS** | macOS / Linux / Windows |
| **主な用途** | CLIでのローカルLLM実行・REST APIサーバー |
| **API** | OpenAI互換 + Anthropic互換（v0.14〜） |
| **MCP対応** | △ ネイティブ非対応（コミュニティブリッジで実現可） |
| **GitHub Stars** | **169,000**（2026年4月、最大規模のローカルLLMツール） |
| **月間DL数** | **5,200万**（Q1 2026、Q1 2023比520倍増） |

### LM Studioとの本質的な違い

```
Ollama    = CLIファースト / APIサーバー / 開発者向け / MIT
LM Studio = GUIファースト / デスクトップアプリ / 全ユーザー向け / 商用無料
```

---

## 目次

1. [バージョン履歴・主要アップデート](#1-バージョン履歴)
2. [インストール・基本操作](#2-インストール基本操作)
3. [Apple Silicon・M5 Max性能](#3-apple-silicon-性能)
4. [対応モデル・フォーマット](#4-対応モデルフォーマット)
5. [API・Claude Code・MCP連携](#5-api連携)
6. [エコシステム・サードパーティ統合](#6-エコシステム)
7. [Dockerデプロイ・並列処理](#7-docker並列処理)
8. [コミュニティ・採用状況・将来性](#8-コミュニティ将来性)
9. [推奨構成（M5 Max 128GB）](#9-推奨構成)

---

## 1. バージョン履歴

### v0.20.x（2026年4月〜）[^1]

| バージョン | リリース | 主な変更 |
|-----------|---------|---------|
| v0.20.8-rc0 | 2026-04-13 | リリース候補版 |
| **v0.20.x** | 2026-04月 | *(詳細収集中)* |

### v0.19.x（2026年3月〜）[^2]

| バージョン | リリース | 主な変更 |
|-----------|---------|---------|
| **v0.19.0** | **2026-03-30** | **Apple Silicon向けMLXバックエンド統合**（プレビュー） |
| v0.19.x | 2026-03月 | NVFP4フォーマット対応（NVIDIA向け） |

### v0.15〜v0.18（2026年1〜3月）[^3]

| バージョン | 主な変更 |
|-----------|---------|
| **v0.15.0** | `ollama launch` コマンド追加（Claude Code等をゼロ設定起動） |
| v0.14.0 | Anthropic Messages API互換エンドポイント追加 |
| v0.6.7 | Llama 4 Scout/Maverick、Phi 4対応 |

### 2025年の主要マイルストーン

| バージョン | 機能 |
|-----------|------|
| v0.x（2025-05） | マルチモーダルエンジン（ビジョン言語モデル対応） |
| v0.x（2025-07） | macOS/Windows向けネイティブデスクトップクライアント（チャット・履歴） |

---

## 2. インストール・基本操作

### インストール[^4]

```bash
# macOS — DMG or Homebrew
brew install ollama
# または公式サイトから .dmg をダウンロード

# Linux — 1行インストール
curl -fsSL https://ollama.com/install.sh | sh

# Windows — winget
winget install Ollama.Ollama
# または公式サイトから .exe をダウンロード
```

### 主要CLIコマンド[^5]

```bash
ollama serve              # サーバー起動（デフォルト: :11434）
ollama run <model>        # モデル起動してチャット
ollama pull <model>       # モデルをダウンロード
ollama push <model>       # モデルをアップロード
ollama list               # ローカルモデル一覧
ollama ps                 # 実行中モデル一覧
ollama rm <model>         # モデルを削除
ollama create <name>      # Modelfileからモデル作成
ollama show <model>       # モデル情報を表示
ollama stop <model>       # モデルを停止

# v0.15 新機能
ollama launch claude --model qwen3-coder   # Claude Codeをゼロ設定起動
ollama launch opencode --model glm-5       # OpenCodeをゼロ設定起動
```

### Modelfileシステム[^6]

```dockerfile
# Modelfile — Dockerfileに類似したモデル定義
FROM llama3.3:70b

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 32768

SYSTEM """
あなたは熟練したソフトウェアエンジニアです。
日本語で回答してください。
"""
```

```bash
# カスタムモデルを作成・実行
ollama create my-coder -f ./Modelfile
ollama run my-coder
```

---

## 3. Apple Silicon 性能

### 2026年3月の転換点 — Ollama 0.19 MLX統合[^7]

> "Ollama on Apple silicon is now built on top of Apple's machine learning framework, MLX, to take advantage of its unified memory architecture, resulting in a large speedup of Ollama on all Apple Silicon devices."

Ollama 0.19（2026-03-30）でApple Silicon向けにMLXバックエンド統合（プレビュー）：

| 指標 | v0.18（llama.cpp） | v0.19（MLX） | 変化率 |
|------|-------------------|-------------|-------|
| prefill（M5 Max / Qwen3.5-35B） | 1,154 tok/s | **1,810 tok/s** | **+57%** |
| decode（M5 Max / Qwen3.5-35B） | 58 tok/s | **112 tok/s** | **+93%** |

**制限事項**:
- 現在は **Qwen3.5-35B-A3B のみ** MLX加速対象（他モデルはllama.cpp継続）
- **32GB以上** のUnified Memory必須
- 完全対応は **Q2 2026 予定**

### チップ世代別ベンチマーク[^8]

| チップ | Llama 3.1 8B (Q4) | Llama 3.1 70B (Q4) |
|--------|------------------|--------------------|
| M1 (base) | 12〜15 tok/s | — |
| M3 Pro/Max | 28〜35 tok/s | 10〜15 tok/s (96GB) |
| M4 / M4 Pro | 30〜40 tok/s | 〜61 tok/s |
| **M5 Max** | **80〜100 tok/s** | **65〜88 tok/s (128GB)** |

M5 Maxのプロンプト処理速度は密な120Bモデルで約4,470 tok/s（M4 Max比約2.5倍）。

### MLX vs llama.cppの詳細比較[^9]

| フレームワーク | decode tok/s (Qwen3.5-35B / Mac mini M4 Pro 64GB) |
|-------------|---------------------------------------------------|
| MLX (Python API) | 〜130 tok/s |
| MLX (HTTP server) | 90〜108 tok/s |
| llama.cpp | 〜71 tok/s |
| Ollama 0.18 (llama.cpp) | 〜43 tok/s |
| **Ollama 0.19 (MLX)** | **〜112 tok/s** |

### Flash Attention設定（llama.cppバックエンド）

```bash
# Flash Attention有効化（16K contextでVRAM 8GB→1.5GBに削減、速度25〜40%向上）
export OLLAMA_FLASH_ATTENTION=1
ollama serve
```

> **注意**: MLXバックエンド（v0.19〜Apple Silicon）での `OLLAMA_FLASH_ATTENTION=1` の有効性は未確認。

---

## 4. 対応モデル・フォーマット

### 対応フォーマット[^10]

| フォーマット | 対応 | 備考 |
|------------|------|------|
| **GGUF** | ✅ | 主力フォーマット。全量子化レベル |
| **MLX** | ✅ プレビュー | Apple Silicon限定。現在Qwen3.5のみ（v0.19〜） |
| **NVFP4** | ✅ | NVIDIA DGX Spark向け（v0.19〜）。INT4/FP4より精度劣化小 |
| **safetensors** | △ 変換必要 | GGUF変換して使用 |

### 主要対応モデル（2026年4月時点）[^11]

| モデルファミリー | 対応バージョン | 備考 |
|----------------|-------------|------|
| **Qwen3 / Qwen3.5** | 完全対応 | MoE含む。MLX加速対象（Qwen3.5-35B-A3B） |
| **Llama 4** | Scout / Maverick | v0.6.7〜。Scout: 12GB量子化 / Maverick: マルチGPU推奨 |
| **Gemma 3 / 4** | 完全対応 | Gemma 3n はエッジ向け |
| **DeepSeek** | 完全対応 | R1, V3系 |
| **Phi 4（Microsoft）** | v0.6.7〜 | 推論モデル |
| **GLM-5** | 完全対応 | ツール呼び出し対応 |

### モデルライブラリ規模

- **公式ライブラリ（ollama.com/library）**: 200以上のモデル（2026年4月）
- **HuggingFace上のGGUF**: 135,000以上のモデルがModelfile経由で利用可能

---

## 5. API連携

### REST APIエンドポイント[^12]

```
# ネイティブAPI
POST /api/generate         — テキスト補完生成
POST /api/chat             — チャット（メッセージ履歴対応）
POST /api/embeddings       — 埋め込みベクトル生成
GET  /api/tags             — ローカルモデル一覧
POST /api/pull             — モデルダウンロード
GET  /api/ps               — 実行中モデル一覧
GET  /api/version          — バージョン確認

# OpenAI互換API
POST /v1/chat/completions  — OpenAI互換チャット
POST /v1/embeddings        — OpenAI互換埋め込み
GET  /v1/models            — モデル一覧（OpenAI形式）

デフォルトポート: 11434
```

### Claude Code直接連携[^13]

**方法1: 環境変数設定（推奨）**

```bash
export ANTHROPIC_BASE_URL="http://localhost:11434"
export ANTHROPIC_AUTH_TOKEN="ollama"
export ANTHROPIC_API_KEY=""

claude --model qwen3-coder
```

**方法2: 設定ファイルへの永続化**

```json
// ~/.claude/settings.json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:11434",
    "ANTHROPIC_AUTH_TOKEN": "ollama",
    "ANTHROPIC_API_KEY": "",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

**方法3: `ollama launch` コマンド（v0.15〜、最も簡単）**[^14]

```bash
# 環境変数不要・設定ファイル不要
ollama launch claude --model qwen3-coder
ollama launch opencode --model glm-5
# モデル未指定時はインタラクティブ選択メニューが表示
```

> 対応ツール: Claude Code、Codex、OpenCode、OpenClaw、Droid、Pi

> **注意**: Claude Codeは64K+コンテキストとツール呼び出し対応モデルが必要。

### OpenAI互換クライアント

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)
response = client.chat.completions.create(
    model="qwen3.5:35b",
    messages=[{"role": "user", "content": "Hello"}]
)
```

### MCP対応[^15]

Ollama本体にはMCPネイティブサポートなし（GitHub Issue #7865でトラッキング中）。
コミュニティブリッジで実現可能：

```bash
# ollama-mcp-bridge（最も成熟）
pip install ollama-mcp-bridge
ollama serve &
uv run ollama-mcp-bridge
# クライアントは http://localhost:8000 に向ける
```

| ブリッジ | 説明 |
|---------|------|
| jonigl/ollama-mcp-bridge | Ollama APIをMCPサーバーに拡張。複数MCPサーバー対応 |
| rawveg/ollama-mcp | MCP serverとしてOllama SDKを公開。Claude Desktop/Clineから利用可 |

---

## 6. エコシステム

### Python / TypeScript SDK[^16]

```python
import ollama

# チャット
response = ollama.chat(
    model='qwen3.5:35b',
    messages=[{'role': 'user', 'content': 'なぜ空は青いの？'}]
)

# ストリーミング
for chunk in ollama.chat(model='qwen3.5:35b', messages=[...], stream=True):
    print(chunk['message']['content'], end='', flush=True)

# 埋め込み
embeddings = ollama.embed(model='qwen3.5', input=['テキスト'])
```

### 主要サードパーティ統合[^17]

| ツール | カテゴリ | 特徴 |
|--------|---------|------|
| **Open WebUI** | チャットUI | OllamaネイティブAPI対応。RAG・マルチモデル・ユーザー管理 |
| **Continue** | IDE拡張 | VS Code/JetBrains対応のAIコードアシスタント |
| **AnythingLLM** | オールインワン | RAGコア統合。ワークスペース管理。最も広範なLLMプロバイダ対応 |
| **Dify** | LLMアプリ開発 | ビジュアルエージェント構築・ワークフロー自動化 |
| **LangChain** | フレームワーク | `ChatOllama` / `OllamaEmbeddings` クラスで統合 |

### Ollama vs 競合の位置づけ[^18]

| シナリオ | 推奨 |
|---------|------|
| 個人・開発者の実験 | **Ollama**（開発者体験No.1） |
| スケーラブルな本番API | **vLLM**（並列10リクエストで485 tok/s合計） |
| 最大速度（Apple Silicon） | **llama.cpp直接** または **MLX** |
| GUIで探索・実験 | **LM Studio** |

---

## 7. Docker・並列処理

### Dockerデプロイ[^19]

```bash
# CPU
docker run -d -v ollama:/root/.ollama -p 11434:11434 ollama/ollama

# NVIDIA GPU
docker run -d --gpus all -v ollama:/root/.ollama -p 11434:11434 ollama/ollama

# AMD GPU (ROCm)
docker run -d --device /dev/kfd --device /dev/dri \
  -v ollama:/root/.ollama -p 11434:11434 ollama/ollama:rocm
```

```yaml
# docker-compose.yml（Open WebUI込み）
services:
  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
    volumes: [ollama:/root/.ollama]
  open-webui:
    image: ghcr.io/open-webui/open-webui:latest
    ports: ["3000:8080"]
    depends_on: [ollama]
```

> Dockerコンテナ内ではデフォルトで `0.0.0.0` にバインド（外部からアクセス可）。

### 並列リクエスト処理[^20]

```bash
# 環境変数
OLLAMA_NUM_PARALLEL=4          # 1モデルあたり最大並列数（デフォルト自動）
OLLAMA_MAX_LOADED_MODELS=3     # 同時ロード可能モデル数
OLLAMA_MAX_QUEUE=512           # リクエストキュー上限（超過時HTTP 503）
```

**パフォーマンス特性**:
- 並列数4でフル負荷時: 個別レイテンシ+20〜40%、総スループット3〜4倍
- 必要RAM = `OLLAMA_NUM_PARALLEL × コンテキスト長`（例: 4並列×8K = 32K相当）

---

## 8. コミュニティ・採用状況・将来性

### 規模[^21]

| 指標 | 数値 |
|------|------|
| GitHub Stars | **169,000**（2026年4月） |
| GitHub Forks | 15,600 |
| Discord | **195,537人** |
| r/LocalLLaMA | **266,500人超** |
| 月間DL数 | **5,200万**（Q1 2026） |
| HuggingFace GGUF | **135,000以上** のモデル対応 |

> Q1 2023から2026で520倍のダウンロード増加。

### 採用ユースケース[^22]

- エアギャップ環境（防衛・金融・医療）での機密データ処理
- GDPRコンプライアンス対応
- HIPAA準拠の医療記録分析
- フィンテック企業の不正検知（データをサードパーティに送らず）

### 弱点・批判的な意見[^23]

> "Ollama is still the easiest way to start local LLMs, but it's the worst way to keep running them"

1. **速度**: llama.cpp直接実行と比べて15〜30%遅い（ラッパー層オーバーヘッド）
2. **デフォルトコンテキスト**: デフォルト4,096トークン。エージェント/コーディングには最低64K必要だが、VRAM 24GB未満では動的拡張が難しい
3. **設定柔軟性の低さ**: 自動設定の上書きが困難。エンタープライズ向けの細かい制御が限定的
4. **モデルライブラリの限界**: 公式ライブラリのキュレーションのみ。HuggingFace全モデルに即日アクセス不可
5. **パワーユーザーの離脱**: 上級者はllama.cppへの乗り換えで「速度・効率が劇的に改善」と報告

### 2026年ロードマップ（公式未公開）[^24]

> Ollamaは公式ロードマップを公開していない。以下は二次ソースからの読み取り（確信度: uncertain）

**予測される3つの方向性**:

1. **Agentic Autonomy**: Web検索・ファイル操作等の自律タスクを実行する「エージェント基盤」への移行
2. **Hybrid-Cloud Fluidity**: VRAM不足時にプライベートクラウドにバーストする「Compute-Bursting」機能
3. **Hardware-Native Performance**: BitNet（1-bit量子化）対応で4GB RAMで3B+モデルを動作させるエッジ展開

### 会社情報[^25]

| 項目 | 内容 |
|------|------|
| 創業者 | Michael Chiang、Jeffrey Morgan |
| 投資家 | Y Combinator、Sunflower Capital、Essence VC Fund |
| 従業員数 | 21名（2024）→ 46名（2026年1月） |
| 調達額 | 少額（具体額はソース間で矛盾あり） |

> ビジネスモデルとしては極めて小規模。HN上でも「どうやって持続するのか」と議論になっている。

---

## 9. 推奨構成（M5 Max 128GB）

### モデル選択

| 用途 | モデル | 量子化 | 想定速度 |
|------|--------|--------|---------|
| 汎用・高品質 | Llama 3.3 70B | Q8_0 (〜80GB) | 20〜30 tok/s |
| コーディング（高速） | Qwen3.5-35B-A3B | NVFP4 (MLX) | 〜112 tok/s decode |
| 大規模MoE | Qwen3.5 122B (MoE) | Q4 | 〜15 tok/s |
| バランス型 | Qwen2.5 14B | Q4 | 45〜60 tok/s |
| 最速（7B） | Gemma 3 7B | Q4 | 80〜100 tok/s |

### 環境変数設定

```bash
# ~/.zshrc or ~/.config/fish/config.fish
export OLLAMA_FLASH_ATTENTION=1     # Flash Attention有効（llama.cppバックエンド）
export OLLAMA_KEEP_ALIVE=-1         # モデルを常駐させる
export OLLAMA_KV_CACHE_TYPE=q8_0   # KVキャッシュ圧縮（品質劣化最小）
export OLLAMA_NUM_PARALLEL=4        # 並列リクエスト数

# Claude Code連携
export ANTHROPIC_BASE_URL=http://localhost:11434
export ANTHROPIC_AUTH_TOKEN=ollama
```

### Ollamaでの推論 vs LM Studioでの推論（M5 Max 128GB）

| 用途 | 選択ツール | 理由 |
|------|-----------|------|
| Claude Code連携 | **どちらも可** | OllamaはollmA launch、LMSはAnthropic互換エンドポイント |
| 常駐APIサーバー | **Ollama** | 軽量・自動化・Docker |
| モデル探索・実験 | **LM Studio** | HuggingFace統合・VRAM確認 |
| 最速推論（MLX） | **LM Studio** が先行（2026/3まで）→現在はほぼ同等 |

---

## ソース

[^1]: [Releases · ollama/ollama — GitHub](https://github.com/ollama/ollama/releases)
[^2]: [Ollama is now powered by MLX on Apple Silicon — Ollama Blog](https://ollama.com/blog/mlx)
[^3]: [ollama launch — Ollama Blog](https://ollama.com/blog/launch)
[^4]: [Download Ollama — ollama.com](https://ollama.com/download)
[^5]: [CLI Reference — Ollama Docs](https://docs.ollama.com/cli)
[^6]: [Modelfile Reference — Ollama Docs](https://docs.ollama.com/modelfile)
[^7]: [MacRumors — Ollama Now Runs Faster on Macs Thanks to Apple's MLX Framework](https://www.macrumors.com/2026/03/31/ollama-now-runs-faster-apple-silicon-macs/)
[^8]: [Apple M5 Max Local LLM Guide — AI:PRODUCTIVITY](https://aiproductivity.ai/blog/apple-m5-max-local-llm-guide/)
[^9]: [Ollama vs. llama.cpp vs. MLX with Qwen3.5 35B — Ante Kapetanovic](https://antekapetanovic.com/blog/qwen3.5-apple-silicon-benchmark/)
[^10]: [Ollama is now powered by MLX — Ollama Blog](https://ollama.com/blog/mlx)
[^11]: [Releases v0.6.7 · ollama/ollama](https://github.com/ollama/ollama/releases/tag/v0.6.7)
[^12]: [API Reference — ollama/docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)
[^13]: [Claude Code — Ollama Docs](https://docs.ollama.com/integrations/claude-code)
[^14]: [Release v0.15.0 · ollama/ollama](https://github.com/ollama/ollama/releases/tag/v0.15.0)
[^15]: [GitHub Issue #7865 — MCP support · ollama/ollama](https://github.com/ollama/ollama/issues/7865)
[^16]: [ollama/ollama-python — GitHub](https://github.com/ollama/ollama-python)
[^17]: [Open WebUI 公式](https://openwebui.com/)
[^18]: [Ollama vs vLLM: Performance Benchmark 2026 — SitePoint](https://www.sitepoint.com/ollama-vs-vllm-performance-benchmark-2026/)
[^19]: [Ollama Docker — Docker Hub](https://hub.docker.com/r/ollama/ollama)
[^20]: [How Ollama Handles Parallel Requests — glukhov.org](https://www.glukhov.org/llm-performance/ollama/how-ollama-handles-parallel-requests/)
[^21]: [Local AI in 2026: Ollama Benchmarks — DEV Community](https://dev.to/pooyagolchian/local-ai-in-2026-ollama-benchmarks-0-inference-and-the-end-of-per-token-pricing-32e7)
[^22]: [The Complete Ollama Enterprise Deployment Guide (2026)](https://hyperion-consulting.io/en/insights/ollama-enterprise-deployment-guide-2026)
[^23]: [XDA Developers — Ollama is the easiest way to start but the worst to keep running](https://www.xda-developers.com/ollama-easiest-way-start-local-llms-worst-keep-running/)
[^24]: [Zignuts Blog — Ollama AI Roadmap Analysis](https://www.zignuts.com/blog/ollama-ai)
[^25]: [Y Combinator — Ollama company profile](https://www.ycombinator.com/companies/ollama)

---

> リサーチ日: 2026-04-15
> 情報収集: 5エージェント並列（5/5完了）
