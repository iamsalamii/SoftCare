# PURPOSE
Déployer les nouvelles versions de l'application en production de façon reproductible, sécurisée et avec une indisponibilité minimale voire nulle (Zero Downtime).

# WHEN TO USE
- Pour la mise en ligne des versions et correctifs sur les environnements de staging et production.

# PRINCIPLES
- **Déploiement Répétable & Scripté** : Aucun déploiement ne doit être réalisé manuellement à la main via SSH.
- **Rollback Instantané** : Prévoir la procédure inverse pour revenir à la version précédente en quelques secondes.
- **Vérification de Santé (Healthchecks)** : Ne basculer le trafic vers la nouvelle version que lorsque les sondes de santé répondent positivement.

# BEST PRACTICES
- Utiliser la stratégie de déploiement Blue/Green ou Rolling Update.
- Exécuter les migrations de base de données compatibles de manière préalable au déploiement des conteneurs applicatifs.
- Vérifier le point de terminaison de santé `/healthz` immédiatement après déploiement (Smoke Testing).

# COMMON MISTAKES
- Écraser la version en production sans conserver la possibilité de restaurer immédiatement la version précédente.
- Exécuter des migrations de données bloquantes pendant la mise à jour des conteneurs.
- Ne pas tester le déploiement sur un environnement de staging strictement identique à la production.

# WORKFLOW
1. Préparer l'artefact immuable (image Docker taguée avec le commit hash).
2. Appliquer les migrations PostgreSQL compatibles.
3. Démarrer le nouveau conteneur en parallèle.
4. Attendre la validation de la sonde de santé (`readiness probe`).
5. Basculer le trafic réseau et arrêter l'ancien conteneur.

# CHECKLIST
- [ ] La procédure de retour arrière (Rollback) est-elle documentée et testée ?
- [ ] Les sondes de santé valident-elles la connectivité à PostgreSQL avant routage ?
- [ ] Les secrets sont-ils injectés depuis le coffre-fort de production ?

# EXAMPLES
Configuration de sonde de santé dans Docker Compose :
```yaml
healthcheck:
  test: ["CMD-SHELL", "wget -q --spider http://localhost:8080/healthz || exit 1"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s
```