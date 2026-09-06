# PURPOSE
Contrôler et restreindre les actions qu'un utilisateur ou un service authentifié est autorisé à exécuter sur les ressources du système.

# WHEN TO USE
- Dès qu'un système gère des rôles différents (Admin, Membre, Invité) ou du cloisonnement de données (chacun ne voit que ses propres données).

# PRINCIPLES
- **Moindre Privilège** : Refuser l'accès par défaut, accorder explicitement les droits nécessaires.
- **Défense en Profondeur** : Valider l'autorisation au niveau du contrôleur ET vérifier la propriété de la ressource au niveau métier (prévention BOLA / IDOR).
- **Autorisation Basée sur les Politiques (Policy-Based)** : Préférer les politiques (`RequireClaim`, `Requirements`) aux simples rôles statiques.

# BEST PRACTICES
- Éviter de coder en dur des vérifications de rôles dispersées (`if (User.IsInRole("Admin"))`).
- Utiliser les `IAuthorizationHandler` d'ASP.NET Core pour implémenter des vérifications fines basées sur les ressources (ex: `CanEditInvoiceRequirement`).
- Filtrer systématiquement les requêtes de base de données avec l'identifiant de l'utilisateur courant (`WHERE user_id = @currentUserId`).

# COMMON MISTAKES
- Se fier aveuglément à un ID passé en paramètre d'URL sans vérifier que l'utilisateur connecté en est le propriétaire légitime (faille IDOR).
- Omettre l'attribut `[Authorize]` sur un endpoint nouvellement créé.
- Confondre rôle fonctionnel et permission unitaire.

# WORKFLOW
1. Définir les politiques d'autorisation requises (`AddAuthorizationBuilder`).
2. Appliquer les politiques sur les contrôleurs ou Minimal APIs (`[Authorize(Policy = "...")]` ou `.RequireAuthorization(...)`).
3. Créer des gestionnaires personnalisés d'autorisation basés sur les ressources si nécessaire.
4. Assurer le filtrage des requêtes SQL pour cloisonner les données.
5. Tester unitairement et par intégration les scénarios d'accès autorisé et refusé (403 Forbidden).

# CHECKLIST
- [ ] Tous les endpoints nécessitant une protection ont-ils une politique d'autorisation active ?
- [ ] Les tentatives d'accès aux ressources d'un autre utilisateur renvoient-elles bien `403 Forbidden` ou `404 Not Found` ?
- [ ] Les politiques d'autorisation sont-elles centralisées et documentées ?

# EXAMPLES
Autorisation basée sur une ressource en C# :
```csharp
public class DocumentAuthorizationHandler : AuthorizationHandler<SameAuthorRequirement, Document>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SameAuthorRequirement requirement,
        Document resource
    )
    {
        var currentUserId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId is not null && resource.AuthorId.ToString() == currentUserId)
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```