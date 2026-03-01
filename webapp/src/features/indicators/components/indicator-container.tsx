import { Button } from "@shared/ui/button";
import type { FC, ReactNode } from "react";
import { XIcon } from "lucide-react";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@shared/ui/alert";
import { cn } from "@shared/lib/utils";
import type { UseIndicatorReturnType } from "./types";
import { Divider } from "./divider";
import { IndicatorDate } from "./indicator-date";
import { IndicatorSection } from "./indicator-section";

type IndicatorContainerProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onCrossClick: () => void;
  elements: UseIndicatorReturnType;
};

export const IndicatorContainer: FC<IndicatorContainerProps> = ({
  title,
  subtitle,
  icon,
  onCrossClick,
  elements,
}) => {
  return (
    <div>
      <Alert
        className="w-full rounded-b-none border-none text-sm py-lg"
        variant="info"
      >
        {icon}
        <AlertTitle className={cn("text-foreground")}>{title}</AlertTitle>

        {subtitle && (
          <AlertDescription className={cn("text-muted-foreground text-xs")}>
            {subtitle}
          </AlertDescription>
        )}

        <AlertAction>
          <Button
            variant="ghost"
            aria-label="close-popover"
            onClick={onCrossClick}
            size="icon"
            className="text-muted-foreground hover:text-info-foreground"
          >
            <XIcon />
          </Button>
        </AlertAction>
      </Alert>

      <div className="p-md flex flex-col gap-sm text-xs">
        {elements.map((config, index) => {
          if (config.type === "divider") {
            // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
            return <Divider key={`element-divider-${index}`} />;
          }

          if (config.type === "date") {
            return (
              <IndicatorDate
                key={`element-date-${config.date}`}
                date={config.date}
              />
            );
          }

          if (config.type === "section") {
            return (
              <IndicatorSection
                title={config.title}
                key={`element-section-${title}`}
              >
                {config.children}
              </IndicatorSection>
            );
          }

          if (config.type === "customNode") {
            return config.children;
          }

          return null;
        })}
      </div>
    </div>
  );
};
