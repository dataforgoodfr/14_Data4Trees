// @ts-expect-error Could not find a declaration file for module 'coordo'.
import { createMap } from "coordo"
import { useEffect, useRef, useState, type FC } from "react";
import mapStyle from "@/fixtures/mapStyle.json";
import "./Map.css";

export type MapApi = {
  getDataForLayer: (layerId: string) => unknown;
};

// Hook personnalisé pour initialiser la carte
function useMap(containerSelector: string) {
  const [mapApi, setMapApi] = useState<MapApi>({} as MapApi);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

        try {
            const api = createMap(containerSelector, mapStyle);
            setMapApi(api);
            isInitialized.current = true;
        } catch (error) {
            console.error("Erreur lors de l'initialisation de la carte:", error);
        }
    }, [containerSelector]);

  return mapApi;
}

export const Map: FC = () => {
    const mapApi = useMap("#map");

    return (
        <div id="map" className="w-full h-screen" onClick={() => console.log(mapApi.getDataForLayer("my-layer"))}>
        </div>
    );
}
