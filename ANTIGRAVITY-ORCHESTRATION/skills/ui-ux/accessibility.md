# PURPOSE
Concevoir l'ergonomie et l'architecture visuelle en intégrant dès la genèse les critères d'accessibilité numérique universelle (WCAG 2.1 AA).

# WHEN TO USE
- Dès la phase de zoning, de choix des couleurs et de définition des parcours utilisateurs.

# PRINCIPLES
- **Non-Exclusivité Visuelle** : Ne jamais véhiculer une information cruciale uniquement par la couleur (ajouter texte, icône ou motif).
- **Navigation Prévisible** : L'ordre séquentiel de lecture et de tabulation doit être logique et naturel.
- **Réduction des Effets Visuels Violents** : Respecter les préférences de réduction de mouvement (`prefers-reduced-motion`).

# BEST PRACTICES
- Vérifier les contrastes de texte avec des outils spécialisés avant d'arrêter un choix graphique.
- Prévoir des zones d'interaction d'au moins 44x44 pixels pour les utilisateurs mobiles ou souffrant de tremblements.
- Fournir des indicateurs de focus distincts et hautement visibles pour les utilisateurs naviguant au clavier.

# COMMON MISTAKES
- Mettre du texte gris clair sur fond blanc (`text-slate-400` sur `bg-white`), illisible pour les personnes malvoyantes.
- Utiliser des animations clignotantes ou trop vives susceptibles de déclencher des crises photosensibles.
- Omettre d'associer un message textuel d'erreur explicite lors de la coloration d'un champ en rouge.

# WORKFLOW
1. Sélectionner une palette respectant le ratio de contraste minimal de 4.5:1.
2. Valider les tailles de texte minimales (pas de texte inférieur à 12px/0.75rem).
3. Vérifier le comportement des composants lors du zoom navigateur à 200%.
4. Tester le flux complet à la touche Tabulation seule.
5. Intégrer les directives dans les spécifications remises au Frontend.

# CHECKLIST
- [ ] Le ratio de contraste texte/fond atteint-il au moins 4.5:1 ?
- [ ] Les erreurs de saisie sont-elles signalées par un texte et une icône, pas seulement par une bordure rouge ?
- [ ] Le focus clavier est-il visible sur chaque élément interactif ?

# EXAMPLES
Composant d'alerte respectant l'accessibilité des statuts :
```tsx
<div className="flex items-center gap-3 p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-md" role="alert">
  <AlertCircleIcon className="w-5 h-5 text-rose-600 flex-shrink-0" aria-hidden="true" />
  <p className="text-sm font-medium text-rose-900">
    <span className="sr-only">Erreur : </span>
    Votre session a expiré. Veuillez vous reconnecter.
  </p>
</div>
```