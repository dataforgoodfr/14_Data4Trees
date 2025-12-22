from datetime import date
import logging

from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics, filters

import plotly.express as px

from dashboard.models import Client, ClientsPagination, ConsPagination, Consumption
from .serializer import ClientSerializer, ConsumptionSerializer

logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_client(request, pk):
    try:
        logger.debug("Fetching client with ID: %s", pk)
        client = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ClientSerializer(client)
        return Response(serializer.data)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def consumption_view(request, client_id):
    consumption = Consumption.objects.filter(client_id=client_id)[:12:-1]
    logger.debug("Consumption details for client" + str(client_id) + ": " + str(consumption))
    chart = px.bar(
        x=[date(month=c.month, year=c.year, day=1) for c in consumption],
        y=[c.kwh_consumed for c in consumption],
        title='Consommation Electrique des 12 derniers mois',
        labels={'x': 'Date', 'y': 'Consommation (en kWh)'}
    ).to_html()
    context = {'chart': chart}
    return render(request, "dashboard/consumption_detail.html", context)


class ConsumptionView(generics.ListAPIView):
    serializer_class = ConsumptionSerializer
    queryset = Consumption.objects.all()
    pagination_class = ConsPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['client_id']


class SearchClientView(generics.ListAPIView):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()
    pagination_class = ClientsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id', 'full_name']
    search_fields = ['full_name']

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = self.filter_queryset(queryset)
        queryset = queryset.annotate_has_elec_heating().annotate_anomaly()
        logger.debug(f"Search Client Query : {queryset.query}")
        return queryset
