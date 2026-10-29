import json
from types import SimpleNamespace
from unittest.mock import patch

import pandas as pd
from django.test import SimpleTestCase

from maps.constants import ALL4TREES_LAYERS, LAYER_ENQUETE
from maps.services import user_map
from maps.services.calculation_filters import (
	get_calculation_filters,
	get_list_options,
)
from maps.services.filters import (
	get_filter_values,
	get_labelized_value,
	get_label_list_name,
	get_label_name_type,
)
from users.models import ADMIN_PROJECT


class FiltersServiceTest(SimpleTestCase):
	@staticmethod
	def label_data():
		return pd.DataFrame(
			{
				"proj": ["project-a", "project-a", "project-a"],
				"list_name": ["typ", "typ", "ass"],
				"name": [1.0, 2.0, "ass1"],
				"label::fr": ["Type 1", "Type 2", "Pelle"],
				"label::en": ["Type 1", "Type 2", "Shovel"],
			}
		)

	def test_get_labelized_value_matches_integer_property_to_float_name(self):
		result = get_labelized_value(
			{"project": "project-a", "type": 1},
			"type",
			self.label_data(),
		)

		self.assertEqual(
			result,
			{
				"value": 1,
				"label::fr": "Type 1",
				"label::en": "Type 1",
			},
		)

	def test_get_labelized_value_returns_value_when_label_is_missing(self):
		result = get_labelized_value(
			{"project": "project-a", "type": 3},
			"type",
			self.label_data(),
		)

		self.assertEqual(
			result,
			{
				"value": 3,
				"label::fr": 3,
				"label::en": 3,
			},
		)

	@patch("maps.services.filters.get_resource")
	def test_get_filter_values_returns_labeled_distinct_values(self, get_resource):
		get_resource.return_value = self.label_data()
		layer_data = [
			{"project": "project-a", "type": 2},
			{"project": "project-a", "type": 1},
			{"project": "project-a", "type": 1},
		]

		result = get_filter_values("inventaire_for", layer_data, "type")

		self.assertEqual(result["property_name"], "type")
		self.assertEqual(
			result["values"],
			[
				{
					"value": 1,
					"label::fr": "Type 1",
					"label::en": "Type 1",
				},
				{
					"value": 2,
					"label::fr": "Type 2",
					"label::en": "Type 2",
				},
			],
		)

	def test_label_property_configuration(self):
		self.assertEqual(get_label_list_name("type"), "typ")
		self.assertIs(get_label_name_type("type"), float)
		self.assertEqual(get_label_list_name("year"), "year")
		self.assertIs(get_label_name_type("year"), int)


class UserMapServiceTest(SimpleTestCase):
	PROJECT_FILTER = "proj = 'project-a' or conf = 1"

	@staticmethod
	def user(project):
		return SimpleNamespace(is_authenticated=True, project=project)

	def test_user_maps_do_not_share_layers(self):
		map_a = user_map.get_user_map(self.user("project-a"))
		map_admin = user_map.get_user_map(self.user(ADMIN_PROJECT))

		for layer_id in ALL4TREES_LAYERS:
			self.assertIsNot(map_a._get_layer(layer_id), map_admin._get_layer(layer_id))

	def test_user_map_keeps_its_restriction_after_another_user_map_is_built(self):
		map_a = user_map.get_user_map(self.user("project-a"))
		# Concurrent request: another user's map is built before map_a is read.
		user_map.get_user_map(self.user(ADMIN_PROJECT))
		user_map.get_user_map(SimpleNamespace(is_authenticated=False, project=None))

		for layer_id in ALL4TREES_LAYERS:
			self.assertEqual(map_a._get_layer(layer_id).filter, self.PROJECT_FILTER)

	def test_get_user_map_leaves_the_shared_map_untouched(self):
		user_map.get_user_map(self.user("project-a"))

		for layer_id in ALL4TREES_LAYERS:
			self.assertIsNone(user_map.map._get_layer(layer_id).filter)


