import type { CheckedState } from "@ui/checkbox";

import { useMapFiltersStore } from "./map-filters-provider";
import {
  FILTER_KINDS,
  type FilterGroup,
  type LayerFilter,
  type ValuesFilter,
} from "./types";

/**
 * Checkboxes can only read and write `VALUES` filters. Another kind stored under
 * the same group key (a range, say) is left untouched and reads as "no
 * restriction" here — its own widget owns it.
 */
const getValuesFilter = (
  filter: LayerFilter | undefined,
): ValuesFilter | undefined =>
  filter?.kind === FILTER_KINDS.VALUES ? filter : undefined;

/**
 * One layer's display filters, read from and written to the shared
 * `MapFiltersProvider` state, which persists them and refreshes the layer.
 */
export const useLayerFilters = ({ layerId }: { layerId: string }) => {
  const { state, updateLayerFilters } = useMapFiltersStore();
  const layerFilters = state.byLayer[layerId] ?? {};

  /** Spread onto a `<CheckboxGroup>` to bind it to `group`. */
  const getCheckboxGroupProps = (group: FilterGroup) => ({
    /**
     * A checkbox is checked when
     * - either the group is untouched (no restrictions)
     * - the checkbox identifier matches one of the selected values
     */
    getIsChecked: (identifier: string) => {
      const selection = getValuesFilter(layerFilters[group.key]);
      // An untouched group restricts nothing, so every box reads as checked.
      if (!selection) return true;

      return selection.values.some((value) => String(value) === identifier);
    },

    getOnCheckedChange: (identifier: string) => (nextValue: CheckedState) => {
      updateLayerFilters(layerId, (previous) => {
        // First interaction with a group starts from "everything selected",
        // matching what the boxes were showing.
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
            propertyName: group.propertyName,
            // Rebuilt from the API list, so order is preserved and values the
            // backend no longer serves drop out on their own.
            values: group.options
              .map((option) => option.value)
              .filter((value) => selectedIdentifiers.has(String(value))),
          },
        };
      });
    },
  });

  return { getCheckboxGroupProps, layerFilters };
};
