# Pipeline de Développement de Fonctionnalité (workflow-development.md)

Ce document décrit le cycle de vie complet de conception et de livraison d'une nouvelle fonctionnalité logicielle majeure.

---

## Les 16 Étapes du Cycle de Développement

1. **Cadrage (Orchestrateur)** : Analyse des objectifs, recueil des critères d'acceptation, vérification du contexte (`project-context.md`).
2. **Recherche Technique (Scout - Optionnel)** : Vérification de la compatibilité des paquets NuGet/npm ou exploration des spécifications tierces.
3. **Architecture & Découpage (Architecte)** : Établissement des frontières de domaine, choix des patterns et rédaction de l'ADR si requis.
4. **Planification & WBS (Agenda)** : Découpage de la fonctionnalité en sous-tâches unitaires ordonnées selon le modèle `templates/task.md`.
5. **Conception UI (Concepteur UI - si interface)** : Spécifications visuelles, design tokens Tailwind, maquettage des 4 états d'écran et règles d'accessibilité.
6. **Persistance & Schéma (DBA - si données)** : Modélisation des tables PostgreSQL, indexation et écriture du script de migration séquentiel.
7. **Spécification Serveur (Spécialiste Backend - si API)** : Définition des DTOs, règles FluentValidation, services applicatifs et gestion d'erreurs.
8. **Spécification Client (Spécialiste Frontend - si UI)** : Typage TypeScript, schémas Zod, custom hooks React Query et formulaires.
9. **Implémentation Chirurgicale (Codeur)** : Écriture ciblée du code source dans le strict respect des conventions existantes.
10. **Assurance Qualité & Pyramide de Tests (Testeur)** : Écriture et exécution des tests unitaires, d'intégration (Testcontainers) et API.
11. **Contrôles de Sécurité (Auditeur Sécurité / Pentester)** : Vérification des contrôles d'accès, sanitisation et recherche de contournements.
12. **Validation des Performances (Fullstack & Perf - si charge critique)** : Profilage des requêtes SQL et vérification de la fluidité UI.
13. **Revue de Code Bloquante (Réviseur)** : Examen exhaustif du diff. Droit de veto bloquant en cas de non-conformité à `RULES.md`.
14. **Mise à Jour Documentaire (Documentation)** : Actualisation des spécifications OpenAPI, des guides README et du changelog.
15. **Infrastructure & Intégration (DevOps - si impact conteneur)** : Ajustement des Dockerfiles, volumes ou pipelines CI/CD.
16. **Clôture & Recette (Orchestrateur)** : Vérification globale finale et remise du rapport de fin de tâche à l'utilisateur.