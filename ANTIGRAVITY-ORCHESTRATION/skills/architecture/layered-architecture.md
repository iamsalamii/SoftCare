# PURPOSE
Organiser un système logiciel en couches horizontales hiérarchisées où chaque couche fournit des services dédiés à la couche supérieure tout en masquant sa complexité interne.

# WHEN TO USE
- Applications CRUD classiques ou projets de taille petite à moyenne.
- Équipes souhaitant une organisation simple et rapidement assimilable sans la complexité de DDD.
- Systèmes où la séparation claire entre Présentation, Logique Métier et Données suffit.

# PRINCIPLES
- **Séparation des Préoccupations (SoC)** : Chaque couche a une responsabilité exclusive.
- **Couplage Unidirectionnel** : La couche supérieure appelle la couche inférieure, jamais l'inverse.
- **Fermeture de Couche** : Une requête traverse idéalement chaque couche sans en sauter arbitrairement.

# BEST PRACTICES
- Isoler les contrats de données (DTOs) de la couche d'accès aux données (DAL / Entities).
- Centraliser la validation d'affaires dans la couche de logique métier (BLL / Services).
- Utiliser l'injection de dépendances pour découpler les interfaces de services de leurs implémentations.

# COMMON MISTAKES
- Permettre à la couche de Présentation d'exécuter des requêtes SQL directes en sautant la couche Métier.
- Transformer la couche Métier en un simple passe-plat anémique sans valeur ajoutée.
- Créer des dépendances circulaires entre couches.

# WORKFLOW
1. Définir le modèle de données (Tables et entités de persistance).
2. Développer la couche d'accès aux données (Data Access Layer - DAL).
3. Développer les services de logique métier (Business Logic Layer - BLL).
4. Créer la couche de présentation (Controllers / Vues UI).
5. Configurer l'injection de dépendances liant les couches au démarrage.

# CHECKLIST
- [ ] Les appels entre couches sont-ils strictement descendants ?
- [ ] La couche de données est-elle abstraite par des interfaces pour faciliter le test unitaire ?
- [ ] Les exceptions techniques de la DAL sont-elles traduites en erreurs compréhensibles par la BLL ?

# EXAMPLES
Organisation de namespaces C# :
```csharp
namespace MyApp.Presentation.Controllers { ... }
namespace MyApp.Business.Services { ... }
namespace MyApp.DataAccess.Repositories { ... }
```