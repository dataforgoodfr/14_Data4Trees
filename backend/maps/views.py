import json

from coordo.config import MapConfig
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

config_path = settings.BASE_DIR / "data" / "config.json"
parser = MapConfig.from_file(config_path)


def style_json(request):
    return JsonResponse(parser.to_maplibre(base_url="/api/maps/layers"))


@csrf_exempt
def map_data(request, layer_id):
    filters = None
    if request.method == "POST" and request.body:
        filters = json.loads(request.body.decode("utf-8"))
    geojson = parser.get_data(layer_id, filters)
    return JsonResponse(geojson)
