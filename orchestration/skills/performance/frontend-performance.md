# PURPOSE
Garantir une expérience utilisateur ultra-fluide sur l'interface web React en optimisant les temps de chargement, l'efficacité des rendus et la consommation mémoire du navigateur.

# WHEN TO USE
- Conception et optimisation continue des pages web, composants interactifs et dashboards.

# PRINCIPLES
- **Budget de Performance** : Limiter la taille des assets initiaux (< 200 Ko de JS compressé au premier chargement).
- **Rendus Économes** : Un composant React ne doit se re-rendre que si ses données visuelles propres ont changé.
- **Réduction du Travail sur le Thread Principal** : Éviter les calculs bloquants dans la boucle d'événements JavaScript.

# BEST PRACTICES
- Analyser la fréquence des rendus avec React Developer Tools Profiler.
- Éviter la création de nouvelles références d'objets ou de fonctions dans les props lors de rendus fréquents.
- Optimiser les polices de caractères web (`font-display: swap`, préchargement des polices critiques).

# COMMON MISTAKES
- Mettre en place `React.memo` sur l'ensemble des composants sans analyser si le composant subit réellement des re-rendus coûteux.
- Déclencher des cascades de requêtes HTTP (Waterfall) au lieu d'exécuter les requêtes en parallèle via React Query.
- Laisser des abonnements ou timers actifs après le démontage du composant (`useEffect` cleanup manquant).

# WORKFLOW
1. Enregistrer une session de profilage avec React Profiler.
2. Repérer les composants qui se re-rendent inutilement.
3. Remonter l'état ou isoler les sous-arbres réactifs.
4. Appliquer le code-splitting sur les modules volumineux.
5. Valider la suppression des goulots d'étranglement.

# CHECKLIST
- [ ] Le score Lighthouse Performance dépasse-t-il 90 sur mobile ?
- [ ] Les re-rendus inutiles sont-ils éliminés sur les composants fréquemment sollicités ?
- [ ] Les ressources non critiques sont-elles différées ou chargées à la demande ?

# EXAMPLES
Isolement d'un état réactif pour éviter le re-rendu de l'arbre entier :
```tsx
// Au lieu de mettre l'état du filtre de saisie dans le composant parent qui affiche 1000 items :
export const FilterInput = ({ onFilterChange }: { onFilterChange: (val: string) => void }) => {
  const [val, setVal] = useState('');
  return (
    <input 
      value={val} 
      onChange={(e) => { setVal(e.target.value); onFilterChange(e.target.value); }} 
      className="p-2 border rounded"
    />
  );
};
```