import { chromium } from 'playwright';
import fs from 'fs';

const SEARCHES = [
  {
    label: '512GB — 出品中',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+512GB&_sop=15',
    file: 'screenshot_512gb_active.png',
  },
  {
    label: '512GB — 成約済み',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+512GB&LH_Sold=1&LH_Complete=1&_sop=13',
    file: 'screenshot_512gb_sold.png',
  },
  {
    label: '256GB — 出品中',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+256GB&_sop=15',
    file: 'screenshot_256gb_active.png',
  },
  {
    label: '256GB — 成約済み',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+256GB&LH_Sold=1&LH_Complete=1&_sop=13',
    file: 'screenshot_256gb_sold.png',
  },
];

const SCREENSHOT_DIR = 'screenshots';
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    viewport: { width: 1440, height: 900 },
  });

  const allResults = {};

  for (const { label, url, file } of SEARCHES) {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);

      // Screenshot
      const screenshotPath = `${SCREENSHOT_DIR}/${file}`;
      await page.screenshot({ path: screenshotPath, fullPage: false });

      // Extract items using broad text-based approach
      const items = await page.evaluate(() => {
        const results = [];
        const allLi = document.querySelectorAll('.srp-results li');

        for (const li of allLi) {
          // Skip nav/filter items
          if (li.classList.contains('srp-river-answer') || li.classList.contains('s-item--watch-at-corner')) continue;

          // Get all text content
          const allText = li.innerText || '';
          if (!allText || allText.length < 10) continue;

          // Find price pattern: ¥xxx,xxx or $xx,xxx or JPY xxx or "円"
          const priceMatch = allText.match(/[\d,]+\s*円|¥[\d,]+|\$[\d,]+\.?\d*/g);
          if (!priceMatch) continue;

          // Get link
          const link = li.querySelector('a[href*="/itm/"]')?.href ?? '';
          if (!link) continue;

          // Get a title line (first non-empty line)
          const lines = allText.split('\n').map(l => l.trim()).filter(Boolean);
          const title = lines.find(l => l.length > 10 && !l.match(/^[\d,¥$円]+$/) && !l.includes('ポジティブ') && !l.includes('件の入札')) ?? lines[0];

          // Get condition
          const condMatch = allText.match(/新品|中古|未開封|オープンボックス|Brand New|Used|Open Box/);

          results.push({
            title: title?.slice(0, 120) ?? '',
            prices: priceMatch.join(' / '),
            condition: condMatch?.[0] ?? '',
            link,
            rawLines: lines.slice(0, 8).join(' | '),
          });
        }
        return results;
      });

      allResults[label] = items;
    } catch (e) {
      allResults[label] = [{ error: e.message }];
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Print results
  for (const [label, items] of Object.entries(allResults)) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`【${label}】`);
    console.log('='.repeat(70));
    if (!items || !items.length) { console.log('  (結果なし)'); continue; }
    for (const item of items) {
      if (item.error) { console.log(`  ERROR: ${item.error}`); continue; }
      console.log(`  💰 ${item.prices}  [${item.condition}]`);
      console.log(`     ${item.title}`);
      console.log(`     → ${item.link}`);
      console.log(`     raw: ${item.rawLines}`);
      console.log('');
    }
  }
}

scrape().catch(console.error);
