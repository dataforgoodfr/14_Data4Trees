import { findLabel } from "@features/indicators/labels";

import type { LabelData } from "@entities/data";

import { i18nInstance, useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

import type { ChartComponentType } from "./chart-component";
import { PieChartCategorical, renderLabel } from "./pie-chart-categorical";

type LabeledPieChartProps = {
  project: string;
  metadata: LabelData[];
  data: {
    [key: string]: number;
  };
  title: string;
  labelField: string;
  colorMap: Map<string, string>;
};

export const LabeledPieChart: ChartComponentType<LabeledPieChartProps> = ({
  data,
  metadata,
  project,
  title,
  colorMap,
  labelField,
}) => {
  const { t } = useTranslation("common");
  const lang = i18nInstance.language;

  const chartData = Object.entries(data).map(([key, value]) => ({
    fill: colorMap.get(key) || "var(--chart-4)",
    name: key,
    value,
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name as keyof typeof acc] = {
      label:
        findLabel(metadata, project, lang, labelField, item.name) ||
        t("dataManagement.undefined"),
    };
    return acc;
  }, {} as ChartConfig) satisfies ChartConfig;

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={title}
      unit="%"
      withLabel={(props) =>
        renderLabel({ ...props, chartConfig, linebreak: 18 })
      }
    />
  );
};

LabeledPieChart.isChartComponent = true;
