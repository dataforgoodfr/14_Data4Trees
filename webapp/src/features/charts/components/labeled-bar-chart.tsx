import { findLabel } from "@features/indicators/labels";

import type { LabelData } from "@entities/data";

import { i18nInstance, useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "./bar-chart-benef-control";
import type { ChartComponentType } from "./chart-component";

type Data = {
  [key: string]: number;
};

type LabeledBarChartProps = {
  benef: Data;
  temoin?: Data;
  metadata: LabelData[];
  project: string;
  labelField: string;
  title: string;
  legendLabel: string;
};

export const LabeledBarChart: ChartComponentType<LabeledBarChartProps> = ({
  benef,
  temoin,
  metadata,
  project,
  labelField,
  legendLabel,
  title,
}) => {
  const { t } = useTranslation("common");
  const lang = i18nInstance.language;

  const chartData = Object.entries(benef).map(([key, value]) => ({
    benef: value,
    indicator:
      findLabel(metadata, project, lang, labelField, key) ||
      t("dataManagement.undefined"),
    temoin: temoin?.[key as keyof typeof temoin],
  }));

  return (
    <BarCharWithBenefAndControl
      chartData={chartData}
      legendLabel={legendLabel}
      title={title}
      unit="%"
      withTemoin={!!temoin}
    />
  );
};

LabeledBarChart.isChartComponent = true;
