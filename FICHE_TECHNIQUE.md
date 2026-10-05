# 🏥 SOFTCARE - FICHE TECHNIQUE & GUIDE ARCHITECTURAL DÉTAILLÉ
> **Système d'Information Hospitalier (HIS) & Plateforme de Biotechnologies / Médecine Personnalisée**  
> *Technologies : Frontend React 18 / TypeScript / Tailwind CSS — Backend ASP.NET Core 9 (.NET 9) / Entity Framework Core / PostgreSQL / SignalR / Docker*

---

## 📑 Sommaire
1. [Vue d'ensemble & Philosophie Architecturale](#1-vue-densemble--philosophie-architecturale)
2. [Architecture Backend .NET 9 (Clean Architecture)](#2-architecture-backend-net-9-clean-architecture)
3. [Base de Données PostgreSQL & Modélisation EF Core](#3-base-de-données-postgresql--modélisation-ef-core)
4. [Notifications Temps Réel (SignalR & WebSockets)](#4-notifications-temps-réel-signalr--websockets)
5. [Moteur Code-barres (Code 128) & QR Codes Vectoriels](#5-moteur-code-barres-code-128--qr-codes-vectoriels)
6. [Pôle Biotechnologies & Pharmacogénomique (PGx)](#6-pôle-biotechnologies--pharmacogénomique-pgx)
7. [Module IA Médicale & CDS Hooks (Aide au Diagnostic)](#7-module-ia-médicale--cds-hooks-aide-au-diagnostic)
8. [Architecture Frontend & Couche Réseau API](#8-architecture-frontend--couche-réseau-api)
9. [Sécurité, Conformité & Tests Automatisés](#9-sécurité-conformité--tests-automatisés)
10. [Déploiement Docker & Guide de Démarrage](#10-déploiement-docker--guide-de-démarrage)

---

## 1. Vue d'ensemble & Philosophie Architecturale

**SoftCare** est une solution complète conçue pour répondre aux exigences modernes des centres hospitaliers universitaires et des cliniques spécialisées. Elle allie la gestion hospitalière classique (Dossier Patient Informatisé, Gestion des Lits, Facturation, Urgences, Bloc Opératoire) à la **médecine de précision du futur** (Pharmacogénomique, Biobanque cryogénique, Essais cliniques, Assistant IA).

```
 ┌────────────────────────────────────────────────────────────┐
 │                  FRONTEND (React 18 + TS)                  │
 │   Dashboard • Pharmacie POS • LIMS Biobanque • IA CDS      │
 └─────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST / SignalR WebSockets
                               ▼
 ┌────────────────────────────────────────────────────────────┐
 │                 API REST (ASP.NET Core 9)                  │
 │   Contrôleurs • Swagger • Middleware Auth JWT • SignalR    │
 ├────────────────────────────────────────────────────────────┤
 │                APPLICATION (Couche Métier)                 │
 │   Interfaces • DTOs • Règles de Validation • Services      │
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

Le backend a été conçu selon les principes de la **Clean Architecture** (Architecture en Oignon) :
- **`SoftCare.Domain`** : Entités métiers pures (`Patient`, `Medication`, `GenomicProfile`, `BioSample`, `ClinicalTrial`, `MedicalRecord`, `Prescription`).
- **`SoftCare.Application`** : Inversion de dépendance (`IApplicationDbContext`), DTOs et contrats.
- **`SoftCare.Infrastructure`** : Contexte Entity Framework Core avec support PostgreSQL (`Npgsql`), sécurité JWT et `DatabaseSeeder`.
- **`SoftCare.API`** : API REST ASP.NET Core 9, Hub SignalR (`HospitalHub`), Swagger OpenAPI v1 et contrôleur d'intelligence clinique (`AiAssistantController`).

---

## 3. Base de Données PostgreSQL & Modélisation EF Core

Le script d'initialisation complet est disponible dans [`backend/init-database.sql`](file:///c:/Users/DELL/ALL_PROJECTS/Future-Projects/project-softcare/backend/init-database.sql).

### Indexation et Optimisations Hospitalières :
- **`Medication.Barcode` & `BatchNumber`** : Index unique / B-Tree pour un scan douchette à latence quasi-nulle (< 5ms).
- **`Patient.SocialSecurityNumber`** : Recherche instantanée du dossier par N° de sécurité sociale.
- **`BioSample.SampleCode`** : Index unique pour la traçabilité des cryotubes en biobanque.

---

## 4. Notifications Temps Réel (SignalR & WebSockets)

Le hub **`HospitalHub`** (`/hubs/hospital`) diffuse instantanément les événements critiques aux équipes :
1. **`EmergencyAlert`** : Nouvelle admission prioritaire au service des urgences (Triage niveau 1 ou 2).
2. **`StockAlert`** : Médicament franchissant le seuil critique de réapprovisionnement.
3. **`BiobankAlert`** : Dérive de température détectée sur un congélateur cryogénique (-80°C ou -196°C).
4. **`PGxAlert`** : Détection d'un risque d'interaction gène-médicament en direct lors d'une prescription.

---

## 5. Moteur Code-barres (Code 128) & QR Codes Vectoriels

Moteur autonome vectoriel pur développé dans `src/utils/barcodeUtils.ts` :
- **Code 128 (GS1 / CIP)** : Calcul de Checksum Modulo 103 et génération SVG pour étiqueteuses thermiques.
- **QR Code 2D** : Traçabilité complète du flacon ou cryotube (`SOFTCARE|MED:...|LOT:...|EXP:...`).
- **Composants dédiés** : `BarcodeGenerator.tsx` (impression par lot) et `BarcodeScannerModal.tsx` (visée laser).

---

## 6. Pôle Biotechnologies & Pharmacogénomique (PGx)

- **`CYP2C19`** : Alerte bloquante sur le *Clopidogrel (Plavix)* chez les métaboliseurs lents (*2/*2) avec suggestion de remplacement par le *Prasugrel*.
- **`CYP2D6`** : Sécurisation des antalgiques codéinés.
- **`DPYD`** : Prévention de la toxicité létale au 5-FU en chimiothérapie.
- **Biobanque & LIMS** : Cartographie des cuves cryogéniques et grille 2D de cryotubes.

---

## 7. Module IA Médicale & CDS Hooks (Aide au Diagnostic)

Accessible via le bouton **Assistant IA (CDS)** du header :
- Analyse instantanée des symptômes combinés et des facteurs de risque.
- Génération d'hypothèses diagnostiques différentielles avec **indices de confiance probabilistes**.
- Liste des examens complémentaires recommandés (ECG, Troponine, Scanner, Gazométrie...).
- Vérification croisée de sécurité avec le profil pharmacogénétique du patient.

---

## 8. Architecture Frontend & Couche Réseau API

- **`apiClient.ts`** : Client HTTP encapsulé gérant l'injection automatique du Bearer token JWT.
- **`apiService.ts`** : Façade fournissant des fonctions typées pour toutes les ressources du système.
- **`signalrService.ts`** : Gestionnaire d'abonnements aux alertes en temps réel.
- **Code Splitting & Performance** : Configuration Rollup optimisée dans `vite.config.ts` divisant le bundle en chunks `vendor`, `icons`, et `index`.

---

## 9. Sécurité, Conformité & Tests Automatisés

### Suite de Tests Unitaires xUnit (.NET 9) :
Située dans `backend/tests/SoftCare.UnitTests` :
```bash
dotnet test backend/SoftCare.Backend.sln
# Résultat validé : 31/31 tests réussis (durée : 95 ms, 100% vert)
```
- Validation des règles de blocage pharmacogénétique *CYP2C19* / *Clopidogrel*.
- Validation de l'intégrité de la chaîne du froid biobanque (seuils 2-8°C, -80°C).
- Validation des calculs de facturation et taxes.
- Détection des seuils de réapprovisionnement de stock.
- Validation des contrôles d'accès RBAC et de la traçabilité infalsifiable HMAC-SHA256.

### Banc d'Essai Physique d'Intégration & Performance (E2E) :
- **Tests d'Intégration & RBAC** : 44/44 tests validés en continu.
- **Persistance PostgreSQL physique** : Écriture et relecture confirmées après vidage des pools Npgsql.
- **Latence API REST (/api/patients)** : 7,94 ms (Moyenne sur 20 requêtes, Min: 3,46 ms, Max: 23,66 ms).
- **Latence Requête PostgreSQL directe** : 0,76 ms (Moyenne sur 20 requêtes, Min: 0,47 ms, Max: 1,98 ms).
- **SignalR WebSocket Handshake** : 1,97 ms (Moyenne sur 10 runs, Min: 0,51 ms, Max: 5,29 ms).

---

## 10. Déploiement Docker & Guide de Démarrage

### 🐳 Lancement Tout-en-Un via Docker Compose
Une seule commande démarre PostgreSQL 16, pgAdmin 4, l'API .NET 9 et le Frontend React :
```bash
docker compose up --build -d
```
- **Application Web** : `http://localhost:3000` (ou `http://localhost:5173` en dev)
- **API REST & Swagger** : `http://localhost:5000/swagger`
- **Administration PostgreSQL (pgAdmin)** : `http://localhost:5050` *(Login: `admin@softcare.fr` / `adminpassword`)*

### 🔑 Comptes de Démonstration (Mot de passe : `demo123`)
- **Administrateur** : `admin@hopital.fr`
- **Médecin** : `marie.dubois@hopital.fr`
- **Pharmacien** : `pierre.leroy@hopital.fr`
- **Biologiste / Généticien** : `claire.fontaine@hopital.fr`
- **Chirurgien** : `thomas.leroy@hopital.fr`
- **Infirmier(e)** : `sophie.martin@hopital.fr`
