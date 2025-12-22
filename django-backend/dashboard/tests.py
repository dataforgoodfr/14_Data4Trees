from django.urls import path, reverse
from django.contrib.auth.models import User

from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework import status
from dashboard.admin import DashboardAdminSite

class AdminTests(APITestCase, URLPatternsTestCase):
    fixtures = ["clients.json"]

    urlpatterns = [
        path('admin/', DashboardAdminSite().urls),
    ]

    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin',
            password='admin',
            email='admin@example.com'
        )
        self.client.login(username='admin', password='admin')

    def test_access_admin_client(self):
        url = reverse('admin:admin_clients')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)


class DashboardAPITestCase(APITestCase):
    fixtures = ["clients.json", "consumptions.json"]

    def test_search_clients(self):
        url = reverse('dashboard:search_clients')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)

    def test_search_clients_with_id_query(self):
        url = reverse('dashboard:search_clients')
        response = self.client.get(url, QUERY_STRING='id=2', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_search_clients_with_full_name_query(self):
        url = reverse('dashboard:search_clients')
        response = self.client.get(url, QUERY_STRING='full_name=Jennifer Boyer', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_search_clients_with_full_name_query(self):
        url = reverse('dashboard:search_clients')
        response = self.client.get(url, QUERY_STRING='search=Larson', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

    def test_get_consumption(self):
        url = reverse('dashboard:consumption_details')
        response = self.client.get(url, QUERY_STRING='client_id=2', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 102)

