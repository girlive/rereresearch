#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const cwd = process.cwd();
const rawDir = path.resolve(cwd, args['raw-dir'] ?? 'raw');
const outDir = path.resolve(cwd, args['out-dir'] ?? 'highlights');
const cacheDir = path.resolve(cwd, '.cache');
const statePath = path.join(cacheDir, 'raw-highlights-state.json');
const includePromoted = Boolean(args['include-promoted']);
const allMode = Boolean(args.all);
const notifySlack = Boolean(args.slack);
const sinceHours = Number(args['since-hours'] ?? 1);

const TECH_SIGNALS = [
  ['AI', 4], ['生成AI', 5], ['LLM', 5], ['GPT', 5], ['Claude', 5], ['Codex', 5],
  ['MCP', 5], ['agent', 3], ['エージェント', 5], ['モデル', 3], ['Stable Diffusion', 5],
  ['seedance', 5], ['kling', 4], ['画像生成', 4], ['動画生成', 4],
  ['CLI', 4], ['API', 4], ['SDK', 4], ['GitHub', 3], ['git', 3], ['Rust', 4],
  ['Spark', 4], ['JVM', 4], ['オンプレ', 4], ['クラウド', 3], ['wallet', 3],
  ['JPYC', 4], ['IPアドレス', 3], ['ネットワーク', 3], ['バグ', 4], ['脆弱性', 5],
  ['セキュリティ', 4], ['ローカル', 2], ['高速', 3], ['コスト', 2],
];

const NOVELTY_SIGNALS = [
  ['リリース', 4], ['公開', 3], ['登場', 4], ['最新', 3], ['新た', 3], ['作りました', 3],
  ['使えば', 2], ['再構築', 3], ['高速', 2], ['削減', 2], ['バグ', 3], ['注意', 2],
];

