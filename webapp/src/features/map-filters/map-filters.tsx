import type { FC } from "react";

import type { Filters } from "@shared/api/types";

import { MapFiltersForestInventory } from "./forest-inventory";

type MapFiltersProps = {
  filters: Filters | null;
};

export const MapFilters: FC<MapFiltersProps> = ({ filters }) => {
  return (
    <>
      <MapFiltersForestInventory filters={filters} />
    </>
  );
};
