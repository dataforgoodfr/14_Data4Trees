import { LAYERS } from "@shared/api/layers";

import type { LayerFiltersState } from "./types";

/** Layers that expose a per-layer filter panel — one localStorage entry each. */
export const FILTERABLE_LAYERS: string[] = [LAYERS.INVENTORY_FOR];

export const getLayerFiltersStorageKey = (layerId: string) =>
  `d4g:map-filters:${layerId}`;

/**
 * Read a layer's persisted filters outside React.
 *
 * `useLocalStorage` covers the component side; this is for the map-ready
 * initiator, which runs before (and independently of) the filter panel.
 */
export const readLayerFilters = (layerId: string): LayerFiltersState => {
  try {
    const item = window.localStorage.getItem(
      getLayerFiltersStorageKey(layerId),
    );
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.error(error);
    return {};
  }
};
