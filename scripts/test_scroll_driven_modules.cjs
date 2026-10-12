const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\5d19c7ee-37b4-4174-8e6b-07c3757baf63';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Mark loader as seen
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('softcare_loader_seen', 'true');
    });

    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    // Get position of #modules container
    const modulesOffset = await page.evaluate(() => {
      const el = document.getElementById('modules');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        top: rect.top + scrollTop,
        height: el.offsetHeight
      };
    });

    console.log('Modules container offset:', modulesOffset);

    // Frame 1: Exactly at the beginning of modules section (0% progress -> Module 01)
    await page.evaluate((top) => {
      window.scrollTo({ top, behavior: 'instant' });
    }, modulesOffset.top);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'modules_scroll_step1.png'),
      fullPage: false
    });
    console.log('Saved modules_scroll_step1.png (0% progress)');

    // Frame 2: Halfway through the container (50% progress -> Module 03)
    await page.evaluate((pos) => {
      const scrollable = pos.height - window.innerHeight;
      window.scrollTo({ top: pos.top + scrollable * 0.5, behavior: 'instant' });
    }, modulesOffset);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'modules_scroll_step2.png'),
      fullPage: false
    });
    console.log('Saved modules_scroll_step2.png (50% progress)');

    // Frame 3: Near the end of the container (95% progress -> Module 05)
    await page.evaluate((pos) => {
      const scrollable = pos.height - window.innerHeight;
      window.scrollTo({ top: pos.top + scrollable * 0.95, behavior: 'instant' });
    }, modulesOffset);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'modules_scroll_step3.png'),
      fullPage: false
    });
    console.log('Saved modules_scroll_step3.png (95% progress)');

    console.log('All scroll-driven captures successful!');
  } catch (err) {
    console.error('Error in test:', err);
  } finally {
    await browser.close();
  }
}

run();
