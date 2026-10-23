import json
import tempfile
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import pandas as pd
from coordo.map import Map
from django.test import SimpleTestCase

from maps.constants import ALL4TREES_LAYERS, LAYER_ENQUETE
from maps.services import user_map
from maps.services.calculation_filters import (
	CALCULATION_FILTERS,
	get_calculation_filters,
	get_column_values,
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
	MENAGE = pd.DataFrame(
		{
			"proj": ["project-a", "project-a", "project-b", "project-b", "project-b"],
			"conf": ["0", "1", "0", "1", "0"],
			"typ": ["10", "2", "1", "98", None],
			"coh": ["2024", "2021", None, "2023", "2022"],
			"urb_rur": [None, None, None, None, None],
			"sex": ["1", "2", "1", "1", " "],
			"age": ["1", "98", "2", "99", "1"],
			"educ": ["1", "2", "3", "4", "5"],
			"inc_main": ["1", "12", "2", "9", "1"],
			"inc_sit": ["1", "2", "3", "99", "1"],
		}
	)

	LABELS = pd.DataFrame(
		{
			"proj": ["project-a", "project-a", "project-b", "project-a", "project-a", "project-a"],
			"list_name": ["typ", "typ", "typ", "educ", "inc_sit", "inc"],
			"name": ["2", "10", "2", "1", "1", "12"],
			"label::fr": ["Direct", "Dix", "Direct (B)", "Aucun", float("nan"), "Autre"],
			"label::en": ["Direct", "Ten", "Direct (B)", float("nan"), float("nan"), "Other"],
		}
	)

	def setUp(self):
		tmp = tempfile.TemporaryDirectory()
		self.addCleanup(tmp.cleanup)
		root = Path(tmp.name)

		package = root / "enquete"
		package.mkdir()
		self.MENAGE.to_parquet(package / "enquete_menage.parquet", index=False)
		(package / "datapackage.json").write_text(json.dumps({
			"name": "enquete",
			"resources": [{
				"name": "enquete_menage",
				"path": "enquete_menage.parquet",
				"schema": {"fields": [{"name": name, "type": "string"} for name in self.MENAGE.columns]},
			}],
		}))

		config = root / "config.json"
		config.write_text(json.dumps({
			"layers": [
				{"id": layer_id, "type": "datapackage", "path": "enquete", "resource": "enquete_menage"}
				for layer_id in ALL4TREES_LAYERS
			],
			"controls": [],
		}))

		patcher = patch.object(user_map, "map", Map.from_file(config))
		patcher.start()
		self.addCleanup(patcher.stop)

		patcher = patch("maps.services.calculation_filters.get_resource", return_value=self.LABELS)
		patcher.start()
		self.addCleanup(patcher.stop)

	def filters_for(self, user):
		return get_calculation_filters(user_map.get_user_map(user))

	@staticmethod
	def values(result, column):
		return [option["value"] for option in result["filters"][column]["values"]]

	def test_shape_and_display_order(self):
		result = self.filters_for(SimpleNamespace(is_authenticated=True, project=ADMIN_PROJECT))

		self.assertEqual(result["layer_id"], LAYER_ENQUETE)
		self.assertEqual(
			list(result["filters"]),
			["typ", "coh", "urb_rur", "sex", "age", "educ", "inc_main", "inc_sit"],
		)
		self.assertEqual(list(result["filters"]), list(CALCULATION_FILTERS))
		self.assertEqual(result["filters"]["coh"]["kind"], "range")
		self.assertEqual(result["filters"]["typ"]["kind"], "values")
		for column, config in result["filters"].items():
			self.assertEqual(config["property_name"], column)

	def test_values_are_restricted_to_the_rows_the_user_may_see(self):
		project_a = self.filters_for(SimpleNamespace(is_authenticated=True, project="project-a"))
		project_b = self.filters_for(SimpleNamespace(is_authenticated=True, project="project-b"))
		anonymous = self.filters_for(SimpleNamespace(is_authenticated=False, project=None))
		admin = self.filters_for(SimpleNamespace(is_authenticated=True, project=ADMIN_PROJECT))

		# project-a rows, plus project-b's public row.
		self.assertEqual(self.values(project_a, "typ"), ["2", "10", "98"])
		# project-b rows, plus project-a's public row.
		self.assertEqual(self.values(project_b, "typ"), ["1", "2", "98"])
		# Public rows only.
		self.assertEqual(self.values(anonymous, "typ"), ["2", "98"])
		self.assertEqual(self.values(admin, "typ"), ["1", "2", "10", "98"])

	def test_natural_order_and_sentinels(self):
		result = self.filters_for(SimpleNamespace(is_authenticated=True, project=ADMIN_PROJECT))

		self.assertEqual(self.values(result, "age"), ["1", "2", "98", "99"])
		self.assertEqual(self.values(result, "coh"), ["2021", "2022", "2023", "2024"])

	def test_blank_values_are_dropped_and_an_empty_column_has_no_values(self):
		result = self.filters_for(SimpleNamespace(is_authenticated=True, project=ADMIN_PROJECT))

		self.assertEqual(self.values(result, "sex"), ["1", "2"])
		self.assertEqual(result["filters"]["urb_rur"]["values"], [])

	def test_labels_with_language_and_raw_value_fallbacks(self):
		result = self.filters_for(SimpleNamespace(is_authenticated=True, project=ADMIN_PROJECT))
		options = {
			column: {option["value"]: option for option in result["filters"][column]["values"]}
			for column in ("typ", "educ", "inc_sit", "inc_main")
		}

		self.assertEqual(options["typ"]["10"], {"value": "10", "label::fr": "Dix", "label::en": "Ten"})
		# Missing English label: French one.
		self.assertEqual(options["educ"]["1"], {"value": "1", "label::fr": "Aucun", "label::en": "Aucun"})
		# Empty label cells: raw value.
		self.assertEqual(options["inc_sit"]["1"], {"value": "1", "label::fr": "1", "label::en": "1"})
		# No label row at all: raw value.
		self.assertEqual(options["typ"]["98"], {"value": "98", "label::fr": "98", "label::en": "98"})
		# inc_main is labelled by the `inc` list.
		self.assertEqual(options["inc_main"]["12"]["label::en"], "Other")

	def test_response_is_strict_json(self):
		result = self.filters_for(SimpleNamespace(is_authenticated=True, project=ADMIN_PROJECT))

		json.dumps(result, allow_nan=False)

	def test_conflicting_labels_keep_the_first_project_and_warn(self):
		rows = pd.DataFrame({"proj": ["project-b", "project-a"], "typ": ["2", "2"]})

		with self.assertLogs("maps.services.calculation_filters", level="WARNING") as logs:
			values = get_column_values(rows, "typ", self.LABELS, "typ")

		self.assertEqual(values, [{"value": "2", "label::fr": "Direct", "label::en": "Direct"}])
		self.assertIn("project-b", logs.output[0])
