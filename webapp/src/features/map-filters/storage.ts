import { LAYERS } from "@shared/api/layers";

import type { GlobalFiltersState, LayerFiltersState } from "./types";

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

const read = <T>(key: string, fallback: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

/**
 * Read persisted filters outside React.
 *
 * `useLocalStorage` covers the component side; these are for `applyLayerFilter`,
 * which recomputes a layer's whole expression — per-layer *and* global — every
 * time either side changes, and for the map-ready initiator that runs before the
 * filter panels have mounted.
 */
export const readLayerFilters = (layerId: string): LayerFiltersState =>
  read<LayerFiltersState>(getLayerFiltersStorageKey(layerId), {});

export const readGlobalFilters = (): GlobalFiltersState =>
  read<GlobalFiltersState>(GLOBAL_FILTERS_STORAGE_KEY, {});
