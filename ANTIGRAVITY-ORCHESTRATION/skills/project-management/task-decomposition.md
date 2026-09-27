# PURPOSE
Découper une fonctionnalité logicielle complexe en unités de travail minimales, indépendantes, testables et assignables à un agent ou développeur spécifique.

# WHEN TO USE
- Lors du passage de la spécification fonctionnelle à la phase d'implémentation concrète.

# PRINCIPLES
- **Vertical Slicing** : Préférer découper par tranche verticale de valeur (qui traverse la base, l'API et l'UI) plutôt qu'en couches horizontales isolées et non testables de bout en bout.
- **Principe INVEST** : Les tâches doivent être Indépendantes, Négociables, Valorisables, Estimables, Sized appropriately (Petites) et Testables.
- **Autonomie d'Exécution** : Chaque tâche doit contenir tout le contexte nécessaire pour être réalisée sans interrogations constantes.

# BEST PRACTICES
- Dimensionner les tâches pour qu'elles puissent être développées et révisées en moins d'une demi-journée.
- Identifier explicitement les prérequis (ex: "Dépend de la tâche #12").
- Rédiger les tâches selon le modèle standardisé `templates/task.md`.

# COMMON MISTAKES
- Créer des méga-tâches vagues ("Faire le module de facturation").
- Découper en silos horizontaux étanches qui ne peuvent pas être testés avant la fin du projet.
- Omettre de spécifier la Definition of Done (DoD) propre à chaque tâche unitaire.

# WORKFLOW
1. Analyser la spécification de la fonctionnalité.
2. Isoler les différentes tranches de cas d'usage (ex: création nominale, modification, consultation, suppression).
3. Découper chaque tranche en tâches d'ingénierie unitaires.
4. Renseigner les entrées, sorties et critères de test pour chaque tâche.
5. Assigner chaque tâche à l'agent compétent selon ses responsabilités.

# CHECKLIST
- [ ] Chaque tâche est-elle formulée avec un verbe d'action et un périmètre strict ?
- [ ] Les dépendances entre tâches sont-elles exemptes de cycles ?
- [ ] Chaque tâche dispose-t-elle de critères de validation mesurables ?

# EXAMPLES
Décomposition verticale d'une fonctionnalité :
```text
Feature : Gestion des adresses de livraison
├── Tâche 1 : [DBA] Table `shipping_addresses` PostgreSQL avec contrainte et clé étrangère customer_id
├── Tâche 2 : [Backend] Endpoint POST /api/v1/customers/{id}/addresses avec validation FluentValidation
├── Tâche 3 : [Testeur] Tests d'intégration WebApplicationFactory pour la création d'adresse
├── Tâche 4 : [Frontend] Formulaire React Hook Form + Zod pour la saisie d'adresse
└── Tâche 5 : [Réviseur] Revue de code croisée et validation finale
```