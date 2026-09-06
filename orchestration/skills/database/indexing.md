# PURPOSE
Accélérer l'exécution des requêtes SQL en concevant des stratégies d'indexation ciblées sans dégrader inutilement les performances d'écriture (INSERT, UPDATE, DELETE).

# WHEN TO USE
- Lors de l'optimisation des requêtes lentes, du dimensionnement initial des tables volumineuses ou de l'ajout de filtres fréquents.

# PRINCIPLES
- **Coût de l'Index** : Chaque index accélère la lecture mais ralentit chaque écriture et consomme de la mémoire vive (RAM).
- **Sélectivité** : Un index B-Tree n'est efficace que si la condition filtre un faible pourcentage de la table (< 5-10%).
- **Ordre des Colonnes (Index Composites)** : Règle de l'égalité d'abord, puis de la plage (`WHERE tenant_id = @id AND created_at > @date`).

# BEST PRACTICES
- Exploiter les **Index Partiels** pour indexer uniquement les lignes actives ou pertinentes (`WHERE is_deleted = false`).
- Exploiter les **Index GIN** pour les recherches dans les colonnes `JSONB` ou les recherches plein texte (`tsvector`).
- Créer des index sans bloquer les écritures en production grâce à l'instruction `CREATE INDEX CONCURRENTLY` sous PostgreSQL.

# COMMON MISTAKES
- Créer un index sur chaque colonne individuellement en espérant que le moteur fasse le tri.
- Indexer des colonnes à très faible cardinalité (ex: un booléen équilibré à 50/50 sans clause partielle).
- Omettre d'indexer les colonnes utilisées dans les clauses `ORDER BY` sur des volumétries massives.

# WORKFLOW
1. Analyser les requêtes lentes avec `EXPLAIN (ANALYZE, BUFFERS)`.
2. Identifier les colonnes de filtrage (`WHERE`), de jointure (`JOIN`) et de tri (`ORDER BY`).
3. Créer l'index approprié (B-Tree composite ou partiel).
4. Relancer la requête et comparer le coût et le temps d'exécution.
5. Surveiller l'utilisation réelle des index via `pg_stat_user_indexes`.

# CHECKLIST
- [ ] L'index utilise-t-il la directive `CONCURRENTLY` en environnement de production ?
- [ ] L'ordre des colonnes dans l'index composite respecte-t-il la règle égalité -> plage ?
- [ ] Les colonnes JSONB interrogées fréquemment sont-elles couvertes par un index GIN ?

# EXAMPLES
Index B-Tree composite et partiel en PostgreSQL :
```sql
-- Accélère : SELECT * FROM tasks WHERE project_id = '...' AND status = 'pending' ORDER BY priority DESC;
CREATE INDEX CONCURRENTLY idx_tasks_project_pending 
ON tasks (project_id, priority DESC) 
WHERE status = 'pending';

-- Index GIN sur un champ JSONB
CREATE INDEX idx_audit_logs_payload_gin 
ON audit_logs USING gin (payload jsonb_path_ops);
```