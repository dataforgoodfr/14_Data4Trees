import type { FC, ReactNode } from "react";

import { Card, CardContent } from "@shared/ui/card";

type IndicatorRawValueProps = {
  dataName: string;
  value?: string | number | boolean | null;
  iconStart?: ReactNode;
};

export const IndicatorRawValue: FC<IndicatorRawValueProps> = ({
  dataName,
  value,
  iconStart,
}) => {
  if (value == null) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-row items-center justify-between gap-sm flex-1 mt-5">
          <div className="flex flex-row items-center gap-xs text-muted-foreground">
            {iconStart}
            <p>{dataName}</p>
          </div>
          <p className="text-foreground text-end">
            {typeof value === "string" ? value : String(value)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
