# PURPOSE
Créer des composants réutilisables, modulaires, composables et facilement maintenables selon les principes de Clean Code et du Component-Driven Development.

# WHEN TO USE
- Bâtir la bibliothèque de composants ou assembler les pages d'une application React.

# PRINCIPLES
- **Séparation Conteneur / Présentation** : Séparer les composants intelligents (qui gèrent la donnée et l'état) des composants visuels purs (qui ne font qu'afficher des props).
- **Composition plutôt qu'Héritage** : Utiliser la composition (`children`, render props, slots) pour étendre les composants.
- **Single Responsibility** : Un composant ne doit accomplir qu'une tâche visuelle ou logique claire.

# BEST PRACTICES
- Rendre les composants de base configurables via des props de variants (ex: `variant="primary" | "secondary"`).
- Fournir des valeurs de repli (default props) cohérentes.
- Encapsuler les styles Tailwind avec des utilitaires de classes conditionnelles comme `clsx` ou `tailwind-merge`.

# COMMON MISTAKES
- Créer des "God Components" de 800 lignes mêlant appels réseau, formatage de données, formulaires et rendu graphique complexe.
- Faire passer des props sur 5 niveaux d'arborescence (Prop Drilling) au lieu d'utiliser la composition ou un Context ciblé.
- Forcer une réutilisabilité prématurée sur un composant utilisé à un seul endroit spécifique.

# WORKFLOW
1. Identifier la granularité du composant (Atom, Molecule, Organism ou View).
2. Définir l'interface minimale des `Props`.
3. Écrire le composant pur avec rendu statique et classes Tailwind.
4. Brancher la logique événementielle et les callbacks.
5. Documenter ou tester isolément le composant.

# CHECKLIST
- [ ] Le composant tient-il en moins de 150 lignes de code lisible ?
- [ ] Est-il utilisable sans dépendance cachée au contexte global de l'application ?
- [ ] Gère-t-il correctement la prop `className` externe via `twMerge` pour permettre l'extension de styles ?

# EXAMPLES
Composant de bouton composable et typé avec Tailwind :
```tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
  };

  return (
    <button
      className={twMerge(baseStyles, variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="mr-2 animate-spin">⏳</span> : null}
      {children}
    </button>
  );
};
```