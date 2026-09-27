# PURPOSE
Automatiser l'intégration continue et le déploiement continu pour valider, tester et déployer le code source à chaque modification avec rapidité et fiabilité.

# WHEN TO USE
- Dans tout référentiel de code hébergé sur GitHub, GitLab ou équivalent.

# PRINCIPLES
- **Validation Immédiate (Fail Fast)** : Lancer les étapes rapides (lint, analyse statique, build) avant les étapes longues.
- **Immuabilité des Artefacts** : Construire l'artefact (image Docker) une seule fois et le propager à travers les environnements.
- **Environnements Éphémères** : Instancier des services de dépendance (PostgreSQL) isolés lors des tests d'intégration.

# BEST PRACTICES
- Mettre en cache les dépendances de compilation (`nuget`, `npm cache`) pour diviser le temps de build.
- Bloquer tout merge vers la branche principale si un seul test ou contrôle de sécurité échoue.
- Sécuriser les secrets de déploiement via le gestionnaire de secrets de la forge CI/CD.

# COMMON MISTAKES
- Mettre en place des pipelines qui prennent plus de 15 minutes, décourageant les commits fréquents.
- Ignorer silencieusement les échecs de tests dans le script de pipeline (`continue-on-error: true`).
- Déployer directement en production sans étape de test préalable.

# WORKFLOW
1. Définir le fichier de workflow (`.github/workflows/ci.yml`).
2. Configurer le checkout du code et la restauration du cache de dépendances.
3. Exécuter la compilation et le linting.
4. Lancer les suites de tests unitaires et d'intégration avec conteneur de service.
5. Construire l'image Docker et scanner les vulnérabilités de conteneur.

# CHECKLIST
- [ ] Le pipeline s'exécute-t-il sur chaque Pull Request vers la branche principale ?
- [ ] Les étapes de compilation et de tests sont-elles bloquantes ?
- [ ] Le cache des paquets accélère-t-il les exécutions successives ?

# EXAMPLES
Workflow GitHub Actions pour projet .NET et PostgreSQL :
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore -c Release
      - name: Run Tests
        run: dotnet test --no-build -c Release --verbosity normal
```