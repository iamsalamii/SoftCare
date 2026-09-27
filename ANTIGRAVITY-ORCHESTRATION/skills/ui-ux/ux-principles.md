# PURPOSE
Appliquer les lois fondamentales et heuristiques de l'ergonomie logicielle pour concevoir des produits intuitifs, prévisibles et réduisant la fatigue cognitive.

# WHEN TO USE
- Lors de toute décision d'architecture d'information, de cinématique d'écrans et d'interactions.

# PRINCIPLES
- **Loi de Jakob** : Les utilisateurs passent la majeure partie de leur temps sur d'autres applications ; ils attendent que votre application fonctionne de manière similaire aux standards établis.
- **Loi de Fitts** : Le temps requis pour atteindre une cible dépend de sa distance et de sa taille (grossir les boutons d'action majeurs, les rapprocher des zones de pouce).
- **Loi de Hick** : Plus le nombre de choix proposés est grand, plus le temps de décision s'allonge (limiter les options simultanées).
- **Heuristique de Nielsen : Visibilité de l'État du Système** : L'utilisateur doit toujours savoir ce qui se passe (indicateur de chargement, confirmation de sauvegarde).

# BEST PRACTICES
- Prévoir un état vide (Empty State) engageant qui guide l'utilisateur vers sa première action plutôt qu'une table blanche désertique.
- Rendre les erreurs compréhensibles : expliquer ce qui s'est passé, pourquoi, et surtout comment y remédier.
- Demander confirmation pour les actions destructrices et irréversibles (suppression de compte, suppression définitive de données).

# COMMON MISTAKES
- Réinventer des métaphores ou icônes de navigation universellement connues (ex: changer l'icône de loupe pour la recherche).
- Laisser l'écran sans aucun retour visuel pendant un appel asynchrone qui dure plusieurs secondes.
- Masquer les fonctionnalités essentielles derrière des menus imbriqués sur 4 niveaux.

# WORKFLOW
1. Analyser la tâche cible de l'utilisateur.
2. Réduire le nombre de clics et d'étapes au strict minimum.
3. Intégrer les retours d'état (Pending, Success, Error).
4. Fournir des issues de secours (Bouton Annuler, Retour en arrière, Toast d'annulation `Undo`).
5. Valider l'intuitivité du parcours.

# CHECKLIST
- [ ] L'état du système est-il explicite à chaque étape ?
- [ ] Les actions destructrices exigent-elles une confirmation préalable ?
- [ ] Les écrans sans données proposent-ils un Empty State actionnable ?

# EXAMPLES
Exemple d'Empty State soigné et orienté action :
```tsx
<div className="text-center py-12 px-4 border-2 border-dashed border-slate-300 rounded-2xl">
  <FolderPlusIcon className="mx-auto h-12 w-12 text-slate-400" />
  <h3 className="mt-2 text-base font-semibold text-slate-900">Aucun projet trouvé</h3>
  <p className="mt-1 text-sm text-slate-500">Commencez par créer votre premier projet de développement.</p>
  <div className="mt-6">
    <button type="button" onClick={onCreateNew} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
      + Nouveau Projet
    </button>
  </div>
</div>
```