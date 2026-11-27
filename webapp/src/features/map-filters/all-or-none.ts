import type { FilterOption } from "@features/base-filters";

import type { Filters } from "@shared/api/types";

import { getGlobalGroups, getLayerGroups } from "./groups";
import { FILTERABLE_LAYERS } from "./storage";
import {
  FILTER_KINDS,
  type GlobalFilter,
  type LayerFilter,
  type MapFiltersState,
} from "./types";

/*
 * Pure helpers behind the display tab's All / None toggle. They work on the
 * whole state at once, so a bulk change is a single update and a single map
 * refresh.
 */

/** "All": every group absent, which restricts nothing. */
export const getUnrestrictedMapFilters = (): MapFiltersState => ({
  byLayer: Object.fromEntries(
    FILTERABLE_LAYERS.map((layerId) => [layerId, {}]),
  ),
  global: {},
});

/**
 * "None": every group the panels offer is present with nothing selected, so
 * the boxes read unchecked and every feature is hidden.
 */
export const getEmptyMapFilters = (filters: Filters): MapFiltersState => ({
  byLayer: Object.fromEntries(
    FILTERABLE_LAYERS.map((layerId) => [
      layerId,
      Object.fromEntries(
        getLayerGroups(filters, layerId).map((group) => [
          group.key,
          {
            kind: FILTER_KINDS.VALUES,
            propertyName: group.propertyName,
            values: [],
          },
        ]),
      ),
    ]),
  ),
  global: Object.fromEntries(
    getGlobalGroups(filters).map((group) => [
      group.key,
      {
        kind: FILTER_KINDS.VALUES,
        propertyNameByLayer: group.propertyNameByLayer,
        values: [],
      },
    ]),
  ),
});

/** Nothing is stored for the group, or the stored filter selects every option. */
const isFullSelection = (
  filter: LayerFilter | GlobalFilter | undefined,
  options: FilterOption[],
) =>
  filter === undefined ||
  (filter.kind === FILTER_KINDS.VALUES &&
    options.every((option) =>
      filter.values.some((value) => String(value) === String(option.value)),
    ));

const isEmptySelection = (filter: LayerFilter | GlobalFilter | undefined) =>
  filter?.kind === FILTER_KINDS.VALUES && filter.values.length === 0;

/** Every stored entry belongs to an offered group and selects all its options. */
const areEntriesUnrestricted = (
  entries: Record<string, LayerFilter | GlobalFilter>,
  groups: { key: string; options: FilterOption[] }[],
) =>
  Object.entries(entries).every(([key, filter]) => {
    const group = groups.find((candidate) => candidate.key === key);
    return group !== undefined && isFullSelection(filter, group.options);
  });

/**
 * Whether the display filters restrict nothing, i.e. every box is checked.
 *
 * A stored group the panels no longer offer still applies on the map, so it
 * counts as a restriction.
 */
export const isMapFiltersUnrestricted = (
  state: MapFiltersState,
  filters: Filters,
) =>
  FILTERABLE_LAYERS.every((layerId) =>
    areEntriesUnrestricted(
      state.byLayer[layerId] ?? {},
      getLayerGroups(filters, layerId),
    ),
  ) && areEntriesUnrestricted(state.global, getGlobalGroups(filters));

/** Whether every group the panels offer has nothing selected. */
export const isMapFiltersEmpty = (state: MapFiltersState, filters: Filters) =>
  FILTERABLE_LAYERS.every((layerId) =>
    getLayerGroups(filters, layerId).every((group) =>
      isEmptySelection(state.byLayer[layerId]?.[group.key]),
    ),
  ) &&
  getGlobalGroups(filters).every((group) =>
    isEmptySelection(state.global[group.key]),
  );
