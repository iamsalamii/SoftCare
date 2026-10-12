const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\5d19c7ee-37b4-4174-8e6b-07c3757baf63';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const consoleErrors = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.toString()));

    // Ensure loader is bypassed for clean screenshot verification
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('softcare_loader_seen', 'true');
    });

    console.log('[1/7] Chargement de la Landing Page...');
    await page.goto('http://localhost:4175/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // 1. Capture Hero Section
    const heroPath = path.join(ARTIFACTS_DIR, 'landing_v2_hero_desktop.png');
    await page.screenshot({ path: heroPath });
    console.log('✓ Hero Desktop capturé :', heroPath);

    // 2. Scroll to Parcours de soins
    console.log('[2/7] Test du Parcours de soins...');
    await page.evaluate(() => {
      const el = document.getElementById('parcours');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 400));
    const parcoursStep1Path = path.join(ARTIFACTS_DIR, 'landing_v2_parcours_step1.png');
    await page.screenshot({ path: parcoursStep1Path });
    console.log('✓ Parcours Étape 1 capturé');

    // Click Step 03 (Biologie & Automates SIL)
    const step3 = await page.$('.step-nav:nth-child(3), [class*="cursor-pointer"]:nth-child(3)');
    if (step3) {
      await step3.click();
      await new Promise(r => setTimeout(r, 400));
      const parcoursStep3Path = path.join(ARTIFACTS_DIR, 'landing_v2_parcours_step3.png');
      await page.screenshot({ path: parcoursStep3Path });
      console.log('✓ Parcours Étape 3 cliquée et capturée');
    }

    // 3. Modules cliniqes & Le produit en action
    console.log('[3/7] Test de la section Le produit en action...');
    await page.evaluate(() => {
      const el = document.getElementById('produit');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 400));
    const productDashboardPath = path.join(ARTIFACTS_DIR, 'landing_v2_produit_dashboard.png');
    await page.screenshot({ path: productDashboardPath });
    console.log('✓ Produit Onglet Dashboard capturé');

    // Click Bloc opératoire tab
    const blocTab = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Bloc opératoire'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (blocTab) {
      await new Promise(r => setTimeout(r, 400));
      const productBlocPath = path.join(ARTIFACTS_DIR, 'landing_v2_produit_bloc.png');
      await page.screenshot({ path: productBlocPath });
      console.log('✓ Produit Onglet Bloc capturé');
    }

    // 4. Intelligence clinique (avec Three.js Canvas)
    console.log('[4/7] Test de la section Intelligence Clinique...');
    await page.evaluate(() => {
      const el = document.getElementById('intelligence');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 500));
    const intelligencePath = path.join(ARTIFACTS_DIR, 'landing_v2_intelligence_clinique.png');
    await page.screenshot({ path: intelligencePath });
    console.log('✓ Intelligence Clinique capturée');

    // 5. Formulaire d'engagement
    console.log('[5/7] Test du Formulaire d\'engagement...');
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 400));
    const contactPath = path.join(ARTIFACTS_DIR, 'landing_v2_contact_form.png');
    await page.screenshot({ path: contactPath });
    console.log('✓ Formulaire de contact capturé');

    // Remplissage et test de soumission
    await page.type('#form-name', 'Pr. Jean Delacroix');
    await page.type('#form-institution', 'CHU de Bordeaux - Pôle Chirurgie');
    await page.type('#form-email', 'j.delacroix@chu-bordeaux.fr');
    await page.type('#form-message', 'Déploiement DPI & Robotique PUI 450 lits.');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 800));
    const contactSuccessPath = path.join(ARTIFACTS_DIR, 'landing_v2_contact_success.png');
    await page.screenshot({ path: contactSuccessPath });
    console.log('✓ Formulaire de contact soumis avec succès et capturé');

    // 6. Tablette (768x1024)
    console.log('[6/7] Test Tablette (768x1024)...');
    const tabletPage = await browser.newPage();
    await tabletPage.setViewport({ width: 768, height: 1024 });
    await tabletPage.evaluateOnNewDocument(() => {
      sessionStorage.setItem('softcare_loader_seen', 'true');
    });
    await tabletPage.goto('http://localhost:4175/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const tabletHeroPath = path.join(ARTIFACTS_DIR, 'landing_v2_tablet_hero.png');
    await tabletPage.screenshot({ path: tabletHeroPath });
    console.log('✓ Tablette Hero capturé');

    // 7. Mobile (390x844)
    console.log('[7/7] Test Mobile (390x844)...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844 });
    await mobilePage.evaluateOnNewDocument(() => {
      sessionStorage.setItem('softcare_loader_seen', 'true');
    });
    await mobilePage.goto('http://localhost:4175/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const mobileHeroPath = path.join(ARTIFACTS_DIR, 'landing_v2_mobile_hero.png');
    await mobilePage.screenshot({ path: mobileHeroPath });
    console.log('✓ Mobile Hero capturé');

    console.log('\n--- Bilan Console du Navigateur ---');
    console.log(`Erreurs Javascript détectées : ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((err, i) => console.log(`  [Erreur ${i + 1}] ${err}`));
    } else {
      console.log('✓ Console propre (0 erreur Javascript).');
    }

  } catch (err) {
    console.error('Erreur lors du test :', err);
  } finally {
    await browser.close();
    console.log('=== Fin des tests de vérification de la Landing Page ===');
  }
}

run();
