import json
import shutil

import pandas as pd
from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
from django.test import TestCase, SimpleTestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from maps.stats import mrp_mean

TEST_DIR = 'catalog/test'
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
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('maps-add-data')
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        token = self.get_jwt_for_user(user)
        self.authenticate_user(token)

    def tearDown(self):
        try:
            shutil.rmtree(TEST_DIR)
        except OSError:
            pass 

    def get_user_with_permission(self, username, password, codename):
        user = get_user_model().objects.create_user(username=username, password=password)
        permission = Permission.objects.get(codename=codename)
        user.user_permissions.add(permission)
        return user

    def get_jwt_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def authenticate_user(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_file_upload_add_ascii_content(self):
        file_content = b'col_1,col_2\nvalue1,value2'

        uploaded_file = SimpleUploadedFile(
            name="ascii.csv",
            content=file_content,
            content_type='multipart/form-data'
        )

        response = self.client.post(
            self.url,
            data={ 
                'file': uploaded_file, 
                'package': TEST_DIR,
                'action': 'add'
            }
        )
        
        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('File uploaded successfully', response.json()['message'])


    def test_file_upload_add_ut8_content(self):
        file_content = 'col_1,col_2\néàë,-°$'

        uploaded_file = SimpleUploadedFile(
            name="utf8.csv",
            content=file_content.encode('utf-8'),
            content_type='multipart/form-data'
        )

        response = self.client.post(
            self.url,
            data={ 
                'file': uploaded_file, 
                'package': TEST_DIR,
                'action': 'add'
            }
        )
        
        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('File uploaded successfully', response.json()['message'])
        
    def test_file_upload_weird_byte(self):
        data = b"id,name\n1,John\n2,Ana\n3,Bob\x96\n"  # 0x96 is typical Windows-1252 dash

        uploaded_file = SimpleUploadedFile(
            name="ascii_with_weird_byte.csv",
            content=data,
            content_type='multipart/form-data'
        )
            
        response = self.client.post(
            self.url,
            data={ 
                'file': uploaded_file, 
                'package': TEST_DIR,
                'action': 'add'
            }
        )

        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('File uploaded successfully', response.json()['message'])
        
    def test_file_mixed_encodings(self):
        part_utf8 = "id,name,city\n1,Élodie,Paris\n".encode("utf-8")
        part_latin1 = "2,José,Lisboa\n3,François,Lyon\n".encode("latin-1")
        file_content = part_utf8 + part_latin1

        uploaded_file = SimpleUploadedFile(
            name="mixed_encoding_file.csv",
            content=file_content,
            content_type='multipart/form-data'
        )
            
        response = self.client.post(
            self.url,
            data={ 
                'file': uploaded_file, 
                'package': TEST_DIR,
                'action': 'add'
            }
        )

        self.assertEqual(response.status_code, 200, f"response is {response}")
        self.assertEqual(uploaded_file.name, response.json()['filename'])
        self.assertIn('File uploaded successfully', response.json()['message'])
        