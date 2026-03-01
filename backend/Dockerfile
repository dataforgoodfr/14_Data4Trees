FROM python:3.14-slim-bookworm

RUN apt-get update && \
    apt-get install -y \
        git

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

RUN python manage.py migrate && \
    python manage.py createsuperuser --noinput --username john --email john.doe@example.com


EXPOSE 8000
