// @ts-expect-error Could not find a declaration file for module 'coordo'.
import { createMap } from "coordo";
import { type FC, useEffect, useRef } from "react";

import style from "@/fixtures/style.json";

import "./Map.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapInstance = any;

interface MapProps {
  setMapInstance?: (map: MapInstance) => void;
}

function useMap(
  containerSelector: string,
  onReady?: (map: MapInstance) => void,
) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    try {
      const api = createMap(containerSelector, style);
      api.map.on("load", () => onReady?.(api.map));
      isInitialized.current = true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
    }
  }, [containerSelector, onReady]);
}

export const Map: FC<MapProps> = ({ setMapInstance }) => {
  useMap("#map", setMapInstance);

  return (
    <div
      id="map"
      className="w-full h-screen"
    ></div>
  );
};
