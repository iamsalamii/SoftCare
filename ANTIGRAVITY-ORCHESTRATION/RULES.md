# Règles d'Ingénierie Non Négociables (RULES.md)

Ce document constitue la **constitution technique** régissant le comportement de l'ensemble des agents IA et des contributeurs du système `ANTIGRAVITY-ORCHESTRATION`. Toute violation de ces règles constitue un critère immédiat de rejet lors de la revue de code.

---

### Règle 1 : Ne Jamais Inventer une Exigence
Aucun agent n'est autorisé à extrapoler ou implémenter une fonctionnalité non explicitement demandée ou validée par l'Orchestrateur ou l'utilisateur. En cas de doute ou d'ambiguïté fonctionnelle, l'agent doit formuler une demande de clarification formelle.

### Règle 2 : Ne Jamais Supposer qu'un Fichier Fonctionne sans Vérification
L'affirmation qu'un code compile, qu'un test passe ou qu'une migration s'exécute doit reposer sur une exécution physique vérifiable (commande CLI, build, test runner). Les suppositions théoriques sont interdites.

### Règle 3 : Toujours Analyser le Code Existant Avant Modification
Avant de toucher à la moindre ligne de code, l'agent (notamment le Codeur ou le Spécialiste) doit inspecter les fichiers adjacents, comprendre l'architecture en place, noter les conventions de nommage et identifier les dépendances directes et indirectes.

### Règle 4 : Toujours Respecter l'Architecture Existante
L'architecture en place (qu'il s'agisse de Clean Architecture, de Vertical Slices ou de layered patterns) doit être respectée de manière stricte. Aucun agent ne doit introduire un paradigme contradictoire sans un ADR (Architecture Decision Record) validé par l'Architecte.

### Règle 5 : Ne Jamais Supprimer une Fonctionnalité sans Justification
Toute suppression de méthode, classe, endpoint, composant ou champ de base de données doit être formellement documentée et justifiée par une évolution du besoin métier ou une obsolescence avérée. Les régressions silencieuses sont proscrites.

### Règle 6 : Ne Jamais Hardcoder de Secrets
Mots de passe, tokens JWT, clés d'API, chaînes de connexion avec identifiants et certificats ne doivent **JAMAIS** apparaître en clair dans le code source ou dans les fichiers Markdown d'orchestration. Utiliser systématiquement les variables d'environnement ou les gestionnaires de secrets.

### Règle 7 : Ne Jamais Exposer de Clés d'API Publiquement
Les clés privées et tokens d'accès tiers doivent demeurer cloisonnés au backend ou injectés de manière sécurisée lors du déploiement. Le frontend ne doit manipuler que des clés publiques restreintes par domaine lorsque strictement nécessaire.

### Règle 8 : Toujours Valider les Entrées Utilisateur
Toute donnée franchissant une frontière (requête HTTP, formulaire frontend, paramètre d'URL, message de queue) doit être validée de manière rigoureuse. Côté C#, utiliser FluentValidation / DataAnnotations avec typage fort. Côté React, utiliser Zod ou des validateurs typés.

### Règle 9 : Toujours Considérer la Sécurité et l'Isolation
Adopter le principe du moindre privilège, se prémunir contre les failles OWASP Top 10 (XSS, CSRF, Injections SQL, IDOR, SSRF) et s'assurer du cloisonnement multi-tenant ou utilisateur lors des accès aux données.

### Règle 10 : Toujours Tester les Changements Importants
Tout nouveau développement ou correctif de bug doit être accompagné de son test automatisé : test unitaire pour la logique métier, test d'intégration avec base de données réelle pour les requêtes de persistance, test de composant pour l'UI critique.

### Règle 11 : Toujours Rechercher la Cause Racine d'un Bug
Il est formellement interdit de masquer une erreur par un bloc `catch` vide, un fallback silencieux ou une rustine superficielle. Le Débogueur doit identifier la source exacte de l'anomalie et la corriger en profondeur.

### Règle 12 : Éviter les Duplications Inutiles (DRY Pragmatique)
Mutualiser la logique métier répétée tout en évitant le couplage prématuré. Deux morceaux de code qui se ressemblent mais évoluent pour des raisons métier distinctes ne doivent pas être artificiellement fusionnés.

### Règle 13 : Éviter le Sur-Engineering (KISS & YAGNI)
La solution la plus simple qui répond fidèlement et robustement au besoin présent est systématiquement préférée aux usines à gaz, aux hiérarchies de classes infinies et aux patterns génériques injustifiés.

### Règle 14 : Ne Pas Créer de Fonctionnalités Non Demandées
L'anticipation spéculative de futurs besoins ("au cas où") pollue la base de code, augmente la surface d'attaque et génère de la dette technique. Se concentrer exclusivement sur le périmètre validé.

### Règle 15 : Ne Pas Modifier Inutilement de Fichiers Hors Périmètre
Les modifications doivent être limitées au diff minimal nécessaire. Il est interdit de reformater ou renommer des fichiers non concernés par la tâche en cours, sous peine de rendre l'historique Git illisible.

### Règle 16 : PostgreSQL est la Base de Données par Défaut
Les types de données (`uuid`, `timestamptz`, `jsonb`, `numeric`), les mécanismes de contraintes (`FOREIGN KEY`, `CHECK`, `NOT NULL`), les index pertinents et les migrations versionnées doivent être conçus en exploitant pleinement la robustesse de PostgreSQL.

### Règle 17 : Les Décisions Importantes Doivent Être Documentées
Tout choix technologique, arbitrage structurel ou changement de convention doit faire l'objet d'un fichier ADR consigné dans la documentation du projet (`templates/architecture-decision.md`).

### Règle 18 : Un Agent Doit Signaler ses Incertitudes
Lorsqu'un agent IA fait face à une hypothèse non vérifiée, une ambiguïté dans la documentation ou un comportement système inattendu, il a l'obligation formelle de le notifier explicitement dans son rapport de synthèse.

### Règle 19 : Transmission Systématique des Livrables
Chaque agent de la chaîne doit structurer sa sortie pour que l'agent suivant dispose de toutes les clés d'exécution : chemin des fichiers, signatures de méthodes, contrats DTO, logs d'erreur ou plans de test.

### Règle 20 : L'Orchestrateur est Garant de la Cohérence Globale
L'Orchestrateur détient la responsabilité finale de valider l'intégrité de l'ensemble de la livraison. Si un seul critère de qualité ou une seule règle est bafouée, la livraison est renvoyée en correction.