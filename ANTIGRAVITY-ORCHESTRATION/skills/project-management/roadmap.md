# PURPOSE
Donner une vision stratégique macroscopique, ordonnée et partagée de l'évolution du produit logiciel sur le moyen et long terme.

# WHEN TO USE
- Pour communiquer les orientations stratégiques, prioriser les versions majeures et aligner les équipes techniques.

# PRINCIPLES
- **Orientée Résultats (Outcome-based)** : Une roadmap présente des objectifs métiers et des capacités logicielles plutôt qu'une liste de fonctionnalités techniques figées.
- **Vivante et Adaptative** : La roadmap s'ajuste au fur et à mesure des retours utilisateurs et des découvertes d'ingénierie.
- **Transparence des Priorités** : Expliciter clairement pourquoi tel chantier passe avant un autre.

# BEST PRACTICES
- Structurer la feuille de route en horizons temporels souples (Maintenant / Prochainement / Plus tard - Now / Next / Later).
- Regrouper les chantiers en thématiques majeures (Sécurité & Conformité, Expérience Client, Performance & Évolutivité).
- Associer des indicateurs de succès (KPIs / OKRs) mesurables à chaque grand jalon.

# COMMON MISTAKES
- Confondre une roadmap avec un calendrier rigide d'engagements à la journée près sur 18 mois.
- Surcharger la roadmap de dettes techniques obscures non reliées à un bénéfice produit tangible.
- Ne pas communiquer les réajustements de la roadmap aux équipes de développement.

# WORKFLOW
1. Recueillir les besoins stratégiques et opportunités techniques.
2. Regrouper les initiatives par thématiques fonctionnelles.
3. Évaluer la valeur métier et l'effort estimé pour chaque initiative.
4. Positionner les chantiers dans les horizons Now, Next, Later.
5. Réviser la roadmap mensuellement ou à chaque fin de cycle majeur.

# CHECKLIST
- [ ] La roadmap distingue-t-elle clairement l'horizon immédiat (Now) des horizons futurs (Next / Later) ?
- [ ] Chaque initiative est-elle adossée à un objectif métier mesurable ?
- [ ] Les dépendances architecturales majeures sont-elles reflétées dans l'ordonnancement ?

# EXAMPLES
Format Now / Next / Later :
```markdown
## Roadmap Produit

### Maintenant (Now - En cours d'exécution)
- Socle d'authentification sécurisé et gestion des rôles (ASP.NET Core & PostgreSQL RLS)
- Refonte ergonomique du tunnel de commande (React & Tailwind)

### Prochainement (Next - Prochain cycle)
- Intégration du moteur de recherche PostgreSQL plein texte (tsvector & index GIN)
- Mise en place de la suite de tests E2E avec Playwright

### Plus Tard (Later - Explorations futures)
- Évaluation d'une architecture multi-région pour la base PostgreSQL
- Application mobile cliente
```