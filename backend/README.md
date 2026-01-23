# Django Backend

Le backend est un projet django simple qui permettra une gestion des utilisateurs et de leurs permissions sur le site web.


Endpoints
------------

- `http://localhost:8000/admin`: interface d'administration par défaut de Django, permettant de gérer les utilisateurs et les groupes.
- `http://localhost:8000/users`: permet de récupérer la liste des utilsiateurs.
- `http://localhost:8000/groups`: permet de récupérer la liste des groupes.

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

2. Load data into the mysql database
``` bash
python manage.py loaddata db.json
```

3. Create admin user
``` bash
python manage.py createsuperuser
```

### Launch the backend
--------------

Simply start the django server, and you're good to go !

``` bash
python manage.py runserver
```
