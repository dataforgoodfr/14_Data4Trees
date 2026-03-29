import type { createMap } from "coordo";
import { createContext, type RefCallback, type RefObject } from "react";

import type { CategoriesFiltersState } from "@shared/api/categories-filters";
import type { SetValue } from "@shared/hooks/use-local-storage";

export type Category = { value: string; label: string };

export interface MapContextType {
  categoriesFilters: CategoriesFiltersState;
  forests: Category[];
  isReady: boolean;
  mapApiRef: RefObject<ReturnType<typeof createMap> | null>;
  mapContainerRef: RefCallback<HTMLElement>;
  setCategoriesFilters: (
    setter: SetValue<CategoriesFiltersState>,
  ) => void;
  setForests: (forests: Category[]) => void;
  setIsReady: (isReady: boolean) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);
