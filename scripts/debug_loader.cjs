const puppeteer = require('puppeteer-core');

async function debug() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  const info = await page.evaluate(() => {
    const loader = document.querySelector('[role="status"]');
    if (!loader) return 'NO_LOADER';
    const content = loader.children[2];
    const topBar = content.children[0];
    const centerBox = content.children[1];
    const bottomBar = content.children[2];
    const getR = el => el ? {
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().bottom,
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height
    } : null;
    return {
      loader: getR(loader),
      content: getR(content),
      topBar: getR(topBar),
      centerBox: getR(centerBox),
      bottomBar: getR(bottomBar),
      centerText: centerBox ? centerBox.innerText : null,
      bottomText: bottomBar ? bottomBar.innerText : null
    };
  });

  console.log('LAYOUT INFO:', JSON.stringify(info, null, 2));
  await browser.close();
}

debug();
