import { UsersIcon } from "lucide-react";
import type { FC } from "react";

import { LAYERS } from "@shared/api/layers";
import type { Filters } from "@shared/api/types";
import { useTranslation } from "@shared/i18n";

import {
  LayerFilterPanel,
  toPanelGroup,
} from "../components/layer-filter-panel";
import { GROUP_KEYS } from "../constants";

const LAYER_ID = LAYERS.ENQUETE;

/**
 * This layer is built with `groupby`, so it only exposes the grouped columns
 * (`proj`, `loc1`, `loc2`, `year`) plus aggregates — there is no type, cohort or
 * ecos to filter on. `year` is covered by the global panel.
 */
export const MapFiltersEnquete: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  const { t } = useTranslation("all4trees");

  if (!filters) return null;

  return (
    <LayerFilterPanel
      groups={[
        toPanelGroup({
          key: GROUP_KEYS.PROJECT,
          leaf: filters.project[LAYER_ID],
          title: t("filters.groups.project"),
        }),
        toPanelGroup({
          key: GROUP_KEYS.LOC1,
          leaf: filters.loc1[LAYER_ID],
          title: t("filters.groups.loc1"),
        }),
        toPanelGroup({
          key: GROUP_KEYS.LOC2,
          leaf: filters.loc2[LAYER_ID],
          title: t("filters.groups.loc2"),
        }),
      ]}
      headerClassName="text-socio-eco"
      icon={<UsersIcon size={18} />}
      layerId={LAYER_ID}
      title={t("layers.socioEco")}
    />
  );
};
