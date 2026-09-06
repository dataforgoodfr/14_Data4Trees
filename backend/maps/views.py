from django.http import JsonResponse
from django.contrib.auth.decorators import permission_required
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from . import stats
from .constants import LAYER_INVENTAIRE_FOR
from .datapackage_manager import DatapackageManager
from .services.user_map import get_user_map

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
def my_map_view(request, subpath):

    return JsonResponse(get_user_map(request.user).handle_request(
            request.method,
            subpath,
            request.body,
        ))


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def dashboard_view(request, layer_id):
    data = get_user_map(request.user).handle_request(
            'POST',
            layer_id,
            request.body)

    if (layer_id == LAYER_INVENTAIRE_FOR):
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
