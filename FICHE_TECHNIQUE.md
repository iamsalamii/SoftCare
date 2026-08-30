# 🏥 SOFTCARE - FICHE TECHNIQUE & GUIDE ARCHITECTURAL DÉTAILLÉ
> **Système d'Information Hospitalier (HIS) & Plateforme de Biotechnologies / Médecine Personnalisée**  
> *Technologies : Frontend React 18 / TypeScript / Tailwind CSS — Backend ASP.NET Core 9 (.NET 9) / Entity Framework Core / PostgreSQL*

---

## 📑 Sommaire
1. [Vue d'ensemble & Philosophie Architecturale](#1-vue-densemble--philosophie-architecturale)
2. [Architecture Backend .NET 9 (Clean Architecture)](#2-architecture-backend-net-9-clean-architecture)
3. [Base de Données PostgreSQL & Modélisation EF Core](#3-base-de-données-postgresql--modélisation-ef-core)
4. [Moteur Code-barres (Code 128) & QR Codes Vectoriels](#4-moteur-code-barres-code-128--qr-codes-vectoriels)
5. [Pôle Biotechnologies & Pharmacogénomique (PGx)](#5-pôle-biotechnologies--pharmacogénomique-pgx)
6. [Architecture Frontend & Couche Réseau API](#6-architecture-frontend--couche-réseau-api)
7. [Sécurité & Conformité Médicale](#7-sécurité--conformité-médicale)
8. [Guide de Démarrage & Déploiement Rapide](#8-guide-de-démarrage--déploiement-rapide)

---

## 1. Vue d'ensemble & Philosophie Architecturale

**SoftCare** est une solution complète conçue pour répondre aux exigences modernes des centres hospitaliers universitaires et des cliniques spécialisées. Elle allie la gestion hospitalière classique (Dossier Patient Informatisé, Gestion des Lits, Facturation, Urgences, Bloc Opératoire) à la **médecine de précision du futur** (Pharmacogénomique, Biobanque cryogénique, Essais cliniques).

```
 ┌────────────────────────────────────────────────────────────┐
 │                  FRONTEND (React 18 + TS)                  │
 │   Dashboard • Pharmacie POS • LIMS Biobanque • Dossiers   │
 └─────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST / JSON
                               ▼
 ┌────────────────────────────────────────────────────────────┐
 │                 API REST (ASP.NET Core 9)                  │
 │   Contrôleurs • Swagger • Middleware Auth JWT • CORS       │
 ├────────────────────────────────────────────────────────────┤
 │                APPLICATION (Couche Métier)                 │
 │   Interfaces • DTOs • Règles de Validation • Services     │
 ├────────────────────────────────────────────────────────────┤
 │              INFRASTRUCTURE (EF Core + Npgsql)             │
 │   PostgreSQL • Migrations • Seeders • Hachage BCrypt       │
 ├────────────────────────────────────────────────────────────┤
 │                   DOMAIN (Noyau Métier)                    │
 │   Entités Pures • Énumérations • Objets Valeurs            │
 └────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Backend .NET 9 (Clean Architecture)

Le backend a été conçu selon les principes de la **Clean Architecture** (Architecture en Oignon / Ports & Adapters) afin de garantir :
- **L'indépendance des frameworks** : Le cœur de métier ne dépend d'aucune bibliothèque externe.
- **La testabilité unitaire** : Chaque couche peut être isolée et testée avec des mocks.
- **La maintenabilité à long terme** : Remplacer la base de données ou l'authentification ne modifie pas les règles métier.

### Découpage des 4 Projets de la Solution :

1. **`SoftCare.Domain`** (`backend/src/SoftCare.Domain`) :
   - **Rôle** : Définition des entités pures du domaine hospitalier et génomique.
   - **Exemples** : `Patient`, `Medication`, `GenomicProfile`, `BioSample`, `ClinicalTrial`, `MedicalRecord`, `Prescription`.
   - **Règle d'or** : Ne contient aucune référence à une base de données ou un framework Web.

2. **`SoftCare.Application`** (`backend/src/SoftCare.Application`) :
   - **Rôle** : Orchestration des flux applicatifs et inversion de dépendances.
   - **Composants** : Interfaces de persistance (`IApplicationDbContext`), DTOs (Data Transfer Objects), contrats de services.
   - **Avantage** : Assure que l'API ne manipule jamais directement les entités brutes du modèle de données.

3. **`SoftCare.Infrastructure`** (`backend/src/SoftCare.Infrastructure`) :
   - **Rôle** : Implémentation technique des interfaces définies par l'Application.
   - **Composants** :
     - `ApplicationDbContext` : Contexte Entity Framework Core avec configuration PostgreSQL (`Npgsql`).
     - `JwtTokenGenerator` : Génération et signature de jetons HMAC-SHA256.
     - `DatabaseSeeder` : Injection automatique du jeu de données médicales au démarrage.
     - Gestion du fallback In-Memory automatique pour le développement sans friction.

4. **`SoftCare.API`** (`backend/src/SoftCare.API`) :
   - **Rôle** : Point d'entrée HTTP (API REST).
   - **Composants** :
     - `Program.cs` : Configuration du pipeline middleware, injection de dépendances, CORS, documentation Swagger interactive.
     - Contrôleurs spécialisés : `AuthController`, `PatientsController`, `MedicationsController`, `BiotechController`, `MedicalRecordsController`, `AppointmentsController`, `InvoicesController`, `BedsController`, etc.

---

## 3. Base de Données PostgreSQL & Modélisation EF Core

### Indexation et Optimisations Hospitalières :
Dans un hôpital traitant des millions de transactions, certaines colonnes nécessitent une indexation stratégique :
- **`Medication.Barcode` & `BatchNumber`** : Index unique ou non-clustered pour un scan douchette à latence quasi-nulle (< 5ms).
- **`Patient.SocialSecurityNumber`** : Recherche instantanée du dossier par N° de sécurité sociale.
- **`BioSample.SampleCode`** : Index unique pour la traçabilité des cryotubes en biobanque.
- **`User.Email`** : Index unique pour l'authentification.

### Configuration du ConnectionString :
Dans `backend/src/SoftCare.API/appsettings.json` :
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=softcare_db;Username=postgres;Password=postgres"
}
```

---

## 4. Moteur Code-barres (Code 128) & QR Codes Vectoriels

Pour répondre au besoin de traçabilité pharmaceutique sans dépendre de polices d'écritures tierces ou de services tiers en ligne, un **moteur vectoriel autonome SVG pur** a été développé dans `src/utils/barcodeUtils.ts`.

### 1. Encodage Code 128 (GS1 / CIP) :
Le Code 128 est le standard de l'industrie pharmaceutique mondiale :
- **Principe mathématique** : Chaque caractère est encodé par 11 modules composés de 3 barres et 3 espaces (largeurs de 1 à 4 unités).
- **Calcul de Checksum Modulo 103** :
  $$\text{Checksum} = \left( \text{StartCode} + \sum_{i=1}^{n} (\text{Valeur}_i \times i) \right) \pmod{103}$$
- **Rendu SVG** : Généré directement en éléments `<rect>` vectoriels légers, imprimables en ultra-haute résolution thermique ou laser.

### 2. QR Code 2D pour la Traçabilité de Dispensation :
Les QR codes intègrent une chaîne standardisée exploitable par les douchettes et smartphones :
`SOFTCARE|MED:NomProduit|LOT:NumeroLot|EXP:DatePeremption|CIP:CodeBarre`

---

## 5. Pôle Biotechnologies & Pharmacogénomique (PGx)

Le module **Biotech & Médecine de Précision** apporte une valeur unique au logiciel :

### 🧬 A. Pharmacogénomique (PGx)
Permet d'adapter le choix et la dose d'un traitement en fonction du génotype du patient :
- **`CYP2C19`** : Les métaboliseurs lents (*2/*2) sont incapables de transformer le *Clopidogrel (Plavix)* en sa forme active $\rightarrow$ Risque majeur de thrombose $\rightarrow$ Le système alerte immédiatement le médecin ou le pharmacien au moment de la délivrance et suggère le *Prasugrel*.
- **`CYP2D6`** : Régule la transformation de la codéine en morphine. Un métaboliseur ultra-rapide risque une dépression respiratoire mortelle.
- **`DPYD`** : Métabolisation du 5-Fluorouracile (5-FU) en oncologie. Les déficients risquent une toxicité létale.

### ❄️ B. Biobanque & LIMS Cryogénique (-80°C / -196°C)
- Gestion visuelle des congélateurs ultra-basse température (-80°C) et cuves cryogéniques à l'azote liquide (-196°C).
- Visualisation interactive de la grille de puits (Format 8x8 et 9x9) pour localiser précisément chaque cryotube (ADN, ARN, Sérum, Tissus biopsiés).
- Impression d'étiquettes cryorésistantes avec QR Code 2D.

### 🧪 C. Essais Cliniques Translationnels
- Gestion des cohortes de patients sous protocole expérimental (Phases I à IV).
- Suivi du consentement éthique éclairé et des critères d'inclusion/exclusion.

---

## 6. Architecture Frontend & Couche Réseau API

### 1. Structure Modulaire :
- `src/components/biotech/` : Tableau de bord Pharmacogénomique, cartographie LIMS Biobanque, Essais cliniques.
- `src/components/pharmacy/` : Gestion des stocks, étiquetage codes-barres, POS avec scanner et détection des conflits génétiques en direct.
- `src/components/common/` : Modals autonomes de scan (`BarcodeScannerModal.tsx`) et d'impression d'étiquettes (`BarcodeGenerator.tsx`).

### 2. Client API Résilient (`src/services/`) :
- **`apiClient.ts`** : Client HTTP encapsulé gérant l'injection automatique de l'en-tête `Authorization: Bearer <token>`, la sérialisation JSON et les codes d'erreur HTTP.
- **`apiService.ts`** : Façade fournissant des fonctions typées pour toutes les ressources du système.
- **Résilience Hybride** : L'application fonctionne de manière transparente avec la base de données backend connectée, tout en disposant d'un mode démonstration autonome.

---

## 7. Sécurité & Conformité Médicale

1. **Authentification JWT (JSON Web Token)** :
   - Signature robuste HMAC-SHA256.
   - Transmission des rôles (`admin`, `doctor`, `pharmacist`, `nurse`, `lab_tech`, `surgeon`) et contrôle d'accès basé sur les rôles (RBAC).
2. **Protection des Mots de Passe** :
   - Algorithme de hachage **BCrypt** avec sel cryptographique automatique.
3. **Traçabilité & Piste d'Audit** :
   - Enregistrement systématique de la date de création (`CreatedAt`), de modification (`UpdatedAt`), de l'auteur et de l'état d'activité (`IsActive` pour Soft Deletes).

---

## 8. Guide de Démarrage & Déploiement Rapide

### 🚀 A. Lancer le Backend .NET 9
```bash
# 1. Se positionner dans le projet API
cd backend/src/SoftCare.API

# 2. Lancer l'API
dotnet run
```
- L'API démarre sur `http://localhost:5000` (ou le port configuré).
- La documentation interactive Swagger est accessible sur : `http://localhost:5000/swagger`.

### 💻 B. Lancer le Frontend React
```bash
# 1. À la racine du projet
npm run dev
```
- L'application s'ouvre sur `http://localhost:5173`.

### 🔑 C. Comptes de Démonstration Pré-configurés
Tous les comptes partagent le mot de passe : **`demo123`**

| Rôle | Email | Spécialité / Fonction |
| :--- | :--- | :--- |
| **Administrateur** | `admin@hopital.fr` | Gestion complète & Configuration |
| **Médecin** | `marie.dubois@hopital.fr` | Cardiologie & Consultations |
| **Pharmacien** | `pierre.leroy@hopital.fr` | Pharmacie Hospitalière & POS |
| **Biologiste / Labo** | `claire.fontaine@hopital.fr` | Génétique Moléculaire & Biobanque |
| **Chirurgien** | `thomas.leroy@hopital.fr` | Bloc Opératoire |
| **Infirmier(e)** | `sophie.martin@hopital.fr` | Soins & Triage Urgences |
