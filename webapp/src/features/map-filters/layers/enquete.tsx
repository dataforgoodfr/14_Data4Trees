import { UsersIcon } from "lucide-react";
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

const LAYER_ID = LAYERS.ENQUETE;

/**
 * This layer is built with `groupby`, so it only exposes the grouped columns
 * (`proj`, `loc1`, `loc2`, `year`) plus aggregates — there is no type, cohort or
 * ecos to filter on. `year` is covered by the global panel.
 *
 * Its values are also uncast strings, and `hh_label` keys its rows by a string
 * `name`, hence `LABEL_KEY_TYPES.STRING` where the inventory layers use NUMBER.
 */
const MapFiltersEnqueteInner: FC<{ filters: Filters }> = ({ filters }) => {
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
      ]}
      headerClassName="text-socio-eco"
      icon={<UsersIcon size={18} />}
      labelKeyType={LABEL_KEY_TYPES.STRING}
      layerId={LAYER_ID}
      project={String(projects.values[0])}
      title={t("layers.socioEco")}
    />
  );
};

export const MapFiltersEnquete: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  if (!filters) return null;

  return (
    <ExternalDataBoundary layerId={LAYER_ID}>
      <MapFiltersEnqueteInner filters={filters} />
    </ExternalDataBoundary>
  );
};
