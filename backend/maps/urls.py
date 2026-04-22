from django.urls import path, re_path

from . import views

urlpatterns = [
    re_path(r"^(?!dashboard)(?P<subpath>\w+)", views.my_map_view, name="maps-data"),
    path("dashboard/<layer_id>", views.dashboard_view, name="dashboard-data"),
]
