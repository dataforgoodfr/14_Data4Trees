import type { FC } from "react";

import {
  type CategoriesFiltersState,
  parseLayerId,
} from "@shared/api/categories-filters";
import { useMapContext } from "@shared/contexts/map-context-all4trees";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { useTranslation } from "@i18n";

import { CATEGORY_IDENTIFIERS } from "./constants";

export const AllOrNoneSelector: FC = () => {
  const { mapApiRef, setCategoriesFilters, categoriesFilters } =
    useMapContext();
  const { t } = useTranslation("translations");

  const isAll = Object.values(categoriesFilters).every(Boolean);
  const isNone = Object.values(categoriesFilters).every((value) => !value);

  const onAllClick = () => {
    if (isAll) {
      // Skip, nothing to do
      return;
    }
    const newState = Object.fromEntries(
      Object.values(CATEGORY_IDENTIFIERS).map((identifier) => [
        identifier,
        true,
      ]),
    ) as CategoriesFiltersState;
    setCategoriesFilters(newState);

    Object.values(CATEGORY_IDENTIFIERS).forEach((identifier) => {
      const layerId = parseLayerId(identifier);
      if (!layerId) {
        return;
      }
      mapApiRef.current?.showLayer(layerId);
    });
  };

  const onNoneClick = () => {
    if (isNone) {
      // Skip, nothing to do
      return;
    }
    const newState = Object.fromEntries(
      Object.values(CATEGORY_IDENTIFIERS).map((identifier) => [
        identifier,
        false,
      ]),
    ) as CategoriesFiltersState;
    setCategoriesFilters(newState);

    Object.values(CATEGORY_IDENTIFIERS).forEach((identifier) => {
      const layerId = parseLayerId(identifier);
      if (!layerId) {
        return;
      }
      mapApiRef.current?.hideLayer(layerId);
    });
  };

  const getButtonProps = (isActive: boolean) =>
    ({
      className: cn("flex-1", { "hover:cursor-default": isActive }),
      size: "sm",
      variant: isActive ? "default" : "outline",
    }) as const;

  return (
    <div className="flex flex-row justify-center items-center gap-sm">
      <Button
        onClick={onAllClick}
        {...getButtonProps(isAll)}
      >
        {t("filters.categories.all")}
      </Button>

      <Button
        onClick={onNoneClick}
        {...getButtonProps(isNone)}
      >
        {t("filters.categories.none")}
      </Button>
    </div>
  );
};
