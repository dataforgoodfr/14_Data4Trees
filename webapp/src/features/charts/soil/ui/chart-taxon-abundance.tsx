import type { Data as PlotlyData } from "plotly.js";
import type { FC } from "react";
import Plot from "react-plotly.js";

import { ChartComponent } from "@features/charts/components/chart-component";

import { useTranslation } from "@shared/i18n";

import { SUNBURST_LAYOUT } from "../config";
import { buildNodeColors, buildSunburstNodes } from "../lib/sunburst";
import type { PieChartProps, SunburstTrace } from "../types";

export const ChartTaxonAbundance: FC<PieChartProps> = ({
  data,
  metadata,
  dataType,
}) => {
  const { t } = useTranslation();
  const dataEntries = Object.entries(data);
  const hasTaxonData = dataEntries.some(([key]) => key.trim() !== "");
  let sunburstData: PlotlyData[] = [];
  const cardHeight = hasTaxonData ? "min-h-105" : "min-h-40";
  if (hasTaxonData) {
    // Remove taxon entries with "Aucun" value
    const filteredDataEntries = dataEntries.filter(
      ([key]) => key.trim() !== "0",
    );
    const nodes = buildSunburstNodes(filteredDataEntries, metadata, dataType);
    const nodeColors = buildNodeColors(nodes);

    sunburstData = [
      {
        branchvalues: "total",
        extendsunburstcolorway: true,
        ids: nodes.map((n) => n.id),
        labels: nodes.map((n) => n.label),
        leaf: { opacity: 0.4 },
        marker: { colors: nodeColors, line: { width: 2 } },
        parents: nodes.map((n) => n.parent),
        sunburstcolorway: nodeColors,
        type: "sunburst",
        values: nodes.map((n) => n.value),
      } as SunburstTrace,
    ] as unknown as PlotlyData[];
  }
  return (
    <ChartComponent
      className={cardHeight}
      title={t("indicators.common.abundance")}
    >
      <div className="flex h-full w-full items-center justify-center">
        {hasTaxonData && (
          <Plot
            config={{ displayModeBar: false, responsive: true }}
            data={sunburstData}
            layout={SUNBURST_LAYOUT}
            style={{ height: "100%", width: "100%" }}
          />
        )}
        {!hasTaxonData && (
          <div
            className="text-muted-foreground opacity-70 text-sm italic"
            style={{ transform: "rotate(-20deg)" }}
          >
            {t("indicators.common.noData")}
          </div>
        )}
      </div>
    </ChartComponent>
  );
};
