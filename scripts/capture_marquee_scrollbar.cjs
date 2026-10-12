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
    await page.setViewport({ width: 1440, height: 950 });

    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    // Wait for the loader to finish if present
    await new Promise(r => setTimeout(r, 2600));

    // Scroll to modules section
    const modulesFound = await page.evaluate(() => {
      const el = document.getElementById('modules');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      }
      return false;
    });

    console.log('Found modules section:', modulesFound);
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ 
      path: path.join(ARTIFACTS_DIR, 'section_modules_marquee.png'),
      fullPage: false 
    });
    console.log('Saved section_modules_marquee.png');

    // Also capture full view with scrollbar visible
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'page_scrollbar_view.png'),
      fullPage: false
    });
    console.log('Saved page_scrollbar_view.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();
