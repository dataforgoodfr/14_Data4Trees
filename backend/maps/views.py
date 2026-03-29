from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
