# 画像生成AI — GPU要件と性能

## 収集日
2026-04-13

## Findings

### GPU別 画像生成速度比較
- **ソース**: https://techtactician.com/best-gpu-for-stable-diffusion-sdxl-and-flux/
- **確信度**: confirmed
- **要約**: RTX 5090がFLUX画像生成で最速。RTX 4090比+75%高速。8Kアップスケーリングも実用的。
- **データ**:
  - FLUX 1画像: RTX 5090=~7秒, RTX 4090=~10秒
  - Flux.1-dev 512x512: RTX 5090=~15 it/s, RTX 3090=~5 it/s（3倍速）
  - RTX 4090: 20-30 it/s（最適化後）

### RTX 5090 GenAI テスト（FLUX, SD3.5, HunyuanVideo）
- **ソース**: https://medium.com/@ttio2tech_28094/rtx-5090s-speed-for-genai-flux1-dev-b38394ddcb3d
- **確信度**: likely
- **要約**: RTX 5090は前世代比で約30%の速度向上。FLUX, SD3.5, HunyuanVideoの全てで4090を上回る。

### RTX 5090 vs RTX 4090 SDXL ComfyUI ベンチマーク
- **ソース**: https://www.databasemart.com/blog/stable-diffusion-benchmark-in-comfyui-on-rtx5090
- **確信度**: confirmed
- **要約**: SDXL ComfyUI上でのベンチマーク。32GB GDDR7とFP8対応がバッチ処理と高解像度で大きな優位性。

### VRAM容量別にできること
- **ソース**: https://sakasaai.com/nvidiagpu-abo/
- **確信度**: likely
- **要約**:
  - 12GB: SD1.5, SDXL（基本解像度）, LoRA学習可
  - 16GB: SDXL高解像度, FLUX（基本）, ControlNet
  - 24GB: FLUX高解像度, 大規模バッチ, 複数モデル同時
  - 32GB: 全モデルフル品質, 8Kアップスケール
