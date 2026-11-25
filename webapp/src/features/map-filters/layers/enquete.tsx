import { UsersIcon } from "lucide-react";
import type { FC } from "react";

import { LAYERS } from "@shared/api/layers";
import type { Filters } from "@shared/api/types";
import { useTranslation } from "@shared/i18n";

import { LayerFilterPanel } from "../components/layer-filter-panel";

const LAYER_ID = LAYERS.ENQUETE;

/**
 * Groups come from `LAYER_GROUP_KEYS`: this layer is built with `groupby`, so
 * it only exposes `proj`, `loc1`, `loc2` and `year` (covered by the global
 * panel).
 */
export const MapFiltersEnquete: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  const { t } = useTranslation("all4trees");

  if (!filters) return null;

  return (
    <LayerFilterPanel
      filters={filters}
      headerClassName="text-socio-eco"
      icon={<UsersIcon size={18} />}
      layerId={LAYER_ID}
      title={t("layers.socioEco")}
    />
  );
};
