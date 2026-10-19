import { CalendarRangeIcon } from "lucide-react";
import type { FC } from "react";

import type { Filters } from "@shared/api/types";
import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";

import { CheckboxGroup } from "./components/checkbox-group";
import { CollapsibleSection } from "./components/collapsible-section";
import { GROUP_KEYS } from "./constants";
import { toCheckboxItems } from "./labels";
import { buildGlobalFilterGroup, useGlobalFilters } from "./use-global-filters";

/**
 * Filters applied to every layer at once, above the per-layer panels.
 *
 * `year` is served as a string ("2025") on all three layers because the map
 * config does not cast it, so the selection stays string-typed — MapLibre
 * compares strictly and would match nothing against numbers.
 */
export const MapGlobalFilters: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  const { t, i18n } = useTranslation("all4trees");
  const { isReady } = useMap();
  const { getCheckboxGroupProps } = useGlobalFilters();

  if (!filters) return null;

  const yearGroup = buildGlobalFilterGroup({
    key: GROUP_KEYS.YEAR,
    leavesByLayer: filters.year,
  });

  return (
    <CollapsibleSection
      headerClassName=""
      icon={<CalendarRangeIcon size={18} />}
      identifier="global-filters"
      title={t("filters.global.title")}
    >
      <CheckboxGroup
        disabled={!isReady}
        items={toCheckboxItems(yearGroup.options, i18n.language)}
        namespace={`global-${yearGroup.key}`}
        title={t("filters.groups.year")}
        {...getCheckboxGroupProps(yearGroup)}
      />
    </CollapsibleSection>
  );
};
