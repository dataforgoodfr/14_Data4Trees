import { cx } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@shared/i18n";
import { Card, CardTitle } from "@shared/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shared/ui/collapsible";
import { Separator } from "@shared/ui/separator";

import { toCheckboxItems } from "../labels";
import type { FilterGroup, FilterOption } from "../types";
import { useLayerFilters } from "../use-layer-filters";
import { CheckboxGroup } from "./checkbox-group";

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
    <Collapsible key={`collapse-${layerId}`}>
      <Card className="p-4 flex flex-col gap-2">
        <CollapsibleTrigger
          className={cx(
            "flex flex-row justify-start items-center gap-1",
            "hover:cursor-pointer group/button",
            headerClassName,
          )}
        >
          {icon}
          <CardTitle>{title}</CardTitle>
          <ChevronDownIcon className="ml-auto group-aria-[expanded=true]/button:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent className="flex flex-col gap-2">
          <Separator />

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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
