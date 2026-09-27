# PURPOSE
Valider de bout en bout les contrats d'API HTTP, la conformité des statuts, les schémas de payload, les en-têtes et le comportement face aux requêtes malformées.

# WHEN TO USE
- Après le développement ou la modification de tout endpoint d'API REST.

# PRINCIPLES
- **Vérification Contractuelle** : S'assurer que l'API respecte scrupuleusement la spécification OpenAPI / Swagger.
- **Couverture des Statuts HTTP** : Valider les cas 200/201, mais surtout les erreurs 400, 401, 403, 404, 409 et 422.
- **Sécurité et Résilience** : Tester le rejet des requêtes dépassant la taille autorisée ou contenant des types invalides.

# BEST PRACTICES
- Tester l'exactitude des en-têtes de réponse (`Content-Type`, `Cache-Control`, `Location` lors d'une création).
- Vérifier que la structure des erreurs renvoie systématiquement un format ProblemDetails (RFC 7807).
- Automatiser les tests de contrat dans le pipeline de validation.

# COMMON MISTAKES
- Ne vérifier que le code de statut HTTP sans contrôler le contenu ou la structure du JSON retourné.
- Tester uniquement les cas nominaux (Happy Path) en négligeant les erreurs de saisie.
- Laisser passer des endpoints renvoyant des codes 200 pour des suppressions inexistantes.

# WORKFLOW
1. Rédiger la matrice des requêtes HTTP à éprouver (Cas nominaux, Cas d'erreur, Cas limites).
2. Forger les requêtes via un client HTTP automatisé.
3. Valider le code HTTP retourné.
4. Valider le schéma JSON de la réponse.
5. Valider la cohérence des en-têtes retournés.

# CHECKLIST
- [ ] Les retours d'erreur 4xx sont-ils conformes à RFC 7807 ?
- [ ] Les endpoints protégés renvoient-ils bien 401 sans token et 403 avec un token insuffisant ?
- [ ] Les formats de dates retournés sont-ils au standard ISO 8601 ?

# EXAMPLES
Test de validation des erreurs d'API :
```csharp
[Fact]
public async Task CreateUser_WhenEmailInvalid_ReturnsBadRequestWithProblemDetails()
{
    var response = await client.PostAsJsonAsync("/api/v1/users", new { Email = "invalide" });

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    var details = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
    details.Should().NotBeNull();
    details!.Errors.Should().ContainKey("Email");
}
```