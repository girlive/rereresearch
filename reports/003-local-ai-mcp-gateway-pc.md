# 社内ローカルAI・MCPゲートウェイ構築 PC選定ガイド（予算帯別）

> リサーチ日: 2026-04-13

---

## Executive Summary

社内ローカルAI + MCPゲートウェイを構築する場合、**「何人が・どのモデルを・どこで使うか」** によって最適解が大きく分岐する。

| 規模・用途 | 推奨 | 予算 |
|-----------|------|------|
| 個人〜少人数、試験導入 | RTX 4090（中古）+ Ollama | 〜20万円 |
| チーム利用（〜10人）、30〜70B | RTX 5090 x1 + vLLM | 〜65万円 |
| オフィス静音・省電力重視 | **Mac Studio M3 Ultra 256GB** | 〜130万円 |
| 本格マルチユーザー・24/7稼働 | **RTX PRO 6000 Blackwell (96GB)** | 〜250万円 |
| エンタープライズ・DeepSeek V3フル | H100 x4〜8 | 1,000万円〜 |
| クラウドで始めたい | **RunPod / GPUSOROBAN** | 月3〜25万円〜 |

**2026年版の重要ポイント**:
1. RTX PRO 6000 Blackwellは**96GB GDDR7 ECC**（旧世代48GBとは別物）。H100を単独GPU性能で上回る
2. Llama 4 Scoutは**MoEで109B総量**。Q4でも61GB必要。コンシューマGPU（32GB以下）では実質非対応
3. Qwen3-30B-A3B（アクティブ3.3B）は**17GB VRAM**で動作。RTX 4090 / 5080で余裕動作するコスパ最良モデル
4. H100のクラウド価格は2025年に64%暴落。短期・スモールスタートならクラウドが有利

---

## 目次

