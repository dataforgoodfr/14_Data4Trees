from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import pandas as pd
from pandas import DataFrame
import json

catalog_path = settings.BASE_DIR / "catalog"


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def resource_view(request, layer_id, resource_name):

    # authorization: ensure user has the custom add_data permission
    if not request.user.has_perm("users.view_data"):
        return Response(status=status.HTTP_403_FORBIDDEN)

    target_path = catalog_path / f"{layer_id}" / f"{resource_name}.parquet"
    df = pd.read_parquet(target_path)
    return Response(json.loads(df.to_json(orient="records")))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def resource_list_view(request, layer_id):
    # authorization: ensure user has the custom add_data permission
    if not request.user.has_perm("users.view_data"):
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return Response(
            {"error": "Request body must be valid JSON"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    resource_list = payload.get("resources")
    if not isinstance(resource_list, list) or len(resource_list) < 1:
        return Response(
            {"error": "Body should contain a non-empty list of resource names"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    resources_payload = {}
    for resource_name in resource_list:
        target_path = catalog_path / f"{layer_id}" / f"{resource_name}.parquet"
        resource_df = pd.read_parquet(target_path)
        resources_payload[resource_name] = json.loads(resource_df.to_json(orient="records"))

    if not resources_payload:
        return Response({"error": "No parquet resources could be loaded"}, status=status.HTTP_404_NOT_FOUND)

    return Response(resources_payload)