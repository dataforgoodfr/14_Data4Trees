import type { PropsWithChildren } from "react";

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

export type MarkedComponent<P = any> = React.ComponentType<P> & {
  isChartComponent?: true;
};

export type ChartComponentType<P> = React.FC<P> & {
  isChartComponent?: true;
};

export const ChartComponent: ChartComponentType<ChartComponentProps> = ({
  title,
  description,
  className,
  children,
}) => {
  return (
    <Card className={`flex flex-col ${className ?? ""}`}>
      {(title || description) && (
        <CardHeader className="items-center text-base">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0">{children}</CardContent>
    </Card>
  );
};

ChartComponent.isChartComponent = true;
