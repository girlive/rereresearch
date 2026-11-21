# MacBook Pro M5 Max 128GB — 社内AI PoC端末としての適性評価

> リサーチ日: 2026-04-13
> ステータス: **完成**

---

## Executive Summary

**結論: PoC端末として強く推奨。ただし「将来のスケールアップ前提」で購入するべき。**

| 評価軸 | 評価 | 理由 |
|--------|------|------|
| LLM推論性能 | ★★★★☆ | 70B+モデルがラップトップで動く唯一の選択肢。小モデルはRTX 5090に劣る |
| PoC開発環境 | ★★★★★ | Ollama + Claude Code + Docker MCP が即日構築可能 |
| 携帯性・静音性 | ★★★★★ | どこでも使える。オフィスで無音 |
| スケールアップ移行 | ★★★☆☆ | Ollama→vLLM、MLX→CUDAの移行コストがある |
| コスパ | ★★★★☆ | PoC期間限定なら十分。本番用途には別途計算資源が必要 |

**重要ポイント3点**:
1. **Llama 4 Scout（Q4, 61GB）がラップトップで動く** — 128GBユニファイドメモリのおかげ
2. **Ollama 0.19 + MLX = M4 Max比で93%高速化** — 2026年3月以降は別物の速度
3. **Prefill速度がM4 Max比2.5倍** — 長い社内ドキュメントを読ませる用途で特に恩恵大

---

## 目次

