# ANTIGRAVITY-ORCHESTRATION

Architecture professionnelle et modulaire d'orchestration d'agents IA pour le développement logiciel assisté par intelligence artificielle.

---

## 1. Vue d'Ensemble & Philosophie

`ANTIGRAVITY-ORCHESTRATION` est un cadre d'ingénierie logicielle conçu pour transformer des modèles de langage en une véritable **équipe de développement senior synchronisée**.

Plutôt que de s'appuyer sur un agent monolithique tentant de tout résoudre au détriment de la précision et de la cohérence, ce système implémente une **séparation stricte des responsabilités** (SoC - Separation of Concerns) appliquée aux agents IA. Chaque agent incarne un profil métier précis, dispose d'un périmètre d'action délimité, applique des critères de qualité rigoureux et collabore à travers des protocoles standardisés.

### Principes Directeurs
1. **Orchestration Dynamique & Adaptative** : Tous les agents ne sont pas mobilisés pour chaque tâche. Une correction de coquille n'active que le codeur et le réviseur ; une refonte d'API bancaire déclenche l'orchestrateur, le scout, l'architecte, le DBA, le backend, le testeur, l'auditeur de sécurité et la documentation.
2. **Anti-Sur-Engineering (KISS & YAGNI)** : Rejet formel des abstractions prématurées, des patterns artificiels et de la complexité accidentelle.
3. **Primat de la Qualité et de la Sécurité** : Aucun code n'est validé sans test, sans vérification de régression et sans audit d'impact de sécurité.
4. **Vérification Systématique** : Interdiction absolue de présumer du fonctionnement d'un fichier ou d'une commande sans exécution et validation physique.

---

## 2. Stack Technologique de Référence

L'orchestration est **technologiquement agnostique** dans ses principes conceptuels, mais optimisée par défaut pour la stack d'entreprise moderne suivante :

- **Backend** : C# / .NET 8 & 9 / ASP.NET Core Web API (Clean Architecture, Vertical Slices, Minimal APIs / Controllers).
- **Frontend** : React / TypeScript / Tailwind CSS / Vite (Composants modulaires, Hooks spécialisés, accessibilité WCAG AA).
- **Base de Données Principale** : **PostgreSQL** (Modélisation relationnelle stricte, indexation B-Tree/GIN/GiST, migrations séquentielles, analyse `EXPLAIN ANALYZE`, transactions ACID et verrous fins). *SQL Server est supporté comme compétence secondaire.*
- **Contrôle de Version** : Git (Trunk-based ou Git Flow pragmatique, commits conventionnels).
- **Architecture d'Échange** : RESTful API conforme RFC, formats JSON stricts, OpenAPI / Swagger v3.
- **Testing** : Pyramide complète (Tests unitaires xUnit / Vitest, intégration WebApplicationFactory / Testcontainers, API REST, E2E Playwright).
- **DevOps & Conteneurisation** : Docker, Docker Compose multi-stages, pipelines CI/CD automatisés (GitHub Actions, GitLab CI).

---

## 3. Arborescence du Système

L'écosystème `ANTIGRAVITY-ORCHESTRATION` est structuré en 5 répertoires majeurs :

