from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = UserAdmin.list_display + (
        'is_active',
        'is_superuser',
        'can_add_data'
    )

    @admin.display(boolean=True, description='Can add data')
    def can_add_data(self, obj):
        return obj.has_perm('add_data')
