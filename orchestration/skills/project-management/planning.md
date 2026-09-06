# PURPOSE
Planifier les itérations logicielles de manière pragmatique, anticiper les goulots d'étranglement et aligner les efforts de l'équipe sur les objectifs prioritaires.

# WHEN TO USE
- En amont de tout nouveau cycle de développement, jalon ou sprint.

# PRINCIPLES
- **Planification Incrémentale** : Préférer des itérations courtes livrant de la valeur testable plutôt que des plans rigides sur 6 mois.
- **Visibilité du Chemin Critique** : Identifier la séquence d'activités conditionnant directement la date finale de livraison.
- **Résilience aux Aléas** : Intégrer une marge raisonnable pour absorber les imprévus techniques et les régressions.

# BEST PRACTICES
- Ordonner les chantiers selon la valeur métier et le niveau de risque technique (traiter les risques majeurs au début).
- Aligner la planification sur la matrice de dépendances (ex: Base de données -> API Backend -> Client Frontend).
- Réviser le plan à chaque point d'étape pour refléter la réalité du terrain.

# COMMON MISTAKES
- Planifier 100% de la capacité théorique de l'équipe sans laisser de marge pour les bugs et la maintenance.
- Lancer le développement frontend avant que les contrats d'API et modèles de données ne soient stabilisés.
- Ne pas associer les experts techniques à l'élaboration des estimations de délai.

# WORKFLOW
1. Recueillir et clarifier les objectifs du jalon.
2. Décomposer les chantiers en lots cohérents.
3. Cartographier les dépendances amont et aval.
4. Établir le planning prévisionnel d'intervention des profils.
5. Suivre la vélocité et ajuster le périmètre si nécessaire.

# CHECKLIST
- [ ] Le chemin critique est-il formalisé ?
- [ ] Les dépendances techniques bloquantes sont-elles identifiées et ordonnancées ?
- [ ] Les critères de fin d'itération (Definition of Done) sont-ils acceptés de tous ?

# EXAMPLES
Structure d'un jalon de planification :
```text
Jalon : Version 1.1 - Gestion des Commandes
- Étape 1 : Schéma PostgreSQL & Migration (DBA) -> J1
- Étape 2 : API REST C# & Tests xUnit (Backend, Testeur) -> J2-J3
- Étape 3 : Interface React & Formulaires (UI, Frontend) -> J4
- Étape 4 : Revue globale, Sécurité & Documentation (Orchestrateur, Réviseur, Doc) -> J5
```