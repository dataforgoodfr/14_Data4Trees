import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useTranslation } from "@shared/i18n";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@shared/ui/chart";

import type { ChartComponentType } from "./chart-component";
import { ChartComponent } from "./chart-component";

type BarChartProps = {
  title: string;
  chartData: Array<{ indicator: string; benef: unknown; temoin?: unknown }>;
  legendLabel: string;
  withTemoin?: boolean;
  layout?: { chartHeight: number; chartXAxisHeight: number };
};

export const BarCharWithBenefAndControl: ChartComponentType<BarChartProps> = ({
  title,
  chartData,
  legendLabel,
  withTemoin = false,
}) => {
  const { t } = useTranslation("all4trees");
  const chartConfig = {
    benef: {
      color: "var(--chart-1)",
      label: `(${t("indicators.common.beneficiary")}) ` + legendLabel,
    },
    temoin: {
      color: "var(--chart-3)",
      label: `(${t("indicators.common.control")}) ` + legendLabel,
    },
  } satisfies ChartConfig;

  return (
    <ChartComponent title={title}>
      <ChartContainer
        // Style: Extend the width to the container, but enforce the height for XAxis alignment
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
            fill="var(--color-benef)"
            radius={8}
          />

          {withTemoin && (
            <Bar
              dataKey="temoin"
              fill="var(--color-temoin)"
              radius={8}
            />
          )}
        </BarChart>
      </ChartContainer>
    </ChartComponent>
  );
};

BarCharWithBenefAndControl.isChartComponent = true;

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
    fontSize={10}
    textAnchor="end"
    transform={`rotate(-45 ${x} ${y})`}
    x={x}
    y={y}
  >
    {payload.value}
  </text>
);
