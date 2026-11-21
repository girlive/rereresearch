# MacBook Pro M5 Max 128GB — Ollama ローカルLLMモデル最新情報

> リサーチ日: 2026-04-13
> ステータス: **完成**
> 対象環境: MacBook Pro M5 Max 128GB 16インチ + Ollama 0.19+（MLX backend）

---

## Executive Summary

| カテゴリ | 推奨モデル | Ollamaコマンド | VRAM | 速度 |
|---------|-----------|--------------|------|------|
| **汎用・爆速** | Qwen3.5 35B-A3B (MoE) | `ollama pull qwen3.5:35b` | ~20GB | ~112 tok/s |
| **汎用・最高品質** | Qwen3.5 122B-A10B (MoE) | `ollama pull qwen3.5:122b` | ~72GB | **60 tok/s実測** |
| **コーディング** | Qwen3-Coder 30B-A3B | `ollama pull qwen3-coder:30b-a3b` | ~17GB | 高速 |
| **コーディングAgent** | Devstral Small (24B) | `ollama pull devstral` | ~14GB | — |
| **マルチモーダル** | Llama 4 Scout / Gemma 4 27B | `ollama pull llama4:scout` | ~55GB | ~20-35 tok/s |
| **推論・Thinking** | Qwen3 32B（/think切替） | `ollama pull qwen3:32b` | ~20GB | ~25-35 tok/s |
| **推論・最高性能** | DeepSeek R1 70B | `ollama pull deepseek-r1:70b` | ~40GB | ~15-25 tok/s |
| **軽量・高速** | Qwen3 8B / Phi-4-mini | `ollama pull qwen3:8b` | ~5GB | ~110 tok/s |
| **日本語** | Qwen3 30B-A3B | `ollama pull qwen3:30b-a3b` | ~17-19GB | ~40-64 tok/s |

**重要な新情報（2026年）**:
- Ollama v0.14.0以降: Claude Codeとの**ネイティブ連携でLiteLLM不要**
- Gemma 4（2026年4月2日リリース）: オープンモデル世界3位
- Devstral 2（123B）: SWE-bench **72.2%**、128GBで動く可能性あり
- DeepSeek R1: 最新版はR1-0528（2025年5月）。AIME 2024 **91.4%**

---

## 目次

