# Contexte Général du Projet (project-context.md)

Fiche d'identité technique et métier du projet. Ce document doit être renseigné et placé à la racine du projet applicatif (ex: `.antigravity/project-context.md`) pour guider l'orchestration des agents.

---

## 1. Informations Générales
- **Nom du Projet** : [Nom du système ou de l'application]
- **Description** : [Résumé en 2-3 phrases de la raison d'être du projet]
- **Objectif Principal** : [Problème métier résolu ou valeur délivrée]
- **Utilisateurs Cibles** : [Personas : grand public, administrateurs, opérateurs internes]

---

## 2. Stack Technologique

### Backend
- **Langage / Runtime** : C# 12 / .NET 8 (ou .NET 9)
- **Framework Web** : ASP.NET Core Web API (Controllers / Minimal APIs)
- **ORM / Accès Données** : Entity Framework Core 8/9 / Dapper pour requêtes de reporting
- **Validation** : FluentValidation
- **Logging** : Serilog avec enrichissement structuré et format JSON

### Frontend
- **Framework** : React 18 (ou 19)
- **Langage** : TypeScript en mode `strict: true`
- **Styling** : Tailwind CSS
- **Gestion d'État Serveur** : TanStack Query (React Query)
- **Formulaires** : React Hook Form avec Zod
- **Routage** : React Router v6+

### Base de Données (Par Défaut)
- **Moteur Principal** : PostgreSQL 16+
- **Driver / Provider** : Npgsql / Npgsql.EntityFrameworkCore.PostgreSQL
- **Gestion des Migrations** : EF Core Migrations / DbUp
- **Extensions Utilisées** : `uuid-ossp` ou `pgcrypto` (`gen_random_uuid()`), `pg_stat_statements`

---

## 3. Architecture Logicielle
- **Pattern Général** : Clean Architecture / Vertical Slice Architecture
- **Découpage des Projets** :
  - `src/Domain/` : Entités, Value Objects, Enums, Exceptions métier
  - `src/Application/` : Use cases, Commands, Queries, Handlers, DTOs, Interfaces
  - `src/Infrastructure/` : DbContext, configurations PostgreSQL, clients HTTP externes
  - `src/WebApi/` : Contrôleurs REST, middlewares, Program.cs
  - `src/Client/` : Application React / TypeScript

---

## 4. API & Échanges
- **Style Architectural** : RESTful conforme RFC
- **Format d'Erreur** : RFC 7807 (ProblemDetails)
- **Documentation** : OpenAPI v3 / Swagger UI accessible sur `/swagger`
- **Pagination** : Paramètres `pageNumber` et `pageSize` obligatoires sur les listes

---

## 5. Sécurité & Authentification
- **Mécanisme d'Authentification** : [Cookie d'authentification HttpOnly/SameSite OU Bearer JWT]
- **Politique d'Autorisation** : RBAC (Role-Based Access Control) ou Policy-Based Authorization
- **Gestion des Secrets** : `dotnet user-secrets` en local, variables d'environnement en production
- **Protection des Données** : Chiffrement SSL/TLS forcé, HSTS activé

---

## 6. Stratégie de Testing
- **Tests Unitaires** : xUnit, FluentAssertions, Moq/NSubstitute
- **Tests d'Intégration** : WebApplicationFactory avec Testcontainers PostgreSQL
- **Tests Frontend** : Vitest, React Testing Library
- **Tests E2E** : Playwright (parcours critiques)

---

## 7. Environnement & Déploiement
- **Conteneurisation** : Docker multi-stage builds
- **Orchestration Locale** : Docker Compose (`docker-compose.yml`)
- **CI/CD** : GitHub Actions (`.github/workflows/ci.yml`)
- **Sondes de Santé** : `/healthz` (Liveness) et `/healthz/ready` (Readiness)