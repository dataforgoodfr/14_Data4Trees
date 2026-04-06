import type { FC } from "react";

import { cn } from "@shared/lib/utils";

type Option = {
  label: string;
  id: string;
};

type GridSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  options: Option[];
};

export const GridSelector: FC<GridSelectorProps> = ({
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <div
      className={cn("grid p-1 bg-card rounded-lg text-sm", className)}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))`,
      }}
    >
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            className={cn("rounded-lg overflow-hidden text-ellipsis border", {
              "border-border bg-background": isSelected,
              "text-muted-foreground hover:text-foreground hover:cursor-pointer border-transparent":
                !isSelected,
            })}
            key={`grid-selector-option-${option.id}`}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