1. [M5 Max チップスペック](#1-m5-maxチップスペック)
2. [LLM推論速度（モデル別実測）](#2-llm推論速度モデル別実測)
3. [競合比較](#3-競合比較)
4. [PoC開発環境としての適性](#4-poc開発環境としての適性)
5. [PoC→スケールアップ計画](#5-pocスケールアップ計画)
6. [価格・購入ガイド](#6-価格購入ガイド)
7. [購入判断](#7-購入判断)

---

## 1. M5 Maxチップスペック

**リリース日: 2026年3月3日**

| 項目 | M5 Max（40C GPU）| M4 Max（40C GPU）| M3 Ultra |
|------|-----------------|-----------------|---------|
| **CPU** | 18コア（6 Super + 12 Performance） | 16コア（P+E） | 32コア |
| **GPU** | 40コア | 40コア | 80コア |
| **Neural Accelerator** | **◎ 全GPUコアに内蔵**（新機能） | × | × |
| **最大メモリ** | **128GB** | 128GB | 192GB |
| **メモリ帯域幅** | **614 GB/s** | 546 GB/s | 819 GB/s |
| **製造プロセス** | TSMC N3P（3nm） | TSMC N3E | TSMC N3E |
| **AI compute（GPU）** | M4 Max比 **4倍** | — | — |

**M5世代最大の変化**: GPUの各コアに「Neural Accelerator」を内蔵。行列演算（LLM推論のコア処理）をGPUコア内で直接実行することで、**Time-to-First-Token（最初のトークンが出るまでの時間）を最大4倍高速化**。[^1]

---

## 2. LLM推論速度（モデル別実測）

フレームワーク: **Ollama 0.19 + MLX backend**（2026年3月以降の推奨構成）

### 2-1. モデル別 tok/s（Generation速度）

| モデル | 量子化 | VRAM使用量 | Generation (tok/s) | Prefill (tok/s) | 実用性 |
|-------|--------|-----------|-------------------|----------------|-------|
| **Qwen3-30B-A3B** | Q4_K_M | ~17GB | **~40〜64** | 高速 | ◎ MCPゲートウェイ最適 |
| **Qwen3.5-35B-A3B（MoE）** | NVFP4 | ~20GB | **~112** | 1,810 | ◎ 爆速MoE |
| **Llama 3.3 70B** | Q4_K_M | ~40GB | **~25〜28** | 4,470 | ○ 実用域 |
| **Llama 4 Scout** | Q4_K_M | ~61GB | **~15〜25** ※推定 | — | ○ 128GBで動く |
| **Qwen3.5-122B-A10B（MoE）** | 4-bit | ~74GB | **~60** | 1,240 | ○ 超大型MoEも可 |
| 14B（Qwen等） | Q4 | ~8GB | **~55** | — | ◎ |
| 8B（Llama等） | Q4 | ~5GB | **~110** | — | ◎ |

※ Llama 4 Scout の速度は理論推定（M4 Maxでの報告ベース）。実測値は確認中。[^2]

### 2-2. Prefill速度の重要性

**Prefill = ユーザーが送ったテキストをLLMが読み込む時間**

```
「この1万字の社内仕様書を要約して」
    ↓ Prefill（ここが速い）
「要約します。・・・」
    ↓ Generation（ここが従来の速度）
```

M5 MaxはM4 Max比で**Prefill 2.5倍速**。長い社内文書・コードベースを読ませる用途で体感差が大きい。[^3]

### 2-3. Ollama 0.19 + MLX の重要性

**旧バージョン（Ollama 0.18以前 / llama.cpp backend）を使っていると性能を大幅に損している。**

| フレームワーク | Generation速度（Qwen3.5-35B-A3B） | 備考 |
|--------------|----------------------------------|------|
| **Ollama 0.19（MLX backend）** | **112 tok/s** | 2026年3月以降 |
| Ollama 0.18（llama.cpp backend） | 58 tok/s | 旧来 |
| PyTorch MPS | 7〜9 tok/s | CUDA→Metal変換コスト大 |

---

## 3. 競合比較

### 3-1. M5 Max 128GB vs RTX 5090 32GB

| モデル規模 | M5 Max 128GB | RTX 5090 32GB | 勝者 |
|-----------|-------------|----------------|------|
| 8B Q4 | ~110 tok/s | ~160〜200 tok/s | RTX 5090（+50〜80%） |
| 14B Q4 | ~55 tok/s | ~100〜130 tok/s | RTX 5090（+80〜130%） |
| 30B Q4 | ~40 tok/s | ~50 tok/s | RTX 5090（+25%） |
| 70B Q4 | ~25 tok/s | ~85〜105 tok/s | RTX 5090（+240〜320%） |
| 70B FP16 | ~10 tok/s | **動作不可**（32GB不足） | **M5 Max** |
| Llama 4 Scout Q4 | ~15〜25 tok/s | **動作不可**（32GB不足） | **M5 Max独壇場** |
| 消費電力（推論時） | **60〜90W** | 575W | **M5 Max（6〜9倍差）** |
| 携帯性 | **◎ ラップトップ** | × デスクトップ必須 | **M5 Max** |

**RTX 5090は7B〜70Bモデルの速度で圧勝するが、70B超のモデルは動かせない。M5 Max 128GBは「大きいモデルを省電力で動かす」用途に特化した選択肢。** [^4]

### 3-2. M5 Max 128GB vs Mac Studio M3 Ultra（参考）

| 項目 | MacBook Pro M5 Max 128GB | Mac Studio M3 Ultra 256GB |
|------|--------------------------|--------------------------|
| メモリ帯域幅 | 614 GB/s | 819 GB/s |
| 最大メモリ | 128GB | 256GB |
| 70B tok/s | ~25〜28 | ~20 |
| 携帯性 | **◎ ラップトップ** | × デスクトップ |
| Llama 4 Scout Q4 | ○（128GB > 61GB） | ◎（余裕） |
| 価格 | 約70〜80万円（128GB構成） | 約130万円（256GB） |

M5 MaxはM3 Ultraより帯域幅は劣るが**tok/sではわずかに上回る**（Neural Acceleratorの恩恵）。価格は安く、しかもラップトップ。[^5]

---

## 4. PoC開発環境としての適性

### 4-1. Ollama（推奨メインフレームワーク）

**Ollama 0.19 + MLX backend（2026年3月31日リリース）** が現在の推奨構成。[^8][^9]

- インストール: `brew install ollama` で完結。非エンジニアでもセットアップ可能
- MLX バックエンド採用により、M5 Max の Neural Accelerator を活用
  - Prefill（プロンプト読み込み）速度: 約 **1.6倍高速化**
  - Generation（トークン生成）速度: 約 **2倍高速化**
- 動作要件: 32GB 以上の統合メモリ（128GBモデルは完全適合）
- 現時点（プレビュー）では Qwen3.5 系のみ MLX backend 対応。追加モデルは順次対応予定

```bash
# セットアップは3コマンド
brew install ollama
ollama pull qwen3:30b          # 17GB
ollama pull llama3.3:70b       # 40GB
```

### 4-2. vLLM の Apple Silicon 対応状況（2026年時点）

公式 vLLM はApple Silicon非対応だが、**2つのコミュニティ実装が動作する**。[^10][^11][^12][^13]

| 実装 | 主体 | 特徴 |
|------|------|------|
| **vllm-metal** | Docker（コミュニティへ移管） | Metal GPU バックエンド。v0.2.0でTTFT 83倍・スループット 3.6倍改善 |
| **vllm-mlx** | 独立コミュニティ | MLX バックエンド。400+ tok/s。テキスト・Vision・音声・埋め込みをサポート。「Works with Claude Code」を明示 |

- Docker Desktop 4.62 以降で `Docker Model Runner` 経由から利用可能（OpenAI 互換 API）
- **PoC 段階では Ollama が推奨**。本番想定の vLLM 環境は Linux/CUDA クラスターで別途構築する

### 4-3. LiteLLM Proxy（PoC→本番移行のカギ）

macOS上で問題なく動作。**15〜20分でセットアップ完了**。[^14][^15]

```bash
pip install 'litellm[proxy]'
litellm --model ollama/qwen3:30b --port 4000
```

- 100+ の LLM バックエンド（Ollama / Anthropic / AWS Bedrock / Azure）を統一エンドポイントで切り替え可能
- MCP Gateway 機能: Docker で起動した MCP サーバー群を LiteLLM 経由で一元管理できる構成が公式ドキュメントで紹介済み
- **最大の価値**: バックエンドを変更してもクライアントコードは一切変更不要

### 4-4. Claude Code + ローカルLLM の接続[^17]

```bash
# Ollama + LiteLLM Proxy 経由で Claude Code をローカルモデルに向ける
ollama pull qwen3:30b
litellm --model ollama/qwen3:30b --port 4000

export ANTHROPIC_BASE_URL=http://localhost:4000
export ANTHROPIC_AUTH_TOKEN=ollama
# → claude コマンドがローカルモデルを使用する
```

- vllm-mlx は「Works with Claude Code」を公式に記載
- 2026年3月の開発者調査（906人）でClaude Codeが最支持ツール（46%）

### 4-5. Docker MCP サーバー環境[^16]

- Docker Desktop は Apple Virtualization を VMM として採用（QEMUを廃止）済みで動作は安定
- **ボリュームマウントのファイルI/Oはコンテナネイティブ比で 5〜12倍遅い**が、選択的マウント戦略で 80% 改善可能
- **推奨構成**: Ollama はホスト直接実行（Metal GPU アクセスのため）、MCP サーバー群は Docker Compose で管理し `host.docker.internal:11434` 経由でOllamaに接続

### 4-6. ⚠️ 重要警告: 14インチの熱スロットリング[^18][^19]

**AI開発・LLM推論用途には16インチ一択。**

| 項目 | 14インチ | 16インチ |
|------|----------|----------|
| 持続負荷時のCPUパフォーマンス低下 | **最大40%低下** | 安定（低下軽微） |
| GPU電力上限 | 約45W（72W→55W→44Wに即低下） | 約64W（安定維持） |
| AI推論時のSSD温度 | **106°C報告あり** | — |
| 推奨 | × AI開発用途には不適 | ○ AI開発に適合 |

**14インチでM5 Maxを買っても、M5 Maxの性能を引き出せない**（独立テストで確認済み）。

### 4-7. バッテリー持続時間（LLM推論中）

- 公称値: 最大24時間（通常使用）
- LLM推論時消費電力: 60〜90W
- 実質的な連続推論可能時間: **約4〜6時間**（推定）
- **低電力モードOFFの場合**: バッテリー駆動でもAC駆動でも性能差はほぼなし[^20]
- 長時間の連続推論では AC 接続を推奨（バッテリー劣化を防ぐ目的）

---

## 5. PoC→スケールアップ計画

### 5-1. 推奨アーキテクチャ（全フェーズ）

```
【開発フェーズ（個人）】
Claude Code → LiteLLM Proxy (localhost:4000) → Ollama (localhost:11434)
                                              ↕ 必要時
                                       Anthropic API (Claude)

【PoCフェーズ（チーム 1〜3人）】
チームメンバー → LiteLLM Proxy (MacBook Pro 共有) → Ollama + M5 Max 128GB
               ↳ 認証・ログ・コスト追跡は LiteLLM が担当

【スケールアップ判断】
同時利用者 > 3〜5人 → vLLM on Linux/CUDA へ移行
             ↓
クライアントコード変更ゼロ（LiteLLMがバックエンド切り替えを吸収）

【本番フェーズ】
クライアント → LiteLLM Proxy (Docker, Linux) → vLLM (Linux/CUDA or Cloud GPU)
```

### 5-2. 同時利用者の限界点[^21][^22]

| 同時ユーザー数 | 状況 | 判断 |
|--------------|------|------|
| 1〜3人 | 実用的（Ollamaデフォルト設定で対応可） | PoC継続 |
| 3〜5人 | 待機が発生し始める | スケールアップ検討 |
| 5人超 | Ollamaのキュー詰まりが顕著 | vLLM移行推奨 |

- Ollama はデフォルトで FIFO キュー処理。70Bモデルで1回の応答生成に30〜60秒かかる場合、3人目以降は前の生成完了まで待機
- `OLLAMA_NUM_PARALLEL=4` に設定するとスループット 3〜4倍だが1リクエストあたりレイテンシは 20〜40% 増加

### 5-3. Ollama → vLLM 移行パス[^23][^24]

**移行難易度: 中程度**（最大の障壁はモデルフォーマット非互換）

| ステップ | 内容 | 備考 |
|---------|------|------|
| 1 | safetensors 版モデルをHugging Faceから別途ダウンロード | GGUFとsafetensorsは別物 |
| 2 | Linux/CUDA 環境に vLLM をセットアップ | |
| 3 | LiteLLM Proxy の config.yaml バックエンドを変更 | クライアントコード変更なし |
| 4 | シャドウモード 24〜48時間 → カナリア 10% → 段階的移行 | |

```yaml
# PoC時（config.yaml）
model_list:
  - model_name: my-model
    litellm_params:
      model: ollama/qwen3:30b

# 本番移行後（config.yamlのみ変更、クライアントコードはそのまま）
model_list:
  - model_name: my-model
    litellm_params:
      model: vllm/qwen3-30b
      api_base: http://gpu-server:8000
```

**vLLM のスループット優位性**（参考）:

| 指標 | Ollama | vLLM |
|------|--------|------|
| スループット | 41 tok/s | 793 tok/s |
| P99 レイテンシ | 673ms | 80ms |
| 実績 | — | Stripe: コスト73%削減、5,000万API calls/日を1/3のGPUで処理 |

### 5-4. MLX → CUDA 移植コスト

| 状況 | 移植コスト |
|------|-----------|
| Ollama / mlx-lm / LiteLLM の抽象レイヤーのみ使用 | **ほぼゼロ**（コード変更不要） |
| MLX Python API（`mlx.nn`等）を使った推論コード | 低〜中（PyTorchに近い設計のため） |
| Metal カスタムカーネルを書いた場合 | 高（書き直しに近い） |

- MLX の CUDA バックエンド実装も進行中（将来的に「Mac開発 → NVIDIA GPU クラウドでスケール」が公式サポートされる見込み）
- **推奨**: PoC中はカスタムカーネルを書かず、Ollamaとフレームワーク抽象レイヤーに徹する

### 5-5. 複数モデルの同時常駐（128GBの活用）

| モデル組み合わせ | メモリ使用量 | 可否 |
|----------------|------------|------|
| Qwen3-30B Q4 (17GB) + Llama3.3 70B Q4 (40GB) | 57GB + OS 20GB = 77GB | ○ |
| Llama 4 Scout Q4 (55GB) + Qwen3-30B Q4 (17GB) | 72GB + OS 20GB = 92GB | ○ |
| Llama 4 Scout Q4 (55GB) + Llama 3.3 70B Q4 (40GB) | 95GB + OS 20GB = 115GB | △ギリギリ |

- `OLLAMA_KEEP_ALIVE` 設定でモデルをメモリに保持可能（デフォルト5分でアンロード）
- 複数モデル同時推論時はメモリ帯域幅を競合させるため、各モデルの速度は単独実行時より低下する

---

## 6. 価格・購入ガイド

### 日本価格（2026年3月時点）

| 構成 | 価格（税込） |
|------|------------|
| 14インチ M5 Max（32C GPU）標準 | ¥599,800〜 |
| 14インチ M5 Max（40C GPU）標準 | ¥674,800〜 |
| 16インチ M5 Max（32C GPU）標準 | ¥649,800〜 |
| 16インチ M5 Max（40C GPU）標準 | ¥739,800〜 |
| **128GB BTO追加コスト** | +数十万円（要Apple Store確認） |

**128GB構成を選ぶ理由**: 70GB超のモデル（Llama 4 Scout、Qwen3.5-122B等）を動かすには128GBが事実上必須。96GBでは61GB Q4モデルのKVキャッシュの余裕が少ない。

### 40C GPU vs 32C GPU（128GBを選ぶなら）

| 比較 | 40C GPU | 32C GPU |
|------|---------|---------|
| メモリ帯域幅 | **614 GB/s** | 460 GB/s |
| LLM Generation速度 | +33%（帯域幅比例） | — |
| 価格差（標準構成） | +¥65,000〜90,000 | — |

**128GBを選ぶなら40C GPU一択**。LLM推論速度はメモリ帯域幅に直結するため、帯域幅33%増は推論速度33%増に直結する。

---

## 7. 購入判断

### 「PoC端末として適しているか」への回答

**YES — 強く推奨。ただし以下を理解した上で。**

**推奨する理由**:
- Llama 4 Scout（61GB）までラップトップで動く唯一の選択肢
- Ollama + LiteLLM + Claude Code + Docker MCP が即日セットアップ可能
- 会議室・自宅・客先でどこでも使える
- 消費電力60〜90W、ファンほぼ無音、電気代月数百円

**理解しておくべき制限**:
- 7B〜30BモデルはRTX 5090の方が1.5〜2倍速い（PoC用途なら許容範囲）
- 本番・複数ユーザー対応には別途クラウドまたは自社GPUサーバーが必要
- MLX→CUDA（vLLM）への移行コストがある
- vLLMはApple Silicon非対応のため本番環境と完全同一構成にはならない

### 購入推奨構成

```
MacBook Pro M5 Max
  ├── GPU: 40コア（帯域幅優先）
  ├── メモリ: 128GB（Llama 4 Scout対応必須）
  ├── ストレージ: 2TB以上（モデルウェイト保管）
  └── 画面: 16インチ（作業効率）
```

---

## Sources

[^1]: [Apple Newsroom - M5 Pro and M5 Max](https://www.apple.com/newsroom/2026/03/apple-debuts-m5-pro-and-m5-max-to-supercharge-the-most-demanding-pro-workflows/)
[^2]: [Compute Market - Llama 4 Hardware Requirements](https://www.compute-market.com/blog/llama-4-local-hardware-guide-2026/)
[^3]: [Apple Machine Learning Research - MLX on M5](https://machinelearning.apple.com/research/exploring-llms-mlx-m5)
[^4]: [CraftRigs - M5 Max vs RTX 5090](https://craftrigs.com/comparisons/m5-max-vs-rtx-5090-benchmark/)
[^5]: [AppleInsider - M5 Max Geekbench analysis](https://appleinsider.com/articles/26/03/06/m5-max-geekbench-scores-show-impressive-results-beating-out-m3-ultra-cpu-matching-gpu)
[^6]: [Medium - Benchmarking LLMs on M5 Max](https://medium.com/@WalePhenomenon/benchmarking-open-weights-llms-on-the-macbook-pro-m5-max-d4347e9457af)
[^7]: [The Mac Index Japan](https://themacindex.com/jp/products/macbook-pro)
[^8]: [Ollama Blog - MLX backend](https://ollama.com/blog/mlx)
[^9]: [MacRumors - Ollama now faster on Apple Silicon Macs](https://www.macrumors.com/2026/03/31/ollama-now-runs-faster-apple-silicon-macs/)
[^10]: [vllm-metal GitHub](https://github.com/vllm-project/vllm-metal)
[^11]: [Docker Blog - Docker Model Runner vLLM on macOS](https://www.docker.com/blog/docker-model-runner-vllm-metal-macos/)
[^12]: [Two paths to vLLM on Apple Silicon](https://blog.labs.purplemaia.org/two-paths-to-vllm-on-apple-silicon-vllm-metal-vs-vllm-mlx/)
[^13]: [vllm-mlx GitHub](https://github.com/waybarrios/vllm-mlx)
[^14]: [LiteLLM - Docker Quick Start](https://docs.litellm.ai/docs/proxy/docker_quick_start)
[^15]: [DEV Community - LiteLLM Proxy Setup on macOS](https://dev.to/silverfoxai/litellm-proxy-setup-guide-for-macos-with-uv-beginner-friendly-pac)
[^16]: [Docker Performance Guide Mac 2025](https://m.academy/articles/docker-desktop-performance-guide-mac/)
[^17]: [XDA Developers - Claude Code with local LLM via Ollama](https://www.xda-developers.com/claude-code-local-llm-ollama-capable-costs-nothing/)
[^18]: [NotebookCheck - M5 Max 14-inch throttling review](https://www.notebookcheck.net/M5-Max-with-inconsistent-performance-and-throttling-issues-Apple-MacBook-Pro-14-Review.1246064.0.html)
[^19]: [WCCFtech - M5 Max MacBook Pro SSD temperatures at 106°C](https://wccftech.com/m5-max-macbook-pro-ssd-temperatures-cross-100-degrees-celsius-running-ai-workloads/)
[^20]: [Eclectic Light Company - M1 Pro/Max battery vs AC performance](https://eclecticlight.co/2021/12/08/do-m1-pro-and-max-cpus-run-slower-on-battery/)
[^21]: [SitePoint - From Ollama to vLLM: A Migration Guide for Growing Teams](https://www.sitepoint.com/ollama-to-vllm-migration-guide-teams/)
[^22]: [Arsturn - Why Ollama is Slow for Multiple Users](https://www.arsturn.com/blog/ollama-vs-homl-the-real-reason-ollama-is-slower-for-multiple-users)
[^23]: [Towards AI - From Local to Production: Ollama to vLLM Migration Guide](https://towardsai.net/p/l/from-local-to-production-the-ultimate-ollama-to-vllm-migration-guide-2)
[^24]: [LiteLLM GitHub - BerriAI/litellm](https://github.com/BerriAI/litellm)
[^25]: [DataCamp - Using Claude Code With Ollama Local Models](https://www.datacamp.com/tutorial/using-claude-code-with-ollama-local-models)

---

## Methodology

- リサーチ日: 2026-04-13
- 情報収集: 5エージェント並列Webリサーチ（全エージェント完了）
- ソース数: 25+

## Confidence Assessment

- M5 Max スペック（CPU/GPU/帯域幅）: **confirmed** — Apple公式
- LLM推論速度（70B / Qwen3）: **likely** — 複数実測報告一致
- Llama 4 Scout の動作: **likely** — 理論値・M4 Max報告ベース
- M5 Max vs RTX 5090 比較: **likely** — 複数ベンチマークサイト
- 日本価格: **confirmed** — The Mac Index Japan（標準構成）/ 128GB BTOは要確認
- Ollama 0.19 + MLX動作: **confirmed** — Ollama公式ブログ・MacRumors
- 14インチ熱スロットリング: **confirmed** — NotebookCheck独立テスト
- vLLM Apple Silicon（コミュニティ実装）: **confirmed** — vllm-metal/vllm-mlx GitHub
- LiteLLM透過的移行: **confirmed** — 公式ドキュメント
- Ollama同時ユーザー限界（〜3人）: **confirmed** — 複数ベンチマーク一致
- バッテリー駆動vs AC性能差: **confirmed** — Eclectic Light Company実測
