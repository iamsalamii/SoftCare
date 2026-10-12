const puppeteer = require('puppeteer-core');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    page.on('pageerror', err => consoleLogs.push('PAGE_ERR: ' + err.toString()));

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const domInfo = await page.evaluate(() => {
      const root = document.getElementById('root');
      const loader = document.querySelector('[role="status"]');
      const opacityDiv = document.querySelector('.transition-opacity');
      return {
        rootInnerHtmlLength: root ? root.innerHTML.length : 0,
        hasLoader: Boolean(loader),
        opacityDivClasses: opacityDiv ? opacityDiv.className : null,
        loaderSeen: sessionStorage.getItem('softcare_loader_seen')
      };
    });

    console.log('Console logs:', consoleLogs);
    console.log('DOM Info:', domInfo);

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

run();
