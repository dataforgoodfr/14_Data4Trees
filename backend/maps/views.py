import json

from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

config_path = settings.BASE_DIR / "data" / "config.json"
parser = Map.from_file(config_path)


def style_json(request):
    return JsonResponse(parser.get_maplibre_style())


@csrf_exempt
def map_data(request, layer_id):
    filters = None
    if request.method == "POST" and request.body:
        filters = json.loads(request.body.decode("utf-8"))
    geojson = parser.get_data(layer_id, filters)
    return JsonResponse(geojson)
