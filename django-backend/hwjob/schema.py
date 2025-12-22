import graphene

import dashboard.schema


class Query(dashboard.schema.Query, graphene.ObjectType):
    # Combine the queries from different apps
    pass


class Mutation(dashboard.schema.Mutation, graphene.ObjectType):
    # Combine the mutations from different apps
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)