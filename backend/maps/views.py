from pathlib import Path
from tempfile import gettempdir

from coordo.loaders import FileLoader, ResourceAction
from coordo.map import Map
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import permission_required
import chardet

from . import stats

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

    if (layer_id == "inventaire"):

        result = stats.compute_aggregation(data)

        return JsonResponse(result)
    
    return HttpResponseBadRequest(f'Layer "{layer_id}" not yet supported', status=501)

@require_POST
@permission_required("users.add_data")
def add_data_view(request):
    """
    View for adding a file to a DataPackage.
    Expects a POST request with a body containing the 'file', 'package' and 'action' fields.
    The uploaded file is saved temporarily in the system's temporary folder, processed and removed at the end.
    """
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file provided'}, status=400)
        
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
            FileLoader(package, temp_file, action).etl()
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    finally:
        # in any case, delete the temporary file
        temp_file.unlink(missing_ok=True)
    
    return JsonResponse({
            'message': 'File uploaded successfully',
            'filename': uploaded_file.name
        })
    