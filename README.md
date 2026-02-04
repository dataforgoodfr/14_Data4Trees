
# DATA 4 TREES 

<img src="./webapp/public/seed-logo.png" alt="Logo Seed" width="200"/>

![Logo All4Trees](./webapp/src/assets/logo_all4trees.png)

Bienvenue sur le projet de la Saison 14 de DataForGood pour les associations SEED et All 4 Trees !

Le but de ce projet est de fournir deux sites webs simples, élégants et efficaces pour aider les équipes de bénévoles des aassociation All 4 Trees et SEED à se coordonner, recueillir et visualiser les données récoltées sur le terrain.

Les données récoltées sur le terrain seront importées dans une base de données externes à ce projet. Voir [le dépôt Github Coordonnées](https://github.com/dataforgoodfr/Coordonnees).

Les sites web seront très similaires. Chacun d'eux présentera :

- Une carte avec des points, chaque point correspondant à un site où des données ont été récoltées. 
- Un widget pour filtrer les points de la carte selon certains critères (localisation, catégorie, etc.).
- Un widget de Dashboard pour faire apparaître des graphiques permettant de visualiser les données liées à un ou plusieurs points de la carte.
- Un page de connexion avec gestion de l'authentification, pour permettre aux acteurs locaux de voir certaines données qui ne seront pas accessibles au grand public.

Pour l'instant seul le site web d'All 4 Trees a été démarré :
 
## Backend

Le Backend du site permettra de stocker les informations liées aux utilisateurs ayant accès aux données protégées.
Il est écrit en python avec le framework Django.

[Readme du Backend](./backend/README.md)

## Frontend 

Le Frontend est en ReactJS + Vite, dans le dossier [webapp](./webapp).

[Readme du Frontend](./webapp/README.md)

## Règles de collaboration :

[Voir le guide de contribution](https://outline.services.dataforgood.fr/doc/onboarding-dev-dzWHb9O90Q)