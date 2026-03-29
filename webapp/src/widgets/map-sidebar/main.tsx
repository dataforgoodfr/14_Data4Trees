import { ListFilterIcon } from "lucide-react";
import { useState } from "react";

import { CategoriesFilters } from "@features/categories-filters";

import { useTranslation } from "@i18n";

import { Separator } from "@ui/separator";

import {
  FILTER_KIND,
  type FilterKind,
  FilterKindSelector,
} from "./filter-kind-selector";

export function MapSidebar() {
  const { t } = useTranslation("translations");
  const [selectedFilterKind, setSelectedFilterKind] = useState<FilterKind>(
    FILTER_KIND.category,
  );

  return (
    <div className="flex flex-col h-full">
      <h3 className="px-4 py-2 font-semibold flex flex-row items-center flex-start gap-sm">
        <ListFilterIcon size={18} />
        {t("filters.sidebarLayout.title")}
      </h3>

      <Separator />

      <FilterKindSelector
        className="mx-4 my-md"
        setValue={setSelectedFilterKind}
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
