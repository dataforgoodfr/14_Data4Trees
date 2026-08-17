import { ListFilterIcon } from "lucide-react";
import { Activity, useEffect, useRef, useState } from "react";

import { CategoriesFilters } from "@features/categories-filters";
import { MapFilters } from "@features/map-filters";

import type { Filters } from "@shared/api/types";
import { useApi } from "@shared/hooks/useApi";
import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import { Separator } from "@ui/separator";

export const FILTER_KIND = {
  category: "category",
  filtersPerCategory: "filtersPerCategory",
} as const;

export function MapSidebar() {
  const { t } = useTranslation("all4trees");
  const [selectedFilterKind, setSelectedFilterKind] = useState<string>(
    FILTER_KIND.category,
  );
  const [mapFilters, setMapFilters] = useState<Filters | null>(null);
  const isLoadingFilter = useRef<boolean | null>(null);

  const client = useApi();

  useEffect(() => {
    const fetchFilters = async () => {
      isLoadingFilter.current = true;
      const filters = await client.getFilters();
      setMapFilters(filters);
      isLoadingFilter.current = false;
    };
    if (mapFilters == null && !isLoadingFilter.current) {
      fetchFilters();
    }
  }, [mapFilters, client.getFilters]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="px-4 py-2 font-semibold flex flex-row items-center flex-start gap-2">
        <ListFilterIcon size={18} />
        {t("filters.sidebarLayout.title")}
      </h3>

      <Separator />

      <GridSelector
        className="mx-2 my-3"
        onChange={(value) => setSelectedFilterKind(value)}
        options={[
          {
            id: FILTER_KIND.category,
            label: t("filters.sidebarLayout.groupCategory"),
          },
          {
            disabled: mapFilters == null,
            id: FILTER_KIND.filtersPerCategory,
            label: t("filters.sidebarLayout.groupFilters"),
          },
        ]}
        value={selectedFilterKind}
      />

      <div
        className="px-4 mb-3 overflow-y-scroll custom-scrollbar flex-1"
        style={{
          "--scrollbar-thumb": "var(--info-foreground)",
          "--scrollbar-track": "var(--background)",
        }}
      >
        {selectedFilterKind === FILTER_KIND.category && <CategoriesFilters />}

        <Activity
          mode={
            selectedFilterKind === FILTER_KIND.filtersPerCategory &&
            mapFilters != null
              ? "visible"
              : "hidden"
          }
        >
          <MapFilters filters={mapFilters} />
        </Activity>
      </div>
    </div>
  );
}
