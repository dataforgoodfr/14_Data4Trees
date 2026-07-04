from pathlib import Path
from tempfile import gettempdir

from coordo.loaders import FileLoader, ResourceAction
from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

import chardet

from . import stats

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
def add_data_view(request):
    """
    View for adding a file to a DataPackage.
    Expects a POST request with a body containing the 'file', 'package' and 'action' fields.
    The uploaded file is saved temporarily in the system's temporary folder, processed and removed at the end.
    """

    # authorization: ensure user has the custom add_data permission
    if not request.user.has_perm("users.add_data"):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
       
    uploaded_file = request.FILES['file']
    temp_file = Path(gettempdir()) / uploaded_file.name

    # get file content
    file_content = uploaded_file.read()
    
    # detect the encoding using chardet, decode the content and re-encode as UTF-8
    encoding_info = chardet.detect(file_content)
    detected_encoding = encoding_info['encoding']
    decoded_content = file_content.decode(detected_encoding)
    utf8_content = decoded_content.encode('utf-8')

    try:
        # save the file temporarily
        with open(temp_file, 'wb') as f:
            f.write(utf8_content)
    
        try:
            package = Path(request.POST["package"])
            action = request.POST["action"]
        except KeyError:
            return Response(
                {"error": "Invalid request format. The request must contain the 'package' and 'action' fields."}, 
                status=status.HTTP_400_BAD_REQUEST,
            )
    
        if action not in ResourceAction:
            return Response(
                {"error": "Invalid action. The action must be one of: " + ", ".join(ResourceAction)}, 
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            FileLoader(package, temp_file, action).etl()
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    finally:
        # in any case, delete the temporary file
        temp_file.unlink(missing_ok=True)
    
    return Response({
        'message': 'File uploaded successfully',
        'filename': uploaded_file.name,
    }, status=status.HTTP_200_OK)
    