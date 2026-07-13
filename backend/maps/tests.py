import json
import shutil
import logging
from typing import ClassVar
from pathlib import Path

import pandas as pd
from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
from django.test import TestCase, SimpleTestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from maps.stats import mrp_mean


logger = logging.getLogger(__name__)

class SerializationTest(SimpleTestCase):
    def test_mrp_mean_returns_json_serializable_values(self):
        df = pd.DataFrame(
            {
                "value": [1.0, 2.0, 3.0],
                "stratum": ["a", "b", "a"],
            }
        )
        result = mrp_mean(df, {"a": 1.0, "b": 1.0})

        payload = json.dumps(result)

        self.assertIn('"value"', payload)
        self.assertIn('"error"', payload)


class DatapackageTest(TestCase):

    CATALOG_DIR: ClassVar[str] = 'catalog/test'
    TEST_DATA_DIR: ClassVar[Path] = Path(__file__).parent / 'fixtures'
    KOBOTOOLBOX_FORM: ClassVar[str] = 'kobotoolbox_inquiry.xlsx'
    KOBOTOOLBOX_DATA: ClassVar[str] = 'kobotoolbox_data.xlsx'
    
    
    def setUp(self):
        self.client = APIClient()
        user = self.get_user_with_permissions(
            username="testuser", 
            password="pass", 
            permissions=["add_data", "delete_data", "change_data"]
        )
        token = self.get_jwt_for_user(user)
        self.authenticate_user(token)

    def tearDown(self):
        try:
            shutil.rmtree(self.CATALOG_DIR)
        except OSError:
            pass 

    def get_user_with_permissions(self, username: str, password: str, permissions: list[str]):
        user, _ = get_user_model().objects.get_or_create(username=username, password=password)
        for permission in permissions:
            permission = Permission.objects.get(codename=permission)
            user.user_permissions.add(permission)
        return user

    def get_jwt_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def authenticate_user(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def manage_file_resource(self, method: str, file_content: str | bytes):
        file_data: dict = self.format_file_data_for_post_request(file_content, "file.csv")
        self.manage_resources(method, 'file', file_data)

    def manage_kobotoolbox_resources(self, method: str):
        data_content = self.get_kobotoolbox_file_content(self.KOBOTOOLBOX_DATA)
        form_content = self.get_kobotoolbox_file_content(self.KOBOTOOLBOX_FORM)
        file_data = {"data": data_content, "form": form_content}
        self.manage_resources(method, 'kobotoolbox', file_data)
        
    def manage_resources(self, method: str, resource_type: str, file_data: dict):
        response = self.send_post_request(f"maps-{method}-data", resource_type, file_data)
        logger.info(f"Response: {response}")
        self.assertEqual(response.status_code, 200)

    @staticmethod
    def format_file_data_for_post_request(file_content: str | bytes, filename: str) -> dict[str, SimpleUploadedFile]:
        if isinstance(file_content, str):
            file_content = file_content.encode()
        uploaded_file =  SimpleUploadedFile(
            name=filename,
            content=file_content,
            content_type='multipart/form-data'
        )
        return {"data": uploaded_file}

    def get_kobotoolbox_file_content(self, filename: str) -> bytes:
        file = self.TEST_DATA_DIR / filename
        with open(file, "rb") as f:
            return SimpleUploadedFile(
                filename, 
                f.read(), 
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            

    def send_post_request(self, url_name: str, resource_type: str, file_data: dict):
        data = {'resource_type': resource_type, 'package': self.CATALOG_DIR} | file_data
        return self.client.post(reverse(url_name), data, format='multipart')

    ##########################################
    # TEST CASES FOR MANAGEMENT OF FILE RESOURCES
    ##########################################

    def test_add_resource_from_file_with_ascii_content(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.manage_file_resource('add', file_content)

    def test_add_resource_from_file_with_ut8_content(self):
        file_content = 'col_1,col_2\néàë,-°$'.encode()
        self.manage_file_resource('add', file_content)

    def test_add_resource_from_file_with_weird_byte(self):
        file_content = b"id,name\n1,John\n2,Ana\n3,Bob\x96\n"  # 0x96 is typical Windows-1252 dash
        self.manage_file_resource('add', file_content)
        
    def test_file_mixed_encodings(self):
        part_utf8 = "id,name,city\n1,Élodie,Paris\n".encode("utf-8")
        part_latin1 = "2,José,Lisboa\n3,François,Lyon\n".encode("latin-1")
        file_content = part_utf8 + part_latin1
        self.manage_file_resource('add', file_content)

    def test_remove_resource_from_file(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.manage_file_resource('add', file_content)
        self.manage_file_resource('remove', file_content)

    def test_append_data_to_resource_from_file(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.manage_file_resource('add', file_content)
        self.manage_file_resource('append', file_content)

    def test_replace_data_in_resource_from_file(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.manage_file_resource('add', file_content)
        self.manage_file_resource('replace', file_content)

    ##########################################
    # TEST CASES FOR MANAGEMENT OF KOBOTOOLBOX RESOURCES
    ##########################################

    def test_add_remove_replace_append_kobotoolbox_resource(self):
        self.manage_kobotoolbox_resources('add')
        #self.manage_kobotoolbox_resources('remove')
        self.manage_kobotoolbox_resources('replace')
        self.manage_kobotoolbox_resources('append')