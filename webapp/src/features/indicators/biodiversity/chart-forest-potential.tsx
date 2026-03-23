import type { FC } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { useTranslation } from "@i18n";

import { Card, CardContent } from "@ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/chart";

import type { FormattedData } from "./format-data";

const radarConfig = {
  dot: {
    fillOpacity: 1,
    r: 2,
  },
  fillOpacity: 0.5,
  strokeWidth: 2,
} as const;

type ChartForestPotentialProps = {
  data: FormattedData["forestPotentialLevel"];
};

export const ChartForestPotential: FC<ChartForestPotentialProps> = ({
  data,
}) => {
  const { t } = useTranslation("translations");
  const { benef, temoin } = data;

  const chartConfig: ChartConfig = {
    benef: {
      color: "var(--chart-1)",
      label: "Benef.", // todo: i18n
    },
    temoin: {
      color: "var(--chart-2)",
      // todo: change name
      label: "Temoin", // todo: i18n
    },
  };

  const chartData: Array<{ indicator: string; benef: number; temoin: number }> =
    [
      {
        benef: benef.density,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.density",
        ),
        temoin: temoin.density,
      },
      {
        benef: benef.diversity,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.diversity",
        ),
        temoin: temoin.diversity,
      },
      {
        benef: benef.diameterDistribution,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.diameterDistribution",
        ),
        temoin: temoin.diameterDistribution,
      },
      {
        benef: benef.masterHeight,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.masterHeight",
        ),
        temoin: temoin.masterHeight,
      },
      {
        benef: benef.microhabitat,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.microhabitat",
        ),
        temoin: temoin.microhabitat,
      },
      {
        benef: benef.ratioDeathmassBiomass,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.ratioDeathmassBiomass",
        ),
        temoin: temoin.ratioDeathmassBiomass,
      },
      {
        benef: benef.spatialDistribution,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.spatialDistribution",
        ),
        temoin: temoin.spatialDistribution,
      },
      {
        benef: benef.verticalDistribution,
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.verticalDistribution",
        ),
        temoin: temoin.verticalDistribution,
      },
    ];

  return (
    <Card>
      <CardContent className="p-2 mx-2">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
          config={chartConfig}
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={true}
            />
            <PolarAngleAxis dataKey="indicator" />
            <PolarGrid radialLines={true} />
            <Radar
              dataKey="benef"
              fill="var(--color-benef)"
              stroke="var(--color-benef)"
              {...radarConfig}
            />
            <Radar
              dataKey="temoin"
              fill="var(--color-temoin)"
              stroke="var(--color-temoin)"
              {...radarConfig}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
