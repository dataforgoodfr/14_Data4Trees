import type { Dispatch, FC, SetStateAction } from "react";

import { cn } from "@shared/lib/utils";
import { useTranslation } from "@i18n";

export const FILTER_KIND = {
  category: "category",
  filtersPerCategory: "filtersPerCategory",
} as const;

export type FilterKind = keyof typeof FILTER_KIND;

type GridButtonProps = {
  onClick: () => void;
  label: string;
  isSelected: boolean;
};

const GridButton: FC<GridButtonProps> = ({ onClick, label, isSelected }) => {
  return (
    <button
      className={cn("rounded-lg overflow-hidden text-ellipsis border", {
        "border-border bg-background": isSelected,
        "text-muted-foreground hover:text-foreground hover:cursor-pointer border-transparent":
          !isSelected,
      })}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
};

type FilterKindSelectorProps = {
  value: FilterKind;
  setValue: Dispatch<SetStateAction<FilterKind>>;
  className?: string;
};

export const FilterKindSelector: FC<FilterKindSelectorProps> = ({
  value,
  setValue,
  className,
}) => {
  const { t } = useTranslation("translations");
  return (
    <div
      className={cn(
        "grid grid-cols-2 p-1 bg-card rounded-lg text-sm",
        className,
      )}
    >
      <GridButton
        isSelected={value === FILTER_KIND.category}
        label={t("filters.sidebarLayout.groupCategory")}
        onClick={() => setValue(FILTER_KIND.category)}
      />

      <GridButton
        isSelected={value === FILTER_KIND.filtersPerCategory}
        label={t("filters.sidebarLayout.groupFilters")}
        onClick={() => setValue(FILTER_KIND.filtersPerCategory)}
      />
    </div>
  );
};
