import type { LayerMetadata } from "node_modules/coordo/coordo-ts/src/types";
import type { FC } from "react";

import { useTranslation } from "@shared/i18n";
import { findCategoricalLabel } from "@shared/lib/utils";
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
  const chartData = data.map((element, index) => ({
    fill: `var(--chart-${(index % 4) + 1})`,
    name: element[0],
    value: element[1],
  }));

  let chartConfig: ChartConfig = {};
  data.forEach((element) => {
    chartConfig = {
      ...chartConfig,
      [element[0]]: {
        label:
          findCategoricalLabel(metadata, "ess_arb", element[0]) ||
          t(
            "indicators.biodiversity.sections.treeDiversity.relativeAbundance.other",
          ),
      },
    };
  });

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={t(
        "indicators.biodiversity.sections.treeDiversity.relativeAbundance.title",
      )}
      withLabel
    />
  );
};
