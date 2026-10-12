const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\5d19c7ee-37b4-4174-8e6b-07c3757baf63';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const consoleErrors = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.toString()));

    // Clear session storage so loader runs on desktop
    await page.evaluateOnNewDocument(() => {
      sessionStorage.clear();
    });

    console.log('[1/4] Enregistrement du cycle de vie du Loader ECG Desktop (1440x900)...');
    await page.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });

    // Attente de l'apparition du loader
    await page.waitForSelector('[role="status"]', { timeout: 3000 });

    // Frame 1 : début du tracé (~20-25%)
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_loader_frame1.png') });
    console.log('✓ Frame 1 (Loader début tracé) capturée');

    // Frame 2 : milieu du tracé (~70-80%)
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_loader_frame2.png') });
    console.log('✓ Frame 2 (Loader tracé ECG + compteur) capturée');

    // Frame 3 : scission en rideau (100%)
    await new Promise(r => setTimeout(r, 900));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_loader_frame3_rideau.png') });
    console.log('✓ Frame 3 (Rideau scindé 50/50) capturée');

    // Attendre la disparition complète du loader du DOM
    console.log('[2/4] Attente de la fin du rideau et de l\'affichage du Header...');
    await page.waitForFunction(() => document.querySelector('[role="status"]') === null, { timeout: 6000 });
    await new Promise(r => setTimeout(r, 500));

    // Capture Desktop Header (Hero en haut, header transparent)
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_desktop_header.png') });
    console.log('✓ Desktop Header transparent capturé');

    // Scroll de 450px vers le bas pour observer le header sombre et la barre de défilement turquoise
    await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_desktop_scrolled_header.png') });
    console.log('✓ Desktop Header scrollé (fond sombre + jauge turquoise) capturé');

    // [3/4] Tablette (768x1024)
    console.log('[3/4] Capture Tablette (768x1024)...');
    const tabletPage = await browser.newPage();
    await tabletPage.setViewport({ width: 768, height: 1024 });
    // On marque le loader comme déjà vu pour avoir la vue directe du header
    await tabletPage.evaluateOnNewDocument(() => {
      sessionStorage.setItem('softcare_loader_seen', 'true');
    });
    await tabletPage.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    await tabletPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_tablet_header.png') });
    console.log('✓ Tablette Header capturé');

    // [4/4] Mobile (390x844)
    console.log('[4/4] Capture Mobile (390x844)...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844 });
    await mobilePage.evaluateOnNewDocument(() => {
      sessionStorage.setItem('softcare_loader_seen', 'true');
    });
    await mobilePage.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_mobile_header.png') });
    console.log('✓ Mobile Header capturé');

    // Test de l'ouverture du menu mobile
    const burgerBtn = await mobilePage.$('button[aria-label="Ouvrir le menu"]');
    if (burgerBtn) {
      await burgerBtn.click();
      await new Promise(r => setTimeout(r, 400));
      await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, 'section1_mobile_menu_open.png') });
      console.log('✓ Mobile Menu ouvert capturé');
    }

    console.log('\n--- Bilan Console ---');
    console.log(`Erreurs Javascript détectées : ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(e => console.log('  !', e));
    } else {
      console.log('✓ Console propre (0 erreur Javascript).');
    }

  } catch (err) {
    console.error('Erreur :', err);
  } finally {
    await browser.close();
    console.log('=== Fin de la capture Section 1 ===');
  }
}

run();
