import type { FC, ReactNode } from "react";

import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";

import { toCheckboxItems } from "../labels";
import type { FilterGroup, FilterOption } from "../types";
import { useLayerFilters } from "../use-layer-filters";
import { CheckboxGroup } from "./checkbox-group";
import { CollapsibleSection } from "./collapsible-section";

export type PanelFilterGroup = FilterGroup & {
  title: string;
};

/** Turn a `getFilters()` leaf into a group the panel can render. */
export const toPanelGroup = ({
  key,
  leaf,
  title,
}: {
  key: string;
  leaf: { property_name: string; values: FilterOption[] };
  title: string;
}): PanelFilterGroup => ({
  key,
  options: leaf.values,
  propertyName: leaf.property_name,
  title,
});

type LayerFilterPanelProps = {
  layerId: string;
  title: string;
  icon: ReactNode;
  /** Colour class for the header, e.g. `text-forest-inventory`. */
  headerClassName: string;
  groups: PanelFilterGroup[];
};

/**
 * One layer's filter card: a checkbox group per filter, bound to that layer's
 * persisted state.
 *
 * Labels come with the `getFilters()` payload, already resolved per project by
 * the backend, so the panel only picks the current language.
 */
export const LayerFilterPanel: FC<LayerFilterPanelProps> = ({
  layerId,
  title,
  icon,
  headerClassName,
  groups,
}) => {
  const { i18n } = useTranslation("all4trees");
  const { isReady } = useMap();
  const { getCheckboxGroupProps } = useLayerFilters({ layerId });

  return (
    <CollapsibleSection
      headerClassName={headerClassName}
      icon={icon}
      identifier={layerId}
      title={title}
    >
      {groups.map((group) => (
        <CheckboxGroup
          disabled={!isReady}
          items={toCheckboxItems(group.options, i18n.language)}
          key={group.key}
          // Codes repeat across groups and layers, so the DOM ids need both.
          namespace={`${layerId}-${group.key}`}
          title={group.title}
          {...getCheckboxGroupProps(group)}
        />
      ))}
    </CollapsibleSection>
  );
};
