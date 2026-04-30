import type { FC } from "react";
import { Pie, PieChart, type PieLabel } from "recharts";

import { ChartComponent } from "./chart-component";
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
    <ChartComponent title={title} description={description}>
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
    </ChartComponent>
  );
};
