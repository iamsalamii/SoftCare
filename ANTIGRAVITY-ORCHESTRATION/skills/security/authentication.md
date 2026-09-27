# PURPOSE
Concevoir et auditer les architectures d'authentification pour garantir une identification irréfutable des utilisateurs et systèmes.

# WHEN TO USE
- Mise en œuvre ou audit des systèmes d'inscription, de connexion, de session et d'échange de jetons.

# PRINCIPLES
- **Défense Contre les Attaques par Force Brute** : Verrouillage temporaire ou challenge après échecs répétés.
- **Stockage Cryptographique Robuste** : Utilisation d'algorithmes à mémoire dure (Argon2id ou BCrypt avec coût adéquat).
- **Gestion Stricte du Cycle de Vie des Jetons** : Révocation possible, expiration courte et renouvellement sécurisé.

# BEST PRACTICES
- Stocker les jetons d'accès web dans des cookies chiffrés `HttpOnly`, `Secure`, `SameSite=Strict` ou `Lax`.
- Protéger les endpoints de réinitialisation de mot de passe par des tokens éphémères à usage unique.
- Exiger une ré-authentification pour les opérations hautement sensibles (changement d'email, modification de mot de passe, virement).

# COMMON MISTAKES
- Transmettre des identifiants sensibles ou tokens dans les paramètres d'URL (visibles dans l'historique et les logs proxy).
- Utiliser MD5, SHA-1 ou SHA-256 sans sel pour hacher les mots de passe.
- Ne pas invalider la session côté serveur lors de la déconnexion de l'utilisateur.

# WORKFLOW
1. Choisir le protocole adapté (OAuth2 / OIDC pour SSO, Cookies sécurisés pour SPA-Backend monolithique).
2. Configurer le hachage sécurisé des mots de passe.
3. Implémenter la distribution et la validation des jetons.
4. Mettre en place la surveillance des tentatives de connexion anomales.
5. Auditer la conformité avec l'Auditeur Sécurité.

# CHECKLIST
- [ ] Les mots de passe sont-ils hachés avec Argon2id / BCrypt ?
- [ ] Les cookies de session ont-ils les drapeaux `HttpOnly` et `Secure` ?
- [ ] Les sessions sont-elles révocables côté serveur ?

# EXAMPLES
Hachage de mot de passe sécurisé :
```csharp
// Exemple conceptuel de hachage moderne
public string HashPassword(string password)
{
    // Utilisation d'Argon2id ou d'un PasswordHasher robuste
    return BCrypt.Net.BCrypt.EnhancedHashPassword(password, workFactor: 12);
}
```