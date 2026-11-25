import type { FC } from "react";

import { useTranslation } from "@shared/i18n";
import { cn } from "@shared/lib/utils";

import { Button } from "@ui/button";

type AllOrNoneToggleProps = {
  /** Everything is selected: "All" is highlighted and does nothing. */
  isAll: boolean;
  /** Nothing is selected: "None" is highlighted and does nothing. */
  isNone: boolean;
  onAll: () => void;
  onNone: () => void;
  disabled?: boolean;
};

/**
 * Two buttons selecting everything or nothing at once. Neither is highlighted
 * for a partial selection.
 *
 * Presentational: each panel decides what "everything" and "nothing" mean.
 */
export const AllOrNoneToggle: FC<AllOrNoneToggleProps> = ({
  isAll,
  isNone,
  onAll,
  onNone,
  disabled,
}) => {
  const { t } = useTranslation("all4trees");

  const getButtonProps = (isActive: boolean) =>
    ({
      className: cn("flex-1", { "hover:cursor-default": isActive }),
      disabled,
      size: "sm",
      variant: isActive ? "default" : "outline",
    }) as const;

  return (
    <div className="flex flex-row justify-center items-center gap-2">
      <Button
        onClick={isAll ? undefined : onAll}
        {...getButtonProps(isAll)}
      >
        {t("filters.allOrNone.all")}
      </Button>

      <Button
        onClick={isNone ? undefined : onNone}
        {...getButtonProps(isNone)}
      >
        {t("filters.allOrNone.none")}
      </Button>
    </div>
  );
};
