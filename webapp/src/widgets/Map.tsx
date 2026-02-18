// @ts-expect-error Could not find a declaration file for module 'coordo'.
import { createMap } from "coordo";
import { type FC, useEffect, useRef } from "react";

import "./Map.css";

const STYLE_URL = "http://localhost:8000/api/maps/style.json";

function useMap(containerSelector: string) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    try {
      createMap(containerSelector, STYLE_URL);
      isInitialized.current = true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
    }
  }, [containerSelector]);
}

export const Map: FC = () => {
  useMap("#map");

  return (
    <div
      id="map"
      className="w-full h-screen"
    ></div>
  );
};
