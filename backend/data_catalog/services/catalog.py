
from django.conf import settings
from pathlib import Path

import pandas as pd

from rest_framework.exceptions import NotFound

CATALOG_PATH = settings.BASE_DIR / "catalog"

def get_resource(layer_id, resource_name):
    """
    Get the JSON representation of a resource from a DataPackage.
    """
    package_path = get_package_path(layer_id)
    resource_path = package_path / f"{resource_name}.parquet"

    if not Path(resource_path).exists():
        raise NotFound(f"Resource with name '{resource_name}' was not found in the package {layer_id}")

    return pd.read_parquet(resource_path)

def get_resource_path(layer_id, resource_name):
    package_path = get_package_path(layer_id)
    resource_path = package_path / f"{resource_name}.parquet"

    if not Path(resource_path).exists():
        raise NotFound(f"Resource with name '{resource_name}' was not found in the package {layer_id}")

    return resource_path

def get_package_path(layer_id):
    package_path = CATALOG_PATH / f"{layer_id}"

    if not Path(package_path).exists():
        raise NotFound(f"Package with name '{layer_id}' was not found in the catalog")

    return package_path