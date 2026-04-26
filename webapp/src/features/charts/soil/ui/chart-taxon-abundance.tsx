import type { Data as PlotlyData } from "plotly.js";
import type { FC } from "react";
import Plot from "react-plotly.js";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

import { SUNBURST_LAYOUT } from "../config";
import { buildNodeColors, buildSunburstNodes } from "../lib/sunburst";
import type { PieChartProps, SunburstTrace } from "../types";

export const ChartTaxonAbundance: FC<PieChartProps> = ({
  data,
  metadata,
  dataType,
}) => {
  const dataEntries = Object.entries(data);
  const hasTaxonData = dataEntries.some(([key]) => key.trim() !== "");

  if (!hasTaxonData) {
    return (
      <Card className="flex flex-col min-h-105">
        <CardHeader className="items-center">
          <CardTitle>Abondance relative</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center">
          <div
            className="text-muted-foreground opacity-70 text-sm italic"
            style={{ transform: "rotate(-20deg)" }}
          >
            Aucune donnée disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const nodes = buildSunburstNodes(dataEntries, metadata, dataType);
  const nodeColors = buildNodeColors(nodes);

  const sunburstData = [
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

  return (
    <Card className="flex flex-col min-h-105">
      <CardHeader className="items-center">
        <CardTitle>Abondance relative</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <Plot
          config={{ displayModeBar: false, responsive: true }}
          data={sunburstData}
          layout={SUNBURST_LAYOUT}
          style={{ height: "100%", width: "100%" }}
        />
      </CardContent>
    </Card>
  );
};
