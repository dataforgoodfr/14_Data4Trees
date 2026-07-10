from django.conf import settings
import json
import pandas as pd
from pathlib import Path

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response

catalog_path = settings.BASE_DIR / "catalog"


@api_view(['GET'])
def datapackage_view(request):
    layer_id = request.query_params.get('layer_id')

    if not layer_id:
        raise ValidationError("Missing query parameter 'layer_id'")

    datapackage_path = get_package_path(catalog_path, layer_id) / "datapackage.json"
    try:
        with open(datapackage_path, 'r') as f:
            data = json.load(f)
        return Response(data)
    except FileNotFoundError:
        raise NotFound(f"datapackage.json was not found in package {layer_id}")


@api_view(["GET"])
def resource_view(request, layer_id, resource_name):
    resource_path = get_resource_path(catalog_path, layer_id, resource_name)
    df = pd.read_parquet(resource_path)
    return Response(json.loads(df.to_json(orient="records")))


@api_view(["POST"])
def resource_list_view(request, layer_id):
    resource_list = parse_body(request.body)
    package_path = get_package_path(catalog_path, layer_id)

    resources_payload, results, errors = load_resources(layer_id, package_path, resource_list)
    if not resources_payload:
        raise NotFound({"error": "None of the resources could be loaded", "results": results})
    elif errors:
        return Response({"results": results}, status=status.HTTP_207_MULTI_STATUS)

    return Response(resources_payload)

def parse_body(body): 
    try:
        payload = json.loads(body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        raise ValidationError("Request body must be valid JSON")

    resource_list = payload.get("resources")
    if not isinstance(resource_list, list) or len(resource_list) < 1:
        raise ValidationError("Body should contain a non-empty list of resource names")

    return resource_list


def load_resources(layer_id, package_path, resource_list):
    resources_payload = {}
    results = []
    errors = False
    for resource_name in resource_list:
        resource_path = package_path / f"{resource_name}.parquet"
        if not Path(resource_path).exists():
            errors=True
            results.append(not_found_result(layer_id, resource_name))
            continue
        resource_df = pd.read_parquet(resource_path)
        resources_payload[resource_name] = json.loads(resource_df.to_json(orient="records"))
        results.append(ok_result(layer_id, resource_name))

    return resources_payload, results, errors

def get_resource_path(catalog_path, layer_id, resource_name):
    package_path = get_package_path(catalog_path, layer_id)
    resource_path = package_path / f"{resource_name}.parquet"

    if not Path(resource_path).exists():
        raise NotFound(f"Resource with name '{resource_name}' was not found in the package {layer_id}")

    return resource_path

def get_package_path(catalog_path, layer_id):
    package_path = catalog_path / f"{layer_id}"

    if not Path(package_path).exists():
        raise NotFound(f"Package with name '{layer_id}' was not found in the catalog")

    return package_path

def not_found_result(layer_id, resource_name):
    return {
        "uri": f"{layer_id} / {resource_name}",
        "status": status.HTTP_404_NOT_FOUND, 
        "reason": f"Resource with name '{resource_name}' was not found in the package {layer_id}"
    }

def ok_result(layer_id, resource_name):
    return {
        "uri":  f"{layer_id} / {resource_name}",
        "status": status.HTTP_200_OK
    }