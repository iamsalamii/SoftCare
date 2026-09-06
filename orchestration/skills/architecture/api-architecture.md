# PURPOSE
Concevoir des interfaces de programmation applicatives (APIs RESTful) standardisées, prévisibles, sécurisées et faciles à consommer par divers clients web, mobiles ou tiers.

# WHEN TO USE
- Exposition de services backend consommés par une application frontend React ou des intégrations externes.
- Mise en place de contrats de communication stables, découplés de l'implémentation interne du serveur.

# PRINCIPLES
- **Ressources et Verbes HTTP** : Utilisation des méthodes HTTP standard (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) selon leur sémantique exacte.
- **Statuts HTTP Précis** : Retourner les codes de statut universels appropriés (200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 500 Internal Error).
- **Idempotence** : Respecter l'idempotence des verbes `GET`, `PUT`, `DELETE`.
- **Standardisation des Erreurs** : Utiliser la spécification RFC 7807 (ProblemDetails).

# BEST PRACTICES
- Nommer les URIs au pluriel avec des substantifs, jamais de verbes d'action (ex: `/api/v1/orders`, pas `/api/v1/getOrders`).
- Gérer la pagination systématique des listes volumineuses (`pageNumber`, `pageSize`, headers de métadonnées).
- Versionner l'API dès le départ via l'URI (`/api/v1/`) ou via les en-têtes d'acceptation.
- Documenter exhaustivement l'API via OpenAPI v3 / Swagger.

# COMMON MISTAKES
- Renvoyer un code HTTP `200 OK` avec un corps JSON contenant `{"error": "Quelque chose a échoué"}`.
- Exposer des IDs séquentiels internes de base de données au lieu d'UUIDs ou d'identifiants publics opaques.
- Modifier un contrat d'API existant sans prévoir de rétrocompatibilité ou de nouvelle version.

# WORKFLOW
1. Définir le contrat d'interface (ressources, verbes, DTOs de requête et de réponse).
2. Concevoir la validation des paramètres de requête.
3. Implémenter les handlers et contrôleurs avec retour de codes HTTP adéquats.
4. Mettre en place le middleware ProblemDetails pour l'uniformité des erreurs.
5. Valider la conformité via la documentation interactive OpenAPI / Swagger.

# CHECKLIST
- [ ] Les URIs sont-elles orientées ressources (noms au pluriel, minuscules, tirets) ?
- [ ] Toutes les erreurs renvoient-elles un objet ProblemDetails conforme RFC 7807 ?
- [ ] Les endpoints de modification de ressources supportent-ils des tokens d'annulation (`CancellationToken`) ?
- [ ] Les collections supportent-elles une limitation de taille de page par défaut ?

# EXAMPLES
Exemple de réponse d'erreur RFC 7807 (ProblemDetails) :
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Une ou plusieurs erreurs de validation sont survenues.",
  "status": 400,
  "detail": "Les données de la requête ne respectent pas les règles de validation.",
  "instance": "/api/v1/orders",
  "errors": {
    "CustomerEmail": ["L'adresse email est invalide."]
  }
}
```