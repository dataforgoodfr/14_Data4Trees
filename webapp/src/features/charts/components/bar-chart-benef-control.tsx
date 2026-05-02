import type { FC } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useTranslation } from "@shared/i18n";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@shared/ui/chart";

import { ChartComponent } from "./chart-component";

type BarChartProps = {
  title: string;
  chartData: Array<{ indicator: string; benef: unknown; temoin?: unknown }>;
  legendLabel: string;
  withTemoin?: boolean;
};

export const BarCharWithBenefAndControl: FC<BarChartProps> = ({
  title,
  chartData,
  legendLabel,
  withTemoin,
}) => {
  const { t } = useTranslation("translations");
  const chartConfig = {
    benef: {
      color: "var(--chart-1)",
      label: `(${t("indicators.common.beneficiary")}) ` + legendLabel,
    },
    temoin: {
      color: "var(--chart-2)",
      label: `(${t("indicators.common.control")}) ` + legendLabel,
    },
  } satisfies ChartConfig;

  return (
    <ChartComponent title={title}>
      <ChartContainer
        className="mx-auto h-80 max-h-80 w-full max-w-full"
        config={chartConfig}
      >
        <BarChart
          accessibilityLayer
          data={chartData}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="indicator"
            height={90}
            interval={0}
            tick={renderXAxisTick}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            tickMargin={-2}
            width={24}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={false}
          />
          <Bar
            dataKey="benef"
            fill="var(--chart-3)"
            radius={8}
          />

          {withTemoin && (
            <Bar
              dataKey="temoin"
              fill="var(--chart-4)"
              radius={8}
            />
          )}
        </BarChart>
      </ChartContainer>
    </ChartComponent>
  );
};

const renderXAxisTick = ({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: { value: string | number };
}) => (
  <text
    dy={16}
    fill="var(--text-muted)"
    fontSize={10}
    textAnchor="end"
    transform={`rotate(-45 ${x} ${y})`}
    x={x}
    y={y}
  >
    {payload.value}
  </text>
);
