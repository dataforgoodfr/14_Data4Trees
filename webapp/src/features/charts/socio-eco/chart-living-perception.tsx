import type { FC } from "react";

import { useTranslation } from "@shared/i18n";

import { PieChartCategorical } from "../components/pie-chart-categorical";

type PieChartProps = {
  data: {
    improvement: number;
    stable: number;
    regression: number;
    dontKnow: number;
    refuse: number;
  };
};

export const ChartLivingPerception: FC<PieChartProps> = ({ data }) => {
  const { t } = useTranslation("translations");
  const chartData = [
    {
      fill: "var(--chart-4)",
      name: t(
        "indicators.socioEco.sections.economy.livingPerception.improvement",
      ),
      value: data.improvement,
    },
    {
      fill: "var(--chart-3)",
      name: t("indicators.socioEco.sections.economy.livingPerception.stable"),
      value: data.stable,
    },
    {
      fill: "var(--chart-2)",
      name: t(
        "indicators.socioEco.sections.economy.livingPerception.regression",
      ),
      value: data.regression,
    },
    {
      fill: "var(--chart-5)",
      name: t("indicators.socioEco.sections.economy.livingPerception.refuse"),
      value: data.refuse,
    },
    {
      fill: "var(--chart-1)",
      name: t("indicators.socioEco.sections.economy.livingPerception.dontKnow"),
      value: data.dontKnow,
    },
  ];

  return (
    <PieChartCategorical
      chartData={chartData}
      title={t("indicators.socioEco.sections.economy.livingPerception.title")}
    />
  );
};
