import { useContext, useEffect } from "react";

// @ts-expect-error No types for the coordo lib
import { createMap } from "coordo";

import { API_URL } from "@shared/api/client";
import { MapContext } from "@shared/contexts/MapContext";
import { useLocalStorage } from "@shared/hooks/use-local-storage";

const STYLE_URL = `${API_URL}/maps/style.json`;

type MapSettings = {
  zoom: number;
  center: [number, number];
};

const DEFAULT_MAP_SETTINGS: MapSettings = {
  zoom: 3.8,
  center: [34.1246, -23.0758],
};

export function useMap(containerSelector?: string) {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a MapProvider");

  const [mapSettings, setMapSettings] = useLocalStorage<MapSettings>(
    "map-settings",
    DEFAULT_MAP_SETTINGS,
  );

  useEffect(() => {
    if (!containerSelector) return;
    const el = document.querySelector(containerSelector);
    if (!el) return;

    const handleReady = () => {
      context.setIsReady(true);
      // @todo ADD TYPES TO THE LIBRARY
      // biome-ignore lint/suspicious/noExplicitAny : <no types from the lib coordo>
      const metadata: any = context.mapApiRef.current?.getLayerMetadata("inventaire");
      const forestField = metadata?.schema?.fields?.find(
        (f: { name: string }) => f.name === "for",
      );
      if (forestField?.categories) context.setForests(forestField.categories);
    };

    el.addEventListener("map:ready", handleReady);

    if (!context.mapApiRef.current) {
      try {
        context.mapApiRef.current = createMap(containerSelector, STYLE_URL, {
          center: mapSettings.center,
          zoom: mapSettings.zoom,
        });
        // DEBUG - à supprimer
        // biome-ignore lint/suspicious/noExplicitAny : debug only
        (window as any).__map__ = context.mapApiRef.current?.mapInstance;
        // biome-ignore lint/suspicious/noExplicitAny : <no types from the lib coordo>
        context.mapApiRef.current.addEventListener("move", (event: any) => {
          setMapSettings({
            zoom: event.target.getZoom(),
            center: event.target.getCenter().toArray(),
          });
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
      }
    }

    return () => el.removeEventListener("map:ready", handleReady);
  }, [containerSelector]);

  return context;
}
