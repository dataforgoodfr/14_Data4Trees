import type { CheckedState } from "@ui/checkbox";

import { useMapFiltersStore } from "./map-filters-provider";
import {
  FILTER_KINDS,
  type GlobalFilter,
  type GlobalFilterGroup,
} from "./types";

/** Same narrowing as the per-layer hook: checkboxes only handle `VALUES`. */
const getValuesFilter = (filter: GlobalFilter | undefined) =>
  filter?.kind === FILTER_KINDS.VALUES ? filter : undefined;

/**
 * Filters that apply to every layer at once, read from and written to the
 * shared `MapFiltersProvider` state.
 *
 * Changing one refreshes *all* layers, because MapLibre keeps a single filter
 * slot per layer and the per-layer clauses have to be re-composed with the new
 * global state.
 */
export const useGlobalFilters = () => {
  const { state, updateGlobalFilters } = useMapFiltersStore();
  const globalFilters = state.global;

  /** Spread onto a `<CheckboxGroup>` to bind it to `group`. */
  const getCheckboxGroupProps = (group: GlobalFilterGroup) => ({
    getIsChecked: (identifier: string) => {
      const selection = getValuesFilter(globalFilters[group.key]);
      // An untouched group restricts nothing, so every box reads as checked.
      if (!selection) return true;

      return selection.values.some((value) => String(value) === identifier);
    },

    getOnCheckedChange: (identifier: string) => (nextValue: CheckedState) => {
      updateGlobalFilters((previous) => {
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
