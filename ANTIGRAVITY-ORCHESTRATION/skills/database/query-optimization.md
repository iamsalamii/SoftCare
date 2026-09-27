# PURPOSE
Diagnostiquer et optimiser les requêtes SQL peu performantes pour réduire la latence, la consommation mémoire et l'utilisation CPU sur le serveur PostgreSQL.

# WHEN TO USE
- Dès qu'une requête SQL dépasse le seuil acceptable de temps d'exécution (ex: > 100ms pour un endpoint transactionnel).

# PRINCIPLES
- **Diagnostic Scientifique** : Se fier exclusivement aux mesures fournies par `EXPLAIN (ANALYZE, BUFFERS, VERBOSE)`.
- **Réduction du Volume Lu** : Remplacer les Sequential Scans par des Index Scans ou Index Only Scans.
- **Éviter le Piège du N+1** : Rassembler les requêtes unitaires en une requête groupée avec jointure ou CTE.

# BEST PRACTICES
- Ne sélectionner que les colonnes nécessaires (`SELECT id, title`, proscrire `SELECT *`).
- Surveiller le nombre de buffers partagés lus depuis le disque (`read`) par rapport à ceux trouvés en mémoire (`hit`).
- Utiliser les Common Table Expressions (CTE) et les fenêtres analytiques (`ROW_NUMBER() OVER (...)`) pour simplifier les requêtes complexes.

# COMMON MISTAKES
- Optimiser à l'aveugle sans exécuter `EXPLAIN ANALYZE`.
- Laisser l'ORM (EF Core) générer des requêtes cartésiennes géantes avec de multiples `.Include()` sans `.AsSplitQuery()`.
- Utiliser des fonctions sur des colonnes indexées dans la clause WHERE (ex: `WHERE LOWER(email) = '...'`), ce qui désactive l'index standard (utiliser un index sur expression).

# WORKFLOW
1. Isoler la requête lente à partir des logs ou de `pg_stat_statements`.
2. Exécuter `EXPLAIN (ANALYZE, BUFFERS) <requête>` dans un environnement de test garni de volumétrie réaliste.
3. Identifier le nœud le plus coûteux (Seq Scan, Hash Join lourd, Sort externe sur disque).
4. Ajuster la requête ou créer l'index approprié.
5. Re-mesurer et comparer les durées d'exécution (`Execution Time`) et lectures de blocs (`Buffers: shared hit`).

# CHECKLIST
- [ ] Le plan d'exécution évite-t-il les lectures séquentielles sur les grandes tables ?
- [ ] Le tri s'effectue-t-il en mémoire (`Sort Method: quicksort`) et non sur disque (`external merge Disk`) ?
- [ ] La projection exclut-elle les colonnes inutiles ?

# EXAMPLES
Analyse d'un plan de requête avec EXPLAIN :
```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, total_amount
FROM orders
WHERE customer_id = 'c1234567-89ab-cdef-0123-456789abcdef'
  AND created_at >= '2026-01-01'
ORDER BY created_at DESC;
```
Interprétation : Si le plan indique `Seq Scan on orders`, ajouter un index composite `(customer_id, created_at DESC)`.