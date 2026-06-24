import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import { useTranslation } from "@shared/i18n";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/chart";

import { RADAR_CONFIG } from "../constants";
import { lineBreakLabel } from "../utils";
import type { ChartComponentType } from "./chart-component";
import { ChartComponent } from "./chart-component";

type ChartRadarWithBenefAndControlProps = {
  title: string;
  withTemoin?: boolean;
  chartData: Array<{ indicator: string; benef: unknown; temoin?: unknown }>;
};

export const ChartRadarWithBenefAndControl: ChartComponentType<
  ChartRadarWithBenefAndControlProps
> = ({ chartData, title, withTemoin }) => {
  const { t } = useTranslation("all4trees");

  const chartConfig: ChartConfig = {
    benef: {
      color: "var(--chart-1)",
      label: t("indicators.common.beneficiary"),
    },
    temoin: {
      color: "var(--chart-3)",
      label: t("indicators.common.control"),
    },
  };

  return (
    <ChartComponent title={title}>
      <ChartContainer
        // Style - Extend the width to the container, make aspect square with h auto to equal h and w
        // But limit width to 600px to avoid height > 600px (the chard wouldn't fit in the screen)
        className="mx-auto aspect-square max-h-full h-auto max-w-150 w-full"
        config={chartConfig}
      >
        <RadarChart
          data={chartData}
          outerRadius="68%"
        >
          <ChartTooltip
            content={<ChartTooltipContent indicator="line" />}
            cursor={true}
          />
          <PolarRadiusAxis
            domain={[0, 10]}
            tickCount={6}
          />
          <PolarAngleAxis
            dataKey="indicator"
            tick={renderPolarAngleTick}
          />
          <PolarGrid radialLines />
          <Radar
            dataKey="benef"
            fill="var(--color-benef)"
            stroke="var(--color-benef)"
            {...RADAR_CONFIG}
          />
          {withTemoin && (
            <>
              <Radar
                dataKey="temoin"
                fill="var(--color-temoin)"
                stroke="var(--color-temoin)"
                {...RADAR_CONFIG}
              />

              <ChartLegend
                className="mt-md"
                content={<ChartLegendContent />}
              />
            </>
          )}
        </RadarChart>
      </ChartContainer>
    </ChartComponent>
  );
};

ChartRadarWithBenefAndControl.isChartComponent = true;

const renderPolarAngleTick = ({ payload, x, y, textAnchor }: any) => {
  const label = String(payload?.value ?? "");
  const lines = lineBreakLabel(label);
  const verticalOffset = computeVerticalOffset(textAnchor, y);

  return (
    <text
      fill="var(--foreground)"
      fontSize={12}
      textAnchor={textAnchor}
      x={x}
      y={y + verticalOffset}
    >
      {lines.map((line, index) => (
        <tspan
          dy={index === 0 ? 0 : 16}
          // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
          key={index}
          x={x}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
};

function computeVerticalOffset(textAnchor: string, y: number) {
  if (textAnchor === "middle") {
    return y < 80 ? -15 : 15;
  }
  return 0;
}
