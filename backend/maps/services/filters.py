from ..constants import (
    ALL4TREES_LAYERS,
    LAYER_ENQUETE,
    LAYER_INVENTAIRE_BIO,
    LAYER_INVENTAIRE_FOR,
)

########## FILTERS CONFIGURATION ##########

# filter key -> {layer id: name of the property in that layer's GeoJSON features}
#
# The property is declared per layer because the same concept is not always
# exposed under the same name (see configs/all4trees_config.json):
#  - "cohort" is served as "start_date" on inventaire_bio, though both come from
#    the same source column `coh`;
#  - the enquete layer is built with "groupby", which keeps the raw source column
#    names instead of the renamed ones, and exposes neither ecos, type nor cohort.
# A layer absent from a filter simply has no values for it.
FILTER_PROPERTIES_BY_LAYER = {
    "project": {
        LAYER_INVENTAIRE_FOR: "project",
        LAYER_INVENTAIRE_BIO: "project",
        # Not renamed on this layer: "groupby" keeps the source column name.
        LAYER_ENQUETE: "proj",
    },
    "loc1": {
        LAYER_INVENTAIRE_FOR: "loc1",
        LAYER_INVENTAIRE_BIO: "loc1",
        LAYER_ENQUETE: "loc1",
    },
    "loc2": {
        LAYER_INVENTAIRE_FOR: "loc2",
        LAYER_INVENTAIRE_BIO: "loc2",
        LAYER_ENQUETE: "loc2",
    },
    "type": {
        LAYER_INVENTAIRE_FOR: "type",
        LAYER_INVENTAIRE_BIO: "type",
    },
    "cohort": {
        LAYER_INVENTAIRE_FOR: "cohort",
        LAYER_INVENTAIRE_BIO: "start_date",
    },
    "ecos": {
        LAYER_INVENTAIRE_FOR: "ecos",
        LAYER_INVENTAIRE_BIO: "ecos",
    },
    "year": {
        LAYER_INVENTAIRE_FOR: "year",
        LAYER_INVENTAIRE_BIO: "year",
        LAYER_ENQUETE: "year",
    },
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
            layer_id: get_filter_values(properties_by_layer[layer_id], property_name)
            for layer_id, property_name in layers.items()
        }
        for filter_key, layers in FILTER_PROPERTIES_BY_LAYER.items()
    }


def get_layer(user_map, layer_id):
    return user_map.handle_request(method="POST", path=layer_id, filters={})


def get_layer_data_properties(layer) -> list[dict]:
    features = layer["features"]
    return [feat["properties"] for feat in features]


########## FILTER VALUES ##########


def get_filter_values(layer_data, property_name):
    """
    Distinct values of `property_name` across a layer's features.

    Sorted so the sidebar keeps a stable order between reloads, and so that the
    checkbox identifiers the webapp persists stay predictable.
    """
    values = {
        properties[property_name]
        for properties in layer_data
        if properties.get(property_name) not in EMPTY_VALUES
    }

    return {
        "property_name": property_name,
        "values": sort_filter_values(values),
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
