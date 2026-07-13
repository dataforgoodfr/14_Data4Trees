from django.urls import path, re_path

from . import views

urlpatterns = [
    path("add-data/", views.add_resources_view, name="maps-add-data"),
    path("remove-data/", views.remove_resources_view, name="maps-remove-data"),
    path("append-data/", views.append_data_view, name="maps-append-data"),
    path("replace-data/", views.replace_data_view, name="maps-replace-data"),
    path("add-fk/", views.add_foreign_key_view, name="maps-add-fk"),
    path("remove-fk/", views.remove_foreign_key_view, name="maps-remove-fk"),
    re_path(r"^(?!dashboard)(?P<subpath>\w+)", views.my_map_view, name="maps-data"),
    path("dashboard/<layer_id>", views.dashboard_view, name="dashboard-data"),
]
