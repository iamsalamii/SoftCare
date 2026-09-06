# Règles Spécifiques de SoftCare (.antigravity/project-rules.md)

En plus des 20 règles d'or de `RULES.md`, les règles suivantes sont strictement applicables sur **SoftCare** :

---

## 1. Respect de l'Existant & Intégrité
- **Règle S1 : Non-Régression de la Clean Architecture**
  - Aucune dépendance d'infrastructure (EF Core, Npgsql) ne doit être introduite dans `SoftCare.Domain` ou `SoftCare.Application`.
- **Règle S2 : Maintien au Vert de la Suite xUnit**
  - La suite de tests unitaire `backend/tests/SoftCare.UnitTests` doit toujours rester à 100% de réussite (`dotnet test backend/SoftCare.Backend.sln`).
  - Tout nouvel ajout métier doit être accompagné d'un test xUnit équivalent.

---

## 2. Sécurité des Données de Santé & Règles Médicales
- **Règle S3 : Sécurité Pharmacogénomique (PGx) Inviolable**
  - Tout patient métaboliseur lent (*2/*2) sur le gène *CYP2C19* doit déclencher une alerte bloquante si du *Clopidogrel* est prescrit.
  - Tout contournement médical doit être tracé avec motif dans `AuditLogs`.
- **Règle S4 : Confidentialité & Données Patients**
  - Le numéro de sécurité sociale (`SocialSecurityNumber`) ne doit jamais apparaître en clair dans les logs ou les URL.
  - Les mots de passe sont obligatoirement hachés via BCrypt.
- **Règle S7 : Zéro Secret Hardcodé (Strict)**
  - Interdiction absolue d'écrire des identifiants admin, mots de passe, clés d'API ou secrets JWT en clair dans le code, tests ou configurations.
  - Utiliser impérativement les variables d'environnement / `IConfiguration` et exclure tout fichier `.env` de git.
- **Règle S8 : Sécurisation Systématique des Routes (Deny by Default)**
  - Tout nouvel endpoint d'API doit être protégé par `[Authorize]` par défaut.
  - Contrôle d'accès strict (RBAC) et prévention IDOR/BOLA (vérification de la légitimité de l'utilisateur sur la ressource ciblée).
  - Détail complet des règles défensives : voir `.agents/rules/security-rules.md`.

---

## 3. Performance & Base de Données
- **Règle S5 : Indexation Systématique**
  - Tout nouveau code ou identifiant scannable par douchette (ex: nouveau code de prélèvement) doit posséder un index PostgreSQL dédié pour garantir un temps de réponse < 10ms.
- **Règle S6 : Synchronisation des Scripts SQL**
  - Toute modification des entités EF Core doit être reflétée dans `backend/init-database.sql` pour garantir la reproductibilité Docker.