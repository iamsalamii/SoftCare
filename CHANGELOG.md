# CHANGELOG — SOFTCARE HOSPITAL OS

Toutes les modifications notables apportées au projet **SoftCare** sont consignées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

---

## [2.4.0] — 2026-10-04

### 🚀 Release Candidate & Validation Pré-Production

Cette version marque l'achèvement de la phase de consolidation, de sécurisation et de validation opérationnelle de la plateforme SoftCare.

#### Ajouté (Added)
- **Banc d'Essai E2E & Audit Automatisé** : Suite d'intégration physique (`scratch/db_init`) validant 44 scénarios critiques (RBAC, persistance, audit trail, flux lits, POS pharmacie).
- **Empreinte Cryptographique HMAC-SHA256 sur l'Audit Trail** : Signature infalsifiable de chaque action clinique, administrative ou pharmaceutique conformément aux exigences HDS/RGPD.
- **Protection Brute-Force Rate Limiting** : Limitation active à 5 tentatives de connexion par minute par IP (`LoginPolicy` avec code de rejet HTTP 429).
- **Restauration Multi-Projets Docker Backend** : Ajout de la cible `SoftCare.UnitTests.csproj` dans `backend/Dockerfile` pour garantir un restore hermétique de la solution en environnement conteneurisé.
- **Support Universel NIR / Identitovigilance Internationale** : Flexibilité sur le format du numéro de sécurité sociale et prise en charge du mode « Paiement direct / Sans couverture ».

#### Modifié (Changed)
- **Direction Artistique Institutionnelle & Hero Hospitalier** : Remplacement de l'ambiance sombre par une esthétique clinique claire (`bg-gradient-to-b from-slate-50 via-white to-slate-50/80`), vitrine applicative SoftCare Hospital OS avec 4 satellites interactifs.
- **Écran de Chargement Médical Pleine Page** : Anneau orbital animé avec particule radiante, tracé d'onde ECG SVG vectoriel fluide et compteur dynamique.
- **Suite de Tests xUnit .NET 9** : Portée de 9 à 31 tests unitaires automatisés validant la logique métier, la compatibilité pharmacogénomique (PGx CYP2C19), la cryobanque et le calcul de facturation (100% vert, 95 ms).
- **Contrôle Strict de Régulation des Lits** : Interdiction absolue de double occupation sur un lit déjà au statut `occupied`, et libération automatique au statut `available` lors de la décharge du patient.
- **Sécurisation des Ventes Pharmacie (PUI)** : Blocage systématique au niveau API des paniers vides, des quantités nulles (`0`) et des quantités négatives.

#### Corrigé (Fixed)
- **Dockerfile Backend** : Correction de l'étape de restauration `dotnet restore backend/SoftCare.Backend.sln` qui omettait le fichier projet `SoftCare.UnitTests.csproj`.
- **Régulation des Admissions** : Correction du ciblage de décharge de lit via `PUT /api/admissions/{id}` permettant la libération physique instantanée du lit associé.
- **Persistance Npgsql** : Alignement strict des contraintes `NOT NULL` sur l'ensemble des colonnes d'entités EF Core (`AllergiesJson`).

#### Performances Validées (Benchmarks Réels)
- **API REST (/api/patients)** : 7,94 ms en moyenne (Min: 3,46 ms, Max: 23,66 ms sur 20 requêtes).
- **Requête PostgreSQL directe** : 0,76 ms en moyenne (Min: 0,47 ms, Max: 1,98 ms sur 20 requêtes).
- **SignalR WebSocket Handshake** : 1,97 ms en moyenne (Min: 0,51 ms, Max: 5,29 ms sur 10 runs).
- **Build Production Vite** : Compilé en 14,64 s, taille bundle gzippé: 251,95 kB.
