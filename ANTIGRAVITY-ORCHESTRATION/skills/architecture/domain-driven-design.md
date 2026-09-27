# PURPOSE
Aligner étroitement la conception logicielle sur la réalité complexe du domaine métier en collaborant avec des experts du domaine et en isolant la logique centrale au sein de modèles expressifs et rigoureux.

# WHEN TO USE
- Systèmes à forte complexité fonctionnelle et règles métiers imbriquées.
- Applications où le vocabulaire et les processus d'entreprise sont au cœur de la valeur.
- Projets avec des équipes pluridisciplinaires nécessitant un langage commun non ambigu.

# PRINCIPLES
- **Ubiquitous Language (Langage Omniprésent)** : Vocabulaire rigoureux partagé à l'identique entre experts métier et codeurs.
- **Bounded Contexts** : Délimitation explicite des frontières à l'intérieur desquelles un modèle s'applique.
- **Tactical Patterns** : Entités (identité propre), Value Objects (immuables, définis par leurs valeurs), Agrégats (grappes de cohérence transactionnelle), Domain Events.

# BEST PRACTICES
- Protéger les invariants de l'Agrégat : aucune modification interne ne doit pouvoir être effectuée sans passer par la racine de l'agrégat (Aggregate Root).
- Rendre les Value Objects strictement immuables (ex: `Money`, `EmailAddress`, `DateRange`).
- Émettre des événements de domaine (`DomainEvent`) lors d'un changement d'état significatif.

# COMMON MISTAKES
- Créer un modèle de domaine anémique (simples classes de propriétés get/set manipulées par d'immenses services procéduraux).
- Créer des agrégats géants englobant trop de tables, causant des conflits de concurrence massifs.
- Mélanger le vocabulaire technique avec le langage métier dans les entités du Domaine.

# WORKFLOW
1. Identifier les Bounded Contexts et documenter le langage omniprésent.
2. Concevoir les Agrégats en définissant clairement l'Aggregate Root.
3. Implémenter les règles d'invariants et la validation au sein des entités et Value Objects.
4. Lever des Domain Events pour communiquer les effets de bord métiers.
5. Mettre en place des Repositories opérant exclusivement au niveau des Aggregate Roots.

# CHECKLIST
- [ ] L'agrégat garantit-il la cohérence transactionnelle de toutes les entités enfants qu'il contient ?
- [ ] Les setters des entités sont-ils privés pour empêcher la manipulation d'état non contrôlée ?
- [ ] Les Value Objects valident-ils leurs données dès l'instanciation (Self-Validation) ?

# EXAMPLES
Exemple de Value Object et Racine d'Agrégat C# :
```csharp
public sealed record Money(decimal Amount, string Currency)
{
    public Money
    {
        if (Amount < 0) throw new DomainException("Le montant ne peut pas être négatif.");
        if (string.IsNullOrWhiteSpace(Currency)) throw new DomainException("Devise obligatoire.");
    }
}

public class Order // Aggregate Root
{
    private readonly List<OrderItem> _items = new();
    public Guid Id { get; private set; }
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();
    
    public void AddItem(Guid productId, Money price, int quantity)
    {
        // Contrôle des invariants métiers
        if (_items.Any(i => i.ProductId == productId))
            throw new DomainException("Produit déjà présent dans la commande.");
        _items.Add(new OrderItem(productId, price, quantity));
    }
}
```