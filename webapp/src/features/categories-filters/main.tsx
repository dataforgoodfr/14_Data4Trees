import { LayersIcon } from "lucide-react";
import type { FC } from "react";

import { CheckboxGroup, CollapsibleSection } from "@features/base-filters";

import {
  type CategoryIdentifier,
  parseLayerId,
} from "@shared/api/categories-filters";
import { useMap } from "@shared/hooks/use-map-all4trees";
import { useTranslation } from "@i18n";

import type { CheckedState } from "@ui/checkbox";

import { useCategoriesConfig } from "./use-categories-config";
import { changeLayerVisibility } from "./use-categories-filters";

/**
 * Which layers are shown, as a card like the filter panels below it. Open by
 * default: it is the first thing to set.
 */
export const CategoriesFilters: FC = () => {
  const { actions } = useCategoriesConfig();
  const { t } = useTranslation("all4trees");
  const { isReady, mapApiRef, setCategoriesFilters, categoriesFilters } =
    useMap();

  const getOnCheckedChange = (identifier: string) => {
    return (checkedState: CheckedState) => {
      // Update website state and storage
      setCategoriesFilters((prev) => ({
        ...prev,
        [identifier]: checkedState === true,
      }));
      // Update coordo map
      const layerId = parseLayerId(identifier);

      if (!layerId || !mapApiRef.current) {
        return;
      }

      try {
        changeLayerVisibility({
          hideLayer: mapApiRef.current.hideLayer,
          isActive: checkedState === true,
          layerId,
          showLayer: mapApiRef.current.showLayer,
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  return (
    <CollapsibleSection
      defaultOpen
      headerClassName=""
      icon={<LayersIcon size={18} />}
      identifier="categories-filters"
      title={t("filters.categories.actions.title")}
    >
      <CheckboxGroup
        disabled={!isReady}
        getIsChecked={(identifier) =>
          categoriesFilters[identifier as CategoryIdentifier]
        }
        getOnCheckedChange={getOnCheckedChange}
        items={actions}
        namespace="categories"
      />
    </CollapsibleSection>
  );
};
