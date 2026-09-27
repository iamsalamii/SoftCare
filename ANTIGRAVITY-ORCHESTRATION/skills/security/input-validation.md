# PURPOSE
Valider rigoureusement toutes les données externes pénétrant dans le système pour interdire les données corrompues, malformées ou malveillantes.

# WHEN TO USE
- À chaque point d'entrée : requêtes HTTP, uploads de fichiers, webhooks, messages de files d'attente.

# PRINCIPLES
- **Validation par Liste Blanche (Allowlist)** : Valider ce qui est autorisé plutôt que tenter de bloquer ce qui semble interdit.
- **Validation Forte aux Frontières** : Rejeter les requêtes non conformes dès l'entrée avant tout traitement métier.
- **Typage Strict** : Désérialiser immédiatement vers des types immuables fortement validés.

# BEST PRACTICES
- Utiliser FluentValidation en .NET pour séparer les règles de validation de la structure des DTOs.
- Valider le type, la longueur minimale/maximale, les plages numériques et les formats (Regex éprouvées).
- Vérifier les types MIME et le contenu réel des fichiers téléversés (pas seulement l'extension de fichier).

# COMMON MISTAKES
- Se reposer uniquement sur la validation frontend (qui peut être contournée en 2 secondes avec curl).
- Utiliser des expressions régulières trop permissives ou vulnérables aux attaques ReDoS (Regular Expression Denial of Service).
- Nettoyer (sanitiser) les entrées au lieu de les rejeter purement et simplement quand elles sont invalides.

# WORKFLOW
1. Définir le contrat DTO de la requête.
2. Écrire le validateur de schéma avec FluentValidation.
3. Intégrer le validateur dans le pipeline ASP.NET Core via un Endpoint Filter.
4. Renvoyer une réponse HTTP 400 Bad Request avec les détails des erreurs en cas de non-conformité.
5. Écrire des tests unitaires couvrant les cas valides et invalides.

# CHECKLIST
- [ ] Chaque DTO de requête dispose-t-il d'un validateur associé ?
- [ ] Les limites de taille de payload et de chaîne de caractères sont-elles explicites ?
- [ ] Les erreurs de validation retournent-elles une réponse RFC 7807 (ProblemDetails) ?

# EXAMPLES
Validateur FluentValidation pour un DTO de création :
```csharp
public sealed record CreateProductRequest(string Sku, string Name, decimal Price);

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Sku)
            .NotEmpty().WithMessage("Le SKU est obligatoire.")
            .Matches(@"^[A-Z0-9]{6,12}$").WithMessage("Le SKU doit comporter entre 6 et 12 caractères alphanumériques majuscules.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Le nom du produit est obligatoire.")
            .MaximumLength(150).WithMessage("Le nom ne peut excéder 150 caractères.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Le prix doit être strictement supérieur à zéro.");
    }
}
```