import { cx } from "class-variance-authority";
import type { FC, ReactNode } from "react";

import { useExternalData } from "@features/external-data/context";
import { getLabelData } from "@features/external-data/getter";
import { findLabel } from "@features/indicators/labels";

import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";
import { Card, CardTitle } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";

import type { FilterGroup, FilterValue } from "../types";
import { useLayerFilters } from "../use-layer-filters";
import { CheckboxGroup } from "./checkbox-group";

/**
 * Type of the `name` column in the layer's external label table, which decides
 * how a value must be coerced before the lookup — `findLabel` compares strictly.
 *
 * `for_label` and `bio_label` store numbers, `hh_label` stores strings, and the
 * layer properties do not always match: `type` is served as a string on both
 * inventory layers because the map config does not wrap it in `int()`.
 */
export const LABEL_KEY_TYPES = {
  NUMBER: "number",
  STRING: "string",
} as const;

export type LabelKeyType =
  (typeof LABEL_KEY_TYPES)[keyof typeof LABEL_KEY_TYPES];

export type PanelFilterGroup = FilterGroup & {
  title: string;
  /** `list_name` in the label table. Omit to display raw values. */
  labelListName?: string;
};

/** Turn a `getFilters()` leaf into a group the panel can render. */
export const toPanelGroup = ({
  key,
  leaf,
  title,
  labelListName,
}: {
  key: string;
  leaf: { property_name: string; values: FilterValue[] };
  title: string;
  labelListName?: string;
}): PanelFilterGroup => ({
  key,
  labelListName,
  propertyName: leaf.property_name,
  title,
  values: leaf.values,
});

type LayerFilterPanelProps = {
  layerId: string;
  title: string;
  icon: ReactNode;
  /** Colour class for the header, e.g. `text-forest-inventory`. */
  headerClassName: string;
  /** Label tables are keyed by project. */
  project: string;
  labelKeyType: LabelKeyType;
  groups: PanelFilterGroup[];
};

/**
 * One layer's filter card: a checkbox group per filter, bound to that layer's
 * persisted state.
 *
 * Must be rendered inside an `<ExternalDataBoundary>` for the layer, since it
 * resolves labels through `useExternalData()`.
 */
export const LayerFilterPanel: FC<LayerFilterPanelProps> = ({
  layerId,
  title,
  icon,
  headerClassName,
  project,
  labelKeyType,
  groups,
}) => {
  const externalData = useExternalData();
  const { i18n } = useTranslation("all4trees");
  const { isReady } = useMap();
  const { getCheckboxGroupProps } = useLayerFilters({ layerId });

  const labelData = getLabelData({ externalData, layerId });

  const getItemLabel = (group: PanelFilterGroup, value: FilterValue) => {
    if (!group.labelListName) return String(value);

    const labelKey =
      labelKeyType === LABEL_KEY_TYPES.NUMBER ? Number(value) : String(value);

    return (
      findLabel(
        labelData,
        project,
        i18n.language,
        group.labelListName,
        labelKey,
      ) ?? String(value)
    );
  };

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div
        className={cx(
          "flex flex-row justify-start items-center gap-1",
          headerClassName,
        )}
      >
        {icon}
        <CardTitle>{title}</CardTitle>
      </div>

      <Separator />

      {groups.map((group) => (
        <CheckboxGroup
          disabled={!isReady}
          items={group.values.map((value) => ({
            identifier: String(value),
            label: getItemLabel(group, value),
          }))}
          key={group.key}
          title={group.title}
          {...getCheckboxGroupProps(group)}
        />
      ))}
    </Card>
  );
};
