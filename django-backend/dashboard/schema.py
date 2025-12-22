import graphene
from graphene_django import DjangoObjectType

from .models import Client, Consumption


class ClientType(DjangoObjectType):
    class Meta:
        model = Client
        fields = "__all__"


class ConsumptionType(DjangoObjectType):
    class Meta:
        model = Consumption
        fields = "__all__"


class CreateConsumption(graphene.Mutation):
    class Arguments:
        kwh_consumed = graphene.Decimal(required=True)
        year = graphene.Int(required=True)
        month = graphene.Int(required=True)
        client_id = graphene.ID(required=True)

    consumption = graphene.Field(ConsumptionType)

    def mutate(self, info, kwh_consumed, year, month, client_id):
        """
        The mutate function is the function that will be called when a client
        makes a request to this mutation. It takes in four arguments:
        self, info, title and content. The first two are required by all mutations;
        the last two are the arguments we defined in our CreateConsumptionInput class.

        :param self: Access the object's attributes and methods
        :param info: Access the context of the request
        :param title: Create a new Consumption with the title provided
        :param content: Pass the content of the Consumption
        :param author_id: Get the author object from the database
        :return: A createConsumption object
        """
        client = Client.objects.get(pk=client_id)
        consumption = Consumption(month=month, year=year, kwh_consumed=kwh_consumed, client=client)
        consumption.save()
        return CreateConsumption(consumption=consumption)


class DeleteConsumption(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        """
        The mutate function is the function that will be called when a client
        calls this mutation. It takes in four arguments: self, info, id. The first
        argument is the object itself (the class instance). The second argument is
        information about the query context and user making this request. We don't
        need to use it here so we'll just pass it along as-is to our model method.
        The third argument is an ID of a Consumption we want to delete.

        :param self: Represent the instance of the class
        :param info: Access the context of the query
        :param id: Find the Consumption that is to be deleted
        :return: A deleteConsumption object, which is the return type of the mutation
        """
        try:
            consumption = Consumption.objects.get(pk=id)
        except Consumption.DoesNotExist:
            raise Exception("Consumption not found")

        consumption.delete()
        return DeleteConsumption(success=True)


class Query(graphene.ObjectType):
    clients = graphene.List(ClientType)
    consumptions = graphene.List(ConsumptionType)
    client_by_name = graphene.Field(ClientType, name=graphene.String(required=True))

    def resolve_clients(self, info):
        """
        The resolve_clients function is a resolver. It’s responsible for retrieving the Consumptions from the database and returning them to GraphQL.

        :param self: Refer to the current instance of a class
        :param info: Pass along the context of the query
        :return: All Consumption objects from the database
        """
        return Client.objects.all()
    
    def resolve_client_by_name(self, info, name):
        try:
            return Client.objects.get(full_name=name)
        except Client.DoesNotExist:
            return None

    def resolve_consumptions(self, info):
        """
        The resolve_consumptions function is a resolver. It’s responsible for retrieving the data that will be returned as part of an execution result.

        :param self: Pass the instance of the object to be used
        :param info: Pass information about the query to the resolver
        :return: A list of all the authors in the database
        """
        return Consumption.objects.select_related("client").all()


class Mutation(graphene.ObjectType):
    create_Consumption = CreateConsumption.Field()
    delete_Consumption = DeleteConsumption.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)