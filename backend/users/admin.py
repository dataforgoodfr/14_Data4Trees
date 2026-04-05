from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = UserAdmin.list_display + ('can_add_data',)

    @admin.display(boolean=True, description='Can add data')
    def can_add_data(self, obj: CustomUser):
        # NOTE: the has_perm method returns True for all active superusers, no matter what other permissions are assigned
        return obj.has_perm('users.add_data')
