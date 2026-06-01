import type { FC, PropsWithChildren, ReactNode } from "react";
import React from "react";

import { isChartElement } from "@features/charts/utils";

import { Card, CardContent } from "@shared/ui/card";

type IndicatorSectionProps = PropsWithChildren<{
  title: string;
  iconStart?: ReactNode;
}>;

// Put a node and all its children in the same array
const flattenChildren = (node: ReactNode): ReactNode[] => {
  if (!React.isValidElement(node)) {
    return [node];
  }

  if (node.type === React.Fragment) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    return React.Children.toArray(element.props.children).flatMap(
      flattenChildren,
    );
  }

  return [node];
};

export const IndicatorSection: FC<IndicatorSectionProps> = ({
  title,
  iconStart,
  children,
}) => {
  const childrenArray = flattenChildren(children);

  // Divide indicator elements in 2 categories
  // valueIndicators will be displayed inside a Card Component to improve visibility
  // chartIndicators are already put (individually) inside a Card.
  const [valueIndicators, chartIndicators] = childrenArray.reduce<
    [ReactNode[], ReactNode[]]
  >(
    ([values, charts], child) => {
      return isChartElement(child)
        ? [values, [...charts, child]]
        : [[...values, child], charts];
    },
    [[], []],
  );

  return (
    <section className="flex flex-col w-full gap-sm">
      <div className="flex flex-row items-center gap-xs">
        {iconStart}
        <h5 className="px-5 pb-2 font-bold text-base">{title}</h5>
      </div>

      {valueIndicators.length > 0 && (
        <Card>
          <CardContent className="py-sm">{valueIndicators}</CardContent>
        </Card>
      )}

      {chartIndicators.length > 0 && (
        <div className="flex flex-col w-full gap-sm">
          {chartIndicators.map((child, index) => (
            <div
              className="w-full"
              // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
              key={`chart-indicator-${index}`}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
