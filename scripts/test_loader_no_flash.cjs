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

    // Ensure session storage is clear so loader triggers fresh
    await page.evaluateOnNewDocument(() => {
      sessionStorage.clear();
    });

    console.log('Navigating to http://localhost:5173/ ...');
    
    // Start navigation
    const navPromise = page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

    // Capture at earliest moment (within 100ms of DOM load)
    await navPromise;
    await new Promise(r => setTimeout(r, 80));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'fresh_load_initial_frame.png'),
      fullPage: false
    });
    console.log('Saved fresh_load_initial_frame.png (Initial frame right after DOM load)');

    // Frame at 600ms (loader in full progress)
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'fresh_load_loader_progress.png'),
      fullPage: false
    });
    console.log('Saved fresh_load_loader_progress.png (Loader in progress)');

    // Frame at 3500ms (curtains opened, page revealed)
    await new Promise(r => setTimeout(r, 2900));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'fresh_load_revealed_page.png'),
      fullPage: false
    });
    console.log('Saved fresh_load_revealed_page.png (Page revealed)');

    // Inspect if hero was ever rendered before loader
    const checkState = await page.evaluate(() => {
      return {
        seenInSession: sessionStorage.getItem('softcare_loader_seen'),
        bodyOverflow: document.body.style.overflow
      };
    });
    console.log('Final check state:', checkState);

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
}

run();
