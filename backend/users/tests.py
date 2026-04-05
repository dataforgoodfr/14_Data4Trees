from django.test import TestCase
from .models import CustomUser
from django.contrib.auth.models import Permission


class UserPermissionTest(TestCase):

    def setUp(self):
        self.user_1 = CustomUser.objects.create_user(username='testuser1', password='testpass1')
        self.user_2 = CustomUser.objects.create_user(username='testuser2', password='testpass2')
        permission = Permission.objects.get(codename='add_data')
        # adding permission to both users
        self.user_1.user_permissions.add(permission)
        self.user_2.user_permissions.add(permission)
        # removing permission from user_2
        self.user_2.user_permissions.remove(permission)

    def test_user_can_data(self):
        self.assertTrue(self.user_1.has_perm('users.add_data'))
        self.assertFalse(self.user_2.has_perm('users.add_data'))
