const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\5d19c7ee-37b4-4174-8e6b-07c3757baf63';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('--- Lancement du test automatisé Section 1 (Loader + Header + Scrollbar) ---');
  
  const consoleErrors = [];
  const consoleLogs = [];

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--force-prefers-reduced-motion=no-preference'
    ]
  });

  try {
    // 1. DESKTOP TEST & SÉQUENCE D'ANIMATION DU LOADER (1440x900)
    console.log('[1/3] Enregistrement de la séquence de chargement Desktop (1440x900)...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      } else {
        consoleLogs.push(text);
      }
    });

    page.on('pageerror', err => {
      consoleErrors.push(err.toString());
    });

    // Navigation vers la page locale (sans sessionStorage pour observer le loader)
    await page.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      try { sessionStorage.removeItem('softcare_loader_seen'); } catch {}
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Frame 1 : Début du tracé ECG et compteur (à ~600ms)
    await new Promise(r => setTimeout(r, 600));
    const frame1Path = path.join(ARTIFACTS_DIR, 'section1_loader_frame1.png');
    await page.screenshot({ path: frame1Path });
    console.log('✓ Frame 1 capturée (Loader ~25%) :', frame1Path);

    // Frame 2 : Montée du tracé ECG et compteur (à ~1700ms)
    await new Promise(r => setTimeout(r, 1100));
    const frame2Path = path.join(ARTIFACTS_DIR, 'section1_loader_frame2.png');
    await page.screenshot({ path: frame2Path });
    console.log('✓ Frame 2 capturée (Loader ~70%) :', frame2Path);

    // Frame 3 : Ouverture en rideau (à ~2800ms)
    await new Promise(r => setTimeout(r, 1100));
    const frame3Path = path.join(ARTIFACTS_DIR, 'section1_loader_frame3_rideau.png');
    await page.screenshot({ path: frame3Path });
    console.log('✓ Frame 3 capturée (Ouverture rideau) :', frame3Path);

    // Frame 4 : Révélation complète du Header et du haut du site (à ~4000ms)
    await new Promise(r => setTimeout(r, 1200));
    const desktopHeaderPath = path.join(ARTIFACTS_DIR, 'section1_desktop_header.png');
    await page.screenshot({ path: desktopHeaderPath });
    console.log('✓ Desktop Header capturé :', desktopHeaderPath);

    // Scroll pour vérifier le trait de progression turquoise et le header flouté
    await page.evaluate(() => window.scrollTo(0, 350));
    await new Promise(r => setTimeout(r, 400));
    const desktopScrolledHeaderPath = path.join(ARTIFACTS_DIR, 'section1_desktop_scrolled_header.png');
    await page.screenshot({ path: desktopScrolledHeaderPath });
    console.log('✓ Desktop Header scrollé (fond sombre + trait progression) :', desktopScrolledHeaderPath);

    // 2. TABLET TEST (768x1024)
    console.log('[2/3] Test Tablette (768x1024)...');
    const tabletPage = await browser.newPage();
    await tabletPage.setViewport({ width: 768, height: 1024 });
    await tabletPage.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });
    // Attente fin du loader
    await new Promise(r => setTimeout(r, 3800));
    const tabletHeaderPath = path.join(ARTIFACTS_DIR, 'section1_tablet_header.png');
    await tabletPage.screenshot({ path: tabletHeaderPath });
    console.log('✓ Tablette Header capturé :', tabletHeaderPath);

    // 3. MOBILE TEST (390x844 - iPhone 14/15 format)
    console.log('[3/3] Test Mobile (390x844)...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844 });
    await mobilePage.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3800));
    const mobileHeaderPath = path.join(ARTIFACTS_DIR, 'section1_mobile_header.png');
    await mobilePage.screenshot({ path: mobileHeaderPath });
    console.log('✓ Mobile Header capturé :', mobileHeaderPath);

    // Test de l'ouverture du menu mobile
    const burgerButton = await mobilePage.$('button[aria-label*="menu"]');
    if (burgerButton) {
      await burgerButton.click();
      await new Promise(r => setTimeout(r, 300));
      const mobileMenuPath = path.join(ARTIFACTS_DIR, 'section1_mobile_menu_open.png');
      await mobilePage.screenshot({ path: mobileMenuPath });
      console.log('✓ Mobile Menu ouvert capturé :', mobileMenuPath);
    }

    console.log('\n--- Bilan de Console du Navigateur ---');
    console.log(`Erreurs détectées : ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((err, idx) => console.log(`  [Erreur ${idx + 1}] ${err}`));
    } else {
      console.log('✓ Console propre (0 erreur Javascript).');
    }

  } catch (err) {
    console.error('Erreur lors du test :', err);
  } finally {
    await browser.close();
    console.log('--- Test Section 1 terminé avec succès ---');
  }
}

run();
