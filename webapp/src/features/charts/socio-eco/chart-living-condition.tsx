import { useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

import type { ChartComponentType } from "../components/chart-component";
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

export const ChartLivingCondition: ChartComponentType<PieChartProps> = ({
  data,
}) => {
  const { t } = useTranslation("all4trees");
  const chartData = [
    {
      fill: "var(--chart-1)",
      name: "improvement",
      value: data.improvement,
    },
    {
      fill: "var(--chart-3)",
      name: "stable",
      value: data.stable,
    },
    {
      fill: "var(--chart-5)",
      name: "regression",
      value: data.regression,
    },
    {
      fill: "var(--chart-6)",
      name: "refuse",
      value: data.refuse,
    },
    {
      fill: "var(--chart-2)",
      name: "dontKnow",
      value: data.dontKnow,
    },
  ];

  const chartConfig = {
    dontKnow: {
      label: t(
        "indicators.socioEco.sections.economy.livingPerception.dontKnow",
      ),
    },
    improvement: {
      label: t(
        "indicators.socioEco.sections.economy.livingPerception.improvement",
      ),
    },
    refuse: {
      label: t("indicators.socioEco.sections.economy.livingPerception.refuse"),
    },
    regression: {
      label: t(
        "indicators.socioEco.sections.economy.livingPerception.regression",
      ),
    },
    stable: {
      label: t("indicators.socioEco.sections.economy.livingPerception.stable"),
    },
  } satisfies ChartConfig;

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={t("indicators.socioEco.sections.economy.livingPerception.title")}
      unit="%"
      withLabel
    />
  );
};

ChartLivingCondition.isChartComponent = true;
