
# SITE WEB ALL 4 TREES

![Logo All4Trees](./webapp/src/assets/logo_all4trees.png)

Bienvenue sur le projet de la Saison 14 de DataForGood pour l'association All 4 Trees !

Le but de ce projet est de fournir un site web simple, élégant et efficace pour aider les équipes de bénévoles de l'association All 4 Trees à se coordonner, recueillir et visualiser les données récoltées sur le terrain.

Les données récoltées sur le terrain seront importées dans une base de données externes à ce projet. Voir [le dépôt Github Coordonnées](https://github.com/dataforgoodfr/Coordonnees).

Pour ce faire, le site web présentera :

- Une carte avec des points, chaque point correspondant à un site où des données ont été récoltées. 
- Un widget pour filtrer les points de la carte selon certains critères (localisation, catégorie, etc.).
- Un widget de Dashboard pour faire apparaître des graphiques permettant de visualiser les données liées à un ou plusieurs points de la carte.
- Un page de connexion avec gestion de l'authentification, pour permettre aux acteurs locaux de voir certaines données qui ne seront pas accessibles au grand public.

## Backend

Le Backend du site permettra de stocker les informations liées aux utilisateurs ayant accès aux données protégées.
Il est écrit en python avec le framework Django.

[Readme du Backend](./backend/README.md)

## Frontend 

Le Frontend est en ReactJS + Vite, dans le dossier [webapp](./webapp).

[Readme du Frontend](./webapp/README.md)

## Règles de collaboration :

- Aucun Push ne doit être fait directement sur main.
- Pour travailler sur une évolution du site, il vous faudra d'abord créer une branche et l'associer à une tâche du tableau Kanban.
- Pour plus de clarté et faciliter la collaboration, il serait préférable de nommer vos branches selon le format suivant:
`{votrePseudo}/{tâche}`, par exemple `arnaudfnr/gestion_auth`
- Lorsque votre code est prêt, il faudra créer une Pull Request avec une description claire et concise du code ajouté.
- La Pull Request sera ensuite revue par un autre dev, puis fusionnée avec la branche main une fois que les changements auront été validés.