```text
ANTIGRAVITY-ORCHESTRATION/
│
├── README.md                  # Documentation centrale du système
├── AGENTS.md                  # Registre et matrice de compétences des 17 agents
├── RULES.md                   # 20 règles d'or d'ingénierie non négociables
├── WORKFLOW.md                # Description formelle des flux de travail
├── PROJECT-SETUP.md           # Manuel d'intégration dans un nouveau projet
│
├── agents/                    # 17 fiches de profil d'agents spécialisés
│   ├── orchestrateur.md       # Tech Lead & Coordinateur en chef (Quality Gate)
│   ├── architecte.md          # Concepteur de systèmes et garant de la modularité
│   ├── agenda.md              # Planificateur, découpage WBS et gestion des dépendances
│   ├── scout.md               # Veilleur technique, analyste de dépendances et doc
│   ├── concepteur-ui.md       # Designer UX/UI, ergonomie, design tokens et a11y
│   ├── specialiste-backend.md # Expert C#, .NET, ASP.NET Core et services REST
│   ├── specialiste-frontend.md# Expert React, TypeScript, state et interfaces
│   ├── dba.md                 # Administrateur PostgreSQL, modélisation et indexation
│   ├── codeur.md              # Développeur chirurgien, implémentation ciblée
│   ├── debogueur.md           # Expert en diagnostic de cause racine et correctifs
│   ├── testeur.md             # Concepteur de tests et traqueur de régressions
│   ├── reviseur.md            # Réviseur de code senior doté d'un droit de veto
│   ├── auditeur-securite.md   # Défenseur OWASP, analyse statique et conformité
│   ├── pentester.md           # Testeur offensif éthique, validation des contrôles
│   ├── devops.md              # Expert Docker, CI/CD, builds et infrastructure
│   ├── fullstack-et-perf.md   # Optimiseur bout-en-bout, CPU/RAM et requêtes
│   └── documentation.md       # Archiviste technique, spécifications et guides
│
├── skills/                    # 12 répertoires de compétences réutilisables (62 fiches)
│   ├── architecture/          # Clean Arch, Modular Monolith, DDD, Layered, API
│   ├── backend/               # .NET, ASP.NET Core, DI, Auth, Error Handling...
│   ├── frontend/              # React, TypeScript, State, Forms, Performance...
│   ├── database/              # PostgreSQL, Indexing, Migrations, Transactions...
│   ├── security/              # Secure Coding, OWASP, Secrets, Input Validation...
│   ├── testing/               # Unit, Integration, API, E2E, Regression...
│   ├── devops/                # Git, Docker, CI/CD, Deployment, Monitoring...
│   ├── performance/           # Frontend, Backend, PostgreSQL, API Perf...
│   ├── documentation/         # Docs techniques, API Docs, ADRs...
│   ├── git/                   # Branching, Commits, Pull Requests, Conflits...
│   ├── ui-ux/                 # Design System, Responsive, Accessibilité...
│   └── project-management/    # Planning, Exigences, Roadmap, Décomposition...
│
├── orchestrator/              # 9 guides de gouvernance et protocoles d'exécution
│   ├── README.md              # Rôle et principes opérationnels de l'orchestrateur
│   ├── orchestration-rules.md # Règles formelles de synchronisation
│   ├── agent-selection.md     # Arbre de décision pour la sélection des agents
│   ├── decision-matrix.md     # Matrice matricielle types de tâches / profils
│   ├── workflow-development.md# Pipeline complet de nouvelle fonctionnalité
│   ├── workflow-debugging.md  # Pipeline d'analyse et résolution de bugs
│   ├── workflow-review.md     # Pipeline d'inspection et de revue de code
│   ├── workflow-release.md    # Pipeline de validation pré-production
│   └── context-management.md  # Gestion de mémoire, passage de contexte et filtrage
│
└── templates/                 # 8 modèles normalisés prêts à l'emploi
    ├── project-context.md     # Fiche d'identité globale d'un projet
    ├── project-rules.md       # Règles et contraintes spécifiques d'un projet
    ├── feature-specification.md # Cahier des charges technique d'une feature
    ├── bug-report.md          # Fiche standardisée de reproduction de bug
    ├── architecture-decision.md # Architecture Decision Record (ADR)
    ├── code-review.md         # Grille d'évaluation pour la revue de code
    ├── task.md                # Spécification unitaire d'une tâche de code
    └── release-checklist.md   # Checklist de vérification avant mise en ligne
```

---

## 4. Fonctionnement de l'Équipe d'Agents

L'organisation repose sur une hiérarchie de collaboration bien définie :

1. **L'Orchestrateur** reçoit la demande, analyse le contexte du projet, consulte la matrice de décision (`orchestrator/decision-matrix.md`) et instancie la séquence minimale d'agents nécessaire.
2. **Les Experts Métier** (Architecte, DBA, Backend, Frontend, UI) établissent les spécifications, modélisations et contrats d'interface sans écrire le code applicatif définitif.
3. **Le Codeur** prend en charge l'implémentation concrète en appliquant strictement les consignes des spécialistes et les conventions du projet.
4. **Les Agents de Contrôle** (Testeur, Réviseur, Auditeur Sécurité, Pentester) challengent le code produit. Le Réviseur possède un **pouvoir de veto** immédiat si les standards de qualité ou les règles architecturales sont bafoués.
5. **La Clôture** est assurée par l'agent de Documentation (qui met à jour les ADRs et spécifications OpenAPI) et par l'Orchestrateur qui valide le respect intégral des critères d'acceptation initiaux.

---

## 5. Comment Étendre l'Architecture

### Ajouter un Nouvel Agent
1. Créer le fichier `agents/<nom-agent>.md`.
2. Respecter scrupuleusement les 14 sections normées (Role, Mission, Responsibilities, Expertise, Inputs, Outputs, When to Activate, When Not to Activate, Workflow, Rules, Quality Checklist, Collaboration With Other Agents, Expected Deliverables, Failure Conditions, Final Response Format).
3. Mettre à jour `AGENTS.md` et `orchestrator/agent-selection.md`.

### Ajouter un Nouveau Skill
1. Choisir le répertoire adéquat dans `skills/<domaine>/`.
2. Respecter les 8 sections obligatoires (Purpose, When to Use, Principles, Best Practices, Common Mistakes, Workflow, Checklist, Examples).
3. Référencer le skill dans les profils d'agents concernés.

---

## 6. Prochaines Étapes

Cette base constitue un référentiel central pérenne et autonome situé sur votre Bureau. Pour découvrir comment brancher cette orchestration sur vos projets de code concrets, consultez [PROJECT-SETUP.md](file:///C:/Users/DELL/Desktop/ANTIGRAVITY-ORCHESTRATION/PROJECT-SETUP.md).