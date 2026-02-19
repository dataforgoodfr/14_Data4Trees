// @ts-expect-error Could not find a declaration file for module 'coordo'.
import { createMap } from "coordo";
import { type FC, useEffect, useRef } from "react";

import "./Map.css";
import style from "./style.json";

const STYLE_URL = "http://localhost:8000/api/maps/style.json";

function useMap(containerSelector: string) {
  const isInitialized = useRef(false);
  const mapApiRef = useRef<ReturnType<typeof createMap> | null>(null);

  useEffect(() => {
    if (isInitialized.current) return;
    try {
      mapApiRef.current = createMap(containerSelector, STYLE_URL);
      isInitialized.current = true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
    }
  }, [containerSelector]);

  return mapApiRef;
}

const FORESTS = [
  { value: "1", label: "Djilor" },
  { value: "2", label: "Malka" },
  { value: "3", label: "Samba Dia" },
  { value: "4", label: "Takkite" },
];

export const Map: FC = () => {
  const mapApiRef = useMap("#map");

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
      <div id="map" className="w-full h-full"></div>
      <div className="absolute top-4 left-12 z-10 bg-white rounded shadow p-2 flex gap-2">
        {FORESTS.map((f) => (
          <button
            key={f.value}
            onClick={() => filterByForest(f.value)}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={resetFilter}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          Toutes
        </button>
      </div>
    </div>
  );
};
