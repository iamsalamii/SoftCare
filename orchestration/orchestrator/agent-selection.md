# Algorithme de Sélection Dynamique des Agents (agent-selection.md)

L'algorithme ci-dessous permet à l'Orchestrateur de déterminer dynamiquement la composition de l'équipe d'agents en fonction de l'évaluation de la tâche.

---

## Arbre de Décision

```text
Requête Utilisateur Reçue
          │
          ▼
   Est-ce une anomalie (Bug) ?
   ├── OUI ──> [Orchestrateur, Débogueur, Spécialiste Ciblé, Codeur, Testeur, Réviseur]
   │
   └── NON ──> Nécessite-t-il une exploration technique / paquet tiers inconnu ?
               ├── OUI ──> Activer [Scout]
               │
               ▼
               Impacte-t-il l'architecture ou plus de 2 modules ?
               ├── OUI ──> Activer [Architecte, Agenda]
               │
               ▼
               Comporte-t-il des changements en base de données ?
               ├── OUI ──> Activer [DBA]
               │
               ▼
               Comporte-t-il des endpoints ou services C# / .NET ?
               ├── OUI ──> Activer [Spécialiste Backend]
               │
               ▼
               Comporte-t-il des interfaces web ou formulaires React ?
               ├── OUI ──> Si création visuelle : [Concepteur UI]
               │           Dans tous les cas : [Spécialiste Frontend]
               │
               ▼
               Implémentation concrète requise ?
               ├── OUI ──> Activer [Codeur, Testeur, Réviseur]
               │
               ▼
               Impacte-t-il la sécurité, auth ou données sensibles ?
               ├── OUI ──> Activer [Auditeur Sécurité, Pentester]
               │
               ▼
               Impacte-t-il les conteneurs ou pipelines CI/CD ?
               ├── OUI ──> Activer [DevOps]
               │
               ▼
               Présente-t-il un risque de charge ou latence critique ?
               ├── OUI ──> Activer [Fullstack & Performance]
               │
               ▼
               Nécessite-t-il une mise à jour documentaire (OpenAPI, README) ?
               └── OUI ──> Activer [Documentation]
```

---

## Critères de Dimensionnement
- **Niveau 1 : Trivial** (1 à 2 agents) : Codeur -> Réviseur.
- **Niveau 2 : Standard** (3 à 5 agents) : Spécialiste -> Codeur -> Testeur -> Réviseur.
- **Niveau 3 : Complexe / Majeur** (6 à 10 agents) : Orchestrateur -> Architecte -> DBA -> Backend -> Frontend -> Codeur -> Testeur -> Sécurité -> Réviseur -> Documentation.