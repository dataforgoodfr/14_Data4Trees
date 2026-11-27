import { TreePineIcon } from "lucide-react";
import type { FC } from "react";

import { LAYERS } from "@shared/api/layers";
import type { Filters } from "@shared/api/types";
import { useTranslation } from "@shared/i18n";

import { LayerFilterPanel } from "../components/layer-filter-panel";

const LAYER_ID = LAYERS.INVENTORY_FOR;

/** Groups come from `LAYER_GROUP_KEYS`. */
export const MapFiltersForestInventory: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  const { t } = useTranslation("all4trees");

  if (!filters) return null;

  return (
    <LayerFilterPanel
      filters={filters}
      headerClassName="text-forest-inventory"
      icon={<TreePineIcon size={18} />}
      layerId={LAYER_ID}
      title={t("layers.forestInventory")}
    />
  );
};
