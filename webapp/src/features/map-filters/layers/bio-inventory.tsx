import { Binoculars } from "lucide-react";
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

const LAYER_ID = LAYERS.INVENTORY_BIO;

const MapFiltersBioInventoryInner: FC<{ filters: Filters }> = ({ filters }) => {
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
          // This layer serves `type` from `meth`, not `typ` like the forest one,
          // so the label list differs too.
          labelListName: "meth",
          leaf: filters.type[LAYER_ID],
          title: t("filters.groups.typeBio"),
        }),
        toPanelGroup({
          key: GROUP_KEYS.COHORT,
          // Same source column as the forest `cohort`, served as `start_date`.
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
      headerClassName="text-bio-inventory"
      icon={<Binoculars size={18} />}
      labelKeyType={LABEL_KEY_TYPES.NUMBER}
      layerId={LAYER_ID}
      project={String(projects.values[0])}
      title={t("layers.bioInventory")}
    />
  );
};

export const MapFiltersBioInventory: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  if (!filters) return null;

  return (
    <ExternalDataBoundary layerId={LAYER_ID}>
      <MapFiltersBioInventoryInner filters={filters} />
    </ExternalDataBoundary>
  );
};
