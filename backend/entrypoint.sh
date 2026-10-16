#!/usr/bin/env bash
set -euo pipefail

echo "Migrating database..."
python manage.py migrate
echo "Creating superuser..."
python manage.py createsuperuser --noinput
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
