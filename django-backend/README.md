Django Backend API
====================

This API is the backend side of a simple dashboarding app.

Endpoints
------------

- `http://localhost:8000/admin`: default django endpoint only accessible as an admin user.
- `http://localhost:8000/admin/clients`: endpoint only visible to admin users. Return a paginated list of clients in json format.
- `http://localhost:8000/api/clients/`: endpoint used to search for specific clients. Can also return the paginated list of all clients like `admin/clients` endpoint. This unsecure  behavior should be fixed by adding user authentication. List of possible query params:
    - `?id=<int:pk>`: retrieve the client with id equal to `pk` value
    - `?full_name=<string:name>`: retrieve clients whose full name is equal to `name` value
    - `?search=<string:query>`: search for clients whose full name contains `query` value
- `http://localhost:8000/api/consumption/`: endpoint used to search for clients' electrical consumption. If used without a query, will return all the all clients' consumption entries in a paginated way. To get a specific client's consumption, add the following query parameter:
    - `?client_id=<int:client_id>`: will return the paginated list of all consumption entries for the client with id equal to `client_id`


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
