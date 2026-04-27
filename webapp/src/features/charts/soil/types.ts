import type { LayerMetadata } from "coordo";

export type PieChartProps = {
  data: Record<string, number>;
  metadata: LayerMetadata;
  dataType: "tsbf" | "barbA";
};

export type SunburstNode = {
  id: string;
  label: string;
  parent: string;
  value: number;
};

export type SunburstTrace = {
  type: "sunburst";
  branchvalues: "total";
  extendsunburstcolorway: boolean;
  ids: string[];
  labels: string[];
  parents: string[];
  values: number[];
  marker: { colors: string[]; line: { width: number } };
  leaf: { opacity: number };
  sunburstcolorway: string[];
};
