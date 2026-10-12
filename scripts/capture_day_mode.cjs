const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\5d19c7ee-37b4-4174-8e6b-07c3757baf63';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for ECG loader to reveal page
  await new Promise(r => setTimeout(r, 2600));

  const screenshotHero = path.join(ARTIFACTS_DIR, 'day_mode_hero.png');
  await page.screenshot({ path: screenshotHero });
  console.log('Hero screenshot captured:', screenshotHero);

  // Scroll to modules section
  await page.evaluate(() => {
    const el = document.getElementById('modules');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy(0, 450);
    }
  });

  await new Promise(r => setTimeout(r, 800));

  const screenshotModules = path.join(ARTIFACTS_DIR, 'day_mode_modules.png');
  await page.screenshot({ path: screenshotModules });
  console.log('Modules screenshot captured:', screenshotModules);

  // Scroll to Le Produit
  await page.evaluate(() => {
    const el = document.getElementById('produit');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });

  await new Promise(r => setTimeout(r, 800));

  const screenshotProduct = path.join(ARTIFACTS_DIR, 'day_mode_produit.png');
  await page.screenshot({ path: screenshotProduct });
  console.log('Product screenshot captured:', screenshotProduct);

  await browser.close();
  console.log('Finished capturing all day mode views.');
})();
