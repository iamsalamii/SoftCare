# PURPOSE
Réduire le temps de latence aller-retour (Round Trip Time) et augmenter la capacité de traitement des APIs RESTful.

# WHEN TO USE
- Pour l'ensemble des endpoints publics ou inter-services exposés via HTTP.

# PRINCIPLES
- **Compression des Échanges** : Compresser systématiquement les payloads JSON avec Gzip ou Brotli.
- **Cache HTTP Normalisé** : Exploiter les en-têtes `Cache-Control`, `ETag` et `If-None-Match` pour éviter de renvoyer des données inchangées (304 Not Modified).
- **Projections Ciblées** : Renvoyer uniquement les attributs demandés plutôt que des graphes d'objets géants.

# BEST PRACTICES
- Activer la compression des réponses en ASP.NET Core (`AddResponseCompression` avec Brotli et Gzip).
- Mettre en œuvre la pagination obligatoire avec limites strictes sur le `pageSize` maximal (ex: max 100).
- Utiliser HTTP/2 ou HTTP/3 pour bénéficier du multiplexage de connexions.

# COMMON MISTAKES
- Retourner des payloads JSON de plusieurs mégaoctets contenant des données non consommées par l'interface.
- Oublier d'activer la compression HTTP pour les réponses `application/json`.
- Ne pas gérer les requêtes conditionnelles (`ETag`), obligeant le client à retélécharger l'intégralité du contenu à chaque appel.

# WORKFLOW
1. Mesurer la taille moyenne des payloads et le temps de réponse réseau.
2. Activer la compression Brotli/Gzip sur le serveur.
3. Mettre en place des DTOs allégés réduisant la charge utile au strict nécessaire.
4. Configurer la génération des en-têtes de cache ETag.
5. Vérifier la réduction du temps de transfert avec DevTools Network.

# CHECKLIST
- [ ] La compression des réponses Brotli/Gzip est-elle active ?
- [ ] Les endpoints de consultation supportent-ils les en-têtes ETag et renvoient-ils 304 ?
- [ ] Les listes sont-elles systématiquement paginées ?

# EXAMPLES
Configuration de la compression des réponses en ASP.NET Core :
```csharp
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
```