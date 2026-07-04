from django.conf import settings
from django.contrib.auth.decorators import permission_required
import pandas as pd
import json
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

catalog_path = settings.BASE_DIR / "catalog"


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def catalog_view(request, layer_id, resource_name):

    # authorization: ensure user has the custom add_data permission
    if not request.user.has_perm("users.view_data"):
        return Response(status=status.HTTP_403_FORBIDDEN)

    target_path = catalog_path / f"{layer_id}" / f"{resource_name}.parquet"
    df = pd.read_parquet(target_path)
    return Response(json.loads(df.to_json(orient="records")))