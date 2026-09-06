# Pipeline de Revue de Code & Quality Gate (workflow-review.md)

Procédure encadrant la relecture de code, l'application des standards de qualité et l'exercice du droit de veto par le Réviseur.

---

## 1. Principes de la Revue
- Aucun code ne franchit le cap de la branche principale sans approbation explicite du Réviseur.
- Le Réviseur dispose d'un **droit de veto absolu** dès lors qu'une des 20 règles d'ingénierie (`RULES.md`) est enfreinte.
- La revue porte sur 4 piliers : Conformité architecturale, Lisibilité/Clean Code, Sécurité fondamentale, Efficience.

---

## 2. Processus de Revue Étape par Étape

1. **Vérification des Prérequis Automatisés** :
   - Le code compile-t-il sans warnings ?
   - Tous les tests automatisés xUnit / Vitest sont-ils au vert ?
   - Si l'un de ces critères échoue, la revue est immédiatement avortée (Rejet automatique).
2. **Contrôle du Périmètre (Scope Audit)** :
   - Le diff contient-il des modifications hors sujet ou des reformatages parasites ?
   - Si oui : demande de réduction du diff au strict nécessaire.
3. **Analyse Qualité Ligne à Ligne** :
   - Respect des conventions de nommage, immutabilité, clarté expressive.
   - Absence de secrets, d'injections potentielles, d'exceptions avalées.
   - Utilisation adéquate des types PostgreSQL et des idiomes C# / React.
4. **Émission du Verdict** :
   - **APPROUVÉ** : Le code répond à toutes les exigences et peut être fusionné.
   - **MODIFICATIONS REQUISES** : Le Codeur doit appliquer les corrections spécifiées avant nouvelle présentation.
   - **REJETÉ** : L'implémentation est conceptuellement erronée et doit être repensée.