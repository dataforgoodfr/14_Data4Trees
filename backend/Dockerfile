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

ENTRYPOINT [ "./entrypoint.sh" ]

EXPOSE 8000
