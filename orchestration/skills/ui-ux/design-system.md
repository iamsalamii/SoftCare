# PURPOSE
Structurer un ensemble cohérent de design tokens, de composants graphiques et de règles stylistiques pour garantir une expérience utilisateur uniforme et accélérer le développement front-end.

# WHEN TO USE
- Dès le début du projet web et tout au long de la création des composants React et styles Tailwind CSS.

# PRINCIPLES
- **Source Unique de Vérité (Design Tokens)** : Centraliser les variables fondamentales (couleurs, typographies, espacements, ombres, rayons de bordure).
- **Cohérence Systémique** : Deux boutons ou formulaires de même importance hiérarchique doivent avoir la même apparence et le même comportement partout.
- **Accessibilité Native** : Les contrastes, tailles tactiles et indicateurs d'état font partie intégrante du système de design.

# BEST PRACTICES
- Configurer les tokens dans `tailwind.config.js` pour les rendre utilisables via des classes utilitaires prédictibles.
- Définir une échelle de couleurs sémantiques (`primary`, `secondary`, `success`, `warning`, `danger`, `neutral`).
- Documenter les composants réutilisables (Boutons, Cartes, Modales, Badges, Champs de saisie).

# COMMON MISTAKES
- Utiliser des valeurs arbitraires "magiques" (`p-[13px]`, `text-[#4a1234]`) au lieu de respecter l'échelle du design system.
- Concevoir plusieurs variantes de composants sans règle d'usage claire, déroutant l'utilisateur.
- Négliger les états de survol (`hover`), de focus (`focus-visible`) et d'activation (`active`).

# WORKFLOW
1. Définir la palette chromatique et les échelles typographiques.
2. Paramétrer `tailwind.config.js`.
3. Concevoir les composants fondamentaux (Atomes : Button, Input, Badge).
4. Assembler les molécules et organismes (Formulaire, Carte, Navigation).
5. Valider la cohérence visuelle sur l'ensemble des pages.

# CHECKLIST
- [ ] Les couleurs et espacements s'appuient-ils sur les classes Tailwind standard du projet ?
- [ ] Les composants de base proposent-ils des variantes claires (`variant="primary" | "secondary"`) ?
- [ ] Les états interactifs (hover, focus, disabled) sont-ils stylisés ?

# EXAMPLES
Configuration de tokens sémantiques dans `tailwind.config.js` :
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      borderRadius: {
        'card': '0.75rem',
      },
    },
  },
  plugins: [],
};
```