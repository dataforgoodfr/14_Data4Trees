import logging

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import F, Subquery, Sum, OuterRef, Exists, Case, When
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class MonthMixin(models.Model):
    month = models.PositiveSmallIntegerField(
        "month", validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    year = models.PositiveSmallIntegerField("year")

    def __str__(self):
        return str(self.month) + '/' + str(self.year)

    class Meta:
        abstract = True

class ClientQuerySet(models.QuerySet):
    def _subquery_conso_over_months(self, months):
        return Consumption.objects \
            .filter(client_id=OuterRef("pk"), month__in=months) \
            .values("client_id") \
            .annotate(total_kwh_consumed=Sum('kwh_consumed')) \
            .values('total_kwh_consumed')

    def annotate_has_elec_heating(self):
        cold_months_q = self._subquery_conso_over_months([11, 12, 1, 2, 3, 4])
        hot_months_q = self._subquery_conso_over_months([5, 6, 7, 8, 9, 10])

        has_elec_heating_case = Case(
            When(cold_consumption__gt=2 * F("hot_consumption"), then=True),
            default=False,
            output_field=models.BooleanField()
        )
        return self \
            .annotate(cold_consumption=Subquery(cold_months_q)) \
            .annotate(hot_consumption=Subquery(hot_months_q)) \
            .annotate(has_elec_heating=has_elec_heating_case)

    def annotate_anomaly(self):
        anomaly_q = Consumption.objects \
            .filter(
                client_id=OuterRef("pk"),
                client__consumption__month=F('month'),
                client__consumption__year=F('year') - 1,
                client__consumption__kwh_consumed__lte=F('kwh_consumed') / 1.9,
                client__consumption__client_id=F('client_id')
            ) \
            .order_by("-year", "-month")
        return self \
            .annotate(anomaly_year=Subquery(anomaly_q.values("year")[:1])) \
            .annotate(anomaly_month=Subquery(anomaly_q.values("month")[:1])) \
            .annotate(has_anomaly=Exists(anomaly_q))

class Client(models.Model):
    full_name = models.CharField("full name", max_length=50)
    objects = ClientQuerySet.as_manager()

    class Meta:
        ordering = ('id',)

    def __str__(self):
        return f"Client {self.pk}: {self.full_name}"

class Consumption(MonthMixin):
    """
    Store the electricity consumption of a client over a month
    """
    client = models.ForeignKey(
        "dashboard.Client", verbose_name="client", on_delete=models.CASCADE
    )
    kwh_consumed = models.FloatField("kwh consumed")

    class Meta:
        verbose_name = "Consumption"
        verbose_name_plural = "Consumptions"
        unique_together = ("client", "month", "year")
        ordering = ('client_id', '-year', '-month')

    def __str__(self):
        return f"Conso of {self.client.id} ({self.month}/{self.year}): {self.kwh_consumed}"


class CustomPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        logger.debug(f"Paginated data: {data}")
        return Response({
            'count': self.page.paginator.count,
            'page_number': self.page.paginator.num_pages,
            'has_next': self.page.has_next(),
            'has_previous': self.page.has_previous(),
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
            })
    
class ClientsPagination(CustomPagination):
    page_size = 20
    
class ConsPagination(CustomPagination):
    page_size = 12