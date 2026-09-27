# PURPOSE
Documenter de manière exhaustive, interactive et conforme aux standards de l'industrie (OpenAPI v3 / Swagger) les points de terminaison d'API REST.

# WHEN TO USE
- Pour chaque Web API exposée, interne ou publique.

# PRINCIPLES
- **Contrat Vivant (Single Source of Truth)** : Générer ou synchroniser la documentation à partir du code et des modèles typés.
- **Exhaustivité des Réponses** : Documenter les statuts de succès mais également l'ensemble des erreurs possibles (400, 401, 403, 404, 409, 500).
- **Exemples Reproductibles** : Fournir des exemples réalistes de payloads JSON pour chaque cas.

# BEST PRACTICES
- Annoter les contrôleurs et Minimal APIs en ASP.NET Core avec les métadonnées OpenAPI (`.Produces<T>()`, `.ProducesProblem()`).
- Documenter le format des réponses d'erreur selon la RFC 7807 (ProblemDetails).
- Décrire les exigences d'authentification (Schéma Bearer JWT ou Cookie).

# COMMON MISTAKES
- Omettre de documenter les erreurs de validation 400 et leurs formats.
- Laisser des exemples vides `{}` dans la documentation Swagger générée.
- Ne pas spécifier les contraintes de pagination et de tri sur les endpoints de liste.

# WORKFLOW
1. Configurer Swashbuckle ou les outils OpenAPI natifs de .NET.
2. Annoter les endpoints avec les types de retour et codes HTTP.
3. Fournir des descriptions claires pour chaque paramètre d'entrée.
4. Vérifier l'affichage interactif sur l'interface Swagger UI.
5. Exporter la spécification OpenAPI JSON/YAML pour les consommateurs clients.

# CHECKLIST
- [ ] Tous les codes de retour possibles sont-ils déclarés ?
- [ ] Les schémas de payload d'entrée et de sortie sont-ils typés ?
- [ ] L'authentification requise est-elle précisée pour chaque route ?

# EXAMPLES
Annotation OpenAPI en ASP.NET Core :
```csharp
app.MapPost("/api/v1/orders", CreateOrderHandler)
    .WithName("CreateOrder")
    .WithSummary("Créer une nouvelle commande client")
    .Produces<OrderDto>(StatusCodes.Status201Created)
    .ProducesValidationProblem(StatusCodes.Status400BadRequest)
    .ProducesProblem(StatusCodes.Status401Unauthorized)
    .RequireAuthorization();
```