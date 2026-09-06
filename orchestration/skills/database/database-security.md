# PURPOSE
Protéger les données stockées dans PostgreSQL contre les accès non autorisés, les fuites de données, les injections SQL et garantir la conformité réglementaire.

# WHEN TO USE
- Dans toute configuration d'environnement de base de données et conception de schémas manipulant des données confidentielles.

# PRINCIPLES
- **Moindre Privilège des Rôles** : L'application web ne doit jamais se connecter en tant que superutilisateur (`postgres`).
- **Cloisonnement au Niveau Ligne (Row-Level Security - RLS)** : Pour les architectures multi-tenants, forcer le filtrage des données au niveau du moteur SQL.
- **Chiffrement de Bout en Bout** : Chiffrement en transit (SSL/TLS obligatoire) et au repos (disque chiffré, chiffrement des colonnes hautement sensibles).

# BEST PRACTICES
- Créer un utilisateur applicatif dédié disposant uniquement des privilèges `SELECT`, `INSERT`, `UPDATE`, `DELETE` sur les tables requises, sans droits DDL (`DROP`, `ALTER`).
- Activer l'audit des connexions et requêtes sensibles avec l'extension `pgaudit`.
- Ne jamais stocker de mots de passe, tokens ou numéros de carte en clair.

# COMMON MISTAKES
- Utiliser le compte par défaut `postgres` avec mot de passe vide ou trivial.
- Concaténer dynamiquement des variables dans des chaînes SQL (failles d'injection SQL).
- Exposer le port de la base de données (5432) ouvertement sur Internet sans restriction d'IP ni VPN.

# WORKFLOW
1. Créer les rôles et attribuer les privilèges au strict nécessaire (`GRANT ... TO app_user`).
2. Mettre en place les politiques RLS sur les tables sensibles multi-utilisateurs.
3. Forcer le chiffrement SSL dans `pg_hba.conf` (`hostssl ...`).
4. Vérifier l'absence d'injections SQL via des requêtes paramétrées systématiques.
5. Auditer périodiquement les droits attribués.

# CHECKLIST
- [ ] L'utilisateur de connexion applicatif est-il dépourvu des droits `SUPERUSER` ?
- [ ] Les connexions distantes exigent-elles impérativement le chiffrement SSL/TLS ?
- [ ] Toutes les requêtes sont-elles exécutées sous forme paramétrée ?

# EXAMPLES
Configuration du moindre privilège et RLS sous PostgreSQL :
```sql
-- Création d'un rôle applicatif restreint
CREATE ROLE web_app_user WITH LOGIN PASSWORD 'SECRET_ROBUSTE_ICI';
GRANT CONNECT ON DATABASE my_db TO web_app_user;
GRANT USAGE ON SCHEMA public TO web_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO web_app_user;

-- Activation de Row Level Security sur la table documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON documents
    FOR ALL
    TO web_app_user
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```