import type { FC } from "react";

import { AllOrNoneToggle } from "@features/base-filters";

import type { Filters } from "@shared/api/types";
import { useMap } from "@shared/hooks/use-map-all4trees";

import {
  getEmptyMapFilters,
  getUnrestrictedMapFilters,
  isMapFiltersEmpty,
  isMapFiltersUnrestricted,
} from "./all-or-none";
import { useMapFiltersStore } from "./core/map-filters-provider";
import { useLayersVisibility } from "./layers/use-categories-filters";

/**
 * The display tab's All / None: drives the layer visibility *and* every
 * display filter at once.
 *
 * - All: every layer shown, every filter cleared (restricts nothing).
 * - None: every layer hidden, every checkbox group emptied.
 *
 * Each side is a single state update and a single map refresh. Disabled until
 * the `getFilters()` payload is in, since "None" needs its group list.
 */
export const DisplayAllOrNone: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  const { isReady } = useMap();
  const { isAllHidden, isAllVisible, setAllVisibility } = useLayersVisibility();
  const { replaceMapFilters, state } = useMapFiltersStore();

  return (
    <AllOrNoneToggle
      disabled={!isReady || !filters}
      isAll={
        isAllVisible &&
        filters !== null &&
        isMapFiltersUnrestricted(state, filters)
      }
      isNone={
        isAllHidden && filters !== null && isMapFiltersEmpty(state, filters)
      }
      onAll={() => {
        setAllVisibility(true);
        replaceMapFilters(getUnrestrictedMapFilters());
      }}
      onNone={() => {
        if (!filters) return;
        setAllVisibility(false);
        replaceMapFilters(getEmptyMapFilters(filters));
      }}
    />
  );
};
