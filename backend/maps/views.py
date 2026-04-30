from django.http import HttpResponseBadRequest
from pathlib import Path
from tempfile import NamedTemporaryFile

from coordo.loaders import FileLoader, ResourceAction
from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import permission_required
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

@require_POST
@permission_required("users.add_data")
def add_data_view(request):
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file provided'}, status=400)
        
    uploaded_file = request.FILES['file']
    uploaded_file_suffix = Path(uploaded_file.name).suffix
    
    # NOTE: we do not use FileSystemStorage here, as it creates file name contanining both lower and upper case letters
    # but pydantic does not accept upper case letters in file names
    # furthermore, a temp file is more appropriate here because it is deleted automatically after context manager exits
    with NamedTemporaryFile(suffix=uploaded_file_suffix) as temp_file:
        temp_file.write(uploaded_file.read())
        file = Path(temp_file.name)
    
        try:
            package = Path(request.POST["package"])
            action = request.POST["action"]
        except KeyError:
            return JsonResponse(
                {"error": "Invalid request format. The request must contain the 'package' and 'action' fields."}, 
                status=400
            )
    
        if action not in ResourceAction:
            return JsonResponse(
                {"error": "Invalid action. The action must be one of: " + ", ".join(ResourceAction)}, 
                status=400
            )

        try:
            FileLoader(package, file, action).etl()
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({
            'message': 'File uploaded successfully',
            'filename': uploaded_file.name
        })
    