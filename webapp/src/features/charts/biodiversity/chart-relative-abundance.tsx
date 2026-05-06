import type { LayerMetadata } from "node_modules/coordo/coordo-ts/src/types";
import type { FC } from "react";

import { useTranslation } from "@shared/i18n";
import { findCategoricalLabel, precise } from "@shared/lib/utils";
import type { ChartConfig } from "@shared/ui/chart";

import { PieChartCategorical } from "../components/pie-chart-categorical";

type PieChartProps = {
  data: [string, number][];
  metadata: LayerMetadata;
};

export const ChartRelativeAbundance: FC<PieChartProps> = ({
  data,
  metadata,
}) => {
  const { t } = useTranslation("translations");
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
          findCategoricalLabel(metadata, "ess_arb", element.name) ||
          element.name,
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
