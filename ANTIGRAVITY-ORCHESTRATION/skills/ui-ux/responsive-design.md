# PURPOSE
Créer des interfaces web qui s'adaptent harmonieusement et fluidement à toutes les tailles d'écran (Mobile, Tablette, Desktop, Écrans larges).

# WHEN TO USE
- Pour chaque vue, layout ou composant développé avec React et Tailwind CSS.

# PRINCIPLES
- **Mobile-First** : Concevoir d'abord pour les petits écrans, puis enrichir la mise en page pour les écrans plus larges au moyen des breakpoints.
- **Fluidité & Flexibilité** : Utiliser des unités relatives, Flexbox et CSS Grid plutôt que des largeurs fixes en pixels.
- **Adaptation des Interactions** : Prendre en compte les cibles tactiles sur mobile (minimum 44x44px) et le survol à la souris sur desktop.

# BEST PRACTICES
- Exploiter les breakpoints standards de Tailwind CSS (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
- Réorganiser les colonnes de grille : 1 colonne sur mobile (`grid-cols-1`), 2 colonnes sur tablette (`md:grid-cols-2`), 3 ou 4 sur grand écran (`lg:grid-cols-3`).
- Remplacer les barres de navigation complexes par des menus déroulants ou tiroirs accessibles sur mobile.

# COMMON MISTAKES
- Concevoir exclusivement sur grand écran d'ordinateur et constater l'inutilisabilité totale sur smartphone.
- Bloquer le zoom utilisateur avec `user-scalable=no` dans la balise viewport (désastreux pour l'accessibilité).
- Laisser du texte déborder horizontalement en dehors de l'écran causant un scroll horizontal indésirable.

# WORKFLOW
1. Concevoir la disposition mobile (empilement vertical simple).
2. Ajouter les préfixes Tailwind pour les écrans intermédiaires (`md:`) et larges (`lg:`).
3. Tester dans l'émulateur mobile des DevTools avec différentes résolutions.
4. Ajuster la taille des textes et espacements pour la lisibilité sur petit écran.
5. Valider sur un appareil tactile réel.

# CHECKLIST
- [ ] La page ne présente-t-elle aucun débordement horizontal intempestif sur mobile (320px de large) ?
- [ ] Les éléments cliquables ont-ils une taille minimale suffisante pour le doigt ?
- [ ] La hiérarchie typographique reste-t-elle équilibrée sur toutes les résolutions ?

# EXAMPLES
Grille responsive avec Tailwind CSS :
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8">
  <div className="bg-white rounded-xl shadow p-6">Carte 1</div>
  <div className="bg-white rounded-xl shadow p-6">Carte 2</div>
  <div className="bg-white rounded-xl shadow p-6">Carte 3</div>
</div>
```