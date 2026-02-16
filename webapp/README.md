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
- `npm run check:code` : Applique les 3 commandes de vérification de code: Linter, TS Compiler, Formatter.
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
