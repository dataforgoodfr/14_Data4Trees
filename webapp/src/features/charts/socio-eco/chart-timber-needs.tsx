import type { FC } from "react";

import { useTranslation } from "@shared/i18n";

import { PieChartCategorical } from "../components/pie-chart-categorical";

type PieChartProps = {
  data: {
    easyToMeet: number;
    moderateToMeet: number;
    difficultToMeet: number;
    dontKnow: number;
  };
};

export const ChartTimberNeeds: FC<PieChartProps> = ({ data }) => {
  const { t } = useTranslation("translations");
  const chartData = [
    {
      fill: "var(--chart-4)",
      name: t("indicators.socioEco.sections.wood.timberNeeds.easyToMeet"),
      value: data.easyToMeet,
    },
    {
      fill: "var(--chart-3)",
      name: t(
        "indicators.socioEco.sections.wood.timberNeeds.moderateToMeet",
      ),
      value: data.moderateToMeet,
    },
    {
      fill: "var(--chart-2)",
      name: t(
        "indicators.socioEco.sections.wood.timberNeeds.difficultToMeet",
      ),
      value: data.difficultToMeet,
    },
    {
      fill: "var(--chart-1)",
      name: t("indicators.socioEco.sections.wood.timberNeeds.dontKnow"),
      value: data.dontKnow,
    },
  ];

  return (
    <PieChartCategorical
      chartData={chartData}
      title={t("indicators.socioEco.sections.wood.timberNeeds.title")}
    />
  );
};
