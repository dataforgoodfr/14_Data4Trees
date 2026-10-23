import logging

import pandas as pd
from coordo.datapackage import DataPackage
from coordo.syntax_parsers import sql_parser
from pygeofilter.parsers.cql2_text import parse as parse_filter

from data_catalog.services.catalog import get_resource

from ..constants import LABEL_RESOURCE_BY_LAYER, LAYER_ENQUETE
from .filters import EMPTY_VALUES, sort_filter_values

logger = logging.getLogger(__name__)

########## CALCULATION FILTERS CONFIGURATION ##########

# Calculation filters restrict the raw survey rows *before* the enquete layer
# aggregates them (groupby proj, loc1, loc2, year), so their columns no longer
# exist on the layer's features: values are read from the raw resource instead.
#
# Key order is the display order.
#   kind: "values" -> checkboxes, "range" -> slider over the ordered values.
#   list_name: the hh_label list holding the column's labels.
CALCULATION_FILTERS = {
    "typ": {"kind": "values", "list_name": "typ"},
    "coh": {"kind": "range", "list_name": "coh"},
    "urb_rur": {"kind": "values", "list_name": "urb_rur"},
    "sex": {"kind": "values", "list_name": "sex"},
    # Coded brackets (1-4, 98, 99), not years.
    "age": {"kind": "values", "list_name": "age"},
    "educ": {"kind": "values", "list_name": "educ"},
    # To be confirmed: inc_main is a `calculate` field, labelled by the `inc` list.
    "inc_main": {"kind": "values", "list_name": "inc"},
    "inc_sit": {"kind": "values", "list_name": "inc_sit"},
}

LANGUAGES = ("fr", "en")

########## CALCULATION FILTERS ENTRYPOINT ##########


def get_calculation_filters(user_map):
    """
    Values available for each calculation filter of the enquete layer:

        {"layer_id": "enquete", "filters": {column: {"kind", "property_name", "values"}}}

    Values are restricted to the raw rows the user may see.
    """
    rows = read_visible_rows(user_map, LAYER_ENQUETE, list(CALCULATION_FILTERS))
    label_data = get_resource(LAYER_ENQUETE, LABEL_RESOURCE_BY_LAYER[LAYER_ENQUETE])

    return {
        "layer_id": LAYER_ENQUETE,
        "filters": {
            column: {
                "kind": config["kind"],
                "property_name": column,
                "values": get_column_values(rows, column, label_data, config["list_name"]),
            }
            for column, config in CALCULATION_FILTERS.items()
        },
    }


def read_visible_rows(user_map, layer_id, columns) -> pd.DataFrame:
    """
    Raw rows of the layer's resource, without groupby, restricted by the
    filter `get_user_map` set on the layer (project / confidentiality).
    """
    layer = user_map._get_layer(layer_id)
    package = DataPackage.from_path(user_map._base_path / layer.path)
    return package.read_resource(
        layer.resource,
        columns={column: sql_parser.parse(column) for column in ["proj", *columns]},
        filter=parse_filter(layer.filter) if layer.filter else None,
    )


########## COLUMN VALUES ##########


def get_column_values(rows, column, label_data, list_name):
    """
    Distinct non-blank values of `column`, in natural order, with their labels.
    """
    projects_by_value = {}
    for project, value in rows[["proj", column]].itertuples(index=False):
        if is_blank(value):
            continue
        projects_by_value.setdefault(value, set()).add(project)

    labels = label_data[label_data["list_name"] == list_name]

    return [
        get_labels(value, sorted(projects_by_value[value], key=str), labels, column)
        for value in sort_filter_values(list(projects_by_value))
    ]


def get_labels(value, projects, labels, column):
    """
    fr/en labels of a value.

    A value seen in several projects takes the first project's labels. A missing
    language falls back to the other language, then to the raw value.
    """
    value_labels = labels[labels["name"] == value]

    candidates = []
    for project in projects:
        project_labels = value_labels[value_labels["proj"] == project]
        if project_labels.empty:
            continue
        row = project_labels.iloc[0]
        candidate = {lang: clean_label(row[f"label::{lang}"]) for lang in LANGUAGES}
        if any(candidate.values()):
            candidates.append((project, candidate))

    if not candidates:
        return {"value": value, **{f"label::{lang}": value for lang in LANGUAGES}}

    project, chosen = candidates[0]
    for other_project, other in candidates[1:]:
        if other != chosen:
            logger.warning(
                "Calculation filter %s: value %r is labelled differently in projects %s and %s, keeping %s",
                column, value, project, other_project, project,
            )

    fr = chosen["fr"] or chosen["en"] or value
    en = chosen["en"] or chosen["fr"] or value
    return {"value": value, "label::fr": fr, "label::en": en}


def clean_label(label):
    # Empty label cells are NaN: JsonResponse would emit a bare NaN, which is invalid JSON.
    return None if is_blank(label) else str(label).strip()


def is_blank(value):
    if value in EMPTY_VALUES:
        return True
    if isinstance(value, str):
        return not value.strip()
    return bool(pd.isna(value))
