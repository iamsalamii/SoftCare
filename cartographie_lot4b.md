# Audit des modules médicaux — Lot 4B

Suite à l'inspection du projet (Frontend, `apiService.ts`, `AppContext.tsx`, Backend `Controllers`, et EF Core `Entities.cs`), voici la cartographie des fonctionnalités médicales restantes.

## 1. Urgences (Emergency)
**Classification : B — API existante mais frontend non connecté**
- **Frontend** : `EmergencyModule.tsx` affiche les données depuis `AppContext.tsx`. Les fonctions (`addEmergencyVisit`, `updateEmergencyVisit`) utilisent `genId()` et modifient l'état local (`setEmergencyVisits(prev => [newVisit, ...prev])`) sans appel réseau.
- **Backend / DB** : L'entité `EmergencyVisit` existe dans `Entities.cs` et `ApplicationDbContext`. `EmergencyController.cs` expose les endpoints REST nécessaires (`GET`, `POST`, `PUT`, `DELETE`). L'API `apiService.ts` ne contient **pas** encore les routes d'Urgences.

## 2. Laboratoire (Lab)
**Classification : B — API existante mais frontend non connecté**
- **Frontend** : `LabManagement.tsx` utilise l'état local dans `AppContext.tsx` (avec `genId()`).
- **Backend / DB** : Les entités `LabTest` et `LabOrder` sont présentes dans `Entities.cs` et `ApplicationDbContext`. Le `LabController.cs` est implémenté. L'API `apiService.ts` ne contient **pas** les routes de Laboratoire.

## 3. Biotech & Génomique
**Classification : B — API existante mais frontend non connecté**
- **Frontend** : `BiotechModule.tsx`. Les fonctions `addGenomicProfile`, `addBioSample`, `addClinicalTrial` utilisent `genId()` dans `AppContext.tsx`.
- **Backend / DB** : Entités `GenomicProfile`, `BioSample`, `ClinicalTrial` existantes. `BiotechController.cs` est complet. Curieusement, `apiService.ts` **contient déjà** les endpoints `/biotech/genomics`, etc., mais le `AppContext.tsx` ne les appelle pas et préfère simuler !

## 4. Bloc Opératoire (Surgery)
**Classification : B / C — Partiellement implémenté et frontend non connecté**
- **Frontend** : `SurgeryModule.tsx`. `AppContext.tsx` utilise `genId()` pour `addSurgery` et `addOperatingRoom`.
- **Backend / DB** : `Surgery` existe dans la DB et a un `SurgeryController.cs`. Cependant, `OperatingRoom` **n'existe pas** en tant qu'entité (elle n'est simulée qu'en Frontend).
- **Stratégie** : Raccorder `Surgery` à l'API. Garder `OperatingRoom` inexistant côté base (afficher "Non persistant" ou supprimer sa simulation, selon la règle du périmètre réel).

## 5. Facturation (Billing / Invoices) - *Note hors périmètre clinique*
**Classification : B — API existante mais frontend non connecté**
- **Frontend** : `BillingModule.tsx`. Utilise `addInvoice` avec `genId()` dans `AppContext.tsx`.
- **Backend / DB** : `Invoice` existe dans `ApplicationDbContext`, et `InvoicesController.cs` est là. `apiService.ts` a les endpoints.

## 6. Modules déjà connectés (A)
- Dossiers Médicaux (`MedicalRecords`)
- Admissions (`Admissions`)
- Rendez-vous (`Appointments`)
- Lits (`Beds`)
- Pharmacie (`Medications`, `PharmacySales`)
- Soins (`VitalRecords`, `CarePlans`, `NursingNotes` - Lot 4A)

---

## 📋 PLAN DE TRAITEMENT (TRAITEMENT DU LOT 4B)

Conformément à la directive *"ne transforme pas automatiquement tout ce que tu trouves en nouveau développement"* et *"EF Core = source de vérité"*, voici l'ordre d'action strict :

1. **Urgences** :
   - Ajouter `emergencies` dans `apiService.ts`.
   - Brancher `AppContext.tsx` sur `apiService.emergencies` (remplacer `genId()` par les appels asynchrones avec bloc `try/catch`).
   - S'assurer que le rechargement via `refreshData` fait l'appel API `GET`.
   - Tester le flux E2E réel.
2. **Laboratoire** :
   - Ajouter `lab` dans `apiService.ts`.
   - Connecter `AppContext.tsx` (remplacer les faux comportements).
   - Tester le flux E2E réel.
3. **Biotech & Surgery** :
   - Assainir de la même façon (connecter le frontend à `apiService` et nettoyer les mocks).
4. **Audit Final et Purge** :
   - Supprimer toutes les références à `localStorage.setItem` restantes.
   - Purger le fichier `mockData.ts`.
   - Supprimer définitivement la méthode utilitaire `genId()` devenue inutile.
