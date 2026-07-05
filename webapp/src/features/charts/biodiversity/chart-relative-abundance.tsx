import { findLabelInExternalData } from "@features/indicators/utils";
import type { ExternalData } from "@features/popup/forest-inventory/types";

import { useTranslation } from "@shared/i18n";
import { precise } from "@shared/lib/utils";
import type { ChartConfig } from "@shared/ui/chart";

import type { ChartComponentType } from "../components/chart-component";
import { PieChartCategorical } from "../components/pie-chart-categorical";

type PieChartProps = {
  proj: string;
  data: [string, number][];
  externalData: ExternalData;
};

export const ChartRelativeAbundance: ChartComponentType<PieChartProps> = ({
  proj,
  data,
  externalData,
}) => {
  const { t } = useTranslation("all4trees");
  const smallCategoriesSum = Number(
    precise(
      data
        .filter(([_, value]) => value < 5)
        .reduce((acc, [_, value]) => acc + value, 0),
    ),
  );
  const chartData = data
    .filter(([name, value]) => name !== "0" && (data.length < 6 || value >= 5))
    .map((element, index) => ({
      fill: `var(--chart-${(index % 5) + 1})`,
      name: element[0],
      value: element[1],
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
            proj,
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
