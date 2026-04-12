# PC構成ガイド — 予算帯別

## 収集日
2026-04-13

## Findings

### 海外構成例（ドル建て）
- **ソース**: https://www.hostrunway.com/blog/ai-video-generation-2026-best-gpus-vram-guide-and-smart-setups-that-work/
- **確信度**: confirmed
- **データ**:

#### Entry ($1,163)
- GPU: RTX 5060 Ti 16GB ($499)
- CPU: AMD Ryzen 5 7600 ($179)
- RAM: 32GB DDR5 ($89)
- SSD: 1TB NVMe PCIe 4.0 ($79)
- PSU: 750W 80+ Gold ($89)
- 性能: AnimateDiff 720p 26-34秒

#### Professional ($2,453)
- GPU: RTX 5080 24GB ($1,149)
- CPU: AMD Ryzen 9 9900X ($429)
- RAM: 64GB DDR5 ($169)
- SSD: 2TB NVMe PCIe 5.0 ($149)
- PSU: 1000W 80+ Platinum ($149)
- 性能: Wan2.2 1080p 38秒

#### Studio Beast ($4,313)
- GPU: RTX 5090 32GB ($2,199)
- CPU: AMD Ryzen 9 9950X ($699)
- RAM: 128GB DDR5 ($349)
- SSD: 4TB NVMe PCIe 5.0 ($299)
- PSU: 1200W 80+ Titanium ($219)
- 性能: LTX-2.3 4K 74秒

### 日本国内構成の考慮事項
- **ソース**: https://www.ai-souken.com/article/ai-generation-pc-introduction
- **確信度**: likely
- **要約**: RTX 5070 Ti 16GBが148,800円〜でミドルクラスの価格帯。SDXL・FLUXの高解像度画像生成や13Bクラスモデルをほぼ量子化なしで実行可能。デュアルRTX 4090構成でStable Diffusion推論速度を最大2倍に。

### マルチGPU構成の注意点
- **ソース**: https://localai.computer/learn/ai-workstation-guide
- **確信度**: confirmed
- **要約**: RTX 40シリーズ以降のコンシューマーGPUにはNVLinkなし。GPU間通信はPCIe経由。RTX 5090はPCIe Gen 5対応でGen 4の4090より通信高速。プロ向けはNVIDIA B200（NVLink 5.0, 1.8 TB/s）。電源は各GPU + CPU + マージン20%で計算。

### エンタープライズ向けハイエンド
- **ソース**: https://www.atlantic.net/gpu-server-hosting/top-nvidia-gpus-for-ai-training-and-inference/
- **確信度**: confirmed
- **要約**:
  - H100: 80GB HBM3, NVLink 4.0 (900 GB/s), 推論のワークホース
  - B200: 192GB HBM3e, NVLink 5.0, 20 PFLOPS sparse FP4
  - B300 (Blackwell Ultra): 288GB HBM3e, 15 PFLOPS dense FP4
