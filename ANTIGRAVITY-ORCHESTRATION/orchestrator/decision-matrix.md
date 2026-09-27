# Matrice de Décision par Cas d'Usage (decision-matrix.md)

Cette matrice formalise les chaînes d'intervention standards pour les typologies de tâches les plus fréquentes.

---

## 1. Cas d'Usage Types

### A. Correction d'un Bug (Anomalie Runtime / Régression)
```text
Orchestrateur
  └──> Débogueur (Reproduction déterministe & Root Cause Analysis)
        └──> Spécialiste Concerné (Backend, Frontend ou DBA)
              └──> Codeur (Implémentation chirurgicale du correctif)
                    └──> Testeur (Validation du test de régression automatisé)
                          └──> Réviseur (Validation du diff & approbation)
```

### B. Nouvelle API / Endpoint Backend
```text
Orchestrateur
  └──> Scout (si bibliothèque tierce ou protocole externe)
        └──> Architecte (Validation des contrats et conformité REST)
              └──> Spécialiste Backend (Spécification DTOs, FluentValidation, Services)
                    └──> DBA (si persistance PostgreSQL impactée)
                          └──> Codeur (Écriture du code C#)
                                └──> Testeur (Tests unitaires & WebApplicationFactory)
                                      └──> Auditeur Sécurité (Validation contrôles d'accès)
                                            └──> Réviseur (Revue rigoureuse & Veto)
                                                  └──> Documentation (Mise à jour OpenAPI/Swagger)
```

### C. Nouvelle Page / Interface UI
```text
Orchestrateur
  └──> Concepteur UI (Zoning, ergonomie, états Loading/Empty/Error, tokens Tailwind, a11y)
        └──> Spécialiste Frontend (Arborescence composants React, hooks, schémas Zod)
              └──> Codeur (Intégration TSX et classes Tailwind)
                    └──> Testeur (Tests unitaires composants & accessibilité)
                          └──> Réviseur (Contrôle propreté, absence de CSS inline)
```

### D. Évolution Base de Données (Migration PostgreSQL)
```text
Orchestrateur
  └──> DBA (Modélisation, types natifs, contraintes, index, script de migration DDL)
        └──> Spécialiste Backend (si entités EF Core ou Dapper impactées)
              └──> Testeur (Tests d'intégration sur conteneur PostgreSQL réel)
                    └──> Réviseur (Examen des verrous et de la non-régression)
```

### E. Problème de Performance (Latence / Consommation)
```text
Orchestrateur
  └──> Fullstack & Performance (Capture métriques, isolation bottleneck via profiling)
        └──> Spécialiste Concerné (Backend ou Frontend)
              └──> DBA (si optimisation requête EXPLAIN ANALYZE ou index nécessaire)
                    └──> Codeur (Application de l'optimisation)
                          └──> Testeur & Perf (Validation comparative du gain chiffré)
                                └──> Réviseur (Validation)
```

### F. Audit et Durcissement de Sécurité
```text
Orchestrateur
  └──> Auditeur Sécurité (Analyse statique, détection failles OWASP, audit tokens/secrets)
        └──> Pentester (Tests d'intrusion ciblés, contournements IDOR, PoCs)
              └──> Spécialiste Concerné (Mesures de remédiation)
                    └──> Codeur (Durcissement du code)
                          └──> Testeur (Tests de sécurité automatisés)
                                └──> Réviseur (Approbation finale)
```

### G. Déploiement et Infrastructure
```text
Orchestrateur
  └──> DevOps (Dockerfile multi-stage, docker-compose, scripts CI/CD)
        └──> Auditeur Sécurité (Audit des droits conteneurs et des secrets d'environnement)
              └──> Testeur (Vérification des sondes de santé /healthz)
                    └──> Documentation (Guide d'exploitation et runbooks)
```