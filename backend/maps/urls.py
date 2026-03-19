from django.urls import path

from . import views

urlpatterns = [
    path("<path:subpath>", views.my_map_view, name="maps-data"),
]
