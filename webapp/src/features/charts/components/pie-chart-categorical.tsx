import type { JSX } from "react";
import { Pie, PieChart, type PieLabel } from "recharts";

import { ChartContainer, ChartTooltip } from "@ui/chart";

import { lineBreakLabel } from "../utils";
import type { ChartComponentType } from "./chart-component";
import { ChartComponent } from "./chart-component";

export const description = "A pie chart with a label";

export type PieChartCategoricalProps = {
  title: string;
  chartData: Array<{ name: string; value: number; fill: string }>;
  chartConfig: any;
  description?: string;
  withLabel?: PieLabel;
  unit?: string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  minAngle?: number;
  labelLine?: boolean;
};

export const PieChartCategorical: ChartComponentType<
  PieChartCategoricalProps
> = ({ chartData, chartConfig, title, description, withLabel, unit }) => {
  const filteredData = chartData.filter((item) => item.value > 0);
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const name = chartConfig[payload[0].name]?.label || payload[0].name;
      const tooltip = `${name}: ${payload[0].value}${unit}`;
      return (
        <div className="rounded-lg border border-border bg-background p-2 shadow-md">
          <p className="text-foreground font-medium">{tooltip}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartComponent
      description={description}
      title={title}
    >
      <ChartContainer
        // Style - Extend the width to the container, make aspect 5/4 with h auto (due to the legend, width should be superior)
        // But limit width to 720px to avoid height > 600px (the chard wouldn't fit in the screen)
        className="mx-auto max-h-full h-auto w-full max-w-180 aspect-5/4 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        config={chartConfig}
      >
        <PieChart>
          <ChartTooltip content={<CustomTooltip />} />
          <Pie
            data={filteredData}
            dataKey="value"
            label={
              withLabel === true
                ? (props) => renderLabel({ ...props, chartConfig })
                : withLabel
            }
            labelLine={false}
            nameKey="name"
            // outerRadius -> Don't specify to adapt to available width
          />
        </PieChart>
      </ChartContainer>
    </ChartComponent>
  );
};

PieChartCategorical.isChartComponent = true;

export const renderLabel = ({
  payload,
  cx,
  cy,
  midAngle,
  outerRadius,
  chartConfig,
  linebreak = 13,
}: {
  payload: any;
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  chartConfig: any;
  linebreak: number;
}): JSX.Element => {
  const label = chartConfig[payload.name]?.label || payload.name;
  const RADIAN = Math.PI / 180;
  const angle = -midAngle * RADIAN;
  const lineStartX = cx + outerRadius * Math.cos(angle);
  const lineStartY = cy + outerRadius * Math.sin(angle);
  const lineMidX = cx + (outerRadius + 10) * Math.cos(angle);
  const lineMidY = cy + (outerRadius + 10) * Math.sin(angle);
  const labelX = lineMidX + (lineMidX > cx ? 14 : -14);
  const labelY = lineMidY;
  const textAnchor = lineMidX > cx ? "start" : "end";
  const lines = lineBreakLabel(label, linebreak);

  return (
    <g>
      <polyline
        fill="none"
        points={`${lineStartX},${lineStartY} ${lineMidX},${lineMidY} ${labelX},${labelY}`}
        stroke="var(--foreground)"
        strokeWidth={1}
      />
      <text
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={10}
        fontWeight={500}
        textAnchor={textAnchor}
        x={labelX}
        y={labelY}
      >
        {lines.map((line, index) => (
          <tspan
            dy={index === 0 ? 0 : 11}
            // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
            key={index}
            x={labelX}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};
