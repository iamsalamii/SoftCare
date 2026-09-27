# PURPOSE
Garantir que les applications web sont utilisables par tous, y compris les personnes en situation de handicap, en se conformant aux directives WCAG 2.1 (niveau AA).

# WHEN TO USE
- Lors de la conception et du développement de tout composant d'interface utilisateur.

# PRINCIPLES
- **Perceptible** : Les informations et composants UI doivent être présentables aux utilisateurs de façons qu'ils puissent percevoir (contraste suffisant, équivalents textuels).
- **Utilisable (Operable)** : Tous les composants interactifs doivent être manipulables au clavier seul.
- **Compréhensible** : Les opérations et informations doivent être claires et prévisibles.
- **Robuste** : Le contenu doit pouvoir être interprété fidèlement par les technologies d'assistance (lecteurs d'écran).

# BEST PRACTICES
- Utiliser en priorité les balises sémantiques HTML5 (`<button>`, `<nav>`, `<main>`, `<header>`, `<dialog>`) avant de recourir à des attributs ARIA.
- Assurer un ratio de contraste d'au moins 4.5:1 pour le texte normal et 3:1 pour le grand texte.
- Maintenir un indicateur de focus visible et contrasté (`focus-visible:ring-2`).
- Fournir des attributs `alt` pertinents sur toutes les images signifiantes (et `alt=""` pour les images décoratives).

# COMMON MISTAKES
- Remplacer un `<button>` par une balise `<div>` avec un `onClick` sans gestion du clavier (Touche Entrée / Espace).
- Masquer arbitrairement l'anneau de focus CSS (`outline: none` sans alternative visible).
- Utiliser des icônes isolées dans des boutons sans fournir de texte accessible (`aria-label` ou classe `sr-only`).

# WORKFLOW
1. Choisir les éléments sémantiques HTML appropriés.
2. Ajouter les labels accessibles (`aria-label`, `<label>`).
3. Tester la navigation séquentielle intégrale à la touche `Tab`.
4. Valider les contrastes de couleurs avec un inspecteur de contraste.
5. Vérifier la lecture avec un lecteur d'écran (NVDA ou VoiceOver).

# CHECKLIST
- [ ] Chaque bouton icône possède-t-il un `aria-label` descriptif ?
- [ ] Tous les champs de saisie ont-ils un label associé ?
- [ ] L'ordre de focus clavier est-il logique et fluide ?
- [ ] Les messages d'état dynamiques utilisent-ils `role="alert"` ou `aria-live="polite"` ?

# EXAMPLES
Bouton d'icône accessible avec Tailwind CSS :
```tsx
<button
  type="button"
  onClick={onClose}
  className="p-2 text-slate-500 hover:text-slate-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
  aria-label="Fermer la boîte de dialogue"
>
  <CloseIcon className="w-5 h-5" aria-hidden="true" />
</button>
```