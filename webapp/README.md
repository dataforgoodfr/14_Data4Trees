# FRONTEND ALL 4 TREES

## Prérequis:

- Avoir Node.js installé sur votre machine [voir comment faire](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm)

## Installer les packages

```
npm ci
```

## Démarrer le serveur

```
npm run dev
```

## Architecture

Ce projet suit est inspiré par l'architecture FSD sans toutefois respecter tous les principes car le site ne sera pas assez complexe pour cela.
Retrouvez toutes les explications et instructions de structure dans cette documentation: [FSD Architecture](./docs/fsd_architecture.md).

## Autres commandes

- `npm run build` : package l'application pour la mise en production (dossier [dist](./dist))
- `npm run preview` : Démarre le serveur à partir du build pour la production (dans le dist)
- `npm run check:arch` : Vérifie si les imports du projet respectent le principe de l'architecture FSD.
- `npm run check:code` : Applique les 3 commandes de vérification de code sans appliquer les correction: Linter, TS Compiler, Formatter.
- `npm run fix:code` : Applique les deux commandes permettant de corriger les éléments remontés avec la commande ce-dessus.
- `npm run arch:tree` : Génère un fichier text contenant l'arborescence du projet.
- `npm run compile` : Vérifie que TypeScript compile correctement
- `npm run format` : Applique le formattage de prettier à l'ensemble du projet
- `npm run format:check` : Détermine les fichiers où le formattage de prettier aurait des effets (fichiers non formattés correctement)
- `npm run lint` : Vérifie que le code ./src respecte les règles de Lint
- `npm run lint:fix` : Fix si possible les problèmes de Linter dans ./src
- `npm run translations:update`: Upload les fichiers de traductions vers public/locales, depuis lequel sont servis les fichiers de traduction

## Gérer les traductions (i18n - internationalization)

Les traductions sont gérées dans le dossier [shared/i18n](./src/shared/i18n/):

- le dossier `translations` contient les JSONs avec toutes les traductions.
- le fichier `config.ts` contient la configuration de `i18n` ainsi que la définition des langages supportées: français, anglais.
- le fichier `i18next.d.ts` nous permet d'avoir de l'autocomplétion typescript à l'utilisation de la fonction `t`.

Vous pouvez vous référrer au [README](./src/shared/i18n/README.md) du dossier pour comprendre

- comment i18n fonctionne
- comment ajouter une nouvelle traduction
- comment ajouter un nouveau language

### TL; DR

1. Ajouter votre traduction dans les fichiers JSONs.
2. Utiliser le hook `useTranslation` pour récupérer une fonction `t` de traduction. Il peut être utilisé dans un React Functional Component ou dans un custom hook

   ```tsx
   import { useTranslation } from "@shared/i18n";

   const MyComponent = () => {
     const { t } = useTranslation("translations");

     const myString = t("key.in.the.jsonFile");
     // ...
   };
   ```

## Gérer les tokens tailwind

1. Nous définissons des variables css qui correspondent à la charte graphique de l'association (`app/styles/all4trees.css`)

```css
:root {
  --color-nuit: #0f0f0f;
  --color-alabaster: #f5f4eb;
  --color-onyx: #424242;
  --color-vert-kelly: #54b025;
  ...
}
```

2. Nous utilitons ces variables css pour définir d'autres variables css à but métier: couleur primaire, couleur de texte par défaut, couleur de surface, ... Ces variables css métiers varient entre le light et le dark mode. Par exemple, le dark mode correpond à du texte clair sur un fond sombre, tandis que le light mode correspond à du texte foncé sur un fond clair.
   :warning: Certaines de ces variables ne sont pas nommées par hasard: elles correspondent aux [variables natives de ShadCN](https://ui.shadcn.com/docs/theming).

```css
:root {
  --foreground: var(--color-nuit);
  --background: var(--color-alabaster);
}

.dark {
  --foreground: var(--color-alabaster);
  --background: var(--color-nuit);
}
```

3. Enfin, nous créons dans le thème tailwind de nouveau tokens qui permettront d'utiliser ces variables métiers dynamiques.
   :warning: Contrairement à ce qui est indiqué dans [la documentation de theming de ShadCn](https://ui.shadcn.com/docs/theming), les variables css prédéfinies dans le système (foregound, background, primary, ...) ne sont pas automatiquement intégrées dans le thème tailwind (v4 tailwind). C'est pourquoi nous devons ajouter "manuellement" ces variables de couleur dans l'extension du thème.

```css
@theme {
  --color-primary: var(--color-vert-kelly);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
}
```

```tsx
className = "text-foreground hover:text-primary bg-background";
```

4. On peut ajouter bien d'autres variables dans le thème tailwind, dès lors qu'on respecte les conventions de namespace:
   > --color-_ Color utilities like bg-red-500, text-sky-300, and many more
   > --font-_ Font family utilities like font-sans
   > --text-_ Font size utilities like text-xl
   > --font-weight-_ Font weight utilities like font-bold
   > --tracking-_ Letter spacing utilities like tracking-wide
   > --leading-_ Line height utilities like leading-tight
   > --breakpoint-_ Responsive breakpoint variants like sm:_
   > --container-_ Container query variants like @sm:_ and size utilities like max-w-md
   > --spacing-_ Spacing and sizing utilities like px-4, max-h-16, and many more
   > --radius-_ Border radius utilities like rounded-sm
   > --shadow-_ Box shadow utilities like shadow-md
   > --inset-shadow-_ Inset box shadow utilities like inset-shadow-xs
   > --drop-shadow-_ Drop shadow filter utilities like drop-shadow-md
   > --blur-_ Blur filter utilities like blur-md
   > --perspective-_ Perspective utilities like perspective-near
   > --aspect-_ Aspect ratio utilities like aspect-video
   > --ease-_ Transition timing function utilities like ease-out
   > --animate-_ Animation utilities like animate-spin
