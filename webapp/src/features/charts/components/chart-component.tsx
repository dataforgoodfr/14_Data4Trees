import type { ComponentType, FC, PropsWithChildren } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";

type ChartComponentProps = PropsWithChildren<{
  title?: string;
  description?: string;
  className?: string;
}>;

export const ChartComponent: FC<ChartComponentProps> = ({
  title,
  description,
  className,
  children,
}) => {
  return (
    <Card className={`flex flex-col ${className ?? ""}`}>
      {(title || description) && (
        <CardHeader className="items-center">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0">{children}</CardContent>
    </Card>
  );
};

ChartComponent.displayName = "ChartComponent";

export const markChartComponent = <P extends object>(
  component: ComponentType<P>,
): ComponentType<P> & { isChartComponent: boolean } =>
  Object.assign(component, { isChartComponent: true });
