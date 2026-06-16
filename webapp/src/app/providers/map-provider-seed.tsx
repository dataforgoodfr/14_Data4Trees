import { createMap, EVENTS } from "coordo";
import { type ReactNode, useCallback, useRef, useState } from "react";

import { API_URL } from "@shared/api/client";
import { MapContext } from "@shared/contexts/map-context-seed";
import { useLocalStorage } from "@shared/hooks/use-local-storage";

const STYLE_URL = `${API_URL}/maps/style.json`;

type MapSettings = {
  zoom: number;
  center: [number, number];
};

const DEFAULT_MAP_SETTINGS: MapSettings = {
  center: [34.1246, -23.0758],
  zoom: 3.8,
};

type MapProviderSeedProps = {
  children: ReactNode;
};

export function MapProviderSeed({ children }: MapProviderSeedProps) {
  const [isReady, setIsReady] = useState(false);
  const mapApiRef = useRef<ReturnType<typeof createMap> | null>(null);
  const [mapSettings, setMapSettings] = useLocalStorage<MapSettings>(
    "d4g:map-settings:seed",
    DEFAULT_MAP_SETTINGS,
  );

  // Callback ref pattern — called by React when the DOM node mounts/unmounts.
  // See: https://dev.to/gilfink/quick-tip-using-callback-refs-in-react-4gef
  // biome-ignore lint/correctness/useExhaustiveDependencies: map init should run only once on mount
  const mapContainerRef = useCallback((node: HTMLElement | null) => {
    if (!node || mapApiRef.current) return;

    const handleReady = () => {
      setIsReady(true);
    };

    node.addEventListener(EVENTS.MAP_READY, handleReady);

    try {
      mapApiRef.current = createMap(`#${node.id}`, STYLE_URL, {
        center: mapSettings.center,
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
      console.error("Error when initializing the map:", error);
    }
  }, []);

  return (
    <MapContext
      value={{
        isReady,
        mapApiRef,
        mapContainerRef,
        setIsReady,
      }}
    >
      {children}
    </MapContext>
  );
}
