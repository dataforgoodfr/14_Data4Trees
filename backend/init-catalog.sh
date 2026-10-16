#!/usr/bin/env bash
set -euo pipefail

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

if [ -d "catalog" ]; then
    echo "Catalog directory already exists, skipping data loading."
else
    echo "Catalog directory does not exist, loading data."
    make catalog
fi