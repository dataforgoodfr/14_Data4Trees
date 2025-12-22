from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.urls import path
from rest_framework import generics

from dashboard.models import Client, ClientsPagination
from .serializer import ClientSerializer

import logging

logger = logging.getLogger(__name__)

class AdminClientsView(generics.ListAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    pagination_class = ClientsPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.annotate_has_elec_heating().annotate_anomaly()
        return queryset


class DashboardAdminSite(admin.sites.AdminSite):
    def get_urls(self):
        logging.debug("DashboardAdminSite.get_urls() called")
        urls = super().get_urls()
        urls = [
                   path("clients", staff_member_required(AdminClientsView.as_view()), name="admin_clients"),
               ] + urls
        logging.debug("DashboardAdminSite.get_urls() urls: %s", urls)
        return urls
