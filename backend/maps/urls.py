from django.urls import path

from . import views

urlpatterns = [
    path("style.json", views.style_json, name="maps-style"),
    path("<str:layer_id>", views.map_data, name="maps-data"),
]
