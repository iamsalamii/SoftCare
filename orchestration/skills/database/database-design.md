# PURPOSE
Concevoir des schémas relationnels normalisés, cohérents, évolutifs et préservant rigoureusement l'intégrité des données d'entreprise.

# WHEN TO USE
- Phase initiale de modélisation de données ou refonte de modèles relationnels.

# PRINCIPLES
- **Normalisation (3NF)** : Atteindre au minimum la 3ème Forme Normale pour éliminer les redondances et anomalies de modification.
- **Dénormalisation Contrôlée** : Ne dénormaliser que sur preuve de gain de performance critique mesurée, en documentant la stratégie de cohérence.
- **Isolation Temporelle** : Prévoir les colonnes de traçabilité (`created_at`, `updated_at`) et l'archivage/historisation si requis.

# BEST PRACTICES
- Choisir entre clés primaires naturelles (si immuables et garanties uniques) et clés synthétiques (`UUID`).
- Pour les relations N-N, créer une table de jonction explicite avec clé composite et contraintes de clés étrangères.
- Utiliser le soft-delete (`deleted_at TIMESTAMPTZ`) uniquement si une exigence légale ou métier l'impose, sinon préférer le hard-delete avec table d'archive.

# COMMON MISTAKES
- Stocker des listes délimitées par des virgules dans une colonne texte au lieu d'une table relationnelle ou d'un tableau typé.
- Dénormaliser prématurément pour "anticiper" des lenteurs imaginaires.
- Omettre les contraintes d'unicité `UNIQUE` sur les colonnes fonctionnellement uniques (ex: email utilisateur).

# WORKFLOW
1. Établir le dictionnaire de données et le diagramme Entité-Relation (ERD).
2. Appliquer les règles de normalisation (1NF, 2NF, 3NF).
3. Définir les types de données stricts PostgreSQL.
4. Mettre en place les contraintes d'unicité, de vérification (`CHECK`) et d'intégrité référentielle.
5. Générer le diagramme et consigner la documentation du modèle.

# CHECKLIST
- [ ] Toutes les redondances non justifiées sont-elles éliminées ?
- [ ] Les contraintes d'unicité et de non-nullité sont-elles posées ?
- [ ] Les tables de jonction N-N possèdent-elles leurs clés étrangères et index ?

# EXAMPLES
Table de jonction N-N avec contrainte composite :
```sql
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```