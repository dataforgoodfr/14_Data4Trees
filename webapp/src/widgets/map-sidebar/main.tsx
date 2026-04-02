import { ListFilterIcon } from "lucide-react";
import { useState } from "react";

import { CategoriesFilters } from "@features/categories-filters";

import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import { Separator } from "@ui/separator";

export const FILTER_KIND = {
  category: "category",
  filtersPerCategory: "filtersPerCategory",
} as const;

export function MapSidebar() {
  const { t } = useTranslation("translations");
  const [selectedFilterKind, setSelectedFilterKind] = useState<string>(
    FILTER_KIND.category,
  );

  return (
    <div className="flex flex-col h-full">
      <h3 className="px-4 py-2 font-semibold flex flex-row items-center flex-start gap-sm">
        <ListFilterIcon size={18} />
        {t("filters.sidebarLayout.title")}
      </h3>

      <Separator />

      <GridSelector
        className="mx-4 my-md"
        onChange={(value) => setSelectedFilterKind(value)}
        options={[
          {
            id: FILTER_KIND.category,
            label: t("filters.sidebarLayout.groupCategory"),
          },
          {
            id: FILTER_KIND.filtersPerCategory,
            label: t("filters.sidebarLayout.groupFilters"),
          },
        ]}
        value={selectedFilterKind}
      />

      <div
        className="px-4 mb-md overflow-y-scroll custom-scrollbar flex-1"
        style={{
          "--scrollbar-thumb": "var(--info-foreground)",
          "--scrollbar-track": "var(--background)",
        }}
      >
        {selectedFilterKind === FILTER_KIND.category && <CategoriesFilters />}
      </div>
    </div>
  );
}