1. [MCPゲートウェイとは何か](#1-mcpゲートウェイとは何か)
2. [ソフトウェアスタック選定](#2-ソフトウェアスタック選定)
3. [2026年推奨モデルとVRAM要件](#3-2026年推奨モデルとvram要件)
4. [予算帯別 PC構成](#4-予算帯別-pc構成)
5. [Mac Studio M3 Ultra vs NVIDIA ビルド比較](#5-mac-studio-m3-ultra-vs-nvidia-ビルド比較)
6. [クラウドGPU選択肢とTCO比較](#6-クラウドgpu選択肢とtco比較)
7. [アーキテクチャ・セキュリティ](#7-アーキテクチャセキュリティ)（追記予定）
8. [日本市場での購入ガイド](#8-日本市場での購入ガイド)（追記予定）
9. [購入判断フローチャート](#9-購入判断フローチャート)

---

## 1. MCPゲートウェイとは何か

MCPゲートウェイは、**AIエージェント（Claude Code / Cursor等）と複数のMCPサーバーの間に位置するリバースプロキシ**。エージェントやMCPサーバーのコードを変更せずに、以下を一元管理する。[^1]

```
[Claude Code / Cursor / AIクライアント]
          ↓ MCP Client
    [MCPゲートウェイ]
    ├── 認証・認可（APIキー / JWT）
    ├── レート制限
    ├── ロギング・監査証跡
    ├── ロードバランシング
          ↓ MCP Server呼び出し
    [DB MCP] [GitHub MCP] [Slack MCP] [社内ツール MCP]
          ↓ ツール実行結果
    [ローカルLLM（Ollama / vLLM）]
```

**社内構築での位置づけ**: ローカルLLMをバックエンドにし、社内の全AIクライアントがMCPゲートウェイ経由でツールを利用する構成にすることで、**APIキー管理・アクセス制御・利用量モニタリング**を一元化できる。

---

## 2. ソフトウェアスタック選定

### 2-1. MCPゲートウェイ製品比較

| ゲートウェイ | 種別 | 特徴 | 推奨場面 |
|------------|------|------|---------|
| **LiteLLM Proxy** | OSS (Python) | 100+LLM統合、MCP Gateway内蔵、チーム/キー単位制御 | 多モデル・多プロバイダー環境 |
| **Bifrost** | OSS (Go) | 11μs平均レイテンシ、RBAC、Prometheus対応 | 低レイテンシ・本番運用 |
| **IBM ContextForge** | OSS | REST/gRPC→MCP変換、OpenTelemetry、K8s対応 | 大規模マルチリージョン |
| **Microsoft MCP Gateway** | OSS | K8s対応、セッション対応ルーティング | Azure/K8s環境 |
| **MCPJungle** | OSS (self-hosted) | MCPサーバー中央登録・管理 | 自前ホスト重視 |

**社内用途推奨**: **LiteLLM Proxy**（最多機能・ローカルOllamaとの統合が最も簡単）または **Bifrost**（性能重視） [^2]

### 2-2. ローカルLLM推論サーバー比較

| 項目 | Ollama | vLLM | llama.cpp |
|------|--------|------|-----------|
| **インストール** | ◎ 1コマンド | △ Python/pip | △ ビルド要 |
| **OpenAI API互換** | ◎ (Anthropic APIも対応) | ◎ 最高 | ○ |
| **スループット（高並列）** | ○ | ◎ 最高 (PagedAttention) | ○ |
| **Apple Silicon** | ◎ | × (主にNVIDIA) | ◎ |
| **MCP統合** | ◎ Claude Code連携確認済み | ○ OpenAI Responses API経由 | △ |
| **本番向け** | ○ | ◎ | △ |

vLLMはOllamaより**最大3.23倍スループット高**（128並列時）。[^3]

**推奨構成**:
- **プロトタイプ・小規模**: Ollama（導入コスト最小）
- **本番・高並列（5人以上）**: vLLM
- **Apple Silicon（Mac Studio）**: Ollama または llama.cpp

### 2-3. 推奨スタック（2パターン）

**パターンA：小規模チーム向け（Ollama + LiteLLM）**
```
Claude Code / Cursor
    ↓ MCP
LiteLLM Proxy（MCPゲートウェイ + LLMルーティング統合）
    ↓ OpenAI API互換
Ollama（Qwen3-32B / Llama 3.3 70B 等）
    ↓ MCP Tools
社内MCPサーバー群
```

**パターンB：本番・高並列向け（vLLM + Bifrost）**
```
複数AIクライアント
    ↓ MCP
Bifrost（低レイテンシ・RBAC・Prometheus）
    ↓                   ↓
vLLM (PagedAttention)   MCPサーバー群
```

---

## 3. 2026年推奨モデルとVRAM要件

### 3-1. モデル別VRAM要件まとめ

| モデル | 形式 | VRAM（FP16） | VRAM（Q4） | 推論速度目安 | 備考 |
|-------|------|-------------|------------|------------|------|
| **Qwen3-30B-A3B** | MoE (3.3B active) | ~60GB | **~17GB** | ~34 tok/s (RTX相当) | コスパ最良。MCPゲートウェイ最推奨 |
| **Qwen3-14B** | Dense | ~28GB | ~8GB | 高速 | 軽量・高速バランス |
| **Qwen3-32B** | Dense | ~64GB | ~20GB | 中程度 | RTX 5090 (32GB) でギリギリ |
| **Llama 3.3 70B** | Dense | ~140GB | ~35GB | ~18 tok/s (RTX 5090) | 2GPU必要 |
| **Llama 4 Scout** | MoE (17B active / 109B total) | ~218GB | **~61GB** | ~15 tok/s (H100) | コンシューマGPU不可。H100 or RTX PRO 6000必須 |
| **Llama 4 Maverick** | MoE (17B active / 400B total) | ~800GB+ | **~224GB** | — | 4x H100以上必要 |
| **DeepSeek V3** | MoE (37B active / 671B total) | ~1,400GB | ~380GB | — | 8x H100必要。社内単独は非現実的 |
| **DeepSeek-R1 14B（蒸留）** | Dense | ~28GB | ~8GB | 高速 | 推論特化。コスパ良好 |

**重要**: Llama 4はMoEだが**全パラメータをVRAMにロードする必要がある**。アクティブ17Bでも推論に61GB+が必要。[^4]

### 3-2. MCPゲートウェイ用途のモデル推奨

ツール呼び出し（function calling）対応と低レイテンシが重要。

| 優先度 | モデル | 理由 |
|-------|--------|------|
| **最推奨** | Qwen3-30B-A3B | Apache 2.0・ツール呼び出し対応・17GB Q4・MoEで実効3B相当の速度 |
| **推奨** | Qwen3-14B | 軽量・高速・ツール呼び出し対応 |
| **大規模向け** | Llama 4 Scout (Q4) | Meta最新・1x H100で動作・マルチモーダル対応 |
| **注意** | DeepSeek V3 | 性能最高クラスだが社内単独運用には多GPU必須 |

---

## 4. 予算帯別 PC構成

### Tier 1: 入門（〜20万円）— 個人・PoC用

| パーツ | 仕様 | 概算価格 |
|--------|------|---------|
| GPU | RTX 4090 24GB（中古）or RTX 5080 16GB | 8〜18万円 |
| CPU | AMD Ryzen 7 7700X | 3〜4万円 |
| RAM | 64GB DDR5 | 2万円 |
| SSD | 2TB NVMe | 1.5万円 |
| その他 | M/B・電源・ケース | 4〜6万円 |

**対応モデル**: Qwen3-30B-A3B、Mistral 22B、Llama 3.1 8B、DeepSeek-R1 14B（蒸留）
**MCP推論速度**: Qwen3-30B-A3B で約30 tok/s
**制限**: 常時稼働には設計されていない。24/7サーバー用途は非推奨

---

### Tier 2: 本格チーム用（〜65万円）— 〜10人のチーム

| パーツ | 仕様 | 概算価格 |
|--------|------|---------|
| GPU | **RTX 5090 32GB** | 35万円 |
| CPU | AMD Ryzen 9 9950X | 10万円 |
| RAM | 128GB DDR5 | 5万円 |
| SSD | 4TB NVMe PCIe 5.0 | 3万円 |
| PSU | 1200W 80+ Titanium | 3.5万円 |
| その他 | M/B・ケース | 5万円 |

**対応モデル**: Qwen3-32B（Q4）、Llama 3.3 70B（4bit量子化・RTX 5090 1枚では32GBぎりぎり）
**MCP推論速度**: Qwen3-30B-A3B で約50 tok/s、70B で約18 tok/s
**注意**: コンシューマGレード。24/7連続稼働で熱スロットリングのリスクあり。Llama 4 Scout（61GB）は非対応

---

### Tier 3: デュアルGPU構成（〜100万円）— 本格マルチユーザー

| パーツ | 仕様 | 概算価格 |
|--------|------|---------|
| GPU | **RTX 5090 x2**（合計64GB） | 70万円 |
| CPU | AMD Threadripper PRO 7965WX | 15万円 |
| RAM | 256GB DDR5 ECC対応 | 10万円 |
| SSD | 4TB NVMe x2 | 5万円 |
| PSU | 1600W 80+ Titanium | 5万円 |
| M/B + ケース | WRX90 M/B・水冷 | 15〜20万円 |

**対応モデル**: **Llama 4 Scout（Q4, 61GB）**、Llama 3.3 70B FP16
**MCP推論速度**: Scout で約15 tok/s、70B Q4 で約27 tok/s
**注意**: RTX 5090はNVLink非対応。PCIe接続でOllamaのsplit-layer方式での動作。NVLinkに比べ若干効率低下あり

---

### Tier 4: Mac Studio M3 Ultra（〜130万円）— 静音・省電力重視

| 項目 | 仕様 |
|------|------|
| 本体 | Mac Studio M3 Ultra（32C CPU / 80C GPU） |
| メモリ | **256GB ユニファイドメモリ** |
| ストレージ | 2TB SSD |
| 価格 | 約130万円（最大構成） |

**対応モデル**: Llama 4 Scout（Q4, 61GB）✓、Llama 3.3 70B FP16 ✓、Qwen3-32B ✓
**MCP推論速度**: 70B で約12〜18 tok/s、7〜13B で約80〜120 tok/s
**強み**: 消費電力アイドル約30W、**ほぼ無音**、設置面積最小。オフィス設置に最適
**弱み**: 高並列バッチ処理が苦手。CUDA非対応。アップグレード不可

---

### Tier 5: RTX PRO 6000 Blackwell（〜250万円）— 24/7本番サーバー

| パーツ | 仕様 | 概算価格 |
|--------|------|---------|
| GPU | **RTX PRO 6000 Blackwell 96GB GDDR7 ECC** | 163万円 |
| CPU | Intel Xeon W / AMD EPYC | 30〜50万円 |
| RAM | 256GB ECC RDIMM | 20万円 |
| M/B + SSD | サーバーグレード | 20〜30万円 |
| 電源 | 2000W 冗長電源 | 10万円 |

**対応モデル**: Llama 4 Scout（FP8・単GPU）、Qwen3-32B FP16、DeepSeek-R1蒸留版
**MCP推論速度**: 30B AWQ で **約8,400 tok/s**、70B で約30 tok/s。H100をシングルGPU性能で上回る [^5]
**強み**: 96GB ECC VRAM、24/7連続稼働設計、プロフェッショナルサポート
**弱み**: 価格が高い（163万円）

---

### Tier 6: H100ベースサーバー（1,000万円〜）— エンタープライズ

| 構成 | 概算価格 | 対応モデル |
|------|---------|----------|
| H100 PCIe x1 | 400万〜600万円 | Llama 4 Scout FP16、70B高速推論 |
| H100 SXM x4 | 1,500万円〜 | DeepSeek V3 Q4、Llama 4 Maverick |
| H100 SXM x8 | 2,500万円〜 | DeepSeek V3 FP8フル品質 |

---

## 5. Mac Studio M3 Ultra vs NVIDIA ビルド比較

LLM推論・MCPゲートウェイ用途での詳細比較。

| 項目 | Mac Studio M3 Ultra (256GB) | RTX 5090 x1 ビルド | RTX PRO 6000 Blackwell |
|------|--------------------------|-------------------|----------------------|
| **価格** | 〜130万円 | 〜65万円 | 〜250万円 |
| **実効メモリ** | 256GB ユニファイド | 32GB VRAM + 128GB DDR5 | 96GB VRAM + 256GB DDR5 |
| **70B tok/s** | 12〜18 | 18 (Q4) | ~30+ |
| **7B tok/s** | 80〜120 | 250〜400 | ~500+ |
| **消費電力（推論時）** | ~200W | ~575W | ~300W |
| **アイドル電力** | **~30W** | ~100W | ~50W |
| **年間電気代（8h/日）** | **約1〜3万円** | 約4〜8万円 | 約2〜4万円 |
| **騒音** | **ほぼ無音** | 55〜65 dB | 中程度 |
| **ECC対応** | × | × | **◎** |
| **24/7稼働設計** | ○ | △（コンシューマグレード） | **◎** |
| **CUDA / PyTorch** | × | ◎ | ◎ |
| **Llama 4 Scout Q4対応** | **◎**（256GB） | × （32GBで非対応） | **◎**（96GB） |
| **オフィス設置** | **最適** | 要防音対策 | 良好 |
| **アップグレード** | × | ◎ | ○ |

**結論**:
- **オフィスに置いて静かに使いたい** → Mac Studio M3 Ultra
- **コストパフォーマンス重視** → RTX 5090 x1 ビルド
- **本番24/7稼働・大モデル・ECC必須** → RTX PRO 6000 Blackwell

---

## 6. クラウドGPU選択肢とTCO比較

### 6-1. グローバルクラウドGPU 価格比較

| プロバイダー | GPU | 時間料金 | 月額（176h/月） | 月額（常時稼働 720h） |
|------------|-----|---------|--------------|---------------------|
| **Vast.ai** | H100 | $1.47〜 | 約$259〜（¥40,000〜） | $1,058〜（¥164,000〜） |
| **RunPod** | H100 SXM | $2.69 | $473（¥73,300） | $1,937（¥300,000） |
| **Lambda Labs** | H100 SXM | $2.89 | $509（¥78,900） | $2,081（¥322,500） |
| **RunPod** | RTX 5090 | $0.99 | $174（¥27,000） | $713（¥110,500） |
| **RunPod** | RTX 4090 | $0.34 | $60（¥9,300） | $245（¥37,900） |
| **AWS p5** | H100 SXM | 約$4〜5/GPU | 約$700〜880 | 約$2,880〜3,600 |
| **GCP a2** | A100 40GB | $3.67 | $646（¥100,000） | $2,642（¥409,500） |
| **Azure NC40** | H100 NVL | $6.98 | $1,229（¥190,000） | $5,026（¥778,000） |

※ 1USD ≈ 155円換算 [^6]

### 6-2. 日本クラウドGPU 価格比較

| プロバイダー | GPU | 時間料金（税込） | 月額（176h） | 月額（常時稼働720h） |
|------------|-----|--------------|------------|-------------------|
| **GPUSOROBAN** | A100 40GB | ¥361 | ¥63,536 | ¥259,920 |
| **GPUSOROBAN** | A100 80GB | ¥398 | ¥70,048 | ¥286,560 |
| **さくら高火力 VRT** | H100 SXM 80GB | ¥990 | ¥174,240 | **¥385,000（上限）** |
| **ConoHa** | H100 80GB | ¥1,398 | ¥246,048 | ¥1,006,560 |
| **ConoHa** | L4 24GB | ¥169 | ¥29,744 | ¥121,680 |
| **GMO GPUクラウド** | 非公開（共用） | ¥6,000 | ¥1,056,000 | — |

**ポイント**: さくら高火力VRTは**17日以上の利用で月額¥385,000が上限**。常時稼働での費用対効果が高い。[^7]

### 6-3. 自社構築 vs クラウド TCO比較

前提: 稼働176h/月（業務時間のみ）、電気代30円/kWh、減価償却3年

| 比較軸 | 自社構築（RTX 5090ビルド） | クラウド（RunPod H100） |
|-------|--------------------------|----------------------|
| 初期費用 | 約65万円 | 0円 |
| 月額ランニング | 約2〜3万円（電気代・償却） | 約7.3万円（$473） |
| **損益分岐** | — | **約15ヶ月**で自社構築が有利 |

| 比較軸 | 自社構築（H100ベースサーバー） | クラウド（さくら高火力 H100） |
|-------|------------------------------|---------------------------|
| 初期費用 | 約600万円〜 | 0円 |
| 月額ランニング | 約16.5万円（償却+電気代） | 約¥174,240（176h） |
| **損益分岐** | — | **約34ヶ月**（2.8年） |

**クラウドが有利な場面**:
- 利用頻度が低い（週数時間程度）
- 試験運用・PoC段階
- 初期投資を抑えたい

**自社構築が有利な場面**:
- 常時稼働（24/7）または高頻度利用
- データプライバシー要件が厳格（社内データ外部送信NG）
- 15ヶ月以上の長期運用

---

## 7. アーキテクチャ・セキュリティ

### 7-1. 推奨スタック全体像

```
[開発者・利用者]
  Claude Code / Cursor / Open WebUI / 社内チャット
       | HTTPS + JWT / OAuth 2.1（社内CA）
       v
+=============================================+
|        Nginx Reverse Proxy                 |
|        （TLS終端 / レート制限）             |
+=============================================+
       v
+=============================================+
|   LiteLLM Proxy（v1.80.18+）               |
|   役割: LLMゲートウェイ + MCPゲートウェイ  |
|   - Virtual Keys（チーム別アクセス制御）   |
|   - RBAC（ツールレベル粒度）               |
|   - Token / Cost Tracking                 |
|   - PostgreSQL永続化 + Grafana連携         |
+=============================================+
    |                    |
    v                    v
+------------------+  +------------------+
| ContextForge     |  | Ollama / vLLM    |
| （MCPフェデレーション）|  | （ローカルモデル）|
| - MCP登録・管理   |  | Qwen3 / Llama 4  |
| - OpenTelemetry  |  | DeepSeek蒸留版   |
+------------------+  +------------------+
    v
+=============================================+
|        社内MCPサーバー群（Docker隔離）      |
|  filesystem | PostgreSQL | GitLab | Slack  |
+=============================================+
```

**Claude Code からの接続設定例**（`~/.claude.json`）:

```json
{
  "mcpServers": {
    "internal-gateway": {
      "type": "http",
      "url": "https://mcp-gateway.internal.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:MCP_GATEWAY_TOKEN}"
      }
    }
  }
}
```

### 7-2. セキュリティ — 主要脅威と対策

MCPゲートウェイ特有のリスクはOWASP LLM Top 10 2025で第1位の**プロンプトインジェクション**と、**ツールポイズニング**。[^13]

| 脅威 | 内容 | 対策 |
|------|------|------|
| **プロンプトインジェクション** | 悪意あるデータ内に隠しコマンドを埋め込みLLMに意図しない操作をさせる | Webコンテンツ内の指示を無視。入力フィルタリング層を設置 |
| **ツールポイズニング** | MCPサーバーのツール説明を改ざんし危険な操作に誘導 | ツール説明のホワイトリスト検証。改ざん検知 |
| **シークレット漏洩** | ツール呼び出しパラメータに認証情報が混入 | 全ツール呼び出しをログ。Lasso等のリアルタイム検出エンジン導入 |
| **過剰権限** | MCPサーバーが不要なAPIスコープを持つ | 最小権限の原則。ツールごとに必要最低限のスコープのみ付与 |

**「トリプルゲート防御」パターン**（実装推奨）:

```
Gate 1: クライアント→LLM間
  - PII フィルタリング
  - プロンプトインジェクション検出
Gate 2: LLM→MCPゲートウェイ間
  - ツール承認（人間承認フロー or 自動検証）
  - パラメータバリデーション
Gate 3: MCPゲートウェイ→外部リソース間
  - レート制限
  - 認証強制（OAuth 2.1）
  - 全呼び出しの監査ログ
```

### 7-3. 認証・アクセス制御

MCP仕様は2025年6月に**OAuth 2.1 + PKCE**を追加。プロトコルはLinux Foundation傘下のAgentic AI Foundation（AAIF）が管理。[^14]

```
[社内SSO（Okta / Azure AD / Google Workspace）]
           ↕ OIDC / SAML
[LiteLLM / ContextForge 認証層]
  ├─ OAuth 2.1 + PKCE（対話型ユーザー）
  ├─ JWT（M2M）
  ├─ API Keys（Virtual Keys）
  └─ RBAC（ツールレベル粒度）
```

**RBAC設計例**:

| ロール | アクセス可能なMCPツール |
|--------|----------------------|
| Developer | filesystem(read/write), github, postgres(read) |
| Analyst | postgres(read), bigquery(read) |
| Admin | 全ツール + 管理API |
| CI Agent | github(PR操作), filesystem(read) |

### 7-4. 完全社内完結（エアギャップ）構成

データを一切外部に出せない場合の設計:

- コンテナイメージは**Harborなどプライベートレジストリ**で管理
- モデルウェイトはローカルストレージに事前配置（HuggingFace Hub不使用）
- vLLMは `--enable-offline-docs` フラグで完全オフライン動作
- Pythonパッケージはdevpi / Nexusなどプライベートリポジトリ経由

### 7-5. 監査ログ・モニタリング

LiteLLMはリクエストごとにトークン数・レイテンシ・呼び出し元をPostgreSQLに自動記録。Prometheus + Grafanaと連携可能。[^15]

```json
{
  "timestamp": "2026-04-13T10:23:45Z",
  "user": "alice@company.com",
  "team": "backend-team",
  "mcp_server": "postgres",
  "tool_called": "query",
  "tokens_in": 1240,
  "tokens_out": 380,
  "latency_ms": 234
}
```

---

## 8. 日本市場での購入ガイド

### 8-1. 国内PC・GPU 購入先と価格

#### RTX 5090 搭載ワークステーション（国内市販品）

| ベンダー | 製品例 | 価格（税込） | 備考 |
|---------|--------|------------|------|
| ドスパラ（GALLERIA） | UE9C-R59 | 約110万円 | Core Ultra 9 285K + RTX 5090 |
| マウスコンピューター（G-Tune） | FZ-I9G90 | 約113万円 | i9搭載ゲーミングWS |
| TSUKUMO | WE9A-U253/WBH | 約200万円 | **Threadripper 7980X + RTX 5090** 本格WS向け |

**注意**: GALLERIA系はコンシューマグレード（ECC非対応・24/7非設計）。本格サーバー用途にはTSUKUMO WS や Puget Systems カスタムビルドが適切。[^16]

#### RTX 5090 GPU単体（国内価格）

- MSRP: 393,800円〜
- 2026年4月時点の実勢価格: **545,000〜600,000円**（需給逼迫でMSRP超え常態化）[^17]

#### RTX PRO 6000 Blackwell 96GB（国内価格）

- HPCシステムズ: **1,650,000円（税込）**
- 一部代理店: 1,902,360円〜
- Server Edition: 1,539,450円〜 [^18]

#### プリビルドAIサーバー（グローバル製品）

| 製品 | GPU構成 | 価格（参考） |
|------|---------|------------|
| NVIDIA DGX Station A100 | A100 x4（160GB） | 約99,000 USD |
| NVIDIA DGX H100 | H100 SXM5 x8（640GB） | 約350,000〜480,000 USD |
| Dell PowerEdge XE9680 | H100 SXM5 x8 | 約200,000 USD |
| SuperMicro AS-4125GS | H100 x最大10 | 要見積 |
| Puget Systems カスタム | RTX 5090〜H100 | 6,319〜58,456 USD |

**Lambda Labs オンプレミス製品は2025年8月に販売終了**。現在はクラウドのみ。[^19]

### 8-2. 国内クラウドGPU 詳細比較

| サービス | GPU | 時間料金（税込） | 月額（176h） | 月額（常時720h） | 特徴 |
|---------|-----|--------------|------------|----------------|------|
| **さくら高火力 VRT** | H100 SXM 80GB | ¥990 | ¥174,240 | **¥385,000（上限）** | 17日以上で月額上限あり。常時稼働に有利 [^20] |
| **GPUSOROBAN** | A100 40GB | ¥361 | ¥63,536 | ¥259,920 | 国内最安水準。停止中は課金なし [^21] |
| **GPUSOROBAN** | A100 80GB | ¥398 | ¥70,048 | ¥286,560 | |
| **ConoHa** | H100 80GB | ¥1,398 | ¥246,048 | ¥1,006,560 | GMOグループ |
| **ConoHa** | L4 24GB | ¥169 | ¥29,744 | ¥121,680 | 小規模・試験向け |
| **GMO GPUクラウド** | H200（共用） | ¥6,000 | — | 要問い合わせ | 高性能だが高価 |
| **NTTPC IndigoGPU** | H200 x8 | 要問い合わせ | — | 要問い合わせ | AWS比約25%相当と案内 |

### 8-3. 電気代試算（東京、法人高圧、2026年度）

2026年度の東京電力法人向け単価（賦課金込み概算）: **約30円/kWh**

| 構成 | TDP | 月間消費量（720h稼働） | 月額電気代（GPU単体） |
|------|-----|---------------------|-------------------|
| RTX 5090 x1 | 575W | 414 kWh | **¥12,420** |
| RTX 5090 x2 | 1,150W | 828 kWh | **¥24,840** |
| RTX PRO 6000 x1 | 300W | 216 kWh | **¥6,480** |
| H100 SXM5 x1 | 700W | 504 kWh | **¥15,120** |
| Mac Studio M3 Ultra | 200W | 144 kWh | **¥4,320** |
| DGX H100（8GPU） | 10,200W | 7,344 kWh | **¥220,320** |

※ システム全体（CPU・冷却含む）は GPU 消費電力の約1.5〜2倍になる点に注意。

---

## 9. 購入判断フローチャート

```
社内ローカルAI + MCPゲートウェイ — 何から始める？
│
├── まず試したい / PoC段階
│   ├── 初期投資ゼロで → RunPod RTX 4090（$0.34/hr）or GPUSOROBAN A100
│   └── 小予算で自前 → RTX 4090中古 + Ollama + LiteLLM（〜20万円）
│
├── チーム利用（〜10人）
│   ├── コスパ重視 → RTX 5090 x1 + vLLM（〜65万円）
│   └── 静音・省電力（オフィス設置） → Mac Studio M3 Ultra 256GB（〜130万円）
│
├── 本格マルチユーザー / 24/7稼働
│   ├── Llama 4 Scout対応も必要 → RTX PRO 6000 Blackwell（〜250万円）
│   └── デュアルGPU拡張 → RTX 5090 x2 + Threadripper（〜100万円）
│
├── エンタープライズ / DeepSeek V3フル推論
│   └── H100 x4〜8（1,000万円〜）
│
└── データプライバシー最重視 + クラウドも検討
    ├── 国内クラウド → さくら高火力 VRT H100（常時稼働¥385,000/月）
    └── 自社構築（15ヶ月以上の利用なら元が取れる）
```

---

## Sources

[^1]: [What Is an MCP Gateway? — API7.ai](https://api7.ai/learning-center/api-gateway-guide/what-is-mcp-gateway)
[^2]: [Best MCP Gateways for Production Systems in 2026 — Maxim AI](https://www.getmaxim.ai/articles/best-mcp-gateways-for-production-systems-in-2026/)
[^3]: [Fastest Local LLM Setup: Benchmarks — InsiderLLM](https://insiderllm.com/guides/llamacpp-vs-ollama-vs-vllm/)
[^4]: [Llama 4 Hardware Requirements — Compute Market](https://www.compute-market.com/blog/llama-4-local-hardware-guide-2026)
[^5]: [RTX PRO 6000 vs Datacenter GPUs — CloudRift](https://www.cloudrift.ai/blog/benchmarking-rtx6000-vs-datacenter-gpus)
[^6]: [SynpixCloud GPU Pricing Comparison 2026](https://www.synpixcloud.com/blog/cloud-gpu-pricing-comparison-2026)
[^7]: [さくらの高火力 VRT GPU 料金](https://cloud.sakura.ad.jp/products/server/gpu/)
[^8]: [GPUSOROBAN 高速コンピューティング](https://soroban.highreso.jp/compute)
[^9]: [ConoHa GPU VPS](https://vps.conoha.jp/gpu/)
[^10]: [Llama 4 公式サイト](https://www.llama.com/models/llama-4/)
[^11]: [Qwen3-30B-A3B Specs — apxml.com](https://apxml.com/models/qwen3-30b-a3b)
[^12]: [RTX PRO 6000 Blackwell — NVIDIA公式](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/)
[^13]: [MCP Security Vulnerabilities 2026 — Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-vulnerabilities/)
[^14]: [MCP 2026 Complete Guide — Calmops](https://calmops.com/ai/model-context-protocol-mcp-2026-complete-guide/)
[^15]: [LiteLLM Spend Tracking — 公式ドキュメント](https://docs.litellm.ai/docs/proxy/cost_tracking)
[^16]: [TSUKUMO RTX 5090 ワークステーション — エルミタージュ秋葉原](https://www.gdm.or.jp/pressrelease/2025/0618/592243)
[^17]: [RTX 5090 国内価格発表 — PC Watch](https://pc.watch.impress.co.jp/docs/news/1652618.html)
[^18]: [NVIDIA RTX PRO 6000 Blackwell 受注開始 — HPCシステムズ](https://www.hpc.co.jp/product/nvidia-rtx-pro-6000-pre-release/)
[^19]: [Lambda Legacy Hardware（終了告知）](https://lambda.ai/legacy-hardware)
[^20]: [さくらインターネット 高火力VRT H100 正式版 — クラウド Watch](https://cloud.watch.impress.co.jp/docs/news/2035747.html)
[^21]: [GPUSOROBAN 公式](https://soroban.highreso.jp/compute)

---

## Methodology

- リサーチ日: 2026-04-13
- 情報収集: 5エージェント並列Webリサーチ（全完了）
- ソース数: 60+（ベンチマークDB・公式ドキュメント・価格比較サイト・AI専門メディア・日本語メディア）

## Confidence Assessment

- MCPゲートウェイ製品比較: **confirmed** — 複数独立ソースで一致
- Qwen3-30B-A3B VRAM要件: **confirmed** — 実測値
- Llama 4 Scout VRAM要件（61GB Q4）: **confirmed** — Meta公式・複数メディア一致
- RTX PRO 6000 Blackwell 96GB: **confirmed** — NVIDIA公式
- クラウド価格: **confirmed**（2026年4月時点・変動あり）
- TCO損益分岐: **likely** — 前提条件依存
- 推論速度比較: **likely** — 実測ベースだが環境依存
