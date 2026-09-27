# PURPOSE
Optimiser la configuration, la mémoire, les plans de requêtes et le débit global du serveur de base de données PostgreSQL.

# WHEN TO USE
- Dès que la base de données PostgreSQL devient le point d'engorgement du système ou lors du dimensionnement de charge.

# PRINCIPLES
- **Buffers Partagés (shared_buffers)** : Maximiser le nombre de requêtes servies directement depuis la mémoire RAM sans accès disque.
- **Réduction des Verrous** : Utiliser les verrous les plus faibles possibles et minimiser la durée des transactions.
- **Nettoyage Automatique (Autovacuum)** : Maintenir les statistiques à jour et réclamer l'espace disque des lignes mortes créées par le MVCC.

# BEST PRACTICES
- Activer et surveiller l'extension `pg_stat_statements` pour repérer les 10 requêtes consommant le plus de temps cumulé.
- Configurer le pool de connexions (PgBouncer ou pool Npgsql) pour éviter que des milliers de connexions concurrentes ne surchargent le CPU.
- Adapter les paramètres fondamentaux de `postgresql.conf` à la machine hôte (`shared_buffers`, `work_mem`, `effective_cache_size`, `maintenance_work_mem`).

# COMMON MISTAKES
- Laisser le paramètre `shared_buffers` à sa valeur minimale par défaut (128 Mo) sur un serveur dédié de production.
- Permettre à l'application d'ouvrir une nouvelle connexion physique à chaque requête HTTP au lieu d'utiliser un pool.
- Désactiver l'autovacuum pour des raisons de performance temporaires, conduisant au "bloat" massif des tables.

# WORKFLOW
1. Interroger `pg_stat_statements` pour lister les requêtes les plus gourmandes.
2. Analyser les plans des requêtes incriminées avec `EXPLAIN (ANALYZE, BUFFERS)`.
3. Ajouter ou ajuster les index partiels ou composites.
4. Ajuster le paramètre `work_mem` pour permettre les tris en mémoire si nécessaire.
5. Mesurer l'évolution du taux de succès du cache (`buffer cache hit ratio`).

# CHECKLIST
- [ ] L'extension `pg_stat_statements` est-elle activée ?
- [ ] Le taux de cache hit ratio dépasse-t-il 99% ?
- [ ] Le connection pooling est-il dimensionné pour correspondre au nombre de cœurs CPU disponibles ?

# EXAMPLES
Requête de diagnostic des requêtes les plus consommatrices de temps cumulé :
```sql
SELECT 
    query, 
    calls, 
    total_exec_time, 
    mean_exec_time, 
    rows 
FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 10;
```