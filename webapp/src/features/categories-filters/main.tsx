import type { FC } from "react";

import { useTranslation } from "@i18n";

import type { CheckedState } from "@ui/checkbox";

import { CategoriesCheckboxGroup } from "./categories-checkbox-group";
import type { CategoryFiltersState, CategoryIdentifier } from "./types";
import { useCategoriesConfig } from "./use-categories-config";

type CategoriesFiltersProps = {
  state: CategoryFiltersState;
  setState: (value: CategoryFiltersState) => void;
  disabled?: boolean;
};

export const CategoriesFilters: FC<CategoriesFiltersProps> = ({
  state,
  setState,
  disabled,
}) => {
  const { actions, data, system } = useCategoriesConfig();
  const { t } = useTranslation("translations");

  const getOnCheckedChange = (identifier: CategoryIdentifier) => {
    return (checkedState: CheckedState) => {
      setState({
        ...state,
        [identifier]: checkedState,
      });
    };
  };

  return (
    <div className="flex flex-col gap-md">
      <CategoriesCheckboxGroup
        disabled={disabled}
        getIsChecked={(identifier) => state[identifier]}
        getOnCheckedChange={(identifier) => getOnCheckedChange(identifier)}
        items={actions}
        title={t("filters.categories.actions.title")}
      />

      <CategoriesCheckboxGroup
        disabled={disabled}
        getIsChecked={(identifier) => state[identifier]}
        getOnCheckedChange={(identifier) => getOnCheckedChange(identifier)}
        items={data}
        title={t("filters.categories.data.title")}
      />

      <CategoriesCheckboxGroup
        disabled={disabled}
        getIsChecked={(identifier) => state[identifier]}
        getOnCheckedChange={(identifier) => getOnCheckedChange(identifier)}
        items={system}
        title={t("filters.categories.system.title")}
      />
    </div>
  );
};
