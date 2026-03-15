import { cx } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { cn } from "@shared/lib/utils";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@shared/ui/alert";
import { Button } from "@shared/ui/button";

import { ICON_SIZE_HEADER } from "./constants";
import { Divider } from "./divider";
import { IndicatorDate } from "./indicator-date";
import { IndicatorSection } from "./indicator-section";
import type { UseIndicatorReturnType } from "./types";

type IndicatorContainerProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onCrossClick: () => void;
  elements: UseIndicatorReturnType;
  className?: string;
};

export const IndicatorContainer: FC<IndicatorContainerProps> = ({
  title,
  subtitle,
  icon,
  onCrossClick,
  elements,
  className,
}) => {
  return (
    <div className={cx(className ?? "", "flex flex-col")}>
      <Alert
        className="w-full rounded-t-md rounded-b-none border-none text-sm py-lg"
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
            aria-label="close-popover"
            className="text-muted-foreground hover:text-info-foreground"
            onClick={onCrossClick}
            size="icon"
            variant="ghost"
          >
            <XIcon size={ICON_SIZE_HEADER} />
          </Button>
        </AlertAction>
      </Alert>

      <div
        className={cx(
          "p-md flex flex-col gap-md text-xs",
          "overflow-y-scroll custom-scrollbar",
        )}
        style={{
          "--scrollbar-thumb": "var(--info-foreground)",
          "--scrollbar-track": "var(--background)",
        }}
      >
        {elements.map((config, index) => {
          if (config.type === "divider") {
            // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
            return <Divider key={`element-divider-${index}`} />;
          }

          if (config.type === "date") {
            return (
              <IndicatorDate
                date={config.date}
                key={`element-date-${config.date}`}
              />
            );
          }

          if (config.type === "section") {
            return (
              <IndicatorSection
                iconStart={config.iconStart}
                key={`element-section-${config.title}`}
                title={config.title}
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
