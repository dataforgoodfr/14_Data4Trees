from ..constants import LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO, LAYER_ENQUETE

########## FILTERS ENTRYPOINT ##########
 
def get_all4trees_filters(user_map):
    # Retrieve all layers data
    layer_inventaire_for = get_layer(user_map, LAYER_INVENTAIRE_FOR)
    layer_inventaire_bio = get_layer(user_map, LAYER_INVENTAIRE_BIO)
    layer_enquete = get_layer(user_map, LAYER_ENQUETE)
    
    # Retrieve the data points properties
    layer_data_inventaire_for = get_layer_data_properties(layer_inventaire_for)
    layer_data_inventaire_bio = get_layer_data_properties(layer_inventaire_bio)
    layer_data_enquete = get_layer_data_properties(layer_enquete)
    
    # Compute filters values
    project_values = get_project_values(
        layer_data_inventaire_for=layer_data_inventaire_for,
        layer_data_inventaire_bio=layer_data_inventaire_bio,
    )
    loc1_values = get_loc1_values(
        layer_data_inventaire_for=layer_data_inventaire_for,
        layer_data_inventaire_bio=layer_data_inventaire_bio,
    )
    
    return {
        "project": project_values,
        "loc1": loc1_values,
    }
    
def get_layer(user_map, layer_id):
    return user_map.handle_request(method='POST',path=layer_id, filters={})

def get_layer_data_properties(layer)-> list(dict):
    features =  layer["features"]
    return [feat["properties"] for feat in features]

########## FILTERS PER PROPERTY ##########

def get_project_values(
    layer_data_inventaire_for,
    layer_data_inventaire_bio,
):
    """Retrieve projects property on layers where this field exist"""
    return {
        LAYER_INVENTAIRE_FOR: {
            "property_name": "project",
            "values": list(set([item["project"] for item in layer_data_inventaire_for])),
        },
        LAYER_INVENTAIRE_BIO: {
            "property_name": "project",
            "values": list(set([item["project"] for item in layer_data_inventaire_bio])),
        },
    }

def get_loc1_values(
    layer_data_inventaire_for,
    layer_data_inventaire_bio,
):
    """Retrieve loc1 property on layers where this field exist"""
    return {
        LAYER_INVENTAIRE_FOR: {
            "property_name": "loc1",
            "values": list(set([item["loc1"] for item in layer_data_inventaire_for])),
        },
        LAYER_INVENTAIRE_BIO: {
            "property_name": "loc1",
            "values": list(set([item["loc1"] for item in layer_data_inventaire_bio])),
        },
    }