const LOW_VALUE_SIGNALS = [
  ['月額1円', -4], ['乗り換え', -4], ['ポイント', -3], ['錬金', -4], ['稼げる', -2],
  ['広告', -2], ['成功法則', -3],
];

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });

  const state = readState(statePath);
  const captures = readRawCaptures(rawDir);
  if (captures.length === 0) {
    console.log(`No raw JSON files found in ${rawDir}`);
    return;
  }

  const maxCaptureTime = Math.max(...captures.map((capture) => capture.captureMs));
  const sinceMs = allMode
    ? 0
    : state.lastRunAt
      ? new Date(state.lastRunAt).getTime()
      : maxCaptureTime - sinceHours * 60 * 60 * 1000;

  const processedUrls = new Set(allMode ? [] : state.processedUrls ?? []);
  const candidates = dedupePosts(captures)
    .filter((post) => allMode || post.captureMs >= sinceMs)
    .filter((post) => includePromoted || !post.promoted)
    .map((post) => ({ ...post, score: scorePost(post) }))
    .filter((post) => post.score >= Number(args['min-score'] ?? 5))
    .filter((post) => allMode || !processedUrls.has(post.url))
    .sort((a, b) => b.score - a.score || b.captureMs - a.captureMs);

  const generatedAt = new Date();
  const topPosts = candidates.slice(0, Number(args.limit ?? 12));
  const markdown = renderMarkdown({
    generatedAt,
    captures,
    posts: topPosts,
    allMode,
    includePromoted,
    sinceMs,
  });

  const stamp = formatStamp(generatedAt);
  const outputPath = path.join(outDir, `${stamp}.md`);
  const latestPath = path.join(outDir, 'latest.md');
  fs.writeFileSync(outputPath, markdown);
  fs.writeFileSync(latestPath, markdown);

  const nextState = {
    lastRunAt: generatedAt.toISOString(),
    processedUrls: Array.from(new Set([...(state.processedUrls ?? []), ...topPosts.map((post) => post.url)])).slice(-1000),
  };
  if (!allMode) {
    fs.writeFileSync(statePath, JSON.stringify(nextState, null, 2));
  }

  if (notifySlack) {
    await postSlack(topPosts, latestPath);
  }

  console.log(`Wrote ${path.relative(cwd, outputPath)} (${topPosts.length} highlights)`);
  console.log(`Updated ${path.relative(cwd, latestPath)}`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function readState(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function readRawCaptures(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .flatMap((file) => {
      const filePath = path.join(dir, file);
      try {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const capturedAt = json.capture?.captured_at ?? json.capture?.capturedAt;
        const captureMs = capturedAt ? new Date(capturedAt).getTime() : fs.statSync(filePath).mtimeMs;
        return [{
          file,
          capturedAt: capturedAt ?? new Date(captureMs).toISOString(),
          captureMs,
          posts: Array.isArray(json.posts) ? json.posts : [],
        }];
      } catch (error) {
        console.warn(`Skipping unreadable JSON: ${filePath} (${error.message})`);
        return [];
      }
    });
}

function dedupePosts(captures) {
  const byUrl = new Map();
  for (const capture of captures) {
    for (const post of capture.posts) {
      if (!post?.url || !post?.text) continue;
      const url = normalizeUrl(post.url);
      const existing = byUrl.get(url);
      const normalized = {
        ...post,
        url,
        captureFile: capture.file,
        capturedAt: capture.capturedAt,
        captureMs: capture.captureMs,
        searchableText: [
          post.text,
          post.quoted_summary,
          post.external_link,
          Array.isArray(post.media) ? post.media.join(' ') : '',
        ].filter(Boolean).join('\n'),
      };
      if (!existing || normalized.captureMs > existing.captureMs) {
        byUrl.set(url, normalized);
      }
    }
  }
  return Array.from(byUrl.values());
}

function normalizeUrl(url) {
  return String(url).replace(/\?.*$/, '').replace(/\/$/, '');
}

function scorePost(post) {
  const text = post.searchableText.toLowerCase();
  let score = 0;
  for (const [keyword, weight] of TECH_SIGNALS) {
    if (text.includes(keyword.toLowerCase())) score += weight;
  }
  for (const [keyword, weight] of NOVELTY_SIGNALS) {
    if (text.includes(keyword.toLowerCase())) score += weight;
  }
  for (const [keyword, weight] of LOW_VALUE_SIGNALS) {
    if (text.includes(keyword.toLowerCase())) score += weight;
  }
  if (post.truncated) score -= 1;
  if (post.external_link) score += 1;
  if (post.quoted_summary) score += 1;
  if (post.metrics?.bookmarks >= 20) score += 1;
  return score;
}

function renderMarkdown({ generatedAt, captures, posts, allMode, includePromoted, sinceMs }) {
  const latestCapture = captures.reduce((latest, capture) => Math.max(latest, capture.captureMs), 0);
  const sourceFiles = captures.map((capture) => `\`${capture.file}\``).join(', ');
  const windowLabel = allMode ? '全 raw ファイル' : `${new Date(sinceMs).toISOString()} 以降の未処理ポスト`;
  const lines = [
    `# Raw 技術ハイライト (${formatDateTime(generatedAt)})`,
    '',
    `- 対象: ${windowLabel}`,
    `- 最新キャプチャ: ${formatDateTime(new Date(latestCapture))}`,
    `- 入力: ${sourceFiles}`,
    `- promoted: ${includePromoted ? '含める' : '除外'}`,
    '',
  ];

  if (posts.length === 0) {
    lines.push('今回の対象範囲では、新しい技術・実装知見として強く拾うべき投稿はありませんでした。');
    lines.push('');
    return lines.join('\n');
  }

  lines.push('## ハイライト');
  lines.push('');
  for (const [index, post] of posts.entries()) {
    lines.push(`### ${index + 1}. ${titleFor(post)}`);
    lines.push('');
    lines.push(`- 投稿: [${post.author_name ?? post.author_handle} (${post.author_handle ?? 'unknown'})](${post.url})`);
    if (post.external_link) lines.push(`- 参考リンク: ${post.external_link}`);
    lines.push(`- 分類: ${categoryFor(post)}`);
    lines.push(`- なぜ重要か: ${reasonFor(post)}`);
    lines.push(`- 確信度: ${post.truncated ? 'uncertain - raw 側で本文が途切れているため原文確認推奨' : 'likely - raw 本文から判断'}`);
    lines.push(`- 取得: ${formatDateTime(new Date(post.captureMs))} / \`${post.captureFile}\``);
    lines.push('');
    lines.push('> ' + excerpt(post.text));
    if (post.quoted_summary) {
      lines.push('');
      lines.push('引用/参照要約:');
      lines.push('> ' + excerpt(post.quoted_summary));
    }
    lines.push('');
  }

  lines.push('## 運用メモ');
  lines.push('');
  lines.push('- `npm run highlights` で未処理分だけを抽出します。');
  lines.push('- `npm run highlights:all` で `raw/` 全体を再集計します。');
  lines.push('- Slack 通知は `SLACK_WEBHOOK_URL` を設定して `npm run highlights:slack` を実行します。');
  lines.push('- LAN 公開は `npm run highlights:serve` を起動し、同一ネットワーク端末から `http://<このMacのIP>:8787/` にアクセスします。');
  lines.push('');
  return lines.join('\n');
}

function titleFor(post) {
  const parts = post.text.split('\n').map((part) => part.trim()).filter(Boolean);
  const first = parts[0] ?? post.url;
  const second = parts.find((part) => part !== first && /[A-Za-z0-9]|AI|モデル|ツール|CLI|API/.test(part));
  const cleaned = first.length < 18 && second ? `${first} / ${second}` : first.replace(/\s+/g, ' ').trim();
  return cleaned.length > 54 ? `${cleaned.slice(0, 54)}...` : cleaned;
}

function categoryFor(post) {
  const text = post.searchableText.toLowerCase();
  if (hasAny(text, ['stable diffusion', 'seedance', 'kling', '画像生成', '動画生成', 'モデル'])) return 'AI / 生成モデル';
  if (hasAny(text, ['claude', 'codex', 'gpt', 'mcp', 'エージェント'])) return 'AI エージェント / 開発支援';
  if (hasAny(text, ['rust', 'spark', 'jvm', 'オンプレ', 'クラウド'])) return 'インフラ / データ基盤';
  if (hasAny(text, ['バグ', '脆弱性', 'セキュリティ'])) return 'セキュリティ / 運用リスク';
  if (hasAny(text, ['cli', 'api', 'wallet', 'jpyc'])) return '開発ツール / FinTech';
  if (hasAny(text, ['ipアドレス', 'ネットワーク'])) return 'ネットワーク';
  return '技術トピック';
}

function reasonFor(post) {
  const text = post.searchableText.toLowerCase();
  const reasons = [];
  if (hasAny(text, ['リリース', '公開', '登場', '作りました', '最新'])) {
    reasons.push('新規リリースまたは新モデル/新ツールの情報');
  }
  if (hasAny(text, ['高速', '削減', '倍', '%', 'コスト'])) {
    reasons.push('性能・コスト改善の示唆がある');
  }
  if (hasAny(text, ['cli', 'api', 'mcp', 'wallet'])) {
    reasons.push('自動化やエージェント連携に使える接点がある');
  }
  if (hasAny(text, ['バグ', '脆弱性', 'セキュリティ', '課金'])) {
    reasons.push('運用時に確認すべきリスク情報を含む');
  }
  if (hasAny(text, ['オンプレ', 'クラウド', 'rust', 'spark', 'jvm'])) {
    reasons.push('アーキテクチャ選定や基盤コストに関係する');
  }
  return reasons.length > 0 ? reasons.join(' / ') : '技術選定・実装アイデアの材料になる';
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function excerpt(text) {
  return String(text).replace(/\s+/g, ' ').trim().slice(0, 260);
}

function formatStamp(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Tokyo',
  }).format(date);
}

async function postSlack(posts, latestPath) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL is not set; skipped Slack notification.');
    return;
  }
  const text = posts.length === 0
    ? `Raw 技術ハイライト: 新規ハイライトなし\n${latestPath}`
    : [
        `Raw 技術ハイライト: ${posts.length}件`,
        ...posts.slice(0, 5).map((post, index) => `${index + 1}. ${titleFor(post)}\n${post.url}`),
        latestPath,
      ].join('\n');
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error(`Slack notification failed: ${response.status} ${await response.text()}`);
  }
}
