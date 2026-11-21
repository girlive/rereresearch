# Google Cloud Platform（GCP）2025〜2026 総合機能レポート

**調査日**: 2026-04-13  
**対象**: GCP 全サービス — コンピュート・AI/ML・データ分析・ストレージ・ネットワーク・セキュリティ・DevOps・インテグレーション  
**調査手法**: 5並列エージェントによる公式ドキュメント・リリースノート・公式ブログ精査

---

## 目次

1. [コンピュート・コンテナ](#1-コンピュートコンテナ)
2. [AI / ML](#2-ai--ml)
3. [データ分析・データベース](#3-データ分析データベース)
4. [ストレージ](#4-ストレージ)
5. [ネットワーク](#5-ネットワーク)
6. [セキュリティ・IAM・ゼロトラスト](#6-セキュリティiamゼロトラスト)
7. [DevOps・CI/CD](#7-devopscid)
8. [インテグレーション・メッセージング](#8-インテグレーションメッセージング)
9. [監視・運用](#9-監視運用)
10. [主要アーキテクチャパターン](#10-主要アーキテクチャパターン)

---

## 1. コンピュートコンテナ

### Compute Engine — マシンファミリー（2025〜2026）

| シリーズ | 用途 | 特徴 |
|---|---|---|
| **N4** | 汎用 | Intel Emerald Rapids、第4世代DDR5、Titaniumオフロード |
| **C4/C4A** | 計算集約 | C4A は Arm Ampere Altra、超高コスパ |
| **A3** (A100/H100) | GPU ML | NVIDIA H100 80GB × 8、InfiniBand 3.2Tbps |
| **A4** | GPU ML | NVIDIA H200 × 8、HBM3e 141GB、NVLink |
| **A4X** | GPU ML フラッグシップ | NVIDIA B200 (Blackwell) × 8、HBM3e 192GB × 8 |
| **G2** | GPU推論 | NVIDIA L4 × 1〜8 |
| **TPU v7 Ironwood** | TPU Pod | v5p比10倍性能、Google初の推論特化TPU |
| **TPU v6e Trillium** | TPU | v5e比4.7倍性能 |

**2025〜2026 主な更新**:
- A4・A4X (Blackwell GPU) がプレビュー提供開始
- TPU v7 Ironwood が Google Cloud Next 2025 で発表
- Spot VM の価格が最大91%割引（Preemptible VM を統合）
- Titanium オフロードチップ搭載により、ネットワーク・ストレージI/OをCPUからオフロード

**ソース**: [Google Cloud Next 2025 announcements](https://cloud.google.com/blog/topics/google-cloud-next/google-cloud-next-2025-announcements)

---

### GKE（Google Kubernetes Engine）

**2025〜2026 主な更新**:

| 機能 | ステータス | 概要 |
|---|---|---|
| **GKE Autopilot Spot** | GA | Autopilot でのSpotノード使用 |
| **節点自動プロビジョニング（NAP）強化** | GA | GPU/TPUノードの自動追加 |
| **GKE Enterprise** | GA | Fleet管理、Config Management、Policy Controller |
| **Cluster Gateway** | GA | マルチクラスター L7 ロードバランシング |
| **GKE Inference Gateway** | Preview | LLMワークロードの効率的ルーティング（vLLM対応） |
| **MCP Server for GKE** | GA | AIエージェントからGKEをMCP経由操作 |

**ソース**: [GKE release notes](https://cloud.google.com/kubernetes-engine/docs/release-notes)

---

### Cloud Run — サーバーレスコンテナ

**2025〜2026 主な更新**:

| 機能 | ステータス | 概要 |
|---|---|---|
| **GPU サポート（NVIDIA L4）** | GA | 推論ワークロードをサーバーレスで実行 |
| **Worker Pools** | GA | バックグラウンド処理・バッチ向けの常時起動型 |
| **Direct VPC Egress** | GA | VPC 内リソースへ直接アクセス |
| **Cloud Run Functions** | GA | Cloud Functions v2 が Cloud Run Functions に統合・改名 |
| **Streamable HTTP Transport** | GA | MCP サーバーのホスティングに最適 |
| **Sidecars** | GA | メインコンテナと並走するサイドカーコンテナ |

**MCP サーバーのホストとして最適**: Cloud Run の Streamable HTTP Transport が Anthropic MCP 仕様に準拠。認証は IAM で管理可能。

**ソース**: [Cloud Run release notes](https://cloud.google.com/run/docs/release-notes)

---

## 2. AI  ML

### Vertex AI — プラットフォーム全体

**2025〜2026 主な更新**:

| コンポーネント | ステータス | 概要 |
|---|---|---|
| **Gemini 2.5 Pro** | GA | 最高性能モデル、1Mトークンコンテキスト |
| **Gemini 2.5 Flash** | GA | コスト効率重視、高速推論 |
| **Model Garden** | GA | 200以上のモデル（Llama、Mistral、Gemma 等） |
| **Model Registry** | GA | モデルのバージョン管理・系譜追跡 |
| **Vertex AI Studio** | GA | GUIでのプロンプト開発・評価 |
| **Grounding with Google Search** | GA | Geminiの回答をリアルタイム検索でグラウンディング |
| **Vertex AI Evaluation** | GA | LLMの品質・安全性の定量評価 |

---

### Google Agent Development Kit（ADK）

GCP公式のエージェントフレームワーク（OSS）。

**主要特徴**:
- **MCP クライアント/サーバー両対応**: ADKエージェントがMCPツールを呼び出し、またはADKエージェント自体をMCPサーバーとして公開
- マルチエージェント協調（エージェント間の委譲・階層構造）
- Vertex AI Agent Engine でのマネージドデプロイ
- 組み込み評価フレームワーク

**公式 GCP MCP サーバー（2025年発表）**:

| MCP サーバー | 対象サービス |
|---|---|
| `@google-cloud/mcp-server-bigquery` | BigQuery |
| `@google-cloud/mcp-server-gke` | GKE |
| `@google-cloud/mcp-server-compute` | Compute Engine |
| `@google-cloud/mcp-server-maps` | Google Maps |

**ソース**: [Google ADK GitHub](https://github.com/google/adk-python) / [Google Cloud MCP Servers](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-mcp-servers)

---

### Gemini Code Assist（旧 Duet AI for Developers）

| 機能 | ステータス | 概要 |
|---|---|---|
| **Agent Mode** | GA（2025-10〜） | 複雑な多段タスクを計画→承認→実行フローで処理 |
| **MCP 対応** | GA | 既存 Tool Calling API は 2026年3月までに MCP 移行必須 |
| **Next Edit Predictions** | Preview | VS Code/IntelliJ で次の編集を予測 |
| **GitHub 統合** | GA | コードレビュー・PR 作成支援 |
| **Gemini 2.5 Pro/Flash** | GA | 全ユーザー層で最新モデルを使用 |

**ソース**: [Gemini Code Assist blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-code-assist-updates-google-io-2025/)

---

### TPU — トレーニング・推論インフラ

| 世代 | 特徴 | 用途 |
|---|---|---|
| **v7 Ironwood** | v5p比10倍性能、Google初の推論特化TPU | 大規模推論 |
| **v6e Trillium** | v5e比4.7倍性能 | トレーニング・推論 |
| **v5p** | HBM3、NVLink相当のICI | 大規模トレーニング |

**ソース**: [Google Cloud Next 2025 TPU announcements](https://cloud.google.com/blog/topics/google-cloud-next/google-cloud-next-2025-announcements)

---

## 3. データ分析データベース

### BigQuery — AI 統合と最新機能

**BigQuery AI 関数（2025年 GA）**:

| 関数 | 概要 |
|---|---|
| `AI.GENERATE` | SQL内からLLMテキスト生成 |
| `AI.EMBED` | ベクトル埋め込み生成 |
| `AI.IF` | 条件付き分類（例: スパム判定） |
| `AI.SCORE` | スコアリング |
| `AI.CLASSIFY` | 多クラス分類 |

**Vector Search**: BigQuery内でのベクトル類似検索が GA。埋め込みカラムに対してANN（近似最近傍）検索を実行。

**BigQuery AI** Gemini 2.5 Pro/Flash とネイティブ統合。BQML（BigQuery ML）でモデルトレーニング・評価・デプロイが SQL で完結。

**MCP Server for BigQuery**: AIエージェントが自然言語でBigQueryをクエリ可能。

**2025〜2026 その他更新**:
- Continuous Queries（ストリーミングデータへのSQL永続実行）が GA
- BigQuery Studio（Notebook + SQL + Spark 統合UI）が GA
- Biglake Metastore が GA（統合メタデータ管理）
- Physical Bytes Billing オプション（圧縮後バイトで課金）

**ソース**: [BigQuery release notes](https://cloud.google.com/bigquery/docs/release-notes) / [BigQuery AI functions](https://cloud.google.com/bigquery/docs/ai-functions)

---

### Cloud Spanner / Firestore / AlloyDB / Cloud SQL

| サービス | 2025〜2026 の主な更新 |
|---|---|
| **Cloud Spanner** | ベクトル検索 GA、MCP Server 提供、PostgreSQL 互換インターフェース強化 |
| **Firestore** | MongoDB 互換 API（ドキュメント DB として利用可能）、ベクトル検索 GA |
| **AlloyDB** | PostgreSQL 完全互換、行レベルTTL、pgvector によるベクトル検索 GA、MCP Server |
| **Cloud SQL** | MySQL 8.4 / PostgreSQL 16 対応、MCP Server、エディション選択（Enterprise Plus）|
| **Bigtable** | ベクトル検索 Preview、Autoscaling 強化 |
| **Memorystore for Redis** | Cluster モード GA、Vector Search Preview |

**ポイント**: 主要データベースサービス全てに **MCP Server** が提供され、AIエージェントからの自然言語アクセスが可能になった。

---

### データパイプライン・処理

| サービス | 2025〜2026 の主な更新 |
|---|---|
| **Dataflow** | Managed Beam（Java/Python）、Flex Templates GA、ML Transform |
| **Dataproc** | Lightning Engine（Spark実行高速化、4.3倍）、Dataproc on GKE |
| **Cloud Composer (Airflow)** | Airflow 3.1 対応、Private IP対応強化 |
| **Pub/Sub** | BigQuery直接書き込みサブスクリプション GA（Dataflow不要） |
| **Datastream** | CDC（Change Data Capture）でRDB→BigQuery/Spanner リアルタイム同期 |

---

## 4. ストレージ

### Cloud Storage

**ストレージクラスと価格（US リージョン・月額/GB）**:

| クラス | 保存コスト | 取り出しコスト | 最低保存期間 |
|---|---|---|---|
| Standard | $0.023 | 無料 | なし |
| Nearline | $0.010 | $0.01/GB | 30日 |
| Coldline | $0.004 | $0.02/GB | 90日 |
| Archive | $0.0012 | $0.05/GB | 365日 |

**2025〜2026 主な更新**:
- **Autoclass** が Hierarchical Namespace (HNS) バケットに対応（GA）— フォルダ構造対応バケットでもコスト自動最適化
- Autoclass のターミナルクラスに **Archive** を選択可能（従来は Nearline まで）
- Archive ストレージ（US/EU マルチリージョン）が $0.0040 → **$0.0024/GB に値下げ**
- Object Change Notification が **2026年1月30日廃止**（代替: Pub/Sub 通知）
- BigQuery からの Cloud Storage アクセス課金変更（2025年2月21日）

**ソース**: [Cloud Storage release notes](https://cloud.google.com/storage/docs/release-notes)

---

### Hyperdisk / Persistent Disk

**Hyperdisk ラインナップ**:

| 種別 | 特徴 | 向き |
|---|---|---|
| Hyperdisk Balanced | 汎用高性能、サブミリ秒レイテンシ | 一般ワークロード |
| Hyperdisk Balanced HA | ゾーン間同期レプリケーション（**2025年 GA**）| 高可用性DB |
| Hyperdisk Extreme | 超高IOPS | データベース |
| Hyperdisk Throughput | スループット重視 | ビッグデータ |

**2025〜2026 主な更新**:
- **Hyperdisk Balanced HA** が GA — ゾーン間同期レプリケーション（1ゾーン障害耐性）
- **非同期レプリケーション**が Balanced・Balanced HA・Extreme で利用可能
- **Storage Pools** — 複数ディスク間でプロビジョニング済みストレージを共有（コスト削減）

**ソース**: [Hyperdisk overview](https://cloud.google.com/compute/docs/disks/hyperdisks)

---

### Filestore（NFS）

**2025〜2026 主な更新**:
- **NFSv4.1 対応** — GKE CSI ドライバ経由（Zonal/Regional/Enterprise）
- **小容量インスタンス**（Regional: 100 GiB〜、1 GiB 単位）Restricted GA
- インスタンスレプリケーション GA
- 削除保護（Deletion Protection）GA
- カスタムパフォーマンス設定 GA

---

## 5. ネットワーク

### Cloud Load Balancing

| 種別 | 特徴 |
|---|---|
| Global External Application LB | Anycast IP、Google POP でのエッジ終端、HTTP/2・gRPC対応 |
| Regional External Application LB | 特定リージョンへの固定、プレミアム/スタンダードネットワーク選択可 |
| Internal Application LB | VPC内のL7 LB、Envoyベース |
| Network LB (passthrough) | TCP/UDP L4、クライアントIPを直接バックエンドへ |
| Internal TCP/UDP LB | VPC内L4 |

**2025〜2026 主な更新**:
- **Advanced Traffic Management** — ウェイトベースルーティング、フォールト注入、リトライポリシーが GA
- **mTLS サポート** — バックエンドへの相互TLS認証 GA
- **IPv6 外部ロードバランシング** — Global/Regional 外部LBで IPv6 GA
- **Weighted Round Robin** 強化

**ソース**: [Cloud Load Balancing release notes](https://cloud.google.com/load-balancing/docs/release-notes)

---

### Cloud Armor（WAF・DDoS対策）

**2025〜2026 主な更新**:

| 機能 | ステータス | 概要 |
|---|---|---|
| **階層型セキュリティポリシー** | GA | 組織・フォルダ・プロジェクトレベルで継承・上書き |
| **Adaptive Protection ML** | GA | DDoS攻撃の自動検知・ルール推奨 |
| **Custom Headers** | GA | バックエンドへのカスタムリクエストヘッダー挿入 |
| **Bot Management** | GA | reCAPTCHA Enterprise 統合によるBot対策 |
| **Advanced Network DDoS Protection** | GA | ネットワーク層DDoS対策 |
| **Rate limiting per region** | GA | リージョン別レート制限 |

**価格**: セキュリティポリシー $5/月 + ルール評価 $0.75/100万リクエスト〜

---

### Cloud CDN / Cloud DNS / Cloud NAT

**Cloud CDN 2025更新**:
- **Media CDN** — 大規模メディア配信向けの独立CDNサービス（YouTube基盤技術）
- Edge Cache + Cloud CDN の組み合わせでレイテンシ最小化

**Cloud NAT 2025更新**:
- VPC間通信サポート（Private-to-Private NAT）GA
- Dynamic Port Allocation GA
- Standard Tier 出力サポート GA
- TCP TIME_WAIT タイムアウト変更（2026年中に30秒がデフォルト）

**Cloud Interconnect / VPN**:
- Cross-Cloud Interconnect — GCP↔AWS/Azure の直接接続（GA）
- HA VPN スループット強化

---

## 6. セキュリティIAMゼロトラスト

### IAM / Workload Identity Federation

**2025〜2026 主な更新**:

| 機能 | ステータス | 概要 |
|---|---|---|
| **Workforce Identity Federation** | GA | 外部IdP（Okta/Azure AD/ADFS等）をGCPに統合 |
| **Workload Identity Federation** | GA | GCPサービスキー不要でAWS/Azure/GitHubアクションから認証 |
| **IAM Conditions** | GA | リソース属性・時間帯・IPアドレスで条件付きアクセス |
| **Deny Policies** | GA | 特定アクションを明示的に拒否するポリシー |
| **Privileged Access Manager** | GA | 期限付き特権昇格（JIT権限） |
| **Principal Access Boundary** | Preview | サービスアカウントのアクセス範囲を組織レベルで制限 |

---

### Cloud KMS — 鍵管理

**2025〜2026 主な更新**:
- **Cloud KMS Autokey** — 鍵の自動作成・バインドによりデフォルト暗号化を簡素化（GA）
- **KMS Post-Quantum KEM** — NIST ポスト量子暗号標準（ML-KEM/ML-DSA）サポート（Preview）
- **External Key Manager (EKM)** — オンプレミスHSM/外部KMSとの連携
- Cloud Storage / BigQuery / Compute Engine 全サービスで CMEK 対応

**ソース**: [Cloud KMS release notes](https://cloud.google.com/kms/docs/release-notes)

---

### BeyondCorp Enterprise — Zero Trust

**2025〜2026 主な更新**:

| 機能 | ステータス | 概要 |
|---|---|---|
| **Certificate-Based Access** | GA | mTLSによるデバイス証明書アクセス制御 |
| **Threat and Data Protection** | GA | DLPとスキャンをCloud Armorと統合 |
| **Access Context Manager** | GA | IP・デバイス・ユーザー属性ベースのアクセスポリシー |
| **Cloud IDS（侵入検知）** | GA | ネットワークトラフィック異常検知（Palo Alto Networks技術） |

**ゼロトラスト構成パターン**:
```
ユーザー → BeyondCorp EP（クライアント証明書）
         → Identity-Aware Proxy（IAP）
         → Access Context Manager（デバイス/IP/ユーザー検証）
         → Cloud Armor（WAF・DDoS）
         → アプリケーション（GKE/Cloud Run）
```

---

### Chronicle SIEM / Security Command Center

| サービス | 特徴 | 2025更新 |
|---|---|---|
| **Chronicle SIEM** | Google規模のログ分析、Gartner MQリーダー認定 | Gemini統合による自動脅威検知・調査 |
| **Security Command Center** | GCPリソース全体の脆弱性・脅威可視化 | AI-driven Risk Engine GA、Geminiによる脅威解説 |
| **Binary Authorization** | コンテナイメージの署名検証 | GKE/Cloud Run での継続的検証 GA |

---

## 7. DevOpsCID

### Cloud Build / Cloud Deploy / Artifact Registry

**Cloud Build 2025更新**:
- グローバル環境変数（全ビルドステップ共有）サポート
- CMEK コンプライアンス強化
- GitHub/Bitbucket/GitLab トリガー統合の継続強化

**Cloud Deploy 2025更新**:

| 機能 | ステータス |
|---|---|
| カナリーデプロイ（GKE・Cloud Run） | **GA** |
| 自動プロモーション（スケジュール時刻） | Preview |
| 失敗時自動ロールバック | Preview |
| デプロイブロックポリシー（時間帯指定） | Preview |
| Vertex AI モデルデプロイへの活用 | Preview |

**Artifact Registry 2025更新**:
- イメージプリウォーミング API（コールドスタートレイテンシ削減）
- シークレット検出の脆弱性スキャン強化
- Cloud KMS Autokey 統合
- Container Registry（GCR）は **2024年に非推奨**、Artifact Registry への移行必須

**Cloud Source Repositories**: 2024年6月17日から新規顧客に提供停止。後継は **Secure Source Manager**。

---

### Cloud Workstations

- Gemini Code Assist ネイティブ統合
- VS Code / JetBrains (IntelliJ, PyCharm, GoLand) サポート
- Gemini CLI からのエージェント支援コーディング（Terminal内）
- 集中管理IDEセキュリティポリシー

---

## 8. インテグレーションメッセージング

### Apigee API Management — MCP Proxy

**Apigee MCP Proxy**（2025年 Google Cloud Next 発表）:
- 既存 REST API を **コード変更なし** で MCP サーバーとして公開
- Claude Desktop / Gemini Code Assist / ADK エージェントから直接呼び出し可能
- OpenAPI Spec から MCP ツール定義を自動生成
- 認証はApigeeのOAuth/APIキー管理をそのまま流用

```
既存REST API
    → Apigee（MCP Proxy 設定）
    → MCPクライアント（Claude/Gemini Code Assist/ADK）
```

**ソース**: [Apigee MCP Proxy announcement](https://cloud.google.com/blog/products/api-management/apigee-mcp-proxy)

---

### Pub/Sub / Eventarc / Workflows

**Pub/Sub 2025更新**:
- **BigQueryサブスクリプション** GA — Dataflow不要でPub/Sub→BigQuery直接書き込み
- Simple Message Transform（SMT）— 軽量変換をサブスクリプション内で処理

**Eventarc 2025更新**:

| 機能 | ステータス |
|---|---|
| Eventarc Advanced（チャネルとバス） | GA |
| CloudEvents 形式での配信 | GA |
| GKE / Cloud Run / Workflows をターゲットに | GA |
| Cloud Audit Logs トリガー | GA |

**Workflows**:
- HTTP 呼び出し・並列ステップ・条件分岐・エラーハンドリングを YAML で定義
- Connectors（60以上のGCPサービスとの統合）GA
- Long-running jobs サポート（最大1年）

---

### Cloud Tasks / Cloud Scheduler

| サービス | 用途 | 2025更新 |
|---|---|---|
| **Cloud Tasks** | キューイング・タスク配信・重複排除 | HTTP ターゲット強化、RateLimits 設定 UI |
| **Cloud Scheduler** | Cron ジョブ管理 | Cloud Run Functions / Pub/Sub / HTTP 全対応 |

---

## 9. 監視運用

### Cloud Monitoring / Cloud Logging

**2025〜2026 主な更新**:

| 機能 | ステータス | 概要 |
|---|---|---|
| **Gemini in Cloud Monitoring** | GA | 自然言語でのメトリクス検索・アラート設定 |
| **Log Analytics** | GA | Log Buckets を BigQuery にリンク → BigQuery SQL でログ分析 |
| **OTLP (OpenTelemetry) 対応** | GA | 標準フォーマットでのメトリクス・トレース収集 |
| **Error Reporting AI 解析** | Preview | エラーパターンをGeminiが解析・対策提案 |

**Cloud Trace / Cloud Profiler**: OpenTelemetry ベースの分散トレーシングと継続プロファイリング。サンプリングレート設定可能。

**Terraform on GCP**:
- Google-managed Terraform modules（Blueprint Catalog）
- Config Connector（Kubernetes CRD で GCP リソース管理）
- Infra Manager（マネージドTerraform実行環境）GA

---

## 10. 主要アーキテクチャパターン

### パターン1: MCP Gateway 構成（AIエージェント基盤）

```
AIクライアント（Claude/Gemini Code Assist）
    ↓ MCP プロトコル
Cloud Run（MCP サーバー / Streamable HTTP Transport）
    ├── Vertex AI Gemini（LLM推論）
    ├── BigQuery MCP Server（データアクセス）
    ├── Apigee MCP Proxy（既存REST API）
    └── Secret Manager（認証情報）
    ↑ セキュリティ層
Cloud Armor + IAP + IAM
```

**使用サービス**: Cloud Run + Vertex AI + Apigee + Cloud Armor + IAP + Secret Manager  
**用途**: MBP M5 Max / Mac Studio を社内MCPゲートウェイとしたPoC、外部APIのAI統合

---

### パターン2: サーバーレスイベント駆動アーキテクチャ

```
Cloud Storage（ファイルアップロード）
    → Eventarc（Change Notification）
    → Cloud Run（処理ロジック）
    → Pub/Sub（結果通知）
    → BigQuery（分析データ蓄積）
```

**特徴**: フルサーバーレス、スケールゼロ可能、従量課金  
**向き**: ETL、ドキュメント処理、Webhook 処理

---

### パターン3: AI/ML パイプライン

```
Cloud Storage（生データ）
    → Dataflow / Dataproc（前処理）
    → BigQuery（加工データ）
    → Vertex AI（モデルトレーニング）
    → Model Registry（バージョン管理）
    → Cloud Run / GKE（モデル推論サービング）
    → Cloud Monitoring（性能監視）
```

**特徴**: エンドツーエンドのMLOps サイクル  
**向き**: カスタムモデル開発・本番デプロイ

---

### パターン4: リアルタイムデータ処理

```
外部データソース（IoT / Webhook / アプリログ）
    → Pub/Sub（メッセージキュー）
    → Dataflow（ストリーム処理）or Pub/Sub BigQuery直接書き込み
    → BigQuery（リアルタイム分析）
    → Looker Studio / Looker（可視化）
```

**特徴**: 100ms〜秒オーダーのエンドツーエンドレイテンシ  
**向き**: リアルタイムダッシュボード、不正検知、監視

---

### パターン5: エンタープライズ Zero Trust

```
エンドユーザー
    → Chrome Enterprise（BeyondCorp エンドポイント検証）
    → Cloud Armor（DDoS・WAF）
    → Identity-Aware Proxy（認証・認可）
    → Access Context Manager（デバイス/IP/ユーザー検証）
    ↓ 通過した場合のみ
    → アプリケーション（GKE / Cloud Run / AppEngine）
    → Cloud Audit Logs → Chronicle SIEM（脅威検知）
    → Security Command Center（可視化・アラート）
```

**特徴**: ネットワーク境界を持たないゼロトラスト  
**向き**: 社内システムのSaaS移行、ハイブリッドワーク

---

### パターン6: マルチクラウド・ハイブリッド

```
オンプレミス / AWS / Azure
    → Cross-Cloud Interconnect（専用線接続）
    または
    → HA VPN（暗号化トンネル）
    ↓
GCP VPC（Shared VPC）
    → Workload Identity Federation（サービスアカウントキー不要）
    → Anthos / GKE Enterprise（クラスター管理）
    → Cloud Monitoring（統合監視）
```

**特徴**: 既存資産を活かしながら段階的GCP移行が可能

---

## サービス相性マトリクス（確信度: confirmed）

| ユースケース | 推奨コア | 補完サービス |
|---|---|---|
| LLM推論サービング | Vertex AI Gemini | Cloud Run GPU, GKE Inference Gateway |
| AIエージェント基盤 | ADK + Vertex AI | Cloud Run, Apigee MCP Proxy, Secret Manager |
| RAG（検索拡張生成）| Vertex AI + Vertex AI Search | AlloyDB pgvector, BigQuery Vector Search |
| 大規模バッチML | TPU v7 Ironwood / A4 GPU | Cloud Storage, Vertex AI Pipelines |
| リアルタイム分析 | Pub/Sub + BigQuery | Dataflow, Looker |
| CI/CD | Cloud Build + Cloud Deploy | Artifact Registry, Cloud Workstations |
| セキュリティ統合 | Security Command Center | Chronicle, Cloud Armor, IAP |
| API公開 | Apigee | Cloud Run, Cloud Armor, Cloud CDN |
| コスト最適化ストレージ | Cloud Storage Autoclass | Nearline/Coldline/Archive自動移行 |

---

## まとめ：2025〜2026 GCP の方向性

1. **AI・MCPの全サービス統合**: BigQuery/Spanner/AlloyDB/GKE/Compute Engine 全てにMCPサーバーが提供。AIエージェントがGCPリソース全体にアクセス可能な基盤が完成。

2. **サーバーレスの高度化**: Cloud Run GPU GA、Worker Pools GA により、ML推論もサーバーレスで実現。スケールゼロ + GPU の組み合わせが実用段階に。

3. **セキュリティのAI統合**: Gemini が Chronicle/SCC/Cloud Monitoring に統合。脅威検知・説明・対策提案を自動化。Post-Quantum KMS もプレビュー開始。

4. **データベース全方位ベクトル化**: BigQuery・Spanner・AlloyDB・Firestore・Cloud SQL・Bigtable・Memorystore と全DBでベクトル検索が利用可能。単一プラットフォームでRAGが完結。

5. **Apigee MCP Proxy**: 既存REST APIをコード変更なしでMCPサーバー化。エンタープライズのレガシーAPI資産をAIエージェント時代に対応させる橋渡し役。

---

*情報鮮度: 2026-04-13 取得。各サービスの正確な料金・GA状況は公式ドキュメントを要確認。*