1. [Qwen3系（汎用・日本語）](#1-qwen3系)
2. [Qwen3.5系（最新・最高性能）](#2-qwen35系)
3. [Llama 4系（マルチモーダル）](#3-llama-4系)
4. [コーディング特化](#4-コーディング特化)
5. [推論・思考系（Thinking）](#5-推論思考系)
6. [その他注目モデル（Gemma / Phi / Mistral）](#6-その他注目モデル)
7. [日本語強化モデル](#7-日本語強化モデル)
8. [128GBで動かない大型モデル](#8-128gbで動かない大型モデル)
9. [Claude Code連携の最新情報](#9-claude-code連携の最新情報)
10. [全モデル早見表](#10-全モデル早見表)

---

## 1. Qwen3系

**リリース日**: 2025年4月28日 / ライセンス: Apache 2.0 / 119言語対応

### ラインナップ

| モデル | タイプ | VRAM(Q4) | Ollamaタグ | コンテキスト |
|--------|--------|---------|-----------|------------|
| Qwen3:0.6B | Dense | <1GB | `qwen3:0.6b` | 40K |
| Qwen3:1.7B | Dense | ~1.4GB | `qwen3:1.7b` | 40K |
| Qwen3:4B | Dense | ~2.5GB | `qwen3:4b` | 256K |
| Qwen3:8B | Dense | ~5GB | `qwen3:8b` | 40K |
| Qwen3:14B | Dense | ~8.3GB | `qwen3:14b` | 40K |
| **Qwen3:30B-A3B** | MoE | ~17-19GB | `qwen3:30b-a3b` | 256K |
| Qwen3:32B | Dense | ~20GB | `qwen3:32b` | 40K |
| Qwen3:235B-A22B | MoE | **~132GB** | `qwen3:235b-a22b` | — |

**⚠️ Qwen3:235B-A22Bについて**: Q4で~132GB必要。128GB環境ではスワップが発生する可能性あり。Qwen3.5:122Bの方が安定。[^1]

### Thinking Modeの使い方[^2]

```
/think    → 深く考える（複雑な推論・数学向け）
/no_think → 即答（日常チャット向け）
```

ターンごとに切り替え可能。Ollamaでそのまま動作する。

### 日本語性能[^3]

- Qwen3-30B-A3B ≈ 日本語特化Shisa V2 70Bと同等スコア
- Qwen3-8Bが同サイズクラスのShisa V2を上回る

---

## 2. Qwen3.5系

**リリース日**: 2026年2〜3月順次 / 全モデル256Kコンテキスト

### ラインナップ

| モデル | タイプ | VRAM(Q4) | Ollamaタグ | M5 Max速度 |
|--------|--------|---------|-----------|-----------|
| Qwen3.5:0.8B | Dense | <1GB | `qwen3.5:0.8b` | — |
| Qwen3.5:2B | Dense | ~2GB | `qwen3.5:2b` | — |
| Qwen3.5:4B | Dense | ~3GB | `qwen3.5:4b` | — |
| Qwen3.5:9B | Dense | ~5.1GB | `qwen3.5:9b` | — |
| Qwen3.5:27B | Dense | ~16.1GB | `qwen3.5:27b` | — |
| **Qwen3.5:35B-A3B** | **MoE** | ~20GB | `qwen3.5:35b` | **~112 tok/s** |
| **Qwen3.5:122B-A10B** | **MoE** | ~72GB | `qwen3.5:122b` | **60.6 tok/s実測** |

### Qwen3.5:122B-A10B — 128GB環境の本命[^4]

M5 Max 128GBでの**実測値**: 生成 **60.6 tok/s**、Prefill **1,239.7 tok/s**（16Kコンテキスト）

- 総122B / アクティブ10B（MoEで高速）
- VRAM ~72GB → 128GBに余裕で収まる
- これが128GBの真価を発揮できる最大クラスの実用モデル

### ⚠️ Ollama互換性の注意点[^5]

Qwen3.5はネイティブにマルチモーダル設計のため、一部バージョンのOllamaで互換性問題の報告あり。最新Ollama（0.19+）での動作確認を推奨。

---

## 3. Llama 4系

**リリース日**: 2025年4月 / Ollama対応: v0.6.7以降

### ラインナップ

| モデル | 総パラメータ | アクティブ | VRAM(Q4) | Ollamaタグ | 128GB |
|--------|-----------|---------|---------|-----------|-------|
| **Scout** | 109B | 17B | ~55GB | `llama4:scout` | **◎** |
| Maverick | 402B | 17B | ~200GB | `llama4:maverick` | ✗ |
| Behemoth | 2T | 288B | 1TB+ | 未リリース | ✗ |

### Llama 4 Scoutの特徴[^6][^7]

- **マルチモーダル**: テキスト + 画像（ネイティブEarly Fusion）
- **コンテキスト**: **10Mトークン**（業界最長クラス）
- **Function calling**: 対応
- **速度**: 17B active ≈ ~20-35 tok/s推定

### Llama 3.3 70B vs Llama 4 Scout

| 指標 | Llama 3.3 70B | Llama 4 Scout |
|------|--------------|--------------|
| VRAM | ~40GB | ~55GB |
| 速度 | ~25 tok/s | ~20-35 tok/s |
| マルチモーダル | ✗ | **✓** |
| コンテキスト | 128K | **10M** |
| 純テキストベンチ | 一部で優位 | — |

画像入力・超長文が不要なら3.3 70Bも引き続き有力。[^8]

---

## 4. コーディング特化

### SWE-bench Verified スコア（128GB環境で動くもの）

| モデル | SWE-bench | VRAM | Ollamaコマンド |
|--------|-----------|------|--------------|
| **Devstral 2 (123B)** | **72.2%** | ~75GB? | ※要確認 |
| Kimi K2 Thinking | 71.3% | ~24GB+ | `ollama pull kimi-k2-thinking` |
| **Qwen3-Coder 30B-A3B** | **70.6%** | ~17GB | `ollama pull qwen3-coder:30b-a3b` |
| Devstral Small (24B) | 68.0% | ~14GB | `ollama pull devstral` |
| Qwen2.5-Coder:32B | ~65% | ~20GB | `ollama pull qwen2.5-coder:32b` |
| Codestral 25.08 | ~55% | ~13GB | `ollama pull codestral` |

### 注目: Devstral 2（123B Dense）[^9]

- SWE-bench **72.2%** — 128GBで動くモデルの最高スコア候補
- 256Kトークンコンテキスト
- Modified MITライセンス
- ⚠️ **123B Denseのため VRAM は ~75GB前後と推定**。128GBに収まるが要確認

### Qwen3-Coder 30B-A3B（実用最推奨）[^10]

```bash
ollama pull qwen3-coder:30b-a3b
```
- MoEで3B active → 非常に高速
- SWE-bench 70.6%（軽量モデルで実質最高スコア）

### Devstral Small（ソフトウェアエージェント特化）[^11]

```bash
ollama pull devstral
```
- Mistral AI × All Hands AI共同開発
- コードベース探索・複数ファイル編集に特化
- 24B / ~14GB / SWE-bench 68.0%

### 動かない大型コーディングモデル

| モデル | VRAM | SWE-bench |
|--------|------|-----------|
| Kimi K2.5 (1T MoE) | ~240GB | 76.8% |
| DeepSeek V3.2 (685B MoE) | ~170GB+ | 73.0% |

---

## 5. 推論・思考系（Thinking）

### DeepSeek R1 — 最新はR1-0528（2025年5月）[^12]

| タグ | VRAM | 128GB可否 |
|------|------|---------|
| `deepseek-r1:7b` | ~5GB | ◎ |
| `deepseek-r1:14b` | ~9GB | ◎ |
| `deepseek-r1:32b` | ~20GB | ◎ |
| **`deepseek-r1:70b`** | **~40GB** | **◎（最大推奨）** |
| `deepseek-r1:671b` | ~400GB+ | ✗ |

**R1-0528のベンチマーク**（R1元版との比較）:

| ベンチマーク | R1（元版） | R1-0528 |
|------------|----------|---------|
| AIME 2024 | 79.8% | **91.4%** |
| AIME 2025 | 70.0% | **87.5%** |

オープンソースでo3に次ぐ2位。DeepSeek R2は2026年4月時点で未リリース。

### Qwen3 — Thinkingモードで最も実用的[^13]

```bash
# 使い分け例
/think これはAIME 2024の問題10です...  → 深く考える
/no_think 今日の東京の天気は？ → 即答
```

| モデル | VRAM | 速度(no_think) | 速度(think) |
|--------|------|--------------|------------|
| qwen3:14b | ~9GB | ~50 tok/s | ~50 tok/s（思考中） |
| **qwen3:32b** | ~20GB | ~30 tok/s | ~30 tok/s（思考中） |
| qwen3:30b-a3b | ~17GB | ~40-64 tok/s | 高速 |

### Thinkingモードの実用的な待機時間[^14]

難問（AIME級）ではR1が平均23,000トークン思考する:

| モデル | tok/s | 難問での待機時間目安 |
|--------|-------|-----------------|
| qwen3:32b (/think) | ~30 | 3〜10分 |
| deepseek-r1:70b | ~18 | 5〜18分 |
| qwen3:32b (/no_think) | ~30 | **数秒** |

**実用推奨**: 日常使いは `/no_think`、数学・複雑な推論は `/think` で切り替え。

### Cogito v1（新興推論モデル）[^15]

```bash
ollama pull cogito:32b  # または 70b
```
- IDA（Iterated Distillation and Amplification）技術
- 3B/8B/14B/32B/70B全てOllama対応
- 同サイズのLlama/DeepSeek/Qwenを多くのベンチで上回ると主張
- 商用ライセンス

---

## 6. その他注目モデル

### Gemma 4（2026年4月2日リリース）[^16]

**オープンモデルArena AIランキング世界3位**（31B Dense）

```bash
ollama pull gemma4:27b   # または gemma4:26b（MoE）
```

| バリアント | VRAM | 特徴 |
|----------|------|------|
| gemma4:e2b | ~7.2GB | 実効2B、エッジ向け |
| gemma4:e4b | ~9.6GB | **デフォルト推奨** |
| gemma4:26b | 〜16GB? | MoE |
| gemma4:27b | ~16GB | Dense、最高品質 |

- **全モデルマルチモーダル**（テキスト+画像）
- **Thinkingモード対応**
- Apache 2.0ライセンス

### Phi-4系（Microsoft）[^17]

| モデル | VRAM | 特徴 |
|--------|------|------|
| `phi4` | ~9GB | 14B。GPT-4oをMATH/GPQAで上回る |
| `phi4-mini` | ~2.5GB | 3.8B。128Kコンテキスト、Function calling対応 |
| `phi4-mini-reasoning` | ~2.5GB | 数学推論特化、o1-miniに匹敵 |

```bash
ollama pull phi4-mini-reasoning  # 軽量推論に最適
```

### Mistral系[^18][^19]

| モデル | VRAM | 特徴 |
|--------|------|------|
| `mistral-small3.2` | ~14GB | 24B、Function calling改善版 |
| `devstral` | ~14GB | 24B、ソフトウェアエージェント特化 |
| `codestral` | ~13GB | 22B、コード補完特化、256K ctx |

---

## 7. 日本語強化モデル

| モデル | VRAM | 特徴 | Ollama |
|--------|------|------|--------|
| **Qwen3:30B-A3B** | ~17GB | 119言語対応、日本語ベンチ最強クラス | `qwen3:30b-a3b` |
| Qwen3:8B | ~5GB | 軽量・日本語対応 | `qwen3:8b` |
| Qwen3-Swallow:32B | ~20GB | 東工大・日英特化ファインチューン | HuggingFaceのGGUF要 |

**Qwen3-Swallow**（東京工業大学）: 2026年2月リリース。同規模オープンLLM中、日本語タスクで最高性能。Ollamaへの直接対応は未確認だがGGUF変換版あり。[^20]

---

## 8. 128GBで動かない大型モデル

| モデル | 必要VRAM | SWE-bench | 理由 |
|--------|---------|-----------|------|
| Kimi K2.5 (1T MoE) | ~240GB | 76.8% | 大幅超過 |
| Llama 4 Maverick (402B) | ~200GB | — | 大幅超過 |
| DeepSeek V3.2 (685B MoE) | ~170GB+ | 73.0% | 超過 |
| DeepSeek V3.1 (671B MoE) | ~170GB+ | — | 超過 |
| DeepSeek R1 671B | ~400GB+ | — | 論外 |
| Qwen3:235B-A22B | ~132GB | — | ⚠️ スワップ発生の可能性 |

---

## 9. Claude Code連携の最新情報

### Ollama v0.14.0以降: LiteLLM不要[^21]

```bash
# 3行で完結（LiteLLM不要）
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_BASE_URL=http://localhost:11434
export ANTHROPIC_API_KEY=""
claude
```

| Ollamaバージョン | Claude Code連携 |
|---------------|---------------|
| < 0.14.0 | LiteLLM Proxy経由が必要 |
| **0.14.0+** | **ネイティブ直接接続** |

### Claude Codeとの推奨組み合わせ

```bash
# コーディング用
ollama pull qwen3-coder:30b-a3b
export ANTHROPIC_BASE_URL=http://localhost:11434

# エージェント用
ollama pull devstral
```

---

## 10. 全モデル早見表

### ◎ 快適（〜40GB）

| モデル | VRAM | 速度 | 用途 |
|--------|------|------|------|
| phi4-mini-reasoning | ~2.5GB | 高速 | 軽量推論・数学 |
| Qwen3:8B | ~5GB | ~110 tok/s | 軽量汎用 |
| Qwen3:14B | ~8.3GB | ~70 tok/s | MCP/ツール |
| Codestral | ~13GB | ~60 tok/s | コード補完 |
| Qwen3-Coder:30b-a3b | ~17GB | 高速(3B active) | コーディング最強 |
| Qwen3:30b-a3b | ~17-19GB | ~40-64 tok/s | 汎用・日本語 |
| Qwen3.5:35b (MoE) | ~20GB | **~112 tok/s** | 爆速汎用 |
| Qwen3:32b | ~20GB | ~30 tok/s | 推論・コーディング |
| DeepSeek R1:70b | ~40GB | ~15-25 tok/s | 推論最強 |
| Llama 3.3:70b | ~40GB | ~25 tok/s | 汎用 |

### ○ 128GBの真価（40〜80GB）

| モデル | VRAM | 速度 | 用途 |
|--------|------|------|------|
| Llama 4 Scout | ~55GB | ~20-35 tok/s | マルチモーダル |
| **Qwen3.5:122b (MoE)** | ~72GB | **60 tok/s実測** | 最高品質汎用 |

### △ 要確認（80〜128GB）

| モデル | VRAM | 用途 |
|--------|------|------|
| Devstral 2 (123B Dense) | ~75GB? | コーディング72.2% |
| Qwen3:235b-a22b | ~132GB | スワップ発生可能性あり |

---

## Sources

[^1]: [Qwen3 Hardware Requirements — hardware-corner.net](https://www.hardware-corner.net/guides/qwen3-hardware-requirements/)
[^2]: [Qwen3: Think Deeper, Act Faster — 公式ブログ](https://qwenlm.github.io/blog/qwen3/)
[^3]: [Qwen3 Japanese Performance — Shisa.AI](https://shisa.ai/posts/qwen3-japanese-performance/)
[^4]: [Apple M5 Max Local LLM Guide 128GB — aiproductivity.ai](https://aiproductivity.ai/blog/apple-m5-max-local-llm-guide/)
[^5]: [Qwen3.5 Ollama compatibility — HuggingFace](https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/discussions/4)
[^6]: [Llama 4 公式モデルページ](https://www.llama.com/models/llama-4/)
[^7]: [Ollama library — llama4](https://ollama.com/library/llama4)
[^8]: [Llama 4 Scout vs Llama 3.3 70B — LLM Stats](https://llm-stats.com/models/compare/llama-3.3-70b-instruct-vs-llama-4-scout)
[^9]: [Devstral 2 — VentureBeat](https://venturebeat.com/ai/mistral-launches-powerful-devstral-2-coding-model-including-open-source)
[^10]: [Qwen3-Coder GitHub](https://github.com/QwenLM/Qwen3-Coder)
[^11]: [Devstral — Ollama](https://ollama.com/library/devstral)
[^12]: [DeepSeek-R1-0528 Release — DeepSeek API Docs](https://api-docs.deepseek.com/news/news250528)
[^13]: [qwen3 — Ollama](https://ollama.com/library/qwen3)
[^14]: [Qwen3-32B reasoning — Artificial Analysis](https://artificialanalysis.ai/models/qwen3-32b-instruct-reasoning)
[^15]: [Cogito v1 Preview — Deep Cogito](https://www.deepcogito.com/research/cogito-v1-preview)
[^16]: [Google Blog — Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
[^17]: [Phi-4-mini — Microsoft Tech Community](https://techcommunity.microsoft.com/blog/educatordeveloperblog/welcome-to-the-new-phi-4-models---microsoft-phi-4-mini--phi-4-multimodal/4386037)
[^18]: [Mistral Small 3.2 — Simon Willison](https://simonwillison.net/2025/Jun/20/mistral-small-32/)
[^19]: [Codestral — Mistral AI](https://mistral.ai/news/codestral)
[^20]: [Qwen3-Swallow — swallow-llm.github.io](https://swallow-llm.github.io/qwen3-swallow.en.html)
[^21]: [Claude Code — Ollama Docs](https://docs.ollama.com/integrations/claude-code)
[^22]: [deepseek-r1 — Ollama](https://ollama.com/library/deepseek-r1)
[^23]: [Gemma 4 — Google DeepMind](https://deepmind.google/models/gemma/gemma-4/)
[^24]: [phi4-mini-reasoning — Ollama](https://ollama.com/library/phi4-mini-reasoning)
[^25]: [SWE-bench Verified Leaderboard — benchlm.ai](https://benchlm.ai/benchmarks/sweVerified)

---

## Methodology

- リサーチ日: 2026-04-13
- 情報収集: 5エージェント並列Webリサーチ（全完了）
- カバー範囲: Qwen3/3.5 / Llama 4 / コーディング / 推論系 / Gemma/Phi/Mistral
- ソース数: 25+

## Confidence Assessment

- Qwen3.5:122B 60.6 tok/s実測: **confirmed** — aiproductivity.ai実測
- Gemma 4 Arena AI 3位: **confirmed** — Google公式
- DeepSeek R1-0528 AIME 2024 91.4%: **confirmed** — DeepSeek公式
- Devstral 2 SWE-bench 72.2%: **confirmed** — VentureBeat/Mistral公式
- Devstral 2 (123B)が128GBに収まるか: **likely**（Dense 123Bの推定から）
- Llama 4 Scout 128GBで動作: **confirmed** — 複数ソース
- Qwen3.5 Ollama互換性（最新版）: **likely** — 一部問題報告あり
- Thinking待機時間（難問時）: **likely** — 問題難易度に大きく依存
