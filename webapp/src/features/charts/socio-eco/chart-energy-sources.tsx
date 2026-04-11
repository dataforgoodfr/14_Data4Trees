import type { FC } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useTranslation } from "@shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@shared/ui/chart";

type BarChartProps = {
  data: {
    collectedWood: number;
    boughtWood: number;
    coal: number;
    organicWaste: number;
    animalWaste: number;
    gas: number;
    other: number;
  };
};

export const ChartEnergySources: FC<BarChartProps> = ({ data }) => {
  const { t } = useTranslation("translations");

  const chartConfig = {
    value: {
      color: "var(--chart-1)",
      label: t("indicators.socio-eco.sections.wood.energySources.legend"),
    },
  } satisfies ChartConfig;

  const chartData = [
    {
      name: t("indicators.socio-eco.sections.wood.energySources.collectedWood"),
      value: data.collectedWood,
    },
    {
      name: t("indicators.socio-eco.sections.wood.energySources.boughtWood"),
      value: data.boughtWood,
    },
    {
      name: t("indicators.socio-eco.sections.wood.energySources.coal"),
      value: data.coal,
    },
    {
      name: t("indicators.socio-eco.sections.wood.energySources.organicWaste"),
      value: data.organicWaste,
    },
    {
      name: t("indicators.socio-eco.sections.wood.energySources.animalWaste"),
      value: data.animalWaste,
    },
    {
      name: t("indicators.socio-eco.sections.wood.energySources.gas"),
      value: data.gas,
    },
    {
      name: t("indicators.socio-eco.sections.wood.energySources.other"),
      value: data.other,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("indicators.socio-eco.sections.wood.energySources.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          className="mx-auto max-h-62.5"
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="name"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
            />
            <Bar
              dataKey="value"
              fill="var(--chart-3)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
