# MacBook Pro M5 Max — 14インチ vs 16インチ 性能比較

> リサーチ日: 2026-04-13
> ステータス: **完成**

---

## Executive Summary

**同じM5 Maxチップでも、14インチは持続負荷時に16インチより最大30%遅くなる。これは設計上の必然。**

| 比較軸 | 14インチ M5 Max | 16インチ M5 Max |
|--------|----------------|----------------|
| 瞬間（バースト）性能 | ほぼ同等 | ほぼ同等 |
| CPU持続電力上限 | **~45W**（96Wから即座に低下） | **~64W**（安定維持） |
| GPU持続電力上限 | **~44W**（72Wから1〜2秒で低下） | **~64W** |
| Cinebench 2024 Multi スコア | 1,400〜2,073（不安定） | **2,437**（安定） |
| 30分ストレステスト後の低下 | **約24%** | 軽微 |
| GPU持続性能低下 | **最大25%** | 軽微 |
| キーボード温度（高負荷時） | **47°C超** | 42°C |
| ファン騒音（最大負荷） | **53.2 dB / 7,500 RPM** | 最大RPMの68%以下に抑制 |
| 重量 | 1.62 kg | 2.15 kg（+530g） |
| バッテリー容量 | 72.4 Wh / 最大20時間 | 99.6 Wh / 最大22時間 |
| 価格（US、同構成） | $3,599 | $3,899（+$300） |

**重大な逆説: 14インチはファンが全力（53.2 dB）で回っているのに16インチより遅い。**

---

## 目次

