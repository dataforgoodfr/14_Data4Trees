from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
import shutil 

TEST_DIR = 'catalog/test'
class FileUploadTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('maps-add-data')

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


    def test_file_upload_add_ascii_content(self):
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
        
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
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
        
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
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
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
        user = self.get_user_with_permission("testuser", "pass", "add_data")
        self.client.force_login(user)
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
        