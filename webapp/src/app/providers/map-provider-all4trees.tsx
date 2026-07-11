import { type ReactNode, useCallback, useRef, useState } from "react";

import { useAuth } from "@features/auth";
import { useCategoriesFilters } from "@features/categories-filters/use-categories-filters";
import { renderAnchor, renderLayerRow } from "@features/controls/layer-control";

import { API_URL } from "@shared/api/client";
import {
  type Category,
  MapContext,
} from "@shared/contexts/map-context-all4trees";
import { useLocalStorage } from "@shared/hooks/use-local-storage";
import { createMap, EVENTS } from "@shared/lib/coordo";

const STYLE_URL = `${API_URL}/maps/style.json`;

type MapSettings = {
  zoom: number;
  center: [number, number];
};

const DEFAULT_MAP_SETTINGS: MapSettings = {
  center: [34.1246, -23.0758],
  zoom: 3.8,
};

type MapProviderAll4TreesProps = {
  children: ReactNode;
};

export function MapProviderAll4Trees({ children }: MapProviderAll4TreesProps) {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, token } = useAuth();

  const mapApiRef = useRef<ReturnType<typeof createMap> | null>(null);
  const [forests, setForests] = useState<Category[]>([]);
  const [mapSettings, setMapSettings] = useLocalStorage<MapSettings>(
    "d4g:map-settings:all4trees",
    DEFAULT_MAP_SETTINGS,
  );

  const {
    addCategoriesFiltersEventListener,
    categoriesFilters,
    setCategoriesFilters,
    syncInitialCategoriesFilters,
  } = useCategoriesFilters();

  // Callback ref pattern — called by React when the DOM node mounts/unmounts.
  // See: https://dev.to/gilfink/quick-tip-using-callback-refs-in-react-4gef
  // biome-ignore lint/correctness/useExhaustiveDependencies: map init should run only once on mount
  const mapContainerRef = useCallback((node: HTMLElement | null) => {
    if (!node || mapApiRef.current) return;

    const handleReady = () => {
      setIsReady(true);
      // biome-ignore lint/suspicious/noExplicitAny : <no types from the lib coordo>
      const metadata: any = mapApiRef.current?.getLayerMetadata("inventaire");
      const forestField = metadata?.schema?.fields?.find(
        (f: { name: string }) => f.name === "for",
      );
      if (forestField?.categories) {
        setForests(forestField.categories);
      }

      // On first mount, sync the map state with the local storage state of "categories-filters"
      syncInitialCategoriesFilters({
        hideLayer: mapApiRef.current?.hideLayer,
        showLayer: mapApiRef.current?.showLayer,
      });
    };

    node.addEventListener(EVENTS.MAP_READY, handleReady);

    addCategoriesFiltersEventListener(node);

    try {
      mapApiRef.current = createMap(`#${node.id}`, STYLE_URL, {
        center: mapSettings.center,
        controlLayerProps: {
          renderAnchor,
          renderLayerRow,
        },
        headers: isAuthenticated ? { Authorization: `Bearer ${token}` } : {},
        zoom: mapSettings.zoom,
      });
      if (import.meta.env.DEV) {
        // biome-ignore lint/suspicious/noExplicitAny : debug only
        (window as any).__map__ = mapApiRef.current?.mapInstance;
      }
      // biome-ignore lint/suspicious/noExplicitAny : <no types from the lib coordo>
      mapApiRef.current.addEventListener("move", (event: any) => {
        setMapSettings({
          center: event.target.getCenter().toArray(),
          zoom: event.target.getZoom(),
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
    }
  }, []);

  return (
    <MapContext
      value={{
        categoriesFilters,
        forests,
        isReady,
        mapApiRef,
        mapContainerRef,
        setCategoriesFilters,
        setForests,
        setIsReady,
      }}
    >
      {children}
    </MapContext>
  );
}
