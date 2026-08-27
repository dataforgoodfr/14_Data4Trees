import type { FC } from "react";

import type { Filters } from "@shared/api/types";

import { MapGlobalFilters } from "./global-filters";
import { MapFiltersBioInventory } from "./layers/bio-inventory";
import { MapFiltersEnquete } from "./layers/enquete";
import { MapFiltersForestInventory } from "./layers/forest-inventory";

type MapFiltersProps = {
  filters: Filters | null;
};

export const MapFilters: FC<MapFiltersProps> = ({ filters }) => {
  return (
    <div className="flex flex-col gap-3">
      <MapGlobalFilters filters={filters} />
      <MapFiltersForestInventory filters={filters} />
      <MapFiltersBioInventory filters={filters} />
      <MapFiltersEnquete filters={filters} />
    </div>
  );
};
