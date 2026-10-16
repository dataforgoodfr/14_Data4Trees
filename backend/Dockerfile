# syntax=docker/dockerfile:1

# Build stage: use the glibc-based DHI variant for the project's geospatial wheels.
FROM dhi.io/python:3.14-debian13-dev AS builder

# Prevent Python from buffering stdout/stderr so logs appear immediately.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN pip install --quiet --root-user-action=ignore uv
# Use copy mode since the cache and build filesystem are on different volumes.
ENV UV_LINK_MODE=copy

WORKDIR /app

# Install locked dependencies into a virtual environment.
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

COPY . .

RUN apt-get update && \
    apt-get install -y --no-install-recommends awscli bash make && \
    rm -rf /var/lib/apt/lists/*

RUN --mount=type=secret,id=S3_ACCESS_KEY_ID,env=S3_ACCESS_KEY_ID,required=true \
    --mount=type=secret,id=S3_SECRET_ACCESS_KEY,env=S3_SECRET_ACCESS_KEY,required=true \
    uv run --no-sync bash ./init-catalog.sh

RUN DJANGO_SECRET_KEY=build-only-not-for-runtime \
    uv run --no-sync python manage.py collectstatic --noinput && \
    mkdir -p /app/db && \
    chown -R 65532:65532 /app/catalog /app/db

# Runtime stage: minimal DHI image with no shell or package manager,
# already runs as the nonroot user.
FROM dhi.io/python:3.14-debian13

# Prevent Python from writing bytecode and buffering stdout/stderr.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
# Activate the virtual environment copied from the build stage.
ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Copy application files as root-owned and only grant write access to persistent data.
COPY . .
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder --chown=65532:65532 /app/catalog /app/catalog
COPY --from=builder --chown=65532:65532 /app/db /app/db
COPY --from=builder /app/static /app/static

USER 65532:65532

EXPOSE 8000

# Run Gunicorn as the production WSGI server.
CMD ["gunicorn", "all4trees.wsgi:application", "--bind", "0.0.0.0:8000"]