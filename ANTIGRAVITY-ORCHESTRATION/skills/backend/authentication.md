# PURPOSE
Vérifier de façon infalsifiable l'identité des utilisateurs et des systèmes clients interagissant avec le backend.

# WHEN TO USE
- Dès qu'une application nécessite de distinguer des utilisateurs, de protéger des ressources ou de tracer les actions.

# PRINCIPLES
- **Vérification Stricte** : Ne jamais faire confiance aux identifiants transmis sans validation cryptographique.
- **Séparation Authentification vs Autorisation** : L'authentification répond à "Qui êtes-vous ?", l'autorisation à "Qu'avez-vous le droit de faire ?".
- **Stockage Sûr des Secrets** : Mots de passe hachés avec des fonctions lentes et salées (Argon2id ou BCrypt).

# BEST PRACTICES
- Pour les APIs SPA (React) et Backend : privilégier les cookies d'authentification chiffrés `HttpOnly`, `Secure`, `SameSite=Strict` ou `Lax` pour contrer le vol de tokens via XSS.
- Si des tokens JWT sont utilisés : valider systématiquement l'émetteur (`Issuer`), l'audience (`Audience`), la durée de vie (`Lifetime`) et la signature cryptographique (`IssuerSigningKey`).
- Prévoir une durée de vie courte pour les Access Tokens (ex: 15 minutes) et utiliser des Refresh Tokens avec rotation obligatoire.

# COMMON MISTAKES
- Stocker des tokens JWT en clair dans le `localStorage` du navigateur (vulnérable au vol par attaque XSS).
- Désactiver la validation du certificat SSL ou de la signature JWT en développement et l'oublier en production.
- Utiliser un algorithme de signature faible (ex: accepter `none` ou des clés symétriques trop courtes).

# WORKFLOW
1. Configurer le schéma d'authentification dans ASP.NET Core (`AddAuthentication`).
2. Paramétrer les règles de validation du jeton ou du cookie.
3. Activer le middleware `app.UseAuthentication()` avant `app.UseAuthorization()`.
4. Sécuriser les endpoints avec l'attribut `[Authorize]`.
5. Extraire l'identité courante via `ClaimsPrincipal` (`User.Identity`).

# CHECKLIST
- [ ] Les mots de passe sont-ils hachés avec un algorithme résistant (Argon2id / BCrypt) ?
- [ ] La validation de signature des JWT est-elle stricte et infalsifiable ?
- [ ] Les cookies de session possèdent-ils les attributs `HttpOnly` et `Secure` ?

# EXAMPLES
Configuration de l'authentification JWT dans `Program.cs` :
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)
            ),
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });
```