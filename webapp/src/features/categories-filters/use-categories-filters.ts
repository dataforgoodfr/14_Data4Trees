import { EVENTS } from "coordo";
import { useCallback, useEffectEvent } from "react";

import {
  CATEGORY_IDENTIFIERS,
  type CategoriesFiltersState,
  parseLayerId,
} from "@shared/api/categories-filters";
import { useLocalStorage } from "@shared/hooks/use-local-storage";

export const useCategoriesFilters = () => {
  const [categoriesFilters, setCategoriesFilters] =
    useLocalStorage<CategoriesFiltersState>("categories-filters", {
      [CATEGORY_IDENTIFIERS.ACTION_DIVERSITY]: true,
      [CATEGORY_IDENTIFIERS.ACTION_INVENTARY]: true,
      [CATEGORY_IDENTIFIERS.ACTION_SOCIO]: true,
      [CATEGORY_IDENTIFIERS.DATA_GROUND]: true,
      [CATEGORY_IDENTIFIERS.DATA_MODEL]: true,
      [CATEGORY_IDENTIFIERS.DATA_SATELLITE]: true,
      [CATEGORY_IDENTIFIERS.SYSTEM_FOREST_PRIMARY]: true,
      [CATEGORY_IDENTIFIERS.SYSTEM_FOREST_SECONDARY]: true,
      [CATEGORY_IDENTIFIERS.SYSTEM_MANGROVE_HIGH]: true,
      [CATEGORY_IDENTIFIERS.SYSTEM_MANGROVE_LOW]: true,
    });

  // Use useEffectEvent for the event handlers and to make sure they use the
  // latest version of prev (avoid the state disclosure problem)
  const onLayerShow = useEffectEvent((identifier: string) => {
    setCategoriesFilters((prev) => ({
      ...prev,
      [identifier]: true,
    }));
  });

  const onLayerHide = useEffectEvent((identifier: string) => {
    setCategoriesFilters((prev) => ({
      ...prev,
      [identifier]: false,
    }));
  });

  const addCategoriesFiltersEventListener = useCallback((node: HTMLElement) => {
    Object.values(CATEGORY_IDENTIFIERS).forEach((identifier) => {
      const layerId = parseLayerId(identifier);
      if (!layerId) return;

      node.addEventListener(EVENTS.LAYER_SHOW(layerId), () => {
        onLayerShow(identifier);
      });

      node.addEventListener(EVENTS.LAYER_HIDE(layerId), () => {
        onLayerHide(identifier);
      });
    });
  }, []);

  const syncInitialCategoriesFilters = useCallback(
    ({
      showLayer,
      hideLayer,
    }: {
      showLayer?: (layerId: string) => void;
      hideLayer?: (layerId: string) => void;
    }) => {
      Object.entries(categoriesFilters).forEach(([identifier, isActive]) => {
        const layerId = parseLayerId(identifier);
        if (!layerId) return;

        if (isActive) {
          showLayer?.(layerId);
        } else {
          hideLayer?.(layerId);
        }
      });
    },
    [categoriesFilters],
  );

  return {
    addCategoriesFiltersEventListener,
    categoriesFilters,
    setCategoriesFilters,
    syncInitialCategoriesFilters,
  };
};
