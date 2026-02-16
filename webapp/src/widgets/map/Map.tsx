// @ts-expect-error Could not find a declaration file for module 'coordo'.
import { createMap } from "coordo";
import { type FC, useEffect, useRef } from "react";

import "./Map.css";
import style from "./style.json";

function useMap(containerSelector: string) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    const el = document.querySelector(containerSelector);
    if (!el) return;

    const handleReady = () => {
      isInitialized.current = true;
    };

    el.addEventListener("map:ready", handleReady);

    try {
      createMap(containerSelector, style);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
    }

    return () => {
      el.removeEventListener("map:ready", handleReady);
    };
  }, [containerSelector]);

  return isInitialized.current;
}

export const Map: FC = () => {
  const isInitialized = useMap("#map");

  return (
    <div id="map" className="relative w-full h-screen">
      {!isInitialized && (
        <div className="map-loader absolute inset-0 z-50 flex items-center justify-center bg-background/80">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent">
            </div>
        </div>
      )}
    </div>
  );
};
