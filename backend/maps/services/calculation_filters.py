import json
import logging

import pandas as pd
from django.conf import settings

from data_catalog.services.catalog import get_resource

from ..constants import LABEL_RESOURCE_BY_LAYER
from .filters import EMPTY_VALUES, sort_filter_values

logger = logging.getLogger(__name__)

########## CALCULATION FILTERS CONFIGURATION ##########

# Calculation filters restrict the raw survey rows *before* the enquete layer
# aggregates them. Their options are every choice the form allows, whatever the
# data: the choice lists are generic, so showing them all discloses nothing.
#
# Each filter gets its options from either:
#   - list_name: the form's choice list in the layer's label resource (hh_label)
#   - values: a predefined list, with its labels
# and may declare a "missing" option, which stands for the "not provided" codes
# and/or null.
#
# Key order of "filters" is the display order.
CONFIG_PATH = settings.BASE_DIR / "configs" / "calculation_filters.json"

LANGUAGES = ("fr", "en")

########## CALCULATION FILTERS ENTRYPOINT ##########


def get_calculation_filters():
    """
    Options of each calculation filter:

        {"layer_id": ..., "filters": {column: {"kind", "property_name", "values", "missing"}}}
    """
    config = load_config()
    layer_id = config["layer_id"]
    label_data = get_resource(layer_id, LABEL_RESOURCE_BY_LAYER[layer_id])

    return {
        "layer_id": layer_id,
        "filters": {
            column: {
                "kind": filter_config["kind"],
                "property_name": column,
                "values": get_options(filter_config, label_data, column),
                "missing": get_missing_option(filter_config, config["missing_label"]),
            }
            for column, filter_config in config["filters"].items()
        },
    }


def load_config():
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


########## OPTIONS ##########


def get_options(filter_config, label_data, column):
    if "values" in filter_config:
        return filter_config["values"]
    return get_list_options(label_data, filter_config["list_name"], column)


def get_missing_option(filter_config, missing_label):
    missing = filter_config.get("missing")
    if missing is None:
        return None
    return {
        "values": missing.get("values", []),
        "include_null": missing.get("include_null", False),
        **missing_label,
    }


def get_list_options(label_data, list_name, column):
    """
    Every choice of a form list, in natural order, with its labels.
    """
    choices = label_data[label_data["list_name"] == list_name]
    values = {str(value) for value in choices["name"] if not is_blank(value)}

    return [
        get_labels(value, choices[choices["name"].astype(str) == value], column)
        for value in sort_filter_values(list(values))
    ]


def get_labels(value, choice_rows, column):
    """
    fr/en labels of a choice.

    A choice listed by several projects takes the first project's labels. A
    missing language falls back to the other language, then to the raw value.
    """
    candidates = []
    for project, rows in choice_rows.groupby("proj", sort=True):
        row = rows.iloc[0]
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
