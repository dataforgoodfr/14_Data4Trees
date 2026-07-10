import { LAYERS } from "@entities/layers";

/**
 * Format of a layer: GROUP_BACKEND-NAME
 */
export const CATEGORY_IDENTIFIERS = {
  ACTION_BIO: `action::${LAYERS.INVENTORY_BIO}`,
  ACTION_DIVERSITY: "action-tree-diversity",
  ACTION_INVENTORY: `action::${LAYERS.INVENTORY_FOR}`,
  ACTION_SOCIO: `action::${LAYERS.ENQUETE}`,
  DATA_GROUND: "data-ground",
  DATA_MODEL: "data-model",
  DATA_SATELLITE: `data::${LAYERS.SATELLITE}`,
  SYSTEM_FOREST_PRIMARY: "system-forest-primary",
  SYSTEM_FOREST_SECONDARY: "system-forest-secondary",
  SYSTEM_MANGROVE_HIGH: "system-mangrove-high",
  SYSTEM_MANGROVE_LOW: "system-mangrove-low",
} as const;

/**
 * Parse from a category identifier the related backend layer name.
 * Return null if it can't retrieve the layer id.
 */
export const parseLayerId = (name: string) => {
  const parts = name.split("::");

  return parts.length > 1 ? parts[1] : null;
};

export type CategoryIdentifier =
  (typeof CATEGORY_IDENTIFIERS)[keyof typeof CATEGORY_IDENTIFIERS];

export type CategoriesFiltersState = Record<CategoryIdentifier, boolean>;
