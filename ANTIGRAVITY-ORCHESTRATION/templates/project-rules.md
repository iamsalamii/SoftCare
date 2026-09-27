# Règles Spécifiques du Projet (project-rules.md)

Ce document consigne les conventions, exigences non négociables et interdits techniques propres à votre projet ou entreprise.

---

## 1. Conventions de Code et de Nommage
- **C# / .NET** :
  - Classes, Records, Méthodes, Propriétés : `PascalCase`
  - Champs privés : `_camelCase`
  - Interfaces : Préfixées par `I` (`IOrderService`)
  - Types immuables par défaut pour les DTOs (`public sealed record ...`)
  - Zéro warning toléré à la compilation (`<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`).
- **TypeScript / React** :
  - Fichiers composants : `PascalCase.tsx`
  - Fichiers utilitaires, hooks : `camelCase.ts` (`useOrderData.ts`)
  - Interdiction absolue de l'utilisation du mot-clé `any`.
  - Pas de CSS personnalisé inline : Tailwind CSS obligatoire.
- **PostgreSQL** :
  - Noms de tables : pluriel, minuscules, `snake_case` (ex: `order_items`).
  - Clés primaires : UUIDv4 nommées `id`.
  - Timestamps : Toujours `TIMESTAMPTZ` avec valeur par défaut `now()`.

---

## 2. Règles Métier & Invariants Absolus
- [Règle Métier 1 : ex: Une commande validée ne peut plus voir ses lignes d'articles modifiées.]
- [Règle Métier 2 : ex: Le solde d'un compte client ne peut jamais être inférieur à zéro.]
- [Règle Métier 3 : ex: Tout changement d'adresse email nécessite une confirmation par lien signé.]

---

## 3. Exigences d'Architecture
- La couche `Domain` ne doit référencer aucun package tiers lié à l'infrastructure.
- Aucun contrôleur d'API ne doit accéder directement au `DbContext` sans passer par la couche Application.
- Les entités de base de données ne doivent jamais être renvoyées directement en JSON aux clients.

---

## 4. Exigences de Sécurité
- Tous les formulaires et mutations d'état doivent être protégés contre les failles CSRF.
- Tout accès aux données privées d'un utilisateur doit valider formellement son appartenance (contrôle anti-IDOR).
- Aucun mot de passe ou secret ne doit jamais apparaître dans les logs applicatifs.