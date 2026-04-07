import type { FC } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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

  console.log("chartConfig", chartConfig);
  console.log("chartData", chartData);
  return (
    <Card>
      <CardHeader className="items-center">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-62.5"
          config={chartConfig}
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={true}
            />
            <PolarAngleAxis dataKey="indicator" />
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
                content={<ChartLegendContent payload={undefined} />}
              />
            )}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
