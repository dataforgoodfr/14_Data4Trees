import type { FC } from "react";

import { useTranslation } from "@shared/i18n";
import { BarChart } from "recharts";

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
      label: t("indicators.socio-eco.sections.wood.energySources.collectedWood"),
      value: data.collectedWood,
      color: "var(--chart-1)",
    },
    {
      label: t("indicators.socio-eco.sections.wood.energySources.boughtWood"),
      value: data.boughtWood,
      color: "var(--chart-2)",
    },
    {
      label: t("indicators.socio-eco.sections.wood.energySources.coal"),
      value: data.coal,
      color: "var(--chart-3)",
    },
    {
      label: t("indicators.socio-eco.sections.wood.energySources.organicWaste"),
      value: data.organicWaste,
      color: "var(--chart-4)",
    },
    {
      label: t("indicators.socio-eco.sections.wood.energySources.animalWaste"),
      value: data.animalWaste,
      color: "var(--chart-5)",
    },
    {
      label: t("indicators.socio-eco.sections.wood.energySources.gas"),
      value: data.gas,
      color: "var(--chart-6)",
    },
    {
      label: t("indicators.socio-eco.sections.wood.energySources.other"),
      value: data.other,
      color: "var(--chart-7)",
    }
  ];

  return (
    <BarChart
      data={chartData}
    />
  );
};
