# FTL1（フェリチン軽鎖1）— 完全リサーチガイド 2026

> リサーチ日: 2026-04-15
> ステータス: **完成**
> 主要文脈: 哺乳類の鉄貯蔵・脳老化・がん研究

---

## Executive Summary

| 項目 | 内容 |
|------|------|
| **正式名称（ヒト）** | FTL（Ferritin Light Chain） |
| **正式名称（マウス）** | Ftl1（Ferritin light polypeptide 1） |
| **別名** | LFTD、NBIA3、FTL1（非公式・近年普及） |
| **機能** | 鉄貯蔵タンパク質フェリチンのLサブユニット |
| **染色体位置（ヒト）** | 19q13.33 |
| **分子量** | 約20 kDa（175アミノ酸） |
| **OMIM** | 134790 |
| **関連疾患** | 神経フェリチノパチー（NBIA3）、脳老化、がん（多癌種）、HHCS |
| **最注目研究** | **2025 Nature Aging** — 脳老化・認知機能低下の因果関係を初証明 |

> **名称注意**: "FTL1"は生物種によって全く異なるタンパク質を指す（後述）。哺乳類以外では植物の開花制御因子（FLOWERING LOCUS T-Like 1）を意味することがある。

---

## 目次

1. [名称の多義性](#1-名称の多義性)
2. [基本情報・遺伝子・構造](#2-基本情報遺伝子構造)
3. [生物学的機能・分子メカニズム](#3-生物学的機能分子メカニズム)
4. [疾患との関連](#4-疾患との関連)
5. [最新研究（2023-2026）](#5-最新研究2023-2026)
6. [治療標的・創薬への応用](#6-治療標的創薬への応用)
7. [矛盾する知見](#7-矛盾する知見)
8. [データベースリンク集](#8-データベース)

---

## 1. 名称の多義性

「FTL1」は生物種によって**機能・構造・進化的起源が全く異なる遺伝子・タンパク質**を指す。

| 生物種 | 名称 | 機能 | 系統 |
|--------|------|------|------|
| **ヒト** | FTL（=FTL1、非公式） | 鉄貯蔵（フェリチン軽鎖） | フェリチンファミリー |
| **マウス・ラット** | **Ftl1**（公式） | 鉄貯蔵（フェリチン軽鎖） | フェリチンファミリー |
| **トマト等植物** | FTL1 | 開花制御・フロリゲン様 | PEBPファミリー |
| **酵母（S.cer.）** | FTR1（※FTL1ではない） | 高親和性鉄透過酵素 | MFSスーパーファミリー |
| **線虫（C.ele.）** | ftn-1/ftn-2（相当） | 鉄貯蔵（H型フェリチン） | フェリチンファミリー |

**植物FTL1（Flowering Locus T-Like 1）** は短日条件下で発現誘導される開花促進因子。トマト栽培化において人為選択を受けた対立遺伝子変異が、日長中立型品種の普及に貢献した（哺乳類FTL1とは全く無関係）。[^p1]

本レポートでは**哺乳類のFTL1（フェリチン軽鎖）**に焦点を当てる。

---

## 2. 基本情報・遺伝子・構造

### 遺伝子情報[^1]

| 項目 | ヒト（FTL） | マウス（Ftl1） |
|------|------------|--------------|
| NCBI Gene ID | 2512 | 14325 |
| UniProt | P02792 | P29391 |
| 染色体 | 19q13.33 | Chr7:45,107,368–45,109,308（マイナス鎖） |
| エクソン | 4エクソン / 3イントロン | 6種の転写産物 |
| OMIM | 134790 | — |
| MGI | — | MGI:95589 |
| オルソログ関係 | マウスFtl1（1:1対応） | ヒトFTL（1:1対応） |

- ヒトゲノムには多数の**偽遺伝子**が存在するが、発現するのは単一の機能遺伝子のみ
- 病的変異は**エクソン4（C末端側）**に集中
- オルソログは脊椎動物全般の**330種以上**に存在

### タンパク質の構造[^2]

```
フェリチンL鎖（FTL1）の構造

アミノ酸: 175残基
分子量:   約20,019 Da（≒20 kDa）

【二次構造】five-helix bundle
  A・Bヘリックス（アンチパラレル）
    ↕ 長いループで連結
  C・Dヘリックス（アンチパラレル）
    ↕
  Eヘリックス（C末端・構造安定化）

【四次構造】24量体中空ナノケージ
  FTL（L鎖）+ FTH1（H鎖） → 24量体
  直径: 約12 nm
  最大貯蔵: 4,500個の鉄イオン

【鉄結合部位】(PDB: 5LG8)
  Glu57、Glu60、Glu61、Glu64がFe³⁺のアンカー
  → 3鉄クラスター（結晶解析で観察）
```

- 組織ごとにFTL（L鎖）とFTH1（H鎖）の**比率が異なり独立して制御**される
  - 肝臓・脾臓: L鎖優位 → 高い鉄貯蔵能
  - 心臓: H鎖優位 → 高いフェロキシダーゼ活性

### 発現パターン[^3]

ほぼ全組織で発現するユビキタスタンパク質（細胞質主局在）。

| 発現レベル | 組織 |
|-----------|------|
| **特に高発現** | 腎尿細管、肝臓、副腎、脾臓赤脾髄 |
| mRNA高発現 | 腎臓（RPKM 2442.6）、脾臓（RPKM 2174.9）|
| **老化で増加** | **海馬ニューロン**（2025年研究で確認） |

---

## 3. 生物学的機能・分子メカニズム

### 3.1 主要機能：鉄の長期貯蔵と鉄解毒[^4]

```
細胞内フリー鉄（Fe²⁺）
    ↓ FTH1（重鎖）のフェロキシダーゼ活性
  Fe²⁺ → Fe³⁺（酸化）
    ↓ FTL（軽鎖）の核形成・鉱化促進
フェリチンナノケージ内に鉄を安全に格納
    ↓ フェントン反応（Fe²⁺ + H₂O₂ → •OH）を抑制
活性酸素種（ROS）産生の防止
```

> **役割分担**: FTH1 = 触媒（フェロキシダーゼ活性）/ FTL = 構造・貯蔵（鉄の核形成・安定化）

### 3.2 鉄応答性調節（IRP-IREシステム）[^5]

```
鉄不足時:
  IRP1/IRP2 → FTL mRNAの5'UTR上のIREに結合
  → FTL翻訳を抑制（鉄放出を促進）

鉄充足時:
  IRP2 → プロテアソームで分解
  → FTL翻訳が解除・鉄を貯蔵

追加制御:
  eIF3（翻訳開始因子3）→ IRPとは独立してFTL翻訳を抑制
```

### 3.3 フェリチノファジー（NCOA4-FTL/FTH1軸）[^6]

```
細胞内鉄不足時:
  NCOA4 → FTH1サブユニットに結合
         ↓
  フェリチン複合体をオートファゴソームへ輸送
         ↓
  リソソームで分解 → 鉄イオン放出（利用可能鉄の補充）
         ↓
  フェロトーシス調節・赤血球造血（ヘム合成鉄供給）にも寄与
```

### 3.4 主要タンパク質間相互作用[^5][^6]

| 相互作用パートナー | 相互作用の性質 |
|----------------|--------------|
| **FTH1** | 24量体複合体形成（構造的パートナー） |
| **IRP1/IRP2** | mRNA翻訳調節（5' UTR IRE結合） |
| **NCOA4** | フェリチノファジー受容体（FTH1と結合） |
| **GADD45A** | 共免疫沈降で物理的結合を確認 |
| **eIF3** | IRPとは独立したmRNA翻訳抑制 |

### 3.5 シグナル経路への関与[^7]

| 経路 | FTL1の役割 | 文脈 |
|------|-----------|------|
| **HIF1α → NF-κB抑制** | HIF1αがFTLを誘導 → NF-κB（p65核移行）を抑制 → 神経炎症緩和 | 脳虚血再灌流 |
| **NF-κB / MAPK** | FTL過発現でJNK・ERKリン酸化が減少 | 敗血症 |
| **GADD45/JNK** | FTLサイレンシング → GADD45A増加 → JNK活性化 → 増殖抑制 | グリオーマ |
| **フェロトーシス** | FTL増加 = フェロトーシス抵抗性増加 | がん・心臓 |

### 3.6 細胞内局在

- **生理的条件**: 主に**細胞質**（肝臓・心臓・脾臓・脳）
- **グリオーマ**: 分裂間期に**核内**移行、有糸分裂中期には紡錘体に分布
- **神経フェリチノパチー**: 変異FTLが核周辺・細胞質に**凝集体**を形成

---

## 4. 疾患との関連

### 4.1 神経フェリチノパチー（Neuroferritinopathy / NBIA3）[^8]

```
原因: FTL遺伝子エクソン4変異（460InsA が代表例）
遺伝形式: 常染色体優性
発症: 成人期（通常40〜50代）
病態:
  変異FTL → 鉄貯蔵機能喪失
            ↓
  細胞内フリー鉄増加 → ROS産生 → 神経細胞死
            ↓
  基底核（大脳基底核）への鉄・フェリチン異常蓄積
症状: 錐体外路症状（舞踏運動・ジストニア）、認知機能障害、行動異常
```

### 4.2 遺伝性高フェリチン血症・白内障症候群（HHCS）[^8]

- 原因: FTL遺伝子**5' UTR**（鉄応答配列 IRE）の変異
- 血清フェリチンが著しく上昇するが、組織への鉄過剰蓄積はない
- **両側性先天性白内障**（水晶体へのフェリチン沈着）
- ヘモクロマトーシスと誤診されることが多い
- 現在47種以上の変異が同定

### 4.3 脳老化・認知機能低下（2025年 最注目）[^9]

→ 詳細はセクション5「最新研究」を参照

### 4.4 がんとの関連[^10]

| がん種 | FTL1の役割 | 予後への影響 |
|--------|-----------|------------|
| **グリオーマ（膠芽腫）** | TAMでのM2分極促進・免疫回避、GADD45/JNK増殖制御 | 高発現 = 不良予後 |
| **肝細胞癌（HCC）** | 免疫細胞浸潤と関連、予後バイオマーカー | 高発現 = 不良予後 |
| **乳がん** | 組織学的グレード・HER2・Ki-67と相関 | 高発現 = 低生存率 |
| **食道扁平上皮癌（ESCC）** | フェロトーシス抵抗性・リンパ節転移促進 | 転移促進 |
| **卵巣がん** | SPI1転写因子がFTLを活性化 → 解糖系制御 → 転移促進 | 転移促進 |
| **慢性リンパ性白血病（CLL）** | 健常B細胞比で高発現、フェロトーシス抵抗性と関連 | 治療抵抗性 |

### 4.5 炎症・免疫応答[^11]

- **抗炎症作用**: LPS誘発性TNF-α、IL-1β、NOを有意に低下させる（NF-κB活性化抑制）
- **敗血症保護**: 敗血症モデルでFTLが補償的に増加し、過炎症と臓器障害から保護
- **ミエロイド細胞**: 骨髄特異的FTL欠損は敗血症性AKIを悪化させない（保護作用は非ミエロイド経路による可能性）[^12]

---

## 5. 最新研究（2023-2026）

### ★★★ [最重要] 2025年 Nature Aging — 脳老化・認知機能低下の因果関係[^9]

> **Targeting iron-associated protein Ftl1 in the brain of old mice improves age-related cognitive impairment**
> *Nature Aging* Vol.5, pp.1957–1969（2025）| PMID: 40830655 | UCSF Villeda研究室

**概要**:

```
老齢マウス海馬ニューロン: Ftl1発現が増加
                          ↓（因果関係を双方向実験で証明）

若年マウスでFtl1過剰発現 → 老化様変化が誘導:
  • 酸化型鉄（Fe³⁺）蓄積
  • シナプスマーカー低下（NR2A、AMPA受容体、シナプシン）
  • ミトコンドリアATP合成障害
  • 記憶・認知課題の成績悪化

老齢マウスでFtl1ノックダウン → 認知機能が改善:
  • シナプス関連分子の回復
  • 記憶課題成績の若年レベルへの回復

NADH補充 → Ftl1過剰発現の悪影響を部分的に緩和
```

**意義**: FTL1は脳老化・認知機能低下の**原因因子**であることを、過剰発現・抑制の双方向実験で初めて証明。アルツハイマー病治療の新たな標的として注目されている。

---

### 2023-2026 主要論文一覧

| 年 | 論文 | 雑誌 | 主要発見 |
|----|------|------|---------|
| **2025** | Ftl1と脳老化の因果関係[^9] | *Nature Aging* | 認知機能低下の原因因子として同定、ノックダウンで改善 |
| **2025** | カルベジロールがFTL1上昇で心臓フェロトーシス保護[^13] | *Antioxidants* | β遮断薬の新規作用機序：FTL1誘導による脂質過酸化抑制 |
| **2025** | CLL細胞でのFTL1高発現とフェロトーシス感受性[^14] | *Nature STTT* | 血液腫瘍でのFTL1役割を初詳細記述 |
| **2025** | ESCC転移でFTLをフェロトーシス経路の中核標的として同定[^15] | *Int. J. Biol. Sci.* | scRNA-seqで転移微小環境でのFTL同定 |
| **2024** | FTLがグリオーマ免疫微小環境を再プログラム、抗PD1増感[^10] | *Theranostics* | TAMのFTL抑制が免疫チェックポイント阻害薬を増強 |
| **2024** | 肝細胞癌の予後バイオマーカーとしてのFTL[^10] | *Heliyon* | FTL高発現が独立した不良予後因子 |
| **2024** | 神経フェリチノパチー変異体のAlphaFold構造解析[^16] | *ACS Chem. Neurosci.* | A96T変異が入口孔構造を変化させ鉄貯蔵能を喪失 |
| **2024** | FTLが脳虚血でHIF1α/NF-κB経路を介して神経炎症緩和[^7] | *Inflammation* | 急性虚血モデルでのFTL保護的役割 |
| **2024** | SPI1/FTL軸が解糖系を介して卵巣がん転移を促進[^10] | *Expert Rev. Anticancer Ther.* | FTLの代謝制御機能（鉄貯蔵とは独立）を示す |
| **2023** | 乳がんでのFTL過剰発現と不良予後[^10] | — | 多癌種バイオマーカーとしての地位を確立 |

---

## 6. 治療標的・創薬への応用

### FTL1を標的とした治療戦略

| 戦略 | 対象疾患 | エビデンスレベル |
|------|---------|----------------|
| **FTL1ノックダウン（siRNA等）** | 脳老化・認知機能低下 | 動物実験で有効（2025 Nature Aging）|
| **FTL1抑制 + 抗PD1療法** | グリオーマ | 動物実験でPD1感受性増強を確認 |
| **FTL1抑制** | ESCC リンパ節転移 | in vitro/in vivo 有効 |
| **FTL1上昇（カルベジロール）** | 心筋虚血再灌流 | in vitro 有効（既存薬の新機序） |
| **NADH補充** | 脳老化（FTL1関連） | 動物実験で部分的緩和 |

### FTL1バイオマーカーとしての可能性

- **血清フェリチン**: 既存臨床検査で測定可能。脳脊髄液フェリチン高値が認知症リスク上昇と相関する先行データあり
- **腫瘍マーカー**: HCC・乳がん・グリオーマで高発現 = 不良予後
- **画像バイオマーカー**: MRIによる脳内鉄分布（QSM法）とFTL1発現の関連研究が進行中

### 現状の課題

1. **文脈依存性の双面的役割**: 老化脳では有害（認知低下）、急性虚血では保護的 → 疾患・細胞種・タイミングによる慎重な判断が必要
2. **ヒトへの外挿**: 主要エビデンスはマウスモデル。ヒト臨床試験はまだ限定的
3. **デリバリー**: 脳へのノックダウン治療薬をどう届けるか（BBB通過の課題）

---

## 7. 矛盾する知見

| 論点 | 知見A | 知見B | 解釈 |
|------|------|------|------|
| **脳でのFTL1役割** | 老化脳では認知機能低下の**原因**（Nature Aging 2025） | フェロトーシス文脈では**神経保護的**（Frontiers 2025） | 慢性蓄積（老化）vs. 急性誘導（虚血）で役割が逆転 |
| **敗血症でのFTL** | FTL過発現が臓器保護的（Frontiers 2019） | 骨髄特異的FTL欠損は敗血症AKIを悪化させない（AJP 2024） | 保護作用は非ミエロイド細胞（hepatocyte等）が主役の可能性 |
| **がんでのFTL** | 多くのがんで高発現=不良予後 | フェロトーシス誘導療法ではFTL高発現が治療抵抗性 | フェロトーシス療法を選択する際はFTL発現状態の評価が不可欠 |

---

## 8. データベース

| データベース | ヒト（FTL） | マウス（Ftl1） |
|------------|------------|--------------|
| UniProt | [P02792](https://www.uniprot.org/uniprotkb/P02792/entry) | [P29391](https://www.uniprot.org/uniprotkb/P29391/entry) |
| NCBI Gene | [2512](https://www.ncbi.nlm.nih.gov/gene/2512) | [14325](https://www.ncbi.nlm.nih.gov/gene/14325) |
| Ensembl | [ENSG00000087086](https://www.ensembl.org/id/ENSG00000087086) | [ENSMUSG00000050708](https://www.ensembl.org/id/ENSMUSG00000050708) |
| OMIM | [134790](https://omim.org/entry/134790) | — |
| MGI | — | [MGI:95589](https://www.informatics.jax.org/marker/MGI:95589) |
| PDB（代表構造） | [5LG8](https://www.rcsb.org/structure/5LG8) | — |
| Protein Atlas | [FTL](https://www.proteinatlas.org/ENSG00000087086-FTL/tissue) | — |
| GeneCards | [FTL](https://www.genecards.org/cgi-bin/carddisp.pl?gene=FTL) | — |

---

## ソース

[^1]: [NCBI Gene: FTL (Human, 2512)](https://www.ncbi.nlm.nih.gov/gene/2512) / [Ftl1 (Mouse, 14325)](https://www.ncbi.nlm.nih.gov/gene/14325) / [MGI:95589](https://www.informatics.jax.org/marker/MGI:95589)
[^2]: [RCSB PDB 5LG8 — Human L-type ferritin iron loaded](https://www.rcsb.org/structure/5LG8) / [Wikipedia: Ferritin light chain](https://en.wikipedia.org/wiki/Ferritin_light_chain)
[^3]: [Human Protein Atlas: FTL tissue expression](https://www.proteinatlas.org/ENSG00000087086-FTL/tissue)
[^4]: [UniProt P02792 — FTL functional annotation](https://www.uniprot.org/uniprotkb/P02792/entry) / [MedlinePlus FTL](https://medlineplus.gov/genetics/gene/ftl/)
[^5]: [eIF3によるFTL翻訳抑制 — PMC6721798](https://pmc.ncbi.nlm.nih.gov/articles/PMC6721798/)
[^6]: [Ferritinophagy review — Nature Cell Death Discovery 2023](https://www.nature.com/articles/s41420-023-01753-y) / [NCOA4 ferritinophagy — PMC6316710](https://pmc.ncbi.nlm.nih.gov/articles/PMC6316710/)
[^7]: [FTL and HIF1α/NF-κB in ischemic stroke — Inflammation 2024](https://link.springer.com/article/10.1007/s10753-024-02110-6)
[^8]: [OMIM 134790 — FERRITIN LIGHT CHAIN; FTL](https://omim.org/entry/134790) / [Brain 2007 — Neuroferritinopathy FTL1 460InsA](https://academic.oup.com/brain/article/130/1/110/347725) / [MDPI IJMS 2021 — HHCS](https://www.mdpi.com/1422-0067/22/11/5451)
[^9]: [Nature Aging 2025 — Targeting Ftl1 in brain of old mice](https://www.nature.com/articles/s43587-025-00940-z) | PMID: 40830655
[^10]: [Theranostics 2023 — FTL and glioma immune microenvironment](https://www.thno.org/v13p3794.htm) / [Heliyon 2024 — FTL and HCC prognosis](https://www.cell.com/heliyon/fulltext/S2405-8440(24)12071-3) / [PubMed 37542685 — FTL and breast cancer](https://pubmed.ncbi.nlm.nih.gov/37542685/) / [PubMed 39675923 — SPI1/FTL ovarian cancer](https://pubmed.ncbi.nlm.nih.gov/39675923/)
[^11]: [FTL anti-inflammatory in macrophages — PubMed 24983770](https://pubmed.ncbi.nlm.nih.gov/24983770/) / [FTL sepsis protection — PMC6371952](https://pmc.ncbi.nlm.nih.gov/articles/PMC6371952/)
[^12]: [Myeloid FTL deletion and sepsis-AKI — PubMed 38779751](https://pubmed.ncbi.nlm.nih.gov/38779751/)
[^13]: [Carvedilol and FTL1 in ferroptosis — PubMed 39857341](https://pubmed.ncbi.nlm.nih.gov/39857341/) / [MDPI Antioxidants 2025](https://www.mdpi.com/2076-3921/14/1/7)
[^14]: [FTL1 in CLL ferroptosis — Nature STTT 2025](https://www.nature.com/articles/s41392-025-02535-x)
[^15]: [FTL and ESCC lymph node metastasis — PMC12631076](https://pmc.ncbi.nlm.nih.gov/articles/PMC12631076/)
[^16]: [AlphaFold analysis of FTL variants — ACS Chem. Neurosci. 2024, PubMed 39641997](https://pubmed.ncbi.nlm.nih.gov/39641997/)
[^p1]: [Molecular Plant 2020 — FTL1 and SP5G, tomato flowering](https://www.cell.com/molecular-plant/fulltext/S1674-2052(20)30139-8)

---

> リサーチ日: 2026-04-15
> 情報収集: 5エージェント並列（5/5完了）
