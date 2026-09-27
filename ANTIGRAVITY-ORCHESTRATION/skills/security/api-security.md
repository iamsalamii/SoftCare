# PURPOSE
Sécuriser les points de terminaison d'API REST contre les attaques externes, les abus de trafic, les fuites de données et les accès non autorisés.

# WHEN TO USE
- Pour chaque API exposée, qu'elle soit publique, réservée aux partenaires ou interne.

# PRINCIPLES
- **Zero Trust** : Authentifier et autoriser chaque appel de manière indépendante.
- **Limitation de Débit (Rate Limiting)** : Préserver les ressources serveur contre le déni de service (DoS) et le brute force.
- **Cloisonnement Strict des Objets (BOLA / IDOR)** : Valider que le client a le droit d'accéder à l'identifiant précis demandé.

# BEST PRACTICES
- Mettre en place un middleware de Rate Limiting (ex: `AddRateLimiter` d'ASP.NET Core).
- Configurer les politiques CORS strictes (n'autoriser que les origines explicitement connues en production, interdire le joker `*` avec authentification).
- Définir des en-têtes de sécurité HTTP robustes (`HSTS`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy`).

# COMMON MISTAKES
- Laisser les endpoints d'administration accessibles sans validation de rôle ou sans restriction réseau.
- Permettre le Mass Assignment en liant directement le modèle de requête HTTP à l'entité de base de données.
- Utiliser CORS comme un mécanisme d'authentification (CORS est une protection navigateur, pas un contrôle d'accès serveur).

# WORKFLOW
1. Définir la politique d'accès et d'autorisation pour chaque endpoint.
2. Configurer le Rate Limiting adapté (ex: 5 requêtes/min pour le login, 100 requêtes/min pour les lectures).
3. Configurer CORS avec origines explicites.
4. Mettre en place la validation de schéma sur le payload d'entrée.
5. Tester les attaques par falsification et dépassement de seuil.

# CHECKLIST
- [ ] La politique CORS interdit-elle les origines sauvages en production ?
- [ ] Le rate limiting est-il configuré sur les routes sensibles (login, reset password, export) ?
- [ ] Les endpoints interdisent-ils le Mass Assignment via des DTOs dédiés ?

# EXAMPLES
Configuration de Rate Limiting dans ASP.NET Core :
```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth-limit", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 0;
    });
});
```