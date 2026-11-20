#!/usr/bin/env bash
set -euo pipefail

echo "Migrating database..."
python manage.py migrate
echo "Creating superuser..."
python manage.py shell -c '
import os
from django.contrib.auth import get_user_model
from django.core.management import call_command

user_model = get_user_model()
username = os.environ["DJANGO_SUPERUSER_USERNAME"]
if not user_model.objects.filter(**{user_model.USERNAME_FIELD: username}).exists():
	call_command("createsuperuser", interactive=False)
else:
	print(f"User {username!r} already exists; skipping superuser creation.")
'
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
