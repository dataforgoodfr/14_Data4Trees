import json
import shutil
from typing import ClassVar

import pandas as pd
from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
from django.test import TestCase, Client, SimpleTestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse

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
        self.client = Client()

    def tearDown(self):
        try:
            shutil.rmtree(self.CATALOG_DIR)
        except OSError:
            pass 

    def get_user_with_permission(self, username, password, codename):
        user = get_user_model().objects.create_user(username=username, password=password)
        permission = Permission.objects.get(codename=codename)
        user.user_permissions.add(permission)
        return user


    ##########################################
    # ADD RESOURCE
    ##########################################

    def add_resource_test_recipe(self, file_content: str | bytes, filename: str):
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
        uploaded_file = SimpleUploadedFile(
            name=filename,
            content=file_content,
            content_type='multipart/form-data'
        )
        response = self.client.post(
            reverse("maps-add-data"),
            data={ 
                'file': uploaded_file, 
                'package': self.CATALOG_DIR
            }
        )
        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('Resource successfully added to datapackage', response.json()['message'])
        
    def test_add_resource_from_file_with_ascii_content(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.add_resource_test_recipe(file_content, "ascii.csv")

    def test_add_resource_from_file_with_ut8_content(self):
        file_content = 'col_1,col_2\néàë,-°$'
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
        uploaded_file = SimpleUploadedFile(
            name=filename,
            content=file_content,
            content_type='multipart/form-data'
        )
        response = self.client.post(
            reverse("maps-remove-data"),
            data={ 
                'file': uploaded_file, 
                'package': self.CATALOG_DIR
            }
        )
        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('Resource successfully removed from datapackage', response.json()['message'])


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
        uploaded_file = SimpleUploadedFile(
            name=filename,
            content=file_content,
            content_type='multipart/form-data'
        )
        response = self.client.post(
            reverse("maps-remove-data"),
            data={ 
                'file': uploaded_file, 
                'package': self.CATALOG_DIR
            }
        )
        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('File successfully appended to datapackage resource data', response.json()['message'])

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
        uploaded_file = SimpleUploadedFile(
            name=filename,
            content=file_content,
            content_type='multipart/form-data'
        )
        response = self.client.post(
            reverse("maps-remove-data"),
            data={ 
                'file': uploaded_file, 
                'package': self.CATALOG_DIR
            }
        )
        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('File successfully replaced datapackage resource data', response.json()['message'])
    
    def test_replace_data_in_resource_from_file(self):
        file_content = b'col_1,col_2\nvalue1,value2'
        self.add_resource_test_recipe(file_content, "file.csv")
        self.replace_resource_test_recipe(file_content, "file.csv")