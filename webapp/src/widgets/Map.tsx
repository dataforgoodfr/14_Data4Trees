// @ts-ignore
import { createMap } from "coordo"
import { useEffect, useRef, useState } from "react";
export interface MapProps {

}

export type MapApi = {
    getDataForLayer: (layerId: string) => any;
}

// Hook personnalisé pour initialiser la carte
function useMap(containerSelector: string) {
    const [mapApi, setMapApi] = useState<MapApi>({} as MapApi);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;

        try {
            const api = createMap(containerSelector);
            setMapApi(api);
            isInitialized.current = true;
        } catch (error) {
            console.error("Erreur lors de l'initialisation de la carte:", error);
        }
    }, [containerSelector]);

    return mapApi;
}

export function Map({ }: MapProps) {
    const mapApi = useMap("#map");

    return (
        <div id="map" className="w-full h-screen" onClick={() => console.log(mapApi.getDataForLayer("my-layer"))}>
            <button
                className="absolute top-4 left-4 z-10 p-2 bg-foreground rounded shadow"
                onClick={(e) => { e.stopPropagation(); }}>
                Button
            </button>
        </div>
    );
}

