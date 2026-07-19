from django.contrib.auth.models import AbstractUser
from django.db.models import AutoField, CharField

ADMIN_PROJECT = "all4trees"
class CustomUser(AbstractUser):
    id = AutoField(primary_key=True)
    project = CharField("projet", max_length=30, blank=True, null=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        permissions = [
            ("add_data", "Can add data"),
            ("view_data", "Can view data"),
            ("change_data", "Can change data"),
            ("delete_data", "Can delete data"),
        ]
