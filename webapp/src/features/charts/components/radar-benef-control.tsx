import type { FC } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import { useTranslation } from "@shared/i18n";

const wrapPolarLabel = (label: string, maxChars = 14) => {
  const words = label.split(" ");
  const lines: string[] = [];
  const nbLines = Math.ceil(label.length / maxChars);
  const avgLineLength = label.length / nbLines;
  let currentLine = "";

  for (const word of words) {
    const next = currentLine ? `${currentLine} ${word}` : word;
    if (next.length < avgLineLength || lines.length === nbLines - 1) {
      currentLine = next;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
};

const renderPolarAngleTick = ({ payload, x, y, textAnchor }: any) => {
  const label = String(payload?.value ?? "");
  const lines = wrapPolarLabel(label);

  return (
    <text
      fill="#9c9798"
      fontSize={12}
      textAnchor={textAnchor}
      x={x}
      y={y}
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

import { Card, CardContent, CardDescription, CardHeader } from "@ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/chart";

import { RADAR_CONFIG } from "../constants";

type ChartRadarWithBenefAndControlProps = {
  title: string;
  withTemoin?: boolean;
  chartData: Array<{ indicator: string; benef: unknown; temoin?: unknown }>;
};

export const ChartRadarWithBenefAndControl: FC<
  ChartRadarWithBenefAndControlProps
> = ({ chartData, title, withTemoin }) => {
  const { t } = useTranslation("translations");

  const chartConfig: ChartConfig = {
    benef: {
      color: "var(--chart-1)",
      label: t("indicators.common.beneficiary"),
    },
    temoin: {
      color: "var(--chart-4)",
      label: t("indicators.common.control"),
    },
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-100"
          config={chartConfig}
        >
          <RadarChart
            data={chartData}
            outerRadius="70%"
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
              <Radar
                dataKey="temoin"
                fill="var(--color-temoin)"
                stroke="var(--color-temoin)"
                {...RADAR_CONFIG}
              />
            )}

            {withTemoin && (
              <ChartLegend
                className="mt-md"
                content={<ChartLegendContent />}
              />
            )}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
