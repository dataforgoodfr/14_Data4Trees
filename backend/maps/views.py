from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import permission_required


from . import stats, user_data

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

    if (layer_id == "inventaire_for"):

        result = stats.compute_aggregation(data)

        return JsonResponse(result)
    
    return HttpResponseBadRequest(f'Layer "{layer_id}" not yet supported', status=501)


@require_POST
@permission_required("users.add_data")
def add_resource_from_file_view(request):
    """
    View for adding a file (creating the corresponding resource(s)) to a DataPackage.
    Expects a POST request with a body containing the 'file', 'package' fields.
    The body can also contain a 'options' field.
    """
    return user_data.add_resource(request)


@require_POST
@permission_required("users.add_data")
def remove_resource_from_file_view(request):
    """
    View for removing resource(s) cooresponding a file to a DataPackage.
    Expects a POST request with a body containing the 'file', 'package' fields.
    """
    return user_data.remove_resource(request)


@require_POST
@permission_required("users.add_data")
def append_file_data_to_datapackage_view(request):
    """
    View for appending the data contained in a file to the corresponding resources of a DataPackage.
    Expects a POST request with a body containing at least the 'file', 'package' fields.
    Optionally, a target resource name can be provided as a 'resource' field.
    """
    return user_data.append_data(request)


@require_POST
@permission_required("users.add_data")
def replace_datapackage_data_from_file_view(request):
    """
    View for removing the data contained in a file from the corresponding resources of a DataPackage.
    Expects a POST request with a body containing at least the 'file', 'package' fields.
    Optionally, a target resource name can be provided as a 'resource' field.
    """
    return user_data.replace_data(request)

    