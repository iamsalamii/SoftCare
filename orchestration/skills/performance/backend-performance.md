# PURPOSE
Maximiser le débit (throughput), minimiser la latence et optimiser l'utilisation de la mémoire et du CPU sur les services serveurs ASP.NET Core et .NET.

# WHEN TO USE
- Sur tous les services traitant un volume important de requêtes ou des opérations critiques en temps de réponse.

# PRINCIPLES
- **Asynchronisme Non-Bloquant Intégral** : Préserver la disponibilité des threads du ThreadPool pour servir un nombre massif de requêtes simultanées.
- **Contrôle des Allocations Mémoire** : Réduire le travail du Garbage Collector (GC) en réutilisant les buffers et en limitant les allocations d'objets éphémères.
- **Mise en Cache Efficace** : Conserver en cache en mémoire les résultats de calculs fréquents ou de requêtes statiques.

# BEST PRACTICES
- Utiliser `ArrayPool<T>` ou `Memory<T>` / `ReadOnlySpan<T>` pour les opérations intensives de manipulation de chaînes ou de buffers.
- Utiliser `IMemoryCache` ou un cache distribué (Redis) avec expiration absolue et glissante (`SlidingExpiration`).
- Éviter la sérialisation/désérialisation répétée d'objets identiques.

# COMMON MISTAKES
- Utiliser des opérations synchrones bloquantes (`.Wait()`, `.Result`, `File.ReadAllText` au lieu de la variante asynchrone).
- Mettre en cache des collections entières sans politique d'éviction, provoquant une fuite mémoire (Out of Memory).
- Exécuter des boucles de mapping complexes avec de la réflexion dynamique sur des millions d'éléments.

# WORKFLOW
1. Profiler le code avec `dotnet-trace` ou BenchmarkDotNet.
2. Identifier les méthodes consommatrices de CPU ou générant des allocations mémoire importantes (Gen 0/1/2 GC).
3. Remplacer les allocations inutiles par des structures immuables ou du pooling.
4. Mettre en place un cache approprié pour les données immuables.
5. Re-mesurer pour prouver la diminution de la latence p99.

# CHECKLIST
- [ ] Aucun appel bloquant synchrone sur une tâche asynchrone n'est présent ?
- [ ] Le cache dispose-t-il de limites de taille et de politiques d'expiration strictes ?
- [ ] Le Garbage Collector n'effectue-t-il pas de collectes Gen 2 fréquentes sous charge ?

# EXAMPLES
Utilisation propre d'un cache mémoire avec IMemoryCache en C# :
```csharp
public async Task<IReadOnlyList<CountryDto>> GetCountriesAsync(CancellationToken ct)
{
    return await cache.GetOrCreateAsync("countries_list", async entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12);
        entry.SlidingExpiration = TimeSpan.FromHours(2);
        return await repository.ListAllCountriesAsync(ct);
    }) ?? [];
}
```