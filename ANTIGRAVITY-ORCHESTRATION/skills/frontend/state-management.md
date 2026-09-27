# PURPOSE
Orchestrer et synchroniser les différents types d'états dans une application React de manière prévisible, économe en ressources et sans complexité superflue.

# WHEN TO USE
- Gestion des interactions utilisateur, des filtres, des formulaires et de la synchronisation des données serveur.

# PRINCIPLES
- **Typologie des États** :
  - *Server State* : Données distantes asynchrones (gérées par React Query / TanStack Query).
  - *Client State Local* : Modales, menus ouverts, champs d'un formulaire (gérés par `useState` / `useReducer`).
  - *Client State Global* : Thème sombre, session utilisateur, préférences globales (gérés par Zustand ou React Context ciblé).
  - *URL State* : Filtres, pagination, tri (gérés dans les query parameters de l'URL pour être partageables).

# BEST PRACTICES
- Ne jamais stocker dans un state global ce qui peut être résolu au niveau de l'URL ou du cache serveur.
- Utiliser TanStack Query pour éliminer le besoin de manipuler manuellement `loading`, `error` et `data` lors des requêtes HTTP.
- Découper les contextes React pour éviter que le moindre changement n'entraîne un re-rendu de l'application entière.

# COMMON MISTAKES
- Mettre toutes les données serveur dans Redux ou Zustand avec des actions manuelles répétitives.
- Dupliquer une valeur dérivable : stocker `firstName`, `lastName` ET `fullName` dans le state.
- Créer des états désynchronisés de l'URL pour les filtres et recherches.

# WORKFLOW
1. Analyser l'état : est-il serveur, local, partagé ou lié à l'URL ?
2. Si serveur : implémenter une requête `useQuery` / `useMutation` avec TanStack Query.
3. Si local : utiliser `useState`.
4. Si complexe et multi-champs : structurer avec `useReducer`.
5. Si partagé à travers l'application : créer un store Zustand minimaliste.

# CHECKLIST
- [ ] Les données distantes exploitent-elles le cache et l'invalidation automatique de React Query ?
- [ ] Aucun calcul dérivé n'est-il inutilement dupliqué dans un state ?
- [ ] Les filtres de recherche sont-ils synchronisés avec l'URL ?

# EXAMPLES
Custom hook avec TanStack Query pour la gestion d'état serveur :
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createOrderMutation = useMutation({
    mutationFn: (newOrder: CreateOrderDto) => api.post('/orders', newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return { ordersQuery, createOrderMutation };
}
```