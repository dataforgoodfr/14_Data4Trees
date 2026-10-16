# Django Backend

Le backend est un projet django simple qui permettra une gestion des utilisateurs et de leurs permissions sur le site web.


Endpoints
------------

- `http://localhost:8000/admin`: interface d'administration par défaut de Django, permettant de gérer les utilisateurs et les groupes.
- `http://localhost:8000/admin/doc` : interface de documentation des applications installées sur Django.
- `http://localhost:8000/api/users`: permet de récupérer la liste des utilisateurs, nécessite d'être administrateur.
- `http://localhost:8000/api/groups`: permet de récupérer la liste des groupes., nécessite d'être administrateur.
- `http://localhost:8000/token`: permet de créer un token JWT à partir des identifiants de connexion d'un utilisateur.
- `http://localhost:8000/token/refresh`: permet de rafraîchir un token JWT.
- `http://localhost:8000/api/maps/style.json`: retourne le style MapLibre (configuration de la carte, sources et layers).
- `http://localhost:8000/api/maps/layers/<layer_id>`: retourne les données GeoJSON d'un layer. Supporte le POST avec un filtre CQL2-JSON.

>[!IMPORTANT]
>Si de nouveaux endpoints sont rajoutés, veuillez vérifier que leurs contextes racine sont bien dans la liste autorisée par Traefik pour l'application de staging.
>Cette liste est contenue dans le `PathRegexp(...)` dans le fichier [compose.staging.yaml](../docker/compose.staging.yaml#L7).

Plus d'infos sur la gestion des tokens:
https://django-rest-framework-simplejwt.readthedocs.io/en/latest/index.html

Installation
------------

### Python environment


The Docker build uses `pyproject.toml` and `uv.lock` as its dependency source. When changing dependencies, update those with `uv add`/`uv lock`

Install

``` bash
uv sync
```

### Coordo package

Coordo is declared in `pyproject.toml` and its resolved commit is recorded in `uv.lock`. To switch to a release tag or branch, replace `<tag-or-branch>` with the desired ref:

```bash
uv add "coordo @ git+https://github.com/dataforgoodfr/Coordonnees.git@<tag-or-branch>#subdirectory=coordo-py"
uv sync
```

To refresh a branch-based dependency to its latest commit, update the lock and reinstall Coordo:

```bash
uv lock --upgrade-package coordo
uv sync --reinstall-package coordo
```

To reinstall the currently locked Coordo commit without updating it:

```bash
uv sync --reinstall-package coordo
```

### Prepare the database

1. Migrate database tables into the database
```bash
python manage.py migrate
```

2. Create admin user
``` bash
python manage.py createsuperuser
```

### Map Data

To generate the data Catalog (`catalog/inventaire_id/`), first you must download data from our secured S3 storage server with the following command:

```bash
AWS_ACCESS_KEY_ID=<access_key_id> AWS_SECRET_ACCESS_KEY=<secret_access_key> aws s3 sync s3://coordonnees-upload ./data --delete --endpoint-url https://s3.fr-par.scw.cloud --region fr-par
```
You can get the keys from the Tech Leads.

Then generate the catalog using the Makefile. Note that it wont work if your folder catalog already exists, even if it is empty. Either remove it entirely or run only the commands you need.

```bash
make catalog
```

### Launch the backend
--------------

Simply start the django server, and you're good to go !

``` bash
python manage.py runserver
```

### Production Docker image

The production `Dockerfile` uses Docker Hardened Images and runs Gunicorn as UID 65532. Keep the deploy-time Django secret out of the image and provide it through `DJANGO_SECRET_KEY` in the deployment environment. Rotate the old hard-coded key before deploying.

The Docker builder installs AWS CLI, Bash, and Make, then runs `init-catalog.sh` to download source data and generate the catalog. Supply `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` to Compose when building; BuildKit mounts them only for that build step, so they are not stored in the image. The generated catalog is copied into the final image.

Run database migrations as a one-off deployment step before starting the new web image:

```bash
docker compose -f ../docker/compose.staging.yaml run --rm --no-deps backend python manage.py migrate
```

Create the administrator interactively after the service is running:

```bash
docker compose -f ../docker/compose.staging.yaml exec backend python manage.py createsuperuser
```

## Shared authentication between front and backend

We bridge JWT authentication (stateless) with Django session authentication (stateful).

### Strategy

Instead of trying to make Django Admin understand JWT directly, we:

1. Validate the JWT on the backend.
2. Create a Django session for that user.
3. Redirect to /admin/.

### Workflow

1. Frontend makes JWT authentication and gets a token
2. When requesting access to the admin, it calls /admin-session endpoint.
3. If the JWT token is valid, it creates a Django session for that user.
4. Because in the frontend we provide `credentials: "include"`, the Browser stores the `sessionid` cookie.
5. When /admin-session succeeds, the frontend can safely redirect to the Django admin page, with the `sessionid` cookie.

### Why cookie sharing is working

First, in `settings.py` we have

```py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

# Enable credentials (e.g., cookies) if needed
CORS_ALLOW_CREDENTIALS = True
```

Then, Cookie are shared the subdomains for a same domain with `SESSION_COOKIE_SAMESITE = "Lax"`.

:warning: When deploying to production, we'll need to ensure `SESSION_COOKIE_SECURE = True`.
