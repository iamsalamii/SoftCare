# 📋 CAHIER & FICHE DE RECETTE FONCTIONNELLE ET TECHNIQUE
## Projet SoftCare — Système d'Information Hospitalier (HIS) & Biotech OS

> **Objectif** : Valider l'ensemble des parcours utilisateurs, modules métiers, règles cliniques et protocoles de sécurité avant mise en production.
> **Serveurs Locaux Actifs** :
> - **Frontend** : [http://localhost:5173](http://localhost:5173)
> - **Backend API** : [http://localhost:5291](http://localhost:5291) | [Swagger API](http://localhost:5291/swagger)

---

## 📑 Sommaire des Scénarios de Test
1. [Landing Page & Présentation Publique](#1-landing-page--présentation-publique)
2. [Authentification & Contrôle d'Accès](#2-authentification--contrôle-daccès)
3. [Tableau de Bord & Navigation Globale](#3-tableau-de-bord--navigation-globale)
4. [Dossier Patient Informatisé (DPI)](#4-dossier-patient-informatisé-dpi)
5. [Urgences & Triage Hémodynamique](#5-urgences--triage-hémodynamique)
6. [Biotechnologies, Pharmacogénomique (PGx) & Biobanque](#6-biotechnologies-pharmacogénomique-pgx--biobanque)
7. [Pharmacie Hospitalière, Traçabilité Code-Barres & POS](#7-pharmacie-hospitalière-traçabilité-code-barres--pos)
8. [Intelligence Clinique & Aide au Diagnostic (IA)](#8-intelligence-clinique--aide-au-diagnostic-ia)
9. [Bloc Opératoire & Chirurgie](#9-bloc-opératoire--chirurgie)
10. [Gestion des Lits & Admissions](#10-gestion-des-lits--admissions)
11. [Facturation & Tiers-Payant](#11-facturation--tiers-payant)
12. [Administration, Rôles & Piste d'Audit HDS](#12-administration-rôles--piste-daudit-hds)

---

## 1. Landing Page & Présentation Publique

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Chargement initial | Accéder à `http://localhost:5173/` | Écran de progression hospitalier animé puis affichage fluide de la page d'accueil. | [ ] |
| **TC-02** | Lecteur Vidéo Démo Hero | Cliquer sur "Lire la démo" / "Pause" | Progression automatique des 4 chapitres, audio voix off en français (activable/désactivable via l'icône volume), sous-titres synchronisés. | [ ] |
| **TC-03** | Modal Demande de Démo | Cliquer sur "Demander une Démo" (Navbar ou Hero) | Ouverture du modal avec `CustomSelect` (Type d'établissement, Rôle, Créneau). La validation déclenche l'envoi email vers `contact@softcare.io` et affiche l'écran de succès. | [ ] |
| **TC-04** | Brochure Médicale PDF | Cliquer sur "Brochure Médicale" | Ouverture du modal interactif multi-pages avec sommaire, architecture et bouton d'impression/export. | [ ] |
| **TC-05** | Responsive Mobile | Réduire la largeur (< 768px) | Menu hamburger fonctionnel, tiroir déroulant fluide et mise en page adaptée sur 1 colonne. | [ ] |

---

## 2. Authentification & Contrôle d'Accès

> **Identifiants de Test Recommandés** :
> - **Super Admin** : `admin@hopital.com` / `password123`
> - **Médecin Praticien** : `marie.dubois@hopital.fr` / `password123`
> - **Pharmacien** : `pierre.l@hopital.fr` / `password123`
> - **Soignant** : `sophie.martin@hopital.fr` / `password123`

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-06** | Connexion réussie | Saisir `admin@hopital.com` et `password123` | Animation de vérification des accréditations, notification Toast de succès, redirection vers le tableau de bord. | [ ] |
| **TC-07** | Échec & Anti-Brute Force | Saisir un mot de passe erroné 5 fois | Message unifié d'erreur avec décompte des tentatives restantes, puis verrouillage temporaire de 60s avec compte à rebours actif. | [ ] |
| **TC-08** | Mot de passe oublié | Cliquer sur "Oublié ?" sur l'écran login | Modal épuré avec saisie email et confirmation de transmission à la DSI. | [ ] |
| **TC-09** | Demande d'accréditation | Cliquer sur "Demander une accréditation" | Formulaire avec sélection du service hospitalier via `CustomSelect` et validation. | [ ] |
| **TC-10** | Déconnexion & Session Timeout | Cliquer sur "Déconnexion" dans le menu utilisateur | Fermeture sécurisée de la session et retour immédiat à l'écran de connexion. | [ ] |

---

## 3. Tableau de Bord & Navigation Globale

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-11** | Sidebar & Routage | Naviguer entre les différents modules | Transition instantanée sans rechargement complet de page, mise en surbrillance de l'onglet actif. | [ ] |
| **TC-12** | Mode Réduit / Mobile Sidebar | Cliquer sur le bouton replier / tester sur mobile | En desktop : sidebar compacte avec infobulles. En mobile : tiroir off-canvas avec fond assombri (backdrop). | [ ] |
| **TC-13** | Changement de Service | Sélecteur de département dans le Header | Filtrage dynamique des indicateurs selon le service hospitalier sélectionné. | [ ] |
| **TC-14** | Centre de Notifications | Cliquer sur l'icône Cloche dans le Header | Affichage du tiroir des alertes médicales et urgences en temps réel. | [ ] |

---

## 4. Dossier Patient Informatisé (DPI)

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-15** | Recherche & Filtrage Patient | Taper un nom ou numéro NIR dans la barre de recherche | Filtrage instantané de la liste des patients. | [ ] |
| **TC-16** | Création d'un Nouveau Patient | Remplir le formulaire d'admission patient | Validation des champs obligatoires (NIR 13 chiffres, Date de naissance, Contacts d'urgence), enregistrement immédiat. | [ ] |
| **TC-17** | Fiche Patient Détaillée | Cliquer sur un patient de la liste | Affichage complet : constantes vitales, antécédents, allergies, profil génomique et historique des consultations. | [ ] |
| **TC-18** | Prescription Électronique | Créer une ordonnance pour le patient | Sélection des médicaments avec posologie et contrôle automatique des allergies déclarées. | [ ] |

---

## 5. Urgences & Triage Hémodynamique

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-19** | Admission Urgence & Constantes | Saisir FC, TA, SpO2, Température et Score de Glasgow | Calcul automatique du niveau de gravité (Niveau 1 à 5) et affichage du code couleur d'urgence. | [ ] |
| **TC-20** | Orientation Circuit Court / Long | Affecter le patient vers un box d'urgence | Mise à jour en temps réel de la file d'attente des urgences et de l'occupation des boxes. | [ ] |

---

## 6. Biotechnologies, Pharmacogénomique (PGx) & Biobanque

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-21** | Consultation Profil PGx | Consulter un profil génomique (*CYP2C19, DPYD*) | Affichage des allèles (*1/*1, *2/*2), du phénotype métaboliseur (Normal, Intermédiaire, Lent) et des recommandations CPIC. | [ ] |
| **TC-22** | Interception Sécurité PGx (Alerte Rouge) | Simuler prescription de *Clopidogrel* sur profil *CYP2C19 *2/*2* | **Alerte bloquante critique** : notification d'interdiction clinique et proposition d'alternatives (*Prasugrel, Ticagrélor*). | [ ] |
| **TC-23** | Biobanque & Cryotubes (-80°C) | Rechercher un échantillon ou congélateur | Visualisation de la grille du portoir (Rack/Box/Well), température de stockage et statut de disponibilité. | [ ] |
| **TC-24** | Essais Cliniques | Consulter la liste des protocoles de recherche | Affichage des phases (Phase I/II/III), taux de recrutement et critères d'inclusion/exclusion. | [ ] |

---

## 7. Pharmacie Hospitalière, Traçabilité Code-Barres & POS

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-25** | Scan Douchette Code-Barres | Cliquer sur "Scanner Code-Barres" ou saisir un code | Décodage instantané (< 5ms), affichage de la fiche produit, lot et date de péremption. | [ ] |
| **TC-26** | Délivrance & Déduction de Stock | Valider la délivrance d'un médicament | Décrémentation automatique du stock en temps réel et enregistrement du mouvement de traçabilité. | [ ] |
| **TC-27** | Alerte Rupture & Seuil Minimum | Consulter un produit avec stock < seuil min | Badge d'alerte orange/rouge et proposition de réapprovisionnement. | [ ] |
| **TC-28** | Point de Vente / POS Pharmacie | Ajouter des produits au panier de caisse | Calcul automatique du total, ventilation part Sécurité Sociale / part Mutuelle / reste à charge. | [ ] |

---

## 8. Intelligence Clinique & Aide au Diagnostic (IA)

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-29** | Diagnostic Différentiel IA | Saisir un tableau clinique de symptômes | Calcul probabiliste des hypothèses diagnostiques (ex: SCA à 92%, Dissection à 28%) avec code couleur d'urgence. | [ ] |
| **TC-30** | Protocoles d'Examens Recommandés | Consulter la fiche de recommandation IA | Proposition des examens prioritaires (ECG 18 dérivations, Troponine hs, Scanner) conforme aux CDS Hooks. | [ ] |

---

## 9. Bloc Opératoire & Chirurgie

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-31** | Planning des Salles d'Opération | Consulter la grille des blocs opératoires | Visualisation des interventions planifiées, en cours et terminées par salle. | [ ] |
| **TC-32** | Checklist Pré-Opératoire | Vérifier la conformité pré-anesthésie | Validation des critères de sécurité (identité, site opératoire, jeûne, bilan d'hémostase). | [ ] |

---

## 10. Gestion des Lits & Admissions

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-33** | Plan des Chambres & Statut des Lits | Consulter la carte des lits du service | Visualisation des statuts (Occupé, Libre, En cours de nettoyage, Réservé). | [ ] |
| **TC-34** | Affectation & Transfert de Lit | Déplacer un patient vers un nouveau lit libre | Mise à jour instantanée du taux d'occupation et libération de l'ancien lit. | [ ] |

---

## 11. Facturation & Tiers-Payant

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-35** | Génération de Facture | Émettre une facture pour un séjour hospitalier | Ventilation automatique Tiers Payant (CPAM 80% / Complémentaire 20%). | [ ] |
| **TC-36** | Export & Impression Facture | Cliquer sur "Exporter PDF" / "Imprimer" | Génération du document normalisé prêt pour remise au patient ou transmission comptable. | [ ] |

---

## 12. Administration, Rôles & Piste d'Audit HDS

| ID | Test / Action | Données / Manipulation | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-37** | Gestion des Utilisateurs (RBAC) | Créer / modifier un compte soignant | Attribution du rôle (*admin, doctor, nurse, pharmacist*) et du département. | [ ] |
| **TC-38** | Journal d'Audit Immuable (HDS) | Consulter le registre d'audit des actions | Traçabilité exhaustive des accès aux dossiers patients avec horodatage UTC et empreinte de sécurité SHA-256. | [ ] |
| **TC-39** | Export Registre RGPD | Cliquer sur "Exporter Registre" | Téléchargement du journal d'audit conforme aux exigences de conformité HDS/RGPD. | [ ] |

---

## 📊 Résumé d'Exécution des Tests
- **Date de Recette** : `___ / ___ / 2026`
- **Testeur(s)** : `___________________________`
- **Total Cas de Test** : `39`
- **Succès** : `___ / 39`
- **Anomalies Détectées** : `___`
- **Décision Finale** : `[ ] Validé pour Mise en Production` / `[ ] Réserves à Corriger`
