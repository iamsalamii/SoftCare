# PURPOSE
Structurer la soumission, l'évaluation collaborative et l'intégration des modifications de code au moyen de Pull Requests (ou Merge Requests) rigoureuses.

# WHEN TO USE
- Pour chaque fusion de code vers la branche principale `main`.

# PRINCIPLES
- **Taille Maîtrisée** : Une Pull Request de petite taille (< 300 lignes modifiées) est revue plus vite et plus efficacement qu'un diff géant.
- **Contexte & Justification** : La PR doit expliciter le "Pourquoi", le "Comment" et fournir les instructions de test.
- **Sas Qualité Automatisé** : Aucun merge n'est autorisé si les checks CI sont au rouge ou si la revue est défavorable.

# BEST PRACTICES
- Renseigner systématiquement la description avec : Problème résolu, Modifications apportées, Preuves de test.
- Joindre des captures d'écran ou GIFs pour tout changement d'interface utilisateur React.
- Lier la Pull Request au ticket ou issue correspondante (`Closes #42`).

# COMMON MISTAKES
- Soumettre des PRs monstres de 2000 lignes touchant à 50 fichiers non corrélés.
- Fusionner soi-même sa propre PR sans relecture indépendante.
- Ignorer les commentaires de revue ou forcer le merge en contournant les règles de protection de branche.

# WORKFLOW
1. Pousser la branche de travail sur le serveur distant.
2. Ouvrir la Pull Request avec un titre clair et une description détaillée.
3. Attendre la fin de l'exécution automatique des tests du pipeline CI.
4. Répondre aux commentaires du Réviseur et appliquer les correctifs demandés.
5. Effectuer la fusion (Squash and Merge ou Rebase and Merge) une fois l'approbation obtenue.

# CHECKLIST
- [ ] La description de la PR explique-t-elle clairement le changement ?
- [ ] Les tests de la CI sont-ils tous passés au vert ?
- [ ] Le Réviseur a-t-il émis une approbation formelle (`Approved`) ?

# EXAMPLES
Modèle de description de Pull Request :
```markdown
## Résumé des Modifications
- Ajout de l'endpoint `POST /api/v1/customers` avec validation FluentValidation
- Création de la table `customers` et indexation sur `email`
- Ajout de la suite de tests d'intégration xUnit

## Liens
Closes #108

## Instructions de Test
1. Lancer `docker compose up -d`
2. Exécuter `dotnet test`
```