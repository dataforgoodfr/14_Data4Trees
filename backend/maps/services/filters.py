from ..constants import (
    ALL4TREES_LAYERS,
    LABEL_RESOURCE_BY_LAYER,
    LAYER_INVENTAIRE_BIO,
    LAYER_INVENTAIRE_FOR,
    LAYER_ENQUETE,
)

from data_catalog.services.catalog import get_resource

########## FILTERS CONFIGURATION ##########

# All4Trees Label data is one big table containing all the labels for all properties (see catalog/inventaire_for/for_label.parquet).
# Therefore it mixes properties with different types, like 'loc1' property (int) and 'struc' property (float) in inventaire_for layer.
# Therefore the 'name' column corresponding to properties' values contain mixed types.
# For the layer 'inventory_for', the column 'name' has been inferred to the type 'float' when imported.
# Therefore properties like loc1, loc2, ecos and typ have float values like 1.0 instead of 1.
# In the MapLibre map's FeatureCollection, these properties are of 'integer' type,
# so we need to cast the properties so they have the same type as in label data, hence the 'type' prop here.    
LAYER_PROPERTY_TO_LABEL_PROPERTIES = {
    "project": {
        "name": "proj",
        "type": str,
        "layers": [LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO, LAYER_ENQUETE]
    },
    "loc1": {
        "name": "loc1",
        "type": float,
        "layers": [LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO, LAYER_ENQUETE]
    },
    "loc2": {
        "name": "loc2",
        "type": float,
        "layers": [LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO, LAYER_ENQUETE]
    },
    "ecos": {
        "name": "ecos",
        "type": float,
        "layers": [LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO]
    },
    "type": {
        "name": "typ",
        "type": float,
        "layers": [LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO]
    },
    "cohort": {
        "name": "coh",
        "type": str,
        "layers": [LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO]
    },
    "year" : {
        "name": "year",
        "type": int,
        "layers": [LAYER_INVENTAIRE_FOR, LAYER_INVENTAIRE_BIO, LAYER_ENQUETE]
    }
}

# Several of these columns are optional in the datapackage; a null or blank would
# render as an unusable checkbox in the sidebar.
EMPTY_VALUES = (None, "")

########## FILTERS ENTRYPOINT ##########


def get_all4trees_filters(user_map):
    """
    Values available for each frontend filter, per layer:

        {filter key: {layer id: {"property_name": ..., "values": [...]}}}

    Filtering itself happens client-side (setFilter or setLayerFilter).
    This endpoint only tells the sidebar which values exist.
    """
    properties_by_layer = {
        layer_id: get_layer_data_properties(get_layer(user_map, layer_id))
        for layer_id in ALL4TREES_LAYERS
    }

    return {
        filter_key: {
            layer_id: get_filter_values(layer_id, properties_by_layer[layer_id], filter_key)
            for layer_id in filter_props["layers"]
        }
        for filter_key, filter_props in LAYER_PROPERTY_TO_LABEL_PROPERTIES.items()
    }


def get_layer(user_map, layer_id):
    return user_map.handle_request(method="POST", path=layer_id, filters={})


def get_layer_data_properties(layer) -> list[dict]:
    features = layer["features"]
    return [feat["properties"] for feat in features]


########## FILTER VALUES ##########


def get_filter_values(layer_id, layer_data, property_name):
    """
    Distinct values of `property_name` across a layer's features.

    Sorted so the sidebar keeps a stable order between reloads, and so that the
    checkbox identifiers the webapp persists stay predictable.
    """
    label_data = get_resource(layer_id, LABEL_RESOURCE_BY_LAYER[layer_id])

    values = {
        tuple(get_labelized_value(properties, property_name, label_data).items())
        for properties in layer_data
        if properties.get(property_name) not in EMPTY_VALUES
    }

    return {
        "property_name": property_name,
        "values": [dict(value) for value in sort_filter_values(values)],
    }

def sort_filter_values(values):
    """
    Natural order.

    Codes are uncast strings on the enquete layer, which "groupby" serves raw:
    plain lexicographic order would list its communes as 1, 12, 3, 40, 9.
    """
    if all(isinstance(value, str) and value.lstrip("-").isdigit() for value in values):
        return sorted(values, key=int)

    try:
        return sorted(values)
    except TypeError:
        # Defensive: a column mixing types (int and str) is not comparable.
        return sorted(values, key=str)

def get_labelized_value(properties, property_name, label_data):
    """
    Get the label for a value from the label data resource.

    If no label is found, return the value itself.
    """
    value = properties[property_name]
    value_type = get_label_name_type(property_name)

    ## Filter rows to keep only the row corresponding the the project and property_name
    label_candidates = label_data[
        (label_data['proj'] == properties['project'])
        & (label_data['list_name'] == get_label_list_name(property_name))
    ]
    ## Keep only the row with matching value, not forgetting to type cast before comparison.
    label = label_candidates[
        label_candidates['name'].map(value_type) == value_type(value)
    ]

    if not label.empty:
        return {
            "value": value,
            "label::fr": label.iloc[0]['label::fr'],
            "label::en": label.iloc[0]['label::en'],
        }
    else:
        return {
            "value": value,
            "label::fr": value,
            "label::en": value,
        }

def get_label_list_name(property_name):
    """
    Get the list name for a property name.

    The list name is used to filter the label data resource.
    """
    label_prop = LAYER_PROPERTY_TO_LABEL_PROPERTIES.get(property_name)
    return label_prop['name'] if label_prop else property_name

def get_label_name_type(property_name):
    """
    Get the label name type for a property name.

    The name type is used to cast the property to the correct type.
    """
    label_prop = LAYER_PROPERTY_TO_LABEL_PROPERTIES.get(property_name)
    return label_prop['type'] if label_prop else type(property_name)
