"""
URL configuration for users project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from all4trees import views

urlpatterns = [
    path("admin/doc/", include("django.contrib.admindocs.urls")),
    path("admin/", admin.site.urls),
    path("api/", include("users.urls")),
    path("api/maps/", include("maps.urls")),
    path("api/catalog/<layer_id>/<resource_name>", views.resource_view, name="get-catalog-resource"),
    path("api/catalog/<layer_id>", views.resource_list_view, name="get-catalog-resources-list"),
    path("api/datapackage.json", views.datapackage_view, name="get-datapackage.json"),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
