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

Plus d'infos sur la gestion des tokens:
https://django-rest-framework-simplejwt.readthedocs.io/en/latest/index.html

Installation
------------

### Python environment

In order to launch the backend, you first need to set up the python virtual environment:
``` bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
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

### Données cartographiques

Le catalogue SpatiaLite (`data/catalog/inventaire_id/`) est déjà inclus dans le repo. Pour le regénérer à partir des fichiers Excel :

```bash
coordo load data/20250213_Inventaire_ID_QuestionnaireK.xlsx data/20251017_Inventaire_ID_Donnees.xlsx --output data/catalog/inventaire_id
```

### Launch the backend
--------------

Simply start the django server, and you're good to go !

``` bash
python manage.py runserver
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
