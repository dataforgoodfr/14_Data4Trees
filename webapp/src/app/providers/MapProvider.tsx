import { createMap } from "coordo";
import { type ReactNode, useCallback, useRef, useState } from "react";

import { API_URL } from "@shared/api/client";
import { type Category, MapContext } from "@shared/contexts/MapContext";
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

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const mapApiRef = useRef<ReturnType<typeof createMap> | null>(null);
  const [forests, setForests] = useState<Category[]>([]);
  const [mapSettings, setMapSettings] = useLocalStorage<MapSettings>(
    "map-settings",
    DEFAULT_MAP_SETTINGS,
  );

  const mapContainerRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node || mapApiRef.current) return;

      const handleReady = () => {
        setIsReady(true);
        // biome-ignore lint/suspicious/noExplicitAny : <no types from the lib coordo>
        const metadata: any = mapApiRef.current?.getLayerMetadata("inventaire");
        const forestField = metadata?.schema?.fields?.find(
          (f: { name: string }) => f.name === "for",
        );
        if (forestField?.categories) setForests(forestField.categories);
      };

      node.addEventListener("map:ready", handleReady);

      try {
        mapApiRef.current = createMap(`#${node.id}`, STYLE_URL, {
          center: mapSettings.center,
          zoom: mapSettings.zoom,
        });
        // biome-ignore lint/suspicious/noExplicitAny : debug only
        (window as any).__map__ = mapApiRef.current?.mapInstance;
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <MapContext
      value={{ forests, isReady, mapApiRef, mapContainerRef, setForests, setIsReady }}
    >
      {children}
    </MapContext>
  );
}
