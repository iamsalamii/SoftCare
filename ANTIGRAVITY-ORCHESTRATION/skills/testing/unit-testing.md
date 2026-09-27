# PURPOSE
Valider le comportement unitaire des classes, méthodes et fonctions de manière isolée, rapide, déterministe et reproductible.

# WHEN TO USE
- Pour toute logique métier, algorithmes, validateurs, calculs et transformations de données.

# PRINCIPLES
- **Isolation Totale** : Un test unitaire ne touche ni au réseau, ni au disque, ni à la base de données.
- **Pattern Arrange-Act-Assert (AAA)** : Structurer clairement chaque test en trois phases distinctes.
- **Vitesse & Déterminisme** : Des centaines de tests unitaires doivent pouvoir s'exécuter en quelques secondes avec le même résultat.

# BEST PRACTICES
- Nommer les méthodes de test de manière expressive : `Methode_Condition_ComportementAttendu` (ex: `CalculateDiscount_WhenVipCustomer_ShouldApplyTwentyPercent`).
- Remplacer les dépendances externes par des doublures de test (Mocks / Stubs avec NSubstitute ou Moq en C#).
- Tester prioritairement les cas limites (valeurs nulles, limites de plages, listes vides).

# COMMON MISTAKES
- Écrire des tests qui vérifient les détails d'implémentation privés plutôt que le résultat observable.
- Tester plusieurs comportements non liés au sein du même cas de test unitaire.
- Mettre en place des mocks complexes sur des classes de données pures qui n'en ont pas besoin.

# WORKFLOW
1. Préparer les données d'entrée et configurer les doublures (Arrange).
2. Exécuter l'action sous test (Act).
3. Vérifier les résultats et les invariants avec des assertions claires (Assert).
4. Refactoriser le code de production sous la protection du test.

# CHECKLIST
- [ ] Le test s'exécute-t-il en mémoire sans dépendance d'infrastructure ?
- [ ] La structure Arrange-Act-Assert est-elle immédiatement identifiable ?
- [ ] Le test échoue-t-il pour la bonne raison si la logique de production est altérée ?

# EXAMPLES
Test unitaire avec xUnit et FluentAssertions en C# :
```csharp
public class DiscountCalculatorTests
{
    [Fact]
    public void Calculate_WhenOrderAmountExceedsThreshold_ShouldApplyDiscount()
    {
        // Arrange
        var calculator = new DiscountCalculator();
        var amount = 150.0m;

        // Act
        var result = calculator.Calculate(amount);

        // Assert
        result.Should().Be(135.0m);
    }
}
```