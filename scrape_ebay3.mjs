import { chromium } from 'playwright';
import fs from 'fs';

const SEARCHES = [
  {
    label: '512GB — 出品中（価格高い順）',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+512GB&_sop=16',
    file: 'screenshot_512gb_high.png',
  },
  {
    label: '512GB — 成約済み（価格高い順）',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+512GB&LH_Sold=1&LH_Complete=1&_sop=16',
    file: 'screenshot_512gb_sold_high.png',
  },
  {
    label: '256GB — 出品中（価格高い順）',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+256GB&_sop=16',
    file: 'screenshot_256gb_high.png',
  },
  {
    label: '256GB — 成約済み（価格高い順）',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+256GB&LH_Sold=1&LH_Complete=1&_sop=16',
    file: 'screenshot_256gb_sold_high.png',
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

      const screenshotPath = `${SCREENSHOT_DIR}/${file}`;
      await page.screenshot({ path: screenshotPath, fullPage: false });

      const items = await page.evaluate(() => {
        const results = [];
        const allLi = document.querySelectorAll('.srp-results li');

        for (const li of allLi) {
          const allText = li.innerText || '';
          if (!allText || allText.length < 10) continue;

          const priceMatch = allText.match(/[\d,]+\s*円|¥[\d,]+|\$[\s\d,]+\.?\d*/g);
          if (!priceMatch) continue;

          const link = li.querySelector('a[href*="/itm/"]')?.href ?? '';
          if (!link) continue;

          const lines = allText.split('\n').map(l => l.trim()).filter(Boolean);
          const title = lines.find(l =>
            l.length > 10 &&
            !l.match(/^[\d,¥$円\s]+$/) &&
            !l.includes('ポジティブ') &&
            !l.includes('件の入札') &&
            !l.includes('ウィンドウ')
          ) ?? lines[0];

          const condMatch = allText.match(/新品|中古|未開封|オープンボックス|Brand New|Used|Open Box/);
          const soldDate = allText.match(/販売済み品\s*[\d年月日]+/)?.[0] ?? '';
          const seller = allText.match(/[\w.-]+\s+\d+%\s*ポジティブ(?:\s*\(\d+\))?/)?.[0] ?? '';

          results.push({
            title: title?.slice(0, 120) ?? '',
            prices: priceMatch.join(' / '),
            condition: condMatch?.[0] ?? '',
            soldDate,
            seller,
            link,
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

  for (const [label, items] of Object.entries(allResults)) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`【${label}】`);
    console.log('='.repeat(70));
    if (!items || !items.length) { console.log('  (結果なし)'); continue; }
    for (const item of items) {
      if (item.error) { console.log(`  ERROR: ${item.error}`); continue; }
      console.log(`  💰 ${item.prices}  [${item.condition}]`);
      console.log(`     ${item.title}`);
      if (item.soldDate) console.log(`     成約日: ${item.soldDate}`);
      if (item.seller) console.log(`     出品者: ${item.seller}`);
      console.log(`     → ${item.link.slice(0, 80)}`);
      console.log('');
    }
  }
}

scrape().catch(console.error);
