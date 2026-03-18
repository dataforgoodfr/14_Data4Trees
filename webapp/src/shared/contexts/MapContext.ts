import { createContext, type RefObject } from "react";

// @ts-expect-error No types for the coordo lib
import type { createMap } from "coordo";

export type Category = { value: string; label: string };

export interface MapContextType {
  isReady: boolean;
  mapApiRef: RefObject<ReturnType<typeof createMap> | null>;
  forests: Category[];
  setIsReady: (isReady: boolean) => void;
  setForests: (forests: Category[]) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);
