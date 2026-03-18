import type { createMap } from "coordo";
import { createContext, type RefObject } from "react";

export type Category = { value: string; label: string };

export interface MapContextType {
  forests: Category[];
  isReady: boolean;
  mapApiRef: RefObject<ReturnType<typeof createMap> | null>;
  setForests: (forests: Category[]) => void;
  setIsReady: (isReady: boolean) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);
