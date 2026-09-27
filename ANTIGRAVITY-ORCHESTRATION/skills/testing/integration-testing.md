# PURPOSE
Vérifier que plusieurs composants logiciels (API, base de données PostgreSQL, ORM, services externes) interagissent correctement ensemble dans un environnement réaliste.

# WHEN TO USE
- Validation des requêtes de persistance, pipelines de middlewares HTTP et flux d'échange inter-composants.

# PRINCIPLES
- **Réalisme** : Tester avec une véritable base de données PostgreSQL (plutôt qu'avec un mock ou une base en mémoire EF Core InMemory irréaliste).
- **Isolation des Tests** : Chaque test doit s'exécuter dans un état propre sans subir les résidus du test précédent.
- **Exécution Automatisée** : Intégration transparente dans le pipeline CI/CD via des conteneurs éphémères.

# BEST PRACTICES
- Utiliser `WebApplicationFactory<Program>` en ASP.NET Core pour instancier l'application en mémoire.
- Utiliser `Testcontainers` pour démarrer automatiquement un conteneur PostgreSQL éphémère lors de la session de tests.
- Nettoyer les tables entre chaque test à l'aide d'outils comme `Respawn`.

# COMMON MISTAKES
- Utiliser le provider InMemory d'EF Core pour tester des requêtes PostgreSQL (InMemory ne supporte ni les transactions réelles, ni les contraintes SQL, ni les types PostgreSQL comme JSONB).
- Laisser des tests dépendre de l'ordre d'exécution alphabétique des méthodes de test.
- Oublier d'attendre la disponibilité complète du conteneur de base avant de lancer les requêtes.

# WORKFLOW
1. Démarrer le conteneur PostgreSQL de test via Testcontainers.
2. Appliquer les migrations de base de données à l'initialisation.
3. Instancier le client HTTP via `WebApplicationFactory`.
4. Envoyer les requêtes HTTP et vérifier les statuts et réponses.
5. Vérifier la persistance effective des données dans la base PostgreSQL.

# CHECKLIST
- [ ] Les tests utilisent-ils un véritable moteur PostgreSQL via conteneur ?
- [ ] La base est-elle réinitialisée entre chaque cas de test ?
- [ ] Le client HTTP teste-t-il la chaîne complète de middlewares ?

# EXAMPLES
Test d'intégration avec WebApplicationFactory et Testcontainers en C# :
```csharp
public class OrderApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public OrderApiTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateOrder_WithValidPayload_ReturnsCreatedAndPersistsData()
    {
        // Arrange
        var request = new CreateOrderRequest(Guid.NewGuid(), 250.00m);

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/orders", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdOrder = await response.Content.ReadFromJsonAsync<OrderDto>();
        createdOrder.Should().NotBeNull();
        createdOrder!.TotalAmount.Should().Be(250.00m);
    }
}
```