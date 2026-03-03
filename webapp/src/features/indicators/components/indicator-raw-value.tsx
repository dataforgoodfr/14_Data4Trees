import type { FC, ReactNode } from "react";

type IndicatorRawValueProps = {
  dataName: string;
  value: string | number | boolean;
  iconStart?: ReactNode;
};

export const IndicatorRawValue: FC<IndicatorRawValueProps> = ({
  dataName,
  value,
  iconStart,
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-sm flex-1">
      <div className="flex flex-row items-center gap-xs text-muted-foreground">
        {iconStart}
        <p>{dataName}</p>
      </div>
      <p className="text-foreground">
        {typeof value === "string" ? value : String(value)}
      </p>
    </div>
  );
};
