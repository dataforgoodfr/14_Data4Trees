from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse


class FileUploadTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('maps-add-data')

    def test_file_upload_add(self):
        user = get_user_model().objects.create_user(username="testuser", password="pass")
        permission = Permission.objects.get(codename="add_data")
        user.user_permissions.add(permission)

        self.client.force_login(user)
        
        file_content = b'col_1,col_2\nvalue1,value2'

        uploaded_file = SimpleUploadedFile(
            name="test.csv",
            content=file_content,
            content_type='multipart/form-data'
        )

        response = self.client.post(
            self.url,
            data={ 
                'file': uploaded_file, 
                'package': 'catalog/test',
                'action': 'add'
            }
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('File uploaded successfully', response.json()['message'])
        