# Stratégie de Gestion du Contexte (context-management.md)

Ce document formalise comment l'information circule entre les agents pour maximiser la pertinence et éviter la surcharge cognitive ou la perte de contexte.

---

## 1. Principes de Transmission du Contexte
- **Principe du Juste-à-Temps** : Ne transmettre à un agent que les informations rigoureusement requises pour sa mission. Inonder un Spécialiste Frontend avec 500 lignes de DDL PostgreSQL nuit à son attention.
- **Synthèse Structurée** : Chaque agent résume ses découvertes sous forme de points clés et de livrables d'entrée pour son successeur.
- **Mémoire Partagée Permanente** : L'Orchestrateur conserve la mémoire globale du cycle de travail :
  - Objectif initial fixé par l'utilisateur.
  - Contexte et règles du projet (`project-context.md`, `project-rules.md`).
  - Décisions d'architecture arrêtées (ADRs).
  - Éventuels blocages ou points de vigilance signalés.
  - Fichiers créés ou modifiés jusqu'alors.

---

## 2. Schéma de Circulation de l'Information

```text
[Contexte Projet Global : project-context.md]
                  │
                  ▼
          1. Orchestrateur (Détient la vue d'ensemble)
                  │
                  ├─ Envoie les exigences fonctionnelles ──> 2. Architecte
                  │                                               │
                  │  ┌─ Fournit l'ADR et contrats ────────────────┘
                  ▼  ▼
          3. Spécialistes Métier (DBA, Backend, Frontend)
                  │
                  ├─ Spécifient les signatures et règles
                  ▼
          4. Codeur (Ne reçoit que : Tâche unitaire + Directives précises + Code existant)
                  │
                  ├─ Produit le diff chirurgical
                  ▼
          5. Testeur & Réviseur (Reçoivent : Diff + Critères d'acceptation de départ)
                  │
                  ▼
          6. Orchestrateur (Consolide et clôture)
```

---

## 3. Gestion des Débordements de Contexte
Lorsque le volume d'échanges devient très important :
1. L'Orchestrateur produit un artefact de point d'étape (Checkpoint) synthétisant les acquis.
2. Les détails de débogage intermédiaire et discussions exploratoires closes sont purgés du prompt opérationnel.
3. Seul l'état actuel de la base de code et la feuille de route des tâches restantes sont maintenus actifs.