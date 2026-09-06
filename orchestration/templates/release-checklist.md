# Checklist de Validation de Release (release-checklist.md)

Liste de contrôle obligatoire à compléter avant toute mise en ligne ou publication de version.

---

## 1. Identité de la Version
- **Numéro de Version** : v[X.Y.Z] (SemVer)
- **Date Prévue** : [AAAA-MM-JJ]
- **Responsable de Release** : [Orchestrateur / DevOps]

---

## 2. Contrôles Qualité et Code
- [ ] Toutes les Pull Requests prévues ont été relues et formellement approuvées par le Réviseur.
- [ ] La compilation s'exécute en mode Release sans aucun avertissement.
- [ ] L'intégralité de la suite de tests unitaires et d'intégration passe à 100% au vert.
- [ ] Les tests de régression couvrant les récents bugs ont été exécutés avec succès.

---

## 3. Contrôles de Base de Données (PostgreSQL)
- [ ] Les scripts de migration ont été testés sur une copie de base de données réelle.
- [ ] La compatibilité ascendante (Expand and Contract) est assurée sans coupure de service.
- [ ] Aucun verrou exclusif prolongé n'est déclenché par les migrations.
- [ ] Les nouveaux index ont été créés de manière non-bloquante (`CONCURRENTLY`).

---

## 4. Contrôles de Sécurité
- [ ] Le scan de vulnérabilités des dépendances (SCA) ne rapporte aucune faille critique.
- [ ] Aucun mot de passe, token ou clé privée n'est présent dans le code commité.
- [ ] Les contrôles d'accès et permissions RBAC ont été validés par l'Auditeur Sécurité.
- [ ] Les cookies et tokens utilisent les attributs de protection recommandés (`HttpOnly`, `Secure`).

---

## 5. Contrôles d'Infrastructure & Déploiement
- [ ] L'image Docker de production a été construite via le build multi-stage officiel.
- [ ] Les sondes de santé (`/healthz`) fonctionnent et valident l'état de l'application.
- [ ] La procédure de retour arrière immédiat (Rollback) est testée et documentée.
- [ ] Les variables d'environnement de production sont correctement configurées dans le coffre-fort.

---

## 6. Clôture Documentaire
- [ ] Le fichier `CHANGELOG.md` a été complété selon le format Keep a Changelog.
- [ ] La documentation des points de terminaison OpenAPI / Swagger est synchronisée.
- [ ] L'avis final favorable a été émis par l'Orchestrateur.