import type { FC } from "react";

import type { Filters } from "@shared/api/types";

import { MapGlobalFilters } from "./global-filters";
import { MapFiltersBioInventory } from "./panels/bio-inventory";
import { MapFiltersEnquete } from "./panels/enquete";
import { MapFiltersForestInventory } from "./panels/forest-inventory";

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
