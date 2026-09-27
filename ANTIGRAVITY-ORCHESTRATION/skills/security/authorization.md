# PURPOSE
Vérifier que chaque utilisateur ou service accédant au système ne dispose que des droits strictement nécessaires à l'exécution de sa tâche.

# WHEN TO USE
- Dès qu'une ressource ou action doit être restreinte selon le rôle, l'appartenance à un groupe ou la propriété des données.

# PRINCIPLES
- **Refus par Défaut (Deny by Default)** : Tout accès non expressément autorisé est rejeté.
- **Non-Dérivation Implicite** : Ne jamais supposer qu'un droit en entraîne un autre sans règle formelle.
- **Vérification Contextuelle** : Contrôler non seulement l'action mais aussi l'objet ciblé (prévention BOLA).

# BEST PRACTICES
- Structurer les autorisations sous forme de permissions atomiques (ex: `invoices:read`, `invoices:create`) plutôt que de simples rôles monolithiques.
- Injecter l'identifiant de l'utilisateur connecté depuis le contexte de sécurité sécurisé (`ClaimsPrincipal`), jamais depuis le corps de requête.
- Isoler les vérifications dans des middlewares ou policies réutilisables.

# COMMON MISTAKES
- Valider le rôle Admin dans l'UI React tout en oubliant de le valider sur l'API backend.
- Permettre à un utilisateur de modifier la commande d'un tiers en changeant simplement l'`orderId` dans l'URL.
- Accorder des privilèges excessifs pour résoudre temporairement un bug de permission.

# WORKFLOW
1. Modéliser la matrice des droits et rôles (RBAC ou ABAC).
2. Implémenter les politiques d'autorisation serveur.
3. Lier chaque point d'API à la politique requise.
4. Valider le cloisonnement des requêtes de base de données.
5. Réaliser des tests de tentative d'accès non autorisé.

# CHECKLIST
- [ ] Tous les contrôleurs d'API imposent-ils une vérification d'autorisation ?
- [ ] La propriété des objets est-elle validée avant modification ou suppression ?
- [ ] Les accès refusés génèrent-ils un code HTTP 403 Forbidden ?

# EXAMPLES
Vérification systématique de la propriété de la ressource :
```csharp
var order = await dbContext.Orders.FindAsync(orderId);
if (order is null) return TypedResults.NotFound();
if (order.TenantId != currentTenantProvider.GetTenantId()) return TypedResults.Forbid();
```