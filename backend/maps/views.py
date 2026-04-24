from django.http import HttpResponseBadRequest

from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

config_path = settings.BASE_DIR / "configs" / "config.json"
map = Map.from_file(config_path)

@csrf_exempt
def my_map_view(request, subpath):
    return JsonResponse(
        map.handle_request(
            request.method,
            subpath,
            request.body,
        )
    )

def dashboard_view(request, layer_id):
    data = map.handle_request(
            'POST',
            layer_id,
            request.body)

    if (layer_id == "inventaire"):
        df = pd.DataFrame([feat.get("properties", {}) for feat in data["features"]])

        # keys we want to drop from the dataframe before converting to numeric, as they are not relevant for the statistics
        fieldToDrop = ["for", "cod"]

        numeric = df.drop(columns=fieldToDrop, errors="ignore").apply(pd.to_numeric, errors="coerce")
        means = numeric.mean(numeric_only=True)
        stds = numeric.std(numeric_only=True)

        result = {
            key: {
                "value": None if pd.isna(means[key]) else means[key],
                "error": None if pd.isna(stds[key]) else stds[key],
            }
            for key in means.index
        }

        return JsonResponse(result)
    
    return HttpResponseBadRequest(f'Layer "{layer_id}" not yet supported', status=501)

