import { cx } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { Card, CardTitle } from "@shared/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shared/ui/collapsible";
import { Separator } from "@shared/ui/separator";

type LayerFilterPanelProps = {
  identifier: string;
  title: string;
  icon: ReactNode;
  headerClassName: string;
  children: ReactNode;
};

export const CollapsibleSection: FC<LayerFilterPanelProps> = ({
  identifier,
  title,
  icon,
  children,
  headerClassName,
}) => {
  return (
    <Collapsible key={`collapse-${identifier}`}>
      <Card className="p-4 flex flex-col gap-2">
        <CollapsibleTrigger
          className={cx(
            "flex flex-row justify-start items-center gap-1",
            "hover:cursor-pointer group/button",
            headerClassName,
          )}
        >
          {icon}
          <CardTitle>{title}</CardTitle>
          <ChevronDownIcon className="ml-auto group-aria-[expanded=true]/button:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent className="flex flex-col gap-2">
          <Separator />
          {children}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
