import type { LayerMetadata } from "coordo";

import { getChartPalette } from "@shared/lib/palette";

import type { SunburstNode } from "../types";
import { formatTaxonLevelLabel } from "./taxon";

export function buildSunburstNodes(
  dataEntries: [string, number][],
  metadata: LayerMetadata,
  dataType: "tsbf" | "barbA",
): SunburstNode[] {
  const nodes: SunburstNode[] = [];
  const seen = new Set<string>();

  for (const [key, value] of dataEntries) {
    const parts = key.split("-");
    nodes.push({
      id: key,
      label: formatTaxonLevelLabel(key, metadata, dataType),
      parent: parts.slice(0, -1).join("-") || "",
      value,
    });
    seen.add(key);

    for (let i = 0; i < parts.length - 1; i++) {
      const parentPath = parts.slice(0, i + 1).join("-");
      if (!seen.has(parentPath)) {
        nodes.push({
          id: parentPath,
          label: formatTaxonLevelLabel(parentPath, metadata, dataType),
          parent: parts.slice(0, i).join("-") || "",
          value: 0,
        });
        seen.add(parentPath);
      }
    }
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  nodes.forEach((node) => {
    if (node.parent) {
      const parent = nodeMap.get(node.parent);
      if (parent) parent.value += node.value;
    }
  });

  return nodes;
}

export const getLevelPalettes = () => {
  const palette = getChartPalette();

  return [
    palette.slice(0, 3),
    [palette[3], palette[4], palette[0]],
    [palette[1], palette[2], palette[3]],
  ];
};

export function buildNodeColors(nodes: SunburstNode[]) {
  const palettes = getLevelPalettes();
  return nodes.map((node, index) => {
    const depth = node.id.split("-").length;
    const palette = palettes[depth - 1] ?? palettes[0];
    return palette[index % palette.length];
  });
}
