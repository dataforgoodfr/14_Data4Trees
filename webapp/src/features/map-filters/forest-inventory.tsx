import { TreePineIcon } from "lucide-react";
import type { FC } from "react";

import { useExternalData } from "@features/external-data/context";
import { getLabelData } from "@features/external-data/getter";
import { ExternalDataBoundary } from "@features/external-data/suspense-boundary";
import { findLabel } from "@features/indicators/labels";

import { LAYERS } from "@shared/api/layers";
import type { Filters } from "@shared/api/types";
import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";
import { Card, CardTitle } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";

import { CheckboxGroup } from "./components/checkbox-group";

type MapFiltersForestInventoryProps = {
  filters: Filters | null;
};

const MapFiltersForestInventoryInner: FC<MapFiltersForestInventoryProps> = ({
  filters,
}) => {
  const externalData = useExternalData();
  const { t, i18n } = useTranslation("all4trees");
  const { mapApiRef, isReady } = useMap();

  if (!filters) return null;

  const labelData = getLabelData({
    externalData,
    layerId: LAYERS.INVENTORY_FOR,
  });

  const projects = filters["project"][LAYERS.INVENTORY_FOR];
  const loc1s = filters["loc1"][LAYERS.INVENTORY_FOR];

  const getLock1Label = (value: number) =>
    findLabel(labelData, projects.values[0], i18n.language, "loc1", value) ??
    value.toString();

  /** @todo Use mapApiRef to set filter (frontend) on the map  */

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex flex-row justify-start items-center gap-1 text-forest-inventory">
        <TreePineIcon size={18} />
        <CardTitle> {t("layers.forestInventory")}</CardTitle>
      </div>

      <Separator />

      <CheckboxGroup
        disabled={!isReady}
        getIsChecked={() => true}
        getOnCheckedChange={(props) => console.log(props)}
        items={projects.values.map((value) => ({
          identifier: value,
          label: value,
        }))}
        title="Projects"
      />

      <CheckboxGroup
        disabled={!isReady}
        getIsChecked={() => true}
        getOnCheckedChange={(props) => console.log(props)}
        items={loc1s.values.map((value) => ({
          identifier: value.toString(),
          label: getLock1Label(value),
        }))}
        title="Loc1"
      />
    </Card>
  );
};

export const MapFiltersForestInventory: FC<MapFiltersForestInventoryProps> = ({
  filters,
}) => (
  <ExternalDataBoundary layerId={LAYERS.INVENTORY_FOR}>
    <MapFiltersForestInventoryInner filters={filters} />
  </ExternalDataBoundary>
);
