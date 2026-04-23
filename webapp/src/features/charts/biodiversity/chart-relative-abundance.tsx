import type { LayerMetadata } from "node_modules/coordo/coordo-ts/src/types";
import type { FC } from "react";

import { useTranslation } from "@shared/i18n";
import { findCategoricalLabel } from "@shared/lib/utils";

import { PieChartCategorical } from "../components/pie-chart-categorical";

type PieChartProps = {
  data: [string, number][];
  metadata: LayerMetadata;
};

export const ChartRelativeAbundance: FC<PieChartProps> = ({
  data,
  metadata,
}) => {
  console.log("Relative abundance", data);
  const { t } = useTranslation("translations");
  const chartData = data.map((element, index) => ({
    fill: `var(--chart-${(index % 4) + 1})`,
    name: findCategoricalLabel(metadata, "ess_arb", element[0]) || "other",
    value: element[1],
  }));

  console.log("Chart data", chartData);
  return (
    <PieChartCategorical
      chartData={chartData}
      title={t(
        "indicators.biodiversity.sections.treeDiversity.relativeAbundance",
      )}
    />
  );
};
