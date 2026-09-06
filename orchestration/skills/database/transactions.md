# PURPOSE
Maîtriser les frontières transactionnelles, garantir la cohérence ACID des opérations métier et prévenir les verrous bloquants ou interblocages (deadlocks).

# WHEN TO USE
- Toute opération commerciale ou financière impliquant la modification de plusieurs enregistrements interdépendants.

# PRINCIPLES
- **ACID** : Atomicité (tout ou rien), Cohérence (respect des invariants), Isolation (concurrence contrôlée), Durabilité (persistance sur disque confirmée).
- **Niveaux d'Isolation PostgreSQL** :
  - `Read Committed` (par défaut) : Chaque requête voit les données validées avant son début.
  - `Repeatable Read` : La transaction voit un instantané (snapshot) figé au début de la transaction.
  - `Serializable` : Émulation d'une exécution séquentielle stricte, rejetant les transactions concurrentes conflictuelles.
- **Transactions Courtes** : Ne jamais maintenir une transaction ouverte pendant un appel réseau externe ou un traitement long.

# BEST PRACTICES
- Toujours verrouiller les ressources dans le même ordre déterministe pour rendre les deadlocks physiquement impossibles.
- Utiliser le verrouillage optimiste (via une colonne `version` ou `xmin`) pour les applications web concurrentes.
- Utiliser `SELECT ... FOR UPDATE` avec précaution et parcimonie pour les décrémentations de stock ou soldes monétaires.

# COMMON MISTAKES
- Engager une transaction de base de données puis faire un appel HTTP vers une API tierce (risque de saturer le pool de connexions si l'API externe est lente).
- Ignorer les exceptions de concurrence (`40001 serialization_failure` ou `40P01 deadlock_detected`) sans mécanisme de retry automatique.
- Utiliser un niveau d'isolation trop élevé sans nécessité, augmentant le taux d'avortement de transactions.

# WORKFLOW
1. Délimiter le périmètre exact de la transaction.
2. Ordonner les opérations de mise à jour par ordre d'identifiant croissant.
3. Exécuter les requêtes à l'intérieur d'un bloc transactionnel (`BEGIN ... COMMIT`).
4. Gérer l'annulation (`ROLLBACK`) en cas de levée d'erreur.
5. Implémenter une stratégie de réessai (retry policy avec backoff exponentiel) en cas de deadlock intermittent.

# CHECKLIST
- [ ] Aucun appel réseau externe n'est-il réalisé à l'intérieur du bloc transactionnel ?
- [ ] L'ordre des mises à jour est-il constant pour éviter les interblocages ?
- [ ] Le niveau d'isolation choisi correspond-il au niveau d'intégrité requis ?

# EXAMPLES
Gestion transactionnelle robuste avec verrouillage pessimiste maîtrisé :
```sql
BEGIN;

-- Verrouillage de la ligne de compte client spécifique
SELECT balance 
FROM accounts 
WHERE id = 'a123...' 
FOR UPDATE;

-- Débit
UPDATE accounts 
SET balance = balance - 100.00 
WHERE id = 'a123...';

-- Crédit
UPDATE accounts 
SET balance = balance + 100.00 
WHERE id = 'b456...';

COMMIT;
```