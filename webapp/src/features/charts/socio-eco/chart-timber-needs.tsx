import type { FC } from "react";

import { useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

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
      name: "easyToMeet",
      value: data.easyToMeet,
    },
    {
      fill: "var(--chart-3)",
      name: "moderateToMeet",
      value: data.moderateToMeet,
    },
    {
      fill: "var(--chart-2)",
      name: "difficultToMeet",
      value: data.difficultToMeet,
    },
    {
      fill: "var(--chart-1)",
      name: "dontKnow",
      value: data.dontKnow,
    },
  ];

  const chartConfig = {
    difficultToMeet: {
      label: t("indicators.socioEco.sections.wood.needs.difficultToMeet"),
    },
    dontKnow: {
      label: t("indicators.socioEco.sections.wood.needs.dontKnow"),
    },
    easyToMeet: {
      label: t("indicators.socioEco.sections.wood.needs.easyToMeet"),
    },
    moderateToMeet: {
      label: t("indicators.socioEco.sections.wood.needs.moderateToMeet"),
    },
  } satisfies ChartConfig;

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={t("indicators.socioEco.sections.wood.timberNeeds.title")}
      unit="%"
      withLabel
    />
  );
};
