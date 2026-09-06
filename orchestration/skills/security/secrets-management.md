# PURPOSE
Gérer, injecter et protéger les informations hautement sensibles (clés d'API, mots de passe de base de données, clés de chiffrement) tout au long du cycle de vie logiciel sans jamais les exposer.

# WHEN TO USE
- Dans tous les projets dès la première ligne de code et à toutes les étapes du déploiement.

# PRINCIPLES
- **Zéro Secret dans le Référentiel** : Aucun secret, même de test, ne doit jamais être commité dans Git.
- **Cloisonnement par Environnement** : Les secrets de production doivent être totalement distincts de ceux de staging ou de développement.
- **Rotation Régulière & Révocation Rapide** : Être capable de remplacer un secret compromis sans reconstruire l'application.

# BEST PRACTICES
- Utiliser des gestionnaires de configuration locaux (Secret Manager en .NET, fichiers `.env` exclus par `.gitignore`).
- En production, injecter les secrets via les variables d'environnement du conteneur ou un coffre-fort dédié (Azure Key Vault, HashiCorp Vault, AWS Secrets Manager).
- Analyser les commits avec des outils de détection de fuites (gitleaks, git-secrets).

# COMMON MISTAKES
- Commiter par inadvertance un fichier `appsettings.Production.json` contenant la chaîne de connexion PostgreSQL réelle.
- Partager des clés privées via des canaux de messagerie non chiffrés.
- Laisser des clés d'API tierces hardcodées dans le code source JavaScript du frontend.

# WORKFLOW
1. Déclarer les templates de configuration avec des placeholders (`appsettings.example.json`, `.env.example`).
2. Configurer `.gitignore` pour bloquer les fichiers de secrets.
3. Utiliser l'outil User Secrets de .NET en environnement de développement local (`dotnet user-secrets`).
4. Configurer l'injection automatique via l'infrastructure CI/CD en production.
5. Auditer l'historique Git pour s'assurer de l'absence de fuite antérieure.

# CHECKLIST
- [ ] Les fichiers `.env` et configurations avec mots de passe réels sont-ils dans `.gitignore` ?
- [ ] Aucun mot de passe n'apparaît-il dans l'historique des commits Git ?
- [ ] Les développeurs locaux utilisent-ils `dotnet user-secrets` ou des variables locales ?

# EXAMPLES
Utilisation du Secret Manager de .NET en local :
```bash
# Initialisation des user-secrets dans le projet d'API
dotnet user-secrets init

# Définition sécurisée de la chaîne de connexion PostgreSQL locale
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=mydb;Username=myuser;Password=MonSecretLocal"
```