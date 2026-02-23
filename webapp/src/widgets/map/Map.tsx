import { createMap } from "coordo";
import { type FC, useEffect, useRef, useState } from "react";

import "./Map.css";

const STYLE_URL = "http://localhost:8000/api/maps/style.json";

type Category = { value: string; label: string };

function useMap(containerSelector: string) {
  const [isReady, setIsReady] = useState(false);
  const mapApiRef = useRef<ReturnType<typeof createMap> | null>(null);
  const [forests, setForests] = useState<Category[]>([]);

  useEffect(() => {
    const el = document.querySelector(containerSelector);
    if (!el) return;

    const handleReady = () => {
      setIsReady(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        mapApiRef.current = createMap(containerSelector, STYLE_URL);
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
      }
    }

    return () => {
      el.removeEventListener("map:ready", handleReady);
    };
  }, [containerSelector]);

  return { isReady, mapApiRef, forests };
}

export const Map: FC = () => {
  const { isReady, mapApiRef, forests } = useMap("#map");

  const filterByForest = (forestId: string) => {
    mapApiRef.current?.setLayerFilters("inventaire", {
      op: "=",
      args: [{ property: "for" }, forestId],
    });
  };

  const resetFilter = () => {
    mapApiRef.current?.setLayerFilters("inventaire", null);
  };

  return (
    <div className="relative w-full h-screen">
      <div
        id="map"
        className="w-full h-full"
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
              key={forest.value}
              onClick={() => filterByForest(forest.value)}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              {forest.label}
            </button>
          ))}
          <button
            onClick={resetFilter}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Toutes
          </button>
        </div>
      )}
    </div>
  );
};
