import { createContext, type RefCallback, type RefObject } from "react";

import type { createMap } from "@shared/lib/coordo";

export type Category = { value: string; label: string };

export interface MapContextType {
  isReady: boolean;
  mapApiRef: RefObject<ReturnType<typeof createMap> | null>;
  mapContainerRef: RefCallback<HTMLElement>;
  setIsReady: (isReady: boolean) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);
