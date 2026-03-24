import { ListFilterIcon } from "lucide-react";
import { useState } from "react";

import {
  CATEGORY_IDENTIFIERS,
  CategoriesFilters,
  type CategoryFiltersState,
} from "@features/categories-filters";

import { useLocalStorage } from "@shared/hooks/use-local-storage";
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

  const [categoriesState, setCategoriesState] =
    useLocalStorage<CategoryFiltersState>("categories-filters", {
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
        {selectedFilterKind === FILTER_KIND.category && (
          <CategoriesFilters
            setState={setCategoriesState}
            state={categoriesState}
          />
        )}
      </div>
    </div>
  );
}
