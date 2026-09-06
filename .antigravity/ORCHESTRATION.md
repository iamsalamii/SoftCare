# Mode d'Emploi : Comment l'Orchestrateur Travaille sur SoftCare

Ce guide explique concrètement comment l'orchestrateur prend les commandes sur le projet existant **SoftCare**.

---

## 1. Comment l'Orchestrateur Exploite l'Existant

Vous avez déjà réalisé une grande partie de l'application sans l'orchestrateur. Voici comment le système s'articule avec ce travail :

1. **Prise de Connaissance Immédiate** :
   - L'Orchestrateur lit `.antigravity/project-context.md`, `ARCHITECTURE.md` et `FICHE_TECHNIQUE.md`.
   - Il sait exactement où se trouvent vos contrôleurs C#, vos entités, vos composants React et vos scripts SQL.

2. **Intervention Chirurgicale & Respectueuse** :
   - L'Orchestrateur **ne détruit rien** et **ne réécrit rien** qui fonctionne déjà.
   - Si vous demandez d'ajouter une fonctionnalité (ex: un module d'imagerie médicale ou un champ d'allergie) :
     - Le **DBA** ajoute la colonne ou la table dans PostgreSQL en respectant `init-database.sql`.
     - L'**Architecte** valide l'intégration dans `SoftCare.Domain` et `SoftCare.Application`.
     - Le **Spécialiste Backend** ajoute la méthode dans le contrôleur approprié ou en crée un nouveau dérivant de `BaseApiController`.
     - Le **Spécialiste Frontend** ajoute le composant dans `src/components/` en utilisant les types de `src/types/index.ts` et `apiService.ts`.
     - Le **Codeur** écrit le code en respectant les conventions exactes du projet.
     - Le **Testeur** lance `dotnet test` pour prouver qu'aucun des 9 tests existants n'a été cassé, et ajoute le nouveau test.
     - Le **Réviseur** valide le diff.

---

## 2. Exemples Concrets de Commandes que vous pouvez Donner

### Exemple A : Ajouter une Nouvelle Fonctionnalité
> *"Orchestrateur, ajoute un champ 'Groupe Sanguin' avec validation et alerte visuelle dans la fiche patient et dans l'API."*
- L'Orchestrateur mobilise : DBA -> Spécialiste Backend -> Spécialiste Frontend -> Codeur -> Testeur -> Réviseur.
- Résultat : Altération PostgreSQL, entité `Patient.cs` mise à jour, DTO C# mis à jour, formulaire React mis à jour, tests xUnit validés.

### Exemple B : Corriger une Anomalie
> *"Orchestrateur, quand je scanne un médicament en pharmacie POS, le stock n'est pas décrémenté en temps réel."*
- L'Orchestrateur mobilise : Débogueur -> Spécialiste Backend (SignalR / MedsController) -> Codeur -> Testeur -> Réviseur.
- Résultat : Reproduction isolée, correction chirurgicale de l'événement SignalR, test de non-régression.

### Exemple C : Optimiser une Requête
> *"Orchestrateur, la recherche des patients par numéro de sécurité sociale ralentit sous forte charge."*
- L'Orchestrateur mobilise : Fullstack & Perf -> DBA -> Codeur -> Testeur.
- Résultat : Diagnostic `EXPLAIN ANALYZE`, ajout d'un index PostgreSQL partiel ou composite, preuve chiffrée du gain.