# ベンチマーク・パフォーマンス

## 収集日
2026-04-13

## Findings

### Geekbench 6 スコア
- **ソース**: https://browser.geekbench.com/macs/mac-studio-2025-32c-cpu-80c-gpu
- **確信度**: confirmed
- **要約**: Mac Studio M3 Ultra の Geekbench 6 スコア
- **データ**:
  - シングルコア: 3,201〜3,221
  - マルチコア: 27,739
  - Metal GPU: 259,668
  - vs M2 Ultra: シングルコア約16%高速、全体で16〜30%高速
  - vs M3 Max MacBook Pro: GPU約66%高速

### Cinebench R24
- **ソース**: https://forums.macrumors.com/threads/m3-ultra-benchmarking.2453767/
- **確信度**: confirmed
- **要約**: Cinebench R24 マルチコアで28コアM3 Ultraは2,666点。最新Intel搭載カスタムPCより約18%高いスコア。

### 実アプリケーション性能
- **ソース**: https://hostbor.com/mac-studio-m3-ultra-tested/
- **確信度**: likely
- **要約**:
  - Premiere Pro: M4 Max比 約43%高速、M2 Ultra比 約50%高速
  - Blender レンダリング: 66秒（前世代から大幅短縮）
  - M3 UltraはM4 Maxのシングルコアには及ばないが、マルチコアで圧倒

### M3 Ultra vs M4 Max 比較
- **ソース**: https://www.tomshardware.com/pc-components/cpus/apple-m3-ultra-benchmark-seen-on-geekbench-beats-m4-max-in-multi-core-but-not-single-core
- **確信度**: confirmed
- **要約**: M3 UltraはM4 Maxをマルチコアで上回るが、シングルコアでは下回る。M3 UltraはM3 Max 2個分のダイ融合チップのため、シングルコア性能はM3世代相当。
