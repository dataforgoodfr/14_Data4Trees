import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent } from "@ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@ui/chart";
import type { FC } from "react";
import { useTranslation } from "@i18n";
import type { FormattedData } from "./format-data";

const radarConfig = {
  fillOpacity: 0.5,
  strokeWidth: 2,
  dot: {
    r: 2,
    fillOpacity: 1,
  },
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
      label: "Benef.", // todo: i18n
      color: "var(--chart-1)",
    },
    temoin: {
      // todo: change name
      label: "Temoin", // todo: i18n
      color: "var(--chart-2)",
    },
  };

  const chartData: Array<{ indicator: string; benef: number; temoin: number }> =
    [
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.density",
        ),
        benef: benef.density,
        temoin: temoin.density,
      },
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.diversity",
        ),
        benef: benef.diversity,
        temoin: temoin.diversity,
      },
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.diameterDistribution",
        ),
        benef: benef.diameterDistribution,
        temoin: temoin.diameterDistribution,
      },
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.masterHeight",
        ),
        benef: benef.masterHeight,
        temoin: temoin.masterHeight,
      },
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.microhabitat",
        ),
        benef: benef.microhabitat,
        temoin: temoin.microhabitat,
      },
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.ratioDeathmassBiomass",
        ),
        benef: benef.ratioDeathmassBiomass,
        temoin: temoin.ratioDeathmassBiomass,
      },
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.spatialDistribution",
        ),
        benef: benef.spatialDistribution,
        temoin: temoin.spatialDistribution,
      },
      {
        indicator: t(
          "indicators.biodiversity.sections.forestPotentialLevel.verticalDistribution",
        ),
        benef: benef.verticalDistribution,
        temoin: temoin.verticalDistribution,
      },
    ];

  return (
    <Card>
      <CardContent className="p-2 mx-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
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
