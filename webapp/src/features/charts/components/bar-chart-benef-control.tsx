import type { PropsWithChildren } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useTranslation } from "@shared/i18n";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@shared/ui/chart";

import type { ChartComponentType } from "./chart-component";
import { ChartComponent } from "./chart-component";

type BarChartProps = PropsWithChildren<{
  title: string;
  chartData: Array<{ indicator: string; benef: unknown; temoin?: unknown }>;
  legendLabel: string;
  unit?: string;
  withTemoin?: boolean;
  layout?: { chartHeight: number; chartXAxisHeight: number };
  description?: string;
}>;

export const BarCharWithBenefAndControl: ChartComponentType<BarChartProps> = ({
  title,
  chartData,
  legendLabel,
  unit = "",
  withTemoin = false,
  description,
  children,
}) => {
  const { t } = useTranslation("all4trees");
  const chartConfig = {
    benef: {
      color: "var(--chart-1)",
      label: `${legendLabel} (${t("indicators.common.beneficiary")})`,
    },
    temoin: {
      color: "var(--chart-3)",
      label: `${legendLabel} (${t("indicators.common.control")})`,
    },
  } satisfies ChartConfig;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const tooltipConfig = chartConfig as Record<
        string,
        { color: string; label: string }
      >;
      const label = tooltipConfig[payload[0].name]?.label || payload[0].name;
      const tooltip = `${payload[0].value}${unit} ${label}`;
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
      {children}
      <ChartContainer
        // Style: Extend the width to the container, but enforce the height for XAxis alignment
        className="mx-auto h-110 max-h-110 w-full max-w-full my-5"
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
            height={130}
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
            content={<CustomTooltip />}
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
