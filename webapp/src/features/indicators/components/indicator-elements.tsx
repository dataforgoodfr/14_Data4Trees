import type { FC } from "react";

import { IndicatorDate } from "./indicator-date";
import { IndicatorSection } from "./indicator-section";
import type { UseIndicatorReturnType } from "./types";

type IndicatorContainerProps = {
  elements: UseIndicatorReturnType;
};

export const IndicatorElements: FC<IndicatorContainerProps> = ({
  elements,
}) => {
  return (
    <>
      {elements.map((config, index) => {
        if (config.type === "divider") {
          return (
            <hr
              className="border-info-foreground/30"
              // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
              key={`element-divider-${index}`}
            />
          );
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
              key={`element-section-${config.identifier}`}
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
    </>
  );
};
