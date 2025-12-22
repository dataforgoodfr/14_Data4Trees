from django.urls import path

from .views import get_client, ConsumptionView, SearchClientView

app_name = "dashboard"
urlpatterns = [
    path('api/clients/', SearchClientView.as_view(), name='search_clients'),
    path('api/clients/<int:pk>/', get_client, name='get_client'),
    path('api/consumption/',ConsumptionView.as_view(),name="consumption_details",),
]
