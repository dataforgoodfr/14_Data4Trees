from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.decorators import permission_required
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import json

catalog_path = settings.BASE_DIR / "catalog"

@csrf_exempt
@permission_required("users.view_data")
def catalog_view(request, layer_id, resource_name):
    user = request.user

    print("User:", user)

    target_path = catalog_path / f"{layer_id}" / f"{resource_name}.parquet"
    df = pd.read_parquet(target_path)
    return JsonResponse(json.loads(df.to_json(orient="records")), safe=False)