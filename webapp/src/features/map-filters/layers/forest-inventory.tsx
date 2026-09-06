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

import { CheckboxGroup } from "../components/checkbox-group";
import type { FilterGroup } from "../types";
import { useLayerFilters } from "../use-layer-filters";

const GROUP_KEYS = {
  Loc1: "loc1",
  Project: "project",
} as const;

const MapFiltersForestInventoryInner: FC<{ filters: Filters }> = ({
  filters,
}) => {
  const externalData = useExternalData();
  const { t, i18n } = useTranslation("all4trees");
  const { isReady } = useMap();
  const { getCheckboxGroupProps } = useLayerFilters({
    layerId: LAYERS.INVENTORY_FOR,
  });

  const labelData = getLabelData({
    externalData,
    layerId: LAYERS.INVENTORY_FOR,
  });

  const projects = filters[GROUP_KEYS.Project][LAYERS.INVENTORY_FOR];
  const loc1s = filters[GROUP_KEYS.Loc1][LAYERS.INVENTORY_FOR];

  const projectGroup: FilterGroup = {
    key: GROUP_KEYS.Project,
    propertyName: projects.property_name,
    values: projects.values,
  };

  const loc1Group: FilterGroup = {
    key: GROUP_KEYS.Loc1,
    propertyName: loc1s.property_name,
    values: loc1s.values,
  };

  const getLock1Label = (value: number) =>
    findLabel(labelData, projects.values[0], i18n.language, "loc1", value) ??
    value.toString();

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex flex-row justify-start items-center gap-1 text-forest-inventory">
        <TreePineIcon size={18} />
        <CardTitle> {t("layers.forestInventory")}</CardTitle>
      </div>

      <Separator />

      <CheckboxGroup
        disabled={!isReady}
        items={projects.values.map((value) => ({
          identifier: value,
          label: value,
        }))}
        title="Projects"
        {...getCheckboxGroupProps(projectGroup)}
      />

      <CheckboxGroup
        disabled={!isReady}
        items={loc1s.values.map((value) => ({
          identifier: value.toString(),
          label: getLock1Label(value),
        }))}
        title="Loc1"
        {...getCheckboxGroupProps(loc1Group)}
      />
    </Card>
  );
};

export const MapFiltersForestInventory: FC<{ filters: Filters | null }> = ({
  filters,
}) => {
  if (!filters) return null;

  return (
    <ExternalDataBoundary layerId={LAYERS.INVENTORY_FOR}>
      <MapFiltersForestInventoryInner filters={filters} />
    </ExternalDataBoundary>
  );
};
