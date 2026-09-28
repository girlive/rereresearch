#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rawDir = path.resolve(process.cwd(), process.argv[2] ?? 'raw');
const files = fs.existsSync(rawDir)
  ? fs.readdirSync(rawDir).filter((file) => /^x_maypdgj_for_you_.*\.json$/.test(file)).sort()
  : [];

let issueCount = 0;

for (const file of files) {
  const filePath = path.join(rawDir, file);
  let json;
  try {
    json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    issue(file, `unreadable JSON: ${error.message}`);
    continue;
  }

  const verification = json.click_verification;
  if (!verification) continue;

  const before = normalizeUrl(verification.top_post_before_click_url);
  const after = normalizeUrl(verification.top_post_after_click_url);
  const buttonAfter = verification.button_after_click_present;
  const clicked = json.clicked_new_posts_button;
  const effective = json.click_effective;
  const absentRechecks = Number(json.button_after_click_absent_rechecks ?? verification.button_after_click_absent_rechecks ?? 0);
  const scrollPasses = Number(json.scroll_passes ?? json.capture?.scroll_passes ?? 0);
  const postCount = Array.isArray(json.posts) ? json.posts.length : 0;

  if (clicked && effective && before && after && before === after) {
    issue(file, 'click_effective=true but top post URL did not change');
  }

  if (clicked && effective && buttonAfter === true) {
    issue(file, 'click_effective=true but new-post button was still present after click');
  }

  if (clicked && effective && json.wait_seconds < 5) {
    issue(file, `click_effective=true but wait_seconds=${json.wait_seconds}; require at least 5`);
  }

  if (clicked && effective && json.click_method === 'accessibility_element') {
    issue(file, 'accessibility_element click cannot be marked effective without coordinate-click verification');
  }

  if (clicked && effective && absentRechecks < 2) {
    issue(file, `click_effective=true but button_after_click_absent_rechecks=${absentRechecks}; require 2`);
  }

  if (clicked && effective && scrollPasses < 5) {
    issue(file, `click_effective=true but scroll_passes=${scrollPasses}; require at least 5`);
  }

  if (clicked && effective && postCount < 10) {
    issue(file, `click_effective=true but only ${postCount} post(s) captured; this looks like visible-window capture`);
  }
}

if (issueCount > 0) {
  console.error(`Found ${issueCount} X raw automation issue(s).`);
  process.exit(1);
}

console.log(`Checked ${files.length} raw file(s); no hard automation issues found.`);

function issue(file, message) {
  issueCount += 1;
  console.error(`ERROR ${file}: ${message}`);
}

function normalizeUrl(url) {
  if (!url) return '';
  return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\?.*$/, '').replace(/\/$/, '');
}
