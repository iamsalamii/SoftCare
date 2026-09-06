# REGISTRE DES AGENTS - PROJET SOFTCARE

Ce registre définit l'intervention des 17 agents de `ANTIGRAVITY-ORCHESTRATION` sur le code source de **SoftCare**.

| Agent | Périmètre d'Intervention dans SoftCare | Déclencheur |
| :--- | :--- | :--- |
| **Orchestrateur** | Cadrage des demandes, coordination, Quality Gate final | Toute demande utilisateur |
| **Architecte** | Respect de la Clean Architecture (.NET 9), découpage modulaire | Ajout de modules ou modification de couches |
| **Agenda** | Découpage des lots de développement (WBS) | Fonctionnalités multi-étapes |
| **Scout** | Veille sur les packages .NET/npm, normes FHIR/HL7, CDS Hooks | Intégration de bibliothèques tierces |
| **Concepteur UI** | Ergonomie des vues hospitalières, formulaires de santé, a11y | Nouvel écran ou refonte visuelle |
| **Spécialiste Backend** | `backend/src/SoftCare.API`, `Application`, `Domain`, `Infrastructure` | Nouveaux endpoints, services, SignalR |
| **Spécialiste Frontend** | `src/components/`, `src/services/`, `src/context/AppContext.tsx` | Nouveaux composants, hooks, intégration API |
| **DBA** | PostgreSQL 16, `backend/init-database.sql`, index, intégrité | Nouvelles tables, colonnes, perfs SQL |
| **Codeur** | Implémentation chirurgicale de code C# et TSX | Écriture concrète après spécification |
| **Débogueur** | Diagnostic d'anomalies, traçage des logs, non-régression | Bugs, plantages, erreurs d'API ou de rendu |
| **Testeur** | `backend/tests/SoftCare.UnitTests`, tests xUnit, tests React | Post-implémentation, maintien du vert 100% |
| **Réviseur** | Revue de code bloquante (droit de veto) | Avant validation finale de toute tâche |
| **Auditeur Sécurité** | Sécurité HDS, RGPD, JWT, validation PGx critique | Données patients, authentification, release |
| **Pentester** | Épreuves d'intrusion éthiques sur les endpoints médicaux | Validation pré-release des APIs sensibles |
| **DevOps** | `docker-compose.yml`, `Dockerfile`, `.github/`, scripts | Conteneurisation, CI/CD, déploiement |
| **Fullstack & Perf** | Profiling bout-en-bout, latence douchette code-barres (<5ms) | Ralentissements, requêtes lentes |
| **Documentation** | `FICHE_TECHNIQUE.md`, `ARCHITECTURE.md`, Swagger OpenAPI | Clôture de fonctionnalités |