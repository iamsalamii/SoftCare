# PURPOSE
Gérer l'historique de versions du code source de manière propre, atomique, traçable et collaborative en utilisant les fonctionnalités avancées de Git.

# WHEN TO USE
- Quotidiennement pour tout enregistrement, partage ou révision de code source.

# PRINCIPLES
- **Commits Atomiques** : Un commit ne doit accomplir qu'une seule tâche logique cohérente.
- **Messages de Commit Explicites** : Suivre la spécification Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).
- **Historique Linéaire et Lisible** : Privilégier le rebase interactif sur les branches de travail avant fusion.

# BEST PRACTICES
- Toujours vérifier le statut (`git status`) et le diff (`git diff`) avant d'indexer des fichiers (`git add`).
- Configurer un fichier `.gitignore` exhaustif bloquant les artefacts de compilation (`bin/`, `obj/`, `node_modules/`, `.vs/`).
- Ne jamais commiter de secrets ou fichiers de configuration avec mots de passe réels.

# COMMON MISTAKES
- Créer un unique commit géant "travail en cours" englobant 3 jours de travail et 40 fichiers disparates.
- Forcer un push (`git push --force`) sur une branche partagée (`main` ou `develop`).
- Commiter des fichiers temporaires ou dépendances binaires volumineuses dans l'historique Git.

# WORKFLOW
1. Créer une branche dédiée depuis `main` (`feature/nom-tache` ou `fix/nom-anomalie`).
2. Réaliser les modifications et tester localement.
3. Indexer et commiter atomiquement avec un message conventionnel.
4. Mettre à jour sa branche par rapport à la branche principale (`git fetch && git rebase origin/main`).
5. Pousser et ouvrir une Pull Request pour revue de code.

# CHECKLIST
- [ ] Le message de commit suit-il le format `type(scope): description` ?
- [ ] Le diff ne contient-il aucun fichier généré ou temporaire ?
- [ ] La branche a-t-elle été rebasée sur `main` sans conflits non résolus ?

# EXAMPLES
Format de message Conventional Commits :
```text
feat(auth): ajouter la prise en charge de l'authentification par cookie SameSite

- Configuration du middleware d'authentification par cookie dans ASP.NET Core
- Création du contrôleur de session utilisateur
- Ajout des tests d'intégration WebApplicationFactory
```