from django.urls import path

from . import views

urlpatterns = [
    path("<layer_id>/<resource_name>", views.resource_view, name="get-catalog-resource"),
    path("<layer_id>", views.resource_list_view, name="get-catalog-resources-list"),
    path("datapackage.json", views.datapackage_view, name="get-datapackage.json"),
]