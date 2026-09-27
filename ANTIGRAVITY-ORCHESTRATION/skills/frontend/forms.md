# PURPOSE
Bâtir des formulaires réactifs, fiables, accessibles et sécurisés, gérant la validation de schémas côté client et fournissant un retour visuel instantané à l'utilisateur.

# WHEN TO USE
- Toute collecte de saisie utilisateur (authentification, création de commande, filtres de recherche).

# PRINCIPLES
- **Validation Déclarative de Schéma** : Définir les règles de validation au moyen d'un schéma unique (Zod).
- **Performance Non-Bloquante** : Éviter le re-rendu global de la page à chaque frappe de touche (champs non contrôlés optimisés via `react-hook-form`).
- **Feedback Immédiat et Accessible** : Afficher les erreurs de manière claire, associées aux champs via les attributs d'accessibilité adéquats.

# BEST PRACTICES
- Utiliser `react-hook-form` avec le resolver `@hookform/resolvers/zod`.
- Désactiver le bouton de soumission pendant le traitement pour éviter les doubles clics.
- Associer chaque input à son `<label>` via `htmlFor` et référencer les messages d'erreur avec `aria-describedby`.

# COMMON MISTAKES
- Gérer les formulaires à la main avec de multiples `useState` causant des re-rendus massifs à chaque frappe.
- Se contenter de la validation HTML5 native sans schéma rigoureux en TypeScript.
- Oublier d'afficher les messages d'erreur renvoyés par l'API backend après soumission.

# WORKFLOW
1. Définir le schéma Zod et inférer le type TypeScript (`z.infer<typeof schema>`).
2. Initialiser le hook `useForm` avec le resolver Zod.
3. Structurer le JSX avec les balises de formulaire et classes Tailwind.
4. Brancher la mutation asynchrone lors du `onSubmit`.
5. Mapper les erreurs de validation serveur (ProblemDetails) dans le formulaire si applicable.

# CHECKLIST
- [ ] Le schéma Zod valide-t-il les types, longueurs et formats (email, regex) ?
- [ ] Tous les inputs sont-ils munis d'un label explicite et d'un état d'erreur accessible ?
- [ ] Le formulaire bloque-t-il les soumissions concurrentes (`isSubmitting`) ?

# EXAMPLES
Formulaire typé avec React Hook Form et Zod :
```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Format d’adresse email invalide.'),
  password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await authenticate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Mot de passe</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
      </button>
    </form>
  );
};
```