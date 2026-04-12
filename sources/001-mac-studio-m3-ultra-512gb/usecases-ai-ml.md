# AI/ML ユースケース

## 収集日
2026-04-13

## Findings

### DeepSeek R1 671Bパラメータモデルの実行
- **ソース**: https://www.macrumors.com/2025/03/17/apples-m3-ultra-runs-deepseek-r1-efficiently/
- **公開日**: 2025-03-17
- **確信度**: confirmed
- **要約**: Mac Studio M3 Ultra 512GBで DeepSeek R1（671Bパラメータ）を4bit量子化でローカル実行可能。約17-18 tokens/secの推論速度。RTX 5090（24GB VRAM）では到底載らないモデルが、単一マシンでシャーディングなしに動作する。

### LLM推論の批判的評価
- **ソース**: https://medium.com/@billynewport/apples-m3-ultra-mac-studio-misses-the-mark-for-llm-inference-f57f1f10a56f
- **確信度**: likely
- **要約**: M3 Ultraは「GPU性能がボトルネック、RAMの量では解決しない」との指摘。Gemma-3 27B-Q4で約41 tok/sec（M2 Maxの4倍）だが、コンテキスト長40-50kでは性能が10倍低下。$10,000の投資に対し、NVIDIA RTX 5090と同程度の速度（RAMが問題にならない場合）。大規模コンテキストでの実用性に疑問。

### Kimi K2.5のローカル実行
- **ソース**: https://developer.tenten.co/how-to-run-kimi-k25-locally-on-mac-studio-m3-ultra-with-512gb
- **確信度**: likely
- **要約**: 512GB統合メモリにより Kimi K2.5 などの大規模モデルもローカル実行可能。オフロードやシャーディングが不要な点が最大の利点。

### コスト比較: Mac Studio vs NVIDIA
- **ソース**: https://www.servethehome.com/new-512gb-unified-memory-apple-mac-studio-is-the-local-ai-play/
- **確信度**: confirmed
- **要約**: 512GB Mac Studio $9,499 vs NVIDIA RTX 6000 Ada $8,999（48GB VRAM）。メモリ容量は10倍以上の差。ただしメモリ帯域は512GB使用時に128GB使用時の1/4になるとの指摘あり（帯域をメモリ全体で共有するため）。

### プライバシー重視のAIユースケース
- **ソース**: https://creativestrategies.com/mac-studio-m3-ultra-ai-workstation-review/
- **確信度**: confirmed
- **要約**: 医療機関など患者データをクラウドに送れない環境でのローカルLLM推論が有力なユースケース。データの外部送信なしにAI推論が可能。

### HN コミュニティの意見
- **ソース**: https://news.ycombinator.com/item?id=46907001
- **確信度**: likely
- **要約**: Hacker News上でMac Studio M3 UltraをローカルAI/LLMに使うかの議論。大容量モデルが「載る」ことは認めつつ、帯域幅の制約とコスト対効果について意見が分かれる。
