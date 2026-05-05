from django.urls import path, re_path

from . import views

urlpatterns = [
    path("add-data/", views.add_data_view, name="maps-add-data"),
    re_path(r"^(?!dashboard)(?P<subpath>\w+)", views.my_map_view, name="maps-data"),
    path("dashboard/<layer_id>", views.dashboard_view, name="dashboard-data"),
]
