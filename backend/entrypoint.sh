#!/usr/bin/env bash
python manage.py migrate
python manage.py createsuperuser --noinput
python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000
