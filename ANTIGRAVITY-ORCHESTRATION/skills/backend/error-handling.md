# PURPOSE
Gérer les erreurs et exceptions de manière prévisible, sécurisée et unifiée sur l'ensemble de l'application serveur, tout en fournissant des diagnostics clairs aux clients sans exposer de données sensibles.

# WHEN TO USE
- Dans toute API serveur pour traiter les erreurs de validation, les pannes d'infrastructure et les règles métier non respectées.

# PRINCIPLES
- **Uniformité des Réponses** : Adopter la norme RFC 7807 (ProblemDetails) pour tous les formats de réponse d'erreur.
- **Non-Divulgation d'Informations (Information Leakage)** : Ne jamais exposer de stack traces, requêtes SQL internes ou chemins de fichiers en production.
- **Fail Fast & Explicit** : Lever des exceptions typées pour les anomalies exceptionnelles, renvoyer des résultats explicites (ex: `Result<T>`) pour les cas d'échec attendus.

# BEST PRACTICES
- Exploiter le middleware natif `app.UseExceptionHandler()` couplé à `IExceptionHandler` en .NET 8/9.
- Mapper les exceptions métier vers les codes HTTP correspondants :
  - `NotFoundException` -> 404 Not Found
  - `ValidationException` -> 400 Bad Request
  - `UnauthorizedException` -> 401 Unauthorized
  - `ForbiddenException` -> 403 Forbidden
  - `ConflictException` -> 409 Conflict
- Enregistrer systématiquement les détails techniques dans les logs structurés avec un `TraceIdentifier`.

# COMMON MISTAKES
- Masquer les exceptions dans des blocs `catch` vides.
- Renvoyer des messages d'erreur génériques non informatifs ou au contraire trop verbeux et non sécurisés.
- Renvoyer des erreurs 500 pour de simples erreurs de validation utilisateur.

# WORKFLOW
1. Créer une hiérarchie d'exceptions de domaine/application (ex: `AppException`, `NotFoundException`).
2. Implémenter un `CustomExceptionHandler : IExceptionHandler` pour traduire chaque exception en `ProblemDetails`.
3. Enregistrer le gestionnaire dans le conteneur et activer `app.UseExceptionHandler()`.
4. Logger chaque erreur avec son identifiant de corrélation (`TraceId`).
5. Vérifier la réponse client pour différents types d'erreurs (400, 404, 500).

# CHECKLIST
- [ ] Le format de réponse respecte-t-il la spécification ProblemDetails (RFC 7807) ?
- [ ] Les stack traces sont-elles strictement désactivées dans les environnements hors développement ?
- [ ] L'identifiant de trace (`TraceId`) est-il inclus dans la réponse pour permettre le diagnostic dans les logs ?

# EXAMPLES
Implémentation d'un Exception Handler global en .NET 8/9 :
```csharp
public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        logger.LogError(exception, "Une exception non gérée s'est produite : {Message}", exception.Message);

        var (statusCode, title) = exception switch
        {
            KeyNotFoundException => (StatusCodes.Status404NotFound, "Ressource introuvable"),
            InvalidOperationException => (StatusCodes.Status400BadRequest, "Opération invalide"),
            _ => (StatusCodes.Status500InternalServerError, "Une erreur interne est survenue")
        };

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = httpContext.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment() 
                ? exception.ToString() 
                : "Veuillez contacter le support avec l'identifiant de trace.",
            Instance = httpContext.Request.Path
        };
        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}
```