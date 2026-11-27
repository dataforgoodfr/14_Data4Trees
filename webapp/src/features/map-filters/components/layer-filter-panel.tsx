import type { FC, ReactNode } from "react";

import {
  CheckboxGroup,
  CollapsibleSection,
  toCheckboxItems,
} from "@features/base-filters";

import type { Filters } from "@shared/api/types";
import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";

import { GROUP_TITLE_KEYS, type GroupKey } from "../constants";
import { getLayerGroups } from "../groups";
import { useLayerFilters } from "../use-layer-filters";

type LayerFilterPanelProps = {
  layerId: string;
  filters: Filters;
  title: string;
  icon: ReactNode;
  /** Colour class for the header, e.g. `text-forest-inventory`. */
  headerClassName: string;
  /** Group titles that differ on this layer (e.g. its `type`). */
  groupTitles?: Partial<Record<GroupKey, string>>;
};

/**
 * One layer's filter card: a checkbox group per filter of `LAYER_GROUP_KEYS`,
 * bound to that layer's state.
 *
 * Labels come with the `getFilters()` payload, already resolved per project by
 * the backend, so the panel only picks the current language.
 */
export const LayerFilterPanel: FC<LayerFilterPanelProps> = ({
  layerId,
  filters,
  title,
  icon,
  headerClassName,
  groupTitles,
}) => {
  const { t, i18n } = useTranslation("all4trees");
  const { isReady } = useMap();
  const { getCheckboxGroupProps } = useLayerFilters({ layerId });

  return (
    <CollapsibleSection
      headerClassName={headerClassName}
      icon={icon}
      identifier={layerId}
      title={title}
    >
      {getLayerGroups(filters, layerId).map((group) => (
        <CheckboxGroup
          disabled={!isReady}
          items={toCheckboxItems(group.options, i18n.language)}
          key={group.key}
          // Codes repeat across groups and layers, so the DOM ids need both.
          namespace={`${layerId}-${group.key}`}
          title={groupTitles?.[group.key] ?? t(GROUP_TITLE_KEYS[group.key])}
          {...getCheckboxGroupProps(group)}
        />
      ))}
    </CollapsibleSection>
  );
};
