import { chromium } from 'playwright';
import fs from 'fs';

const SEARCHES = [
  {
    label: '512GB — 出品中（価格安い順）',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+512GB&_sop=15',
    file: 'screenshot_512gb_active.png',
  },
  {
    label: '512GB — 成約済み',
    url: 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+512GB&LH_Sold=1&LH_Complete=1&_sop=13',
    file: 'screenshot_512gb_sold.png',
  },
  {
    label: '256GB — 出品中（価格安い順）',
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
      console.log(`📸 Screenshot saved: ${screenshotPath}`);

      const items = await page.evaluate(() => {
        const listings = [];
        const cards = document.querySelectorAll('.srp-results li');
        for (const card of Array.from(cards).slice(0, 15)) {
          const titleEl = card.querySelector('.s-item__title, [class*="item__title"]');
          const priceEl = card.querySelector('.s-item__price, [class*="item__price"]');
          const condEl = card.querySelector('.SECONDARY_INFO, .s-item__subtitle');
          const dateEl = card.querySelector('.s-item__ended-date, .s-item__listingDate, [class*="ended"]');
          const sellerEl = card.querySelector('.s-item__seller-info-text, [class*="seller"]');
          const linkEl = card.querySelector('a[href*="/itm/"], a.s-item__link');

          const title = titleEl?.textContent?.trim();
          const price = priceEl?.textContent?.trim();
          if (!title || !price || title === 'Shop on eBay') continue;

          listings.push({
            title: title.slice(0, 100),
            price,
            condition: condEl?.textContent?.trim() ?? '',
            soldDate: dateEl?.textContent?.trim() ?? '',
            seller: sellerEl?.textContent?.trim() ?? '',
            link: linkEl?.href ?? '',
          });
        }
        return listings;
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
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${label}`);
    console.log('='.repeat(60));
    if (!items.length) { console.log('  (結果なし)'); continue; }
    for (const item of items) {
      if (item.error) { console.log(`  ERROR: ${item.error}`); continue; }
      console.log(`  💰 ${item.price}  [${item.condition}]`);
      console.log(`     ${item.title}`);
      if (item.soldDate) console.log(`     成約日: ${item.soldDate}`);
      if (item.seller) console.log(`     出品者: ${item.seller}`);
      if (item.link) console.log(`     ${item.link}`);
      console.log('');
    }
  }

  return allResults;
}

scrape().catch(console.error);
