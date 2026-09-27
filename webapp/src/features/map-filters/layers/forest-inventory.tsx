import { TreePineIcon } from "lucide-react";
import type { FC } from "react";

import { LAYERS } from "@shared/api/layers";
import type { Filters } from "@shared/api/types";
import { useTranslation } from "@shared/i18n";

import {
  LayerFilterPanel,
  toPanelGroup,
} from "../components/layer-filter-panel";
import { GROUP_KEYS } from "../constants";

const LAYER_ID = LAYERS.INVENTORY_FOR;

export const MapFiltersForestInventory: FC<{ filters: Filters | null }> = ({
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
          key: GROUP_KEYS.TYPE,
          leaf: filters.type[LAYER_ID],
          title: t("filters.groups.type"),
        }),
        toPanelGroup({
          key: GROUP_KEYS.COHORT,
          leaf: filters.cohort[LAYER_ID],
          title: t("filters.groups.cohort"),
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
        toPanelGroup({
          key: GROUP_KEYS.ECOS,
          leaf: filters.ecos[LAYER_ID],
          title: t("filters.groups.ecos"),
        }),
      ]}
      headerClassName="text-forest-inventory"
      icon={<TreePineIcon size={18} />}
      layerId={LAYER_ID}
      title={t("layers.forestInventory")}
    />
  );
};
