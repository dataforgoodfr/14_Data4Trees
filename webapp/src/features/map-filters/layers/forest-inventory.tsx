import { TreePineIcon } from "lucide-react";
import type { FC } from "react";

import { ExternalDataBoundary } from "@features/external-data/suspense-boundary";

import { LAYERS } from "@shared/api/layers";
import type { Filters } from "@shared/api/types";
import { useTranslation } from "@shared/i18n";

import {
  LABEL_KEY_TYPES,
  LayerFilterPanel,
  toPanelGroup,
} from "../components/layer-filter-panel";
import { GROUP_KEYS } from "../constants";

const LAYER_ID = LAYERS.INVENTORY_FOR;

const MapFiltersForestInventoryInner: FC<{ filters: Filters }> = ({
  filters,
}) => {
  const { t } = useTranslation("all4trees");

  const projects = filters.project[LAYER_ID];

  return (
    <LayerFilterPanel
      groups={[
        toPanelGroup({
          key: GROUP_KEYS.PROJECT,
          leaf: projects,
          title: t("filters.groups.project"),
        }),
        toPanelGroup({
          key: GROUP_KEYS.TYPE,
          // Served from the `typ` source column on this layer.
          labelListName: "typ",
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
          labelListName: "loc1",
          leaf: filters.loc1[LAYER_ID],
          title: t("filters.groups.loc1"),
        }),
        toPanelGroup({
          key: GROUP_KEYS.LOC2,
          labelListName: "loc2",
          leaf: filters.loc2[LAYER_ID],
          title: t("filters.groups.loc2"),
        }),
        toPanelGroup({
          key: GROUP_KEYS.ECOS,
          labelListName: "ecos",
          leaf: filters.ecos[LAYER_ID],
          title: t("filters.groups.ecos"),
        }),
      ]}
      headerClassName="text-forest-inventory"
      icon={<TreePineIcon size={18} />}
      labelKeyType={LABEL_KEY_TYPES.NUMBER}
      layerId={LAYER_ID}
      // Label tables are keyed by project. Each layer carries a single project
      // today; this becomes ambiguous the day one spans several.
      project={String(projects.values[0])}
      title={t("layers.forestInventory")}
    />
  );
};

export const MapFiltersForestInventory: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  if (!filters) return null;

  return (
    <ExternalDataBoundary layerId={LAYER_ID}>
      <MapFiltersForestInventoryInner filters={filters} />
    </ExternalDataBoundary>
  );
};
