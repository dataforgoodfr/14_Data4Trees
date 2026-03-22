import type { Dispatch, FC, SetStateAction } from "react";

import { useTranslation } from "@i18n";

import { CategoriesCheckboxGroup } from "./categories-checkbox-group";
import type { CategoryFiltersState } from "./types";
import { useCategoriesConfig } from "./use-categories-config";

type CategoriesFiltersProps = {
  state?: CategoryFiltersState;
  setState?: Dispatch<SetStateAction<CategoryFiltersState>>;
};

export const CategoriesFilters: FC<CategoriesFiltersProps> = () => {
  const { actions, data, system } = useCategoriesConfig();
  const { t } = useTranslation("translations");

  return (
    <div className="flex flex-col gap-md">
      <CategoriesCheckboxGroup
        isUpdating={false}
        items={actions}
        title={t("filters.categories.actions.title")}
      />

      <CategoriesCheckboxGroup
        isUpdating={false}
        items={data}
        title={t("filters.categories.data.title")}
      />

      <CategoriesCheckboxGroup
        isUpdating={false}
        items={system}
        title={t("filters.categories.system.title")}
      />
    </div>
  );
};
