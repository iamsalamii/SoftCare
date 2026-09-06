# Fiche de Tâche Unitaire : [Intitulé de la Tâche]

Modèle de spécification unitaire utilisé par l'Agenda et l'Orchestrateur pour assigner du travail aux agents.

---

## 1. Informations Générales
- **Identifiant** : `TASK-[XXX]`
- **Fonctionnalité Parente** : [Nom de la feature]
- **Agent Assigné** : [Codeur / DBA / Spécialiste Backend / Frontend / Testeur]
- **Estimation Relative** : [XS / S / M / L]
- **Prérequis Bloquants** : [ex: TASK-012 terminée]

---

## 2. Objectif Précis
[Description en 2 ou 3 phrases de la modification exacte à accomplir. Être précis, direct et exclure toute ambiguïté.]

---

## 3. Fichiers Concernés
- `[NOUVEAU]` `src/Application/Orders/Commands/CreateOrderCommand.cs`
- `[MODIFIÉ]` `src/WebApi/Controllers/OrdersController.cs`
- `[TEST]` `tests/IntegrationTests/Orders/CreateOrderTests.cs`

---

## 4. Directives d'Implémentation
- Utiliser un `record` immuable pour le payload.
- Valider avec FluentValidation (champs obligatoires, montants positifs).
- Propager le `CancellationToken` sur l'appel au repository.
- Ne modifier aucun autre fichier en dehors de la liste ci-dessus.

---

## 5. Critères d'Acceptation (Definition of Done)
- [ ] Le code compile sans avertissement ni erreur.
- [ ] Les tests unitaires et/ou d'intégration associés passent au vert.
- [ ] Aucun secret ni console.log n'est présent.
- [ ] Le diff est strictement limité aux fichiers listés.