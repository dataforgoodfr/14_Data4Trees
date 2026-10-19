import { LAYERS } from "@shared/api/layers";

const SEPARATOR = ":::";

/**
 * Format of a layer: GROUP_BACKEND-NAME
 */
export const CATEGORY_IDENTIFIERS = {
  ACTION_INVENTORY_BIO: `action${SEPARATOR}${LAYERS.INVENTORY_BIO}`,
  ACTION_INVENTORY_FOR: `action${SEPARATOR}${LAYERS.INVENTORY_FOR}`,
  ACTION_SOCIO: `action${SEPARATOR}${LAYERS.ENQUETE}`,
} as const;

/**
 * Parse from a category identifier the related backend layer name.
 * Return null if it can't retrieve the layer id.
 */
export const parseLayerId = (name: string) => {
  const parts = name.split(SEPARATOR);

  return parts.length > 1 ? parts[1] : null;
};

export type CategoryIdentifier =
  (typeof CATEGORY_IDENTIFIERS)[keyof typeof CATEGORY_IDENTIFIERS];

export type CategoriesFiltersState = Record<CategoryIdentifier, boolean>;
