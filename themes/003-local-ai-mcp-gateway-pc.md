# 社内ローカルAI・MCPゲートウェイ構築に最適なPC選定ガイド（予算帯別）

## テーマID
003-local-ai-mcp-gateway-pc

## リサーチクエスチョン

1. MCPゲートウェイとは何か？社内ローカルAIサーバーと組み合わせる際の要件
2. ローカルLLM推論（vLLM, Ollama, llama.cpp等）に最適なPC/GPU構成（予算帯別）
3. Mac Studio M3 Ultra vs NVIDIAベースPC — LLM推論 + MCPゲートウェイ用途での比較
4. クラウドGPU選択肢（Lambda Labs, RunPod, Vast.ai, AWS, GCP等）のコスト比較
5. 自社構築 vs クラウドGPU — TCO（総所有コスト）分析
6. MCP gateway / API serverとして使えるソフトウェアスタック（LiteLLM, OpenRouter, Ollama等）
7. 2026年時点で実用的なオープンソースLLMモデルとハードウェア要件

## 優先度
高 — 社内AI・MCP環境の設備投資判断

## 期待するアウトプット
- 予算帯別PC/クラウド構成の推奨（〜20万 / 〜50万 / 〜100万 / 300万〜 / クラウド比較）
- MCPゲートウェイ用ソフトウェアスタックの推奨
- 自社構築 vs クラウドGPUのTCO比較
- Mac Studio vs NVIDIAビルド比較（LLM推論用途）
