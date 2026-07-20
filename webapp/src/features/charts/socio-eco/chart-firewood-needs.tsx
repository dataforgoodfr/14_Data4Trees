import { findLabel } from "@features/indicators/labels";

import type { LabelData } from "@entities/data";

import { i18nInstance, useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

import type { ChartComponentType } from "../components/chart-component";
import {
  PieChartCategorical,
  renderLabel,
} from "../components/pie-chart-categorical";
import { SATISFACTION_COLOR_MAP } from "./constants";

type PieChartProps = {
  project: string;
  metadata: LabelData[];
  data: {
    [key: string]: number;
  };
};

export const ChartFireWoodNeeds: ChartComponentType<PieChartProps> = ({
  data,
  metadata,
  project,
}) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const lang = i18nInstance.language;

  const chartData = Object.entries(data).map(([key, value]) => ({
    fill: SATISFACTION_COLOR_MAP.get(key) || "var(--chart-4)",
    name: key,
    value,
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name as keyof typeof acc] = {
      label:
        findLabel(metadata, project, lang, "satis", item.name) ||
        t("common:dataManagement.undefined"),
    };
    return acc;
  }, {} as ChartConfig) satisfies ChartConfig;

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={t("all4trees:indicators.socioEco.sections.wood.energyNeeds.title")}
      unit="%"
      withLabel={(props) =>
        renderLabel({ ...props, chartConfig, linebreak: 18 })
      }
    />
  );
};

ChartFireWoodNeeds.isChartComponent = true;
