# 🗺️ Cartographie de l'existant et des manques (Lot 4 - Soins & Médical)

Suite à l'audit du frontend (`AppContext.tsx`, `NursingModule.tsx`), du backend (`Entities.cs`, Controllers) et de la base de données (`init-database.sql`), voici l'état des lieux exact.

## 1. Ce qui existe déjà en DB et Backend (Mais nécessitait un correctif frontend)
- **Dossiers Médicaux (`MedicalRecords`)** :
  - **Statut** : ✅ **Désormais 100% fonctionnel de bout en bout.**
  - L'entité, la table PostgreSQL et le contrôleur existaient. Cependant, `AppContext.tsx` écrasait les données ou ne gérait pas correctement le flux.
  - *Action réalisée* : J'ai nettoyé `AppContext.tsx` en profondeur. L'application React utilise maintenant exclusivement `apiService.medicalRecords` comme source de vérité. J'ai également injecté des données de test via `db_init` pour prouver le fonctionnement E2E.
- **Prescriptions (`Prescriptions`)** :
  - **Statut** : ⚠️ **Partiellement fonctionnel**.
  - La table et l'entité existent (liées à `MedicalRecords`). Le frontend l'affiche, mais la création directe de prescriptions complexes (avec lien vers les médicaments réels) mérite d'être consolidée.

## 2. Ce qui est simulé côté Frontend (et qui manque complètement en Backend/DB)
Dans le cadre des **Soins (Nursing)** et autres modules cliniques, les éléments suivants n'ont **aucune existence en base de données ni de contrôleur ASP.NET**. Dans le front (`AppContext.tsx`), ils sont simplement initialisés à vide (`[]`) ou utilisaient des données `mockData.ts` :

### A. Module Soins (NursingModule)
- `VitalRecords` (Constantes vitales) : Tension, fréquence cardiaque, température, SpO2...
- `CarePlans` (Plans de soins) : Protocoles, suivi infirmier.
- `NursingNotes` (Transmissions ciblées) : Observations, incidents, transmissions.
*Note : Ces interfaces sont actuellement définies "en dur" dans `src/components/nursing/NursingModule.tsx` et n'ont pas d'entité équivalente dans `Entities.cs`.*

### B. Module Laboratoire & Urgences
- `LabOrders` & `LabTests` : Examens de biologie médicale.
- `EmergencyVisits` : Passages aux urgences.

### C. Module Génomique & Biobanque (Hors scope prioritaire ?)
- `GenomicProfiles`, `PGxInteractions`, `BioSamples`, `BiobankFreezers`, `ClinicalTrials`.

---

## 🏗️ Proposition d'architecture pour le Lot 4 (Soins)

Conformément à la règle *"ne crée pas artificiellement de fausse fonctionnalité"*, voici le plan d'action strict proposé pour migrer le cœur métier des **Soins** :

1. **Backend - Création des Entités (`SoftCare.Domain/Entities/Entities.cs`)** :
   - Ajouter `VitalRecord` (lié à un `Patient`).
   - Ajouter `CarePlan` (lié à un `Patient`).
   - Ajouter `NursingNote` (lié à un `Patient` et un `User` infirmier).

2. **Base de données - PostgreSQL (`init-database.sql`)** :
   - Créer les tables `VitalRecords`, `CarePlans`, `NursingNotes` avec contraintes de clés étrangères, RLS (Row Level Security) et Index.

3. **Backend - Contrôleurs et DTOs (`SoftCare.API/Controllers/NursingController.cs` ou dédiés)** :
   - Endpoints REST standard : GET, POST, PUT, DELETE pour les 3 entités.

4. **Frontend - Connexion API (`apiService.ts` et `AppContext.tsx`)** :
   - Ajouter `apiService.vitals`, `apiService.carePlans`, `apiService.nursingNotes`.
   - Brancher `NursingModule.tsx` sur ces requêtes réelles.
