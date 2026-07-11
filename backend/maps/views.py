from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from . import stats, datapackage_management

config_path = settings.BASE_DIR / "configs" / "config.json"
map = Map.from_file(config_path)


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

    return Response({
        "error": f'Layer "{layer_id}" not yet supported'
    }, status=status.HTTP_501_NOT_IMPLEMENTED)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_resource_from_file_view(request):
    """
    View for adding a file (creating the corresponding resource(s)) to a DataPackage.
    Expects a POST request with a body containing the 'file', 'package' fields.
    The body can also contain a 'options' field.
    """
    return datapackage_management.add_resource(request)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_resource_from_file_view(request):
    """
    View for removing resource(s) cooresponding a file to a DataPackage.
    Expects a POST request with a body containing the 'file', 'package' fields.
    """
    return datapackage_management.remove_resource(request)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def append_file_data_to_datapackage_view(request):
    """
    View for appending the data contained in a file to the corresponding resources of a DataPackage.
    Expects a POST request with a body containing at least the 'file', 'package' fields.
    Optionally, a target resource name can be provided as a 'resource' field.
    """
    return datapackage_management.append_data(request)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def replace_datapackage_data_from_file_view(request):
    """
    View for removing the data contained in a file from the corresponding resources of a DataPackage.
    Expects a POST request with a body containing at least the 'file', 'package' fields.
    Optionally, a target resource name can be provided as a 'resource' field.
    """
    return datapackage_management.replace_data(request)

    