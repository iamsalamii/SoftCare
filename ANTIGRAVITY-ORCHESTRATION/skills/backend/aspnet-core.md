# PURPOSE
Bâtir des services Web et APIs RESTful modulaires, sécurisés et performants en exploitant le pipeline de middlewares et les fonctionnalités natives d'ASP.NET Core.

# WHEN TO USE
- Création de microservices ou d'APIs monolithiques exposant des ressources HTTP.
- Gestion du cycle de vie des requêtes, de l'authentification, de la négociation de contenu et du routage serveur.

# PRINCIPLES
- **Pipeline de Middlewares Ordonné** : Chaque composant du pipeline inspecte ou modifie la requête dans un ordre rigoureux.
- **Configuration Déclarative & Typée** : Utilisation du pattern `IOptions<T>` ou `IOptionsSnapshot<T>`.
- **Hébergement Moderne** : Utilisation du WebApplication builder unifié (`WebApplication.CreateBuilder`).

# BEST PRACTICES
- Placer les middlewares d'exception et de sécurité en tête de pipeline.
- Exploiter les filtres d'action ou Endpoint Filters pour les préoccupations transversales (logging, validation).
- Configurer les en-têtes de sécurité (HSTS, HTTPS redirection) et le Rate Limiting natif d'ASP.NET Core.

# COMMON MISTAKES
- Mettre en place des middlewares dans le mauvais ordre (ex: placer `UseAuthorization()` avant `UseAuthentication()`).
- Injecter des dépendances scoped dans un middleware singleton sans créer de scope explicite.
- Exposer des détails internes de configuration dans `appsettings.json` commité.

# WORKFLOW
1. Initialiser le `WebApplicationBuilder` et enregistrer les services nécessaires.
2. Configurer le pipeline HTTP (`UseExceptionHandler`, `UseHttpsRedirection`, `UseAuthentication`, `UseAuthorization`).
3. Mapper les contrôleurs ou les Minimal APIs avec filtres de validation.
4. Configurer les endpoints de diagnostic et de santé (`MapHealthChecks`).
5. Démarrer l'application avec gestion propre de l'arrêt gracieux.

# CHECKLIST
- [ ] Le middleware d'authentification précède-t-il bien celui d'autorisation ?
- [ ] Le pipeline d'exceptions gère-t-il toutes les erreurs non interceptées sans fuite de stack trace ?
- [ ] Les points de terminaison de santé `/healthz` sont-ils configurés ?

# EXAMPLES
Configuration de base du pipeline dans `Program.cs` :
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
builder.Services.AddControllers();
builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
```