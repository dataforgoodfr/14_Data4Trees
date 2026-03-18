import json

from coordo.map import Map as MapConfig
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

config_path = settings.BASE_DIR / "data" / "config.json"
parser = MapConfig.from_file(config_path)

#Quick fix to be able to filter on map but will need to modify coordo/map/datapackage.py 
def style_json(request):
    style = parser.get_maplibre_style()
    base_url = request.build_absolute_uri("/api/maps/layers/")
    for layer in style["layers"]:
        if "metadata" in layer and "schema" in layer["metadata"]:
            layer["metadata"]["url"] = f"{base_url}{layer['id']}"
    return JsonResponse(style)


@csrf_exempt
def map_data(request, layer_id):
    filters = None
    if request.method == "POST" and request.body:
        filters = json.loads(request.body.decode("utf-8"))
    geojson = parser.get_layer_data(layer_id, filters)
    return JsonResponse(geojson)
