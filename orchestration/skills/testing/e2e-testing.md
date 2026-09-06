# PURPOSE
Tester les parcours utilisateurs complets à travers l'interface graphique réelle, les interactions avec le backend et la persistance en base de données.

# WHEN TO USE
- Pour les flux d'affaires critiques (tunnel de commande, inscription/connexion, paiement).

# PRINCIPLES
- **Parcours Utilisateur Réel** : Le test reproduit fidèlement les actions d'un être humain naviguant dans le navigateur web.
- **Sélection par Rôle & Accessibilité** : Sélectionner les éléments d'interface par leurs labels et rôles ARIA (`getByRole('button', { name: 'Valider' })`).
- **Pygmée de Tests** : Maintenir un nombre restreint de tests E2E pour éviter les temps d'exécution excessifs et la fragilité (flakiness).

# BEST PRACTICES
- Utiliser Playwright pour sa rapidité, son support multi-navigateurs et ses mécanismes d'attente automatique (Auto-waiting).
- Isoler les sessions utilisateurs via des contextes de navigation éphémères.
- Exécuter les tests E2E en mode headless dans le pipeline CI/CD avec enregistrement de vidéos et traces en cas d'échec.

# COMMON MISTAKES
- Remplacer tous les tests unitaires et d'intégration par des tests E2E (pyramide de tests inversée / ice cream cone anti-pattern).
- Utiliser des sélecteurs CSS fragiles ou dépendants de classes utilitaires Tailwind volatiles (`.text-indigo-600`).
- Insérer des pauses fixes arbitraires (`waitForTimeout(5000)`) au lieu d'attendre un événement d'interface.

# WORKFLOW
1. Définir le scénario critique à tester.
2. Préparer l'environnement de données de test.
3. Rédiger le script Playwright en ciblant les rôles accessibles.
4. Exécuter le test localement avec visualisation du navigateur.
5. Intégrer le test dans la suite de validation pré-release.

# CHECKLIST
- [ ] Les sélecteurs s'appuient-ils sur les rôles accessibles (`getByRole`, `getByLabel`) ?
- [ ] Le test nettoie-t-il les données créées après exécution ?
- [ ] Le rapport vidéo / trace est-il configuré pour diagnostiquer les échecs ?

# EXAMPLES
Test E2E avec Playwright en TypeScript :
```typescript
import { test, expect } from '@playwright/test';

test('L’utilisateur peut se connecter et accéder à son tableau de bord', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('alice@example.com');
  await page.getByLabel('Mot de passe').fill('MotDePasseRobuste123!');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible();
});
```