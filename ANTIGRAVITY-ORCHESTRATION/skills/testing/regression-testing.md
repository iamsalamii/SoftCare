# PURPOSE
Garantir qu'une modification de code ou la correction d'une anomalie ne réintroduit aucun bug ancien et ne dégrade aucune fonctionnalité préexistante.

# WHEN TO USE
- Systématiquement lors de chaque résolution d'incident, refactorisation ou mise à jour de dépendance.

# PRINCIPLES
- **Tout Bug Doit Avoir Son Test** : Avant de corriger un bug, écrire un test automatisé qui échoue à cause du bug.
- **Automatisation Permanente** : Les tests de régression rejoignent la suite de tests automatisée permanente et s'exécutent à chaque commit.
- **Préservation des Invariants** : Le comportement établi et validé du système ne doit pas dériver silencieusement.

# BEST PRACTICES
- Référencer le numéro de ticket ou d'incident dans le nom ou la documentation du test de non-régression.
- Exécuter la suite intégrale des tests avant de considérer un bug comme résolu.
- Surveiller les zones critiques de la base de code ayant historiquement subi le plus d'anomalies.

# COMMON MISTAKES
- Corriger un bug à la volée sans ajouter de test automatisé (le bug réapparaîtra invariablement 6 mois plus tard).
- Supprimer ou désactiver un test ancien qui échoue au lieu d'analyser la cause de la régression.
- Considérer qu'une modification "mineure" ne nécessite pas de relancer la suite de régression.

# WORKFLOW
1. Reproduire le bug constaté via un test de non-régression automatisé (Test Rouge).
2. Appliquer la correction de code minimale nécessaire.
3. Vérifier que le test de non-régression passe au vert (Test Vert).
4. Lancer l'intégralité de la suite de tests pour vérifier l'absence d'effets de bord.
5. Intégrer le test de manière pérenne dans le référentiel de tests.

# CHECKLIST
- [ ] Le test de régression échoue-t-il bien sur le code non corrigé ?
- [ ] Le test passe-t-il au vert après application du correctif ?
- [ ] Tous les autres tests existants continuent-ils de réussir ?

# EXAMPLES
Test de non-régression référençant une anomalie :
```csharp
public class OrderCalculationRegressionTests
{
    [Fact]
    public void Issue402_ZeroQuantityItem_ShouldNotCauseDivideByZeroException()
    {
        // Ce test prévient la réapparition du bug #402 où un article de quantité 0
        // déclenchait une division par zéro lors du calcul de remise moyenne.
        var order = new Order();
        Action act = () => order.ApplyAverageDiscount();

        act.Should().NotThrow<DivideByZeroException>();
    }
}
```