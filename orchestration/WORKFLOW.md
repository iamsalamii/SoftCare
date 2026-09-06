# Cycle de Vie et Workflows d'Orchestration (WORKFLOW.md)

Ce document décrit les processus de traitement des demandes et la manière dont les agents collaborent selon la nature et la complexité des interventions.

---

## 1. Principes Fondamentaux d'Exécution

1. **Activation Dynamique** : Jamais l'ensemble des 17 agents n'est mobilisé simultanément sans justification. L'Orchestrateur dimensionne la chaîne au strict nécessaire.
2. **Passage de Témoin Structuré** : Chaque agent produit un artefact ou une synthèse formatée servant d'input direct à l'agent suivant.
3. **Quality Gates Bloquants** : Les étapes de test, de sécurité et de revue de code possèdent un droit d'arrêt immédiat (Veto) imposant un retour en phase d'implémentation.

---

## 2. Le Workflow Général de Développement (Nouvelle Fonctionnalité)

Pour une fonctionnalité métier significative, le flux type s'articule comme suit :

```text
[Utilisateur]
      │
      ▼
1. Orchestrateur ───> Analyse du besoin, cadrage et sélection des agents
      │
      ▼
2. Scout (si tech inconnue / paquet tiers nécessaire)
      │
      ▼
3. Architecte ───────> Définition des frontières, découpage et ADR
      │
      ▼
4. Agenda ───────────> Découpage en sous-tâches WBS et ordonnancement
      │
      ├──────────────────────┬──────────────────────┐
      ▼                      ▼                      ▼
5. Concepteur UI       6. DBA (PostgreSQL)    7. Spécialiste Backend
(Wireframes, a11y)     (Tables, Index, Migr)  (DTOs, Services, Contrats)
      │                      │                      │
      └──────────────────────┼──────────────────────┘
                             ▼
                       8. Spécialiste Frontend
                       (Composants React, Hooks, State)
                             │
                             ▼
                       9. Codeur
                       (Implémentation chirurgicale du code)
                             │
                             ▼
                       10. Testeur
                       (Tests unitaires, intégration, validation)
                             │
                             ▼
                       11. Auditeur Sécurité / Pentester
                       (Contrôles d'accès, injections, validation)
                             │
                             ▼
                       12. Fullstack & Performance (si charge critique)
                             │
                             ▼
                       13. Réviseur (Quality Gate Bloquant)
                             │  ├──> [Rejet : retour au Codeur]
                             ▼
                       14. Documentation (OpenAPI, ADR, Guides)
                             │
                             ▼
                       15. DevOps (si impact Docker / CI-CD)
                             │
                             ▼
                       16. Orchestrateur ───> Clôture et rapport à l'Utilisateur
```

---

## 3. Workflows Spécialisés

### A. Workflow Correction d'Anomalie (Bugfix)
1. **Orchestrateur** : Réception du rapport d'erreur ou du log d'exception.
2. **Débogueur** : Reproduction isolée, traçage de pile, analyse de la cause racine.
3. **Spécialiste Concerné** (Backend, Frontend ou DBA) : Définition de la stratégie de correction non-régressive.
4. **Codeur** : Application du correctif ciblé.
5. **Testeur** : Écriture d'un test de régression automatisé prouvant la correction.
6. **Réviseur** : Validation du diff et approbation de la fusion.
7. **Orchestrateur** : Clôture.

### B. Workflow Évolution Base de Données (DBA First)
1. **Orchestrateur** : Réception du besoin de persistance.
2. **DBA** : Modélisation PostgreSQL, choix des types, contraintes de clés étrangères, indexation et écriture du script de migration séquentiel.
3. **Spécialiste Backend** : Mise à jour des entités C#, configuration DbContext / Dapper et mapping DTO.
4. **Testeur** : Exécution de tests d'intégration avec base de test éphémère (ex: Testcontainers PostgreSQL).
5. **Réviseur** : Examen de la compatibilité ascendante et des verrous de migration.
6. **Documentation** : Mise à jour du schéma de données.

### C. Workflow Nouvelle Page / Interface Utilisateur (UI First)
1. **Orchestrateur** : Cadrage du parcours utilisateur.
2. **Concepteur UI** : Définition de la grille, hiérarchie visuelle, états (Loading, Error, Empty, Success), spécifications Tailwind et accessibilité clavier/screen-reader.
3. **Spécialiste Frontend** : Conception de l'arborescence des composants React, typage TypeScript strict des Props et gestion d'état serveur (React Query).
4. **Codeur** : Écriture des composants JSX/TSX.
5. **Testeur** : Tests unitaires de rendu et d'interaction utilisateur.
6. **Réviseur** : Contrôle du découpage, de la réutilisabilité et de l'absence de CSS inline.

### D. Workflow Optimisation des Performances
1. **Orchestrateur** : Identification du goulet d'étranglement (latence API, freeze UI, lenteur SQL).
2. **Fullstack & Performance** : Profiling instrumental, capture des métriques, isolation du bottleneck (N+1, index manquant, re-render intempestif).
3. **Spécialiste Concerné** (DBA, Backend ou Frontend) : Formulation de la solution d'optimisation minimale.
4. **Codeur** : Refactorisation ciblée.
5. **Fullstack & Performance** : Mesure comparative avant/après pour attester du gain réel.
6. **Réviseur & Orchestrateur** : Approbation.

### E. Workflow Audit et Durcissement de Sécurité
1. **Orchestrateur** : Cadrage de l'audit ou préparation de release.
2. **Auditeur Sécurité** : Examen statique des endpoints, contrôle des flux d'authentification, validation des configurations CORS/CSP et analyse des dépendances vulnérables.
3. **Pentester** : Tentatives d'exploitation (contournement d'autorisation IDOR, injection de payload, fuzzing d'entrées).
4. **Spécialiste Backend / Frontend** : Conception des mesures de remédiation.
5. **Codeur** : Durcissement du code.
6. **Testeur** : Ajout de tests de sécurité automatisés.
7. **Réviseur & Orchestrateur** : Validation du niveau de risque résiduel.

---

## 4. Gestion des Retours en Arrière (Feedback Loops)

À tout moment, si le **Testeur**, l'**Auditeur Sécurité** ou le **Réviseur** détecte une anomalie :
- Le livrable est rejeté avec un motif détaillé et des critères de correction précis.
- Le flux revient directement au **Codeur** ou au **Spécialiste** responsable.
- Les tests et revues sont intégralement réexécutés sur le nouveau diff avant toute progression.