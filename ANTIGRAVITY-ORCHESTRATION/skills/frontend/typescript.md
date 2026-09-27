# PURPOSE
Sécuriser le développement frontend grâce au typage statique strict, éliminer les erreurs de typage au moment de la compilation et documenter nativement les contrats d'échange.

# WHEN TO USE
- Dans l'intégralité du code frontend (composants, hooks, utilitaires, services d'API).

# PRINCIPLES
- **Typage Strict sans Concession** : Activer `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
- **Inférence Intelligente** : Laisser TypeScript inférer les types simples, expliciter les types aux frontières du système (props, retours d'API).
- **Types Algébriques & Discriminated Unions** : Modéliser les états exclusifs par des unions discriminées.

# BEST PRACTICES
- Bannir formellement le mot-clé `any` ; utiliser `unknown` couplé à des Type Guards si le type est imprévisible.
- Utiliser les Utility Types standards (`Partial<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`).
- Typer précisément les props des composants React avec des interfaces ou types dédiés.

# COMMON MISTAKES
- Abuser de l'opérateur de cast `as` (Type Assertion) pour masquer une erreur de conception de type.
- Dupliquer manuellement des types déjà disponibles dans les contrats backend.
- Utiliser le type `Function` ou `object` générique au lieu de signatures explicites.

# WORKFLOW
1. Définir les types fondamentaux du domaine et les schémas de données.
2. Typer les réponses d'API et valider les données entrantes (ex: via Zod).
3. Déclarer les interfaces des composants React (`Props`).
4. Vérifier la compilation via `tsc --noEmit`.

# CHECKLIST
- [ ] Le fichier `tsconfig.json` a-t-il `strict: true` activé ?
- [ ] Aucun `any` n'est-il présent dans la base de code ?
- [ ] Les états complexes sont-ils représentés par des unions discriminées ?

# EXAMPLES
Union discriminée pour la gestion d'état réseau :
```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderContent<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle': return null;
    case 'loading': return <Spinner />;
    case 'success': return <DataView data={state.data} />;
    case 'error': return <ErrorMessage message={state.error.message} />;
  }
}
```