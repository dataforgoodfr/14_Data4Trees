import type { FC, JSX } from "react";
import { Pie, PieChart, type PieLabel } from "recharts";

import { ChartContainer, ChartTooltip } from "@ui/chart";

import { lineBreakLabel } from "../utils";
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

export const PieChartCategorical: FC<PieChartCategoricalProps> = ({
  chartData,
  chartConfig,
  title,
  description,
  withLabel,
  unit,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-background p-2 shadow-md">
          <p className="text-foreground font-medium">
            {chartConfig[payload[0].name]?.label || payload[0].name}:{" "}
            {payload[0].value} {unit}
          </p>
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
        className="mx-auto h-90 w-full max-w-full aspect-auto pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        config={chartConfig}
      >
        <PieChart>
          <ChartTooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            dataKey="value"
            label={
              withLabel
                ? (props) => renderLabel({ ...props, chartConfig })
                : false
            }
            labelLine={false}
            nameKey="name"
            outerRadius={140}
          />
        </PieChart>
      </ChartContainer>
    </ChartComponent>
  );
};

const renderLabel = ({
  payload,
  cx,
  cy,
  midAngle,
  outerRadius,
  chartConfig,
}: {
  payload: any;
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  chartConfig: any;
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
  const lines = lineBreakLabel(label, 13);

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
