#!/usr/bin/env bash
set -euo pipefail

# Le marqueur est stocké dans le FS Bucket et persiste entre les exécutions.
if [ -f "catalog/.initialized" ]; then
    echo "Catalog already initialized, skipping."
    exit 0
fi

# TO REMOVE, just for backward compatibility with Coolify
if find catalog -type f -name '*.parquet' -print -quit 2>/dev/null | grep -q .; then
    echo "Existing catalog detected. Creating initialization marker."
    touch catalog/.initialized
    exit 0
fi

if [ -d "data" ]; then
    echo "Data directory already exists, skipping download from S3."
else
    : "${S3_ACCESS_KEY_ID:?S3_ACCESS_KEY_ID is required when data/ is missing}"
    : "${S3_SECRET_ACCESS_KEY:?S3_SECRET_ACCESS_KEY is required when data/ is missing}"
    echo "Data directory does not exist, downloading from S3."
    AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" \
    AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
    AWS_DEFAULT_REGION=fr-par \
    aws s3 sync s3://coordonnees-upload ./data \
        --delete \
        --endpoint-url https://s3.fr-par.scw.cloud \
        --region fr-par
fi

echo "Loading catalog."
mkdir -p catalog
make catalog

# Marquer l'initialisation uniquement si make catalog a réussi.
touch catalog/.initialized

echo "Catalog initialization completed."