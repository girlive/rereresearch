import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
  });

  const page = await context.newPage();
  const url = 'https://www.ebay.com/sch/i.html?_nkw=Mac+Studio+M3+Ultra+512GB&_sop=15';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Print page title and a snippet of HTML to understand structure
  const title = await page.title();
  console.log('Page title:', title);

  // Try different selectors
  const selectors = [
    '.s-item',
    '[data-testid="search-results"] li',
    '.srp-results li',
    '.s-item__wrapper',
    'li.s-item',
  ];
  for (const sel of selectors) {
    const count = await page.locator(sel).count();
    console.log(`Selector "${sel}": ${count} elements`);
  }

  // Dump first 2000 chars of body text
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 3000));
  console.log('\n--- Body text sample ---\n', bodyText);

  await browser.close();
}

debug().catch(console.error);
