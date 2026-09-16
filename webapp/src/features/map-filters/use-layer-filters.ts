import { useEffect } from "react";

import { useLocalStorage } from "@shared/hooks/use-local-storage";
import { useMap } from "@shared/hooks/use-map-all4trees";

import type { CheckedState } from "@ui/checkbox";

import { refreshLayerFilter } from "./apply-layer-filter";
import { getLayerFiltersStorageKey } from "./storage";
import {
  FILTER_KINDS,
  type FilterGroup,
  type LayerFilter,
  type LayerFiltersState,
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
 * Persisted per-layer filter state, kept in sync with the map.
 *
 * The map is updated whenever the selection changes; the reload case is handled
 * upstream by `syncInitialLayerFilters` on MAP_READY.
 */
export const useLayerFilters = ({ layerId }: { layerId: string }) => {
  const { isReady, mapApiRef } = useMap();
  const [layerFilters, setLayerFilters] = useLocalStorage<LayerFiltersState>(
    getLayerFiltersStorageKey(layerId),
    {},
  );

  // `layerFilters` is the trigger, not the input: the refresh re-reads both this
  // layer's entry and the global one from localStorage so the two compose.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <refreshAllLayerFilters must be triggered when globalFilters are updated>
  useEffect(() => {
    const map = mapApiRef.current?.mapInstance;
    if (!isReady || !map) return;

    refreshLayerFilter({ layerId, map });
  }, [isReady, layerFilters, layerId, mapApiRef]);

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
      setLayerFilters((previous) => {
        // First interaction with a group starts from "everything selected",
        // matching what the boxes were showing.
        const selectedIdentifiers = new Set(
          (getValuesFilter(previous[group.key])?.values ?? group.values).map(
            String,
          ),
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
            values: group.values.filter((value) =>
              selectedIdentifiers.has(String(value)),
            ),
          },
        };
      });
    },
  });

  return { getCheckboxGroupProps, layerFilters };
};
