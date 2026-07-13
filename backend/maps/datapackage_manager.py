from tempfile import gettempdir
from typing import ClassVar
from pathlib import Path
from enum import Enum
import logging

import chardet

from rest_framework.response import Response
from rest_framework import status
from coordo.loaders import get_file_loader, KoboToolboxLoader


logger = logging.getLogger(__name__)


class LoaderMethod(str, Enum):
    ADD = "add"
    REMOVE = "remove"
    APPEND = "append"
    REPLACE = "replace"

class LoaderType(str, Enum):
    FILE = "file"
    KOBOTOOLBOX = "kobotoolbox"
    

class DatapackageManager:

    # fields needed for instantiation of all loaders
    COMMON_LOADER_INIT_FIELDS: ClassVar[dict[str, dict]] = {
        "resource_type": {"type": str, "optional": False},
        "package": {"type": str, "optional": False},
        "options": {"type": str, "optional": True},
    }
    # fields needed for the loader method to call (add, remove, append, update)
    LOADER_METHOD_FIELDS: ClassVar[dict[LoaderMethod, dict[str, dict]]] = {
        LoaderMethod.ADD: {},
        LoaderMethod.REMOVE: {},
        LoaderMethod.APPEND: {
            "resource": {"type": str, "optional": True}
        },
        LoaderMethod.REPLACE: {
            "resource": {"type": str, "optional": True}
        },
    }

    LOADER_METHOD_TO_RESPONSE: ClassVar[dict[LoaderMethod, str]] = {
        LoaderMethod.ADD: "Resource successfully added to datapackage",
        LoaderMethod.REMOVE: "Resource successfully removed from datapackage",
        LoaderMethod.APPEND: "File successfully appended to datapackage resource data",
        LoaderMethod.REPLACE: "File successfully replaced datapackage resource data",
    }


    def __init__(self, request):
        self.request = request
    

    def add_resources(self):
        return self._interact_with_datapackage(LoaderMethod.ADD)
    
        
    def remove_resources(self):
        return self._interact_with_datapackage(LoaderMethod.REMOVE)


    def append_data(self):
        return self._interact_with_datapackage(LoaderMethod.APPEND)
    
    
    def replace_data(self):
        return self._interact_with_datapackage(LoaderMethod.REPLACE)
    
        
    def _interact_with_datapackage(self, loader_method: LoaderMethod):
        """
        Method for modifying (adding / removing) a DataPackage resource using uploaded files.
        Expects a POST request with a body containing at least the 'resource_type', 'file' and 'package' fields.
        An optional field 'options' can also be provided.
        The uploaded file is saved temporarily in the system's temporary folder, processed and removed at the end.
        """
        self.check_user_authorizations()
        
        try:
            params = self.parse_params(loader_method)
        except ValueError as e:
            logger.exception(e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # getting keys to get in self.request.FILES
        file_keys = ["data"]
        if params["resource_type"] == LoaderType.KOBOTOOLBOX:
            file_keys.append("form")

        files = {}
        try:
            # getting all necessary files
            for file_key in file_keys:
                files[file_key] = self.get_file(file_key)
            
            try:
                # creating instance of loader
                if params["resource_type"] == LoaderType.KOBOTOOLBOX:
                    file_loader = KoboToolboxLoader(params["package"], files["data"], files["form"], **params.get("options", {}))
                else:
                    file_loader = get_file_loader(params["package"], files["data"], **params.get("options", {}))
                    
                # invoking specific method of laoder instance
                getattr(file_loader, loader_method)()
                
            except Exception as e:
                logger.exception(e)
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        finally:
            # in any case, delete the temporary files
            for file in files.values():
                file.unlink(missing_ok=True)
        
        return Response(
            {'message': self.LOADER_METHOD_TO_RESPONSE[loader_method], 'package': params["package"]},
            status=status.HTTP_200_OK
        )
    
    
    def check_user_authorizations(self):
        # authorization: ensure user has the custom add_data permission
        if not self.request.user.has_perm("users.add_data"):
            return Response(status=status.HTTP_403_FORBIDDEN)
    
    
    def get_file(self, key: str) -> Path:
        """
        Gets the uploaded file from the request object.
        Decode and re-encode the file as utf-8 to avoid downstream issues.
        Writes the file to a temporary file in the system's temporary folder.
        """
        try:
            uploaded_file = self.request.FILES[key]
        except KeyError:
            msg = f"No file provided with key '{key}'"
            logger.error(msg)
            return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)
    
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

    
    @staticmethod
    def check_param_type(value, type_):
        if not isinstance(value, type_):
            raise TypeError(f"Invalid type: expected {type_}, got {type(value)}")
    
    
    def parse_params(self, loader_method: LoaderMethod) -> dict:
        """
        Parsing all fields needed for instantiating the loader
        """
        fields = self.COMMON_LOADER_INIT_FIELDS | self.LOADER_METHOD_FIELDS[loader_method]
        params = {}
        try:
            for key, field_properties in fields.items():
                type_ = field_properties["type"]
                is_optional = field_properties["optional"]
                if is_optional:
                    value = self.request.POST.get(key)
                else:
                    value = self.request.POST[key]
                if value is not None:
                    self.check_param_type(value, type_)
                    params[key] = value
            return params
        except (KeyError, TypeError) as e:
            msg = (
                f"Invalid request format. Mandatory fields: {', '.join([f'{field} (type {str(type_)})' for field, type_ in fields.items()])}. "
                f"Entountered error with: {str(e)}"
            )
            raise ValueError(msg)