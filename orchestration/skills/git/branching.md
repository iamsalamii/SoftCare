# PURPOSE
Organiser le travail collaboratif sur le référentiel Git au moyen d'une stratégie de branches simple, prévisible et adaptée au déploiement continu.

# WHEN TO USE
- Pour structurer les contributions de l'équipe sur tout projet logiciel.

# PRINCIPLES
- **Trunk-Based / GitHub Flow Pragmatique** : Une branche principale stable (`main`), des branches de fonctionnalités éphémères (`feature/`, `fix/`).
- **Courte Durée de Vie** : Une branche de travail ne doit pas vivre plus de quelques jours pour éviter la divergence.
- **Protection de la Branche Principale** : Interdire tout commit direct sur `main` sans Pull Request validée et tests au vert.

# BEST PRACTICES
- Nommer les branches selon une convention claire : `feature/nom-court`, `fix/issue-123`, `refactor/api-orders`.
- Maintenir sa branche de travail à jour par rebase régulier sur `origin/main`.
- Supprimer automatiquement les branches distantes après fusion.

# COMMON MISTAKES
- Maintenir des branches de travail ouvertes pendant des mois sans synchronisation.
- Multiplier les branches intermédiaires inutiles (`staging`, `testing`, `pre-prod`) quand des tags suffisent.
- Commiter directement sur la branche principale en urgence sans passer par le sas de revue.

# WORKFLOW
1. Partir de la branche `main` à jour (`git checkout main && git pull`).
2. Créer une branche de travail (`git checkout -b feature/ma-fonctionnalite`).
3. Développer, tester et commiter localement.
4. Rebaser sur `main` (`git fetch origin && git rebase origin/main`).
5. Pousser et solliciter la revue de code.

# CHECKLIST
- [ ] La branche dérive-t-elle de la dernière version de `main` ?
- [ ] Le nom de branche est-il explicite et préfixé ?
- [ ] La branche a-t-elle une durée de vie courte (< 3 jours) ?

# EXAMPLES
Création et synchronisation d'une branche de travail :
```bash
git checkout main
git pull origin main
git checkout -b feature/user-profile-endpoint
# Travail et commits...
git fetch origin main
git rebase origin/main
git push -u origin feature/user-profile-endpoint
```