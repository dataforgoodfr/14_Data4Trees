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

    df = pd.DataFrame([feat.get("properties", {}) for feat in data["features"]])

    # keys we want to drop from the dataframe before converting to numeric, as they are not relevant for the statistics
    fieldToDrop = ["for", "cod"]

    numeric = df.drop(columns=fieldToDrop, errors="ignore").apply(pd.to_numeric, errors="coerce")
    stats = pd.DataFrame({
        "mean": numeric.mean(numeric_only=True).round(2),
        "std": numeric.std(numeric_only=True).round(2),
    })
    return JsonResponse(stats.to_dict())

