from django.apps import AppConfig
from django.contrib.admin.apps import AdminConfig


class DashboardConfig(AppConfig):
    name = "dashboard"


class DashboardAdminConfig(AdminConfig):
    default_site = "dashboard.admin.DashboardAdminSite"
