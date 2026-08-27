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
import type { FilterGroup, FilterValue } from "../types";
import { useLayerFilters } from "../use-layer-filters";

const LAYER_ID = LAYERS.INVENTORY_FOR;

const GROUP_KEYS = {
  COHORT: "cohort",
  ECOS: "ecos",
  LOC1: "loc1",
  LOC2: "loc2",
  PROJECT: "project",
  TYPE: "type",
} as const;

/**
 * `list_name` used by the external label tables. It is the *source* column name,
 * not the property the map serves: `type` comes from `typ` on this layer (it is
 * `meth` on inventaire_bio). Groups absent from this map show their raw value.
 */
const LABEL_LIST_NAMES: Record<string, string> = {
  [GROUP_KEYS.ECOS]: "ecos",
  [GROUP_KEYS.LOC1]: "loc1",
  [GROUP_KEYS.LOC2]: "loc2",
  [GROUP_KEYS.TYPE]: "typ",
};

const MapFiltersForestInventoryInner: FC<{ filters: Filters }> = ({
  filters,
}) => {
  const externalData = useExternalData();
  const { t, i18n } = useTranslation("all4trees");
  const { isReady } = useMap();
  const { getCheckboxGroupProps } = useLayerFilters({ layerId: LAYER_ID });

  const labelData = getLabelData({ externalData, layerId: LAYER_ID });

  const leaves: Record<string, { property_name: string; values: FilterValue[] }> =
    {
      [GROUP_KEYS.COHORT]: filters.cohort[LAYER_ID],
      [GROUP_KEYS.ECOS]: filters.ecos[LAYER_ID],
      [GROUP_KEYS.LOC1]: filters.loc1[LAYER_ID],
      [GROUP_KEYS.LOC2]: filters.loc2[LAYER_ID],
      [GROUP_KEYS.PROJECT]: filters.project[LAYER_ID],
      [GROUP_KEYS.TYPE]: filters.type[LAYER_ID],
    };

  // Label tables are keyed by project. Each layer carries a single project
  // today, so the first value is the right lookup key; this becomes ambiguous
  // the day a layer spans several projects.
  const project = String(leaves[GROUP_KEYS.PROJECT].values[0]);

  /**
   * Labels come from the external data, keyed by `list_name` + a **numeric**
   * `name`. `type` is served as a string ("1") because the map config does not
   * wrap it in `int()` the way it does for loc1/loc2/ecos, so the value is
   * coerced here rather than in the backend config. Falls back to the raw code
   * when the label table has no entry for it.
   */
  const getGroupItemLabel = (groupKey: string, value: FilterValue) => {
    const listName = LABEL_LIST_NAMES[groupKey];
    if (!listName) return String(value);

    return (
      findLabel(labelData, project, i18n.language, listName, Number(value)) ??
      String(value)
    );
  };

  const renderGroup = (groupKey: string, title: string) => {
    const leaf = leaves[groupKey];
    const group: FilterGroup = {
      key: groupKey,
      propertyName: leaf.property_name,
      values: leaf.values,
    };

    return (
      <CheckboxGroup
        disabled={!isReady}
        items={leaf.values.map((value) => ({
          identifier: String(value),
          label: getGroupItemLabel(groupKey, value),
        }))}
        title={title}
        {...getCheckboxGroupProps(group)}
      />
    );
  };

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex flex-row justify-start items-center gap-1 text-forest-inventory">
        <TreePineIcon size={18} />
        <CardTitle> {t("layers.forestInventory")}</CardTitle>
      </div>

      <Separator />

      {renderGroup(GROUP_KEYS.PROJECT, t("filters.groups.project"))}
      {renderGroup(GROUP_KEYS.TYPE, t("filters.groups.type"))}
      {renderGroup(GROUP_KEYS.COHORT, t("filters.groups.cohort"))}
      {renderGroup(GROUP_KEYS.LOC1, t("filters.groups.loc1"))}
      {renderGroup(GROUP_KEYS.LOC2, t("filters.groups.loc2"))}
      {renderGroup(GROUP_KEYS.ECOS, t("filters.groups.ecos"))}
    </Card>
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
