import type { LabelData } from "@features/popup/forest-inventory/types";

export type PieChartProps = {
  data: Record<string, number>;
  metadata: LabelData[];
  project: string;
};

export type SunburstNode = {
  id: string;
  label: string;
  parent: string;
  value: number;
  depth: number;
};

export type SunburstTrace = {
  type: "sunburst";
  branchvalues: "total";
  extendsunburstcolorway: boolean;
  hoverinfo?: string;
  hovertext?: string[];
  ids: string[];
  labels: string[];
  parents: string[];
  values: number[];
  marker: { colors: string[]; line: { width: number; color: string } };
  leaf: { opacity: number };
  sunburstcolorway: string[];
};
