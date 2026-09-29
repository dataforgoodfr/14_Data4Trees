import { useEffect } from "react";

import { useLocalStorage } from "@shared/hooks/use-local-storage";
import { useMap } from "@shared/hooks/use-map-all4trees";

import type { CheckedState } from "@ui/checkbox";

import { refreshAllLayerFilters } from "./apply-layer-filter";
import { GLOBAL_FILTERS_STORAGE_KEY } from "./storage";
import {
  FILTER_KINDS,
  type FilterOption,
  type FilterValue,
  type GlobalFilter,
  type GlobalFilterGroup,
  type GlobalFiltersState,
} from "./types";

/** Same narrowing as the per-layer hook: checkboxes only handle `VALUES`. */
const getValuesFilter = (filter: GlobalFilter | undefined) =>
  filter?.kind === FILTER_KINDS.VALUES ? filter : undefined;

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
  leavesByLayer: Record<
    string,
    { property_name: string; values: FilterOption[] }
  >;
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

/**
 * Filters that apply to every layer at once, persisted in a single localStorage
 * entry separate from the per-layer ones.
 *
 * Changing one refreshes *all* layers, because MapLibre keeps a single filter
 * slot per layer and the per-layer clauses have to be re-composed with the new
 * global state.
 */
export const useGlobalFilters = () => {
  const { isReady, mapApiRef } = useMap();
  const [globalFilters, setGlobalFilters] = useLocalStorage<GlobalFiltersState>(
    GLOBAL_FILTERS_STORAGE_KEY,
    {},
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <refreshAllLayerFilters must be triggered when globalFilters are updated>
  useEffect(() => {
    const map = mapApiRef.current?.mapInstance;
    if (!isReady || !map) return;

    refreshAllLayerFilters({ map });
  }, [isReady, globalFilters, mapApiRef]);

  /** Spread onto a `<CheckboxGroup>` to bind it to `group`. */
  const getCheckboxGroupProps = (group: GlobalFilterGroup) => ({
    getIsChecked: (identifier: string) => {
      const selection = getValuesFilter(globalFilters[group.key]);
      // An untouched group restricts nothing, so every box reads as checked.
      if (!selection) return true;

      return selection.values.some((value) => String(value) === identifier);
    },

    getOnCheckedChange: (identifier: string) => (nextValue: CheckedState) => {
      setGlobalFilters((previous) => {
        const selectedIdentifiers = new Set(
          (
            getValuesFilter(previous[group.key])?.values ??
            group.options.map((option) => option.value)
          ).map(String),
        );

        if (nextValue === true) {
          selectedIdentifiers.add(identifier);
        } else {
          selectedIdentifiers.delete(identifier);
        }

        return {
          ...previous,
          [group.key]: {
            kind: FILTER_KINDS.VALUES,
            propertyNameByLayer: group.propertyNameByLayer,
            values: group.options
              .map((option) => option.value)
              .filter((value) => selectedIdentifiers.has(String(value))),
          },
        };
      });
    },
  });

  return { getCheckboxGroupProps, globalFilters };
};
