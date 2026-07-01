import { findLabelInExternalData } from "@features/indicators/utils";
import type { ExternalData } from "@features/popup/forest-inventory/types";

import { useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

import type { ChartComponentType } from "../components/chart-component";
import { PieChartCategorical } from "../components/pie-chart-categorical";

type PieChartProps = {
  project: string;
  data: Record<string, number>;
  externalData: ExternalData;
};

export const ChartRelativeAbundance: ChartComponentType<PieChartProps> = ({
  project,
  data,
  externalData,
}) => {
  const { t } = useTranslation("all4trees");
  const smallCategoriesSum = Object.values(data)
    .filter((value) => value < 5)
    .reduce((acc, value) => acc + value, 0);
  const chartData = Object.entries(data)
    .filter(
      ([name, value]) =>
        name !== "0" && (Object.keys(data).length < 6 || value >= 5),
    )
    .map(([name, value], index) => ({
      fill: `var(--chart-${(index % 5) + 1})`,
      name,
      value,
    }));

  let chartConfig: ChartConfig = {};
  chartData.forEach((element) => {
    chartConfig = {
      ...chartConfig,
      [element.name]: {
        label:
          findLabelInExternalData(
            externalData,
            "for_label",
            project,
            "ess",
            Number(element.name),
          ) || element.name,
      },
      other: {
        label: t(
          "indicators.biodiversity.sections.treeDiversity.relativeAbundance.other",
        ),
      },
    };
  });

  if (data.length >= 6 && smallCategoriesSum > 0) {
    chartData.push({
      fill: `var(--chart-6)`,
      name: "other",
      value: smallCategoriesSum,
    });
  }

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={t(
        "indicators.biodiversity.sections.treeDiversity.relativeAbundance.title",
      )}
      unit="%"
      withLabel
    />
  );
};

ChartRelativeAbundance.isChartComponent = true;
