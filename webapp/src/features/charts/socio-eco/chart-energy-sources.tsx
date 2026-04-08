import type { FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTranslation } from "@shared/i18n";

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

  console.log("Chart data for energy sources:", chartData);
  return (
    <div className="flex flex-col justify-between gap-sm flex-1">
      <p className="text-muted-foreground">
        {t("indicators.socio-eco.sections.wood.energySources.title")}
      </p>
      <ResponsiveContainer
        height={300}
        width="100%"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          height={300}
          margin={{
            bottom: 5,
            left: 0,
            right: 0,
            top: 5,
          }}
          width="100%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            fill="var(--chart-1)"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
