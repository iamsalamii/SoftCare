# PURPOSE
Structurer les applications logicielles en couches concentriques indépendantes, en plaçant les règles métier et le domaine au cœur du système, isolés des détails technologiques (frameworks, bases de données, interfaces utilisateur).

# WHEN TO USE
- Applications d'entreprise possédant une logique métier riche et durable.
- Systèmes nécessitant une haute testabilité sans dépendance directe aux infrastructures externes.
- Projets prévus pour évoluer sur plusieurs années avec des changements technologiques probables.

# PRINCIPLES
- **Règle de Dépendance** : Les dépendances de code doivent toujours pointer vers l'intérieur (vers le Domaine).
- **Indépendance des Frameworks** : L'architecture ne doit pas être asservie à une bibliothèque externe.
- **Testabilité Totale** : La logique métier peut être testée sans lancer de serveur web ni de base de données.
- **Séparation Nette** : Domain -> Application -> Infrastructure / Presentation.

# BEST PRACTICES
- Définir les interfaces de persistance (Repositories/Units of Work) dans la couche Application ou Domain, et les implémenter dans l'Infrastructure.
- Utiliser des DTOs stricts pour faire transiter les données entre les couches Presentation et Application.
- Garder les entités du Domaine pures (pas d'attributs spécifiques à un ORM comme EF Core dans le Core).
- Favoriser l'immutabilité et encapsuler les changements d'état au sein des méthodes du Domaine.

# COMMON MISTAKES
- Laisser la couche Domain dépendre d'Entity Framework Core ou de packages NuGet d'infrastructure.
- Créer des passe-plats inutiles (services vides réexpédiant simplement un appel au repository sans logique).
- Faire fuiter les entités de domaine directement dans les réponses d'API JSON.

# WORKFLOW
1. Modéliser les entités et Value Objects dans le `Domain`.
2. Définir les cas d'utilisation (Use Cases / Commands / Queries) et les interfaces dans l'`Application`.
3. Implémenter les accès données (PostgreSQL, APIs externes) dans l'`Infrastructure`.
4. Exposer les endpoints HTTP (Controllers / Minimal APIs) dans la `Presentation`.
5. Valider le respect des dépendances via des tests d'architecture (NetArchTest en C#).

# CHECKLIST
- [ ] Le projet Domain ne référence-t-il aucun autre projet de la solution ?
- [ ] Les use cases manipulent-ils des interfaces et non des classes concrètes d'infrastructure ?
- [ ] Les contrôleurs API se contentent-ils de déléguer l'exécution à la couche Application ?
- [ ] Les entités métier protègent-elles leurs invariants ?

# EXAMPLES
Structure type d'une solution .NET :
```text
src/
  MyProject.Domain/           # Entités, Value Objects, Exceptions de domaine, Interfaces clés
  MyProject.Application/      # Use Cases, DTOs, Mappings, Interfaces de services/repositories
  MyProject.Infrastructure/   # DbContext EF Core, Migrations PostgreSQL, Clients HTTP externes
  MyProject.Presentation/     # ASP.NET Core Web API, Middlewares, Endpoints, Program.cs
```