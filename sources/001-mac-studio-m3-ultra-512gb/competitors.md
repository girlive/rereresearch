# 競合比較

## 収集日
2026-04-13

## Findings

### Mac Studio M3 Ultra vs Mac Pro (M2 Ultra)
- **ソース**: https://www.cultofmac.com/buying-guides/mac-studio-vs-mac-pro
- **確信度**: confirmed
- **要約**: Mac Studio M3 UltraはMac Pro（M2 Ultra）をCPU性能で約30%上回る。GPU Metal テストでも13%上回る。Mac Proは2023年のM2 Ultraのまま更新なし。Mac Proの利点はPCIeスロットによる拡張性のみ。価格はMac Proが約2倍。ほとんどのユーザーにはMac StudioにThunderbolt 5アクセサリの組み合わせを推奨。

### Mac Studio M3 Ultra vs Windows ワークステーション
- **ソース**: https://www.techradar.com/pro/i-compared-apples-mac-studio-m3-ultra-with-10-windows-workstations-and-i-am-truly-shocked-by-what-i-found
- **確信度**: likely
- **要約**: 10台のWindowsワークステーションとの比較でM3 Ultraは十分な競争力を示す。Cinebench R24マルチコアで最新Intel PCの18%上。電力効率で圧倒的優位（同等PC性能に必要な電力は約10倍）。ただしGPU単体の計算性能ではNVIDIA上位GPUに劣る場面あり。

### NVIDIA GPU との AI ワークロード比較
- **ソース**: https://www.servethehome.com/new-512gb-unified-memory-apple-mac-studio-is-the-local-ai-play/
- **確信度**: confirmed
- **要約**:
  - Mac Studio 512GB ($9,499) vs RTX 6000 Ada ($8,999, 48GB)
  - メモリ容量: 512GB vs 48GB（10倍以上）
  - Mac Studioは「モデルが載るか否か」のバイナリ判定で優位
  - しかし同一モデルサイズではNVIDIA GPUの方がtok/sec で高速
  - RTX 5090 (24GB) と同程度の推論速度（小モデル時）

### M4/M5世代の展望
- **ソース**: https://www.macworld.com/article/2973459/2026-mac-studio-m5-release-date-specs-price-rumors.html
- **確信度**: uncertain
- **要約**: 2026年中頃にM5 Mac Studioの発表が予想。M4 UltraはMac Proに先行搭載される可能性。次世代ではメモリ帯域のさらなる向上が期待される。現時点でM3 Ultra Mac Studioを購入するなら製品サイクル終盤であることを考慮すべき。
