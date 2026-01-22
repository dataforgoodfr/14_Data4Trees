# FRONTEND ALL 4 TREES ![logo React](./src/assets/react.svg)

Ce projet suit est inspiré par l'architecture FSD sans toutefois respecter tous les principes car le site ne sera pas assez complexe pour cela.
Plus d'infos ici : [https://feature-sliced.github.io/documentation/docs/get-started/overview](https://feature-sliced.github.io/documentation/docs/get-started/overview)

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

## Autres commandes

- `npm run build` : package l'application pour la mise en production (dossier [dist](./dist))
- `npm run preview` : Démarre le serveur à partir du build pour la production (dans le dist)
- `npm run check:arch` : Vérifier si les imports du projet respectent le principe de l'architecture FSD.
- `npm run arch:tree` : Génère un fichier text contenant l'arborescence du projet.