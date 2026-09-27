# Guide d'Initialisation de Projet (PROJECT-SETUP.md)

Ce guide explique comment réutiliser et brancher l'architecture `ANTIGRAVITY-ORCHESTRATION` sur vos projets de développement concrets de façon propre, maintenable et standardisée.

---

## 1. Philosophie d'Instanciation

Le répertoire central `ANTIGRAVITY-ORCHESTRATION` sur votre Bureau sert de **référentiel mère (Single Source of Truth)**. 
Lors de l'initialisation d'un nouveau projet, vous ne devez pas copier en vrac l'ensemble du système, mais configurer le projet pour qu'il référence et exploite les agents, règles et compétences nécessaires.

---

## 2. Démarche Pas-à-Pas pour un Nouveau Projet

### Étape 1 : Création de la Fiche d'Identité du Projet
1. Dans le dossier racine de votre projet applicatif, créez un répertoire `.antigravity/` ou `docs/orchestration/`.
2. Copiez le modèle `templates/project-context.md` vers votre projet sous le nom :
   `.antigravity/project-context.md`
3. Remplissez scrupuleusement les sections :
   - Nom et mission de l'application.
   - Stack technologique exacte (.NET version, React version, version PostgreSQL).
   - Règles de découpage architectural (ex: Clean Architecture, Vertical Slice).
   - Conventions de nommage et règles métier fondamentales.

### Étape 2 : Définition des Règles Locales du Projet
1. Copiez `templates/project-rules.md` vers :
   `.antigravity/project-rules.md`
2. Spécifiez les contraintes strictes propres à votre entreprise ou projet :
   - Exigences de couverture de tests (ex: 80% sur la couche Domain).
   - Politique d'authentification (ex: Cookie d'authentification SameSite strict vs Bearer JWT).
   - Outils tiers obligatoires (ex: Serilog pour le logging, MediatR ou injection de services directs).

### Étape 3 : Cartographie des Compétences Nécessaires (Skills)
Identifiez dans le dossier central `skills/` les fiches correspondant exactement à votre architecture :
- Si votre backend utilise ASP.NET Core et Entity Framework Core sur PostgreSQL :
  - `skills/backend/aspnet-core.md`
  - `skills/backend/dotnet.md`
  - `skills/database/postgresql.md`
  - `skills/database/migrations.md`
  - `skills/database/indexing.md`
- Si votre frontend est en React / Tailwind :
  - `skills/frontend/react.md`
  - `skills/frontend/typescript.md`
  - `skills/ui-ux/design-system.md`
- Référencez ces chemins dans `.antigravity/project-context.md` pour guider les agents lors de leurs lectures ciblées.

### Étape 4 : Choix des Profils d'Agents Mobilisables
Selon la taille de votre équipe ou du projet :
- **Petit projet / MVP** : Orchestrateur, Spécialiste Backend, Spécialiste Frontend, DBA, Codeur, Testeur, Réviseur.
- **Projet d'Entreprise / Haute Disponibilité** : Mobiliser l'ensemble des 17 profils, notamment l'Architecte, l'Auditeur Sécurité, le Pentester et l'ingénieur Fullstack & Perf.

### Étape 5 : Lancement d'une Session de Développement
Lorsqu'une nouvelle tâche ou fonctionnalité doit être développée :
1. Remplissez une spécification à partir de `templates/feature-specification.md` ou `templates/task.md`.
2. Soumettez cette spécification à l'**Orchestrateur** en fournissant le chemin d'accès à votre `.antigravity/project-context.md`.
3. L'Orchestrateur prend alors les commandes, active les agents selon la matrice de décision et coordonne l'avancement jusqu'à la livraison complète et vérifiée.

---

## 3. Checklist de Validation d'un Projet Bien Configuré

- [ ] Le fichier `.antigravity/project-context.md` est dûment rempli et à jour.
- [ ] Le schéma de base de données PostgreSQL et les conventions de migration sont explicités.
- [ ] La suite de tests existante peut être lancée par une commande CLI unique (ex: `dotnet test` et `npm test`).
- [ ] Les variables d'environnement sont décrites dans un `.env.example` sans aucun secret hardcodé.
- [ ] L'Orchestrateur sait où lire les règles et conventions avant de déléguer au Codeur.