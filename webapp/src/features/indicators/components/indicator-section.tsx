import type { FC, PropsWithChildren, ReactNode } from "react";
import React from "react";

type IndicatorSectionProps = PropsWithChildren<{
  title: string;
  iconStart?: ReactNode;
}>;

const isChartElement = (node: ReactNode): boolean => {
  if (!React.isValidElement(node)) {
    return false;
  }

  const element = node as React.ReactElement<{ children?: ReactNode }>;
  const type = element.type as {
    displayName?: string;
    name?: string;
    isChartComponent?: boolean;
  };

  const componentName = type.displayName || type.name;
  if (type.isChartComponent || componentName?.includes("Chart")) {
    return true;
  }

  const children = element.props.children;
  if (!children) {
    return false;
  }

  return React.Children.toArray(children).some(isChartElement);
};

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
  const childrenArray =
    React.Children.toArray(children).flatMap(flattenChildren);
  const [valueChildren, chartChildren] = childrenArray.reduce<
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
        <h5 className="font-bold text-base">{title}</h5>
      </div>

      {valueChildren.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-sm sm:grid-cols-2">
          {valueChildren.map((child, index) => (
            <div
              className="col-span-1 min-w-0"
              key={`value-indicator-${index}`}
            >
              {child}
            </div>
          ))}
        </div>
      )}

      {chartChildren.length > 0 && (
        <div className="flex flex-col w-full gap-sm">
          {chartChildren.map((child, index) => (
            <div
              className="w-full"
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
