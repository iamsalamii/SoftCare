# PURPOSE
Cadrer, exprimer et formaliser les exigences fonctionnelles et non-fonctionnelles de manière claire, non ambiguë, testable et alignée sur le besoin utilisateur.

# WHEN TO USE
- Avant d'engager la moindre ligne de conception technique ou de code.

# PRINCIPLES
- **Focus sur le Problème, pas la Solution** : Exprimer précisément ce dont l'utilisateur a besoin avant de décréter la solution technique.
- **Critères d'Acceptation Vérifiables** : Chaque exigence doit pouvoir faire l'objet d'un test automatisé ou d'une validation factuelle binaire (Réussi / Échoué).
- **Anti-Ambiguïté** : Éliminer les termes vagues ("le système doit être rapide", "l'interface doit être conviviale").

# BEST PRACTICES
- Formaliser les User Stories selon le canevas éprouvé : `En tant que [rôle], je veux [action] afin de [bénéfice]`.
- Exprimer les critères d'acceptation selon le format BDD / Gherkin : `Étant donné [contexte], Quand [action], Alors [résultat attendu]`.
- Spécifier les exigences non-fonctionnelles avec des métriques mesurables (ex: temps de réponse p95 < 200ms sous 100 req/s).

# COMMON MISTAKES
- Rédiger des spécifications floues laissant les développeurs deviner le comportement métier attendu.
- Omettre de spécifier les cas d'erreur, les restrictions de permissions ou les limites de volume.
- Modifier les exigences en cours d'itération sans en mesurer l'impact sur le reste de la chaîne.

# WORKFLOW
1. Analyser le besoin métier brut exprimé par les parties prenantes.
2. Rédiger la User Story et délimiter son périmètre strict.
3. Définir les critères d'acceptation Given-When-Then.
4. Spécifier les contraintes de performance, sécurité et conformité associées.
5. Valider l'expression du besoin avec l'Orchestrateur et l'Architecte.

# CHECKLIST
- [ ] La User Story est-elle formulée sans jargon technique prématuré ?
- [ ] Chaque critère d'acceptation est-il testable de manière non ambiguë ?
- [ ] Les contraintes de sécurité et de performances sont-elles formalisées ?

# EXAMPLES
Exemple de critère d'acceptation formel :
```gherkin
Scénario : Validation de la création d'un compte client
  Étant donné un visiteur non authentifié
  Quand il soumet le formulaire d'inscription avec une adresse email déjà enregistrée
  Alors le système refuse la création
  Et renvoie un code HTTP 409 Conflict avec un message invitant à la réinitialisation de mot de passe.
```