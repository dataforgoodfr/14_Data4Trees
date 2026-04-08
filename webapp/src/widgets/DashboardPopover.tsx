import type { FC } from "react";

import { Button } from "@ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

export type DashboardPopoverProps = {
  dataType: string;
};

export const DashboardPopover: FC<DashboardPopoverProps> = ({ dataType }) => {
  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button variant="default">Montrer Dashboard</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dashboard</h4>
            <p className="text-muted-foreground text-sm">
              Simple graphs to represent data {dataType}
            </p>
          </div>
          <div className="grid gap-2"></div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