class CalculationFiltersServiceTest(SimpleTestCase):
	LABELS = pd.DataFrame(
		{
			"proj": ["project-a"] * 11 + ["project-b"],
			"list_name": ["typ", "typ", "typ", "coh", "coh", "urb_rur", "urb_rur", "educ", "inc_sit", "inc", "sex", "typ"],
			"name": ["2", "10", "1", "2024", "2021", "1", "2", "1", "1", "12", "1", "2"],
			"label::fr": ["Direct", "Dix", "Un", "2023-2024", "2020-2021", "Urbain", "Rural", "Aucun", float("nan"), "Autre", "Homme", "Direct (B)"],
			"label::en": ["Direct", "Ten", " ", "2023-2024", "2020-2021", "Urban", "Rural", float("nan"), float("nan"), "Other", "Male", "Direct (B)"],
		}
	)

	def setUp(self):
		patcher = patch("maps.services.calculation_filters.get_resource", return_value=self.LABELS)
		patcher.start()
		self.addCleanup(patcher.stop)

	@staticmethod
	def options(result, column):
		return {option["value"]: option for option in result["filters"][column]["values"]}

	def test_shape_and_display_order(self):
		result = get_calculation_filters()

		self.assertEqual(result["layer_id"], LAYER_ENQUETE)
		self.assertEqual(
			list(result["filters"]),
			["typ", "coh", "urb_rur", "sex", "age", "educ", "inc_main", "inc_sit"],
		)
		self.assertEqual(result["filters"]["coh"]["kind"], "range")
		self.assertEqual(result["filters"]["age"]["kind"], "range")
		self.assertEqual(result["filters"]["typ"]["kind"], "values")
		for column, config in result["filters"].items():
			self.assertEqual(config["property_name"], column)

	def test_list_options_come_from_the_form_list_in_natural_order(self):
		result = get_calculation_filters()

		self.assertEqual(list(self.options(result, "typ")), ["1", "2", "10"])
		self.assertEqual(
			[option["label::fr"] for option in result["filters"]["coh"]["values"]],
			["2020-2021", "2023-2024"],
		)
		# inc_main is labelled by the `inc` list.
		self.assertEqual(self.options(result, "inc_main")["12"]["label::en"], "Other")

	def test_age_uses_predefined_brackets(self):
		result = get_calculation_filters()

		self.assertEqual(list(self.options(result, "age")), ["1", "2", "3", "4"])
		self.assertEqual(self.options(result, "age")["4"]["label::en"], "Over 65")

	def test_missing_option(self):
		filters = get_calculation_filters()["filters"]

		self.assertEqual(
			filters["age"]["missing"],
			{"values": ["98", "99"], "include_null": True, "label::fr": "Non renseigné", "label::en": "Not provided"},
		)
		self.assertEqual(filters["urb_rur"]["missing"]["values"], [])
		self.assertTrue(filters["urb_rur"]["missing"]["include_null"])
		self.assertEqual(list(self.options(get_calculation_filters(), "urb_rur")), ["1", "2"])
		self.assertIsNone(filters["sex"]["missing"])

	def test_labels_with_language_and_raw_value_fallbacks(self):
		result = get_calculation_filters()

		# Missing English label: French one.
		self.assertEqual(self.options(result, "educ")["1"], {"value": "1", "label::fr": "Aucun", "label::en": "Aucun"})
		# Blank English label: French one.
		self.assertEqual(self.options(result, "typ")["1"]["label::en"], "Un")
		# Empty label cells: raw value.
		self.assertEqual(self.options(result, "inc_sit")["1"], {"value": "1", "label::fr": "1", "label::en": "1"})
		# A list absent from the label resource has no options.
		self.assertEqual(get_list_options(self.LABELS, "unknown", "unknown"), [])

	def test_response_is_strict_json(self):
		json.dumps(get_calculation_filters(), allow_nan=False)

	def test_conflicting_labels_keep_the_first_project_and_warn(self):
		with self.assertLogs("maps.services.calculation_filters", level="WARNING") as logs:
			options = get_list_options(self.LABELS, "typ", "typ")

		self.assertEqual(
			[option for option in options if option["value"] == "2"],
			[{"value": "2", "label::fr": "Direct", "label::en": "Direct"}],
		)
		self.assertIn("project-b", logs.output[0])
