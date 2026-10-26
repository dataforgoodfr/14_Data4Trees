import { LAYERS } from "@shared/api/layers";
import type { createMap } from "@shared/lib/coordo";

import { buildCalculationFilter } from "./build-where";
import { readCalculationFilters } from "./storage";
import type { CalculationFiltersState } from "./types";

type MapApi = ReturnType<typeof createMap>;

/**
 * Ask the backend to recompute the enquete layer from the rows matching
 * `state`, or restore the unfiltered data when it restricts nothing.
 *
 * Resolves once the new data is on the map. The display filters set with
 * `setSourceFilter` still apply on top: coordo keeps the source filter when it
 * replaces the data.
 *
 * Rejects when the request fails (the current data is kept), or with an
 * `AbortError` when a newer call supersedes it (see {@link isAbortError}).
 */
export const applyCalculationFilters = ({
  mapApi,
  state,
}: {
  mapApi: MapApi;
  state: CalculationFiltersState;
}) => {
  const filters = buildCalculationFilter(state);

  return filters
    ? mapApi.setLayerFilters({ filters, layerId: LAYERS.ENQUETE })
    : mapApi.clearLayerFilters(LAYERS.ENQUETE);
};

/** Coordo cancels a request when a newer one for the same layer starts. */
export const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

/**
 * Replay the applied filters onto a freshly loaded map.
 *
 * Runs from the map provider on MAP_READY, not from the panel: the sidebar
 * keeps it in a hidden `<Activity>` until its tab is opened, so its effects
 * would not have run yet. Nothing is sent for an empty state, the style
 * already serves the unfiltered data.
 */
export const replayCalculationFilters = ({ mapApi }: { mapApi: MapApi }) => {
  const state = readCalculationFilters();
  if (Object.keys(state).length === 0) return;

  applyCalculationFilters({ mapApi, state }).catch((error: unknown) => {
    // Superseded by an "Apply" clicked before the replay finished.
    if (isAbortError(error)) return;
    console.error(error);
  });
};
