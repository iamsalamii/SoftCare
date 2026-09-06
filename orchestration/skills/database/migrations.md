# PURPOSE
Gérer l'évolution du schéma de base de données de manière séquentielle, versionnée, reproductible, sans perte de données et sans interruption de service.

# WHEN TO USE
- Toute modification structurelle de la base de données (création de table, ajout de colonne, modification d'index).

# PRINCIPLES
- **Idempotence & Reproductibilité** : Une migration doit pouvoir être rejouée dans n'importe quel environnement (dev, staging, prod) avec le même résultat.
- **Pattern Expand and Contract** : Découper les changements majeurs en plusieurs étapes compatibles pour permettre le déploiement continu (Zero-Downtime Deployment).
- **Non-Blocage** : Éviter les verrous exclusifs prolongés qui figent les tables en production (`ACCESS EXCLUSIVE`).

# BEST PRACTICES
- Toujours versionner les scripts de migration dans Git avec un horodatage ou un numéro séquentiel strict.
- Ajouter des colonnes avec une valeur par défaut de manière sûre (en PostgreSQL 11+, `ADD COLUMN col TEXT DEFAULT 'val'` est instantané et ne réécrit pas la table).
- Créer les index volumineux avec `CREATE INDEX CONCURRENTLY` (attention : ne peut pas s'exécuter à l'intérieur d'une transaction blocante).
- Toujours tester le retour arrière (Rollback / Down script) sur une copie de base de données réelle.

# COMMON MISTAKES
- Renommer brutalement une colonne utilisée par l'application en cours d'exécution (provoque des crashs immédiats).
- Exécuter des scripts DDL manuellement directement sur le serveur de production sans traçabilité Git.
- Mettre dans une même transaction une migration de schéma DDL lourde et une mise à jour de données DML sur des millions de lignes.

# WORKFLOW
1. Rédiger le script de migration (Up et Down).
2. Tester la migration locale sur une base fraîche.
3. Vérifier que la version précédente de l'application continue de fonctionner (compatibilité ascendante).
4. Appliquer la migration via un outil automatisé (EF Core Migrations, DbUp ou Flyway).
5. Vérifier la réussite et consigner le log d'exécution.

# CHECKLIST
- [ ] La migration s'exécute-t-elle sans verrou bloquant prolongé ?
- [ ] Le script est-il versionné dans le référentiel Git ?
- [ ] Les données existantes sont-elles préservées et migrées sans corruption ?

# EXAMPLES
Stratégie Expand & Contract pour renommer une colonne sans coupure :
```text
Étape 1 (Release N) : Ajouter la nouvelle colonne `full_name`. L'application écrit dans les deux colonnes mais lit l'ancienne.
Étape 2 (Migration données) : Script de rattrapage `UPDATE users SET full_name = name WHERE full_name IS NULL;`.
Étape 3 (Release N+1) : L'application bascule la lecture et l'écriture sur `full_name`.
Étape 4 (Release N+2) : Supprimer l'ancienne colonne `name`.
```