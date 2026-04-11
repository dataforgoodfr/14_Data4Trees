import type { FC } from "react";
import { PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

import { useTranslation } from "@shared/i18n";

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
import { PolarAngleAxisMultiline } from "./polar-angle-axis-multi";

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
            <PolarAngleAxisMultiline dataKey="indicator" />
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
