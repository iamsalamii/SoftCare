const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\5d19c7ee-37b4-4174-8e6b-07c3757baf63';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Clear sessionStorage before navigating
  await page.evaluateOnNewDocument(() => {
    sessionStorage.clear();
  });

  console.log('Navigating...');
  // Do not wait for networkidle, just domcontentloaded so we catch the loader in action
  const navPromise = page.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });

  // Wait 400ms for React hydration
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_loader_frame1.png') });
  console.log('Captured frame 1 (initial load)');

  // Wait 1000ms more (progress ~60%)
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_loader_frame2.png') });
  console.log('Captured frame 2 (mid load)');

  // Wait 1300ms more (progress 100% and curtain opening)
  await new Promise(r => setTimeout(r, 1300));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_loader_frame3_rideau.png') });
  console.log('Captured frame 3 (curtain open)');

  // Wait for loader to fully dismiss (1000ms)
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_desktop_header.png') });
  console.log('Captured desktop header');

  // Scroll down 400px to see header darkening and scroll indicator
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_desktop_scrolled_header.png') });
  console.log('Captured scrolled desktop header');

  await browser.close();
}

test();
