import { LAYERS } from "./layers";

/**
 * Format of a layer: GROUP_BACKEND-NAME
 */
export const CATEGORY_IDENTIFIERS = {
  ACTION_DIVERSITY: "action-tree-diversity",
  ACTION_INVENTARY: `action-forest_${LAYERS.INVENTARY}`,
  ACTION_SOCIO: "action-socio-eco",
  DATA_GROUND: "data-ground",
  DATA_MODEL: "data-model",
  DATA_SATELLITE: `data_${LAYERS.SATELLITE}`,
  SYSTEM_FOREST_PRIMARY: "system-forest-primary",
  SYSTEM_FOREST_SECONDARY: "system-forest-secondary",
  SYSTEM_MANGROVE_HIGH: "system-mangrove-high",
  SYSTEM_MANGROVE_LOW: "system-mangrove-low",
} as const;

export const parseLayerId = (name: string) => {
  const parts = name.split("_");

  return parts.length > 1 ? parts[1] : null;
};

export type CategoryIdentifier =
  (typeof CATEGORY_IDENTIFIERS)[keyof typeof CATEGORY_IDENTIFIERS];

export type CategoriesFiltersState = Record<CategoryIdentifier, boolean>;
