import { useCallback, useEffectEvent } from "react";

import {
  CATEGORY_IDENTIFIERS,
  type CategoriesFiltersState,
  parseLayerId,
} from "@shared/api/categories-filters";
import { LAYERS_WITH_CLUSTERS } from "@shared/api/layers";
import { useLocalStorage } from "@shared/hooks/use-local-storage";
import { EVENTS, getClusterLayerIds } from "@shared/lib/coordo";

/**
 * Trigger visibility update on the layer and its cluster related layers
 */
export const changeLayerVisibility = ({
  layerId,
  isActive,
  showLayer,
  hideLayer,
}: {
  layerId: string;
  isActive: boolean;
  showLayer?: (layerId: string) => void;
  hideLayer?: (layerId: string) => void;
}) => {
  const isClustered = LAYERS_WITH_CLUSTERS.includes(layerId);

  const action = isActive ? showLayer : hideLayer;
  action?.(layerId);
  if (isClustered) {
    const { circle, count } = getClusterLayerIds(layerId);
    action?.(circle);
    action?.(count);
  }
};

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

  /**
   * Use useEffectEvent for the event handlers and to make sure they use the
   * latest version of prev (avoid the state disclosure problem)
   * @link https://react.dev/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects
   */
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

        changeLayerVisibility({ hideLayer, isActive, layerId, showLayer });
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
