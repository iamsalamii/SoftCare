# PURPOSE
Concevoir des interfaces utilisateur web réactives, déclaratives, modulaires et maintenables en appliquant les patterns modernes de l'écosystème React 18 & 19.

# WHEN TO USE
- Création et évolution d'applications Single Page (SPA) ou de composants web interactifs.

# PRINCIPLES
- **Déclarativité** : Décrire l'interface en fonction de l'état plutôt que manipuler le DOM impérativement.
- **Pureté des Composants** : Les fonctions de rendu doivent être pures (mêmes props/state = même JSX, sans effets secondaires dans le corps du composant).
- **Unidirectionnalité des Flux (One-Way Data Flow)** : Les données descendent via les props, les événements remontent via des callbacks.

# BEST PRACTICES
- Décomposer les vues complexes en composants unitaires réutilisables ayant une seule responsabilité.
- Isoler les effets secondaires impératifs au sein de custom hooks dédiés plutôt que de polluer les composants de présentation.
- Utiliser `Suspense` et les Error Boundaries pour isoler les chargements asynchrones et contenir les pannes locales.

# COMMON MISTAKES
- Muter directement l'état React (`state.push(...)` au lieu de `setState([...state, newItem])`).
- Utiliser abusivement `useEffect` pour synchroniser des états qui peuvent être simplement calculés lors du rendu.
- Omettre ou mal renseigner le tableau de dépendances des hooks (`useEffect`, `useCallback`, `useMemo`).

# WORKFLOW
1. Découper la maquette en une hiérarchie de composants.
2. Déterminer l'état minimal requis et son emplacement optimal dans l'arbre.
3. Implémenter les composants statiques avec TypeScript strict.
4. Ajouter l'interactivité et la gestion d'état.
5. Encapsuler la logique réseau et les effets dans des custom hooks.

# CHECKLIST
- [ ] Tous les composants sont-ils des fonctions pures exemptes d'effets de bord de rendu ?
- [ ] Les clés (`key`) des listes utilisent-elles des identifiants stables et uniques (pas l'index de tableau) ?
- [ ] Les Error Boundaries capturent-ils les exceptions de composants sans écran blanc ?

# EXAMPLES
Exemple de composant avec Custom Hook en TypeScript :
```tsx
interface UserGreetingProps {
  userId: string;
}

export const UserGreeting: React.FC<UserGreetingProps> = ({ userId }) => {
  const { user, isLoading, error } = useUserData(userId);

  if (isLoading) return <div className="animate-pulse h-6 bg-slate-200 rounded w-32" />;
  if (error || !user) return <p className="text-red-600 text-sm">Impossible de charger le profil.</p>;

  return <h1 className="text-xl font-bold text-slate-900">Bienvenue, {user.name} !</h1>;
};
```