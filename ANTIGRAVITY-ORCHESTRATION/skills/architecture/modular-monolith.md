# PURPOSE
Concevoir un monolithe logiciel structuré en modules métier autonomes, hermétiques et fortement découplés, partageant le même déploiement tout en préparant une transition aisée vers des microservices si la charge l'exige.

# WHEN TO USE
- Applications d'envergure nécessitant une modularité stricte sans la complexité opérationnelle des microservices (pas de réseau distribué, pas de latence RPC, pas de cohérence à terme obligatoire).
- Systèmes d'entreprise comprenant plusieurs domaines métiers bien identifiables (ex: Facturation, Catalogue, Utilisateurs).

# PRINCIPLES
- **Encapsulation Modulaire** : Chaque module possède ses propres données, sa logique et son API interne.
- **Communication par Contrats Publics** : Les modules communiquent uniquement via des interfaces publiques ou un bus d'événements intra-processus.
- **Indépendance des Schémas de Données** : Chaque module possède ses tables dédiées ou son propre schéma PostgreSQL (`billing.invoices`, `users.accounts`).

# BEST PRACTICES
- Restreindre la visibilité des classes internes à chaque module (`internal` en C#).
- Interdire les jointures SQL directes entre tables appartenant à des modules différents.
- Utiliser des événements de domaine asynchrones en mémoire (ex: MediatR ou Channels C#) pour notifier d'autres modules.

# COMMON MISTAKES
- Réaliser des requêtes de jointures directes entre modules dans la base de données.
- Rendre publiques toutes les classes d'un module, détruisant l'encapsulation.
- Partager des modèles de données mutables entre modules.

# WORKFLOW
1. Délimiter les frontières de chaque module d'après le langage omniprésent (Ubiquitous Language).
2. Définir pour chaque module un contrat public (`IOrdersModule`, `OrdersModuleApi`).
3. Isoler le schéma de persistance (un schéma PostgreSQL par module).
4. Implémenter la communication inter-modules par messages ou événements typés.
5. Vérifier l'étanchéité modulaire via des tests de règles de dépendances.

# CHECKLIST
- [ ] Chaque module possède-t-il son propre schéma PostgreSQL isolé ?
- [ ] Les classes internes du module sont-elles inaccessibles depuis les autres modules ?
- [ ] Les échanges inter-modules passent-ils exclusivement par l'API publique du module ou un bus d'événements ?

# EXAMPLES
Exemple de structure modulaire :
```text
src/Modules/
  Users/
    Public/ -> IUsersModule.cs, UserDto.cs
    Internal/ -> UsersDbContext.cs, UserService.cs, UserEntity.cs
  Billing/
    Public/ -> IBillingModule.cs
    Internal/ -> BillingDbContext.cs, InvoiceService.cs
```