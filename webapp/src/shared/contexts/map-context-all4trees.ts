import { createContext, type RefCallback, type RefObject } from "react";

import type { CategoriesFiltersState } from "@shared/api/categories-filters";
import type { SetValue } from "@shared/hooks/use-local-storage";
import type { createMap } from "@shared/lib/coordo";
export interface MapContextType {
  categoriesFilters: CategoriesFiltersState;
  isReady: boolean;
  mapApiRef: RefObject<ReturnType<typeof createMap> | null>;
  mapContainerRef: RefCallback<HTMLElement>;
  setCategoriesFilters: (setter: SetValue<CategoriesFiltersState>) => void;
  setIsReady: (isReady: boolean) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);
