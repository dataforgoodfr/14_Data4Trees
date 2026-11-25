import { CalendarRangeIcon } from "lucide-react";
import type { FC } from "react";

import {
  CheckboxGroup,
  CollapsibleSection,
  toCheckboxItems,
} from "@features/base-filters";

import type { Filters } from "@shared/api/types";
import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";

import { GROUP_TITLE_KEYS, type GroupKey } from "./constants";
import { getGlobalGroups } from "./groups";
import { useGlobalFilters } from "./use-global-filters";

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

  return (
    <CollapsibleSection
      headerClassName=""
      icon={<CalendarRangeIcon size={18} />}
      identifier="global-filters"
      title={t("filters.global.title")}
    >
      {getGlobalGroups(filters).map((group) => (
        <CheckboxGroup
          disabled={!isReady}
          items={toCheckboxItems(group.options, i18n.language)}
          key={group.key}
          namespace={`global-${group.key}`}
          title={t(GROUP_TITLE_KEYS[group.key as GroupKey])}
          {...getCheckboxGroupProps(group)}
        />
      ))}
    </CollapsibleSection>
  );
};
