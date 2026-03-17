import { createMap } from "coordo";
import { type FC, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  type BiodiversityData,
  BiodiversityIndicator,
} from "@features/indicators/biodiversity";

import { API_URL } from "@shared/api/client";
import { useLocalStorage } from "@shared/hooks/use-local-storage";

const STYLE_URL = `${API_URL}/maps/style.json`;

type Category = { value: string; label: string };

type MapSettings = {
  zoom: number;
  center: [number, number];
};

// The default settings are set to show africa and madagascar on the map
const DEFAULT_MAP_SETTINGS: MapSettings = {
  center: [34.1246, -23.0758],
  zoom: 3.8,
};

function useMap(containerSelector: string) {
  const [isReady, setIsReady] = useState(false);
  const mapApiRef = useRef<ReturnType<typeof createMap> | null>(null);
  const [forests, setForests] = useState<Category[]>([]);
  const [mapSettings, setMapSettings] = useLocalStorage<MapSettings>(
    "map-settings",
    DEFAULT_MAP_SETTINGS,
  );

  useEffect(() => {
    const el = document.querySelector(containerSelector);
    if (!el) return;

    const handleReady = () => {
      setIsReady(true);
      // @todo ADD TYPES TO THE LIBRARY
      // biome-ignore lint/suspicious/noExplicitAny : <no types from the lib coordo>
      const metadata: any = mapApiRef.current?.getLayerMetadata("inventaire");
      const forestField = metadata?.schema?.fields?.find(
        (field: { name: string }) => field.name === "for",
      );
      if (forestField?.categories) {
        setForests(forestField.categories);
      }
    };

    el.addEventListener("map:ready", handleReady);

    if (!mapApiRef.current) {
      try {
        mapApiRef.current = createMap(containerSelector, STYLE_URL, {
          center: mapSettings.center,
          zoom: mapSettings.zoom,
        });

        // Update map settings
        mapApiRef.current.addEventListener("move", (event) => {
          setMapSettings({
            center: event.target.getCenter().toArray(),
            zoom: event.target.getZoom(),
          });
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
      }
    }

    return () => {
      el.removeEventListener("map:ready", handleReady);
    };
  }, [containerSelector, mapSettings, setMapSettings]);

  return { forests, isReady, mapApiRef };
}

export const WidgetMap: FC = () => {
  const { isReady, mapApiRef, forests } = useMap("#map");

  useEffect(() => {
    if (!isReady || !mapApiRef.current) return;

    const renderPopup = (properties: BiodiversityData) => {
      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(
        <BiodiversityIndicator
          className="w-[300px] max-h-[350px]"
          data={properties}
          onClose={() => root.unmount()}
        />,
      );
      return container;
    };

    // Set the popup for the "inventaire" layer
    mapApiRef.current.setLayerPopup<BiodiversityData>({
      layerId: "inventaire",
      popupConfig: {
        anchor: "center",
        className: "bg-background/90 rounded-md",
        closeButton: false,
        closeOnClick: true,
        closeOnMove: false,
        maxWidth: "300px",
      },
      renderCallback: renderPopup,
      trigger: "click",
    });
  }, [isReady, mapApiRef]);

  const filterByForest = (forestId: string) => {
    mapApiRef.current?.setLayerFilters("inventaire", {
      args: [{ property: "for" }, forestId],
      op: "=",
    });
  };

  const resetFilter = () => {
    mapApiRef.current?.setLayerFilters("inventaire", null);
  };

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full"
        id="map"
      ></div>
      {!isReady && (
        <div className="map-loader absolute inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      {forests.length > 0 && (
        <div className="absolute top-4 left-12 z-10 bg-white rounded shadow p-2 flex gap-2">
          {forests.map((forest) => (
            <button
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              key={forest.value}
              onClick={() => filterByForest(forest.value)}
            >
              {forest.label}
            </button>
          ))}
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            onClick={resetFilter}
          >
            Toutes
          </button>
        </div>
      )}
    </div>
  );
};
