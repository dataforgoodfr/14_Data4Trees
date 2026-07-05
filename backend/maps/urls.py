from django.urls import path, re_path

from . import views

urlpatterns = [
    path("add-data/", views.add_resource_using_file_view, name="maps-add-data"),
    path("remove-data/", views.remove_resource_using_file_view, name="maps-remove-data"),
    path("append-data/", views.append_file_data_to_datapackage_view, name="maps-append-data"),
    path("replace-data/", views.replace_datapackage_data_from_file_view, name="maps-replace-data"),
    re_path(r"^(?!dashboard)(?P<subpath>\w+)", views.my_map_view, name="maps-data"),
    path("dashboard/<layer_id>", views.dashboard_view, name="dashboard-data"),
]
