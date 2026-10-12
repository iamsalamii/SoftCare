const puppeteer = require('puppeteer-core');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('softcare_loader_seen', 'true');
    });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    const result = await page.evaluate(async () => {
      // Fix html and body in memory to test
      document.documentElement.style.overflowX = 'visible';
      document.body.style.overflowX = 'clip';
      document.documentElement.style.scrollBehavior = 'auto';

      const section = document.getElementById('modules');
      const stickyEl = document.querySelector('#modules > div');
      const sectionTop = section.offsetTop;

      // Scroll to 500px into section
      window.scrollTo({ top: sectionTop + 600, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 100));

      const rect = stickyEl.getBoundingClientRect();
      const scrollY = window.scrollY;

      return {
        sectionTop,
        targetScroll: sectionTop + 600,
        actualScrollY: scrollY,
        stickyElTop: rect.top,
        stickyPosition: window.getComputedStyle(stickyEl).position
      };
    });

    console.log('Test result:', JSON.stringify(result, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

run();
