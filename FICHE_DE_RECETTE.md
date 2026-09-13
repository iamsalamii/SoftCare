# 📋 FICHE DE TEST & CAHIER DE RECETTE HOSPITALIÈRE V2.4
## Projet SoftCare — Système d'Information Hospitalier (HIS) & Biotech OS

> **Statut Global** : Validé & Prêt pour Recette Praticien  
> **Serveurs Actifs** :
> - 🌐 **Frontend Web** : [http://localhost:5173](http://localhost:5173)
> - ⚙️ **Backend API** : [http://localhost:5291](http://localhost:5291)
> - 📚 **Documentation Swagger** : [http://localhost:5291/swagger/index.html](http://localhost:5291/swagger/index.html)

---

### 🔑 Identifiants pour vos Tests

| Profil / Rôle | Identifiant (Email) | Mot de passe | Droits & Périmètre |
| :--- | :--- | :--- | :--- |
| **Administrateur Principal** | `admin@hospitalcare.com` | `admin123` | Accès complet, Réception alertes DSI, Paramètres, Utilisateurs |
| **Médecin Praticien** | `docteur.test@hopital.fr` | `admin123` | DPI, Prescriptions, Triage, Aide au diagnostic IA, PGx |
| **Infirmier(e)** | `claire.dubois@hospitalcare.com` | `admin123` | Soins infirmiers, Administration médicaments, Admissions lits |
| **Pharmacien Hospitalier** | `marc.lefevre@hospitalcare.com` | `admin123` | PUI Pharmacie, POS Caisse, Scan douchette, Stock, Chaîne froid |
| **Biologiste / Généticien** | `sophie.martin@hospitalcare.com` | `admin123` | LIMS Biologie, Validation examens, Profils PGx, Biobanque |

---

## 📑 Sommaire des 13 Lots de Recette

1. [Lot 1 : Landing Page & Ambiance Visuelle Médicale](#lot-1--landing-page--ambiance-visuelle-médicale)
2. [Lot 2 : Brochure Médicale & White-Labeling (Logo & Copyright)](#lot-2--brochure-médicale--white-labeling-logo--copyright)
3. [Lot 3 : Authentification & Alerte Réinitialisation Mot de Passe](#lot-3--authentification--alerte-réinitialisation-mot-de-passe)
4. [Lot 4 : Centre de Notifications & Persistance du Statut Lu](#lot-4--centre-de-notifications--persistance-du-statut-lu)
5. [Lot 5 : Dossier Patient Informatisé (DPI) & Identitovigilance](#lot-5--dossier-patient-informatisé-dpi--identitovigilance)
6. [Lot 6 : Gestion des Lits & Contrôle Date de Sortie](#lot-6--gestion-des-lits--contrôle-date-de-sortie)
7. [Lot 7 : Pharmacie Hospitalière (PUI), Tiers-Payant & Ticket 80mm](#lot-7--pharmacie-hospitalière-pui-tiers-payant--ticket-80mm)
8. [Lot 8 : Biotechnologies, Création PGx & Cryothèque Biobanque](#lot-8--biotechnologies-création-pgx--cryothèque-biobanque)
9. [Lot 9 : Aide au Diagnostic Clinique IA (CDS Hooks)](#lot-9--aide-au-diagnostic-clinique-ia-cds-hooks)
10. [Lot 10 : Soins Infirmiers & Feuilles de Surveillance](#lot-10--soins-infirmiers--feuilles-de-surveillance)
11. [Lot 11 : Laboratoire LIMS & Validation Biologique](#lot-11--laboratoire-lims--validation-biologique)
12. [Lot 12 : Facturation & Harmonisation de la Devise](#lot-12--facturation--harmonisation-de-la-devise)
13. [Lot 13 : Administration, Sécurité Super-Admin & Piste d'Audit](#lot-13--administration-sécurité-super-admin--piste-daudit)

---

## Lot 1 : Landing Page & Ambiance Visuelle Médicale

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | **Fond Médical Immersif** | Accéder à `http://localhost:5173/` | Affichage d'un fond haute technologie médicale avec dégradés profonds, maillage SVG et lueurs animées. | [ ] |
| **TC-02** | **Simulateur Studio avec Voix Off** | Cliquer sur "Lecture" dans le Hero | Voix off française dynamique (Web Speech), sous-titres synchronisés, progression des 4 chapitres, boutons interactifs de simulation sans vidéo externe. | [ ] |
| **TC-03** | **Cartes Photographiques des Départements** | Défiler vers la section *Immersion Hospitalière* | 4 vitrines photographiques (*Urgences SAU, Pharmacie Robotisée, Biobanque NGS, Assistant IA*) avec zoom fluide au survol (`scale-108`) et indicateurs temps réel. | [ ] |
| **TC-04** | **Bannières Thématiques Spécialisées** | Défiler vers les sections Biotech et IA | Bannières photo grand format du laboratoire de génétique et du praticien en consultation. | [ ] |
| **TC-05** | **Bouton Espace Pro** | Cliquer sur "Espace Pro" dans le Header | Redirection instantanée vers l'écran de connexion professionnel. | [ ] |

---

## Lot 2 : Brochure Médicale & White-Labeling (Logo & Copyright)

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-06** | **Affichage de la Brochure** | Cliquer sur "Brochure Médicale" sur la Landing | Ouverture du modal interactif multi-pages avec sommaire, architecture et fonctionnalités. | [ ] |
| **TC-07** | **En-tête Document Client** | Cliquer sur "Télécharger PDF / Imprimer" | L'en-tête officiel contient **exclusivement** le logo de l'organisation cliente, son nom, son adresse et son téléphone (aucun logo SoftCare intrusif). | [ ] |
| **TC-08** | **Copyright SoftCare en Pied de Page** | Examiner le bas du document généré | Mention discrète : `© 2026 SoftCare Hospital OS • Système d'Information Hospitalier (HIS) • Conforme HDS & RGPD`. | [ ] |

---

## Lot 3 : Authentification & Alerte Réinitialisation Mot de Passe

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-09** | **Demande de Réinitialisation Praticien** | Sur `/login`, cliquer "Mot de passe oublié ?" et saisir `docteur.test@hopital.fr` | Message de succès confirmant la transmission immédiate de la requête à la DSI / Administrateur. | [ ] |
| **TC-10** | **Réception Alerte Côté Administrateur** | Se connecter avec `admin@hospitalcare.com` / `admin123` | La cloche de notification affiche immédiatement un badge rouge avec l'alerte : *Demande de réinitialisation pour docteur.test@hopital.fr*. | [ ] |
| **TC-11** | **Action Directe Admin** | Cliquer sur la notification reçue | Navigation directe vers la gestion des utilisateurs pour modifier ou réinitialiser le mot de passe du médecin. | [ ] |

---

## Lot 4 : Centre de Notifications & Persistance du Statut Lu

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-12** | **Action « Tout marquer comme lu »** | Ouvrir le tiroir des notifications et cliquer sur « Tout marquer comme lu » | Le badge rouge disparaît instantanément et toutes les cartes passent en statut lu (fond blanc). | [ ] |
| **TC-13** | **Persistance après Rafraîchissement** | Appuyer sur `F5` pour recharger la page | Les notifications restent marquées comme lues et aucun badge fantôme ne réapparaît. | [ ] |
| **TC-14** | **Filtrage selon le Rôle** | Se connecter avec le compte Infirmier ou Médecin | L'utilisateur ne voit que les alertes médicales qui lui sont destinées (les alertes administratives sensibles sont réservées à l'admin). | [ ] |

---

## Lot 5 : Dossier Patient Informatisé (DPI) & Identitovigilance

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-15** | **NIR Flexible / International** | Créer un patient étranger avec un format NIR libre | Le formulaire accepte le format et n'impose plus le carcan strict à 13 chiffres obligatoires français. | [ ] |
| **TC-16** | **Mode « Sans couverture / Paiement Direct »** | Cocher l'interrupteur "Sans couverture / Paiement direct" | Les champs de mutuelle/sécurité sociale se désactivent proprement et le mode paiement direct est acté. | [ ] |
| **TC-17** | **Menu Déroulant Ville & Lien de Parenté** | Tester `CustomSelect` pour Ville et Contact d'urgence | Sélection fluide parmi les options complètes (Paris, Lyon, Marseille, Abidjan, Dakar, etc.) avec saisie libre disponible. | [ ] |

---

## Lot 6 : Gestion des Lits & Contrôle Date de Sortie

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-18** | **Contrôle Date de Sortie Antérieure** | Tenter d'admettre un patient avec une date de sortie antérieure à aujourd'hui | Le système refuse la validation et avertit l'utilisateur : *La date prévisionnelle de sortie ne peut pas être antérieure à la date d'admission*. | [ ] |
| **TC-19** | **Action « Libérer le lit »** | Dans le plan des lits, cliquer sur le bouton "Libérer le lit" d'une chambre occupée | Le lit passe instantanément au statut vert `Disponible`, le patient est sorti et le taux d'occupation est recalculé en direct. | [ ] |
| **TC-20** | **Devise du Tarif Journalier** | Modifier le tarif journalier d'un lit | L'intitulé affiche la devise paramétrée (ex: `Tarif Journalier (FCFA)` ou `($)`) sans `€` forcé. | [ ] |

---

## Lot 7 : Pharmacie Hospitalière (PUI), Tiers-Payant & Ticket 80mm

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-21** | **Scan Douchette & Panier** | Sélectionner un patient et scanner ou ajouter un médicament | Déduction immédiate de stock et calcul automatique de la part Mutuelle vs part Patient. | [ ] |
| **TC-22** | **Validation & Impression Ticket 80mm** | Cliquer sur "Confirmer & Imprimer le Ticket" | Impression au format rouleau 80mm thermique via iframe invisible en arrière-plan. | [ ] |
| **TC-23** | **Non-Régression Écran Blanc** | Après l'impression du ticket, revenir sur l'onglet de l'application | L'écran reste 100% interactif et réactif (aucun gel, aucun écran blanc). | [ ] |
| **TC-24** | **Devise Dynamique Caisse** | Vérifier les boutons d'appoint rapide (+10, +20, etc.) et le total | Utilisation stricte de la devise configurée dans l'établissement. | [ ] |

---

## Lot 8 : Biotechnologies, Création PGx & Cryothèque Biobanque

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-25** | **Création Profil Pharmacogénomique** | Dans *Biotech > PGx*, cliquer sur « + Nouveau PGx » | Modal de création : sélection du patient, choix du gène (*CYP2C19, DPYD, CYP2D6*), allèles (*2/*2), phénotype et recommandation CPIC. | [ ] |
| **TC-26** | **Interception Prescription Dangereuse** | Prescrire du *Clopidogrel* sur le patient doté du profil *CYP2C19 *2/*2* | Interception bloquante immédiate avec alerte rouge de toxicité / échec clinique et proposition de Prasugrel. | [ ] |
| **TC-27** | **Création Échantillon Biobanque** | Dans *Biotech > Biobanque*, cliquer sur « + Nouvel Échantillon » | Modal avec saisie du type d'échantillon (ADN, ARN, Sérum, Tissu), choix du congélateur (-80°C), Rack, Boîte, Puits (ex: A01) et consentement éclairé. | [ ] |
| **TC-28** | **Impression Étiquette Cryotube QR** | Cliquer sur l'icône QR d'un échantillon stocké | Génération et impression d'une étiquette étanche avec code QR vectoriel géolocalisé. | [ ] |

---

## Lot 9 : Aide au Diagnostic Clinique IA (CDS Hooks)

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-29** | **Assistant IA Modal (Header)** | Cliquer sur "Assistant IA (CDS)" dans la barre supérieure | Ouverture du modal d'aide clinique avec moteur d'inférence et historique de cas. | [ ] |
| **TC-30** | **Simulation Diagnostique** | Tester le scénario *Urgence Cardiologique* | Calcul instantané des probabilités différentielles (SCA 92%, Dissection 28%) et recommandations d'examens prioritaires (Troponine, ECG 18 dérivations). | [ ] |

---

## Lot 10 : Soins Infirmiers & Feuilles de Surveillance

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-31** | **Sélection Exhaustive des Patients** | Ouvrir le formulaire d'administration de soin | Tous les patients enregistrés dans le système sont disponibles dans la liste déroulante. | [ ] |
| **TC-32** | **Types de Soins Dynamiques** | Sélectionner un type de soin infirmier | Menu dynamique avec options enrichies (*Injection IV/IM, Pansement stérile, Pose perfusion, Glycémie capillaire, etc.*). | [ ] |

---

## Lot 11 : Laboratoire LIMS & Validation Biologique

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-33** | **Mode Patient Externe / Clinique Partenaire** | Créer une demande d'examen pour un patient externe | Possibilité de spécifier le nom du patient externe et la clinique partenaire. | [ ] |
| **TC-34** | **Médecin Prescripteur Verrouillé** | Vérifier le champ "Médecin prescripteur" | Automatiquement pré-rempli et verrouillé sur le praticien connecté (sauf Super-Admin). | [ ] |
| **TC-35** | **Saisie & Validation Biologiste** | Saisir les valeurs d'analyse et cliquer sur "Valider l'examen" | L'analyse passe au statut `Validé` avec horodatage et nom du biologiste signataire. | [ ] |

---

## Lot 12 : Facturation & Harmonisation de la Devise

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-36** | **KPIs Financiers Dynamiques** | Ouvrir la liste des factures | Les cartes *Revenus*, *En attente* et *Totaux* affichent la devise de l'organisation sans aucun `€` forcé. | [ ] |
| **TC-37** | **Aperçu & Impression Facture** | Ouvrir une facture et cliquer sur "Imprimer" | En-tête officiel de l'établissement client avec ventilation HT/TVA/TTC dans la devise configurée. | [ ] |

---

## Lot 13 : Administration, Sécurité Super-Admin & Piste d'Audit

| ID | Test à Effectuer | Données & Actions | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **TC-38** | **Protection Super-Admin Système** | Tenter de supprimer le compte Administrateur Principal | Bouton de suppression verrouillé/désactivé avec badge `Système` et message de sécurité. | [ ] |
| **TC-39** | **Piste d'Audit HDS** | Réaliser une modification et consulter le journal d'audit | Enregistrement infalsifiable de l'action, de l'utilisateur, de l'horodatage et de l'adresse IP. | [ ] |

---

### 🏁 Bilan de Validation Technique
- ✅ **Tests unitaires C# / ASP.NET 9** : 31/31 réussis (**100% vert**).
- ✅ **Build React 18 / Vite** : 0 erreur, code compilé en 9s.
- ✅ **Intégrité multi-navigateurs** : Testé et validé sur Chrome, Firefox, Edge.


---

## 📊 Résumé d'Exécution des Tests
- **Date de Recette** : `___ / ___ / 2026`
- **Testeur(s)** : `___________________________`
- **Total Cas de Test** : `39`
- **Succès** : `___ / 39`
- **Anomalies Détectées** : `___`
- **Décision Finale** : `[ ] Validé pour Mise en Production` / `[ ] Réserves à Corriger`

