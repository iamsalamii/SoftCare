# Grille d'Évaluation de Revue de Code (code-review.md)

Fiche d'examen exhaustif soumise par le Réviseur avant validation d'intégration.

---

## 1. Synthèse de la Revue
- **Branche / Tâche** : `[feature/nom-branche]` / Tâche #[Numéro]
- **Auteur du Code** : [Agent Codeur / Développeur]
- **Réviseur** : [Lead Réviseur]
- **Verdict Global** : `[APPROUVÉ | MODIFICATIONS REQUISES | REJETÉ]`

---

## 2. Grille de Contrôle des 20 Règles

| Critère de Contrôle | Statut | Observations |
| :--- | :---: | :--- |
| **Périmètre Strict** (Pas de modifications hors sujet) | [OK / KO] | |
| **Respect de l'Architecture** (Dépendances vers le Domain) | [OK / KO] | |
| **Clean Code & Lisibilité** (Nommage, fonctions courtes) | [OK / KO] | |
| **Absence de Duplication** (DRY pragmatique) | [OK / KO] | |
| **Sécurité & Secrets** (Zéro token/mot de passe en dur) | [OK / KO] | |
| **Validation des Entrées** (FluentValidation / Zod) | [OK / KO] | |
| **Gestion des Erreurs** (RFC 7807 ProblemDetails) | [OK / KO] | |
| **Typage Strict** (Zéro `any` en TS, `<Nullable>enable</Nullable>`) | [OK / KO] | |
| **Pratiques PostgreSQL** (Types natifs, contraintes, index) | [OK / KO] | |
| **Couverture de Tests** (Unitaires, intégration, régression) | [OK / KO] | |

---

## 3. Retours Détaillés

### Points Bloquants (Modifications Obligatoires)
1. **Fichier `path/to/file.cs`, Ligne XX** : [Explication du problème technique et proposition de correction concrète].

### Points Non Bloquants (Suggestions d'Amélioration)
1. **Fichier `path/to/component.tsx`, Ligne YY** : [Suggestion d'optimisation stylistique ou de refactoring futur].

---

## 4. Décision Finale
- [ ] Le code est conforme aux standards et prêt pour le merge.
- [ ] Le code doit être renvoyé au Codeur avec les points bloquants ci-dessus.