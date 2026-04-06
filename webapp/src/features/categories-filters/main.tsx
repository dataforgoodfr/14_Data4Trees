import type { FC } from "react";

import {
  type CategoryIdentifier,
  parseLayerId,
} from "@shared/api/categories-filters";
import { useMap } from "@shared/hooks/useMap";
import { useTranslation } from "@i18n";

import type { CheckedState } from "@ui/checkbox";

import { AllOrNoneSelector } from "./all-or-none-selector";
import { CategoriesCheckboxGroup } from "./categories-checkbox-group";
import { useCategoriesConfig } from "./use-categories-config";

type CategoriesFiltersProps = {
  disabled?: boolean;
};

export const CategoriesFilters: FC<CategoriesFiltersProps> = ({ disabled }) => {
  const { actions, data, system } = useCategoriesConfig();
  const { t } = useTranslation("translations");
  const { mapApiRef, setCategoriesFilters, categoriesFilters } = useMap();

  const getOnCheckedChange = (identifier: CategoryIdentifier) => {
    return (checkedState: CheckedState) => {
      // Update website state and storage
      setCategoriesFilters((prev) => ({
        ...prev,
        [identifier]: checkedState,
      }));
      // Update coordo map
      const layerId = parseLayerId(identifier);

      if (!layerId || !mapApiRef.current) {
        return;
      }

      try {
        if (checkedState) {
          mapApiRef.current.showLayer(layerId);
        } else {
          mapApiRef.current.hideLayer(layerId);
        }
      } catch (error) {
        console.error(error);
      }
    };
  };

  return (
    <div className="flex flex-col gap-md">
      <AllOrNoneSelector />

      <CategoriesCheckboxGroup
        disabled={disabled}
        getIsChecked={(identifier) => categoriesFilters[identifier]}
        getOnCheckedChange={(identifier) => getOnCheckedChange(identifier)}
        items={actions}
        title={t("filters.categories.actions.title")}
      />

      <CategoriesCheckboxGroup
        disabled={disabled}
        getIsChecked={(identifier) => categoriesFilters[identifier]}
        getOnCheckedChange={(identifier) => getOnCheckedChange(identifier)}
        items={data}
        title={t("filters.categories.data.title")}
      />

      <CategoriesCheckboxGroup
        disabled={disabled}
        getIsChecked={(identifier) => categoriesFilters[identifier]}
        getOnCheckedChange={(identifier) => getOnCheckedChange(identifier)}
        items={system}
        title={t("filters.categories.system.title")}
      />
    </div>
  );
};
