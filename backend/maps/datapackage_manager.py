from tempfile import gettempdir
from typing import ClassVar
from pathlib import Path
from enum import Enum
import logging

import chardet

from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError, APIException
from rest_framework import status
from coordo.loaders import get_file_loader, KoboToolboxLoader, Loader


logger = logging.getLogger(__name__)


class DatapackageException(APIException):
    status_code = 500


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
        return self._handle_resources(LoaderMethod.ADD)
    
        
    def remove_resources(self):
        return self._handle_resources(LoaderMethod.REMOVE)


    def append_data(self):
        return self._handle_resources(LoaderMethod.APPEND)
    
    
    def replace_data(self):
        return self._handle_resources(LoaderMethod.REPLACE)


    def add_foreign_key(self):
        return self._handle_foreign_key(LoaderMethod.ADD)

    def remove_foreign_key(self):
        return self._handle_foreign_key(LoaderMethod.REMOVE)
    
        
    def _handle_resources(self, loader_method: LoaderMethod):
        """
        Method for modifying (adding / removing / append / replacing) a DataPackage resource using uploaded files.
        Expects a POST request with a body containing at least the 'resource_type', 'file' and 'package' fields.
        An optional field 'options' can also be provided.
        In case of append or replace, an optional field 'resource' can also be specified.
        The uploaded file is saved temporarily in the system's temporary folder, processed and removed at the end.
        """
        try:
            params = self.parse_params(loader_method)
        except ValueError as e:
            return ParseError(e)

        # getting keys to get in self.request.FILES
        file_keys = ["data"]
        if params["resource_type"] == LoaderType.KOBOTOOLBOX and loader_method in [LoaderMethod.ADD, LoaderMethod.REMOVE]:
            file_keys.append("form")

        files = {}
        try:
            # getting all necessary files
            for file_key in file_keys:
                files[file_key] = self.get_file(file_key)
            
            try:
                # creating instance of loader
                if params["resource_type"] == LoaderType.KOBOTOOLBOX:
                    if loader_method in [LoaderMethod.ADD, LoaderMethod.REMOVE]:
                        file_loader = KoboToolboxLoader(params["package"], files["data"], files["form"], **params.get("options", {}))
                    else:
                        file_loader = KoboToolboxLoader(params["package"], files["data"], **params.get("options", {}))
                else:
                    file_loader = get_file_loader(params["package"], files["data"], **params.get("options", {}))
                    
                # invoking specific method of laoder instance
                getattr(file_loader, loader_method)()
                
            except Exception as e:
                logger.exception(e)
                raise DatapackageException(e)
                
        finally:
            # in any case, delete the temporary files
            for file in files.values():
                file.unlink(missing_ok=True)
        
        return Response(
            {'message': self.LOADER_METHOD_TO_RESPONSE[loader_method], 'package': params["package"]},
            status=status.HTTP_200_OK
        )
    
    
    def get_file(self, key: str) -> Path:
        """
        Gets the uploaded file from the request object.
        Decode and re-encode the file as utf-8 to avoid downstream issues.
        Writes the file to a temporary file in the system's temporary folder.
        """
        try:
            uploaded_file = self.request.FILES[key]
        except KeyError:
            raise NotFound(f"No file provided with key '{key}'")

        temp_file = Path(gettempdir()) / uploaded_file.name

        # get file content
        file_content = uploaded_file.read()
        
        # detect the encoding using chardet, decode the content and re-encode as UTF-8
        encoding_info = chardet.detect(file_content)

        if detected_encoding := encoding_info['encoding'] is not None:
            decoded_content = file_content.decode(detected_encoding)
            logger.info(f"Encoding detected for {uploaded_file.name}: {detected_encoding}. Re-encoding as utf-8")
            reencoded_content = decoded_content.encode('utf-8')
        else:
            logger.info(f"Encoding not detected for {uploaded_file.name}, writing file content as it is.")
            reencoded_content = file_content
    
        # save the file temporarily
        with open(temp_file, 'wb') as f:
            f.write(reencoded_content)
    
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
                f"Error encountered: {str(e)}"
            )
            raise ValueError(msg)


    def _handle_foreign_key(self, loader_method: LoaderMethod):
        """
        Method for modifying (adding / removing) a DataPackage foreign key.
        Expects a POST request with a body containing at least the 'package', 'from' and 'to' fields.
        """
        package = self.request.POST["package"]
        from_ = self.request.POST["from"]
        to = self.request.POST["to"]
        
        if loader_method == LoaderMethod.ADD:
            Loader.add_foreign_key(package, from_, to)
        elif loader_method == LoaderMethod.REMOVE:
            Loader.remove_foreign_key(package, from_, to)
        else:
            raise DatapackageException(f"Unhandled method {loader_method} for foreign keys.")

        return Response(
            {'message': self.LOADER_METHOD_TO_RESPONSE[loader_method], 'package': package},
            status=status.HTTP_200_OK
        )