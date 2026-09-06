# Pipeline d'Investigation et Résolution d'Incidents (workflow-debugging.md)

Procédure formelle et rigoureuse pour traiter toute anomalie, régression ou défaillance runtime.

---

## Les 6 Étapes du Débogage Systémique

### 1. Qualification de l'Incident (Orchestrateur & Débogueur)
- Collecte des faits bruts : messages d'erreur, stack traces, logs applicatifs, conditions d'apparition.
- Remplissage de la fiche d'incident basée sur `templates/bug-report.md`.

### 2. Reproduction Déterministe Isolée
- Élimination des variables parasites.
- Création d'un environnement de reproduction minimaliste.
- Écriture d'un test automatisé unitaire ou d'intégration qui reproduit systématiquement l'échec (**Test Rouge**).

### 3. Analyse de Cause Racine (Root Cause Analysis - RCA)
- Application de la méthode des 5 Pourquoi pour remonter à l'origine profonde de la défaillance.
- Rejet formel des symptômes trompeurs de surface.
- Vérification : le problème provient-il d'un état invalide en amont, d'une hypothèse fausse ou d'une concurrence mal gérée ?

### 4. Prescription & Implémentation du Correctif Minimal
- Le Débogueur définit la stratégie de remédiation la plus ciblée.
- Le Codeur applique le correctif chirurgical sans modifier de code périphérique non concerné.

### 5. Validation de la Non-Régression
- Exécution du test de reproduction : il doit passer au vert (**Test Vert**).
- Exécution de l'intégralité de la suite de tests automatisée pour attester de l'absence totale d'effets de bord.

### 6. Revue, Clôture & Capitalisation
- Le Réviseur examine le diff et valide que le correctif s'attaque bien à la cause racine sans introduire de hack.
- L'agent Documentation consigne l'incident si celui-ci a révélé un angle mort conceptuel.