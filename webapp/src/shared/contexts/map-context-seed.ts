import type { createMap } from "coordo";
import {
  createContext,
  type RefCallback,
  type RefObject,
  useContext,
} from "react";

export type Category = { value: string; label: string };

export interface MapContextType {
  isReady: boolean;
  mapApiRef: RefObject<ReturnType<typeof createMap> | null>;
  mapContainerRef: RefCallback<HTMLElement>;
  setIsReady: (isReady: boolean) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

export function useMapContext() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
