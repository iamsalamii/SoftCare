# PURPOSE
Appliquer les pratiques de codage sécurisé dès la conception logicielle pour éliminer les vulnérabilités courantes (OWASP Top 10) à la source.

# WHEN TO USE
- Lors de toute écriture ou revue de code source dans l'application.

# PRINCIPLES
- **Défense en Profondeur** : Ne jamais se reposer sur une seule ligne de défense.
- **Principe du Moindre Privilège** : Accorder uniquement les permissions nécessaires et suffisantes.
- **Fail Securely** : En cas d'erreur ou d'exception, le système doit basculer vers l'état le plus protecteur.

# BEST PRACTICES
- Éviter la concaténation de commandes ou requêtes SQL : utiliser des abstractions typées et requêtes paramétrées.
- Neutraliser et échapper les données dynamiques injectées dans le DOM pour prévenir le Cross-Site Scripting (XSS).
- Protéger les données sensibles en mémoire et forcer la libération des buffers cryptographiques.

# COMMON MISTAKES
- Faire confiance aux données transitant par des champs cachés ou des en-têtes HTTP non signés.
- Laisser du code de débogage ou des backdoors temporaires dans les branches de release.
- Désactiver les contrôles de sécurité locaux sous prétexte de simplifier les tests de développement.

# WORKFLOW
1. Identifier la sensibilité des données manipulées par le composant.
2. Définir les barrières de validation et d'échappement.
3. Implémenter le code en appliquant les patterns défensifs.
4. Soumettre le code à l'analyse statique de sécurité.
5. Valider l'absence de failles via des tests de sécurité négatifs.

# CHECKLIST
- [ ] Toutes les entrées non fiables sont-elles assainies et validées ?
- [ ] Les mécanismes d'échappement contextuels sont-ils en place ?
- [ ] Aucun secret ni information confidentielle n'apparaît dans les logs d'application ?

# EXAMPLES
Requête paramétrée sûre contre l'injection SQL :
```csharp
// SÉCURISÉ : Paramétrage strict de la requête
await using var cmd = new NpgsqlCommand("SELECT id, email FROM users WHERE username = @u", connection);
cmd.Parameters.AddWithValue("u", username);
```