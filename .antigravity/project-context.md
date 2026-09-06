# Contexte Technique et Métier - SoftCare (.antigravity/project-context.md)

Ce document fournit la cartographie complète de l'existant de **SoftCare** pour permettre à l'Orchestrateur et à tous les agents de s'aligner immédiatement sans repartir de zéro.

---

## 1. Informations Générales
- **Nom du Projet** : SoftCare
- **Nature du Système** : Système d'Information Hospitalier (HIS) & Plateforme de Biotechnologies / Médecine Personnalisée (PGx, Biobanque cryogénique, Essais cliniques, Assistant IA).
- **Public Cible** : Équipes médicales hospitalières (Médecins, Chirurgiens, Pharmaciens, Infirmiers, Biologistes, Administrateurs).

---

## 2. Stack Technologique Réelle

### Backend
- **Framework & Runtime** : ASP.NET Core 9 (.NET 9 / C# 12)
- **Architecture** : Clean Architecture (Oignon)
  - `SoftCare.Domain` : Entités pures (`Patient`, `Medication`, `GenomicProfile`, `BioSample`, `ClinicalTrial`, `MedicalRecord`, `Prescription`, etc.)
  - `SoftCare.Application` : Interfaces (`IApplicationDbContext`), DTOs et services métiers
  - `SoftCare.Infrastructure` : Entity Framework Core 9 (`Npgsql`), `ApplicationDbContext`, `DatabaseSeeder`, hachage BCrypt
  - `SoftCare.API` : Contrôleurs REST, Swagger OpenAPI, Hub SignalR (`HospitalHub`), Assistant IA CDS
- **Base de Données** : PostgreSQL 16 (avec script d'initialisation complet `backend/init-database.sql`)
- **Temps Réel** : SignalR sur `/hubs/hospital` (Alertes urgences, stocks, biobanque, PGx)
- **Authentification** : JWT Bearer Token + BCrypt pour les mots de passe

### Frontend
- **Framework** : React 18.3.1
- **Langage** : TypeScript 5.5 (mode strict)
- **Styling** : Tailwind CSS 3.4
- **Composants & Graphiques** : Lucide React, Recharts
- **Build & Dev Tooling** : Vite 5.4 avec Rollup chunking optimisé (`vendor`, `icons`, `index`)
- **Gestion d'État & API** : `AppContext.tsx`, `apiClient.ts` (Bearer JWT automatique), `apiService.ts`, `signalrService.ts`
- **Moteur Vectoriel Autonome** : `barcodeUtils.ts` (Code 128 GS1/CIP avec Checksum Modulo 103, QR Codes 2D)

### Tests & DevOps
- **Tests Unitaires** : `backend/tests/SoftCare.UnitTests` (xUnit, 9/9 tests réussis couvrant la pharmacogénomique, biobanque, facturation et sécurité)
- **Conteneurisation** : `docker-compose.yml` (orchestrant frontend, backend, postgres 16, pgadmin 4)

---

## 3. Modules Métiers Existants (Frontend & Backend)
1. **Dossier Patient Informatisé (DPI)** : `PatientsController.cs` & `src/components/patients/`
2. **Pharmacie & Gestion des Stocks POS** : `MedicationsController.cs` & `src/components/pharmacy/` (Scan douchette < 5ms)
3. **Pôle Biotechnologies & LIMS** : `BiotechController.cs` & `src/components/biotech/` (Pharmacogénomique CYP2C19/CYP2D6/DPYD, Biobanque -80°C/-196°C, Essais cliniques)
4. **Urgences & Triage** : `EmergencyController.cs` & `src/components/emergency/`
5. **Bloc Opératoire & Chirurgie** : `SurgeryController.cs` & `src/components/surgery/`
6. **Soins Infirmiers** : `src/components/nursing/NursingModule.tsx`
7. **Téléconsultation** : `src/components/teleconsultation/TeleconsultationModule.tsx`
8. **Facturation & Règlements** : `InvoicesController.cs` & `src/components/billing/`
9. **Laboratoire d'Analyses** : `LabController.cs` & `src/components/laboratory/`
10. **Gestion des Lits & Hospitalisation** : `BedsController.cs` & `src/components/beds/`
11. **Rendez-vous & Agenda Médical** : `AppointmentsController.cs` & `src/components/appointments/`
12. **Assistant IA CDS (Aide au Diagnostic)** : `AiAssistantController.cs` & `src/components/ai/`
13. **Audit & Traçabilité** : `AuditLogsController.cs` & `AuditSecurityTests.cs`

---

## 4. Données et Comptes de Démonstration
- **Comptes par défaut** (Mot de passe universel : `demo123`) :
  - `admin@hopital.fr` (Administrateur)
  - `marie.dubois@hopital.fr` (Médecin)
  - `pierre.leroy@hopital.fr` (Pharmacien)
  - `claire.fontaine@hopital.fr` (Biologiste / Généticien)
  - `thomas.leroy@hopital.fr` (Chirurgien)
  - `sophie.martin@hopital.fr` (Infirmière)