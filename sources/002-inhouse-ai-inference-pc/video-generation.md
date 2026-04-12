# 動画生成AI — GPU要件と性能

## 収集日
2026-04-13

## Findings

### モデル別VRAM要件と性能（総合）
- **ソース**: https://www.spheron.network/blog/ai-video-generation-gpu-guide/
- **確信度**: confirmed
- **要約**: 動画生成AIのVRAM要件は画像生成より遥かに大きい。60-80GBの壁がコンシューマーとエンタープライズの分水嶺。
- **データ**:
  | モデル | 最小VRAM | 推奨GPU | 5秒生成時間 | 品質 |
  |--------|---------|---------|------------|------|
  | Wan 2.1 (720p) | 65-80GB | H100 SXM5 | 10-12分 | High |
  | HunyuanVideo (720p) | 60-80GB | H200 SXM | 12-18分 | Highest |
  | LTX-2.3 (720p) | 24-32GB | RTX 5090 | 5-8分 | Good |
  | CogVideoX-1.5-5B | 24-32GB | RTX 4090 | 8-12分 | Moderate |

### コンシューマーGPUで実行可能なモデル
- **ソース**: https://www.hostrunway.com/blog/ai-video-generation-2026-best-gpus-vram-guide-and-smart-setups-that-work/
- **確信度**: confirmed
- **要約**: ComfyUI NVFP4最適化でVRAM要件を最大60%削減可能（RTX 50シリーズ）。
- **データ**:
  | モデル | 解像度 | 最小VRAM | 快適VRAM | 推奨GPU |
  |--------|--------|---------|---------|---------|
  | Wan2.2 (14B) | 1080p | 12GB | 24GB | RTX 5080/5090 |
  | LTX-2.3 | 4K | 16GB | 32GB | RTX 5090 |
  | SVD-XT | 720p | 10GB | 16GB | RTX 5070 Ti |
  | HunyuanVideo 1.5 | 720p | 13.6GB | 24GB | RTX 5080 |
  | AnimateDiff | 720p | 8GB | 12GB | RTX 5070 |

### ComfyUI ベンチマーク（動画生成速度）
- **ソース**: https://www.hostrunway.com/blog/ai-video-generation-2026-best-gpus-vram-guide-and-smart-setups-that-work/
- **確信度**: likely
- **データ**:
  | タスク | RTX 5090 | RTX 5080 | RTX 5070 Ti |
  |--------|---------|---------|------------|
  | Wan2.2 1080p/10s | 28秒 | 38秒 | — |
  | LTX-2.3 4K/15s | 74秒 | — | — |
  | SVD-XT 720p/25f | — | — | 22秒 |
  | HunyuanVideo 720p | — | 29秒 | — |
  | AnimateDiff 720p | — | — | 17秒 |

### Wan2.1 低VRAM実行（1.3Bモデル）
- **ソース**: https://www.vgoodslab.com/a-new-life-for-older-gpus-your-ultimate-guide-to-running-wan2-1-text-to-video-ai-locally-in-2025/
- **確信度**: confirmed
- **要約**: Wan2.1 T2V-1.3Bバリアントは12GB GPUで動作。720pで3-5秒クリップ。VRAM使用量10-11GB。品質は14Bモデルに劣る。

### RTX 5090 vs RTX 4090 動画生成比較
- **ソース**: https://www.valdi.ai/blog/rtx-5090-vs-4090-in-the-real-world-of-image-to-video-inference
- **確信度**: confirmed
- **要約**: RTX 5090はRTX 4090比でFLUX画像生成75%高速。動画生成でもNVFP4とNVENC第9世代で大幅優位。
