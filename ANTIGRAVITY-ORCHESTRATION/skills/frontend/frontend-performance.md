# PURPOSE
Optimiser la vitesse de chargement, l'interactivité et la fluidité d'exécution des applications frontend React pour garantir d'excellents scores Core Web Vitals.

# WHEN TO USE
- Dès la phase de conception et lors de l'optimisation continue des parcours utilisateurs critiques.

# PRINCIPLES
- **Optimisation des Core Web Vitals** :
  - *LCP (Largest Contentful Paint)* < 2.5s
  - *INP (Interaction to Next Paint)* < 200ms
  - *CLS (Cumulative Layout Shift)* < 0.1
- **Réduction du Bundle Initial** : Ne charger au démarrage que le code strictement nécessaire à la première vue.
- **Économie de Rendu** : Éviter les calculs et re-rendus inutiles dans l'arbre de composants.

# BEST PRACTICES
- Mettre en œuvre le découpage de code (Code Splitting) via `React.lazy()` et dynamic imports pour les routes.
- Optimiser les images (formats WebP/AVIF, dimensions explicites `width`/`height` pour éviter le CLS, `loading="lazy"`).
- Utiliser la virtualisation de listes (ex: `@tanstack/react-virtual`) pour afficher des jeux de données supérieurs à 100 éléments.
- Mémoïser avec discernement via `useMemo` et `useCallback` uniquement pour des calculs lourds ou des références stables de props.

# COMMON MISTAKES
- Importer des bibliothèques massives (ex: lodash complet ou moment.js) sans optimisation de tree-shaking.
- Mémoïser systématiquement chaque fonction triviale avec `useCallback`, ce qui consomme plus de mémoire que le bénéfice obtenu.
- Ignorer les sauts de mise en page (CLS) causés par des bannières ou des images sans dimensions réservées.

# WORKFLOW
1. Mesurer les performances réelles avec Lighthouse et Chrome DevTools Performance.
2. Analyser la taille des chunks avec un analyseur de bundle (ex: `rollup-plugin-visualizer`).
3. Mettre en place le lazy loading sur les routes et dialogues lourds.
4. Virtualiser les listes infinies et différer le chargement des scripts secondaires.
5. Valider le gain sur un CPU bridé (CPU 4x slowdown).

# CHECKLIST
- [ ] Les routes principales sont-elles découpées avec `React.lazy()` ?
- [ ] Toutes les images ont-elles des dimensions `width` et `height` spécifiées ?
- [ ] Aucune dépendance non "tree-shakeable" n'alourdit-elle le bundle initial ?

# EXAMPLES
Lazy loading d'une route avec Suspense :
```tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/analytics"
      element={
        <Suspense fallback={<div className="p-8 text-center">Chargement du tableau de bord...</div>}>
          <AnalyticsDashboard />
        </Suspense>
      }
    />
  </Routes>
);
```