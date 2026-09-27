# PURPOSE
Mettre en œuvre l'inversion de contrôle (IoC) et l'injection de dépendances pour concevoir des composants découplés, modulaires et testables.

# WHEN TO USE
- Dans toute architecture d'application .NET pour câbler les services, repositories, handlers et clients.

# PRINCIPLES
- **Inversion des Dépendances (DIP)** : Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau ; tous deux doivent dépendre d'abstractions.
- **Durées de Vie Maîtrisées** :
  - `Transient` : Nouvelle instance à chaque sollicitation (services légers sans état).
  - `Scoped` : Une instance unique par requête HTTP (DbContext EF Core, services manipulant l'état d'une transaction).
  - `Singleton` : Une instance unique pour toute la durée de vie de l'application (caches mémoire partagés, clients HTTP réutilisables).

# BEST PRACTICES
- Toujours injecter des interfaces plutôt que des classes concrètes.
- Éviter absolument le pattern Anti-Service Locator (`IServiceProvider.GetService()` dans le code métier).
- Surveiller les dépendances captives (ex: injecter un service `Scoped` à l'intérieur d'un `Singleton`).

# COMMON MISTAKES
- Instancier manuellement des services via l'opérateur `new` au sein d'autres services, brisant le découplage.
- Déclarer un `DbContext` en tant que `Singleton` (provoque des crashs de concurrence multithread immédiats).
- Constructeurs comportant plus de 5 ou 6 dépendances (signe d'une violation du principe de responsabilité unique - SRP).

# WORKFLOW
1. Extraire l'interface décrivant le contrat du service.
2. Implémenter la classe concrète.
3. Enregistrer le service dans le conteneur IoC avec la durée de vie adéquate.
4. Injecter l'interface via le constructeur principal (Primary Constructor en C#).
5. Vérifier la résolution au démarrage (`ValidateScopes` et `ValidateOnBuild`).

# CHECKLIST
- [ ] Le conteneur vérifie-t-il les scopes au démarrage (`ValidateScopes = true`) ?
- [ ] Aucun DbContext n'est-il injecté dans un composant Singleton ?
- [ ] Toutes les dépendances sont-elles injectées via les constructeurs ?

# EXAMPLES
Enregistrement et injection propre avec Primary Constructor :
```csharp
// Enregistrement
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderProcessingService, OrderProcessingService>();

// Utilisation
public sealed class OrderProcessingService(
    IOrderRepository orderRepository,
    ILogger<OrderProcessingService> logger
) : IOrderProcessingService
{
    public async Task ProcessAsync(Guid orderId, CancellationToken ct)
    {
        // ...
    }
}
```