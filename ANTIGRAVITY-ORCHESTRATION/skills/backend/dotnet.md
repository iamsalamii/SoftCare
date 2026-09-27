# PURPOSE
Exploiter toute la puissance du langage C# et du runtime .NET moderne (.NET 8 & 9) pour produire du code serveur hautement performant, typé, lisible et fiable.

# WHEN TO USE
- Tout développement de logique applicative, services et composants de traitement côté serveur.

# PRINCIPLES
- **Typage Fort et Nullable Reference Types** : Activer `<Nullable>enable</Nullable>` et traiter les warnings nullables comme des erreurs.
- **Asynchronisme Non-Bloquant** : Utiliser `async / await` avec propagation scrupuleuse des `CancellationToken`.
- **Immutabilité par Défaut** : Privilégier les `record` et `readonly struct` pour les modèles de données et DTOs.
- **Gestion Saine de la Mémoire** : Libérer les ressources non managées via `using` et `IDisposable` / `IAsyncDisposable`.

# BEST PRACTICES
- Utiliser le pattern matching avancé (`switch` expressions, property patterns) pour des flux conditionnels limpides.
- Éviter LINQ sur les chemins critiques d'allocation extrême, mais l'exploiter pour la lisibilité sur les traitements métier standards.
- Ne jamais bloquer sur une tâche asynchrone avec `.Result` ou `.Wait()` (risque d'épuisement de thread pool et deadlock).

# COMMON MISTAKES
- Ignorer les avertissements du compilateur sur la nullabilité.
- Utiliser `async void` (à réserver exclusivement aux gestionnaires d'événements UI, jamais en backend).
- Omettre le paramètre `CancellationToken` sur les appels réseau ou de base de données.

# WORKFLOW
1. Configurer le projet avec les dernières options de langage C# et avertissements stricts.
2. Définir les modèles immuables via `record` ou `record struct`.
3. Écrire la logique asynchrone avec passage du jeton d'annulation.
4. Mettre en œuvre la libération des ressources via `using var`.
5. Valider la qualité via l'analyse statique Roslyn et les tests xUnit.

# CHECKLIST
- [ ] Le projet est-il configuré avec `<Nullable>enable</Nullable>` sans warnings ignorés ?
- [ ] Toutes les méthodes asynchrones acceptent-elles un `CancellationToken` ?
- [ ] Les types de données de transport sont-ils déclarés sous forme de `record` ?

# EXAMPLES
Exemple de service asynchrone robuste en C# :
```csharp
public sealed record UserProfileDto(Guid Id, string FullName, string Email);

public interface IUserProfileService
{
    Task<UserProfileDto?> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default);
}

public sealed class UserProfileService(IUserRepository repository, ILogger<UserProfileService> logger) : IUserProfileService
{
    public async Task<UserProfileDto?> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Récupération du profil pour l'utilisateur {UserId}", userId);
        var user = await repository.FindByIdAsync(userId, cancellationToken);
        return user is null ? null : new UserProfileDto(user.Id, $"{user.FirstName} {user.LastName}", user.Email);
    }
}
```