1. [なぜ同じチップで性能が違うのか](#1-なぜ同じチップで性能が違うのか)
2. [冷却ハードウェアの物理的な差](#2-冷却ハードウェアの物理的な差)
3. [サーマルスロットリングの実測データ](#3-サーマルスロットリングの実測データ)
4. [LLM・AI推論での性能差](#4-llmai推論での性能差)
5. [動画エンコード・クリエイティブ用途](#5-動画エンコードクリエイティブ用途)
6. [ユーザーコミュニティの声](#6-ユーザーコミュニティの声)
7. [購入推奨まとめ](#7-購入推奨まとめ)

---

## 1. なぜ同じチップで性能が違うのか

### 熱力学的な制約

チップが電力を消費すると熱が発生する。冷却が追いつかなければ、Appleの電力管理ファームウェアがリアルタイムでチップへの電力供給を絞る（サーマルスロットリング）。

```
電力上限 → チップ温度 → 冷却能力 → 筐体サイズ

14インチ筐体: ヒートシンク小 → 排熱能力低 → 電力上限を早期に絞る
16インチ筐体: ヒートシンク大 → 排熱能力高 → より高い電力を持続できる
```

M5 Maxのチップ自体は同一。**性能差の原因はすべて冷却能力の差**。[^1][^2]

### M5世代の熱設計改善

- M5 Maxは従来の**InFOパッケージング**から**TSMC 2.5D SoIC-MHパッケージング**に移行
- チップ内部での熱拡散効率が向上し、M4 Maxより**約8°C低い温度**で動作[^3]
- ただし14インチ筐体の物理的な限界を克服するには不十分

---

## 2. 冷却ハードウェアの物理的な差

| 項目 | 14インチ M5 Max | 16インチ M5 Max |
|------|----------------|----------------|
| ファン数 | 2基（デュアル） | 2基（デュアル） |
| ファンサイズ | 小型 | **大型** |
| ヒートシンク面積 | 小 | **大** |
| ベイパーチャンバー | **なし** | **なし** |
| 最大ファン回転数（高負荷時） | **~7,500 RPM** | 最大RPMの68%以下で抑制 |
| ファン騒音（高負荷） | **53.2 dB(A)** | **~31 dB**（whisper-quiet評価） |
| キーボード表面温度（高負荷） | **47°C超** | **42°C** |

**ポイント**: 14インチも16インチもデュアルファン。ファンの数は同じだが**サイズと排熱容量が根本的に異なる**。[^4]

### 充電電力の上限

- 140W充電器を接続しても、14インチへの入力は**97Wに制限**される（内部設計による）
- 高負荷時のバッテリー消費が追いつかないケースがある[^1]

---

## 3. サーマルスロットリングの実測データ

### 3-1. CPU電力の低下パターン（14インチ）

NotebookCheckの実測による電力推移: [^1]

```
高負荷開始
  ↓
ピーク 96W（1〜2秒のみ）
  ↓ 即座に低下
46W
  ↓
42W（High Power Modeでの安定値）
  ↓ Automaticモードでは
30W以下
```

**16インチは High Power Modeで62Wを持続できる。**

### 3-2. GPU電力の低下パターン（14インチ）

```
GPU ピーク 72W（1〜2秒）→ 55W → 44W（High Power Mode安定値）
```

### 3-3. Cinebench 2024 マルチコアスコア比較

| 機種 | スコア |
|------|--------|
| 16インチ M5 Max | **2,437**（安定） |
| 14インチ M5 Max（ベスト） | 2,073 |
| 14インチ M5 Max（変動範囲） | **1,400〜2,073**（不安定） |

14インチは同じ条件でもスコアが1,400〜2,073の間を不規則に変動する。[^5]

### 3-4. High Power Modeの限界

**14インチのHigh Power ModeはAutomatic Modeの16インチに負ける。** [^1]

| モード | 持続GPU性能（対最大値） |
|--------|----------------------|
| 14インチ Automatic | 74.99% |
| 14インチ High Power | 92.6% |
| **16インチ Automatic** | **≒100%**（安定） |

つまり: **14インチをHigh Power Modeで回しても、16インチの通常モードに劣る。**

### 3-5. 30分ストレステスト

Digital Trendsの実測: [^6]

- 14インチ: 30分間のCinebench 2024 Multiで**24%スコア低下**
- 3DMark Steel Nomad（GPU）: 16インチが14インチより**12%高スコア**
- GPU持続テスト: 14インチが同テスト中に**最大25%の性能低下**

### 3-6. SSD温度問題

AIワークロード中にSSDコントローラーが**106°C**に達したユーザー報告あり（前世代M3 Maxは同条件で約30°C）。[^7]

**確信度: likely**（単一ユーザーの報告が複数メディアで引用。14インチ固有かどうかの独立確認は現時点で限定的）

### 3-7. 「不良バッチ」問題（通常のスロットリングとは別事象）

一部の14インチ M5 Maxで**同一条件のベンチマーク間でスコアが41.5%変動**するユニットが報告されている。[^8]

これはサーマルスロットリングとは**別の問題**（ハードウェアバッチの欠陥とみられる）。交換品は正常動作が確認されている。

---

## 4. LLM・AI推論での性能差

### 4-1. LLM tok/sはなぜ差が出るのか

LLM推論速度（tok/s）はメモリ帯域幅に依存する。14/16インチのM5 Maxはチップのピーク帯域幅は同じ（614 GB/s）だが、**熱制限により14インチの実効帯域幅が低下する**。[^9][^10]

### 4-2. 主要モデルの参考速度（M5 Max、主に16インチ実測値）

| モデル | 量子化 | 速度 |
|--------|--------|------|
| Qwen3.5-35B-A3B | int4 | ~134 tok/s |
| Qwen3.5-122B-A10B MoE | 4bit | ~60 tok/s |
| Llama 3.3 70B | Q4_K_M | 18〜28 tok/s |
| 7B〜14B系 | Q4 | 80〜100+ tok/s |

※多くのベンチマークは16インチでの実測値、または14/16の区別が不明確。14インチでは熱制限時に5〜15%程度の低下が推定される。[^9]

### 4-3. Prefill速度（M5 Max全般）

- 70B / 16Kトークンプロンプトのprefill: **8〜10秒**（M4 Maxは30〜40秒）
- Ollama 0.19（MLXバックエンド）でprefillが57%向上（1,154→1,810 tok/s）
- **Prefillの主要処理はGPU Neural Accelerator**。14インチのGPU熱制限はPrefillにも影響する[^10]

### 4-4. AI推論ワークロードでのスロットリング挙動

- Ollama/MLXの推論は**GPU（Neural Accelerator）が主体**。CPUは主にオーケストレーション担当
- したがって**GPUの熱制限が推論速度のボトルネック**になる
- 30分以上の連続生成では「5〜10%のスループット低下」が複数ユーザーから報告[^11]

### 4-5. 実用的な判断

| 用途 | 14インチの実用性 |
|------|----------------|
| 対話型チャット（1回=数秒〜1分） | **実用的**。バースト処理なのでスロットリングが顕在化しにくい |
| エージェント型（長文コンテキスト頻繁） | **注意が必要**。長時間連続では速度低下あり |
| バッチ推論・30分以上の連続実行 | **16インチが明確に優位** |

---

## 5. 動画エンコード・クリエイティブ用途

### 5-1. 短時間タスク（差が出にくい）

- **Handbrake 単発エンコード**: ほぼ同等[^12]
- **Final Cut Pro ProRes エクスポート**: ほぼ同等（ProResハードウェアエンジンは14/16で同じ数）[^13]
- **短時間ビルド（Xcode）**: ほぼ同等

### 5-2. 長時間タスク（差が顕著）

- **長時間連続エンコード**: 14インチは最大25〜30%性能低下[^2]
- **大規模Xcodeビルド（30分超）**: 16インチが有利
- **DaVinci Resolve長時間レンダリング**: 16インチが安定

### 5-3. バッテリー動作時

- Apple公式の主張: 「バッテリー時もAC時と同等性能」（低電力モードOFF時）
- Final Cut Pro実使用でのバッテリー持続: **約6〜8時間**（公称22時間から大幅短縮）[^14]
- 16インチは物理的に大容量バッテリー（99.6 Wh vs 14インチ 72.4 Wh）のため高負荷時の絶対稼働時間が長い

### 5-4. プロメディア各誌の推奨（一致した結論）

| 媒体 | 評価 |
|------|------|
| NotebookCheck | 14インチに「深刻な熱スロットリングと不安定な性能」を明記 [^1] |
| Digital Trends | 「14インチはM5 Maxチップの性能を制限している」 [^6] |
| AppleInsider | 16インチを「Portable Mac Studio Power」と評価 [^15] |
| Gizmodo | 「現存最強のノートPCだが日常用途には持て余す」 [^16] |
| 映像制作バイヤーズガイド | M5 Max × 長時間動画編集 → 16インチ推奨 [^17] |

---

## 6. ユーザーコミュニティの声

### 6-1. 実購入者の傾向（MacRumors / Reddit / 日本語コミュニティ）

**16インチを選んだ派の理由**:
- 「Blender・動画編集・ライティングをこなすなら画面面積が作業効率に直結する」[^18]
- 「M5 Maxを活かしきれるのは16インチだけ」（MacRumorsフォーラム）[^11]
- 「$300追加で大きな画面・良い冷却・2時間多いバッテリーが手に入るなら割安」

**14インチを選んだ派の理由**:
- 「毎日の通勤・持ち歩きで530gの差は毎日の疲労に直結する」[^19]
- 「軽さは生産性の一部。M5 Proで24GBなら開発には十分」
- 「外部ディスプレイで画面問題は解決できる」

**日本語コミュニティの定説**:

> 「16インチは迷って買うものではなく、絶対に16インチが必要だと確信してから買うもの。迷っているなら14インチ」[^20]

### 6-2. MacRumorsフォーラムでの評価

- 「14インチはM5/Mx Maxを扱えない」スレッドが立ち、複数ユーザーが熱処理の限界を報告[^11]
- 「M5 Maxを14インチに入れるのは世代を重ねるごとに悪くなっている。チップの消費電力は増えているのに冷却設計に更新がない」

### 6-3. 画面面積の差

- 14.2インチ: 約92平方インチ
- 16.2インチ: 約120平方インチ（**約30%広い**）
- ターミナル・エディタ・ブラウザを並べた時の差は体感で大きい[^21]

### 6-4. 日本語実機レビューの知見

日本語レビューでは128GB M5 Max（14インチ）でも「LLM推論で『待つ』感覚がなくなった」と報告されている。[^22] ただしこれはバースト的な使用での体験であり、長時間連続では熱制限が顕在化する可能性がある。

---

## 7. 購入推奨まとめ

### 用途別推奨

| 用途 | 推奨 | 理由 |
|------|------|------|
| LLM/AI推論（バースト・対話型） | **14インチでも可** | 短時間ならスロットリング顕在化しにくい |
| LLM/AI推論（30分超・連続バッチ） | **16インチ** | GPU熱制限が速度低下に直結 |
| 動画エンコード（長時間） | **16インチ** | 最大25〜30%の差が出る |
| 開発・コーディング（軽〜中程度） | **14インチで十分** | |
| 在宅・デスク固定運用 | **16インチ** | 画面30%増・$300差は合理的 |
| 毎日持ち歩き（通勤・出張） | **14インチ** | 530gは毎日の疲労に直結 |
| 「迷っている」 | **14インチ** | 日本語コミュニティの合意 |

### M5 Maxを14インチで買う場合の覚悟

```
✓ 短時間タスクはほぼフルパフォーマンス
✓ 70B+モデルが128GBで動く（メモリ容量は同じ）
✗ 長時間の持続負荷では性能が低下する（設計上の必然）
✗ ファンが全力（53dB）で回っているのに16インチより遅いことがある
✗ 一部ユニットで性能のばらつき問題あり
```

### 価格差の考え方

US価格で16インチは+$300（約4〜5万円）。M5 Max 128GB構成の総額（70〜80万円台）への追加投資として、チップの性能を100%引き出せる筐体を選ぶ合理性は高い。

---

## Sources

[^1]: [NotebookCheck — MacBook Pro 14 M5 Max サーマルスロットリングレビュー](https://www.notebookcheck.net/M5-Max-with-inconsistent-performance-and-throttling-issues-Apple-MacBook-Pro-14-Review.1246064.0.html)
[^2]: [WCCFTech — 14インチ M5 Pro サーマル制約・16インチが30%速い](https://wccftech.com/14-inch-m5-pro-macbook-thermal-constraints-bigger-model-is-30-percent-faster/)
[^3]: [WCCFTech — M5 Max Fusion Architecture、M4 Maxより8°C低温](https://wccftech.com/m5-max-runs-cooler-than-m4-max-but-still-gets-scorching-hot/)
[^4]: [Tweaktown — M5 Pro/Max 熱拡散設計の改善](https://www.tweaktown.com/news/110038/apples-beefier-m5-pro-and-m5-max-chips-will-have-improved-heat-dissipation-and-heres-why/index.html)
[^5]: [NotebookCheck News — M5 Max 16インチは14インチより約15%速い](https://www.notebookcheck.net/Apple-s-M5-Max-in-the-MacBook-Pro-16-is-around-15-faster-compared-to-the-MacBook-Pro-14.1250872.0.html)
[^6]: [Digital Trends — Tests show the 14-Inch MacBook Pro holds back the M5 Max chip](https://www.digitaltrends.com/computing/tests-show-the-14-inch-macbook-pro-holds-back-the-m5-max-chip/)
[^7]: [WCCFTech — M5 Max MacBook Pro SSD temperatures cross 100°C](https://wccftech.com/m5-max-macbook-pro-ssd-temperatures-cross-100-degrees-celsius-running-ai-workloads/)
[^8]: [WCCFTech — M5 Max 41.5%マルチコア不整合問題](https://wccftech.com/bad-batches-of-m5-max-macbook-pro-exist-with-performance-inconsistencies/)
[^9]: [hardware-corner.net — M5 Max Local LLM Benchmarks](https://www.hardware-corner.net/m5-max-local-llm-benchmarks-20261233/)
[^10]: [Apple Machine Learning Research — Exploring LLMs with MLX and M5 Neural Accelerators](https://machinelearning.apple.com/research/exploring-llms-mlx-m5)
[^11]: [MacRumors Forums — 14インチ MacBook Pro M5 Max スロットリング議論](https://forums.macrumors.com/threads/14-macbookpro-cant-handle-m5-mx-max-throttling-due-to-heating.2479303/)
[^12]: [Tom's Hardware — MacBook Pro 14インチ M5 Max レビュー](https://www.tomshardware.com/laptops/macbooks/apple-macbook-pro-14-inch-m5-max-2026-review)
[^13]: [Apple Newsroom — M5 Pro and M5 Max 発表](https://www.apple.com/newsroom/2026/03/apple-debuts-m5-pro-and-m5-max-to-supercharge-the-most-demanding-pro-workflows/)
[^14]: [AppleInsider — M5 Pro/Max レビューラウンドアップ](https://appleinsider.com/articles/26/03/09/m5-pro-m5-max-macbook-pro-review-roundup-more-of-the-same-at-a-higher-price)
[^15]: [AppleInsider — M5 Max 16インチ「Portable Mac Studio Power」](https://appleinsider.com/articles/26/03/19/m5-max-16-inch-macbook-pro-review-portable-mac-studio-power)
[^16]: [Gizmodo — M5 Max MacBook Pro Review](https://gizmodo.com/m5-max-macbook-pro-review-preeminent-power-in-the-same-old-shell-2000731479)
[^17]: [Who Is Matt — Video Editing M5 MacBook Buyer's Guide 2026](https://whoismatt.com/video-editing-m5-macbook-buyers-guide-2026/)
[^18]: [Medium — なぜ16インチを選んだか](https://medium.com/@michaelswengel/14-inch-or-16-inch-macbook-pro-heres-why-i-went-for-the-big-one-8b037091df1d)
[^19]: [DEV Community — なぜ14インチ M5 Proを選んだか](https://dev.to/iraycd/why-i-chose-the-14-macbook-pro-m5-pro-a-developers-buying-guide-1g72)
[^20]: [Apple信者1億人創出計画 — 14 or 16インチ MacBook Pro](https://appleshinja.com/14or16macbookpro)
[^21]: [MacRumors Forums — 14 v 16 実用画面比較](https://forums.macrumors.com/threads/14-v-16-practical-screen-comparison.2411307/)
[^22]: [ITmedia — M5 Max MacBook Pro 128GB AI環境レビュー](https://www.itmedia.co.jp/pcuser/articles/2604/08/news012.html)
[^23]: [Hacker News — Apple's MacBook Pro 14 cannot handle the M5 Max](https://news.ycombinator.com/item?id=47384970)
[^24]: [TechStory — The 15% Performance Gap Between 16-inch and 14-inch M5 Max](https://techstory.in/the-15-performance-gap-between-the-16-inch-and-14-inch-m5-max/)

---

## Methodology

- リサーチ日: 2026-04-13
- 情報収集: 5エージェント並列Webリサーチ（全エージェント完了）
- ソース数: 24+
- 調査範囲: サーマルスロットリング実測 / 冷却ハードウェア設計 / LLM推論 / 動画エンコード / コミュニティ報告

## Confidence Assessment

- 14インチの持続CPU電力上限（~45W vs 16インチ~64W）: **confirmed** — NotebookCheck実測
- 14インチ GPU 持続低下（最大25%）: **confirmed** — Digital Trends / WCCFTech / NotebookCheck 複数独立ソース一致
- 30分ストレステストで24%低下: **confirmed** — Digital Trends実測
- 16インチ Automatic > 14インチ High Power Mode: **confirmed** — NotebookCheck実測
- SSD 106°C問題: **likely** — 単一ユーザー報告が複数メディアで引用
- 不良バッチ問題（41.5%変動）: **confirmed** — WCCFTech / NotebookCheck確認
- LLM推論での14 vs 16 tok/s直接比較: **uncertain** — 公開ベンチマークなし（間接推定のみ）
- 重量・バッテリー容量: **confirmed** — Apple公式スペック
