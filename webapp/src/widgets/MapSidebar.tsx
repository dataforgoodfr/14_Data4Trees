import { useState } from "react";

import { useTranslation } from "@i18n";

import {
  FILTER_KIND,
  type FilterKind,
  FilterKindSelector,
} from "./map-sidebar/filter-kind-selector";

export function MapSidebar() {
  const { t } = useTranslation("translations");
  const [selectedFilterKind, setSelectedFilterKind] = useState<FilterKind>(
    FILTER_KIND.category,
  );

  return (
    <>
      <h3 className="px-4 py-2 font-semibold">
        {t("filters.sidebarLayout.title")}
      </h3>
      <hr className="border-border" />

      <div className="px-4 py-2">
        <FilterKindSelector
          setValue={setSelectedFilterKind}
          value={selectedFilterKind}
        />
      </div>
    </>
  );
}
