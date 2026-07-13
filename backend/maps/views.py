from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.decorators import permission_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from . import stats
from .datapackage_manager import DatapackageManager

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
@permission_required("users.add_data")
def add_resources_view(request):
    """
    View for adding a file / Kobotoolbox files (creating the corresponding resource(s)) to a DataPackage.
    """
    return DatapackageManager(request).add_resources()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@permission_required("users.delete_data")
def remove_resources_view(request):
    """
    View for removing resource(s) corresponding to a file / Kobotoolbox files in a DataPackage.
    """
    return DatapackageManager(request).remove_resources()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@permission_required("users.change_data")
def append_data_view(request):
    """
    View for appending the data contained in a file / Kobotoolbox file to the corresponding resources of a DataPackage.
    """
    return DatapackageManager(request).append_data()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@permission_required("users.change_data")
def replace_data_view(request):
    """
    View for removing the data contained in a file from the corresponding resources of a DataPackage.
    """
    return DatapackageManager(request).replace_data()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@permission_required("users.add_data")
def add_foreign_key_view(request):
    """
    View for adding a foreign key to a DataPackage.
    """
    return DatapackageManager(request).add_foreign_key()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@permission_required("users.add_data")
def remove_foreign_key_view(request):
    """
    View for adding a foreign key to a DataPackage.
    """
    return DatapackageManager(request).remove_foreign_key()