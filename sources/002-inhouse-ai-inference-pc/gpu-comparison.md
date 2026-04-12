# GPU AI推論性能比較

## 収集日
2026-04-13

## Findings

### RTX 4090 vs RTX 5090 vs RTX PRO 6000 LLM推論ベンチマーク
- **ソース**: https://www.cloudrift.ai/blog/benchmarking-rtx-gpus-for-llm-inference
- **確信度**: confirmed
- **要約**: vLLM を用いた LLM推論ベンチマーク。RTX 5090 は RTX 4090 の約2倍の推論速度。PRO 6000（48GB）は大規模モデルで最高のコスト効率。
- **データ**:
  - Qwen3-Coder-30B: RTX 4090=2,259 tok/s, RTX 5090=4,570 tok/s, PRO 6000=8,425 tok/s
  - Llama-3.3-70B (2GPU): RTX 4090x2=467 tok/s, RTX 5090x2=1,230 tok/s, PRO 6000x1=1,031 tok/s
  - GLM-4.5-Air (4GPU): RTX 4090x4=1,731 tok/s, RTX 5090x4=4,622 tok/s
  - コスト効率: RTX 5090=$0.040/1M tokens, PRO 6000=$0.043/1M tokens (小モデル)

### NVIDIA vs AMD vs Intel 全体比較
- **ソース**: https://sanj.dev/post/amd-vs-nvidia-ai-workloads-performance-2025
- **確信度**: confirmed
- **要約**: NVIDIAがAI推論で圧倒的シェア（~92%）。AMD MI355XはFP8でGB300より低コスト/トークンを達成する場面も。Intelはエンタープライズ推論特化GPU「Crescent Island」（160GB, Xe3P）を2026年末にサンプル予定。

### NVIDIA Blackwell世代の性能
- **ソース**: https://blogs.nvidia.com/blog/blackwell-inferencemax-benchmark-results/
- **確信度**: confirmed
- **要約**: B200は1GPU当たり10,000 TPS超を達成。H200比で4倍のスループット。GB300 NVL72はDeepSeek-R1推論でGB200比1.4倍、Hopper比5倍。

### RTX 5090 詳細ベンチマーク
- **ソース**: https://www.runpod.io/blog/rtx-5090-llm-benchmarks
- **確信度**: confirmed
- **要約**: Llama-3.1-8Bで7,198 tok/sec（RTX 4090は~4,500 tok/sec）。32GB GDDR7。デュアルRTX 5090がH100単体を上回る場面あり。消費電力は587Wピーク（4090は235W平均）。
