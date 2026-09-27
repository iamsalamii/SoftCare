# PURPOSE
Surveiller en continu l'état de santé, la performance, les erreurs et les métriques des composants applicatifs et d'infrastructure.

# WHEN TO USE
- Pour assurer l'observabilité de tout système déployé en environnement de pré-production et production.

# PRINCIPLES
- **Les 3 Piliers de l'Observabilité** : Métriques (indicateurs chiffrés), Journaux (Logs structurés), Traces (chemins d'exécution distribués).
- **Logging Structuré** : Consigner les logs au format JSON avec propriétés requêtables (pas de simple texte brut).
- **Alertes Actionnables** : Déclencher une alerte uniquement si une action humaine immédiate est requise (éviter la fatigue d'alertes).

# BEST PRACTICES
- Injecter un identifiant de corrélation (`TraceId` / `CorrelationId`) dans chaque log pour suivre une requête de bout en bout.
- Configurer Serilog en ASP.NET Core pour formater les logs en JSON structuré.
- Exposer les métriques de runtime et d'application au format Prometheus.

# COMMON MISTAKES
- Enregistrer des volumes gigantesques de logs de niveau `Debug` en production sans filtre.
- Omettre de logger les exceptions complètes tout en masquant les causes d'erreur.
- Consigner des informations confidentielles ou des données personnelles (PII) dans les logs.

# WORKFLOW
1. Configurer le logging structuré dans `Program.cs`.
2. Enrichir les logs avec le contexte de la requête (TraceId, UserId, TenantId).
3. Exposer les endpoints de métriques et health checks.
4. Centraliser les logs dans un puits d'observabilité (OpenSearch, Grafana Loki, Datadog).
5. Configurer des tableaux de bord et alertes sur les taux d'erreurs 5xx.

# CHECKLIST
- [ ] Les logs sont-ils émis au format JSON structuré ?
- [ ] Les requêtes contiennent-elles un TraceId propagé entre le frontend et le backend ?
- [ ] Les métriques de temps de réponse et de taux d'erreur sont-elles visualisables ?

# EXAMPLES
Configuration de Serilog structuré en C# :
```csharp
builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "MyApi")
        .WriteTo.Console(new JsonFormatter());
});
```