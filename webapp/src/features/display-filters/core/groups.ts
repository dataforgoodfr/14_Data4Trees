import type { FilterOption, FilterValue } from "@features/base-filters";

import type { Filters } from "@shared/api/types";

import {
  GLOBAL_GROUP_KEYS,
  type GroupKey,
  LAYER_GROUP_KEYS,
} from "./constants";
import type { FilterGroup, GlobalFilterGroup } from "./types";

/** One group of one layer in the `getFilters()` payload. */
type FilterLeaf = { property_name: string; values: FilterOption[] };

/**
 * The payload's leaf of a group on a layer, or `undefined` when the layer does
 * not expose that group. `Filters` is typed per key, hence the widening.
 */
const getLeaf = (filters: Filters, key: GroupKey, layerId: string) =>
  (filters[key] as Record<string, FilterLeaf | undefined>)[layerId];

/** The checkbox groups of a layer panel, in display order. */
export const getLayerGroups = (
  filters: Filters,
  layerId: string,
): (FilterGroup & { key: GroupKey })[] =>
  (LAYER_GROUP_KEYS[layerId] ?? []).flatMap((key) => {
    const leaf = getLeaf(filters, key, layerId);
    return leaf
      ? [{ key, options: leaf.values, propertyName: leaf.property_name }]
      : [];
  });

/**
 * Build a global group from the per-layer leaves the API returns for one filter
 * key, e.g. `filters.year`.
 *
 * The checkbox list is the union of every layer's values — a year present on a
 * single layer still has to be offered — while `propertyNameByLayer` keeps each
 * layer's own property so the expression can be resolved per layer later.
 *
 * Options are deduplicated on their raw value, keeping the first layer's
 * labels: a global filter only makes sense for a concept whose values mean the
 * same thing on every layer, so the labels agree too.
 */
export const buildGlobalFilterGroup = ({
  key,
  leavesByLayer,
}: {
  key: string;
  leavesByLayer: Record<string, FilterLeaf>;
}): GlobalFilterGroup => {
  const entries = Object.entries(leavesByLayer);

  const optionsByValue = new Map<FilterValue, FilterOption>();
  for (const [, leaf] of entries) {
    for (const option of leaf.values) {
      if (!optionsByValue.has(option.value)) {
        optionsByValue.set(option.value, option);
      }
    }
  }

  const options = Array.from(optionsByValue.values()).sort((a, b) =>
    String(a.value).localeCompare(String(b.value), undefined, {
      numeric: true,
    }),
  );

  return {
    key,
    options,
    propertyNameByLayer: Object.fromEntries(
      entries.map(([layerId, leaf]) => [layerId, leaf.property_name]),
    ),
  };
};

/** The checkbox groups of the all-layers panel. */
export const getGlobalGroups = (filters: Filters): GlobalFilterGroup[] =>
  GLOBAL_GROUP_KEYS.map((key) =>
    buildGlobalFilterGroup({
      key,
      leavesByLayer: filters[key] as Record<string, FilterLeaf>,
    }),
  );
