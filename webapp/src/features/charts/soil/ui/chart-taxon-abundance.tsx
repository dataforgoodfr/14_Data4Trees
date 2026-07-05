import type { Data as PlotlyData } from "plotly.js";
import { useEffect, useRef } from "react";
import Plot from "react-plotly.js";

import {
  ChartComponent,
  type ChartComponentType,
} from "@features/charts/components/chart-component";

import { i18nInstance, useTranslation } from "@shared/i18n";

import { SUNBURST_LAYOUT } from "../config";
import { buildNodeColors, buildSunburstNodes } from "../lib/sunburst";
import type { PieChartProps, SunburstTrace } from "../types";

export const ChartTaxonAbundance: ChartComponentType<PieChartProps> = ({
  data,
  metadata,
  proj,
}) => {
  const { t } = useTranslation(["common", "all4trees"]);

  const dataEntries = Object.entries(data);
  const hasTaxonData = dataEntries.some(([key]) => key.trim() !== "");
  let sunburstData: PlotlyData[] = [];
  const cardHeight = hasTaxonData ? "min-h-105" : "min-h-40";

  if (hasTaxonData) {
    // Remove taxon entries with "Aucun" value
    const filteredDataEntries = dataEntries.filter(
      ([key]) => key.trim() !== "0",
    );
    const nodes = buildSunburstNodes(filteredDataEntries, metadata, proj);
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

  // Plotly (via react-plotly's `useResizeHandler`) only refits on window
  // resize, so it misses container-only changes such as toggling the popup
  // size. Observe the wrapper and forward those changes as a resize event so
  // the sunburst adapts like the recharts base charts.
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasTaxonData) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    // Use react-plotly's own resize handler (which refits to the container)
    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [hasTaxonData]);

  return (
    <ChartComponent
      className={cardHeight}
      title={t("indicators.common.abundance", { ns: "all4trees" })}
    >
      <div className="flex items-center justify-center">
        {hasTaxonData && (
          // Style - Extend the width to the container, keep a square aspect and
          // stay centered. Limit width to 600px to avoid an oversized chart.
          <div
            className="mx-auto aspect-square h-auto max-h-full w-full max-w-150"
            ref={wrapperRef}
          >
            <Plot
              className="h-full w-full"
              config={{ displayModeBar: false, responsive: true }}
              data={sunburstData}
              layout={SUNBURST_LAYOUT}
              style={{ height: "100%", width: "100%" }}
              useResizeHandler
            />
          </div>
        )}
        {!hasTaxonData && (
          <div
            className="text-muted-foreground opacity-70 text-sm italic pt-5"
            style={{ transform: "rotate(-20deg)" }}
          >
            {t("dataManagement.noData", { ns: "common" })}
          </div>
        )}
      </div>
    </ChartComponent>
  );
};

ChartTaxonAbundance.isChartComponent = true;
