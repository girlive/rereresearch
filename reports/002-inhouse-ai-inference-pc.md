# 社内AI推論マシン構築ガイド — 画像生成・動画生成に最適なPC構成

> リサーチ日: 2026-04-13

## Executive Summary

AI推論において NVIDIA GPU は依然として最強だが、「圧倒的に唯一の選択肢」から「最も成熟した選択肢」に変わりつつある。画像生成にはRTX 5090（32GB, ~$2,200）が最適解。動画生成は要件が二極化しており、軽量モデル（LTX-2.3, Wan2.2最適化版）ならRTX 5090で対応可能だが、プロダクション品質（Wan2.1フル, HunyuanVideo）にはH100クラス（80GB+）が必要。社内構築の予算は用途に応じて50万〜1,000万円と幅広い。**結論: 画像生成メインならRTX 5090搭載PC（約65万円）、動画生成も本格的にやるならH100搭載サーバー（300万円〜）を検討すべき。**

---

## 目次

1. [NVIDIAは本当に最強か？](#1-nvidiaは本当に最強か)
2. [GPU性能比較表](#2-gpu性能比較表)
3. [画像生成AIの要件](#3-画像生成aiの要件)
4. [動画生成AIの要件](#4-動画生成aiの要件)
5. [VRAM容量別にできること](#5-vram容量別にできること)
6. [予算帯別の推奨PC構成](#6-予算帯別の推奨pc構成)
7. [マルチGPU vs 単一GPU](#7-マルチgpu-vs-単一gpu)
8. [インフラ考慮事項](#8-インフラ考慮事項)
9. [購入判断フローチャート](#9-購入判断フローチャート)

---

## 1. NVIDIAは本当に最強か？

### 短い答え: Yes、ただし条件付き

NVIDIA は離散GPU市場の約92%を占有し、AI推論では圧倒的な地位にある。[^1] しかし競合も急速に追い上げている。

| ベンダー | 強み | 弱み | 2026年の状況 |
|---------|------|------|-------------|
| **NVIDIA** | CUDAエコシステム、モデル互換性、圧倒的性能 | 高価格、高消費電力 | Blackwell世代で性能4-5倍向上 [^2] |
| **AMD** | FP8でのコスト効率、MI355Xの価格性能比 | ROCmの成熟度、モデル互換性 | MI400（2026予定）で432GB HBM4 [^1] |
| **Intel** | 推論特化GPU開発中 | 現時点で最下位 | Crescent Island（160GB, 2026末サンプル）[^1] |
| **Apple Silicon** | 大容量統合メモリ（512GB） | GPU計算性能、CUDAなし | M3 Ultraで671Bモデル動作可能 |

**社内AI構築での結論**: NVIDIAを選ぶべき。理由は3つ: [^3]

1. **モデル互換性**: ほぼ全てのAIモデルがCUDA前提で開発されている
2. **ソフトウェア成熟度**: ComfyUI, vLLM, TensorRT等のツールチェーンが完備
3. **コミュニティ**: トラブルシューティング情報が圧倒的に多い

AMDは「わかっている人」がコスト最適化に使う選択肢。Intel は2026年時点では非推奨。

---

## 2. GPU性能比較表

### LLM推論速度（tok/sec）

| GPU | VRAM | 価格 | 30Bモデル | 70Bモデル | 備考 |
|-----|------|------|----------|----------|------|
| **RTX 5090** | 32GB | ~$2,200 | 4,570 | 1,230 (2枚) | コンシューマー最強 [^4] |
| **RTX 4090** | 24GB | ~$1,600 | 2,259 | 467 (2枚) | コスパ良好 [^4] |
| **RTX PRO 6000** | 48GB | ~$5,000 | 8,425 | 1,031 | 大モデルでコスト効率最高 [^4] |
| **RTX 4070 Ti** | 16GB | ~$800 | — | — | 入門用 |
| **H100 SXM5** | 80GB | ~$25,000 | — | — | エンタープライズ標準 |
| **B200** | 192GB | ~$40,000 | — | — | 次世代最強 [^2] |

### コスト効率（$/100万トークン）

| GPU構成 | 30Bモデル | 96Bモデル |
|---------|----------|----------|
| RTX 5090 x1 | $0.040 | — |
| RTX 4090 x1 | $0.048 | — |
| PRO 6000 x1 | $0.043 | $0.113 |
| RTX 5090 x4 | $0.061 | $0.156 |
| RTX 4090 x4 | — | $0.230 |

---

## 3. 画像生成AIの要件

### GPU別 画像生成速度

| GPU | FLUX 1画像 | SDXL (it/s) | 価格 | 消費電力 |
|-----|-----------|------------|------|---------|
| **RTX 5090** | ~7秒 | ~15 it/s+ | ~$2,200 | 587W peak |
| **RTX 4090** | ~10秒 | 20-30 it/s | ~$1,600 | 235W avg |
| **RTX 3090** | — | ~5 it/s | ~$800中古 | 350W |
| **RTX 5070 Ti** | — | — | ~$750 | — |

RTX 5090はFLUX生成でRTX 4090比**75%高速**。8Kアップスケーリングも唯一実用的。[^5]

### 画像生成に必要なVRAM

| モデル | 最低VRAM | 推奨VRAM |
|--------|---------|---------|
| Stable Diffusion 1.5 | 8GB | 12GB |
| SDXL | 12GB | 16GB |
| FLUX.1-dev | 12GB | 24GB |
| FLUX + ControlNet | 16GB | 24GB |
| 大規模バッチ処理 | 24GB | 32GB |

### 推奨: 社内画像生成マシン

**RTX 5090 x1 で十分**。32GB VRAMで全ての主要画像生成モデルがフル品質で動作する。複数人同時利用ならRTX 5090 x2のデュアルGPU構成でバッチ処理を並列化。

---

## 4. 動画生成AIの要件

### 重要: 動画生成の「二極化」

動画生成AIは画像生成と異なり、VRAM要件が**二極化**している。

#### Tier A: コンシューマーGPUで実行可能（12-32GB）

| モデル | 解像度 | VRAM | RTX 5090での生成時間 | 品質 |
|--------|--------|------|-------------------|------|
| **LTX-2.3** | 4K/15s | 16-32GB | 74秒 | Good |
| **Wan2.2 (14B, 最適化)** | 1080p/10s | 12-24GB | 28秒 | Good |
| **CogVideoX-1.5-5B** | 768p/10s | 24-32GB | 8-12分 | Moderate |
| **HunyuanVideo 1.5** | 720p/10s | 13.6-24GB | 29秒 (5080) | Good |
| **AnimateDiff** | 720p | 8-12GB | 17秒 (5070 Ti) | Basic |
| **SVD-XT** | 720p/25f | 10-16GB | 22秒 (5070 Ti) | Moderate |

ComfyUI NVFP4最適化（RTX 50シリーズ）でVRAM要件を**最大60%削減**可能。[^8]

#### Tier B: データセンターGPU必須（60-80GB+）

| モデル | 解像度 | VRAM | 推奨GPU | 品質 |
|--------|--------|------|---------|------|
| **Wan 2.1 フル (14B)** | 720p/5s | 65-80GB | H100 SXM5 | High |
| **HunyuanVideo (13B)** | 720p/5s | 60-80GB | H200 SXM | Highest |
| **Wan 2.1 (1080p)** | 1080p | 80GB+ | H100/H200 | High |

**60-80GBの壁**がコンシューマーとエンタープライズの分水嶺。[^9]

### 推奨: 社内動画生成マシン

- **カジュアル利用**: RTX 5090 x1 でWan2.2最適化版、LTX-2.3が動作
- **プロダクション品質**: H100 SXM5（80GB）が必要。予算300万円〜

---

## 5. VRAM容量別にできること

| VRAM | 画像生成 | 動画生成 | LLM推論 | 価格帯 |
|------|---------|---------|---------|--------|
| **8-12GB** | SD1.5, SDXL基本 | AnimateDiff, Wan2.1-1.3B | 7B以下 | 5-10万円 |
| **16GB** | SDXL高品質, FLUX基本 | SVD-XT, HunyuanVideo 1.5(最適化) | 13Bまで | 10-15万円 |
| **24GB** | FLUX + ControlNet, 大規模バッチ | Wan2.2最適化, CogVideoX | 30B-70B(量子化) | 20-30万円 |
| **32GB** | 全モデルフル品質, 8K | LTX-2.3 4K, Wan2.2フル | 70B(4bit) | 30-40万円 |
| **48GB** | — | より大きなバッチ | 70B(高品質量子化) | 50-80万円 |
| **80GB+** | — | Wan2.1フル, HunyuanVideo | 100B+ | 300万円〜 |

---

## 6. 予算帯別の推奨PC構成

### Tier 1: 入門（~20万円 / ~$1,200）

| パーツ | 構成 | 概算価格 |
|--------|------|---------|
| GPU | RTX 5060 Ti 16GB | 7.5万円 |
| CPU | AMD Ryzen 5 7600 | 3万円 |
| RAM | 32GB DDR5 | 1.5万円 |
| SSD | 1TB NVMe | 1.2万円 |
| PSU | 750W 80+ Gold | 1.5万円 |
| ケース+その他 | — | 3万円 |

**できること**: SD1.5/SDXL画像生成、AnimateDiff動画、7Bクラス LLM
**できないこと**: FLUX高品質、本格的な動画生成、大規模LLM

### Tier 2: 本格運用（~40万円 / ~$2,500）

| パーツ | 構成 | 概算価格 |
|--------|------|---------|
| GPU | RTX 5080 24GB | 18万円 |
| CPU | AMD Ryzen 9 9900X | 7万円 |
| RAM | 64GB DDR5 | 2.5万円 |
| SSD | 2TB NVMe PCIe 5.0 | 2.5万円 |
| PSU | 1000W 80+ Platinum | 2.5万円 |
| ケース+その他 | — | 4万円 |

**できること**: FLUX画像生成、Wan2.2 1080p動画(38秒)、HunyuanVideo 720p、30Bクラス LLM
**できないこと**: プロダクション品質動画、フルサイズLLM

### Tier 3: プロフェッショナル（~65万円 / ~$4,300）

| パーツ | 構成 | 概算価格 |
|--------|------|---------|
| GPU | **RTX 5090 32GB** | 35万円 |
| CPU | AMD Ryzen 9 9950X | 10万円 |
| RAM | 128GB DDR5 | 5万円 |
| SSD | 4TB NVMe PCIe 5.0 | 4.5万円 |
| PSU | 1200W 80+ Titanium | 3.5万円 |
| ケース+その他 | — | 5万円 |

**できること**: 全画像生成モデル最高品質、LTX-2.3 4K動画(74秒)、Wan2.2 1080p(28秒)、70Bクラス LLM(4bit)
**社内画像生成メインならこれがベストバランス**

### Tier 4: デュアルGPU（~100万円）

| パーツ | 構成 | 概算価格 |
|--------|------|---------|
| GPU | **RTX 5090 x2** | 70万円 |
| CPU | AMD Threadripper 7960X | 12万円 |
| RAM | 256GB DDR5 | 10万円 |
| SSD | 8TB NVMe | 8万円 |
| PSU | 1600W 80+ Titanium | 5万円 |
| マザーボード（TRX50） | — | 8万円 |

**できること**: H100単体を上回る推論性能 [^6]、64GB合計VRAMで大規模モデル対応、複数ユーザー同時利用
**社内AIサーバーとして複数人共有に最適**

### Tier 5: エンタープライズ（300万円〜）

| パーツ | 構成 | 概算価格 |
|--------|------|---------|
| GPU | **H100 SXM5 80GB** | 250万円〜 |
| サーバー | Dell/HPE/Supermicro | 50万円〜 |

**できること**: 全動画生成モデルフル品質（Wan2.1, HunyuanVideo）、100B+モデル推論
**プロダクション品質の動画生成が必要なら必須**

### Tier 6: フルスケール（1,000万円〜）

- NVIDIA DGX Station (B200 x4) またはカスタムサーバー
- 複数H100/B200 + NVLink
- 社内AIチーム向けの共有インフラ

---

## 7. マルチGPU vs 単一GPU

| 項目 | 単一ハイエンドGPU | マルチGPU |
|------|-----------------|----------|
| **セットアップ** | 簡単 | 複雑（ドライバ、VRAM分割） |
| **画像生成** | 十分 | バッチ並列で2倍速 |
| **動画生成** | モデル次第 | VRAM合算で大モデル対応 |
| **LLM推論** | モデルサイズに制限 | テンソル並列で大モデル対応 |
| **NVLink** | — | RTX 5090: 非対応（PCIeのみ）[^10] |
| **コスト効率** | 高い | 通信オーバーヘッドで効率低下 |
| **電源・冷却** | 管理しやすい | 1200W+電源、エアフロー要設計 |

**推奨**: まず単一RTX 5090で始め、VRAM不足を感じたらデュアル構成に拡張。

---

## 8. インフラ考慮事項

### 電源

| GPU構成 | 推奨電源容量 | 備考 |
|---------|------------|------|
| RTX 5060 Ti x1 | 750W | 一般的なATX電源で対応 |
| RTX 5080 x1 | 1000W | — |
| RTX 5090 x1 | 1200W | ピーク587W [^6] |
| RTX 5090 x2 | 1600W | 専用回路推奨 |
| H100 x1 | サーバー用 | 700W TDP、200V給電推奨 |

### 冷却

- RTX 5090は**消費電力がRTX 4090の約2.5倍**（587W vs 235W）[^6]
- デュアルGPU構成ではケース内エアフローの設計が重要
- サーバーラック設置の場合は空冷/液冷の検討
- H100は液冷（SXM5）が一般的

### ネットワーク

- 社内サーバーとして運用する場合、10GbE以上推奨
- 複数ユーザーが同時にモデルを利用する場合、API サーバー（vLLM, ComfyUI API）構築
- 動画生成は大容量ファイルの送受信があるため帯域に注意

### 騒音

- RTX 5090デュアル構成はオフィス設置に不向き（サーバールーム推奨）
- RTX 5080以下の単体GPUならデスクサイド設置可能

---

## 9. 購入判断フローチャート

```
社内AIで何をしたい？
├── 画像生成のみ
│   ├── 1-2人利用 → Tier 3: RTX 5090 x1（65万円）
│   └── チーム利用 → Tier 4: RTX 5090 x2（100万円）
├── 画像生成 + 軽量動画生成
│   ├── Wan2.2最適化/LTX-2.3で十分 → Tier 3: RTX 5090 x1（65万円）
│   └── 複数モデル同時 → Tier 4: RTX 5090 x2（100万円）
├── プロダクション品質の動画生成
│   ├── Wan2.1フル/HunyuanVideo → Tier 5: H100（300万円〜）
│   └── 大規模・複数同時 → Tier 6: マルチH100（1,000万円〜）
├── LLM推論もやりたい
│   ├── 30B以下 → Tier 3で対応可能
│   ├── 70B → Tier 4のデュアルGPUで対応
│   └── 100B+ → Tier 5以上
└── まず試してみたい
    └── Tier 2: RTX 5080（40万円）で入門
```

---

## Sources

1. [^1]: [AMD vs NVIDIA AI Performance 2025 - sanj.dev](https://sanj.dev/post/amd-vs-nvidia-ai-workloads-performance-2025)
2. [^2]: [NVIDIA Blackwell InferenceMAX Benchmarks - NVIDIA Blog](https://blogs.nvidia.com/blog/blackwell-inferencemax-benchmark-results/)
3. [^3]: [Best GPU for AI: Practical Buying Guide 2026 - Fluence](https://www.fluence.network/blog/best-gpu-for-ai/)
4. [^4]: [RTX 4090 vs RTX 5090 vs RTX PRO 6000 Benchmark - CloudRift](https://www.cloudrift.ai/blog/benchmarking-rtx-gpus-for-llm-inference)
5. [^5]: [Best GPUs for Stable Diffusion, SDXL & FLUX - Tech Tactician](https://techtactician.com/best-gpu-for-stable-diffusion-sdxl-and-flux/)
6. [^6]: [RTX 5090 LLM Benchmarks - RunPod](https://www.runpod.io/blog/rtx-5090-llm-benchmarks)
7. [^7]: [AI Video Generation Consumer GPU Guide 2025 - Apatero](https://www.apatero.com/blog/consumer-gpu-video-generation-complete-guide-2025)
8. [^8]: [AI Video Generation 2026: RTX 5090 to Smart Setups - HostRunway](https://www.hostrunway.com/blog/ai-video-generation-2026-best-gpus-vram-guide-and-smart-setups-that-work/)
9. [^9]: [AI Video Generation GPU Guide - Spheron](https://www.spheron.network/blog/ai-video-generation-gpu-guide/)
10. [^10]: [AI Workstation Build Guide - LocalAI](https://localai.computer/learn/ai-workstation-guide)
11. [^11]: [生成AI向けPC 22選 - AI総合研究所](https://www.ai-souken.com/article/ai-generation-pc-introduction)
12. [^12]: [GPU比較 RTX4060〜5090 - SAKASA AI](https://sakasaai.com/nvidiagpu-abo/)
13. [^13]: [生成AI向けグラボの選び方 - 株式会社AX](https://a-x.inc/blog/ai-gpu/)
14. [^14]: [Top 12 NVIDIA GPUs for AI 2026 - Atlantic.Net](https://www.atlantic.net/gpu-server-hosting/top-nvidia-gpus-for-ai-training-and-inference/)
15. [^15]: [RTX 5090 vs 4090: Upgrade Guide for AI - Fluence](https://www.fluence.network/blog/rtx-5090-vs-4090/)

---

## Methodology

- リサーチ日: 2026-04-13
- 情報収集: WebSearch 6クエリ（日英）+ WebFetch 4ページの詳細取得
- ソース数: 15（ベンチマークDB、GPU比較サイト、AI専門メディア、日本語メディア）
- 確信度の基準:
  - **confirmed**: 複数の独立ソースで一致するベンチマークデータ
  - **likely**: 信頼できるメディアの単一ソース、または条件付きデータ
  - **uncertain**: 推測・将来予測

## Confidence Assessment

- GPU推論速度の比較: **confirmed** — CloudRift, RunPod等の実測ベンチマーク
- NVIDIA市場シェア: **confirmed** — 複数ソース一致
- 画像生成速度: **confirmed** — ComfyUIベンチマーク（再現可能）
- 動画生成VRAM要件: **confirmed** — Spheron, HostRunway等の実測値
- PC構成の価格: **likely** — 2026年4月時点の概算（為替・在庫で変動）
- M5/MI400等の将来製品: **uncertain** — 噂ベース
- 限界: クラウドGPU（Lambda, RunPod等）との比較は未調査。電気代の長期TCO分析は未実施。
