#!/usr/bin/env bash
set -euo pipefail

echo "Migrating database..."
uv run python manage.py migrate && uv run python manage.py collectstatic --clear --noinput
echo "Creating superuser..."
uv run python manage.py createsuperuser --noinput
echo "Starting server..."
uv run python manage.py runserver 0.0.0.0:8000
