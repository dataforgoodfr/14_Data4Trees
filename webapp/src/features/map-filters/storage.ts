import { readStorage, writeStorage } from "@features/base-filters";

import { LAYERS } from "@shared/api/layers";

import type {
  GlobalFiltersState,
  LayerFiltersState,
  MapFiltersState,
} from "./types";

/**
 * Layers the filters are pushed to. A per-layer panel only touches its own
 * entry, but a global filter is applied to every layer in this list, so a layer
 * must be listed here to be reachable by the year filter.
 */
export const FILTERABLE_LAYERS: string[] = [
  LAYERS.INVENTORY_FOR,
  LAYERS.INVENTORY_BIO,
  LAYERS.ENQUETE,
];

const STORAGE_PREFIX = "d4g:map-filters";

export const getLayerFiltersStorageKey = (layerId: string) =>
  `${STORAGE_PREFIX}:${layerId}`;

/** Global filters live in their own entry, outside any layer namespace. */
export const GLOBAL_FILTERS_STORAGE_KEY = `${STORAGE_PREFIX}:__global__`;

/**
 * Read persisted filters outside React.
 *
 * `applyLayerFilter` recomputes a layer's whole expression — per-layer *and*
 * global — from storage, which also lets the map-ready initiator replay them
 * before the filter panels have mounted.
 */
export const readLayerFilters = (layerId: string): LayerFiltersState =>
  readStorage<LayerFiltersState>(getLayerFiltersStorageKey(layerId), {});

export const readGlobalFilters = (): GlobalFiltersState =>
  readStorage<GlobalFiltersState>(GLOBAL_FILTERS_STORAGE_KEY, {});

/** Every entry at once, to initialise the shared panel state. */
export const readMapFilters = (): MapFiltersState => ({
  byLayer: Object.fromEntries(
    FILTERABLE_LAYERS.map((layerId) => [layerId, readLayerFilters(layerId)]),
  ),
  global: readGlobalFilters(),
});

export const writeLayerFilters = (
  layerId: string,
  layerFilters: LayerFiltersState,
) => writeStorage(getLayerFiltersStorageKey(layerId), layerFilters);

export const writeGlobalFilters = (globalFilters: GlobalFiltersState) =>
  writeStorage(GLOBAL_FILTERS_STORAGE_KEY, globalFilters);
