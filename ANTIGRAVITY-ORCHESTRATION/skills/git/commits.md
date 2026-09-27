# PURPOSE
Créer un historique de modifications Git propre, atomique, compréhensible et traçable en appliquant le standard Conventional Commits.

# WHEN TO USE
- À chaque enregistrement de modification dans le référentiel Git.

# PRINCIPLES
- **Atomicité** : Chaque commit représente un changement unitaire et autonome (qui compile et passe les tests).
- **Standardisation (Conventional Commits)** : Structure formelle `type(scope): message`.
- **Impératif Présent** : Rédiger le message sous forme d'ordre ou d'action ("ajouter" ou "add", pas "ajouté").

# BEST PRACTICES
- Utiliser les préfixes standards :
  - `feat`: Nouvelle fonctionnalité.
  - `fix`: Correction d'un bug.
  - `refactor`: Refactorisation sans changement de comportement ni ajout de feature.
  - `test`: Ajout ou correction de tests automatisés.
  - `docs`: Documentation uniquement.
  - `chore`: Maintenance de dépendances, scripts de build ou tooling.
- Ajouter un corps de message si la décision nécessite une explication contextuelle ("Pourquoi").

# COMMON MISTAKES
- Messages vagues ou non informatifs ("fix", "wip", "update", "corrections").
- Mélanger une refactorisation cosmétique et un correctif de sécurité dans le même commit.
- Laisser du code qui ne compile pas dans un commit sous prétexte de sauvegarder son travail.

# WORKFLOW
1. Vérifier les fichiers modifiés (`git status`).
2. Examiner le diff précis (`git diff`).
3. Indexer uniquement les fichiers concernés (`git add path/to/file`).
4. Rédiger le message de commit conventionnel (`git commit -m "..."`).
5. Vérifier le dernier commit dans le journal (`git log -1`).

# CHECKLIST
- [ ] Le commit compile-t-il et passe-t-il les tests sans régression ?
- [ ] Le message suit-il le formalisme `type(scope): description` ?
- [ ] Le commit est-il limité à un seul sujet logique ?

# EXAMPLES
Exemples de messages conformes :
```text
feat(orders): ajouter la validation de montant minimum de commande
fix(db): corriger le type de colonne timestamptz sur audit_logs
refactor(auth): simplifier la validation des tokens dans le middleware
test(users): ajouter les tests de cas limites sur la création de compte
```