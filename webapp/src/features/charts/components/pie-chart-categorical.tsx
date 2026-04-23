import type { FC } from "react";
import { Pie, PieChart, type PieLabel } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/chart";

export const description = "A pie chart with a label";

export type PieChartCategoricalProps = {
  title: string;
  chartData: Array<{ name: string; value: number; fill: string }>;
  chartConfig: any;
  description?: string;
  withLabel?: PieLabel;
};

export const PieChartCategorical: FC<PieChartCategoricalProps> = ({
  chartData,
  chartConfig,
  title,
  description,
  withLabel,
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-90 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          config={chartConfig}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              label={withLabel}
              nameKey="name"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
