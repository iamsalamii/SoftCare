# PURPOSE
Exploiter PostgreSQL comme système de gestion de bases de données relationnelles principal de manière optimale, robuste, intègre et performante.

# WHEN TO USE
- Persistance de données par défaut pour l'ensemble des projets du système d'orchestration.

# PRINCIPLES
- **Typage Natif Adapté** :
  - Identifiants : `UUID` (générés avec `gen_random_uuid()`).
  - Dates et Heures : `TIMESTAMPTZ` (toujours avec fuseau horaire).
  - Monnaie et Montants : `NUMERIC(precision, scale)`.
  - Données Semi-Structurées : `JSONB`.
  - Texte : `TEXT` (préféré à `VARCHAR(N)` sans contrainte métier réelle).
- **Intégrité Référentielle Stricte** : Définir des contraintes `FOREIGN KEY` avec clauses de suppression explicites (`ON DELETE RESTRICT` par défaut).
- **MVCC & Concurrence** : Comprendre le Multi-Version Concurrency Control pour éviter les verrous inutiles.

# BEST PRACTICES
- Structurer les tables en minuscules avec des noms au pluriel et séparés par des underscores (`snake_case`).
- Toujours créer un index B-Tree sur les colonnes de clés étrangères pour accélérer les jointures.
- Définir des contraintes d'intégrité métier au niveau de la base (`CHECK (age >= 18)`, `CHECK (price > 0)`).
- Documenter les tables et colonnes avec l'instruction SQL `COMMENT ON`.

# COMMON MISTAKES
- Utiliser le type `TIMESTAMP` (sans timezone) au lieu de `TIMESTAMPTZ`.
- Utiliser `FLOAT` ou `REAL` pour des montants financiers (causes d'erreurs d'arrondi dramatiques).
- Stocker du JSON arbitraire dans `VARCHAR` ou `TEXT` au lieu d'utiliser `JSONB`.

# WORKFLOW
1. Modéliser le schéma avec contraintes d'intégrité et clés primaires UUID.
2. Concevoir les relations et index de clés étrangères.
3. Rédiger le script de création ou de migration idempotent.
4. Configurer les rôles et permissions d'accès au moindre privilège.
5. Vérifier la validité du modèle avec des données de test.

# CHECKLIST
- [ ] Toutes les tables ont-elles une clé primaire `UUID` ou `BIGINT` explicite ?
- [ ] Tous les timestamps sont-ils définis en `TIMESTAMPTZ` avec valeur par défaut `now()` ?
- [ ] Les montants comptables sont-ils en `NUMERIC` ?
- [ ] Les colonnes clés étrangères ont-elles un index associé ?

# EXAMPLES
Création d'une table robuste en PostgreSQL :
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'paid', 'cancelled')),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) 
        REFERENCES customers (id) ON DELETE RESTRICT
);

CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
```