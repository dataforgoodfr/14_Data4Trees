import { CalendarRangeIcon } from "lucide-react";
import type { FC } from "react";

import type { Filters } from "@shared/api/types";
import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";
import { Card, CardTitle } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";

import { CheckboxGroup } from "./components/checkbox-group";
import {
  buildGlobalFilterGroup,
  useGlobalFilters,
} from "./use-global-filters";

const GROUP_KEYS = {
  YEAR: "year",
} as const;

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
  const { t } = useTranslation("all4trees");
  const { isReady } = useMap();
  const { getCheckboxGroupProps } = useGlobalFilters();

  if (!filters) return null;

  const yearGroup = buildGlobalFilterGroup({
    key: GROUP_KEYS.YEAR,
    leavesByLayer: filters.year,
  });

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex flex-row justify-start items-center gap-1">
        <CalendarRangeIcon size={18} />
        <CardTitle> {t("filters.global.title")}</CardTitle>
      </div>

      <Separator />

      <CheckboxGroup
        disabled={!isReady}
        items={yearGroup.values.map((value) => ({
          identifier: String(value),
          label: String(value),
        }))}
        title={t("filters.groups.year")}
        {...getCheckboxGroupProps(yearGroup)}
      />
    </Card>
  );
};
