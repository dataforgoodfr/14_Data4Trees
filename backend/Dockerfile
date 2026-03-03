FROM python:3.14-slim-bookworm

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    gdal-bin \
    libgdal-dev \
    libsqlite3-mod-spatialite && \
    rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

ARG DJANGO_SUPERUSER_EMAIL=john.doe@example.com
ARG DJANGO_SUPERUSER_PASSWORD=doe

RUN python manage.py migrate && \
    python manage.py createsuperuser --noinput --username john


EXPOSE 8000
