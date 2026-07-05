from tempfile import gettempdir
from pathlib import Path

import chardet

from django.http import JsonResponse
from coordo.loaders import get_file_loader



def add_resource(request):
    return modify_resource(request, "remove", "Resource successfully added to datapackage")

    
def remove_resource(request):
    return modify_resource(request, "remove", "Resource successfully removed from datapackage")

    
def modify_resource(request, action: str, response_message: str):
    """
    View for modifying (adding / removing) a DataPackage resource using an uplodaed file.
    Expects a POST request with a body containing the 'file' and 'package' fields.
    An optional field 'options' can also be provided.
    The uploaded file is saved temporarily in the system's temporary folder, processed and removed at the end.
    """
    file = get_data_file(request)
    try:
        try:
            package = Path(request.POST["package"])
            options: dict = request.POST.get("options", {})
        except KeyError:
            return JsonResponse(
                {"error": "Invalid request format. The request must contain at least the 'package' field."}, 
                status=400
            )

        try:
            file_loader = get_file_loader(package, file, **options)
            if action == "add":
                file_loader.add()
            elif action == "remove":
                file_loader.remove()
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    finally:
        # in any case, delete the temporary file
        file.unlink(missing_ok=True)
    
    return JsonResponse({
            'message': response_message,
            'filename': file.name,
            'package': package
        })


def append_data(request):
    return update_data(request, "append", "File successfully appended to datapackage resource data")


def replace_data(request):
    return update_data(request, "replace", "File successfully replaced datapackage resource data")


def update_data(request, action: str, response_message: str):
    """
    View for updating data from a file to a resource of a DataPackage.
    Expects a POST request with a body containing the 'file' and 'package' fields.
    Another optional body field, named 'resource', allows specifying the target resource in case it is different from the file stem.
    The uploaded file is saved temporarily in the system's temporary folder, processed and removed at the end.
    """
    file = get_data_file(request)
    try:
    
        try:
            package = Path(request.POST["package"])
            options: dict = request.POST.get("options", {})
            target_resource_name: str = request.POST.get("resource", None)
        except KeyError:
            return JsonResponse(
                {"error": "Invalid request format. The request must contain at least the 'package' field."},  
                status=400
            )

        try:
            file_folder = get_file_loader(package, file, **options)
            # find method of the file_folder with name 'method_name' 
            # and execute it with the appropriate arguments
            if action  == "append":
                file_folder.append(target_resource_name)
            elif action  == "replace":
                file_folder.replace(target_resource_name)
            else:
                raise ValueError(f"Invalid action name: {action}. It must be one of: 'append' or 'replace'")
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    finally:
        # in any case, delete the temporary file
        file.unlink(missing_ok=True)
    
    return JsonResponse({
            'message': response_message,
            'filename': file.name,
            'package': package
        })
    

def get_data_file(request) -> Path:
    """
    Gets the uplodaed file from the request object.
    Decode and re-encode the file as utf-8 to avoid downstream issues.
    Writes the file to a temporary file in the system's temporary folder.
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

    # save the file temporarily
    with open(temp_file, 'wb') as f:
        f.write(utf8_content)

    return temp_file