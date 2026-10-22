from types import SimpleNamespace
from unittest.mock import patch

import pandas as pd
from django.test import SimpleTestCase

from maps.constants import ALL4TREES_LAYERS
from maps.services import user_map
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
