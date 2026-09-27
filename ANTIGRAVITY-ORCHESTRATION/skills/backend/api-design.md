# PURPOSE
Concevoir des interfaces RESTful intuitives, stables, documentées et conformes aux meilleures pratiques du web moderne.

# WHEN TO USE
- Dès la phase de modélisation de toute nouvelle ressource exposée via HTTP.

# PRINCIPLES
- **Orientation Ressource** : Les URIs identifient des entités, les méthodes HTTP expriment les opérations.
- **Négociation de Contenu** : Support standard du format `application/json` et encodage UTF-8.
- **Gestion Homogène du Statut** : Utilisation cohérente de la gamme de codes de réponse 2xx, 4xx, 5xx.

# BEST PRACTICES
- Respecter le formalisme REST :
  - `GET /api/v1/items` (Liste paginée)
  - `GET /api/v1/items/{id}` (Détail)
  - `POST /api/v1/items` (Création, retourne 201 avec header `Location`)
  - `PUT /api/v1/items/{id}` (Remplacement complet idempotent)
  - `PATCH /api/v1/items/{id}` (Modification partielle)
  - `DELETE /api/v1/items/{id}` (Suppression, retourne 204)
- Documenter systématiquement les paramètres de filtre, tri et pagination.

# COMMON MISTAKES
- Utiliser `GET` pour des opérations modifiant l'état du système.
- Retourner des tableaux JSON bruts en racine au lieu d'objets paginés avec métadonnées (`items`, `totalCount`, `page`).
- Rompre la compatibilité descendante d'une API existante sans changer de version.

# WORKFLOW
1. Identifier les ressources et leurs relations hiérarchiques.
2. Définir les routes et méthodes associées.
3. Rédiger les schémas OpenAPI (Swagger).
4. Définir les codes d'erreur attendus pour chaque point de terminaison.
5. Valider la conception avec les équipes clientes (Frontend).

# CHECKLIST
- [ ] Les noms d'URI sont-ils en minuscules et au pluriel ?
- [ ] Les réponses de création d'entité renvoient-elles bien `201 Created` avec l'URL de la ressource ?
- [ ] Les retours de liste sont-ils paginés pour empêcher le crash par mémoire saturée ?

# EXAMPLES
Structure d'un DTO de réponse paginée :
```csharp
public sealed record PagedResult<T>(
    IReadOnlyList<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount
)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;
}
```