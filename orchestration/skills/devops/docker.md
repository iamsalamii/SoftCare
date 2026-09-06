# PURPOSE
Conteneuriser les composants applicatifs pour garantir une parité stricte entre environnements de développement, de test et de production.

# WHEN TO USE
- Dès l'initialisation du projet pour packager le backend ASP.NET Core, le frontend React et orchestrer la base PostgreSQL.

# PRINCIPLES
- **Multi-Stage Builds** : Séparer l'étape de compilation (SDK lourd) de l'image d'exécution finale (Runtime minimal).
- **Principe du Moindre Privilège** : Ne jamais exécuter les processus dans le conteneur avec l'utilisateur `root`.
- **Images Légères & Épurées** : S'appuyer sur des images de base allégées (Alpine Linux ou distroless si compatible).

# BEST PRACTICES
- Épingler scrupuleusement les versions des images (`mcr.microsoft.com/dotnet/aspnet:8.0-alpine`, `postgres:16.4-alpine`).
- Placer les instructions qui changent rarement en tête de Dockerfile pour maximiser l'efficacité du cache de couches Docker.
- Configurer un fichier `.dockerignore` strict pour exclure `node_modules`, `bin/`, `obj/` et `.git`.

# COMMON MISTAKES
- Inclure le SDK de développement et les outils de compilation dans l'image finale de production.
- Exécuter le conteneur en tant que root, créant un risque majeur d'évasion de conteneur.
- Stocker les données de PostgreSQL dans le conteneur sans monter de volume persistant externe.

# WORKFLOW
1. Rédiger le `.dockerignore`.
2. Concevoir le `Dockerfile` multi-stage.
3. Assembler les services dans `docker-compose.yml`.
4. Tester le build local et le bon démarrage des conteneurs.
5. Intégrer la construction de l'image dans le pipeline CI.

# CHECKLIST
- [ ] L'image de production est-elle construite via un multi-stage build ?
- [ ] Le conteneur s'exécute-t-il sous un compte utilisateur non-root ?
- [ ] La persistance de PostgreSQL est-elle garantie par un volume nommé ?

# EXAMPLES
Dockerfile multi-stage pour une API ASP.NET Core :
```dockerfile
# Stage 1 : Compilation
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY ["src/MyApi/MyApi.csproj", "MyApi/"]
RUN dotnet restore "MyApi/MyApi.csproj"
COPY src/ .
WORKDIR "/src/MyApi"
RUN dotnet publish "MyApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2 : Image d'exécution légère
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "MyApi.dll"]
```