import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";

import { useMap } from "@shared/hooks/use-map-all4trees";
import type { MapInstance } from "@shared/lib/coordo";

import {
  refreshAllLayerFilters,
  refreshLayerFilter,
} from "./apply-layer-filter";
import {
  readMapFilters,
  writeGlobalFilters,
  writeLayerFilters,
} from "./storage";
import type {
  GlobalFiltersState,
  LayerFiltersState,
  MapFiltersState,
} from "./types";

type MapFiltersContextValue = {
  state: MapFiltersState;
  /** Change one layer's filters; only that layer is refreshed. */
  updateLayerFilters: (
    layerId: string,
    update: (previous: LayerFiltersState) => LayerFiltersState,
  ) => void;
  /** Change the all-layers filters; every layer is refreshed. */
  updateGlobalFilters: (
    update: (previous: GlobalFiltersState) => GlobalFiltersState,
  ) => void;
  /** Replace everything at once (All / None): one update, one refresh. */
  replaceMapFilters: (next: MapFiltersState) => void;
};

const MapFiltersContext = createContext<MapFiltersContextValue | undefined>(
  undefined,
);

/**
 * The display filters of every panel, in a single React state.
 *
 * Each panel used to own a `useLocalStorage` copy of its entry, and those
 * copies never sync: a toggle writing several entries would have left the
 * other panels' boxes stale. Here every change goes through one state, is
 * persisted, then pushed to the map.
 *
 * The map is refreshed only once it is ready: before that, the map provider
 * replays the persisted state on MAP_READY.
 */
export const MapFiltersProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isReady, mapApiRef } = useMap();
  const [state, setState] = useState<MapFiltersState>(readMapFilters);
  // Latest state, so that updates fired in the same tick build on each other.
  const stateRef = useRef(state);

  /**
   * Callers write storage first: `applyLayerFilter` reads it to compose each
   * layer's per-layer and global clauses.
   */
  const commit = (
    next: MapFiltersState,
    refresh: (map: MapInstance) => void,
  ) => {
    stateRef.current = next;
    setState(next);

    const map = mapApiRef.current?.mapInstance;
    if (isReady && map) {
      refresh(map);
    }
  };

  const updateLayerFilters: MapFiltersContextValue["updateLayerFilters"] = (
    layerId,
    update,
  ) => {
    const previous = stateRef.current;
    const layerFilters = update(previous.byLayer[layerId] ?? {});

    writeLayerFilters(layerId, layerFilters);
    commit(
      {
        ...previous,
        byLayer: { ...previous.byLayer, [layerId]: layerFilters },
      },
      (map) => refreshLayerFilter({ layerId, map }),
    );
  };

  const updateGlobalFilters: MapFiltersContextValue["updateGlobalFilters"] = (
    update,
  ) => {
    const previous = stateRef.current;
    const globalFilters = update(previous.global);

    writeGlobalFilters(globalFilters);
    commit({ ...previous, global: globalFilters }, (map) =>
      refreshAllLayerFilters({ map }),
    );
  };

  const replaceMapFilters: MapFiltersContextValue["replaceMapFilters"] = (
    next,
  ) => {
    for (const [layerId, layerFilters] of Object.entries(next.byLayer)) {
      writeLayerFilters(layerId, layerFilters);
    }
    writeGlobalFilters(next.global);
    commit(next, (map) => refreshAllLayerFilters({ map }));
  };

  return (
    <MapFiltersContext
      value={{
        replaceMapFilters,
        state,
        updateGlobalFilters,
        updateLayerFilters,
      }}
    >
      {children}
    </MapFiltersContext>
  );
};

/** The shared display filter state. Must be rendered under the provider. */
export const useMapFiltersStore = () => {
  const context = useContext(MapFiltersContext);
  if (!context) {
    throw new Error(
      "useMapFiltersStore must be used within a MapFiltersProvider",
    );
  }
  return context;
};
