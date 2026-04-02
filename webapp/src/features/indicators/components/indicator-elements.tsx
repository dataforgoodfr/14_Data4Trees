import { cx } from "class-variance-authority";
import type { FC } from "react";

import { Divider } from "./divider";
import { IndicatorDate } from "./indicator-date";
import { IndicatorSection } from "./indicator-section";
import type { UseIndicatorReturnType } from "./types";

type IndicatorContainerProps = {
  elements: UseIndicatorReturnType;
  className?: string;
};

export const IndicatorElements: FC<IndicatorContainerProps> = ({
  elements,
  className,
}) => {
  return (
    <div
      className={cx(
        "p-md flex flex-col gap-md text-xs",
        "overflow-y-scroll custom-scrollbar",
        className ?? "",
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
  );
};
