# 社内AI推論マシン構築ガイド — 画像生成・動画生成に最適なPC構成

## テーマID
002-inhouse-ai-inference-pc

## リサーチクエスチョン

1. AI推論速度ではNVIDIA GPUが本当に最強なのか？AMD、Intel、Apple Siliconとの比較
2. 画像生成AI（Stable Diffusion, FLUX, Midjourney等）のローカル実行に最適なGPU・PC構成
3. 動画生成AI（Runway, Kling, Wan2.1, CogVideoX等）のローカル実行要件とGPU要件
4. VRAM容量別にできること・できないことの整理（12GB/16GB/24GB/48GB/80GB）
5. マルチGPU構成 vs 単一ハイエンドGPU のコスト対効果
6. 社内導入時の具体的なPC構成例（予算帯別: 50万/100万/300万/1000万円）
7. 冷却・電源・ラック等のインフラ考慮事項

## 優先度
高 — 社内AI環境の設備投資判断

## 期待するアウトプット
- GPU性能比較表（推論速度・VRAM・価格）
- 用途別の推奨PC構成（予算帯付き）
- 画像生成・動画生成それぞれの具体的な要件整理
- 構築時の注意点・落とし穴
