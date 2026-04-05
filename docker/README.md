# Développement et déploiement


## Développement en local

Il est possible de déployer et de tester l'application localement en mode développement en utilisant `docker compose`.

>[!TIP]
>Pour installer `docker` (et `docker compose`), voir [Install Docker Engine](https://docs.docker.com/engine/install/)

Avant toute chose, il faut créer un fichier `.env` à la racine du projet, qui doit contenir:
```
S3_ACCESS_KEY_ID=<key id>
S3_SECRET_ACCESS_KEY=<access key>
```
La `key id` et l'`access key` sont à demander aux tech leads.

Il n'y a ensuite plus qu'à tout lancer avec:
```bash
docker compose -f docker/compose.yaml -f docker/compose.dev.yaml up
```

Vous pouvez accéder à l'application en tapant `http://localhost:5173/` dans la barre d'adresse de votre navigateur.

>[!TIP]
>Pour forcer le build complet des applications (si vous ajoutez une dépendance par exemple):
>```bash
>docker compose -f docker/compose.yaml -f docker/compose.dev.yaml up --build
>```

>[!TIP]
>Pour ne lancer que le backend:
>```bash
>docker compose -f docker/compose.yaml -f docker/compose.dev.yaml up backend
>```

>[!IMPORTANT]
>Si vous voulez vous conencter en tant qu'admin à l'application locale, le nom d'utilisateur ainsi que le mot de passe sont >dans l'[entrypoint](./backend/entrypoint.sh#L8).


## Environnement de staging

### Déploiement

Data4Good utilise [Coolify](https://coolify.io/) pour le déploiement de ses applications en mode staging. Si vous avez un compte sur le Coolify de Data4Good, vous pouvez accéder à la [configuration de l'application de staging de Data4Trees](https://coolify.services.d4g.fr/project/j00ocs0s48wcwsos4so04kck/environment/rkw0kk88808wow0sow0owc8w/application/d00kogcs8kggc088wk0ss8ks).

>[!NOTE]
>Si vous avez besoin de tester votre code sur l'environnement staging, vous pouvez contacter Ronan pour qu'il vous crée un compte.

Le déploiement de staging va utiliser les fichiers `docker/compose.yaml` et `docker/compose.staging.yaml`.
L'application de staging est disponible à l'adresse: [https://data4trees.services.d4g.fr/](https://data4trees.services.d4g.fr/).

### Session admin

Un utilisateur superadmin est créé automatiquement à chaque démarrage de l'application. Vous pouvez demander les credentials associés aux tech leads.
