# PURPOSE
Concevoir l'ergonomie des formulaires pour maximiser le taux de complétion, réduire les erreurs de saisie et offrir une expérience utilisateur agréable et sans friction.

# WHEN TO USE
- Lors de la conception de toute interface de saisie ou de configuration de données.

# PRINCIPLES
- **Clarté & Simplicité** : Ne demander que les informations strictement nécessaires.
- **Guidage & Feedback Immédiat** : Rassurer l'utilisateur, expliquer les contraintes de saisie avant l'erreur et valider en temps opportun.
- **Regroupement Logique** : Découper les formulaires longs en étapes progressives (Wizard / Multi-step) ou en sections thématiques distinctes.

# BEST PRACTICES
- Placer les étiquettes (`<label>`) au-dessus des champs de saisie pour une meilleure lisibilité mobile.
- Utiliser le bon type d'input HTML (`type="email"`, `type="tel"`, `type="number"`, `inputMode="numeric"`) pour faire apparaître le clavier adapté sur smartphone.
- Sauvegarder automatiquement l'état ou avertir avant de quitter un formulaire en cours de remplissage.

# COMMON MISTAKES
- Remplacer les étiquettes visibles par de simples placeholders qui disparaissent dès la première frappe.
- Réinitialiser l'ensemble des champs du formulaire dès qu'une seule erreur survient côté serveur.
- Disposer les boutons d'action de manière déroutante (ex: mettre le bouton "Annuler" plus visible que le bouton "Valider").

# WORKFLOW
1. Lister les données à collecter et éliminer les champs superflus.
2. Structurer l'ordre des champs du plus simple au plus engageant.
3. Rédiger les textes d'aide contextuelle et exemples de saisie.
4. Définir les messages d'erreur clairs et bienveillants.
5. Valider le parcours sur mobile et desktop.

# CHECKLIST
- [ ] Chaque champ dispose-t-il d'un label visible en permanence ?
- [ ] Le type d'input déclenche-t-il le clavier virtuel adéquat sur mobile ?
- [ ] Le bouton d'action principal est-il mis en avant visuellement ?

# EXAMPLES
Structure ergonomique d'un champ avec aide contextuelle :
```tsx
<div className="space-y-1">
  <label htmlFor="username" className="block text-sm font-medium text-slate-800">
    Nom d'utilisateur
  </label>
  <input
    id="username"
    type="text"
    aria-describedby="username-help"
    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
  />
  <p id="username-help" className="text-xs text-slate-500">
    Doit comporter entre 3 et 20 caractères alphanumériques.
  </p>
</div>
```