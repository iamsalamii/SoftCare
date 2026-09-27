# Pipeline de Validation de Release (workflow-release.md)

Protocole de préparation, de sécurisation et de mise en production d'une version logicielle.

---

## Les 5 Sas de Validation Pré-Release

### Sas 1 : Gel du Périmètre & Validation des Tests
- Vérification que toutes les fonctionnalités prévues ont été révisées et approuvées.
- Exécution de la suite complète des tests (Unitaires, Intégration, Contrats d'API, E2E).
- Vérification du passage au vert à 100%.

### Sas 2 : Audit de Sécurité et de Conformité
- Scan statique des dépendances (SCA) pour vérifier l'absence de vulnérabilités critiques (CVE).
- Examen par l'Auditeur Sécurité de la gestion des secrets et des configurations d'en-têtes HTTP.
- Tests d'intrusion d'épreuve par le Pentester sur les endpoints critiques.

### Sas 3 : Validation des Migrations de Base de Données
- Vérification de l'idempotence des scripts de migration PostgreSQL.
- Validation de l'absence de verrous exclusifs destructeurs (Expand and Contract).
- Répétition de la procédure de migration sur une copie de données de staging.

### Sas 4 : Préparation des Livrables & Déploiement
- Construction de l'image Docker multi-stage finale étiquetée avec la version sémantique (SemVer).
- Mise à jour du `CHANGELOG.md` et de la documentation OpenAPI par l'agent Documentation.
- Renseignement exhaustif de la fiche `templates/release-checklist.md`.

### Sas 5 : Mise en Ligne & Contrôle Post-Déploiement (Smoke Tests)
- Déploiement progressif ou Blue/Green orchestré par l'agent DevOps.
- Interrogation immédiate des endpoints de santé `/healthz`.
- Surveillance en temps réel des métriques et logs d'erreurs 5xx pendant les 15 premières minutes.