#!/usr/bin/env node

import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const cwd = process.cwd();
const outDir = path.resolve(cwd, process.argv[2] ?? 'highlights');
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '0.0.0.0';

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
  if (url.pathname === '/' || url.pathname === '/latest') {
    return sendHtml(response, renderLatest());
  }
  if (url.pathname === '/latest.md') {
    return sendFile(response, path.join(outDir, 'latest.md'), 'text/markdown; charset=utf-8');
  }
  if (url.pathname === '/index') {
    return sendHtml(response, renderIndex());
  }
  response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  response.end('Not found');
});

server.listen(port, host, () => {
  console.log(`Serving ${outDir}`);
  for (const address of lanAddresses()) {
    console.log(`http://${address}:${port}/`);
  }
});

function renderLatest() {
  const markdown = readLatest();
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="300">
  <title>Raw 技術ハイライト</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; line-height: 1.7; background: #f6f7f9; color: #1b1f24; }
    main { max-width: 920px; margin: 0 auto; padding: 32px 20px 56px; background: #fff; min-height: 100vh; }
    h1 { font-size: 28px; line-height: 1.25; margin: 0 0 20px; }
    h2 { margin-top: 32px; border-top: 1px solid #d8dee4; padding-top: 24px; }
    h3 { margin-top: 28px; }
    blockquote { margin: 12px 0; padding: 8px 14px; border-left: 4px solid #8c959f; background: #f6f8fa; }
    code { background: #eef1f4; padding: 2px 5px; border-radius: 4px; }
    a { color: #0969da; }
    .nav { margin-bottom: 18px; font-size: 14px; }
  </style>
</head>
<body>
  <main>
    <div class="nav"><a href="/latest.md">Markdown</a> / <a href="/index">Archive</a></div>
    ${markdownToHtml(markdown)}
  </main>
</body>
</html>`;
}

function renderIndex() {
  const files = fs.existsSync(outDir)
    ? fs.readdirSync(outDir).filter((file) => /^\d{8}-\d{4}\.md$/.test(file)).sort().reverse()
    : [];
  const items = files.map((file) => `<li>${escapeHtml(file)}</li>`).join('\n');
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Archive</title></head><body><main><h1>Archive</h1><ul>${items}</ul></main></body></html>`;
}

function readLatest() {
  const latestPath = path.join(outDir, 'latest.md');
  if (!fs.existsSync(latestPath)) {
    return '# Raw 技術ハイライト\n\nまだ `highlights/latest.md` がありません。`npm run highlights` を実行してください。';
  }
  return fs.readFileSync(latestPath, 'utf8');
}

function sendFile(response, file, contentType) {
  if (!fs.existsSync(file)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, { 'content-type': contentType });
  response.end(fs.readFileSync(file));
}

function sendHtml(response, html) {
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(html);
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n');
  const html = [];
  let inList = false;
  let inQuote = false;
  for (const line of lines) {
    if (line.startsWith('- ')) {
      if (!inList) html.push('<ul>');
      inList = true;
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
    if (line.startsWith('> ')) {
      if (!inQuote) html.push('<blockquote>');
      inQuote = true;
      html.push(`<p>${inline(line.slice(2))}</p>`);
      continue;
    }
    if (inQuote) {
      html.push('</blockquote>');
      inQuote = false;
    }
    if (line.startsWith('# ')) html.push(`<h1>${inline(line.slice(2))}</h1>`);
    else if (line.startsWith('## ')) html.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.startsWith('### ')) html.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.trim() === '') html.push('');
    else html.push(`<p>${inline(line)}</p>`);
  }
  if (inList) html.push('</ul>');
  if (inQuote) html.push('</blockquote>');
  return html.join('\n');
}

function inline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((address) => address && address.family === 'IPv4' && !address.internal)
    .map((address) => address.address);
}
