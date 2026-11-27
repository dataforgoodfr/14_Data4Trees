import type { FC } from "react";

import type { Filters } from "@shared/api/types";

import { MapFilters } from "./core/map-filters";
import { MapFiltersProvider } from "./core/map-filters-provider";
import { DisplayAllOrNone } from "./display-all-or-none";
import { CategoriesFilters } from "./layers/categories-filters";

type DisplayFiltersProps = {
  /** The `getFilters()` payload, `null` while it loads. */
  filters: Filters | null;
};

/**
 * The display tab: the All / None toggle, then one card per section — which
 * layers are shown, the all-layers filters, and each layer's filters.
 *
 * Everything here is applied client-side; the layer visibility state lives in
 * the map context, the filter state in `MapFiltersProvider`.
 */
export const DisplayFilters: FC<DisplayFiltersProps> = ({ filters }) => (
  <MapFiltersProvider>
    <DisplayAllOrNone filters={filters} />
    <div className="flex flex-col gap-3">
      <CategoriesFilters />
      {filters ? (
        <MapFilters filters={filters} />
      ) : (
        <div className="mb-4 h-8 w-8 self-center animate-spin rounded-full border-4 border-primary border-t-transparent" />
      )}
    </div>
  </MapFiltersProvider>
);
