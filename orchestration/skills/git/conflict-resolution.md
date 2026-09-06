# PURPOSE
Résoudre les conflits de fusion Git de manière sereine, rigoureuse et sécurisée sans détruire le travail d'autrui ni introduire de régression.

# WHEN TO USE
- Lors d'un `git rebase` ou `git merge` lorsque deux branches ont modifié concurremment les mêmes lignes de code.

# PRINCIPLES
- **Compréhension des Deux Côtés** : Analyser à la fois ce que propose votre branche (`HEAD` ou `ours`) et ce qui a été intégré sur la branche cible (`incoming` ou `theirs`).
- **Communication & Concertation** : En cas de doute sur l'intention d'un changement concurrent, échanger avec l'auteur.
- **Validation Systématique Post-Résolution** : Toujours compiler et réexécuter l'intégralité des tests après la résolution.

# BEST PRACTICES
- Résoudre les conflits via rebase interactif (`git rebase main`) pour conserver un historique propre.
- Utiliser un outil de diff visuel ou l'interface de l'IDE (Antigravity / VS Code merge editor).
- Procéder commit par commit lors d'un rebase plutôt que tout fusionner d'un bloc.

# COMMON MISTAKES
- Choisir aveuglément "Accept Current" ou "Accept Incoming" sans examiner le code en détail.
- Commiter des marqueurs de conflit textuels non résolus (`<<<<<<<`, `=======`, `>>>>>>>`).
- Omettre de tester la compilation et les tests immédiatement après la résolution.

# WORKFLOW
1. Lancer la synchronisation : `git fetch origin && git rebase origin/main`.
2. Repérer les fichiers en conflit listés par Git (`git status`).
3. Ouvrir chaque fichier et résoudre les conflits ligne par ligne en fusionnant l'intention des deux modifications.
4. Indexer les fichiers résolus (`git add <fichier>`).
5. Continuer le rebase (`git rebase --continue`) jusqu'à finalisation complète.
6. Lancer les tests pour s'assurer du fonctionnement sans faille.

# CHECKLIST
- [ ] Aucun marqueur de conflit (`<<<<<<<`) n'a-t-il été oublié dans le code ?
- [ ] L'application compile-t-elle parfaitement ?
- [ ] Tous les tests automatisés passent-ils au vert après la résolution ?

# EXAMPLES
Résolution propre d'un conflit de dépendances ou d'imports :
```csharp
// AVANT RÉSOLUTION :
<<<<<<< HEAD
using MyApp.Services.Orders;
=======
using MyApp.Services.Invoicing;
>>>>>>> origin/main

// APRÈS RÉSOLUTION PROPRE (Conservation des deux intentions) :
using MyApp.Services.Invoicing;
using MyApp.Services.Orders;
```