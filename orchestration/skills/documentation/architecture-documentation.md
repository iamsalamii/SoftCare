# PURPOSE
Consigner formellement les choix de conception logicielle, les frontières de systèmes et l'historique des décisions techniques majeures au moyen d'Architecture Decision Records (ADR).

# WHEN TO USE
- Dès qu'une décision structurante est prise (choix d'un pattern, d'une base de données, d'un ORM, d'un modèle d'authentification).

# PRINCIPLES
- **Traçabilité Temporelle** : Comprendre pourquoi une décision a été prise, à quel moment, par qui et dans quel contexte.
- **Immuabilité des Décisions Passées** : Un ADR validé n'est pas modifié ; si la décision change, un nouvel ADR remplace (supersedes) le précédent.
- **Clarté du Compromis** : Documenter honnêtement les conséquences négatives ou contraintes acceptées.

# BEST PRACTICES
- Utiliser le format standardisé d'ADR (Titre, Statut, Contexte, Décision, Conséquences).
- Stocker les ADRs dans `docs/adr/` sous une forme numérotée séquentiellement (`0001-choix-postgresql.md`).
- Associer des diagrammes d'architecture C4 (Context, Containers, Components).

# COMMON MISTAKES
- Garder les décisions architecturales informelles au détour de conversations orales ou chats éphémères.
- Réécrire l'histoire en supprimant un vieil ADR au lieu d'en publier un nouveau qui le rend obsolète.
- Omettre d'expliciter les alternatives écartées et les motifs de leur rejet.

# WORKFLOW
1. Identifier la problématique architecturale nécessitant arbitrage.
2. Explorer et évaluer les alternatives techniques envisageables.
3. Concerter l'équipe et arrêter la décision.
4. Rédiger l'ADR à partir de `templates/architecture-decision.md`.
5. Valider l'ADR en revue et le commiter dans le référentiel.

# CHECKLIST
- [ ] L'ADR est-il numéroté et horodaté ?
- [ ] Le contexte et les contraintes sont-ils clairement exposés ?
- [ ] Les conséquences positives ET négatives sont-elles explicitées ?

# EXAMPLES
Extrait d'en-tête d'ADR :
```markdown
# ADR 0003 : Choix de PostgreSQL comme Base de Données Principale

- **Statut** : Accepté
- **Date** : 2026-09-02
- **Décideurs** : Architecte, Lead Backend, DBA

## Contexte
L'application nécessite une persistance transactionnelle ACID stricte, le support natif des types JSONB pour les métadonnées variables et une forte fiabilité de requêtage relationnel.

## Décision
Nous retenons PostgreSQL comme SGBD relationnel par défaut pour l'ensemble des modules.
```