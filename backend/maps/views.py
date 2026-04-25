from django.http import HttpResponseBadRequest

from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import numpy as np

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

def weighted_mean_std(series, weights):
    mask = series.notna() & weights.notna()
    x = series[mask].astype(float)
    w = weights[mask].astype(float)

    if len(x) == 0:
        return {"value": None, "error": None}

    mean = np.average(x, weights=w)
    variance = np.average((x - mean) ** 2, weights=w)
    std = np.sqrt(variance)

    return {"value": mean, "error": std}

def dashboard_view(request, layer_id):
    data = map.handle_request(
            'POST',
            layer_id,
            request.body)

    if (layer_id == "inventaire"):
        df = pd.DataFrame([feat.get("properties", {}) for feat in data["features"]])

        weights_map = {"1": 1092, "2": 752, "3": 775, "4": 41}
        df["weight"] = df["for"].map(weights_map)

        fields_to_drop = ["for", "cod", "weight"]
        numeric = df.drop(columns=fields_to_drop, errors="ignore").apply(pd.to_numeric, errors="coerce")

        result = {
            col: weighted_mean_std(numeric[col], df["weight"])
            for col in numeric.columns
        }

        return JsonResponse(result)
    
    return HttpResponseBadRequest(f'Layer "{layer_id}" not yet supported', status=501)

