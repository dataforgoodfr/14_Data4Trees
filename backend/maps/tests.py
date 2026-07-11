import json
import shutil
from typing import ClassVar

import pandas as pd
from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
from django.test import TestCase, SimpleTestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from maps.stats import mrp_mean


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


class FileUploadTest(TestCase):

    CATALOG_DIR: ClassVar[str] = 'catalog/test'
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('maps-add-data')
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        token = self.get_jwt_for_user(user)
        self.authenticate_user(token)

    def tearDown(self):
        try:
            shutil.rmtree(self.CATALOG_DIR)
        except OSError:
            pass 

    def get_user_with_permission(self, username, password, codename):
        user, _ = get_user_model().objects.get_or_create(username=username, password=password)
        permission = Permission.objects.get(codename=codename)
        user.user_permissions.add(permission)
        return user

    def get_jwt_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def authenticate_user(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def get_uplodaded_file(self, file_content: str | bytes, filename: str) -> SimpleUploadedFile:
        if isinstance(file_content, str):
            file_content = file_content.encode()
        return SimpleUploadedFile(
            name=filename,
            content=file_content,
            content_type='multipart/form-data'
        )


    def send_post_request(self, url_name: str, file: SimpleUploadedFile):
        return self.client.post(
            reverse(url_name),
            data={ 
                'file': file, 
                'package': self.CATALOG_DIR
            }
        )

    def assert_all(self, response, file: SimpleUploadedFile, success_message: str):
        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(file.name, response.json()['filename'])
        self.assertIn(success_message, response.json()['message'])


    ##########################################
    # ADD RESOURCE
    ##########################################

    def add_resource_test_recipe(self, file_content: str | bytes, filename: str):
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
        uploaded_file = self.get_uplodaded_file(file_content, filename)
        response = self.send_post_request("maps-add-data", uploaded_file)
        self.assert_all(response, uploaded_file, 'Resource successfully added to datapackage')
        
    def test_add_resource_from_file_with_ascii_content(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.add_resource_test_recipe(file_content, "ascii.csv")

    def test_add_resource_from_file_with_ut8_content(self):
        file_content = 'col_1,col_2\néàë,-°$'.encode()
        self.add_resource_test_recipe(file_content, "utf8.csv")

    def test_add_resource_from_file_with_weird_byte(self):
        data = b"id,name\n1,John\n2,Ana\n3,Bob\x96\n"  # 0x96 is typical Windows-1252 dash
        self.add_resource_test_recipe(data, "ascii_with_weird_byte.csv")
        
    def test_file_mixed_encodings(self):
        part_utf8 = "id,name,city\n1,Élodie,Paris\n".encode("utf-8")
        part_latin1 = "2,José,Lisboa\n3,François,Lyon\n".encode("latin-1")
        file_content = part_utf8 + part_latin1
        self.add_resource_test_recipe(file_content, "mixed_encoding_file.csv")

    ##########################################
    # REMOVE RESOURCE
    ##########################################

    def remove_resource_test_recipe(self, file_content: str | bytes, filename: str):
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
        uploaded_file = self.get_uplodaded_file(file_content, filename)
        response = self.send_post_request("maps-remove-data", uploaded_file)
        self.assert_all(response, uploaded_file, 'Resource successfully removed from datapackage')


    def test_remove_resource_from_file(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.add_resource_test_recipe(file_content, "file.csv")
        self.remove_resource_test_recipe(file_content, "file.csv")

    ##########################################
    # APPEND DATA
    ##########################################

    def append_resource_test_recipe(self, file_content: str | bytes, filename: str):
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
        uploaded_file = self.get_uplodaded_file(file_content, filename)
        response = self.send_post_request("maps-append-data", uploaded_file)
        self.assert_all(response, uploaded_file, 'File successfully appended to datapackage resource data')

    def test_append_data_to_resource_from_file(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.add_resource_test_recipe(file_content, "file.csv")
        self.append_resource_test_recipe(file_content, "file.csv")

    ##########################################
    # REPLACE DATA
    ##########################################

    def replace_resource_test_recipe(self, file_content: str | bytes, filename: str):
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
        uploaded_file = self.get_uplodaded_file(file_content, filename)
        response = self.send_post_request("maps-replace-data", uploaded_file)
        self.assert_all(response, uploaded_file, 'File successfully replaced datapackage resource data')
    
    def test_replace_data_in_resource_from_file(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.add_resource_test_recipe(file_content, "file.csv")
        self.replace_resource_test_recipe(file_content, "file.csv")