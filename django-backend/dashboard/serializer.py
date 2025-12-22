from rest_framework import serializers
from dashboard.models import Client, Consumption

class ClientSerializer(serializers.ModelSerializer):
    has_anomaly = serializers.BooleanField(read_only=True)
    has_elec_heating = serializers.BooleanField(read_only=True)
    anomaly_year = serializers.IntegerField(read_only=True)
    anomaly_month = serializers.IntegerField(read_only=True)

    class Meta:
        model = Client
        fields = ["id", "full_name", "has_elec_heating", "has_anomaly", "anomaly_year", "anomaly_month"]

class ConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumption
        fields = ["year", "month", "kwh_consumed", "client_id"]