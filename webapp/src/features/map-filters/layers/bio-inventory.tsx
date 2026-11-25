import { Binoculars } from "lucide-react";
import type { FC } from "react";

import { LAYERS } from "@shared/api/layers";
import type { Filters } from "@shared/api/types";
import { useTranslation } from "@shared/i18n";

import { LayerFilterPanel } from "../components/layer-filter-panel";
import { GROUP_KEYS } from "../constants";

const LAYER_ID = LAYERS.INVENTORY_BIO;

/**
 * Groups come from `LAYER_GROUP_KEYS`. `cohort` is the same source column as
 * the forest one, served as `start_date`.
 */
export const MapFiltersBioInventory: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  const { t } = useTranslation("all4trees");

  if (!filters) return null;

  return (
    <LayerFilterPanel
      filters={filters}
      groupTitles={{ [GROUP_KEYS.TYPE]: t("filters.groups.typeBio") }}
      headerClassName="text-bio-inventory"
      icon={<Binoculars size={18} />}
      layerId={LAYER_ID}
      title={t("layers.bioInventory")}
    />
  );
};
